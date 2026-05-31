import { neon } from '@neondatabase/serverless'

const ADMIN_STUDENT_IDS = new Set(['414730209'])
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30

const PATCHED_COMMON_COURSES = [
  { serial: '1490', code: 'D0778', name: '未來學習與人工智慧 (A班)', credits: 2, category: '必', teacher: '郭盈芝 (169***)', classroom: 'L  110', capacity: '', time_data: [[5, 6, 7]], semester_source: '1141CLASS', grade: '0', major: '', sem_seq: '0', class_name: 'A', group_type: '', time_info: '五 / 6,7', department: 'TGDXB.教育共同科－日', notes: '' },
  { serial: '1491', code: 'D0778', name: '未來學習與人工智慧 (B班)', credits: 2, category: '必', teacher: '郭盈芝 (169***)', classroom: 'L  110', capacity: '', time_data: [[3, 3, 4]], semester_source: '1141CLASS', grade: '0', major: '', sem_seq: '0', class_name: 'B', group_type: '', time_info: '三 / 3,4', department: 'TGDXB.教育共同科－日', notes: '' },
  { serial: '1492', code: 'D0778', name: '未來學習與人工智慧 (C班)', credits: 2, category: '必', teacher: '邱俊達 (160***)', classroom: 'SG 603', capacity: '', time_data: [[4, 7, 8]], semester_source: '1141CLASS', grade: '0', major: '', sem_seq: '0', class_name: 'C', group_type: '', time_info: '四 / 7,8', department: 'TGDXB.教育共同科－日', notes: '以實整虛課程' },
  { serial: '1487', code: 'T2895', name: '愛情關係管理 (A班)', credits: 2, category: '選', teacher: '曾錫慧 (998***)', classroom: '', capacity: '', time_data: [], semester_source: '1141CLASS', grade: '0', major: '', sem_seq: '0', class_name: 'A', group_type: '', time_info: '/', department: 'TGDLM.遠距教學課程－日', notes: '遠距收播中原大學課程，教學計畫表請至遠距中心網頁查詢' },
  { serial: '1488', code: 'T3107', name: '飲食與生態保護 (A班)', credits: 1, category: '選', teacher: '蘇正元 (998***)', classroom: '', capacity: '', time_data: [], semester_source: '1141CLASS', grade: '0', major: '', sem_seq: '0', class_name: 'A', group_type: '', time_info: '/', department: 'TGDLM.遠距教學課程－日', notes: '遠距收播中原大學課程，教學計畫表請至遠距中心網頁查詢' },
  { serial: '1489', code: 'T3159', name: '生機材料解密 (A班)', credits: 1, category: '選', teacher: '陳宸權 (998***)', classroom: '', capacity: '', time_data: [[3, 10, 10]], semester_source: '1141CLASS', grade: '0', major: '', sem_seq: '0', class_name: 'A', group_type: '', time_info: '三 / 10', department: 'TGDLM.遠距教學課程－日', notes: '遠距收播中原大學課程，教學計畫表請至遠距中心網頁查詢' },
  { serial: '3308', code: 'T3208', name: '棒球場上的物理學 (A班)', credits: 2, category: '選', teacher: '李中傑 (998***)', classroom: '', capacity: '20', time_data: [[2, 3, 4]], semester_source: '1141CLASS', grade: '0', major: '', sem_seq: '0', class_name: 'A', group_type: '', time_info: '二 / 3,4', department: 'TGDLM.遠距教學課程－日', notes: '遠距收播實踐大學課程，教學計畫表請至遠距中心網頁查詢' },
  { serial: '3309', code: 'T3258', name: '翻轉人生：新南向 (A班)', credits: 2, category: '選', teacher: '宋玫怡 (998***)', classroom: '', capacity: '5', time_data: [[2, 1, 2]], semester_source: '1141CLASS', grade: '0', major: '', sem_seq: '0', class_name: 'A', group_type: '', time_info: '二 / 1,2', department: 'TGDLM.遠距教學課程－日', notes: '遠距收播實踐大學課程，教學計畫表請至遠距中心網頁查詢' },
  { serial: '3310', code: 'T3307', name: '運統臺灣 (四) (A班)', credits: 1, category: '選', teacher: '包善龍, 李尚林 (998***,998***)', classroom: '', capacity: '5', time_data: [[5, 3, 4]], semester_source: '1141CLASS', grade: '0', major: '', sem_seq: '0', class_name: 'A', group_type: '', time_info: '五 / 3,4', department: 'TGDLM.遠距教學課程－日', notes: '遠距收播元智大學課程，教學計畫表請至遠距中心網頁查詢' },
  { serial: '1374', code: 'D0864', name: 'XR 創客科技在生活上的應用 (A班)', credits: 2, category: '必', teacher: '林逸農 (149***)', classroom: 'L  203', capacity: '', time_data: [[3, 3, 4]], semester_source: '1142CLASS', grade: '0', major: '', sem_seq: '0', class_name: 'A', group_type: 'A', time_info: '三 / 3,4', department: 'TGDHB.榮譽進階專業一教', notes: '榮譽學程進階專業課程，限符合資格者修習' },
  { serial: '1375', code: 'D0865', name: '跨領域人文與數理學習 (A班)', credits: 2, category: '必', teacher: '陳思思 (157***)', classroom: 'ED 501', capacity: '', time_data: [[1, 3, 4]], semester_source: '1142CLASS', grade: '0', major: '', sem_seq: '0', class_name: 'A', group_type: 'A', time_info: '一 / 3,4', department: 'TGDHB.榮譽進階專業一教', notes: '榮譽學程進階專業課程，限符合資格者修習，全英語授課' },
  { serial: '1376', code: 'E3683', name: '創意實踐 (A班)', credits: 2, category: '選', teacher: '廖慶榮 (998***)', classroom: '', capacity: '', time_data: [], semester_source: '1142CLASS', grade: '0', major: '', sem_seq: '0', class_name: 'A', group_type: '', time_info: '/', department: 'TGDLM.遠距教學課程－日', notes: '遠距收播中原大學課程，教學計畫表請至遠距中心網頁查詢' },
  { serial: '1377', code: 'T2895', name: '愛情關係管理 (A班)', credits: 2, category: '選', teacher: '曾錫慧 (998***)', classroom: '', capacity: '', time_data: [], semester_source: '1142CLASS', grade: '0', major: '', sem_seq: '0', class_name: 'A', group_type: '', time_info: '/', department: 'TGDLM.遠距教學課程－日', notes: '遠距收播中原大學課程，教學計畫表請至遠距中心網頁查詢' },
  { serial: '1378', code: 'T3107', name: '飲食與生態保護 (A班)', credits: 1, category: '選', teacher: '蘇正元 (998***)', classroom: '', capacity: '', time_data: [], semester_source: '1142CLASS', grade: '0', major: '', sem_seq: '0', class_name: 'A', group_type: '', time_info: '/', department: 'TGDLM.遠距教學課程－日', notes: '遠距收播中原大學課程，教學計畫表請至遠距中心網頁查詢' },
  { serial: '8227', code: 'D0210', name: '統計方法與應用 (A班)', credits: 3, category: '選', teacher: '張瓊方 (167***)', classroom: 'ED 101', capacity: '', time_data: [[1, 5, 7]], semester_source: '1142CLASS', grade: '0', major: '', sem_seq: '0', class_name: 'A', group_type: '', time_info: '一 / 5,6,7', department: 'TGDXM.教育學院共同一碩', notes: '以實整虛課程' },
  { serial: '8230', code: 'D0037', name: '質化研究 (A班)', credits: 3, category: '選', teacher: '張貴傑, 陳玉樺 (154***,167***)', classroom: 'ED 601', capacity: '', time_data: [[1, 8, 9], [2, 10, 10]], semester_source: '1141CLASS', grade: '0', major: '', sem_seq: '0', class_name: 'A', group_type: '', time_info: '一 / 8,9 二 / 10', department: 'TGDXM.教育學院共同一碩', notes: '' },
]

function patchedCourseKey(course) {
  return `${course.semester_source || ''}:${course.serial || ''}:${course.code || ''}:${course.class_name || ''}:${course.name || ''}`
}

function normalizePatchedCourse(course) {
  return mapCourseRow({ id: patchedCourseKey(course), raw_json: course, ...course })
}

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: jsonHeaders })
}

function error(message, status = 400, extra = {}) {
  return json({ ok: false, error: message, ...extra }, status)
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

function randomResetCode() {
  const bytes = new Uint8Array(4)
  crypto.getRandomValues(bytes)
  const value = ((bytes[0] << 24) >>> 0) + (bytes[1] << 16) + (bytes[2] << 8) + bytes[3]
  return String(value % 1000000).padStart(6, '0')
}

async function sendResetEmail(env, to, code) {
  if (!env.RESEND_API_KEY || !env.RESET_FROM_EMAIL) {
    throw new Error('尚未設定寄信服務，請在 Cloudflare 新增 RESEND_API_KEY 與 RESET_FROM_EMAIL')
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESET_FROM_EMAIL,
      to,
      subject: 'UniPlan 密碼重設驗證碼',
      html: `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.7;color:#10233f"><h2>UniPlan 密碼重設</h2><p>你的驗證碼是：</p><p style="font-size:28px;font-weight:800;letter-spacing:6px">${code}</p><p>此驗證碼 10 分鐘內有效。若不是你本人操作，請忽略這封信。</p></div>`,
    }),
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`寄信失敗：${text || response.status}`)
  }
}


async function sendVerificationEmail(env, to, code) {
  if (!env.RESEND_API_KEY || !env.RESET_FROM_EMAIL) {
    throw new Error('尚未設定寄信服務，請在 Cloudflare 新增 RESEND_API_KEY 與 RESET_FROM_EMAIL')
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESET_FROM_EMAIL,
      to,
      subject: 'UniPlan Email 驗證碼',
      html: `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.7;color:#10233f"><h2>UniPlan Email 驗證</h2><p>你的驗證碼是：</p><p style="font-size:28px;font-weight:800;letter-spacing:6px">${code}</p><p>此驗證碼 10 分鐘內有效。完成驗證後才能登入 UniPlan。</p></div>`,
    }),
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`寄信失敗：${text || response.status}`)
  }
}

function getSql(env) {
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL 未設定')
  return neon(env.DATABASE_URL)
}


async function ensureCourseSchema(sql) {
  await sql`create extension if not exists pgcrypto`
  await sql`
    create table if not exists courses (
      id uuid primary key default gen_random_uuid(),
      semester_source text not null,
      serial text,
      code text,
      name text not null,
      credits numeric,
      category text,
      teacher text,
      classroom text,
      capacity text,
      time_data jsonb,
      time_info text,
      department text,
      grade text,
      major text,
      sem_seq text,
      class_name text,
      group_type text,
      notes text,
      raw_json jsonb not null default '{}'::jsonb,
      created_at timestamp default now(),
      updated_at timestamp default now(),
      unique (semester_source, serial, code, class_name, name)
    )
  `
  await sql`create index if not exists idx_courses_semester_source on courses (semester_source)`
  await sql`create index if not exists idx_courses_department on courses (department)`
  await sql`create index if not exists idx_courses_grade on courses (grade)`
  await sql`create index if not exists idx_courses_code on courses (code)`
  await sql`create index if not exists idx_courses_serial on courses (serial)`
  await sql`create index if not exists idx_courses_name on courses (name)`
}

function parseCourseTimeData(value) {
  if (Array.isArray(value)) return value
  if (!value) return []
  try { return JSON.parse(String(value)) } catch { return [] }
}

function normalizeImportCourse(course = {}, fallbackSemester = '') {
  return {
    semester_source: normalizeCourseCatalogTerm(course.semester_source || course.semester || course.term || fallbackSemester),
    serial: String(course.serial || course.開課序號 || course['開課序號'] || '').trim(),
    code: String(course.code || course.course_code || course.course_id || course.課號 || course['課號'] || '').trim(),
    name: String(course.name || course.course_name || course.課程名稱 || course['課程名稱'] || course.科目名稱 || course['科目名稱'] || '').trim(),
    credits: Number.isFinite(Number(course.credits ?? course.credit ?? course.學分 ?? course['學分'])) ? Number(course.credits ?? course.credit ?? course.學分 ?? course['學分']) : null,
    category: String(course.category || course.required_type || course.必選修 || course['必選修'] || '').trim(),
    teacher: String(course.teacher || course.instructor || course.教師 || course['教師'] || '').trim(),
    classroom: String(course.classroom || course.room || course.教室 || course['教室'] || '').trim(),
    capacity: String(course.capacity || course.人數 || course['人數'] || '').trim(),
    time_data: parseCourseTimeData(course.time_data),
    time_info: String(course.time_info || course.time || course.時間 || course['時間'] || '').trim(),
    department: String(course.department || course.開課系所 || course['開課系所'] || course.系所 || course['系所'] || '').trim(),
    grade: String(course.grade || course.年級 || course['年級'] || '').trim(),
    major: String(course.major || course.class_group || course.班別 || course['班別'] || '').trim(),
    sem_seq: String(course.sem_seq || course.學期序 || course['學期序'] || '').trim(),
    class_name: String(course.class_name || course.className || course.班級 || course['班級'] || '').trim(),
    group_type: String(course.group_type || course.組別 || course['組別'] || '').trim(),
    notes: String(course.notes || course.note || course.備註 || course['備註'] || '').trim(),
    raw_json: course,
  }
}

async function upsertCourseRow(sql, c) {
  await sql`
    insert into courses (
      semester_source, serial, code, name, credits, category, teacher, classroom, capacity,
      time_data, time_info, department, grade, major, sem_seq, class_name, group_type, notes, raw_json, updated_at
    ) values (
      ${c.semester_source}, ${c.serial}, ${c.code}, ${c.name}, ${c.credits}, ${c.category}, ${c.teacher}, ${c.classroom}, ${c.capacity},
      ${JSON.stringify(c.time_data)}::jsonb, ${c.time_info}, ${c.department}, ${c.grade}, ${c.major}, ${c.sem_seq}, ${c.class_name}, ${c.group_type}, ${c.notes}, ${JSON.stringify(c.raw_json)}::jsonb, now()
    )
    on conflict (semester_source, serial, code, class_name, name)
    do update set
      credits = excluded.credits,
      category = excluded.category,
      teacher = excluded.teacher,
      classroom = excluded.classroom,
      capacity = excluded.capacity,
      time_data = excluded.time_data,
      time_info = excluded.time_info,
      department = excluded.department,
      grade = excluded.grade,
      major = excluded.major,
      sem_seq = excluded.sem_seq,
      group_type = excluded.group_type,
      notes = excluded.notes,
      raw_json = excluded.raw_json,
      updated_at = now()
  `
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
  await sql`alter table users add column if not exists verification_code_hash text`
  await sql`alter table users add column if not exists verification_code_salt text`
  await sql`alter table users add column if not exists verification_expires_at timestamp`
  await sql`alter table users add column if not exists verification_attempts integer not null default 0`
  await sql`alter table users add column if not exists reset_code_hash text`
  await sql`alter table users add column if not exists reset_code_salt text`
  await sql`alter table users add column if not exists reset_expires_at timestamp`
  await sql`alter table users add column if not exists reset_attempts integer not null default 0`

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
    emailVerified: Boolean(row.email_verified),
    email: row.email || row.profile?.email || '',
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
  const favoriteKeys = favoriteRows.map((row) => row.course_key)
  const storedFavorites = Array.isArray(latestPlan?.favorites) && latestPlan.favorites.length ? latestPlan.favorites : favoriteKeys
  return {
    ...(latestPlan || {}),
    plan: latestPlan?.plan || latestPlan || null,
    candidates: latestPlan?.candidates || [],
    favorites: storedFavorites,
    favoriteKeys,
    snapshots: latestPlan?.snapshots || [],
    localReviews: latestPlan?.localReviews || {},
    tagVotes: latestPlan?.tagVotes || {},
    settings,
    theme: settingRows[0]?.theme || settings?.theme || '',
    accentColor: settingRows[0]?.accent_color || settings?.accentColor || '',
    timetables: timetableRows,
  }
}

function cloudCourseKey(item) {
  if (typeof item === 'string') return item
  const c = item?.course || item || {}
  const term = String(c.semester_source || c.semester || c.term || '').trim()
  const base = String(c.serial || c.code || c.course_id || c.id || `${c.name || ''}-${c.teacher || ''}-${c.time_info || c.time || ''}`).trim()
  return term && base ? `${term}:${base}` : base
}

async function saveUserBundle(sql, userId, bundle = {}) {
  const semester = String(bundle.semester || bundle.plan?.semester || bundle.currentSemester || 'default')

  // 既有 Neon 表可能沒有 unique(user_id, semester) constraint。
  // 不使用 ON CONFLICT，改成明確 delete + insert，避免 /api/user/data 500 導致課表與收藏完全無法寫入。
  await sql`delete from user_timetables where user_id = ${userId} and semester = ${semester}`
  await sql`
    insert into user_timetables (user_id, semester, timetable_json, updated_at)
    values (${userId}, ${semester}, ${JSON.stringify(bundle)}, now())
  `

  if (Array.isArray(bundle.favorites)) {
    await sql`delete from user_favorites where user_id = ${userId}`
    for (const item of bundle.favorites) {
      const key = cloudCourseKey(item)
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
  const email = normalizeEmail(body.email)
  if (!/^\d{9}$/.test(studentId)) return error('學號必須為 9 碼數字')
  if (!email) return error('請輸入 Email')
  if (password.length < 6) return error('密碼至少需要 6 碼')
  const exists = await sql`select id from users where student_id = ${studentId} or lower(email) = ${email} limit 1`
  if (exists.length) return error('此學號或 Email 已註冊雲端帳號', 409)
  const salt = randomSalt()
  const passwordHash = await hashPassword(password, salt)
  const role = ADMIN_STUDENT_IDS.has(studentId) ? 'super_admin' : 'student'
  const profile = profileFromBody({ ...body, displayName: body.displayName || body.display_name || studentId, email })
  const code = randomResetCode()
  const verificationSalt = randomSalt()
  const verificationHash = await hashPassword(code, verificationSalt)
  await sendVerificationEmail(env, email, code)
  const rows = await sql`
    insert into users (student_id, email, display_name, password_hash, password_salt, role, profile, email_verified, verification_code_hash, verification_code_salt, verification_expires_at, verification_attempts, updated_at)
    values (${studentId}, ${email}, ${profile.displayName || studentId}, ${passwordHash}, ${salt}, ${role}, ${JSON.stringify(profile)}, false, ${verificationHash}, ${verificationSalt}, now() + interval '10 minutes', 0, now())
    returning *
  `
  return json({
    ok: true,
    requiresVerification: true,
    user: { studentId, student_id: studentId, email, emailVerified: false },
    profile,
    message: '帳號已建立，Email 驗證碼已寄出；完成驗證後才能登入',
  })
}

async function handleLogin(request, env, sql) {
  const body = await readBody(request)
  const identifier = normalizeStudentId(body.identifier || body.student_id || body.studentId)
  const password = String(body.password || '')
  const email = normalizeEmail(identifier)
  const rows = identifier.includes('@')
    ? await sql`select * from users where lower(email) = ${email} limit 1`
    : await sql`select * from users where student_id = ${identifier} limit 1`
  if (!rows.length) return error('找不到此雲端帳號', 404)
  const row = rows[0]
  if (!row.password_salt) return error('此帳號缺少密碼鹽值，請重新註冊或重設密碼', 409)
  const passwordHash = await hashPassword(password, row.password_salt)
  if (passwordHash !== row.password_hash) return error('密碼錯誤', 401)
  if (!row.email_verified) return error('此帳號尚未完成 Email 驗證，請先輸入驗證碼或重新寄送驗證信', 403, { code: 'EMAIL_NOT_VERIFIED', studentId: row.student_id, email: row.email })
  await sql`update users set last_login = now(), updated_at = now() where id = ${row.id}`
  const user = publicUser(row)
  const token = await signToken({ uid: user.id, sid: user.studentId }, env.JWT_SECRET || 'uniplan-dev-secret')
  const data = await loadUserBundle(sql, row.id)
  return json({ ok: true, token, user, profile: row.profile || {}, data })
}



async function handleVerifyEmail(request, env, sql) {
  const body = await readBody(request)
  const studentId = normalizeStudentId(body.student_id || body.studentId)
  const email = normalizeEmail(body.email)
  const code = String(body.code || body.verificationCode || '').trim()
  if (!/^\d{9}$/.test(studentId)) return error('學號必須為 9 碼數字')
  if (!email) return error('請輸入註冊 Email')
  if (!/^\d{6}$/.test(code)) return error('驗證碼必須為 6 碼數字')
  const rows = await sql`select * from users where student_id = ${studentId} and lower(email) = ${email} limit 1`
  if (!rows.length) return error('找不到符合的帳號與 Email', 404)
  const row = rows[0]
  if (row.email_verified) {
    const user = publicUser(row)
    const token = await signToken({ uid: user.id, sid: user.studentId }, env.JWT_SECRET || 'uniplan-dev-secret')
    const data = await loadUserBundle(sql, row.id)
    return json({ ok: true, token, user, profile: row.profile || {}, data, message: 'Email 已完成驗證' })
  }
  if (!row.verification_code_hash || !row.verification_code_salt || !row.verification_expires_at) return error('尚未申請 Email 驗證碼', 400)
  if (new Date(row.verification_expires_at).getTime() < Date.now()) return error('驗證碼已過期，請重新寄送', 400)
  if ((row.verification_attempts || 0) >= 5) return error('驗證碼錯誤次數過多，請重新寄送', 429)
  const codeHash = await hashPassword(code, row.verification_code_salt)
  if (codeHash !== row.verification_code_hash) {
    await sql`update users set verification_attempts = coalesce(verification_attempts, 0) + 1 where id = ${row.id}`
    return error('驗證碼錯誤', 401)
  }
  const verifiedRows = await sql`
    update users
    set email_verified = true, verification_code_hash = null, verification_code_salt = null, verification_expires_at = null, verification_attempts = 0, last_login = now(), updated_at = now()
    where id = ${row.id}
    returning *
  `
  const user = publicUser(verifiedRows[0])
  const token = await signToken({ uid: user.id, sid: user.studentId }, env.JWT_SECRET || 'uniplan-dev-secret')
  const data = await loadUserBundle(sql, row.id)
  return json({ ok: true, token, user, profile: verifiedRows[0].profile || {}, data, message: 'Email 驗證完成，已登入 UniPlan' })
}

async function handleResendVerification(request, env, sql) {
  const body = await readBody(request)
  const studentId = normalizeStudentId(body.student_id || body.studentId)
  const email = normalizeEmail(body.email)
  if (!/^\d{9}$/.test(studentId)) return error('學號必須為 9 碼數字')
  if (!email) return error('請輸入註冊 Email')
  const rows = await sql`select * from users where student_id = ${studentId} and lower(email) = ${email} limit 1`
  if (!rows.length) return error('找不到符合的帳號與 Email', 404)
  const row = rows[0]
  if (row.email_verified) return json({ ok: true, message: '此 Email 已完成驗證' })
  const code = randomResetCode()
  const salt = randomSalt()
  const codeHash = await hashPassword(code, salt)
  await sendVerificationEmail(env, email, code)
  await sql`
    update users
    set verification_code_hash = ${codeHash}, verification_code_salt = ${salt}, verification_expires_at = now() + interval '10 minutes', verification_attempts = 0, updated_at = now()
    where id = ${row.id}
  `
  return json({ ok: true, message: 'Email 驗證碼已重新寄出，請在 10 分鐘內完成驗證' })
}

async function handlePasswordRequest(request, env, sql) {
  const body = await readBody(request)
  const studentId = normalizeStudentId(body.student_id || body.studentId)
  const email = normalizeEmail(body.email)
  if (!/^\d{9}$/.test(studentId)) return error('學號必須為 9 碼數字')
  if (!email) return error('請輸入註冊 Email')
  const rows = await sql`select * from users where student_id = ${studentId} and lower(email) = ${email} limit 1`
  if (!rows.length) return error('找不到符合的帳號與 Email', 404)
  if (!rows[0].email_verified) return error('此帳號尚未完成 Email 驗證，請先完成驗證再重設密碼', 403, { code: 'EMAIL_NOT_VERIFIED' })
  const code = randomResetCode()
  const salt = randomSalt()
  const codeHash = await hashPassword(code, salt)
  await sendResetEmail(env, email, code)
  await sql`
    update users
    set reset_code_hash = ${codeHash}, reset_code_salt = ${salt}, reset_expires_at = now() + interval '10 minutes', reset_attempts = 0, updated_at = now()
    where id = ${rows[0].id}
  `
  return json({ ok: true, message: '驗證碼已寄出，請在 10 分鐘內完成重設' })
}

async function handlePasswordReset(request, env, sql) {
  const body = await readBody(request)
  const studentId = normalizeStudentId(body.student_id || body.studentId)
  const email = normalizeEmail(body.email)
  const code = String(body.code || '').trim()
  const newPassword = String(body.new_password || body.newPassword || '')
  if (!/^\d{9}$/.test(studentId)) return error('學號必須為 9 碼數字')
  if (!email) return error('請輸入註冊 Email')
  if (!/^\d{6}$/.test(code)) return error('驗證碼必須為 6 碼數字')
  if (newPassword.length < 6) return error('新密碼至少需要 6 碼')
  const rows = await sql`select * from users where student_id = ${studentId} and lower(email) = ${email} limit 1`
  if (!rows.length) return error('找不到符合的帳號與 Email', 404)
  const row = rows[0]
  if (!row.reset_code_hash || !row.reset_code_salt || !row.reset_expires_at) return error('尚未申請重設驗證碼', 400)
  if (new Date(row.reset_expires_at).getTime() < Date.now()) return error('驗證碼已過期，請重新申請', 400)
  if ((row.reset_attempts || 0) >= 5) return error('驗證碼錯誤次數過多，請重新申請', 429)
  const codeHash = await hashPassword(code, row.reset_code_salt)
  if (codeHash !== row.reset_code_hash) {
    await sql`update users set reset_attempts = coalesce(reset_attempts, 0) + 1 where id = ${row.id}`
    return error('驗證碼錯誤', 401)
  }
  const salt = randomSalt()
  const passwordHash = await hashPassword(newPassword, salt)
  await sql`
    update users
    set password_hash = ${passwordHash}, password_salt = ${salt}, reset_code_hash = null, reset_code_salt = null, reset_expires_at = null, reset_attempts = 0, updated_at = now()
    where id = ${row.id}
  `
  return json({ ok: true, message: '密碼已重設，請重新登入' })
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
  const incoming = body.settings || body
  const rows = await sql`select theme, accent_color, settings_json from user_settings where user_id = ${row.id} order by updated_at desc limit 1`
  const current = rows[0]?.settings_json || {}
  const settings = { ...current, ...incoming, appearance: { ...(current.appearance || {}), ...(incoming.appearance || {}) } }
  await sql`delete from user_settings where user_id = ${row.id}`
  await sql`
    insert into user_settings (user_id, theme, accent_color, settings_json, updated_at)
    values (${row.id}, ${settings.theme || settings.uiTheme || rows[0]?.theme || null}, ${settings.accentColor || settings.accent || rows[0]?.accent_color || null}, ${JSON.stringify(settings)}, now())
  `
  return json({ ok: true, settings })
}


async function handleGetWelcome(request, env, sql) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  const rows = await sql`select settings_json from user_settings where user_id = ${row.id} order by updated_at desc limit 1`
  const settings = rows[0]?.settings_json || {}
  return json({ ok: true, hasSeenWelcome: Boolean(settings.hasSeenWelcome), settings })
}

async function handlePutWelcome(request, env, sql) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  const rows = await sql`select theme, accent_color, settings_json from user_settings where user_id = ${row.id} order by updated_at desc limit 1`
  const current = rows[0]?.settings_json || {}
  const nextSettings = { ...current, hasSeenWelcome: true, welcomeSeenAt: new Date().toISOString() }
  await sql`delete from user_settings where user_id = ${row.id}`
  await sql`
    insert into user_settings (user_id, theme, accent_color, settings_json, updated_at)
    values (${row.id}, ${rows[0]?.theme || nextSettings.theme || null}, ${rows[0]?.accent_color || nextSettings.accentColor || null}, ${JSON.stringify(nextSettings)}, now())
  `
  return json({ ok: true, hasSeenWelcome: true, settings: nextSettings })
}

async function handleAdminCourseImport(request, env, sql) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  const publicRow = publicUser(row)
  if (publicRow.role !== 'super_admin') return error('沒有管理員權限', 403)

  const body = await readBody(request)
  const fallbackSemester = normalizeCourseCatalogTerm(body.semester || body.semester_source || '')
  const rawCourses = Array.isArray(body.courses) ? body.courses : Array.isArray(body.data) ? body.data : []
  const clearSemester = Boolean(body.clearSemester || body.clear_semester)
  if (!rawCourses.length) return error('沒有可匯入的課程資料')

  await ensureCourseSchema(sql)
  if (clearSemester && fallbackSemester) {
    await sql`delete from courses where semester_source = ${fallbackSemester}`
  }

  let imported = 0
  const errors = []
  const bySemester = {}
  for (let index = 0; index < rawCourses.length; index += 1) {
    const course = normalizeImportCourse(rawCourses[index], fallbackSemester)
    if (!course.semester_source || !course.name) {
      errors.push({ row: index + 1, message: '缺少學期或課程名稱' })
      continue
    }
    try {
      await upsertCourseRow(sql, course)
      imported += 1
      bySemester[course.semester_source] = (bySemester[course.semester_source] || 0) + 1
    } catch (err) {
      errors.push({ row: index + 1, message: err?.message || '匯入失敗' })
      if (errors.length >= 20) break
    }
  }

  return json({ ok: true, imported, failed: errors.length, errors, bySemester })
}


function getOAuthBaseUrl(request) {
  const url = new URL(request.url)
  return `${url.protocol}//${url.host}`
}

function getGoogleRedirectUri(request, env) {
  return env.GOOGLE_REDIRECT_URI || `${getOAuthBaseUrl(request)}/api/auth/google/callback`
}

function redirectToApp(request, params = {}) {
  const url = new URL(request.url)
  const target = new URL('/', `${url.protocol}//${url.host}`)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') target.searchParams.set(key, String(value))
  })
  return Response.redirect(target.toString(), 302)
}

async function handleGoogleStart(request, env) {
  if (!env.GOOGLE_CLIENT_ID) return redirectToApp(request, { google_error: '尚未設定 GOOGLE_CLIENT_ID' })
  const redirectUri = getGoogleRedirectUri(request, env)
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', env.GOOGLE_CLIENT_ID)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid email profile')
  authUrl.searchParams.set('prompt', 'select_account')
  authUrl.searchParams.set('state', base64UrlEncode(redirectUri))
  return Response.redirect(authUrl.toString(), 302)
}

async function exchangeGoogleCode(request, env, code) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) throw new Error('尚未設定 Google OAuth 環境變數')
  const redirectUri = getGoogleRedirectUri(request, env)
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data?.error_description || data?.error || 'Google token exchange failed')
  return data
}

async function fetchGoogleProfile(accessToken) {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { authorization: `Bearer ${accessToken}` },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data?.error_description || data?.error || 'Google profile fetch failed')
  return data
}

async function handleGoogleCallback(request, env, sql) {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const oauthError = url.searchParams.get('error')
    if (oauthError) return redirectToApp(request, { google_error: `Google 登入取消或失敗：${oauthError}` })
    if (!code) return redirectToApp(request, { google_error: 'Google 未回傳授權碼' })

    const tokenData = await exchangeGoogleCode(request, env, code)
    const googleProfile = await fetchGoogleProfile(tokenData.access_token)
    const googleId = String(googleProfile.sub || '')
    const email = normalizeEmail(googleProfile.email)
    if (!googleId || !email) return redirectToApp(request, { google_error: 'Google 帳號缺少必要資料' })
    if (googleProfile.email_verified === false) return redirectToApp(request, { google_error: 'Google Email 尚未驗證，無法登入' })

    let rows = await sql`select * from users where google_id = ${googleId} limit 1`
    if (!rows.length) {
      rows = await sql`select * from users where lower(email) = ${email} limit 1`
      if (!rows.length) {
        const setupToken = await signToken({
          kind: 'google_setup',
          googleId,
          email,
          googleName: googleProfile.name || '',
          googlePicture: googleProfile.picture || '',
        }, env.JWT_SECRET || 'uniplan-dev-secret')
        return redirectToApp(request, { google_setup: setupToken })
      }
      const existing = rows[0]
      if (existing.google_id && existing.google_id !== googleId) {
        return redirectToApp(request, { google_error: '此 Email 已綁定其他 Google 帳號' })
      }
      const updated = await sql`
        update users
        set google_id = ${googleId}, email_verified = true, updated_at = now(), profile = coalesce(profile, '{}'::jsonb) || ${JSON.stringify({ googleName: googleProfile.name || '', googlePicture: googleProfile.picture || '', boundGoogle: true })}::jsonb
        where id = ${existing.id}
        returning *
      `
      rows = updated
    }

    const row = rows[0]
    if (!row.email_verified) {
      await sql`update users set email_verified = true, updated_at = now() where id = ${row.id}`
      row.email_verified = true
    }
    await sql`update users set last_login = now(), updated_at = now() where id = ${row.id}`
    const user = publicUser(row)
    const token = await signToken({ uid: user.id, sid: user.studentId }, env.JWT_SECRET || 'uniplan-dev-secret')
    return redirectToApp(request, { google_token: token })
  } catch (err) {
    return redirectToApp(request, { google_error: err?.message || 'Google 登入失敗' })
  }
}

async function handleGoogleComplete(request, env, sql) {
  const body = await readBody(request)
  const setupToken = String(body.setup_token || body.setupToken || '')
  const payload = await verifyToken(setupToken, env.JWT_SECRET || 'uniplan-dev-secret')
  if (!payload || payload.kind !== 'google_setup' || !payload.googleId || !payload.email) return error('Google 首次設定憑證已失效，請重新使用 Google 登入', 401)

  const studentId = normalizeStudentId(body.student_id || body.studentId)
  const email = normalizeEmail(payload.email)
  if (!/^\d{9}$/.test(studentId)) return error('請輸入 9 碼學號')
  const exists = await sql`select id, student_id, email from users where student_id = ${studentId} or lower(email) = ${email} or google_id = ${payload.googleId} limit 1`
  if (exists.length) return error('此學號、Email 或 Google 帳號已被註冊', 409)

  const parsed = parseStudentIdLocal(studentId)
  const profile = profileFromBody({
    ...body,
    displayName: body.displayName || body.display_name || payload.googleName || studentId,
    email,
    department: body.department || parsed.department_name || '',
    grade: body.grade || parsed.start_grade || (parsed.program_code === '4' ? '大一' : ''),
    admissionYear: body.admissionYear || body.admission_year || parsed.admission_year || '',
    google_bound: true,
    email_bound: true,
  })
  const role = ADMIN_STUDENT_IDS.has(studentId) ? 'super_admin' : 'student'
  const salt = randomSalt()
  const passwordHash = await hashPassword(randomSalt(), salt)
  const rows = await sql`
    insert into users (student_id, email, display_name, password_hash, password_salt, role, profile, google_id, email_verified, created_at, updated_at, last_login)
    values (${studentId}, ${email}, ${profile.displayName || studentId}, ${passwordHash}, ${salt}, ${role}, ${JSON.stringify({ ...profile, googleName: payload.googleName || '', googlePicture: payload.googlePicture || '', boundGoogle: true, boundEmail: true })}, ${payload.googleId}, true, now(), now(), now())
    returning *
  `
  const user = publicUser(rows[0])
  const token = await signToken({ uid: user.id, sid: user.studentId }, env.JWT_SECRET || 'uniplan-dev-secret')
  return json({ ok: true, token, user, profile: rows[0].profile || {}, data: await loadUserBundle(sql, user.id), message: 'Google 帳號已完成首次設定' })
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


function normalizeCourseCatalogTerm(value) {
  const raw = String(value || '').trim()
  if (!raw || raw === '全部') return ''
  if (/1142CLASS/i.test(raw) || /114\s*[_-]?\s*2/.test(raw) || /114\s*下/.test(raw) || /1142/.test(raw) || /114學年度下/.test(raw) || /下學期/.test(raw) || /2CLASS/i.test(raw)) return '1142CLASS'
  if (/1141CLASS/i.test(raw) || /114\s*[_-]?\s*1/.test(raw) || /114\s*上/.test(raw) || /1141/.test(raw) || /114學年度上/.test(raw) || /上學期/.test(raw) || /1CLASS/i.test(raw)) return '1141CLASS'
  return raw
}

function courseHaystack(course) {
  return [
    course.name,
    course.course_name,
    course.teacher,
    course.instructor,
    course.serial,
    course.code,
    course.course_id,
    course.department,
    course.major,
    course.category,
    course.class_name,
    course.notes,
  ].filter(Boolean).join(' ').toLowerCase()
}

function courseMatchesQuery(course, searchParams) {
  const keyword = String(searchParams.get('keyword') || '').trim().toLowerCase()
  const semester = normalizeCourseCatalogTerm(searchParams.get('semester') || searchParams.get('term') || searchParams.get('catalogTerm'))
  const department = String(searchParams.get('department') || '').trim()
  const grade = String(searchParams.get('grade') || '').trim()
  const weekday = String(searchParams.get('weekday') || '').trim()
  const period = String(searchParams.get('period') || '').trim()
  if (keyword && !courseHaystack(course).includes(keyword)) return false
  const courseTerm = normalizeCourseCatalogTerm(course.semester_source || course.semester || course.term || course.source_term || course.catalog_term)
  if (semester && courseTerm !== semester) return false
  if (department && department !== '全部' && String(course.department || '') !== department) return false
  if (grade && grade !== '全部' && String(course.grade || '') !== grade) return false
  const timeText = String(course.time_info || course.time_data || '')
  if (weekday && weekday !== '全部' && !timeText.includes(weekday)) return false
  if (period && period !== '全部' && !timeText.includes(String(period))) return false
  return true
}

function mapCourseRow(row) {
  return {
    id: row.id,
    semester_source: row.semester_source || '',
    semester: row.semester_source || '',
    serial: row.serial || '',
    code: row.code || '',
    course_code: row.code || '',
    course_id: row.code || row.serial || '',
    name: row.name || '',
    course_name: row.name || '',
    credits: row.credits === null || row.credits === undefined ? null : Number(row.credits),
    category: row.category || '',
    teacher: row.teacher || '',
    instructor: row.teacher || '',
    classroom: row.classroom || '',
    room: row.classroom || '',
    capacity: row.capacity || '',
    time_data: Array.isArray(row.time_data) ? row.time_data : [],
    time_info: row.time_info || '',
    department: row.department || '',
    grade: row.grade || '',
    major: row.major || '',
    sem_seq: row.sem_seq || '',
    class_name: row.class_name || '',
    group_type: row.group_type || '',
    notes: row.notes || '',
    raw_json: row.raw_json || {},
  }
}

async function handleCourses(request, env) {
  const url = new URL(request.url)
  const sql = getSql(env)
  const keyword = String(url.searchParams.get('keyword') || '').trim()
  const semester = normalizeCourseCatalogTerm(url.searchParams.get('semester') || url.searchParams.get('term') || url.searchParams.get('catalogTerm'))
  const department = String(url.searchParams.get('department') || '').trim()
  const grade = String(url.searchParams.get('grade') || '').trim()
  const weekday = String(url.searchParams.get('weekday') || '').trim()
  const period = String(url.searchParams.get('period') || '').trim()

  const rows = await sql`
    SELECT
      id,
      semester_source,
      serial,
      code,
      name,
      credits,
      category,
      teacher,
      classroom,
      capacity,
      time_data,
      time_info,
      department,
      grade,
      major,
      sem_seq,
      class_name,
      group_type,
      notes,
      raw_json
    FROM courses
    WHERE (${semester} = '' OR semester_source = ${semester})
      AND (${department} = '' OR ${department} = '全部' OR department = ${department})
      AND (${grade} = '' OR ${grade} = '全部' OR grade = ${grade})
    ORDER BY semester_source, department NULLS LAST, serial NULLS LAST, code NULLS LAST, name
    LIMIT 5000
  `

  const searchParams = new URLSearchParams()
  if (keyword) searchParams.set('keyword', keyword)
  if (semester) searchParams.set('semester', semester)
  if (department) searchParams.set('department', department)
  if (grade) searchParams.set('grade', grade)
  if (weekday) searchParams.set('weekday', weekday)
  if (period) searchParams.set('period', period)

  const neonCourses = rows.map(mapCourseRow)
  const existing = new Set(neonCourses.map(patchedCourseKey))
  const patchedCourses = PATCHED_COMMON_COURSES
    .map(normalizePatchedCourse)
    .filter((course) => !existing.has(patchedCourseKey(course)))

  const data = [...neonCourses, ...patchedCourses]
    .filter((course) => courseMatchesQuery(course, searchParams))
    .slice(0, 500)

  return json({ ok: true, data, total: data.length, source: 'neon-courses-with-local-patches' })
}

async function handleCourseMetadata(request, env) {
  const sql = getSql(env)
  const [departments, majors, grades, categories, semesters] = await Promise.all([
    sql`SELECT DISTINCT department AS value FROM courses WHERE department IS NOT NULL AND department <> '' ORDER BY department LIMIT 500`,
    sql`SELECT DISTINCT major AS value FROM courses WHERE major IS NOT NULL AND major <> '' ORDER BY major LIMIT 500`,
    sql`SELECT DISTINCT grade AS value FROM courses WHERE grade IS NOT NULL AND grade <> '' ORDER BY grade LIMIT 200`,
    sql`SELECT DISTINCT category AS value FROM courses WHERE category IS NOT NULL AND category <> '' ORDER BY category LIMIT 300`,
    sql`SELECT DISTINCT semester_source AS value FROM courses WHERE semester_source IS NOT NULL AND semester_source <> '' ORDER BY semester_source LIMIT 100`,
  ])
  const notClass = (item) => !/^[A-ZＡ-Ｚ]班?$|^[甲乙丙丁戊己庚辛壬癸]班?$|^[A-Z]$/i.test(String(item || '').trim())
  const values = (rows) => rows.map((row) => row.value).filter(Boolean)
  const unique = (items) => [...new Set(items.filter(Boolean))]
  return json({
    ok: true,
    data: {
      departments: unique([...values(departments), ...PATCHED_COMMON_COURSES.map((c) => c.department)]).filter(notClass).sort(),
      majors: values(majors).filter(notClass),
      grades: unique([...values(grades), ...PATCHED_COMMON_COURSES.map((c) => c.grade)]),
      categories: unique([...values(categories), ...PATCHED_COMMON_COURSES.map((c) => c.category)]),
      semesters: unique([...values(semesters).map(normalizeCourseCatalogTerm), ...PATCHED_COMMON_COURSES.map((c) => normalizeCourseCatalogTerm(c.semester_source))]).filter(Boolean).sort(),
    },
    source: 'neon-courses-with-local-patches',
  })
}

export async function onRequest(context) {
  const { request, env, params } = context
  if (request.method === 'OPTIONS') return new Response(null, { headers: jsonHeaders })
  try {
    const path = `/${(params.path || []).join('/')}`.replace(/\/+/g, '/')
    const method = request.method.toUpperCase()

    if (method === 'GET' && path === '/courses') return handleCourses(request, env)
    if (method === 'GET' && path === '/courses/metadata') return handleCourseMetadata(request, env)

    const sql = getSql(env)
    await ensureSchema(sql)

    if (method === 'GET' && path === '/auth/google/start') return handleGoogleStart(request, env)
    if (method === 'GET' && path === '/auth/google/callback') return handleGoogleCallback(request, env, sql)
    if (method === 'POST' && path === '/auth/google/complete') return handleGoogleComplete(request, env, sql)
    if (method === 'POST' && path === '/auth/register') return handleRegister(request, env, sql)
    if (method === 'POST' && path === '/auth/login') return handleLogin(request, env, sql)
    if (method === 'POST' && path === '/auth/logout') return json({ ok: true })
    if (method === 'POST' && path === '/auth/verify-email') return handleVerifyEmail(request, env, sql)
    if (method === 'POST' && path === '/auth/verification/resend') return handleResendVerification(request, env, sql)
    if (method === 'POST' && path === '/auth/password/request') return handlePasswordRequest(request, env, sql)
    if (method === 'POST' && path === '/auth/password/reset') return handlePasswordReset(request, env, sql)
    if (method === 'GET' && path === '/auth/me') return handleMe(request, env, sql)
    if (method === 'PUT' && path === '/auth/profile') return handleProfile(request, env, sql)
    if (method === 'GET' && path === '/user/data') return handleGetUserData(request, env, sql)
    if (method === 'PUT' && path === '/user/data') return handlePutUserData(request, env, sql)
    if (method === 'GET' && path === '/user/welcome') return handleGetWelcome(request, env, sql)
    if (method === 'PUT' && path === '/user/welcome') return handlePutWelcome(request, env, sql)
    if (path === '/user/favorites' && ['GET', 'PUT'].includes(method)) return handleFavorites(request, env, sql, method)
    if (path === '/user/settings' && ['GET', 'PUT'].includes(method)) return handleSettings(request, env, sql, method)
    if (method === 'POST' && path === '/admin/courses/import') return handleAdminCourseImport(request, env, sql)
    if (method === 'POST' && path === '/schedule') return handleSchedule(request, env, sql, method)
    if (method === 'GET' && path.startsWith('/schedule/')) return handleSchedule(request, env, sql, method)
    if (method === 'GET' && path.startsWith('/student-id/parse/')) return json({ ok: true, data: parseStudentIdLocal(decodeURIComponent(path.slice('/student-id/parse/'.length))) })

    return error(`API route not found: ${method} ${path}`, 404)
  } catch (err) {
    return error(err?.message || 'API 執行失敗', 500)
  }
}
