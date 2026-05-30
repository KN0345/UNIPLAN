import { neon } from '@neondatabase/serverless'

const ADMIN_STUDENT_IDS = new Set(['414730209'])
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: jsonHeaders })
}

function error(message, status = 400) {
  return json({ ok: false, error: message }, status)
}

function normalizeStudentId(value) {
  return String(value || '').trim()
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

async function readBody(request) {
  const text = await request.text()
  if (!text) return {}
  try { return JSON.parse(text) } catch { return {} }
}

function base64UrlEncode(input) {
  const bytes = input instanceof Uint8Array ? input : new TextEncoder().encode(String(input))
  let binary = ''
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlDecode(input) {
  const normalized = String(input || '').replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4)
  const binary = atob(padded)
  return new Uint8Array([...binary].map((ch) => ch.charCodeAt(0)))
}

async function hmacSha256(secret, data) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return new Uint8Array(signature)
}

async function signToken(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const body = { ...payload, iat: now, exp: now + TOKEN_TTL_SECONDS }
  const unsigned = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(body))}`
  const signature = await hmacSha256(secret, unsigned)
  return `${unsigned}.${base64UrlEncode(signature)}`
}

async function verifyToken(token, secret) {
  const [encodedHeader, encodedPayload, encodedSignature] = String(token || '').split('.')
  if (!encodedHeader || !encodedPayload || !encodedSignature) return null
  const unsigned = `${encodedHeader}.${encodedPayload}`
  const expected = base64UrlEncode(await hmacSha256(secret, unsigned))
  if (expected !== encodedSignature) return null
  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(encodedPayload)))
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null
  return payload
}

async function hashPassword(password, salt) {
  const raw = `${salt}:${String(password || '')}`
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))
  return base64UrlEncode(new Uint8Array(digest))
}

function randomSalt() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return base64UrlEncode(bytes)
}

function getSql(env) {
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL 未設定')
  return neon(env.DATABASE_URL)
}

async function ensureSchema(sql) {
  await sql`create extension if not exists pgcrypto`
  await sql`
    create table if not exists users (
      id uuid primary key default gen_random_uuid(),
      student_id varchar(20) unique not null,
      email varchar(255) unique,
      password_hash text not null,
      created_at timestamp default now(),
      last_login timestamp
    )
  `
  await sql`alter table users add column if not exists display_name varchar(100)`
  await sql`alter table users add column if not exists password_salt text`
  await sql`alter table users add column if not exists role text not null default 'student'`
  await sql`alter table users add column if not exists profile jsonb not null default '{}'::jsonb`
  await sql`alter table users add column if not exists google_id text`
  await sql`alter table users add column if not exists email_verified boolean default false`
  await sql`alter table users add column if not exists updated_at timestamp default now()`

  await sql`
    create table if not exists user_settings (
      id uuid primary key default gen_random_uuid(),
      user_id uuid references users(id) on delete cascade,
      theme text,
      accent_color text,
      settings_json jsonb,
      updated_at timestamp default now()
    )
  `
  await sql`
    create table if not exists user_favorites (
      id uuid primary key default gen_random_uuid(),
      user_id uuid references users(id) on delete cascade,
      course_key text not null,
      created_at timestamp default now()
    )
  `
  await sql`
    create table if not exists user_timetables (
      id uuid primary key default gen_random_uuid(),
      user_id uuid references users(id) on delete cascade,
      semester text not null,
      timetable_json jsonb not null,
      updated_at timestamp default now(),
      unique(user_id, semester)
    )
  `
}

function publicUser(row) {
  const studentId = row.student_id
  const role = ADMIN_STUDENT_IDS.has(studentId) ? 'super_admin' : (row.role || 'student')
  return {
    id: row.id,
    studentId,
    student_id: studentId,
    role,
    offline: false,
    localAccount: false,
    cloudAccount: true,
    profile: row.profile || {},
  }
}

function profileFromBody(body = {}) {
  return {
    displayName: body.display_name || body.displayName || '',
    email: normalizeEmail(body.email),
    department: body.department || '',
    grade: body.grade || '',
    admissionYear: String(body.admission_year || body.admissionYear || ''),
    studentStatus: body.student_status || body.studentStatus || '在學',
    boundEmail: Boolean(body.email_bound ?? body.boundEmail ?? body.email),
    boundGoogle: Boolean(body.google_bound ?? body.boundGoogle),
    syncEnabled: Boolean(body.sync_enabled ?? body.syncEnabled ?? true),
  }
}

async function authUser(request, env, sql) {
  const header = request.headers.get('authorization') || ''
  const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : ''
  const payload = await verifyToken(token, env.JWT_SECRET || 'uniplan-dev-secret')
  if (!payload?.uid) return null
  const rows = await sql`select * from users where id = ${payload.uid} limit 1`
  return rows[0] || null
}

async function loadUserBundle(sql, userId) {
  const timetableRows = await sql`select semester, timetable_json, updated_at from user_timetables where user_id = ${userId} order by updated_at desc`
  const favoriteRows = await sql`select course_key from user_favorites where user_id = ${userId} order by created_at desc`
  const settingRows = await sql`select theme, accent_color, settings_json, updated_at from user_settings where user_id = ${userId} order by updated_at desc limit 1`
  const latestPlan = timetableRows[0]?.timetable_json || null
  const settings = settingRows[0]?.settings_json || null
  const favorites = favoriteRows.map((row) => row.course_key)
  return {
    ...(latestPlan || {}),
    plan: latestPlan?.plan || latestPlan || null,
    candidates: latestPlan?.candidates || [],
    favorites,
    snapshots: latestPlan?.snapshots || [],
    localReviews: latestPlan?.localReviews || {},
    tagVotes: latestPlan?.tagVotes || {},
    settings,
    theme: settingRows[0]?.theme || settings?.theme || '',
    accentColor: settingRows[0]?.accent_color || settings?.accentColor || '',
    timetables: timetableRows,
  }
}

async function saveUserBundle(sql, userId, bundle = {}) {
  const semester = String(bundle.semester || bundle.plan?.semester || bundle.currentSemester || 'default')
  await sql`
    insert into user_timetables (user_id, semester, timetable_json, updated_at)
    values (${userId}, ${semester}, ${JSON.stringify(bundle)}, now())
    on conflict (user_id, semester) do update set timetable_json = excluded.timetable_json, updated_at = now()
  `

  if (Array.isArray(bundle.favorites)) {
    await sql`delete from user_favorites where user_id = ${userId}`
    for (const item of bundle.favorites) {
      const key = typeof item === 'string' ? item : (item?.id || item?.code || item?.serial || item?.course_key || JSON.stringify(item))
      if (key) await sql`insert into user_favorites (user_id, course_key) values (${userId}, ${String(key)})`
    }
  }

  const settings = bundle.settings || bundle.appearanceSettings || {}
  if (settings && Object.keys(settings).length) {
    await sql`delete from user_settings where user_id = ${userId}`
    await sql`
      insert into user_settings (user_id, theme, accent_color, settings_json, updated_at)
      values (${userId}, ${settings.theme || bundle.theme || null}, ${settings.accentColor || bundle.accentColor || null}, ${JSON.stringify(settings)}, now())
    `
  }
}

async function handleRegister(request, env, sql) {
  const body = await readBody(request)
  const studentId = normalizeStudentId(body.student_id || body.studentId)
  const password = String(body.password || '')
  if (!/^\d{9}$/.test(studentId)) return error('學號必須為 9 碼數字')
  if (password.length < 6) return error('密碼至少需要 6 碼')
  const exists = await sql`select id from users where student_id = ${studentId} limit 1`
  if (exists.length) return error('此學號已註冊雲端帳號', 409)
  const salt = randomSalt()
  const passwordHash = await hashPassword(password, salt)
  const role = ADMIN_STUDENT_IDS.has(studentId) ? 'super_admin' : 'student'
  const profile = profileFromBody({ ...body, displayName: body.displayName || body.display_name || studentId })
  const rows = await sql`
    insert into users (student_id, email, display_name, password_hash, password_salt, role, profile, updated_at)
    values (${studentId}, ${profile.email || null}, ${profile.displayName || studentId}, ${passwordHash}, ${salt}, ${role}, ${JSON.stringify(profile)}, now())
    returning *
  `
  const user = publicUser(rows[0])
  const token = await signToken({ uid: user.id, sid: studentId }, env.JWT_SECRET || 'uniplan-dev-secret')
  return json({ ok: true, token, user, profile })
}

async function handleLogin(request, env, sql) {
  const body = await readBody(request)
  const studentId = normalizeStudentId(body.student_id || body.studentId)
  const password = String(body.password || '')
  const rows = await sql`select * from users where student_id = ${studentId} limit 1`
  if (!rows.length) return error('找不到此雲端帳號', 404)
  const row = rows[0]
  if (!row.password_salt) return error('此帳號缺少密碼鹽值，請重新註冊或重設密碼', 409)
  const passwordHash = await hashPassword(password, row.password_salt)
  if (passwordHash !== row.password_hash) return error('密碼錯誤', 401)
  await sql`update users set last_login = now(), updated_at = now() where id = ${row.id}`
  const user = publicUser(row)
  const token = await signToken({ uid: user.id, sid: studentId }, env.JWT_SECRET || 'uniplan-dev-secret')
  const data = await loadUserBundle(sql, row.id)
  return json({ ok: true, token, user, profile: row.profile || {}, data })
}

async function handleMe(request, env, sql) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  return json({ ok: true, user: publicUser(row), profile: row.profile || {} })
}

async function handleProfile(request, env, sql) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  const body = await readBody(request)
  const profile = profileFromBody(body)
  const rows = await sql`
    update users
    set email = ${profile.email || null}, display_name = ${profile.displayName || row.student_id}, profile = ${JSON.stringify(profile)}, updated_at = now()
    where id = ${row.id}
    returning *
  `
  return json({ ok: true, user: publicUser(rows[0]), profile })
}

async function handleGetUserData(request, env, sql) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  return json({ ok: true, data: await loadUserBundle(sql, row.id) })
}

async function handlePutUserData(request, env, sql) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  const body = await readBody(request)
  const bundle = body.data || body.bundle || body
  await saveUserBundle(sql, row.id, bundle)
  return json({ ok: true, updated_at: new Date().toISOString() })
}

async function handleSchedule(request, env, sql, method) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  if (method === 'GET') {
    const data = await loadUserBundle(sql, row.id)
    return json({ ok: true, data: data.plan || data })
  }
  const body = await readBody(request)
  const plan = body.schedule_data || body.plan || body
  await saveUserBundle(sql, row.id, { plan })
  return json({ ok: true })
}

async function handleFavorites(request, env, sql, method) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  if (method === 'GET') {
    const rows = await sql`select course_key from user_favorites where user_id = ${row.id} order by created_at desc`
    return json({ ok: true, favorites: rows.map((item) => item.course_key) })
  }
  const body = await readBody(request)
  const favorites = Array.isArray(body.favorites) ? body.favorites : []
  await sql`delete from user_favorites where user_id = ${row.id}`
  for (const key of favorites) if (key) await sql`insert into user_favorites (user_id, course_key) values (${row.id}, ${String(key)})`
  return json({ ok: true })
}

async function handleSettings(request, env, sql, method) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  if (method === 'GET') {
    const rows = await sql`select * from user_settings where user_id = ${row.id} order by updated_at desc limit 1`
    return json({ ok: true, settings: rows[0]?.settings_json || null })
  }
  const body = await readBody(request)
  const settings = body.settings || body
  await sql`delete from user_settings where user_id = ${row.id}`
  await sql`
    insert into user_settings (user_id, theme, accent_color, settings_json, updated_at)
    values (${row.id}, ${settings.theme || null}, ${settings.accentColor || null}, ${JSON.stringify(settings)}, now())
  `
  return json({ ok: true })
}

const TKU_PROGRAMS = { '2': '進學班', '3': '未知學制', '4': '學士生', '6': '碩士生', '7': '碩士在職專班 / 轉入大二', '8': '博士生 / 轉入大三' }
const TKU_IDENTITIES = { '0': '本地生', '1': '本地生', '2': '本地生', '3': '本地生', '4': '陸生', '5': '境外生', '6': '僑、港、澳生 / 身障生', '7': '轉學生（大二轉入）', '8': '轉學生（大三轉入）' }
const TKU_DEPARTMENTS = { '73': ['教育科技學系', '教育學院'], '71': ['教育與未來設計學系', '教育學院'], '77': ['人工智慧學系', 'AI創智學院'] }
function calcCheckDigit(first8) {
  const weights = [1, 2, 1, 2, 1, 2, 1, 2]
  const sum = first8.split('').reduce((total, ch, index) => {
    const product = Number(ch) * weights[index]
    return total + (product >= 10 ? product - 9 : product)
  }, 0)
  return 9 - (sum % 10)
}
function parseStudentIdLocal(studentId) {
  const sid = normalizeStudentId(studentId)
  if (!/^\d{9}$/.test(sid)) return { valid: false, reason: '學號必須為 9 碼數字' }
  const expected = calcCheckDigit(sid.slice(0, 8))
  if (expected !== Number(sid[8])) return { valid: false, reason: `學號檢查碼錯誤，應為 ${expected}` }
  const dept = TKU_DEPARTMENTS[sid.slice(3, 5)] || ['待確認系所', '']
  const yearCode = Number(sid.slice(1, 3))
  const admissionYear = yearCode <= 14 ? yearCode + 100 : yearCode
  return { valid: true, student_id: sid, program_code: sid[0], program_name: TKU_PROGRAMS[sid[0]] || '未知學制', admission_year: admissionYear, admission_ad_year: admissionYear + 1911, department_code: sid.slice(3, 5), department_name: dept[0], college: dept[1], identity_code: sid[5], identity_name: TKU_IDENTITIES[sid[5]] || '未知身分' }
}

export async function onRequest(context) {
  const { request, env, params } = context
  if (request.method === 'OPTIONS') return new Response(null, { headers: jsonHeaders })
  try {
    const sql = getSql(env)
    await ensureSchema(sql)
    const path = `/${(params.path || []).join('/')}`.replace(/\/+/g, '/')
    const method = request.method.toUpperCase()

    if (method === 'POST' && path === '/auth/register') return handleRegister(request, env, sql)
    if (method === 'POST' && path === '/auth/login') return handleLogin(request, env, sql)
    if (method === 'POST' && path === '/auth/logout') return json({ ok: true })
    if (method === 'GET' && path === '/auth/me') return handleMe(request, env, sql)
    if (method === 'PUT' && path === '/auth/profile') return handleProfile(request, env, sql)
    if (method === 'GET' && path === '/user/data') return handleGetUserData(request, env, sql)
    if (method === 'PUT' && path === '/user/data') return handlePutUserData(request, env, sql)
    if (path === '/user/favorites' && ['GET', 'PUT'].includes(method)) return handleFavorites(request, env, sql, method)
    if (path === '/user/settings' && ['GET', 'PUT'].includes(method)) return handleSettings(request, env, sql, method)
    if (method === 'POST' && path === '/schedule') return handleSchedule(request, env, sql, method)
    if (method === 'GET' && path.startsWith('/schedule/')) return handleSchedule(request, env, sql, method)
    if (method === 'GET' && path.startsWith('/student-id/parse/')) return json({ ok: true, data: parseStudentIdLocal(decodeURIComponent(path.slice('/student-id/parse/'.length))) })

    return error(`API route not found: ${method} ${path}`, 404)
  } catch (err) {
    return error(err?.message || 'API 執行失敗', 500)
  }
}
