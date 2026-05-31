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
  if (data?.token) localStorage.setItem('uniplan:token', data.token)
  return data
}

export async function login(identifier, password) {
  const { data } = await api.post('/auth/login', { identifier, student_id: identifier, password })
  if (data?.token) localStorage.setItem('uniplan:token', data.token)
  return data
}


export async function completeGoogleSetup(setup_token, profile = {}) {
  const { data } = await api.post('/auth/google/complete', { setup_token, ...profile })
  if (data?.token) localStorage.setItem('uniplan:token', data.token)
  return data
}

export async function verifyEmail(student_id, email, code) {
  const { data } = await api.post('/auth/verify-email', { student_id, email, code })
  if (data?.token) localStorage.setItem('uniplan:token', data.token)
  return data
}

export async function resendVerification(student_id, email) {
  const { data } = await api.post('/auth/verification/resend', { student_id, email })
  return data
}

export async function requestPasswordReset(student_id, email) {
  const { data } = await api.post('/auth/password/request', { student_id, email })
  return data
}

export async function resetPassword(student_id, email, code, new_password) {
  const { data } = await api.post('/auth/password/reset', { student_id, email, code, new_password })
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
  try {
    const { data } = await api.put('/user/data', { data: bundle })
    return data
  } catch (err) {
    if (err?.response?.status === 405) {
      const { data } = await api.post('/user/data', { data: bundle })
      return data
    }
    throw err
  }
}

export async function fetchUserSettings() {
  const { data } = await api.get('/user/settings')
  return data
}

export async function saveUserSettings(settings) {
  try {
    const { data } = await api.put('/user/settings', { settings })
    return data
  } catch (err) {
    if (err?.response?.status === 405) {
      const { data } = await api.post('/user/settings', { settings })
      return data
    }
    throw err
  }
}


function normalizeCatalogTermForApi(value) {
  const raw = String(value || '').trim()
  if (!raw || raw === '全部') return ''
  if (/1142CLASS/i.test(raw) || /114\s*[_-]?\s*2/.test(raw) || /114\s*下/.test(raw) || /1142/.test(raw) || /114學年度下/.test(raw) || /下學期/.test(raw) || /2CLASS/i.test(raw)) return '1142CLASS'
  if (/1141CLASS/i.test(raw) || /114\s*[_-]?\s*1/.test(raw) || /114\s*上/.test(raw) || /1141/.test(raw) || /114學年度上/.test(raw) || /上學期/.test(raw) || /1CLASS/i.test(raw)) return '1141CLASS'
  return raw
}

function matchesStaticCourse(course, params = {}) {
  const keyword = String(params.keyword || '').trim().toLowerCase()
  const semester = normalizeCatalogTermForApi(params.semester || params.term || params.catalogTerm || '')
  const department = String(params.department || '').trim()
  const grade = String(params.grade || '').trim()
  const weekday = String(params.weekday || '').trim()
  const period = String(params.period || '').trim()
  const haystack = [course.name, course.course_name, course.teacher, course.instructor, course.serial, course.code, course.course_id, course.department, course.major, course.category, course.class_name].join(' ').toLowerCase()
  if (keyword && !haystack.includes(keyword)) return false
  const courseTerm = normalizeCatalogTermForApi(course.semester_source || course.semester || course.term || course.source_term || course.catalog_term)
  if (semester && courseTerm !== semester) return false
  if (department && department !== '全部' && course.department !== department) return false
  if (grade && grade !== '全部' && String(course.grade || '') !== grade) return false
  const timeText = String(course.time_info || course.time_data || '')
  if (weekday && weekday !== '全部' && !timeText.includes(weekday)) return false
  if (period && period !== '全部' && !timeText.includes(String(period))) return false
  return true
}

export async function fetchCourses(params = {}) {
  const { data } = await api.get('/courses', { params })
  return data
}

export async function fetchMetadata() {
  const { data } = await api.get('/courses/metadata')
  return data
}

export async function fetchWelcomeState() {
  const { data } = await api.get('/user/welcome')
  return data
}

export async function completeWelcome() {
  try {
    const { data } = await api.put('/user/welcome', { hasSeenWelcome: true })
    return data
  } catch (err) {
    if (err?.response?.status === 405) {
      const { data } = await api.post('/user/welcome', { hasSeenWelcome: true })
      return data
    }
    throw err
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
