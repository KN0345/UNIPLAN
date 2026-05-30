import { neon } from '@neondatabase/serverless'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('缺少 DATABASE_URL。請先設定環境變數，例如：DATABASE_URL="postgresql://..." node scripts/import-courses-to-neon.mjs')
  process.exit(1)
}

const sql = neon(DATABASE_URL)

function parseTimeData(value) {
  if (Array.isArray(value)) return value
  if (!value) return []
  try { return JSON.parse(String(value)) } catch { return [] }
}

function normalizeCourse(course) {
  return {
    semester_source: String(course.semester_source || course.semester || course.term || '').trim(),
    serial: String(course.serial || '').trim(),
    code: String(course.code || course.course_code || course.course_id || '').trim(),
    name: String(course.name || course.course_name || '').trim(),
    credits: Number.isFinite(Number(course.credits)) ? Number(course.credits) : null,
    category: String(course.category || '').trim(),
    teacher: String(course.teacher || course.instructor || '').trim(),
    classroom: String(course.classroom || course.room || '').trim(),
    capacity: String(course.capacity || '').trim(),
    time_data: parseTimeData(course.time_data),
    time_info: String(course.time_info || '').trim(),
    department: String(course.department || '').trim(),
    grade: String(course.grade || '').trim(),
    major: String(course.major || '').trim(),
    sem_seq: String(course.sem_seq || '').trim(),
    class_name: String(course.class_name || '').trim(),
    group_type: String(course.group_type || '').trim(),
    notes: String(course.notes || '').trim(),
    raw_json: course,
  }
}

async function ensureCourseSchema() {
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`
  await sql`
    CREATE TABLE IF NOT EXISTS courses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      semester_source TEXT NOT NULL,
      serial TEXT,
      code TEXT,
      name TEXT NOT NULL,
      credits NUMERIC,
      category TEXT,
      teacher TEXT,
      classroom TEXT,
      capacity TEXT,
      time_data JSONB,
      time_info TEXT,
      department TEXT,
      grade TEXT,
      major TEXT,
      sem_seq TEXT,
      class_name TEXT,
      group_type TEXT,
      notes TEXT,
      raw_json JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (semester_source, serial, code, class_name, name)
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_courses_semester_source ON courses (semester_source)`
  await sql`CREATE INDEX IF NOT EXISTS idx_courses_department ON courses (department)`
  await sql`CREATE INDEX IF NOT EXISTS idx_courses_grade ON courses (grade)`
  await sql`CREATE INDEX IF NOT EXISTS idx_courses_code ON courses (code)`
  await sql`CREATE INDEX IF NOT EXISTS idx_courses_serial ON courses (serial)`
  await sql`CREATE INDEX IF NOT EXISTS idx_courses_name ON courses (name)`
}

async function main() {
  const jsonPath = path.join(root, 'frontend', 'public', 'data', 'courses.json')
  const text = await fs.readFile(jsonPath, 'utf8')
  const payload = JSON.parse(text)
  const courses = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []
  if (!courses.length) throw new Error('courses.json 沒有課程資料')

  await ensureCourseSchema()

  let imported = 0
  const bySemester = new Map()
  for (const original of courses) {
    const c = normalizeCourse(original)
    if (!c.semester_source || !c.name) continue
    await sql`
      INSERT INTO courses (
        semester_source, serial, code, name, credits, category, teacher, classroom, capacity,
        time_data, time_info, department, grade, major, sem_seq, class_name, group_type, notes, raw_json, updated_at
      ) VALUES (
        ${c.semester_source}, ${c.serial}, ${c.code}, ${c.name}, ${c.credits}, ${c.category}, ${c.teacher}, ${c.classroom}, ${c.capacity},
        ${JSON.stringify(c.time_data)}::jsonb, ${c.time_info}, ${c.department}, ${c.grade}, ${c.major}, ${c.sem_seq}, ${c.class_name}, ${c.group_type}, ${c.notes}, ${JSON.stringify(c.raw_json)}::jsonb, now()
      )
      ON CONFLICT (semester_source, serial, code, class_name, name)
      DO UPDATE SET
        credits = EXCLUDED.credits,
        category = EXCLUDED.category,
        teacher = EXCLUDED.teacher,
        classroom = EXCLUDED.classroom,
        capacity = EXCLUDED.capacity,
        time_data = EXCLUDED.time_data,
        time_info = EXCLUDED.time_info,
        department = EXCLUDED.department,
        grade = EXCLUDED.grade,
        major = EXCLUDED.major,
        sem_seq = EXCLUDED.sem_seq,
        group_type = EXCLUDED.group_type,
        notes = EXCLUDED.notes,
        raw_json = EXCLUDED.raw_json,
        updated_at = now()
    `
    imported += 1
    bySemester.set(c.semester_source, (bySemester.get(c.semester_source) || 0) + 1)
  }

  console.log(`已匯入/更新 ${imported} 筆課程`)
  for (const [semester, count] of [...bySemester.entries()].sort()) {
    console.log(`${semester}: ${count}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
