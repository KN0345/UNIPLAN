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
  5: ['12:10', '13:00'], 6: ['13:10', '14:00'], 7: ['14:10', '15:00'], 8: ['15:10', '16:00'],
  9: ['16:10', '17:00'], 10: ['17:10', '18:00'], 11: ['18:10', '19:00'], 12: ['19:10', '20:00'],
  13: ['20:10', '21:00'], 14: ['21:10', '22:00'],
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


export function mixRgba(a, b, ratio = .5) {
  const t = Math.max(0, Math.min(1, ratio))
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
    1,
  ]
}

export function brightenRgba(color, amount = .18) {
  return mixRgba(color, [255, 255, 255, 1], amount)
}

export function darkenRgba(color, amount = .22) {
  return mixRgba(color, [2, 6, 23, 1], amount)
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

export function isUnsafeExternalUrl(url = '') {
  const raw = String(url || '').trim()
  if (!raw || raw === 'none') return false
  if (raw.startsWith('data:') || raw.startsWith('blob:')) return false
  if (raw.startsWith('#')) return false
  if (raw.startsWith('/')) return false
  try {
    const parsed = new URL(raw, window.location.href)
    return parsed.origin !== window.location.origin
  } catch {
    return false
  }
}

export async function stripExternalBackgroundsForExport(element) {
  const touched = []
  if (!(element instanceof Element)) return () => {}
  const nodes = [element, ...Array.from(element.querySelectorAll('*'))]
  nodes.forEach((node) => {
    if (!(node instanceof HTMLElement)) return
    const style = window.getComputedStyle(node)
    const bg = style.getPropertyValue('background-image') || ''
    const urls = extractCssUrls(bg)
    if (!urls.some(isUnsafeExternalUrl)) return
    touched.push({ node, backgroundImage: node.style.backgroundImage })
    node.style.setProperty('background-image', 'none', 'important')
  })
  return () => {
    touched.forEach(({ node, backgroundImage }) => {
      node.style.backgroundImage = backgroundImage || ''
    })
  }
}

export function getExportSafeBackgroundUrl(element) {
  if (!(element instanceof Element)) return ''

  const stored = localStorage.getItem('uniplan:timetableBg') || ''
  if (stored.startsWith('data:image/')) return stored

  const nodes = [element, ...Array.from(element.querySelectorAll('*'))]
  for (const node of nodes) {
    if (!(node instanceof HTMLElement)) continue
    const bg = window.getComputedStyle(node).getPropertyValue('background-image') || ''
    const urls = extractCssUrls(bg)
    const safe = urls.find((url) => String(url || '').startsWith('data:image/'))
    if (safe) return safe
  }

  return ''
}

export function clearBackgroundImagesInClone(clonedDocument) {
  const clonedWindow = clonedDocument.defaultView
  clonedDocument.querySelectorAll('*').forEach((node) => {
    if (!(node instanceof clonedWindow.HTMLElement)) return
    node.style.setProperty('background-image', 'none', 'important')
  })
}

export function injectExportBackgroundImage(clonedDocument, safeBackgroundUrl) {
  if (!safeBackgroundUrl) return
  const clonedWindow = clonedDocument.defaultView
  const clonedGrid = clonedDocument.querySelector('.exportScheduleCanvas .timetableGridClean')
    || clonedDocument.querySelector('.timetableGridClean')
    || clonedDocument.querySelector('.exportScheduleCanvas')

  if (!(clonedGrid instanceof clonedWindow.HTMLElement)) return

  clonedGrid.style.position = 'relative'
  clonedGrid.style.overflow = 'hidden'
  clonedGrid.style.backgroundImage = 'none'
  clonedGrid.style.backgroundColor = '#0f172a'

  const img = clonedDocument.createElement('img')
  img.src = safeBackgroundUrl
  img.setAttribute('alt', '')
  img.setAttribute('aria-hidden', 'true')
  img.style.position = 'absolute'
  img.style.inset = '0'
  img.style.width = '100%'
  img.style.height = '100%'
  img.style.objectFit = 'cover'
  img.style.objectPosition = 'center center'
  img.style.opacity = '1'
  img.style.zIndex = '0'
  img.style.pointerEvents = 'none'

  clonedGrid.insertBefore(img, clonedGrid.firstChild)

  Array.from(clonedGrid.children).forEach((child) => {
    if (!(child instanceof clonedWindow.HTMLElement)) return
    if (child === img) return
    child.style.position = child.style.position || 'relative'
    child.style.zIndex = '1'
  })
}


function applyExportSafeDomStyles(clonedElement, clonedWindow) {
  if (!(clonedElement instanceof clonedWindow.HTMLElement)) return

  const nodes = [clonedElement, ...Array.from(clonedElement.querySelectorAll('*'))]
  nodes.forEach((node) => {
    if (!(node instanceof clonedWindow.HTMLElement)) return

    const cls = node.className ? String(node.className) : ''
    const tag = node.tagName.toLowerCase()

    node.style.setProperty('animation', 'none', 'important')
    node.style.setProperty('transition', 'none', 'important')
    node.style.setProperty('-webkit-backdrop-filter', 'none', 'important')
    node.style.setProperty('backdrop-filter', 'none', 'important')
    node.style.setProperty('filter', 'none', 'important')
    node.style.setProperty('mix-blend-mode', 'normal', 'important')
    node.style.setProperty('transform', 'none', 'important')
    node.style.setProperty('text-shadow', 'none', 'important')
    node.style.setProperty('caret-color', 'transparent', 'important')
    node.style.setProperty('accent-color', '#2563eb', 'important')
    node.style.setProperty('color', '#f8fafc', 'important')
    node.style.setProperty('border-color', 'rgba(147,197,253,0.28)', 'important')
    node.style.setProperty('outline-color', 'rgba(147,197,253,0.28)', 'important')
    node.style.setProperty('fill', '#f8fafc', 'important')
    node.style.setProperty('stroke', 'rgba(147,197,253,0.55)', 'important')

    // html2canvas currently fails on modern color functions such as color(), oklch(),
    // lab(), and color-mix(). Force every node in the export subtree to old CSS color
    // syntax before html2canvas parses computed styles.
    if (cls.includes('slotCourse') || cls.includes('glassCourse')) {
      node.style.setProperty('background', 'rgba(15,35,72,0.78)', 'important')
      node.style.setProperty('background-color', 'rgba(15,35,72,0.78)', 'important')
      node.style.setProperty('box-shadow', '0 14px 30px rgba(0,0,0,0.24)', 'important')
    } else if (cls.includes('corner') || cls.includes('day') || cls.includes('period')) {
      node.style.setProperty('background', 'rgba(15,23,42,0.66)', 'important')
      node.style.setProperty('background-color', 'rgba(15,23,42,0.66)', 'important')
      node.style.setProperty('box-shadow', 'none', 'important')
    } else if (cls.includes('slot')) {
      node.style.setProperty('background', 'rgba(15,23,42,0.24)', 'important')
      node.style.setProperty('background-color', 'rgba(15,23,42,0.24)', 'important')
      node.style.setProperty('box-shadow', 'none', 'important')
    } else if (cls.includes('timetableGridClean')) {
      node.style.setProperty('background', '#0f172a', 'important')
      node.style.setProperty('background-color', '#0f172a', 'important')
      node.style.setProperty('box-shadow', 'none', 'important')
    } else if (cls.includes('semesterPanel') || cls.includes('activeSemesterPanel') || cls.includes('exportScheduleCanvas')) {
      node.style.setProperty('background', '#10213d', 'important')
      node.style.setProperty('background-color', '#10213d', 'important')
      node.style.setProperty('box-shadow', 'none', 'important')
    } else if (tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea') {
      node.style.setProperty('background', '#1d4ed8', 'important')
      node.style.setProperty('background-color', '#1d4ed8', 'important')
      node.style.setProperty('box-shadow', 'none', 'important')
    } else {
      node.style.setProperty('background-color', 'transparent', 'important')
      node.style.setProperty('box-shadow', 'none', 'important')
    }
  })
}



function px(value, fallback = 0) {
  const n = Number.parseFloat(value)
  return Number.isFinite(n) ? n : fallback
}

function makeExportText(value = '') {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function makeExportCourseName(value = '') {
  // Export-only display cleanup. The original course data remains unchanged.
  // This must run before any truncation, otherwise names such as 教育心理學(B班)
  // become 教育心理學(… in wallpaper export.
  let text = makeExportText(value)
    .replace(/[（]/g, '(')
    .replace(/[）]/g, ')')
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))

  const classToken = '[A-Za-z0-9一二三四五六七八九十甲乙丙丁戊己庚辛壬癸]+'
  const parenthesizedClass = new RegExp(`[\\s　]*\\(\\s*${classToken}班\\s*\\)[\\s　]*`, 'gu')
  const trailingBareClass = new RegExp(`[\\s　]+${classToken}班$`, 'u')

  // Remove every normal class suffix, not only B班: (A班), (B班), （C班）, (甲班), etc.
  text = text.replace(parenthesizedClass, ' ').replace(trailingBareClass, '').trim()
  text = text.replace(/[\s　]{2,}/g, ' ').trim()
  return text || makeExportText(value)
}

function safeCourseTileTone(index = 0) {
  const tones = [
    ['#1e3f78', '#274f92'],
    ['#193866', '#24477f'],
    ['#21446f', '#2d5688'],
    ['#1b4f71', '#246485'],
  ]
  return tones[index % tones.length]
}

function readBackgroundFromElement(element) {
  const stored = safeBackgroundImageValue(localStorage.getItem('uniplan:timetableBg') || '')
  if (stored) return stored
  if (!(element instanceof Element)) return ''
  const nodes = [element, ...Array.from(element.querySelectorAll('*'))]
  for (const node of nodes) {
    if (!(node instanceof HTMLElement)) continue
    const urls = extractCssUrls(window.getComputedStyle(node).getPropertyValue('background-image') || '')
    const safe = urls.find((url) => String(url || '').startsWith('data:image/'))
    if (safe) return safe
  }
  return ''
}

function buildStableExportDom(element, semester = '課表') {
  const panel = element.querySelector('.semesterPanel') || element
  const grid = panel.querySelector('.timetableGridClean') || panel.querySelector('.grid') || panel
  const backgroundUrl = readBackgroundFromElement(panel)

  // Export only the timetable body. Do not include semester title, credit badges,
  // side panels, action buttons, or any outer planner chrome.
  const cornerW = 78
  const dayCount = 7
  const periodCount = 10
  const headerRowH = 54
  const rowH = 64
  const dayW = 146
  const gridWidth = cornerW + dayW * dayCount
  const gridHeight = headerRowH + rowH * periodCount
  const exportWidth = gridWidth
  const exportHeight = gridHeight

  const root = document.createElement('section')
  root.className = 'uniplanStableExportRoot'
  root.style.cssText = `
    position:fixed;
    left:-100000px;
    top:0;
    width:${exportWidth}px;
    height:${exportHeight}px;
    box-sizing:border-box;
    padding:0;
    margin:0;
    background:transparent;
    color:#f8fafc;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans TC","Microsoft JhengHei",Arial,sans-serif;
    overflow:hidden;
  `

  const style = document.createElement('style')
  style.textContent = `
    .uniplanStableExportRoot, .uniplanStableExportRoot *{
      box-sizing:border-box!important;
      color:#f8fafc;
      font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans TC","Microsoft JhengHei",Arial,sans-serif!important;
      letter-spacing:0!important;
      text-rendering:geometricPrecision;
    }
    .uniplanStableExportGrid{
      position:relative;
      width:${gridWidth}px;
      height:${gridHeight}px;
      border-radius:18px;
      overflow:hidden;
      border:1px solid rgba(147,197,253,.30);
      background:#111f36;
      box-shadow:0 18px 46px rgba(0,0,0,.26);
    }
    .uniplanStableExportBg{
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      object-fit:cover;
      object-position:center center;
      z-index:0;
      pointer-events:none;
    }
    .uniplanStableExportTint{
      position:absolute;
      inset:0;
      background:rgba(8,20,38,.44);
      z-index:1;
      pointer-events:none;
    }
    .uniplanStableExportCell{
      position:absolute;
      display:flex;
      align-items:center;
      justify-content:center;
      border-right:1px solid rgba(190,215,255,.18);
      border-bottom:1px solid rgba(190,215,255,.16);
      z-index:2;
      color:#eef6ff;
      font-weight:900;
      font-size:16px;
      background:rgba(15,23,42,.18);
    }
    .uniplanStableExportCell.head,
    .uniplanStableExportCell.corner,
    .uniplanStableExportCell.period{
      background:rgba(15,23,42,.46);
      color:#f3f8ff;
      text-shadow:0 1px 8px rgba(0,0,0,.20);
    }
    .uniplanStableExportCell.period{
      font-size:17px;
      color:#e6eefb;
    }
    .uniplanStableExportCourse{
      position:absolute;
      z-index:4;
      border-radius:14px;
      padding:12px 12px 10px;
      overflow:hidden;
      border:1px solid rgba(210,230,255,.24);
      background:linear-gradient(150deg,rgba(81,132,230,.54),rgba(28,61,137,.42));
      box-shadow:
        0 14px 30px rgba(0,0,0,.24),
        inset 0 1px 0 rgba(255,255,255,.22),
        inset 0 -22px 34px rgba(7,20,54,.18);
    }
    .uniplanStableExportCourse::before{
      content:"";
      position:absolute;
      left:0;
      top:0;
      right:0;
      height:42%;
      background:linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,.02));
      pointer-events:none;
    }
    .uniplanStableExportCourse::after{
      content:"";
      position:absolute;
      inset:1px;
      border-radius:13px;
      border:1px solid rgba(255,255,255,.08);
      pointer-events:none;
    }
    .uniplanStableExportCourseTitle{
      position:relative;
      z-index:1;
      display:block;
      font-size:14px;
      line-height:1.18;
      font-weight:950;
      color:#fff;
      word-break:break-word;
      overflow:hidden;
      max-height:50px;
      text-shadow:0 1px 6px rgba(0,0,0,.22);
    }
    .uniplanStableExportCourseMeta{
      position:relative;
      z-index:1;
      display:block;
      margin-top:7px;
      font-size:12px;
      line-height:1.15;
      font-weight:850;
      color:#e4efff;
      opacity:.95;
    }
    .uniplanStableExportDot{
      display:inline-block;
      width:9px;
      height:9px;
      border-radius:999px;
      background:#60a5fa;
      margin-right:7px;
      box-shadow:0 0 0 3px rgba(96,165,250,.20);
      vertical-align:1px;
    }
  `
  root.appendChild(style)

  const gridEl = document.createElement('div')
  gridEl.className = 'uniplanStableExportGrid'

  if (backgroundUrl) {
    const img = document.createElement('img')
    img.className = 'uniplanStableExportBg'
    img.src = backgroundUrl
    img.alt = ''
    gridEl.appendChild(img)
  }

  const tint = document.createElement('div')
  tint.className = 'uniplanStableExportTint'
  gridEl.appendChild(tint)

  const addCell = (className, text, x, y, w, h) => {
    const cell = document.createElement('div')
    cell.className = `uniplanStableExportCell ${className}`
    cell.textContent = text
    cell.style.left = `${x}px`
    cell.style.top = `${y}px`
    cell.style.width = `${w}px`
    cell.style.height = `${h}px`
    gridEl.appendChild(cell)
  }

  addCell('corner', '節', 0, 0, cornerW, headerRowH)
  DAYS.forEach((day, index) => addCell('head', `週${day}`, cornerW + dayW * index, 0, dayW, headerRowH))
  PERIODS.slice(0, 10).forEach((period, index) => addCell('period', String(period), 0, headerRowH + rowH * index, cornerW, rowH))
  PERIODS.slice(0, 10).forEach((period, pIndex) => {
    DAYS.forEach((day, dIndex) => addCell('', '', cornerW + dayW * dIndex, headerRowH + rowH * pIndex, dayW, rowH))
  })

  const rows = Array.from(grid.querySelectorAll('.gridRow'))
  let courseIndex = 0
  rows.slice(0, 10).forEach((row, rowIndex) => {
    const cells = Array.from(row.querySelectorAll('.timetableCell'))
    cells.slice(0, 7).forEach((cell, dayIndex) => {
      const tile = cell.querySelector('.timetableCourseTile, .slotCourse, .glassCourse')
      if (!tile) return

      const spanRaw = tile.style.getPropertyValue('--tile-span') || window.getComputedStyle(tile).getPropertyValue('--tile-span') || '1'
      const span = Math.max(1, Math.min(10 - rowIndex, Math.round(px(spanRaw, 1))))
      const titleText = makeExportCourseName(tile.querySelector('.tileTitle')?.textContent || tile.querySelector('strong')?.textContent || tile.textContent)
      const metaText = makeExportText(tile.querySelector('.tileMeta')?.textContent || tile.querySelector('small')?.textContent || '')
      const [from, to] = safeCourseTileTone(courseIndex)

      const course = document.createElement('div')
      course.className = 'uniplanStableExportCourse'
      course.style.left = `${cornerW + dayW * dayIndex + 12}px`
      course.style.top = `${headerRowH + rowH * rowIndex + 12}px`
      course.style.width = `${dayW - 24}px`
      course.style.height = `${Math.max(42, rowH * span - 24)}px`
      course.style.background = `linear-gradient(150deg, ${from}cc, ${to}a8)`

      const title = document.createElement('span')
      title.className = 'uniplanStableExportCourseTitle'
      const dot = document.createElement('i')
      dot.className = 'uniplanStableExportDot'
      title.appendChild(dot)
      title.appendChild(document.createTextNode(titleText || '課程'))
      course.appendChild(title)

      const meta = document.createElement('span')
      meta.className = 'uniplanStableExportCourseMeta'
      meta.textContent = metaText
      course.appendChild(meta)

      gridEl.appendChild(course)
      courseIndex += 1
    })
  })

  root.appendChild(gridEl)
  return { root, width: exportWidth, height: exportHeight }
}

export async function exportPngFromDom(element, semester = '課表') {
  if (!element) {
    alert('找不到目前課表畫面，無法匯出 PNG。')
    return false
  }

  let iframe = null
  let exportRoot = null
  try {
    const built = buildStableExportDom(element, semester)
    exportRoot = built.root

    // Run html2canvas inside a fully isolated document. html2canvas parses the
    // stylesheets available in the document it renders. The main UniPlan app uses
    // many modern CSS color functions such as color-mix(), which html2canvas cannot
    // parse. A blank iframe prevents html2canvas from seeing those app styles while
    // the stable export DOM provides its own safe layout CSS.
    iframe = document.createElement('iframe')
    iframe.setAttribute('aria-hidden', 'true')
    iframe.style.position = 'fixed'
    iframe.style.left = '-100000px'
    iframe.style.top = '0'
    iframe.style.width = `${built.width}px`
    iframe.style.height = `${built.height}px`
    iframe.style.border = '0'
    iframe.style.opacity = '0'
    iframe.style.pointerEvents = 'none'
    document.body.appendChild(iframe)

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
    if (!iframeDoc) throw new Error('無法建立匯出用 iframe')

    iframeDoc.open()
    iframeDoc.write(`<!doctype html><html><head><meta charset="utf-8"><style>
      html, body {
        margin: 0;
        padding: 0;
        width: ${built.width}px;
        height: ${built.height}px;
        overflow: hidden;
        background: #0b1f3d;
      }
    </style></head><body></body></html>`)
    iframeDoc.close()

    iframeDoc.body.appendChild(exportRoot)
    exportRoot.style.position = 'relative'
    exportRoot.style.left = '0'
    exportRoot.style.top = '0'

    await waitForImages(exportRoot)
    if (iframeDoc.fonts?.ready) await iframeDoc.fonts.ready
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(exportRoot, {
      backgroundColor: '#0b1f3d',
      scale: Math.max(2, Math.min(3, window.devicePixelRatio || 2)),
      useCORS: true,
      allowTaint: false,
      imageTimeout: 15000,
      logging: false,
      width: built.width,
      height: built.height,
      windowWidth: built.width,
      windowHeight: built.height,
      scrollX: 0,
      scrollY: 0,
    })

    const blob = await canvasToBlobSafe(canvas)
    if (!blob) throw new Error('匯出 canvas 無法輸出 PNG')

    const pngUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = pngUrl
    a.download = `${semester}_課表.png`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(pngUrl)
    return true
  } catch (error) {
    console.error('Stable DOM PNG export failed.', error)
    alert('PNG 匯出失敗：隔離版課表匯出失敗，請回報 Console 錯誤。')
    return false
  } finally {
    if (iframe?.parentNode) iframe.parentNode.removeChild(iframe)
    else if (exportRoot?.parentNode) exportRoot.parentNode.removeChild(exportRoot)
  }
}



export async function exportCleanPng(plan, semester = '課表') {
  // Wallpaper Export V6: safe-area phone wallpaper layout.
  // Removes the left period rail, writes actual time ranges inside cards, and centers the timetable for different phone screens.
  const rawCourses = Array.isArray(plan?.[semester]) ? plan[semester] : []
  const activeCourses = rawCourses.filter((course) => courseStatus(course) !== 'failed')
  const allSlots = []
  activeCourses.forEach((course) => {
    slotsOf(course).forEach((slot) => {
      const day = Number(slot.day)
      const start = Number(slot.start)
      const end = Number(slot.end || slot.start)
      if (day >= 1 && day <= 7 && start >= 1 && start <= 14) {
        allSlots.push({ course, day, start, end: Math.max(start, Math.min(14, end || start)) })
      }
    })
  })

  const hasSaturday = allSlots.some((slot) => slot.day === 6)
  const hasSunday = allSlots.some((slot) => slot.day === 7)
  const visibleDays = [1, 2, 3, 4, 5, ...(hasSaturday ? [6] : []), ...(hasSunday ? [7] : [])]
  const dayToIndex = new Map(visibleDays.map((day, index) => [day, index]))

  const minSlot = allSlots.length ? Math.min(...allSlots.map((slot) => slot.start)) : 1
  const maxSlot = allSlots.length ? Math.max(...allSlots.map((slot) => slot.end)) : 10
  let firstPeriod = Math.max(1, minSlot - 1)
  let lastPeriod = Math.min(14, maxSlot + 1)
  const minRows = allSlots.length ? 6 : 10
  while ((lastPeriod - firstPeriod + 1) < minRows) {
    if (firstPeriod > 1) firstPeriod -= 1
    else if (lastPeriod < 14) lastPeriod += 1
    else break
  }
  const visiblePeriods = Array.from({ length: lastPeriod - firstPeriod + 1 }, (_, i) => firstPeriod + i)

  const scale = Math.max(2, Math.min(3, window.devicePixelRatio || 2))
  const canvasW = 1440
  const canvasH = 2560
  const safeX = 96
  const safeTop = 190
  const safeBottom = 210
  const tableX = safeX
  const tableY = safeTop
  const tableW = canvasW - safeX * 2
  const timeW = 0
  const headH = 78
  const idealRowH = visiblePeriods.length <= 6 ? 244 : visiblePeriods.length <= 8 ? 215 : 188
  const maxTableH = canvasH - tableY - safeBottom
  const tableH = Math.min(maxTableH, headH + idealRowH * visiblePeriods.length)
  const rowH = (tableH - headH) / visiblePeriods.length
  const dayW = tableW / visibleDays.length
  const appearance = readCurrentAppearance()
  const bgUrl = safeBackgroundImageValue(appearance.timetableBg || localStorage.getItem('uniplan:timetableBg') || '')
  const bgImg = await loadImageSafe(bgUrl)

  const canvas = document.createElement('canvas')
  canvas.width = canvasW * scale
  canvas.height = canvasH * scale
  const ctx = canvas.getContext('2d')
  ctx.scale(scale, scale)

  const roundRect = (x, y, w, h, r) => {
    const radius = Math.min(r, w / 2, h / 2)
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.arcTo(x + w, y, x + w, y + h, radius)
    ctx.arcTo(x + w, y + h, x, y + h, radius)
    ctx.arcTo(x, y + h, x, y, radius)
    ctx.arcTo(x, y, x + w, y, radius)
    ctx.closePath()
  }
  const fillRound = (x, y, w, h, r, fillStyle) => {
    roundRect(x, y, w, h, r)
    ctx.fillStyle = fillStyle
    ctx.fill()
  }
  const strokeRound = (x, y, w, h, r, strokeStyle, lineWidth = 1) => {
    roundRect(x, y, w, h, r)
    ctx.strokeStyle = strokeStyle
    ctx.lineWidth = lineWidth
    ctx.stroke()
  }
  const drawCenteredLines = (text, centerX, startY, maxWidth, lineHeight, maxLines = 2) => {
    const source = String(text || '')
    const lines = []
    let line = ''
    for (const ch of source) {
      const test = line + ch
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line)
        line = ch
      } else {
        line = test
      }
    }
    if (line) lines.push(line)
    const visible = lines.slice(0, maxLines)
    const overflow = lines.length > maxLines
    visible.forEach((ln, idx) => {
      const value = overflow && idx === maxLines - 1 ? `${ln.slice(0, Math.max(1, ln.length - 1))}…` : ln
      ctx.fillText(value, centerX, startY + idx * lineHeight)
    })
  }
  const wallpaperCardMode = localStorage.getItem('uniplan:wallpaperCardMode') || 'pink'
  const wallpaperCardColor = localStorage.getItem('uniplan:wallpaperCardColor') || '#ec4899'
  const palettesByMode = {
    pink: [['#ff4fb8', '#7c3aed'], ['#ec4899', '#a855f7'], ['#f472b6', '#8b5cf6']],
    accent: [[appearance.accent || '#2563eb', appearance.buttonAccent || appearance.accent || '#7c3aed']],
    blue: [['#38bdf8', '#2563eb'], ['#60a5fa', '#4f46e5']],
    purple: [['#a78bfa', '#7c3aed'], ['#c084fc', '#9333ea']],
    green: [['#34d399', '#059669'], ['#22c55e', '#0f766e']],
    orange: [['#fbbf24', '#ea580c'], ['#fb923c', '#dc2626']],
    custom: [[wallpaperCardColor, appearance.accent || '#7c3aed']],
    auto: [
      ['#2563eb', '#7c3aed'],
      ['#0ea5e9', '#2563eb'],
      ['#14b8a6', '#0f766e'],
      ['#8b5cf6', '#4338ca'],
      ['#f59e0b', '#ea580c'],
      ['#22c55e', '#15803d'],
      ['#ec4899', '#7e22ce'],
    ],
  }
  const coursePalette = palettesByMode[wallpaperCardMode] || palettesByMode.pink
  const hashText = (value) => String(value || '').split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0)

  ctx.clearRect(0, 0, canvasW, canvasH)
  if (bgImg) drawCoverImage(ctx, bgImg, 0, 0, canvasW, canvasH)
  else {
    const fallback = ctx.createLinearGradient(0, 0, canvasW, canvasH)
    fallback.addColorStop(0, '#040b16')
    fallback.addColorStop(.45, '#10213b')
    fallback.addColorStop(1, '#050812')
    ctx.fillStyle = fallback
    ctx.fillRect(0, 0, canvasW, canvasH)
  }

  const tint = cssColorToRgba(appearance.tint || '#07111f', [7, 17, 31, 1])
  const veil = ctx.createLinearGradient(0, 0, 0, canvasH)
  veil.addColorStop(0, rgbaString(tint, .22))
  veil.addColorStop(.46, 'rgba(2,6,23,.22)')
  veil.addColorStop(1, 'rgba(2,6,23,.58)')
  ctx.fillStyle = veil
  ctx.fillRect(0, 0, canvasW, canvasH)

  // Wallpaper mode intentionally omits UniPlan/semester title text; export keeps only the background image and timetable.

  // Smart timetable plate. Kept inside wallpaper safe area to reduce cropping on different phones.
  const plate = ctx.createLinearGradient(tableX, tableY, tableX, tableY + tableH)
  plate.addColorStop(0, 'rgba(15,23,42,.20)')
  plate.addColorStop(1, 'rgba(15,23,42,.10)')
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,.22)'
  ctx.shadowBlur = 34
  ctx.shadowOffsetY = 14
  fillRound(tableX, tableY, tableW, tableH, 46, plate)
  ctx.restore()
  strokeRound(tableX, tableY, tableW, tableH, 46, 'rgba(255,255,255,.22)', 1.15)

  ctx.save()
  roundRect(tableX, tableY, tableW, tableH, 46)
  ctx.clip()

  ctx.fillStyle = 'rgba(255,255,255,.036)'
  ctx.fillRect(tableX, tableY, tableW, headH)
  ctx.textAlign = 'center'
  ctx.font = '900 29px Inter, Noto Sans TC, sans-serif'
  visibleDays.forEach((day, i) => {
    const cx = tableX + timeW + i * dayW + dayW / 2
    const cy = tableY + headH / 2
    const capsuleW = Math.min(108, Math.max(76, dayW * .42))
    fillRound(cx - capsuleW / 2, cy - 23, capsuleW, 46, 23, 'rgba(255,255,255,.11)')
    ctx.fillStyle = 'rgba(255,255,255,.93)'
    ctx.fillText(DAYS[day - 1], cx, cy + 10)
  })

  // Almost invisible guide lines; enough for time location, not enough to dominate the wallpaper.
  ctx.strokeStyle = 'rgba(255,255,255,.052)'
  ctx.lineWidth = 1
  for (let i = 0; i <= visibleDays.length; i += 1) {
    const x = tableX + timeW + i * dayW
    ctx.beginPath(); ctx.moveTo(x, tableY + headH); ctx.lineTo(x, tableY + tableH); ctx.stroke()
  }
  for (let r = 0; r <= visiblePeriods.length; r += 1) {
    const y = tableY + headH + r * rowH
    ctx.beginPath(); ctx.moveTo(tableX + timeW, y); ctx.lineTo(tableX + tableW, y); ctx.stroke()
  }

  // Left period numbers are intentionally hidden in wallpaper mode. Time is written on each course card.

  const placedKeys = new Set()
  allSlots.forEach((slot) => {
    if (!dayToIndex.has(slot.day) || slot.end < firstPeriod || slot.start > lastPeriod) return
    const safeStart = Math.max(firstPeriod, slot.start)
    const key = `${uid(slot.course)}-${slot.day}-${safeStart}`
    if (placedKeys.has(key)) return
    placedKeys.add(key)

    const c = getCourse(slot.course)
    const dayIndex = dayToIndex.get(slot.day)
    const span = Math.max(1, Math.min(lastPeriod, slot.end) - safeStart + 1)
    const baseX = tableX + timeW + dayIndex * dayW
    const baseY = tableY + headH + (safeStart - firstPeriod) * rowH
    const w = Math.max(150, dayW - 34)
    const spanBlockH = rowH * span
    const targetH = span === 1
      ? rowH * .66
      : span === 2
        ? rowH * 1.28
        : span === 3
          ? rowH * 1.82
          : rowH * 2.34
    const h = Math.min(Math.max(132, targetH), Math.max(132, spanBlockH - 26))
    const x = baseX + (dayW - w) / 2
    const y = baseY + Math.max(13, (spanBlockH - h) / 2)
    const displayName = makeExportCourseName(c.name || '課程')
    const palette = coursePalette[hashText(displayName || c.code || c.serial) % coursePalette.length]
    // Wallpaper card color must follow the selected wallpaper mode directly.
    // Previously palette[0] was overridden by the global accent color, so modes such as 青綠 / 橘紅 looked unchanged.
    const baseA = cssColorToRgba(palette[0], [37, 99, 235, 1])
    const baseB = cssColorToRgba(palette[1] || palette[0], [124, 58, 237, 1])
    const top = brightenRgba(baseA, .25)
    const bottom = mixRgba(baseA, baseB, .58)
    const deep = darkenRgba(bottom, .20)

    ctx.save()
    ctx.shadowColor = rgbaString(baseA, .52)
    ctx.shadowBlur = 34
    ctx.shadowOffsetY = 10
    const glow = ctx.createRadialGradient(x + w / 2, y + h / 2, 12, x + w / 2, y + h / 2, Math.max(w, h))
    glow.addColorStop(0, rgbaString(baseA, .22))
    glow.addColorStop(1, 'rgba(255,255,255,0)')
    fillRound(x - 8, y - 8, w + 16, h + 16, 38, glow)
    const card = ctx.createLinearGradient(x, y, x + w, y + h)
    card.addColorStop(0, rgbaString(top, .88))
    card.addColorStop(.58, rgbaString(bottom, .78))
    card.addColorStop(1, rgbaString(deep, .86))
    fillRound(x, y, w, h, 34, card)
    ctx.restore()
    strokeRound(x, y, w, h, 34, 'rgba(255,255,255,.42)', 1.25)

    ctx.save()
    roundRect(x, y, w, h, 34)
    ctx.clip()
    const shine = ctx.createLinearGradient(x, y, x, y + h * .58)
    shine.addColorStop(0, 'rgba(255,255,255,.34)')
    shine.addColorStop(.7, 'rgba(255,255,255,.04)')
    shine.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = shine
    ctx.fillRect(x, y, w, h * .62)
    ctx.fillStyle = 'rgba(2,6,23,.12)'
    ctx.fillRect(x, y + h * .68, w, h * .32)
    ctx.restore()

    ctx.save()
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0,0,0,.36)'
    ctx.shadowBlur = 10
    ctx.fillStyle = '#ffffff'
    ctx.font = '900 30px Inter, Noto Sans TC, sans-serif'
    const nameLines = w >= 210 ? 1 : 2
    const nameY = y + (h >= 220 ? h * .39 : h * .43) - (nameLines === 2 ? 12 : 0)
    drawCenteredLines(displayName || '課程', x + w / 2, nameY, w - 34, 32, nameLines)
    const room = c.classroom || c.room || c.location || ''
    const startClock = PERIOD_CLOCK[safeStart]?.[0] || `${safeStart}節`
    const endClock = PERIOD_CLOCK[Math.min(lastPeriod, slot.end)]?.[1] || PERIOD_CLOCK[safeStart]?.[1] || ''
    const timeRange = endClock ? `${startClock}–${endClock}` : startClock
    ctx.font = '850 22px Inter, Noto Sans TC, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,.86)'
    ctx.fillText(timeRange, x + w / 2, y + h - (room ? 58 : 30))
    if (room) {
      ctx.font = '850 21px Inter, Noto Sans TC, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,.78)'
      ctx.fillText(room, x + w / 2, y + h - 25)
    }
    ctx.restore()
  })
  ctx.restore()


  await new Promise((resolve) => {
    canvas.toBlob((blob) => {
      try {
        const url = blob ? URL.createObjectURL(blob) : canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.href = url
        a.download = `${semester}_手機桌布課表_V6.png`
        document.body.appendChild(a)
        a.click()
        a.remove()
        if (blob) URL.revokeObjectURL(url)
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

