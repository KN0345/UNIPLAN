import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE || ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? `${window.location.protocol}//${window.location.hostname}:8000` : '/api')

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('uniplan:token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export async function register(student_id, password, extra = {}) {
  const { data } = await api.post('/auth/register', { student_id, password, ...extra })
  return data
}

export async function login(student_id, password) {
  const { data } = await api.post('/auth/login', { student_id, password })
  return data
}

export async function logout() {
  const { data } = await api.post('/auth/logout')
  localStorage.removeItem('uniplan:token')
  return data
}


export async function parseStudentId(studentId) {
  const { data } = await api.get(`/student-id/parse/${encodeURIComponent(studentId || '')}`)
  return data
}

export async function fetchMe() {
  const { data } = await api.get('/auth/me')
  return data
}

export async function updateProfile(profile) {
  const { data } = await api.put('/auth/profile', {
    display_name: profile.displayName || '',
    email: profile.email || '',
    department: profile.department || '',
    grade: profile.grade || '',
    admission_year: profile.admissionYear || '',
    student_status: profile.studentStatus || '在學',
    email_bound: !!profile.boundEmail,
    google_bound: !!profile.boundGoogle,
    sync_enabled: !!profile.syncEnabled,
  })
  return data
}

export async function fetchUserData() {
  const { data } = await api.get('/user/data')
  return data
}

export async function syncUserData(bundle) {
  const { data } = await api.put('/user/data', { data: bundle })
  return data
}



function normalizeCourseSemester(value = '') {
  const raw = String(value || '').trim()
  if (!raw || raw === '全部') return ''
  if (/114\s*學?年度?\s*下|114\s*下|1142|2CLASS|下學期/i.test(raw)) return '1142CLASS'
  if (/114\s*學?年度?\s*上|114\s*上|1141|1CLASS|上學期/i.test(raw)) return '1141CLASS'
  return raw
}

function normalizeCourseText(value = '') {
  return String(value || '').trim().toLowerCase()
}

function normalizeCourseRecord(course = {}) {
  const semesterSource = normalizeCourseSemester(course.semester_source || course.semester || course.term || course.catalog_term)
  return {
    ...course,
    semester_source: semesterSource || course.semester_source || '',
  }
}

function matchesStaticCourse(course, params = {}) {
  const c = normalizeCourseRecord(course)
  const keyword = normalizeCourseText(params.keyword)
  const semester = normalizeCourseSemester(params.semester)
  const department = String(params.department || '').trim()
  const grade = String(params.grade || '').trim()
  const weekday = String(params.weekday || '').trim()
  const period = String(params.period || '').trim()
  const haystack = [
    c.name,
    c.course_name,
    c.teacher,
    c.instructor,
    c.serial,
    c.code,
    c.department,
    c.major,
    c.category,
    c.class_name,
    c.className,
  ].join(' ').toLowerCase()
  if (keyword && !haystack.includes(keyword)) return false
  if (semester && c.semester_source !== semester) return false
  if (department && department !== '全部' && c.department !== department) return false
  if (grade && grade !== '全部' && String(c.grade || '') !== grade) return false
  const timeText = String(c.time_info || c.time_data || c.time || '')
  if (weekday && weekday !== '全部' && !timeText.includes(weekday)) return false
  if (period && period !== '全部' && !timeText.includes(String(period))) return false
  return true
}

let staticCoursesCache = null
let staticMetadataCache = null

async function loadStaticCourses() {
  if (staticCoursesCache) return staticCoursesCache
  const response = await fetch('/data/courses.json', { cache: 'no-store' })
  if (!response.ok) throw new Error(`static courses not found: ${response.status}`)
  const payload = await response.json()
  const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []
  staticCoursesCache = list.map(normalizeCourseRecord)
  return staticCoursesCache
}

async function fetchStaticCourses(params = {}) {
  const list = await loadStaticCourses()
  const filtered = list.filter((course) => matchesStaticCourse(course, params)).slice(0, 500)
  return { ok: true, source: 'static-json', data: filtered }
}

function buildMetadataFromCourses(list = []) {
  const unique = (values) => Array.from(new Set(values.filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b), 'zh-Hant'))
  return {
    departments: unique(list.map((course) => course.department)),
    categories: unique(list.map((course) => course.category)),
    grades: unique(list.map((course) => course.grade)),
    majors: unique(list.map((course) => course.major)),
    semesters: unique(list.map((course) => course.semester_source)),
  }
}

async function fetchStaticMetadata() {
  if (staticMetadataCache) return staticMetadataCache
  try {
    const response = await fetch('/data/metadata.json', { cache: 'no-store' })
    if (response.ok) {
      const payload = await response.json()
      staticMetadataCache = payload?.data || payload
      return staticMetadataCache
    }
  } catch {}
  const list = await loadStaticCourses()
  staticMetadataCache = buildMetadataFromCourses(list)
  return staticMetadataCache
}

export async function fetchCourses(params = {}) {
  // 正式把課程搬進 Neon 前，課程搜尋必須以 public/data/courses.json 為主。
  // 避免 /api/courses 在 Cloudflare Functions 尚未完整部署時回傳 404，導致 1142CLASS 顯示 0 門。
  try {
    return await fetchStaticCourses(params)
  } catch (staticError) {
    const { data } = await api.get('/courses', { params })
    return data
  }
}

export async function fetchMetadata() {
  try {
    return await fetchStaticMetadata()
  } catch (staticError) {
    const { data } = await api.get('/courses/metadata')
    return data
  }
}

export async function submitPublicFeedback(payload) {
  const { data } = await api.post('/feedback', payload)
  return data
}

export async function listPublicFeedback(params = {}) {
  const { data } = await api.get('/feedback', { params })
  return data
}


export async function fetchSchedule(studentId) {
  const { data } = await api.get(`/schedule/${studentId}`)
  return data
}

export async function saveSchedule(studentId, scheduleData) {
  const { data } = await api.post('/schedule', {
    student_id: studentId,
    schedule_data: scheduleData,
  })
  return data
}

export async function fetchReviews(code) {
  try {
    const { data } = await api.get(`/reviews/${encodeURIComponent(code || '')}`)
    return data
  } catch (error) {
    return { ok: true, data: [] }
  }
}

export async function addReview(payload) {
  const { data } = await api.post('/reviews', payload)
  return data
}

export async function solveSchedule(payload) {
  const { data } = await api.post('/solve', payload)
  return data
}

export async function fetchGraduationRule(deptCode = 'ALL', year = 0) {
  const { data } = await api.get(`/rules/graduation/${deptCode}/${year}`)
  return data
}

export async function analyzeGraduation(courses, requirements) {
  const { data } = await api.post('/analyze-graduation', { courses, requirements })
  return data
}

export async function fetchAdminSummary() {
  const { data } = await api.get('/admin/data-summary')
  return data
}

export async function importOfficialCourses(payload) {
  const { data } = await api.post('/admin/courses/import', payload)
  return data
}

export async function fetchImportLogs() {
  const { data } = await api.get('/admin/import-logs')
  return data
}

export async function listGraduationRules(params = {}) {
  const { data } = await api.get('/rules/graduation', { params })
  return data
}

export async function upsertGraduationRule(payload) {
  const { data } = await api.put('/admin/rules/graduation', payload)
  return data
}

export async function deleteGraduationRule(deptCode, year) {
  const { data } = await api.delete(`/admin/rules/graduation/${encodeURIComponent(deptCode)}/${year}`)
  return data
}

export async function listProgramRules() {
  const { data } = await api.get('/rules/programs/full')
  return data
}

export async function upsertProgramRule(payload) {
  const { data } = await api.put('/admin/rules/program', payload)
  return data
}

export async function deleteProgramRule(programName, deptCode) {
  const { data } = await api.delete(`/admin/rules/program/${encodeURIComponent(programName)}/${encodeURIComponent(deptCode)}`)
  return data
}

export async function listCourseClassifications(params = {}) {
  const { data } = await api.get('/rules/course-classifications', { params })
  return data
}

export async function upsertCourseClassification(payload) {
  const { data } = await api.put('/admin/rules/course-classification', payload)
  return data
}

export async function deleteCourseClassification(id) {
  const { data } = await api.delete(`/admin/rules/course-classification/${id}`)
  return data
}

export async function analyzeProgram(courses, rule) {
  const { data } = await api.post('/analyze-program', { courses, rule })
  return data
}
