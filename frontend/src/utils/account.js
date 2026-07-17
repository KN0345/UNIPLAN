export const ADMIN_STUDENT_IDS = ['414730209']

export const PUBLIC_GUEST_USER = {
  studentId: 'local-alpha',
  role: 'student',
  offline: true,
  publicAlpha: true,
}

export function applyAdminRole(user) {
  if (!user || typeof user !== 'object') return user
  const studentId = String(user.studentId || user.student_id || user.id || '').trim()
  const isAdmin = ADMIN_STUDENT_IDS.includes(studentId)
  return { ...user, studentId: user.studentId || user.student_id || studentId, role: isAdmin ? 'super_admin' : (user.role === 'super_admin' || user.role === 'admin' ? 'student' : (user.role || 'student')) }
}
export function isSuperAdminUser(user) {
  return ADMIN_STUDENT_IDS.includes(String(user?.studentId || user?.student_id || '').trim()) || user?.role === 'super_admin'
}
function normalizeCatalogTerm(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''
  if (/1151CLASS|115\s*[_-]?\s*1|115\s*上|1151|115學年度上/i.test(raw)) return '1151CLASS'
  if (/114\s*[_-]?\s*1|114\s*上|1141|114學年度上|上學期|1CLASS/i.test(raw)) return '1141CLASS'
  if (/114\s*[_-]?\s*2|114\s*下|1142|114學年度下|下學期|2CLASS/i.test(raw)) return '1142CLASS'
  return raw
}
function courseCatalogTermValue(course) {
  const c = course?.course || course || {}
  return normalizeCatalogTerm(c.semester_source || c.semester || c.term || c.source_term || c.catalog_term)
}
function courseTermLabel(course) {
  const term = courseCatalogTermValue(course)
  return term ? catalogTermLabel(term).replace(' 學年度', '').replace('學期', '') : '未標示學期'
}
function courseMatchesSemester(course, semester) {
  const term = courseCatalogTermValue(course)
  return !term || term === catalogTermForSemester(semester)
}
const DAYS = ['一', '二', '三', '四', '五', '六', '日']
const PERIODS = Array.from({ length: 14 }, (_, i) => i + 1)
const TIMETABLE_ROW_HEIGHT = 56

export const TKU_PROGRAMS = {
  '2': '進學班',
  '3': '未知學制',
  '4': '學士生',
  '6': '碩士生',
  '7': '碩士在職專班 / 轉入大二',
  '8': '博士生 / 轉入大三',
}
export const TKU_IDENTITIES = {
  '0': '本地生',
  '1': '本地生',
  '2': '本地生',
  '3': '本地生',
  '4': '陸生',
  '5': '境外生',
  '6': '僑、港、澳生 / 身障生',
  '7': '轉學生（大二轉入）',
  '8': '轉學生（大三轉入）',
}

export const TKU_TRANSFER_GRADE_BY_IDENTITY = {
  '7': '大二',
  '8': '大三',
}
export const TKU_DEPARTMENTS = {
  '00': ['資訊與圖書館學系', '文學院'], '01': ['中國文學學系', '文學院'], '03': ['歷史學系', '文學院'], '04': ['資訊傳播學系', '文學院'], '05': ['大眾傳播學系', '文學院'],
  '08': ['法國語文學系', '外語學院'], '09': ['德國語文學系', '外語學院'], '10': ['日本語文學系', '外語學院'], '11': ['英文學系', '外語學院'], '12': ['西班牙語文學系', '外語學院'], '13': ['俄國語文學系', '外語學院'],
  '16': ['化學學系生物化學組', '理學院'], '17': ['化學學系材料化學組', '理學院'], '19': ['數學學系數學組', '理學院'], '20': ['數學學系資料科學與數理統計組', '理學院'], '21': ['物理學系光電物理組', '理學院'], '22': ['物理學系應用物理組', '理學院'], '23': ['尖端材料科學學士學位學程', '理學院'],
  '33': ['戰略所碩專班', '國際研究學院'], '35': ['機械與機電工程學系精密機械組', '工學院'], '36': ['建築學系', '工學院'], '37': ['機械與機電工程學系光機電整合組', '工學院'], '38': ['土木工程學系工程設施組', '工學院'], '40': ['化學工程與材料工程學系', '工學院'], '41': ['資訊工程學系', '工學院'], '43': ['航空太空工程學系', '工學院'], '44': ['電機工程學系電機資訊組', '工學院'], '48': ['水資源及環境工程學系水資源工程組', '工學院'], '49': ['電機工程學系電機通訊組', '工學院'], '50': ['電機工程學系電機與系統組', '工學院'], '51': ['水資源及環境工程學系環境工程組', '工學院'],
  '53': ['財務金融學系', '商管學院'], '54': ['產業經濟學系', '商管學院'], '55': ['國際企業學系經貿管理組', '商管學院'], '56': ['風險管理與保險學系', '商管學院'], '57': ['經濟學系', '商管學院'], '59': ['國際企業學系國際商學組', '商管學院'], '60': ['會計學系', '商管學院'], '61': ['企業管理學系', '商管學院'], '62': ['管理科學學系', '商管學院'], '63': ['資訊管理學系', '商管學院'], '64': ['公共行政學系', '商管學院'], '65': ['統計學系', '商管學院'], '66': ['運輸管理學系', '商管學院'], '68': ['全球財務管理全英語學士學位學程', '商管學院'],
  '71': ['教育與未來設計學系', '教育學院'], '73': ['教育科技學系', '教育學院'], '77': ['人工智慧學系', 'AI創智學院'], '80': ['外交與國際關係學系', '國際事務學院'], '81': ['英文學系全英語學士班', '外語學院'], '82': ['全球政治經濟學系', '國際事務學院'], '85': ['資訊工程學系全英語學士班', '工學院'], '86': ['國際觀光管理學系', '國際事務學院'],
}
export function calcTkuStudentCheckDigit(first8) {
  const weights = [1, 2, 1, 2, 1, 2, 1, 2]
  const sum = first8.split('').reduce((total, ch, index) => {
    const product = Number(ch) * weights[index]
    return total + (product >= 10 ? product - 9 : product)
  }, 0)
  return 9 - (sum % 10)
}
export function rocYearFromTkuCode(code) {
  const value = Number(code)
  return value <= 14 ? value + 100 : value
}
export function parseTkuStudentIdLocal(studentId) {
  const sid = String(studentId || '').trim()
  if (!sid) return null
  if (!/^\d{9}$/.test(sid)) return { valid: false, reason: '學號必須為 9 碼數字' }
  const expected = calcTkuStudentCheckDigit(sid.slice(0, 8))
  const actual = Number(sid[8])
  if (expected !== actual) return { valid: false, reason: `學號檢查碼錯誤，應為 ${expected}` }
  const departmentCode = sid.slice(3, 5)
  const dept = TKU_DEPARTMENTS[departmentCode]
  const admissionYear = rocYearFromTkuCode(sid.slice(1, 3))
  const identityCode = sid[5]
  const transferEntryGrade = TKU_TRANSFER_GRADE_BY_IDENTITY[identityCode] || ''
  return {
    valid: true,
    student_id: sid,
    program_code: sid[0],
    program_name: TKU_PROGRAMS[sid[0]] || '未知學制',
    admission_year: admissionYear,
    admission_ad_year: admissionYear + 1911,
    department_code: departmentCode,
    department_name: dept?.[0] || '待確認系所',
    college: dept?.[1] || '',
    identity_code: identityCode,
    identity_name: TKU_IDENTITIES[identityCode] || '未知身分',
    is_transfer: Boolean(transferEntryGrade),
    transfer_entry_grade: transferEntryGrade,
    start_grade: transferEntryGrade || '大一',
    start_semester: `${transferEntryGrade || '大一'}上`,
    department_sequence: sid.slice(6, 8),
    serial_number: sid.slice(6, 8),
    check_digit: sid[8],
  }
}



function accountUserKey(user) {
  if (!user) return 'guest'
  return user.studentId || user.student_id || user.id || 'guest'
}

export function safeJsonParse(value, fallback = null) {
  if (value === null || value === undefined || value === '' || value === 'undefined') return fallback
  try {
    return JSON.parse(value)
  } catch (error) {
    console.warn('UniPlan localStorage JSON parse failed; fallback applied.', error)
    return fallback
  }
}

export function readStorageJson(key, fallback = null) {
  if (typeof localStorage === 'undefined') return fallback
  return safeJsonParse(localStorage.getItem(key), fallback)
}

export function purgeRemovedStudentLocalData() {
  if (typeof localStorage === 'undefined') return
  const removedIds = ['414410653']
  const storedUser = safeJsonParse(localStorage.getItem('uniplan:user'), null)
  if (storedUser && removedIds.includes(String(storedUser.studentId || storedUser.id || ''))) {
    localStorage.removeItem('uniplan:user')
    localStorage.removeItem('uniplan:token')
  }
  for (const id of removedIds) localStorage.removeItem(`uniplan:profile:${id}`)
  const adminUsers = safeJsonParse(localStorage.getItem('uniplan:adminUsers'), null)
  if (Array.isArray(adminUsers)) {
    localStorage.setItem('uniplan:adminUsers', JSON.stringify(adminUsers.filter((item) => !removedIds.includes(String(item.studentId || item.id || '')))))
  }
}

export const DEFAULT_ACCOUNT_PROFILE = {
  displayName: '本機使用者',
  email: '',
  department: '',
  grade: '',
  admissionYear: '',
  studentStatus: '在學',
  boundEmail: false,
  boundGoogle: false,
  syncEnabled: true,
}

export function profileStorageKey(user) {
  return `uniplan:profile:${accountUserKey(user)}`
}

export function loadProfileForUser(user) {
  if (!user) return DEFAULT_ACCOUNT_PROFILE
  try {
    return { ...DEFAULT_ACCOUNT_PROFILE, ...(readStorageJson(profileStorageKey(user), null) || {}) }
  } catch {
    return DEFAULT_ACCOUNT_PROFILE
  }
}

export const LOCAL_ACCOUNTS_KEY = 'uniplan:localAccounts'

function normalizeStudentId(studentId) {
  return String(studentId || '').trim()
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function readLocalAccounts() {
  return readStorageJson(LOCAL_ACCOUNTS_KEY, {}) || {}
}

function writeLocalAccounts(accounts) {
  localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts || {}))
}

function encodePassword(password) {
  const raw = String(password || '')
  try {
    return btoa(unescape(encodeURIComponent(`uniplan-local:${raw}`)))
  } catch {
    return raw
  }
}

function publicUserFromAccount(account) {
  return applyAdminRole({
    studentId: account.studentId,
    role: account.role || 'student',
    offline: true,
    localAccount: true,
  })
}

export function localAccountExists(studentId) {
  const accounts = readLocalAccounts()
  return Boolean(accounts[normalizeStudentId(studentId)])
}

export function registerLocalAccount({ studentId, password, displayName, email, profile = {} }) {
  const sid = normalizeStudentId(studentId)
  if (!sid) throw new Error('請輸入學號')
  if (localAccountExists(sid)) throw new Error('此學號已建立本機帳號')
  if (String(password || '').length < 6) throw new Error('密碼至少需要 6 碼')
  const accounts = readLocalAccounts()
  const account = {
    studentId: sid,
    passwordHash: encodePassword(password),
    displayName: String(displayName || sid).trim(),
    email: normalizeEmail(email),
    role: ADMIN_STUDENT_IDS.includes(sid) ? 'super_admin' : 'student',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  accounts[sid] = account
  writeLocalAccounts(accounts)
  const user = publicUserFromAccount(account)
  const nextProfile = {
    ...DEFAULT_ACCOUNT_PROFILE,
    ...profile,
    displayName: account.displayName,
    email: account.email,
    boundEmail: Boolean(account.email),
    syncEnabled: true,
  }
  localStorage.setItem(profileStorageKey(user), JSON.stringify(nextProfile))
  return { user, profile: nextProfile }
}

export function loginLocalAccount(studentId, password) {
  const sid = normalizeStudentId(studentId)
  const account = readLocalAccounts()[sid]
  if (!account) throw new Error('找不到此本機帳號，請先註冊')
  if (account.passwordHash !== encodePassword(password)) throw new Error('密碼錯誤')
  const user = publicUserFromAccount(account)
  const profile = {
    ...DEFAULT_ACCOUNT_PROFILE,
    ...loadProfileForUser(user),
    displayName: loadProfileForUser(user).displayName || account.displayName || sid,
    email: loadProfileForUser(user).email || account.email || '',
    boundEmail: Boolean(loadProfileForUser(user).boundEmail || account.email),
  }
  return { user, profile }
}

export function resetLocalPassword(studentId, email, newPassword) {
  const sid = normalizeStudentId(studentId)
  const accounts = readLocalAccounts()
  const account = accounts[sid]
  if (!account) throw new Error('找不到此本機帳號')
  if (!account.email) throw new Error('此帳號尚未綁定 Email，無法使用本機忘記密碼')
  if (normalizeEmail(email) !== normalizeEmail(account.email)) throw new Error('Email 與註冊資料不一致')
  if (String(newPassword || '').length < 6) throw new Error('新密碼至少需要 6 碼')
  accounts[sid] = { ...account, passwordHash: encodePassword(newPassword), updatedAt: new Date().toISOString() }
  writeLocalAccounts(accounts)
  return true
}

export function academicBundleStorageKey(user) {
  return `uniplan:academic:${accountUserKey(user)}`
}

export function loadBoundAcademicBundle(user) {
  if (!user) return null
  return readStorageJson(academicBundleStorageKey(user), null)
}

export function saveBoundAcademicBundle(user, bundle) {
  if (!user?.studentId || !bundle) return
  localStorage.setItem(academicBundleStorageKey(user), JSON.stringify({
    ...bundle,
    boundStudentId: user.studentId,
    updatedAt: new Date().toISOString(),
  }))
}
