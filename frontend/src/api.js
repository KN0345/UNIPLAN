import axios from 'axios'

// Cloudflare Pages Functions are mounted under /api in production.
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
  const { data } = await api.put('/user/data', { data: bundle })
  return data
}

export async function fetchUserSettings() {
  const { data } = await api.get('/user/settings')
  return data
}

export async function saveUserSettings(settings) {
  const { data } = await api.put('/user/settings', { settings })
  return data
}


function normalizeCatalogTermForApi(value) {
  const raw = String(value || '').trim()
  if (!raw || raw === '全部') return ''
  if (/1151CLASS/i.test(raw) || /115\s*[_-]?\s*1/.test(raw) || /115\s*上/.test(raw) || /1151/.test(raw) || /115學年度上/.test(raw)) return '1151CLASS'
  if (/1142CLASS/i.test(raw) || /114\s*[_-]?\s*2/.test(raw) || /114\s*下/.test(raw) || /1142/.test(raw) || /114學年度下/.test(raw) || /下學期/.test(raw) || /2CLASS/i.test(raw)) return '1142CLASS'
  if (/1141CLASS/i.test(raw) || /114\s*[_-]?\s*1/.test(raw) || /114\s*上/.test(raw) || /1141/.test(raw) || /114學年度上/.test(raw) || /上學期/.test(raw) || /1CLASS/i.test(raw)) return '1141CLASS'
  return raw
}

function normalizeFilterText(value = '') {
  return String(value || '').replace(/[（）()\s:：／/\-—_\.]/g, '').toLowerCase()
}

function courseDepartmentTexts(course = {}) {
  return [
    course.department,
    course.dept,
    course.major,
    course.unit,
    course.opening_unit,
    course.openingUnit,
    course.category,
    course.raw_json?.department,
    course.raw_json?.major,
    course.raw_json?.unit,
    course.raw_json?.opening_unit,
  ].filter(Boolean).map((x) => String(x))
}

function departmentMatchesCourse(course, department) {
  const target = normalizeFilterText(department)
  if (!target || target === normalizeFilterText('全部')) return true
  return courseDepartmentTexts(course).some((item) => {
    const text = normalizeFilterText(item)
    return text.includes(target) || target.includes(text)
  })
}

function matchesStaticCourse(course, params = {}) {
  const keyword = String(params.keyword || '').trim().toLowerCase()
  const semester = normalizeCatalogTermForApi(params.semester || params.term || params.catalogTerm || '')
  const department = String(params.department || '').trim()
  const grade = String(params.grade || '').trim()
  const weekday = String(params.weekday || '').trim()
  const period = String(params.period || '').trim()
  const haystack = [course.name, course.course_name, course.teacher, course.instructor, course.serial, course.code, course.course_id, course.department, course.major, course.unit, course.opening_unit, course.category, course.class_name].join(' ').toLowerCase()
  if (keyword && !haystack.includes(keyword)) return false
  const courseTerm = normalizeCatalogTermForApi(course.semester_source || course.semester || course.term || course.source_term || course.catalog_term)
  if (semester && courseTerm !== semester) return false
  if (!departmentMatchesCourse(course, department)) return false
  if (grade && grade !== '全部' && String(course.grade || '') !== grade) return false
  const timeText = String(course.time_info || course.time_data || '')
  if (weekday && weekday !== '全部' && !timeText.includes(weekday)) return false
  if (period && period !== '全部' && !timeText.includes(String(period))) return false
  return true
}

let staticCoursesCache = null
let staticCoursesVersion = ''

async function resolveStaticCoursesVersion() {
  try {
    const response = await fetch('/data/course_versions.json', { cache: 'no-store' })
    if (!response.ok) return ''
    const payload = await response.json()
    return String(payload?.content_hash || payload?.generated_at || '').trim()
  } catch {
    return ''
  }
}

async function loadStaticCourses() {
  const version = await resolveStaticCoursesVersion()
  if (staticCoursesCache && staticCoursesVersion === version) return staticCoursesCache
  const suffix = version ? `?v=${encodeURIComponent(version)}` : `?v=${Date.now()}`
  const response = await fetch(`/data/courses.json${suffix}`, { cache: 'no-cache' })
  if (!response.ok) throw new Error('static courses unavailable')
  const payload = await response.json()
  staticCoursesCache = Array.isArray(payload) ? payload : (payload?.data || payload?.courses || [])
  staticCoursesVersion = version
  return staticCoursesCache
}

function buildStaticMetadata(courses = []) {
  const notClass = (item) => !/^[A-ZＡ-Ｚ]班?$|^[甲乙丙丁戊己庚辛壬癸]班?$|^[A-Z]$/i.test(String(item || '').trim())
  const unique = (items) => [...new Set(items.map((x) => String(x || '').trim()).filter(Boolean))]
  const departments = unique(courses.flatMap(courseDepartmentTexts)).filter(notClass).sort((a, b) => a.localeCompare(b, 'zh-Hant'))
  return {
    departments,
    departmentOptions: departments,
    majors: unique(courses.map((c) => c.major)).filter(notClass),
    units: unique(courses.map((c) => c.unit)).filter(notClass),
    openingUnits: unique(courses.map((c) => c.opening_unit || c.openingUnit)).filter(notClass),
    grades: unique(courses.map((c) => c.grade)).sort(),
    categories: unique(courses.map((c) => c.category)).sort((a, b) => a.localeCompare(b, 'zh-Hant')),
    semesters: unique(courses.map((c) => normalizeCatalogTermForApi(c.semester_source || c.semester || c.term || c.source_term || c.catalog_term))).filter(Boolean).sort(),
  }
}

function courseMergeKey(course = {}) {
  const term = normalizeCatalogTermForApi(course.semester_source || course.semester || course.term || course.source_term || course.catalog_term)
  const serial = String(course.serial || course.open_serial || course.openSerial || course.open_course_no || course.openCourseNo || course.開課序號 || course['開課序號'] || '').trim()
  const code = String(course.code || course.course_code || course.course_id || '').trim()
  const dept = String(course.department || course.dept || course.major || course.unit || course.opening_unit || course.openingUnit || '').trim()
  const cls = String(course.class_name || course.class || course.section || '').trim()
  const name = String(course.name || course.course_name || '').trim()
  const teacher = String(course.teacher || course.instructor || '').trim()
  return [term, dept, serial, code, cls, name, teacher].filter(Boolean).join(':')
}

function mergeCourseLists(...lists) {
  const map = new Map()
  lists.flat().filter(Boolean).forEach((course) => {
    const key = courseMergeKey(course)
    if (!key) return
    map.set(key, { ...(map.get(key) || {}), ...course })
  })
  return [...map.values()]
}

function mergeMetadataPayloads(...payloads) {
  const result = { departments: [], departmentOptions: [], majors: [], units: [], openingUnits: [], grades: [], categories: [], semesters: [] }
  const add = (key, values) => {
    result[key] = [...new Set([...(result[key] || []), ...(values || []).map((x) => String(x || '').trim()).filter(Boolean)])]
  }
  payloads.filter(Boolean).forEach((payload) => {
    add('departments', payload.departments || payload.departmentOptions)
    add('departmentOptions', payload.departmentOptions || payload.departments)
    add('majors', payload.majors)
    add('units', payload.units)
    add('openingUnits', payload.openingUnits)
    add('grades', payload.grades)
    add('categories', payload.categories)
    add('semesters', payload.semesters)
  })
  Object.keys(result).forEach((key) => {
    result[key] = result[key].sort((a, b) => String(a).localeCompare(String(b), 'zh-Hant'))
  })
  return result
}

function stableCourseCacheKey(params = {}) {
  const entries = Object.entries(params || {})
    .filter(([, value]) => value !== undefined && value !== null)
    .sort(([a], [b]) => a.localeCompare(b))
  return JSON.stringify(entries)
}

const courseResponseCache = new Map()
let metadataResponseCache = null

export async function fetchCourses(params = {}) {
  const cacheKey = stableCourseCacheKey(params)
  if (courseResponseCache.has(cacheKey)) return courseResponseCache.get(cacheKey)

  const request = (async () => {
    try {
      const { data } = await api.get('/courses', { params })
      const apiCourses = Array.isArray(data?.data) ? data.data : []
      // Neon/API 可能尚未同步最新學期；正式課程包才是完整學期集合。
      // 無論 API 是否成功，都合併靜態課程，避免 1151CLASS 被舊 Neon 資料遮蔽。
      const staticCourses = await loadStaticCourses()
      const filteredStatic = staticCourses.filter((course) => matchesStaticCourse(course, params))
      const filteredApi = apiCourses.filter((course) => matchesStaticCourse(course, params))
      const merged = mergeCourseLists(filteredStatic, filteredApi)
      return {
        ...data,
        ok: true,
        data: merged,
        total: merged.length,
        returned: merged.length,
        source: data?.source === 'local-patches-fallback'
          ? 'static-courses-plus-local-patches'
          : 'static-courses-plus-api',
      }
    } catch (error) {
      const staticCourses = await loadStaticCourses()
      const filtered = staticCourses.filter((course) => matchesStaticCourse(course, params))
      return { ok: true, data: filtered, total: filtered.length, returned: filtered.length, source: 'static-courses-fallback', warning: error?.message }
    }
  })()

  courseResponseCache.set(cacheKey, request)
  try {
    return await request
  } catch (error) {
    courseResponseCache.delete(cacheKey)
    throw error
  }
}

export async function fetchMetadata() {
  if (metadataResponseCache) return metadataResponseCache

  metadataResponseCache = (async () => {
    try {
      const { data } = await api.get('/courses/metadata')
      // Metadata 也必須固定合併靜態課程，否則 API 成功時不會出現 1151CLASS。
      const staticCourses = await loadStaticCourses()
      const staticMetadata = buildStaticMetadata(staticCourses)
      const merged = mergeMetadataPayloads(staticMetadata, data?.data || {})
      return {
        ...data,
        ok: true,
        data: merged,
        source: data?.source === 'local-patches-fallback'
          ? 'static-metadata-plus-local-patches'
          : 'static-metadata-plus-api',
      }
    } catch (error) {
      const staticCourses = await loadStaticCourses()
      return { ok: true, data: buildStaticMetadata(staticCourses), source: 'static-courses-fallback', warning: error?.message }
    }
  })()

  try {
    return await metadataResponseCache
  } catch (error) {
    metadataResponseCache = null
    throw error
  }
}

export async function fetchWelcomeState() {
  const { data } = await api.get('/user/welcome')
  return data
}

export async function completeWelcome() {
  const { data } = await api.put('/user/welcome', { hasSeenWelcome: true })
  return data
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

export async function importPatchedCourses(payload = {}) {
  const { data } = await api.post('/admin/courses/import-patches', payload)
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
