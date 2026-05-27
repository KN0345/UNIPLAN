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


function matchesStaticCourse(course, params = {}) {
  const keyword = String(params.keyword || '').trim().toLowerCase()
  const semester = String(params.semester || '').trim()
  const department = String(params.department || '').trim()
  const grade = String(params.grade || '').trim()
  const weekday = String(params.weekday || '').trim()
  const period = String(params.period || '').trim()
  const haystack = [course.name, course.teacher, course.serial, course.code, course.department, course.major, course.category, course.class_name].join(' ').toLowerCase()
  if (keyword && !haystack.includes(keyword)) return false
  if (semester && semester !== '全部' && course.semester_source !== semester) return false
  if (department && department !== '全部' && course.department !== department) return false
  if (grade && grade !== '全部' && String(course.grade || '') !== grade) return false
  const timeText = String(course.time_info || course.time_data || '')
  if (weekday && weekday !== '全部' && !timeText.includes(weekday)) return false
  if (period && period !== '全部' && !timeText.includes(String(period))) return false
  return true
}

async function fetchStaticCourses(params = {}) {
  const response = await fetch('/data/courses.json')
  if (!response.ok) throw new Error('static courses not found')
  const payload = await response.json()
  const list = Array.isArray(payload?.data) ? payload.data : []
  return { data: list.filter((course) => matchesStaticCourse(course, params)).slice(0, 500) }
}

export async function fetchCourses(params = {}) {
  try {
    const { data } = await api.get('/courses', { params })
    return data
  } catch (error) {
    return fetchStaticCourses(params)
  }
}

export async function fetchMetadata() {
  try {
    const { data } = await api.get('/courses/metadata')
    return data
  } catch (error) {
    const response = await fetch('/data/metadata.json')
    if (!response.ok) throw error
    return response.json()
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
  const { data } = await api.get(`/reviews/${encodeURIComponent(code || '')}`)
  return data
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
