import { neon } from '@neondatabase/serverless'

function json(data, init = {}) {
  const headers = new Headers(init.headers || {})
  headers.set('content-type', 'application/json; charset=utf-8')
  headers.set('cache-control', 'no-store')
  return new Response(JSON.stringify(data), { ...init, headers })
}

function bad(message, status = 400) {
  return json({ ok: false, error: message }, { status })
}

function getSql(env) {
  if (!env.DATABASE_URL) return null
  return neon(env.DATABASE_URL)
}

async function readJson(request) {
  try { return await request.json() } catch { return {} }
}

async function ensureSchema(sql) {
  await sql`
    create table if not exists feedback_items (
      id text primary key,
      type text not null default '功能問題',
      title text not null default '',
      detail text not null default '',
      status text not null default '待處理',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )`
  await sql`
    create table if not exists course_reviews (
      id text primary key,
      course_key text not null,
      user_id text not null default 'anonymous',
      rating integer not null default 5,
      content text not null default '',
      tags text not null default '',
      likes integer not null default 0,
      created_at timestamptz not null default now()
    )`
  await sql`
    create table if not exists course_tag_votes (
      course_key text not null,
      tag text not null,
      voter_key text not null,
      created_at timestamptz not null default now(),
      primary key(course_key, tag, voter_key)
    )`
}

function mapFeedback(row) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    detail: row.detail,
    status: row.status,
    created_at: row.created_at,
  }
}

export async function onRequest(context) {
  const { request, env, params } = context
  const url = new URL(request.url)
  const path = '/' + (params.path || []).join('/')
  const method = request.method.toUpperCase()
  const sql = getSql(env)

  if (method === 'OPTIONS') return new Response(null, { status: 204 })
  if (path === '/health') return json({ status: 'ok', runtime: 'cloudflare-pages-functions' })

  if (!sql) {
    return bad('DATABASE_URL is not configured. Static course search will still work, but public feedback/reviews require Neon PostgreSQL.', 503)
  }

  await ensureSchema(sql)

  if (path === '/feedback' && method === 'GET') {
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || 20)))
    const rows = await sql`select id,type,title,detail,status,created_at from feedback_items where status not in ('已拒絕','已處理') order by created_at desc limit ${limit}`
    return json({ ok: true, data: rows.map(mapFeedback) })
  }

  if (path === '/feedback' && method === 'POST') {
    const body = await readJson(request)
    const id = String(body.id || `fb-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`)
    const type = String(body.type || '功能問題').slice(0, 80)
    const title = String(body.title || type).slice(0, 120)
    const detail = String(body.detail || body.content || '').slice(0, 3000)
    const rows = await sql`
      insert into feedback_items(id,type,title,detail,status)
      values(${id},${type},${title},${detail},'待處理')
      on conflict(id) do update set type=excluded.type,title=excluded.title,detail=excluded.detail,updated_at=now()
      returning id,type,title,detail,status,created_at`
    return json({ ok: true, data: mapFeedback(rows[0]) })
  }

  if (path.startsWith('/admin/feedback/') && method === 'PATCH') {
    const id = decodeURIComponent(path.split('/').pop())
    const body = await readJson(request)
    const status = String(body.status || '待處理').slice(0, 20)
    const rows = await sql`update feedback_items set status=${status}, updated_at=now() where id=${id} returning id,type,title,detail,status,created_at`
    if (!rows.length) return bad('feedback not found', 404)
    return json({ ok: true, data: mapFeedback(rows[0]) })
  }

  if (path === '/admin/feedback' && method === 'GET') {
    const rows = await sql`select id,type,title,detail,status,created_at from feedback_items order by created_at desc limit 200`
    return json({ ok: true, data: rows.map(mapFeedback) })
  }

  if (path.startsWith('/reviews/') && method === 'GET') {
    const courseKey = decodeURIComponent(path.replace('/reviews/', ''))
    const rows = await sql`select id,course_key,user_id,rating,content,tags,likes,created_at from course_reviews where course_key=${courseKey} order by created_at desc limit 100`
    return json({ ok: true, data: rows })
  }

  if (path === '/reviews' && method === 'POST') {
    const body = await readJson(request)
    const id = String(body.id || `rv-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`)
    const courseKey = String(body.courseKey || body.code || '').slice(0, 120)
    if (!courseKey) return bad('courseKey is required')
    const userId = String(body.userId || body.user_id || 'anonymous').slice(0, 80)
    const rating = Math.max(1, Math.min(5, Number(body.rating || 5)))
    const content = String(body.content || '').slice(0, 300)
    const tags = String(body.tags || '').slice(0, 200)
    const rows = await sql`
      insert into course_reviews(id,course_key,user_id,rating,content,tags)
      values(${id},${courseKey},${userId},${rating},${content},${tags})
      returning id,course_key,user_id,rating,content,tags,likes,created_at`
    return json({ ok: true, data: rows[0] })
  }

  if (path === '/course-tags/vote' && method === 'POST') {
    const body = await readJson(request)
    const courseKey = String(body.courseKey || '').slice(0, 120)
    const tag = String(body.tag || '').slice(0, 40)
    const voterKey = String(body.voterKey || 'anonymous').slice(0, 120)
    if (!courseKey || !tag) return bad('courseKey and tag are required')
    await sql`insert into course_tag_votes(course_key,tag,voter_key) values(${courseKey},${tag},${voterKey}) on conflict do nothing`
    const rows = await sql`select tag,count(*)::int as votes from course_tag_votes where course_key=${courseKey} group by tag order by votes desc`
    return json({ ok: true, data: rows })
  }

  if (path.startsWith('/course-tags/') && method === 'GET') {
    const courseKey = decodeURIComponent(path.replace('/course-tags/', ''))
    const rows = await sql`select tag,count(*)::int as votes from course_tag_votes where course_key=${courseKey} group by tag order by votes desc`
    return json({ ok: true, data: rows })
  }

  if (path === '/admin/data-summary' && method === 'GET') {
    const feedbackRows = await sql`select status,count(*)::int as count from feedback_items group by status`
    const reviewRows = await sql`select count(*)::int as count from course_reviews`
    const tagRows = await sql`select count(*)::int as count from course_tag_votes`
    return json({ ok: true, data: { feedback: feedbackRows, reviews: reviewRows[0]?.count || 0, tag_votes: tagRows[0]?.count || 0 } })
  }

  return bad(`Route not implemented in free Cloudflare API: ${method} ${path}`, 404)
}
