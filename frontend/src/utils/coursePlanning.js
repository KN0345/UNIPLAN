import { DEFAULT_RULES } from '../data/graduation/graduationRulesPreview'

export const YEARS = ['大一', '大二', '大三', '大四', '大五']
export const TERMS = ['上', '下']
export const SEMESTERS = YEARS.flatMap((year) => TERMS.map((term) => `${year}${term}`))
export const COURSE_CATALOG_TERMS = [
  { value: '', label: '全部' },
  { value: '1141CLASS', label: '114 學年度上學期' },
  { value: '1142CLASS', label: '114 學年度下學期' },
]
export function catalogTermForSemester(semester) {
  return String(semester || '').endsWith('下') ? '1142CLASS' : '1141CLASS'
}
export function catalogTermLabel(value) {
  return COURSE_CATALOG_TERMS.find((item) => item.value === value)?.label || value || '全部學期'
}

export function normalizeCatalogTerm(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''
  if (/114\s*[_-]?\s*1|114\s*上|1141|114學年度上|上學期|1CLASS/i.test(raw)) return '1141CLASS'
  if (/114\s*[_-]?\s*2|114\s*下|1142|114學年度下|下學期|2CLASS/i.test(raw)) return '1142CLASS'
  return raw
}
export function courseCatalogTermValue(course) {
  const c = course?.course || course || {}
  return normalizeCatalogTerm(c.semester_source || c.semester || c.term || c.source_term || c.catalog_term)
}
export function courseTermLabel(course) {
  const term = courseCatalogTermValue(course)
  return term ? catalogTermLabel(term).replace(' 學年度', '').replace('學期', '') : '未標示學期'
}
export function courseMatchesSemester(course, semester) {
  const term = courseCatalogTermValue(course)
  return !term || term === catalogTermForSemester(semester)
}
export const DAYS = ['一', '二', '三', '四', '五', '六', '日']
export const PERIODS = Array.from({ length: 14 }, (_, i) => i + 1)
export const TIMETABLE_ROW_HEIGHT = 56

export const PERIOD_CLOCK = {
  1: ['08:10', '09:00'], 2: ['09:10', '10:00'], 3: ['10:10', '11:00'], 4: ['11:10', '12:00'],
  5: ['13:10', '14:00'], 6: ['14:10', '15:00'], 7: ['15:10', '16:00'], 8: ['16:10', '17:00'],
  9: ['17:10', '18:00'], 10: ['18:10', '19:00'], 11: ['19:10', '20:00'], 12: ['20:10', '21:00'],
  13: ['21:10', '22:00'], 14: ['22:10', '23:00'],
}
export const STATUS = {
  planned: { label: '正常排程', tone: 'blue' },
  completed: { label: '已修過', tone: 'green' },
  failed: { label: '已被當', tone: 'red' },
}
export const STATUS_ORDER = ['planned', 'completed', 'failed']
export const CATEGORY_TONES = {
  universityRequired: 'catUniversity',
  collegeRequired: 'catCollege',
  departmentRequired: 'catDepartment',
  departmentElective: 'catElective',
  freeElective: 'catFree',
}
const TEACHER_TAGS = ['佛系', '考試派', '報告派', '作業多', '點名嚴', '給分甜', '硬課', '實作多']
export const SYLLABUS_TEMPLATE = 'https://webp1.emis.tku.edu.tw/{year}_{term}/{year}_{term}_{serial}.PDF'

export function courseRecommendationBadges(course, context = {}) {
  const c = getCourse(course)
  const text = `${c.name || ''} ${c.category || ''} ${c.department || ''} ${c.major || ''}`
  const badges = []
  if (context.isFavorite) badges.push('收藏相關')
  if (/必修|必選修|系訂/.test(text)) badges.push('缺學分')
  if (/程式|資料|演算法|人工智慧|AI|統計|專題/.test(text)) badges.push('課程樹')
  if (!context.hasConflict) badges.push('推薦')
  return badges
}

export function courseSmartScore(course, context = {}) {
  const badges = courseRecommendationBadges(course, context)
  let score = 0
  if (badges.includes('缺學分')) score += 60
  if (context.isFavorite) score += 30
  if (badges.includes('課程樹')) score += 12
  if (!context.hasConflict) score += 8
  score += Math.min(6, credits(course) || 0)
  return score
}


export function extractCourseList(payload) {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.items)) return payload.items
  if (Array.isArray(payload.courses)) return payload.courses
  if (Array.isArray(payload.results)) return payload.results
  if (Array.isArray(payload.data?.items)) return payload.data.items
  if (Array.isArray(payload.data?.courses)) return payload.data.courses
  if (Array.isArray(payload.data?.results)) return payload.data.results
  return []
}


export function makePlan() {
  return SEMESTERS.reduce((acc, semester) => ({ ...acc, [semester]: [] }), {})
}

export function sanitizePlan(rawPlan) {
  const base = makePlan()
  if (!rawPlan || typeof rawPlan !== 'object' || Array.isArray(rawPlan)) return base
  const cleaned = { ...base }
  for (const sem of SEMESTERS) {
    const list = Array.isArray(rawPlan[sem]) ? rawPlan[sem] : []
    cleaned[sem] = list
      .filter((item) => item && typeof item === 'object')
      .slice(0, 120)
  }
  return cleaned
}

export function sanitizeCourseList(rawList) {
  return Array.isArray(rawList)
    ? rawList.filter((item) => item && typeof item === 'object').slice(0, 500)
    : []
}

export function safeBackgroundImageValue(value) {
  const raw = String(value || '')
  if (!raw || raw === 'none') return ''
  // Avoid locking the app if an old localStorage image is malformed or far too large.
  if (!raw.startsWith('data:image/') || raw.length > 8_000_000) return ''
  return raw
}

export function getCourse(course) {
  return course?.course || course || {}
}

export function uid(course) {
  const c = getCourse(course)
  return String(c.uid || c.instanceId || `${c.semester_source || ''}-${c.serial || c.code || c.name || Math.random()}`)
}

export function courseKey(course) {
  const c = getCourse(course)
  const base = String(c.serial || c.code || c.course_id || c.id || `${c.name || ''}-${c.teacher || ''}-${c.time_info || c.time || ''}`).trim()
  const term = courseCatalogTermValue(c)
  return term ? `${term}:${base}` : base
}

export function reviewKey(course) {
  return courseKey(course) || String(getCourse(course).name || 'unknown')
}

export function userKey(user) {
  return String(user?.studentId || user?.id || 'guest')
}

export function tagCount(tagVotes, teacher, tag) {
  return Object.keys(tagVotes || {}).filter((key) => key.startsWith(`${teacher}:${tag}:`) && tagVotes[key]).length
}

export function userVotedTag(tagVotes, teacher, tag, userId) {
  return Boolean(tagVotes?.[`${teacher}:${tag}:${userId}`])
}

export function isCourseAlreadyPlanned(plan, course) {
  const key = courseKey(course)
  if (!key) return false
  return Object.values(plan)
    .filter(Array.isArray)
    .flat()
    .some((item) => courseStatus(item) !== 'failed' && courseKey(item) === key)
}

export function isCourseFailedRecord(course) {
  return courseStatus(course) === 'failed'
}

export function courseStatus(course) {
  return course?.planningStatus || 'planned'
}

export function setCourseStatus(course, status) {
  const c = getCourse(course)
  return { ...c, planningStatus: status, instanceId: course.instanceId || `${uid(course)}-${Date.now()}` }
}

export function normalizeSlot(slot) {
  if (!slot) return null
  if (Array.isArray(slot)) return { day: Number(slot[0]), start: Number(slot[1]), end: Number(slot[2] ?? slot[1]) }
  return { day: Number(slot.day ?? slot.weekday), start: Number(slot.start ?? slot.period), end: Number(slot.end ?? slot.period ?? slot.start) }
}

function parsePeriods(segment = '') {
  const values = []
  const text = String(segment || '')
  const rangePattern = /(\d{1,2})\s*[-~－～]\s*(\d{1,2})/g
  let match
  while ((match = rangePattern.exec(text))) {
    const start = Number(match[1])
    const end = Number(match[2])
    if (start && end) {
      for (let i = Math.min(start, end); i <= Math.max(start, end); i += 1) values.push(i)
    }
  }
  const noRanges = text.replace(rangePattern, ' ')
  ;(noRanges.match(/\d{1,2}/g) || []).forEach((num) => {
    const value = Number(num)
    if (value) values.push(value)
  })
  return [...new Set(values)].sort((a, b) => a - b)
}

function periodsToSlots(day, periods = []) {
  const sorted = [...new Set(periods)].sort((a, b) => a - b)
  const slots = []
  let start = null
  let prev = null
  sorted.forEach((period) => {
    if (start === null) {
      start = period
      prev = period
      return
    }
    if (period === prev + 1) {
      prev = period
      return
    }
    slots.push({ day, start, end: prev })
    start = period
    prev = period
  })
  if (start !== null) slots.push({ day, start, end: prev })
  return slots
}

export function slotsOf(course) {
  const c = getCourse(course)
  if (Array.isArray(c.time_slots) || Array.isArray(c.timeSlots)) {
    return (c.time_slots || c.timeSlots).map(normalizeSlot).filter((s) => s?.day && s?.start)
  }
  const text = String(c.time_info || c.time || c.time_data || '')
  if (!text) return []
  const pattern = /(?:[週星]期?\s*)?([一二三四五六日])\s*(?:[/／:：]|第|\s)\s*([^一二三四五六日]*)/g
  const slots = []
  let match
  while ((match = pattern.exec(text))) {
    const day = DAYS.indexOf(match[1]) + 1
    const segment = match[2] || ''
    const periods = parsePeriods(segment).filter((p) => p >= 1 && p <= 14)
    if (day && periods.length) slots.push(...periodsToSlots(day, periods))
  }
  if (slots.length) return slots
  const dayMatch = text.match(/[週星]期?([一二三四五六日])/)
  const periods = parsePeriods(text).filter((p) => p >= 1 && p <= 14)
  if (!dayMatch || !periods.length) return []
  return periodsToSlots(DAYS.indexOf(dayMatch[1]) + 1, periods)
}

export function hasConflict(a, b) {
  return slotsOf(a).some((x) => slotsOf(b).some((y) => x.day === y.day && Math.max(x.start, y.start) <= Math.min(x.end, y.end)))
}

export function findConflict(course, courses) {
  return courses.filter((c) => courseStatus(c) !== 'failed').find((c) => hasConflict(course, c))
}

export function credits(course) {
  return Number(getCourse(course).credits || getCourse(course).credit || 0)
}

export function effectiveCourses(plan) {
  if (!plan || typeof plan !== 'object') return []
  return Object.values(plan)
    .filter(Array.isArray)
    .flat()
    .filter((c) => c && courseStatus(c) !== 'failed')
    .filter((c) => !(getCourse(c).manual && getCourse(c).includeGraduation === false))
}

export function creditCategory(course) {
  const c = getCourse(course)
  if (c.creditCategory) return c.creditCategory
  const text = `${c.category || ''} ${c.group_type || ''} ${c.department || ''} ${c.name || ''}`
  if (/院必|院級/.test(text)) return 'collegeRequired'
  if (/系必|必修|\(必\)|\(R\)/.test(text)) return 'departmentRequired'
  if (/通識|共同|校必|英文|外國語文|中國語文|探索永續|人工智慧導論|體育|國防|服務學習/.test(text)) return 'universityRequired'
  if (/系選|選修|\(選\)|\(E\)/.test(text)) return 'departmentElective'
  return 'freeElective'
}

export function creditSummary(plan, rules = DEFAULT_RULES) {
  const courses = effectiveCourses(plan)
  const total = courses.reduce((sum, c) => sum + credits(c), 0)
  const completed = courses.filter((c) => courseStatus(c) === 'completed').reduce((sum, c) => sum + credits(c), 0)
  const planned = courses.filter((c) => courseStatus(c) !== 'completed').reduce((sum, c) => sum + credits(c), 0)
  const byCat = Object.fromEntries(rules.categories.map((cat) => [cat.key, 0]))
  const byCatCompleted = Object.fromEntries(rules.categories.map((cat) => [cat.key, 0]))
  courses.forEach((course) => {
    const key = creditCategory(course)
    byCat[key] = (byCat[key] || 0) + credits(course)
    if (courseStatus(course) === 'completed') byCatCompleted[key] = (byCatCompleted[key] || 0) + credits(course)
  })
  return { total, completed, planned, percent: Math.min(100, Math.round((total / rules.totalCredits) * 100)), byCat, byCatCompleted }
}

export function courseSemesterParts(course) {
  const raw = String(getCourse(course).semester_source || getCourse(course).semester || '')
  const match = raw.match(/(\d{3})[^0-9]?(1|2)/) || raw.match(/(\d{3})(1|2)/)
  return match ? { year: match[1], term: match[2] } : { year: '114', term: '2' }
}

export function syllabusUrl(course) {
  const c = getCourse(course)
  if (c.syllabus_url || c.plan_url) return c.syllabus_url || c.plan_url
  if (!c.serial) return ''
  const { year, term } = courseSemesterParts(c)
  return SYLLABUS_TEMPLATE.replaceAll('{year}', year).replaceAll('{term}', term).replaceAll('{serial}', encodeURIComponent(c.serial))
}

export function semesterWarnings(semester, courses, plan) {
  const active = courses.filter((c) => courseStatus(c) !== 'failed')
  const warnings = []
  const total = active.reduce((sum, c) => sum + credits(c), 0)
  if (total > 25) warnings.push(`${semester} ${total} 學分，超過建議上限`)
  if (total > 0 && total < 9) warnings.push(`${semester} ${total} 學分，低於建議下限`)
  active.forEach((a, i) => active.slice(i + 1).forEach((b) => hasConflict(a, b) && warnings.push(`衝堂：${getCourse(a).name} 與 ${getCourse(b).name}`)))
  const failed = courses.filter((c) => courseStatus(c) === 'failed')
  if (failed.length) warnings.push(`${semester} 有 ${failed.length} 門已被當，不計入有效學分`)
  return [...new Set(warnings)]
}

export function occupied(courses) {
  const set = new Set()
  courses.filter((c) => courseStatus(c) !== 'failed').forEach((course) => slotsOf(course).forEach((slot) => {
    for (let p = slot.start; p <= slot.end; p += 1) set.add(`${slot.day}-${p}`)
  }))
  return set
}

export function freeBlocks(courses) {
  const occ = occupied(courses)
  const blocks = []
  DAYS.slice(0, 5).forEach((day, di) => {
    let start = null
    PERIODS.slice(0, 10).forEach((period) => {
      const free = !occ.has(`${di + 1}-${period}`)
      if (free && start === null) start = period
      if (!free && start !== null) {
        blocks.push({ day, start, end: period - 1, length: period - start })
        start = null
      }
    })
    if (start !== null) blocks.push({ day, start, end: 10, length: 11 - start })
  })
  return blocks
}

export function emptyQualitySuggestions(courses) {
  const blocks = freeBlocks(courses).filter((block) => block.length >= 1)
  if (!blocks.length) return [{ tone: 'mid', title: '空堂較少', text: '本學期課程較集中，注意連續上課造成疲勞。' }]
  return blocks.slice(0, 8).map((block) => {
    const label = `週${block.day} 第${block.start}${block.start === block.end ? '' : `-${block.end}`}節`
    if (block.length >= 3) return { tone: 'good', title: label, text: `${block.length} 節連續空堂，適合自習、午餐或處理社團活動。` }
    if (block.length === 2) return { tone: 'mid', title: label, text: '2 節空堂，可作為短讀書或通勤緩衝。' }
    return { tone: 'weak', title: label, text: '單節空堂容易破碎，可考慮調整課程集中度。' }
  })
}

export function semesterCreditStatus(courses) {
  const total = courses.filter((c) => courseStatus(c) !== 'failed').reduce((sum, c) => sum + credits(c), 0)
  if (total >= 25) return { tone: 'danger', label: `${total} 學分｜過重` }
  if (total >= 22) return { tone: 'warn', label: `${total} 學分｜偏重` }
  if (total >= 12) return { tone: 'safe', label: `${total} 學分｜安全` }
  if (total > 0) return { tone: 'warn', label: `${total} 學分｜偏低` }
  return { tone: 'muted', label: '尚未排課' }
}

export function riskScore(semester, courses, plan) {
  const active = courses.filter((c) => courseStatus(c) !== 'failed')
  const c = active.reduce((sum, item) => sum + credits(item), 0)
  let score = 0
  const reasons = []
  if (c > 22) { score += 28; reasons.push('學分偏重') }
  else if (c > 18) { score += 12; reasons.push('學分略重') }
  const early = active.filter((item) => slotsOf(item).some((slot) => slot.start <= 2)).length
  if (early >= 3) { score += 22; reasons.push('早課較多') }
  else if (early) { score += 8; reasons.push('含早課') }
  const warnings = semesterWarnings(semester, courses, plan)
  score += warnings.length * 16
  reasons.push(...warnings.slice(0, 2))
  return { score: Math.min(100, score), reasons: reasons.length ? reasons : ['目前穩定'] }
}

export function download(filename, content, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}


export function csvEscape(value = '') {
  const text = String(value ?? '')
  return `"${text.replaceAll('"', '""')}"`
}

export function icsEscape(value = '') {
  return String(value ?? '').replaceAll('\\', '\\\\').replaceAll(';', '\\;').replaceAll(',', '\\,').replaceAll('\n', '\\n')
}

export function nextMondayDate() {
  const d = new Date()
  const diff = (8 - d.getDay()) % 7 || 7
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function toIcsDate(date, time) {
  const [hh, mm] = time.split(':').map(Number)
  const d = new Date(date)
  d.setHours(hh, mm, 0, 0)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
}

export function exportExcel(plan, semester = '') {
  const entries = semester ? [[semester, plan[semester] || []]] : Object.entries(plan)
  const header = ['學期', '開課序號', '課號', '課名', '教師', '學分', '時間', '狀態']
  const rows = entries.flatMap(([sem, courses]) => courses.map((course) => {
    const c = getCourse(course)
    return [sem, c.serial || '', c.code || '', c.name || '', c.teacher || '', credits(c), c.time_info || c.time || '', STATUS[courseStatus(course)]?.label || '正常排程']
  }))
  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\r\n')
  download(`${semester || 'uniplan'}_課表.csv`, `\ufeff${csv}`, 'text/csv;charset=utf-8')
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    if (!src) { resolve(null); return }
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}



export function extractCssUrls(value = '') {
  const urls = []
  const pattern = /url\((['"]?)(.*?)\1\)/g
  let match
  while ((match = pattern.exec(String(value)))) {
    if (match[2]) urls.push(match[2])
  }
  return urls
}

export function blobToDataUrl(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => resolve(null)
    reader.readAsDataURL(blob)
  })
}

async function imageUrlToDataUrl(src) {
  if (!src) return null
  if (src.startsWith('data:') || src.startsWith('blob:')) return src
  try {
    const response = await fetch(src, { mode: 'cors', credentials: 'omit' })
    if (!response.ok) return null
    const blob = await response.blob()
    return await blobToDataUrl(blob)
  } catch {
    return null
  }
}

async function sanitizeExportCloneImages(source, target) {
  if (!(source instanceof Element) || !(target instanceof Element)) return

  if (source instanceof HTMLImageElement && target instanceof HTMLImageElement) {
    const dataUrl = await imageUrlToDataUrl(source.currentSrc || source.src)
    if (dataUrl) target.setAttribute('src', dataUrl)
    else target.removeAttribute('src')
  }

  const sourceStyle = window.getComputedStyle(source)
  const bgImage = sourceStyle.getPropertyValue('background-image') || ''
  const urls = extractCssUrls(bgImage)
  if (urls.length) {
    let safeBgImage = bgImage
    for (const rawUrl of urls) {
      const dataUrl = await imageUrlToDataUrl(rawUrl)
      if (dataUrl) safeBgImage = safeBgImage.replace(rawUrl, dataUrl)
      else safeBgImage = 'none'
    }
    target.style.setProperty('background-image', safeBgImage, 'important')
  }

  const sourceChildren = Array.from(source.children)
  const targetChildren = Array.from(target.children)
  for (let i = 0; i < sourceChildren.length; i += 1) {
    await sanitizeExportCloneImages(sourceChildren[i], targetChildren[i])
  }
}

export function canvasToBlobSafe(canvas) {
  return new Promise((resolve) => {
    try {
      canvas.toBlob((blob) => resolve(blob), 'image/png')
    } catch {
      resolve(null)
    }
  })
}

export function inlineComputedStyles(source, target) {
  if (!(source instanceof Element) || !(target instanceof Element)) return
  const computed = window.getComputedStyle(source)
  let cssText = ''
  for (const prop of computed) {
    cssText += `${prop}:${computed.getPropertyValue(prop)};`
  }
  target.setAttribute('style', `${target.getAttribute('style') || ''};${cssText}`)
  Array.from(source.children).forEach((child, index) => inlineComputedStyles(child, target.children[index]))
}

async function waitForImages(root) {
  const images = Array.from(root.querySelectorAll('img'))
  await Promise.all(images.map((img) => img.complete ? Promise.resolve() : new Promise((resolve) => {
    img.onload = resolve
    img.onerror = resolve
  })))
  if (document.fonts?.ready) await document.fonts.ready
}

export function cssColorToRgba(color, fallback = [15, 27, 50, 1]) {
  const raw = String(color || '').trim()
  if (!raw) return fallback
  if (raw.startsWith('#')) {
    const hex = raw.slice(1)
    const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex
    const value = Number.parseInt(full.slice(0, 6), 16)
    if (!Number.isNaN(value)) return [(value >> 16) & 255, (value >> 8) & 255, value & 255, 1]
  }
  const match = raw.match(/rgba?\(([^)]+)\)/i)
  if (match) {
    const parts = match[1].split(',').map((v) => Number.parseFloat(v.trim()))
    if (parts.length >= 3 && parts.every((v, i) => i > 2 || !Number.isNaN(v))) return [parts[0], parts[1], parts[2], Number.isFinite(parts[3]) ? parts[3] : 1]
  }
  return fallback
}

export function rgbaString([r, g, b, a = 1], alpha = a) {
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${Math.max(0, Math.min(1, alpha))})`
}

export function readCurrentAppearance() {
  const bodyStyle = window.getComputedStyle(document.body)
  const rootStyle = window.getComputedStyle(document.documentElement)
  const theme = document.body.dataset.uiTheme || localStorage.getItem('uniplan:uiTheme') || 'clean'
  const panel = bodyStyle.getPropertyValue('--panel').trim() || '#111d31'
  const panel2 = bodyStyle.getPropertyValue('--panel2').trim() || '#1b2a44'
  const text = bodyStyle.getPropertyValue('--text').trim() || '#eff6ff'
  const muted = bodyStyle.getPropertyValue('--muted').trim() || '#9fb0cc'
  const border = bodyStyle.getPropertyValue('--border').trim() || '#2f4362'
  const accent = bodyStyle.getPropertyValue('--button-accent').trim() || bodyStyle.getPropertyValue('--accent').trim() || '#2563eb'
  const timetableBg = localStorage.getItem('uniplan:timetableBg') || ''
  const timetableOpacity = Number.parseFloat(rootStyle.getPropertyValue('--timetable-opacity')) || Number.parseFloat(localStorage.getItem('uniplan:timetableOpacity') || '0') || 0
  const courseCardOpacity = Number.parseFloat(rootStyle.getPropertyValue('--course-card-alpha')) || Number.parseFloat(localStorage.getItem('uniplan:courseCardOpacity') || '.72') || .72
  let tint = rootStyle.getPropertyValue('--timetable-tint').trim() || localStorage.getItem('uniplan:timetableTint') || ''
  if (!tint || tint.toLowerCase() === '#ffffff' || tint.toLowerCase() === '#fff') tint = panel
  return { theme, panel, panel2, text, muted, border, accent, timetableBg, timetableOpacity, courseCardOpacity, tint }
}

export function loadImageSafe(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null)
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

export function drawCoverImage(ctx, img, x, y, w, h) {
  if (!img) return
  const scale = Math.max(w / img.width, h / img.height)
  const sw = w / scale
  const sh = h / scale
  const sx = (img.width - sw) / 2
  const sy = (img.height - sh) / 2
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}

export function stripUnsafeExternalUrlsFromMarkup(markup) {
  return String(markup || '').replace(/url\((['"]?)(.*?)\1\)/g, (match, quote, rawUrl) => {
    const url = String(rawUrl || '').trim()
    if (!url || url.startsWith('data:') || url.startsWith('blob:')) return match
    return 'none'
  }).replace(/\s(?:src|href)=(['"])(https?:\/\/|\/\/)[^'"]*\1/g, '')
}

export async function exportPngFromDom(element, semester = '課表') {
  if (!element) {
    alert('找不到目前課表畫面，無法匯出 PNG。')
    return
  }
  await waitForImages(element)
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

  const rect = element.getBoundingClientRect()
  const width = Math.ceil(rect.width)
  const height = Math.ceil(rect.height)
  const clone = element.cloneNode(true)
  clone.classList.add('exportClone')
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
  inlineComputedStyles(element, clone)
  await sanitizeExportCloneImages(element, clone)
  clone.style.width = `${width}px`
  clone.style.height = `${height}px`
  clone.style.margin = '0'
  clone.style.transform = 'none'
  clone.style.position = 'relative'
  clone.style.left = '0'
  clone.style.top = '0'

  let serialized = new XMLSerializer().serializeToString(clone)
  serialized = stripUnsafeExternalUrlsFromMarkup(serialized)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <foreignObject width="100%" height="100%">${serialized}</foreignObject>
    </svg>`
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)
  try {
    const img = await loadImage(url)
    const scale = Math.max(2, Math.min(3, window.devicePixelRatio || 2))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(width * scale)
    canvas.height = Math.round(height * scale)
    const ctx = canvas.getContext('2d')
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)
    const blob = await canvasToBlobSafe(canvas)
    if (!blob) throw new Error('canvas export failed')
    const pngUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = pngUrl
    a.download = `${semester}_課表.png`
    a.click()
    URL.revokeObjectURL(pngUrl)
  } catch (error) {
    console.error(error)
    try {
      const safeClone = element.cloneNode(true)
      safeClone.classList.add('exportClone')
      safeClone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
      inlineComputedStyles(element, safeClone)
      safeClone.querySelectorAll('*').forEach((node) => {
        if (node instanceof HTMLElement) {
          node.style.backgroundImage = 'none'
          node.style.setProperty('--timetable-bg-image', 'none')
        }
        if (node instanceof HTMLImageElement) node.removeAttribute('src')
      })
      safeClone.style.width = `${width}px`
      safeClone.style.height = `${height}px`
      safeClone.style.margin = '0'
      safeClone.style.transform = 'none'
      safeClone.style.position = 'relative'
      safeClone.style.left = '0'
      safeClone.style.top = '0'
      let safeSerialized = new XMLSerializer().serializeToString(safeClone)
      safeSerialized = stripUnsafeExternalUrlsFromMarkup(safeSerialized)
      const safeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><foreignObject width="100%" height="100%">${safeSerialized}</foreignObject></svg>`
      const safeUrl = URL.createObjectURL(new Blob([safeSvg], { type: 'image/svg+xml;charset=utf-8' }))
      const safeImg = await loadImage(safeUrl)
      const scale = Math.max(2, Math.min(3, window.devicePixelRatio || 2))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(width * scale)
      canvas.height = Math.round(height * scale)
      const ctx = canvas.getContext('2d')
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(safeImg, 0, 0, width, height)
      const blob = await canvasToBlobSafe(canvas)
      URL.revokeObjectURL(safeUrl)
      if (!blob) throw new Error('safe canvas export failed')
      const pngUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = pngUrl
      a.download = `${semester}_課表.png`
      a.click()
      URL.revokeObjectURL(pngUrl)
    } catch (fallbackError) {
      console.error(fallbackError)
      alert('PNG 匯出失敗。已略過外部圖片仍無法輸出，請先移除背景圖片或改用本機匯入圖片。')
    }
  } finally {
    URL.revokeObjectURL(url)
  }
}



export async function exportCleanPng(plan, semester = '課表') {
  // Use the deterministic canvas renderer as the primary export path.
  // The previous DOM/foreignObject export was fragile with backdrop-filter,
  // custom timetable backgrounds, overflow containers, and Cloudflare preview domains.
  // Keeping the canvas path first prevents blank / clipped PNG output.
  const courses = plan[semester] || []
  const appearance = readCurrentAppearance()
  const width = 1420
  const headerRowH = 58
  const rowH = 76
  const timeW = 92
  const gridW = width
  const gridH = headerRowH + rowH * 10
  const dayW = (gridW - timeW) / DAYS.length
  const canvas = document.createElement('canvas')
  canvas.width = gridW * 2
  canvas.height = gridH * 2
  const ctx = canvas.getContext('2d')
  ctx.scale(2, 2)
  ctx.clearRect(0, 0, gridW, gridH)

  const roundRect = (x, y, w, h, r) => {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
  }

  const panel = cssColorToRgba(appearance.panel, [17, 29, 49, 1])
  const panel2 = cssColorToRgba(appearance.panel2, [27, 42, 68, 1])
  const text = cssColorToRgba(appearance.text, [239, 246, 255, 1])
  const muted = cssColorToRgba(appearance.muted, [159, 176, 204, 1])
  const border = cssColorToRgba(appearance.border, [47, 67, 98, 1])
  const tint = cssColorToRgba(appearance.tint, panel)
  const tableOpacity = Math.max(0, Math.min(1, appearance.timetableOpacity))
  const frost = Math.max(0, Math.min(1, appearance.courseCardOpacity))

  ctx.save()
  roundRect(0, 0, gridW, gridH, 16)
  ctx.clip()

  const base = ctx.createLinearGradient(0, 0, gridW, gridH)
  base.addColorStop(0, rgbaString(panel2, 1))
  base.addColorStop(.62, rgbaString(panel, 1))
  base.addColorStop(1, rgbaString(panel2, 1))
  ctx.fillStyle = base
  ctx.fillRect(0, 0, gridW, gridH)

  const img = await loadImageSafe(appearance.timetableBg)
  if (img) {
    ctx.globalAlpha = Math.max(0, 1 - tableOpacity)
    drawCoverImage(ctx, img, 0, 0, gridW, gridH)
    ctx.globalAlpha = 1
    ctx.fillStyle = rgbaString([8, 15, 28, 1], .34 * (1 - tableOpacity))
    ctx.fillRect(0, 0, gridW, gridH)
  }

  if (tableOpacity > 0) {
    ctx.fillStyle = rgbaString(tint, tableOpacity)
    ctx.fillRect(0, 0, gridW, gridH)
  }

  ctx.fillStyle = rgbaString([255, 255, 255, 1], .035)
  ctx.fillRect(0, 0, gridW, headerRowH)
  ctx.fillRect(0, 0, timeW, gridH)

  ctx.strokeStyle = rgbaString(border, .58)
  ctx.lineWidth = 1
  for (let i = 0; i <= DAYS.length; i += 1) {
    const x = timeW + i * dayW
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, gridH); ctx.stroke()
  }
  ctx.beginPath(); ctx.moveTo(0, headerRowH); ctx.lineTo(gridW, headerRowH); ctx.stroke()
  for (let r = 0; r <= 10; r += 1) {
    const y = headerRowH + r * rowH
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(gridW, y); ctx.stroke()
  }

  ctx.fillStyle = rgbaString(text, .96)
  ctx.font = '800 18px Inter, Noto Sans TC, sans-serif'
  ctx.fillText('節', 36, 36)
  DAYS.forEach((d, i) => {
    const x = timeW + i * dayW
    ctx.fillText(`週${d}`, x + 20, 36)
  })
  ctx.font = '800 17px Inter, Noto Sans TC, sans-serif'
  for (let r = 0; r < 10; r += 1) {
    const y = headerRowH + r * rowH
    ctx.fillText(`${r + 1}`, 36, y + 44)
  }

  const drawTextFit = (textValue, x, y, maxWidth, lineHeight, maxLines = 2) => {
    const chars = String(textValue || '').split('')
    let line = ''
    let lines = []
    chars.forEach((ch) => {
      const test = line + ch
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line)
        line = ch
      } else line = test
    })
    if (line) lines.push(line)
    const original = lines.join('')
    lines = lines.slice(0, maxLines)
    lines.forEach((ln, idx) => {
      const clipped = idx === maxLines - 1 && original.length > lines.join('').length
      ctx.fillText(clipped ? `${ln.slice(0, Math.max(1, ln.length - 1))}…` : ln, x, y + idx * lineHeight)
    })
  }

  courses.filter((course) => courseStatus(course) !== 'failed').forEach((course) => {
    const c = getCourse(course)
    slotsOf(course).forEach((slot) => {
      if (slot.start > 10 || !slot.day) return
      const safeEnd = Math.min(10, slot.end || slot.start)
      const span = Math.max(1, safeEnd - slot.start + 1)
      const x = timeW + (slot.day - 1) * dayW + 10
      const y = headerRowH + (slot.start - 1) * rowH + 10
      const h = Math.max(48, span * rowH - 20)
      const w = dayW - 20
      const tone = STATUS[courseStatus(course)]?.tone || 'blue'
      const dot = tone === 'green' ? '#34d399' : tone === 'red' ? '#fb7185' : tone === 'yellow' ? '#fbbf24' : appearance.accent || '#60a5fa'

      roundRect(x, y, w, h, 12)
      const cardGradient = ctx.createLinearGradient(x, y, x, y + h)
      cardGradient.addColorStop(0, `rgba(54, 70, 105, ${0.40 + 0.34 * frost})`)
      cardGradient.addColorStop(1, `rgba(18, 30, 58, ${0.32 + 0.26 * frost})`)
      ctx.fillStyle = cardGradient
      ctx.fill()
      ctx.strokeStyle = `rgba(198, 214, 241, ${0.14 + 0.20 * frost})`
      ctx.lineWidth = 1.1
      ctx.stroke()
      if (frost > 0) {
        ctx.fillStyle = `rgba(255,255,255,${0.08 * frost})`
        roundRect(x + 1, y + 1, w - 2, Math.max(10, h * .28), 10)
        ctx.fill()
      }

      ctx.fillStyle = dot
      ctx.beginPath()
      ctx.arc(x + 17, y + 18, 5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = rgbaString(text, .98)
      ctx.font = '900 15px Inter, Noto Sans TC, sans-serif'
      drawTextFit(c.name || '課程', x + 30, y + 23, w - 44, 17, h > 70 ? 2 : 1)
      ctx.font = '600 12px Inter, Noto Sans TC, sans-serif'
      ctx.fillStyle = rgbaString(muted, .94)
      const metaY = h > 70 ? y + Math.min(h - 18, 62) : y + 44
      ctx.fillText(`${c.classroom || c.room || c.location || ''}`.slice(0, 22), x + 12, metaY)
    })
  })

  ctx.restore()
  roundRect(0, 0, gridW, gridH, 16)
  ctx.strokeStyle = rgbaString(border, .70)
  ctx.lineWidth = 1.2
  ctx.stroke()

  await new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${semester}_課表.png`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
        resolve(true)
        return
      }

      try {
        const a = document.createElement('a')
        a.href = canvas.toDataURL('image/png')
        a.download = `${semester}_課表.png`
        document.body.appendChild(a)
        a.click()
        a.remove()
        resolve(true)
      } catch (error) {
        console.error(error)
        alert('PNG 匯出失敗。請重新整理後再試一次。')
        resolve(false)
      }
    }, 'image/png')
  })
}

export function exportCalendar(plan, semester = '') {
  const entries = semester ? [[semester, plan[semester] || []]] : Object.entries(plan)
  const base = nextMondayDate()
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//UniPlan//ZH-TW', 'CALSCALE:GREGORIAN']
  entries.forEach(([sem, courses]) => courses.filter((c) => courseStatus(c) !== 'failed').forEach((course, i) => {
    const c = getCourse(course)
    slotsOf(course).forEach((slot, si) => {
      const date = new Date(base)
      date.setDate(base.getDate() + (slot.day - 1))
      const startTime = PERIOD_CLOCK[slot.start]?.[0] || '08:10'
      const endTime = PERIOD_CLOCK[slot.end || slot.start]?.[1] || PERIOD_CLOCK[slot.start]?.[1] || '09:00'
      lines.push('BEGIN:VEVENT')
      lines.push(`UID:${icsEscape(sem)}-${uid(course)}-${i}-${si}@uniplan`)
      lines.push(`DTSTAMP:${toIcsDate(new Date(), '00:00')}`)
      lines.push(`DTSTART:${toIcsDate(date, startTime)}`)
      lines.push(`DTEND:${toIcsDate(date, endTime)}`)
      lines.push('RRULE:FREQ=WEEKLY;COUNT=18')
      lines.push(`SUMMARY:${icsEscape(c.name || '課程')}`)
      lines.push(`DESCRIPTION:${icsEscape(`${sem}｜${c.teacher || ''}｜${c.time_info || c.time || ''}`)}`)
      lines.push('END:VEVENT')
    })
  }))
  lines.push('END:VCALENDAR')
  download(`${semester || 'uniplan'}_課表.ics`, lines.join('\r\n'), 'text/calendar;charset=utf-8')
}

export function studentCourseMeta(course) {
  const c = getCourse(course)
  const parts = []
  const time = c.time_info || c.time
  const room = c.classroom || c.room || c.location
  if (time) parts.push(time)
  if (room) parts.push(room)
  return parts.join('｜') || '未列時間'
}

