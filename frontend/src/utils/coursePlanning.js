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

function stableCourseIdentity(course) {
  const c = getCourse(course)
  const term = String(courseCatalogTermValue(c) || c.semester_source || c.semester || c.term || '').trim()
  const serial = String(c.serial || c.open_serial || c.openSerial || c.open_course_no || c.openCourseNo || c.開課序號 || c['開課序號'] || '').trim()
  const code = String(c.code || c.course_code || c.courseCode || c.course_id || '').trim()
  const dept = String(c.department || c.department_code || c.unit || c.opening_unit || '').trim()
  const cls = String(c.class_name || c.className || c.class || c.section || '').trim()
  const teacher = String(c.teacher || c.instructor || '').trim()
  const time = String(c.time_info || c.time || JSON.stringify(c.time_data || '')).trim()
  const name = String(c.name || c.course_name || '').trim()

  // 淡江開課序號在不同查詢群組/學院頁可能重複，不能只用「學期+序號」。
  // 英文、通識、榮譽/跨院課常會出現同序號但不同系列或不同課號；完整課程身分需含開課單位與課程資訊。
  if (serial) return [term, dept, serial, code, cls, name, teacher, time].filter(Boolean).join(':')
  return [term, dept, code, cls, name, teacher, time].filter(Boolean).join(':') || String(c.id || c.uid || name || Math.random())
}

export function uid(course) {
  const c = getCourse(course)
  return String(c.uid || c.instanceId || c.id || stableCourseIdentity(c))
}

export function courseKey(course) {
  return stableCourseIdentity(course)
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

export function courseWeekRanges(course) {
  const c = getCourse(course)
  const text = `${c.notes || ''} ${c.name || ''} ${c.time_info || ''}`
  const ranges = []
  const seen = new Set()
  const patterns = [
    /第\s*(\d{1,2})\s*[-~－～]\s*(\d{1,2})\s*週/g,
    /(?:^|[^第\d])(\d{1,2})\s*[-~－～]\s*(\d{1,2})\s*週/g,
  ]
  patterns.forEach((pattern) => {
    let match
    while ((match = pattern.exec(text))) {
      const start = Number(match[1])
      const end = Number(match[2])
      if (!start || !end) continue
      const normalized = { start: Math.min(start, end), end: Math.max(start, end) }
      const key = `${normalized.start}-${normalized.end}`
      if (seen.has(key)) continue
      seen.add(key)
      ranges.push(normalized)
    }
  })
  return ranges
}

export function courseWeekPattern(course) {
  const c = getCourse(course)
  const text = `${c.notes || ''} ${c.name || ''} ${c.time_info || ''}`
  const ranges = courseWeekRanges(course)
  const hasOdd = /(^|[^非])單週|奇數週|單數週/.test(text)
  const hasEven = /(^|[^非])雙週|偶數週|雙數週/.test(text)
  const hasAlternate = /隔週/.test(text) && !hasOdd && !hasEven
  if (hasOdd) return { type: 'odd', ranges }
  if (hasEven) return { type: 'even', ranges }
  if (hasAlternate) return { type: 'alternate', ranges }
  if (ranges.length) return { type: 'range', ranges }
  return { type: 'normal', ranges: [] }
}

function weeksForRule(rule) {
  const baseRanges = rule.ranges?.length ? rule.ranges : [{ start: 1, end: 18 }]
  const weeks = new Set()
  baseRanges.forEach(({ start, end }) => {
    for (let week = Math.max(1, start); week <= Math.min(18, end); week += 1) {
      if (rule.type === 'odd' && week % 2 !== 1) continue
      if (rule.type === 'even' && week % 2 !== 0) continue
      weeks.add(week)
    }
  })
  return weeks
}

export function scheduleRuleLabel(course) {
  const rule = courseWeekPattern(course)
  if (rule.type === 'odd') return rule.ranges.length ? `單週｜${rule.ranges.map((r) => `${r.start}-${r.end}週`).join('、')}` : '單週'
  if (rule.type === 'even') return rule.ranges.length ? `雙週｜${rule.ranges.map((r) => `${r.start}-${r.end}週`).join('、')}` : '雙週'
  if (rule.type === 'alternate') return rule.ranges.length ? `隔週｜${rule.ranges.map((r) => `${r.start}-${r.end}週`).join('、')}` : '隔週'
  if (rule.ranges.length) return rule.ranges.map((r) => `${r.start}-${r.end}週`).join('、')
  return ''
}

export function weekRangesOverlap(a, b) {
  const ar = courseWeekPattern(a)
  const br = courseWeekPattern(b)
  if (ar.type === 'normal' && br.type === 'normal') return true
  // 「隔週」若沒有明確起始週，保守視為可能重疊。
  if (ar.type === 'alternate' || br.type === 'alternate') return true
  const aw = weeksForRule(ar)
  const bw = weeksForRule(br)
  for (const week of aw) if (bw.has(week)) return true
  return false
}

export function hasConflict(a, b) {
  if (!weekRangesOverlap(a, b)) return false
  return slotsOf(a).some((x) => slotsOf(b).some((y) => x.day === y.day && Math.max(x.start, y.start) <= Math.min(x.end, y.end)))
}

export function hasAnyConflict(courses = []) {
  return courses.some((a, i) => courses.slice(i + 1).some((b) => hasConflict(a, b)))
}

export function findConflict(course, courses) {
  return courses.filter((c) => courseStatus(c) !== 'failed').find((c) => hasConflict(course, c))
}


export function normalizedCourseNameForMerge(course) {
  return String(getCourse(course).name || '')
    .replace(/[\s　]*[（(]\s*[A-Za-zＡ-Ｚａ-ｚ0-9０-９一二三四五六七八九十甲乙丙丁戊己庚辛壬癸]+\s*班\s*[）)]\s*$/u, '')
    .replace(/\s+/g, '')
    .trim()
}

export function courseMergeIdentity(course) {
  const c = getCourse(course)
  const code = String(c.code || '').trim()
  const name = normalizedCourseNameForMerge(course)
  return code ? `${courseCatalogTermValue(c)}:${code}:${name}` : `${courseCatalogTermValue(c)}:${name}`
}

export function primarySlotSignature(course) {
  return slotsOf(course).map((s) => `${s.day}-${s.start}-${s.end}`).sort().join('|')
}

export function isHalfSemesterLike(course) {
  const rule = courseWeekPattern(course)
  return rule.type === 'range' && rule.ranges.length > 0
}

export function mergeableHalfSemesterGroup(a, b) {
  if (!a || !b) return false
  // 半學期課程只要星期＋節次完全相同、週次不重疊，就應該合併為同一張左右分欄卡片。
  // 不再要求課號或課名相同；例如 1-9 週與 10-18 週可能是不同課名但共用同一時段。
  if (primarySlotSignature(a) !== primarySlotSignature(b)) return false
  if (!isHalfSemesterLike(a) || !isHalfSemesterLike(b)) return false
  return !weekRangesOverlap(a, b)
}


export function requiredTypeLabel(course) {
  const c = getCourse(course)
  const candidates = [
    c.required_type, c.requiredType, c.required, c.requirement, c.requiredElective,
    c.required_elective, c.requiredOrElective, c.type, c.category, c.group_type,
    c['必選修'], c['必/選修'], c['修別'], c['類別'], c['選別'], c['必選']
  ]
  const value = candidates.map((item) => String(item ?? '').trim()).find(Boolean) || ''
  if (/^R$|required|必修|必/.test(value)) return '必修'
  if (/^E$|elective|選修|選/.test(value)) return '選修'
  return value || '未列'
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
  const req = requiredTypeLabel(c)
  const text = `${c.category || ''} ${c.group_type || ''} ${c.department || ''} ${c.name || ''} ${c.required_type || ''} ${c.requiredType || ''} ${c['必選修'] || ''} ${c['修別'] || ''}`
  if (/校必|通識|共同|英文|外國語文|中國語文|探索永續|人工智慧導論|體育|國防|服務學習/.test(text)) return 'universityRequired'
  if (/院必|院級/.test(text)) return 'collegeRequired'
  if (/系必|系訂必修|專業必修/.test(text) || req === '必修') return 'departmentRequired'
  if (/系選|專業選修/.test(text) || req === '選修') return 'departmentElective'
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

const UNSUPPORTED_CANVAS_COLOR_FN = /(?:color-mix|color|oklch|oklab|lab|lch)\(/i
const EXPORT_SAFE_STYLE_PROPS = new Set([
  'position','display','box-sizing','left','right','top','bottom','width','height','min-width','min-height','max-width','max-height',
  'margin','margin-top','margin-right','margin-bottom','margin-left','padding','padding-top','padding-right','padding-bottom','padding-left',
  'overflow','overflow-x','overflow-y','z-index','opacity','transform','grid-template-columns','grid-template-rows','grid-auto-rows',
  'grid-column','grid-row','grid-column-start','grid-column-end','grid-row-start','grid-row-end','gap','row-gap','column-gap',
  'align-items','justify-content','align-content','justify-items','flex-direction','flex-wrap','flex','flex-grow','flex-shrink','flex-basis',
  'font','font-family','font-size','font-weight','font-style','line-height','letter-spacing','text-align','white-space','word-break',
  'border-radius','border-top-left-radius','border-top-right-radius','border-bottom-right-radius','border-bottom-left-radius',
  'color','background','background-color','background-image','background-size','background-position','background-repeat',
  'border','border-top','border-right','border-bottom','border-left','border-color','border-top-color','border-right-color','border-bottom-color','border-left-color',
  'outline','outline-color','box-shadow','text-shadow','filter','backdrop-filter','-webkit-backdrop-filter','mix-blend-mode','object-fit','object-position',
  'visibility','pointer-events'
])

const EXPORT_SAFE_CUSTOM_PROPS = new Set([
  '--tile-span',
  '--stack-index',
  '--stack-count',
  '--course-card-alpha',
  '--timetable-opacity',
])

function isExportSafeCustomProp(prop) {
  return EXPORT_SAFE_CUSTOM_PROPS.has(String(prop || '').trim())
}

function hasUnsupportedCanvasColor(value) {
  return UNSUPPORTED_CANVAS_COLOR_FN.test(String(value || ''))
}

function stripUnsupportedColorFns(value, replacement = 'rgba(15,23,42,0.18)') {
  let out = String(value || '')
  // Remove nested modern color functions safely enough for inline export styles.
  // html2canvas 1.4.x parses style attributes before our fallback CSS can win, so
  // the raw style text must not contain color(), color-mix(), oklch(), lab(), etc.
  for (let pass = 0; pass < 8 && hasUnsupportedCanvasColor(out); pass += 1) {
    out = out.replace(/(?:color-mix|color|oklch|oklab|lab|lch)\([^()]*\)/gi, replacement)
  }
  return out
}

function exportSafeCssValue(prop, value) {
  const raw = String(value || '').trim()
  if (!raw) return raw
  if (!hasUnsupportedCanvasColor(raw)) return raw
  const name = String(prop || '').toLowerCase()
  if (name.startsWith('--')) return isExportSafeCustomProp(name) ? raw : ''
  if (name === 'color' || name === 'caret-color' || name.includes('text-decoration-color')) return '#f8fafc'
  if (name.includes('border') || name.includes('outline') || name === 'column-rule-color') return name === 'border' || name.startsWith('border-') && !name.endsWith('color') ? '1px solid rgba(147,197,253,0.28)' : 'rgba(147,197,253,0.32)'
  if (name === 'fill') return '#f8fafc'
  if (name === 'stroke') return 'rgba(147,197,253,0.55)'
  if (name.includes('shadow')) return 'none'
  if (name === 'background' || name === 'background-color') return 'rgba(15,23,42,0.18)'
  if (name === 'background-image' || name.includes('gradient')) return 'none'
  return stripUnsupportedColorFns(raw)
}

function sanitizeStyleAttributeText(styleText = '') {
  return String(styleText || '')
    .split(';')
    .map((decl) => decl.trim())
    .filter(Boolean)
    .map((decl) => {
      const splitAt = decl.indexOf(':')
      if (splitAt <= 0) return ''
      const prop = decl.slice(0, splitAt).trim()
      if (!prop || (prop.startsWith('--') && !isExportSafeCustomProp(prop))) return ''
      const value = decl.slice(splitAt + 1).trim()
      if (!value) return ''
      const safe = exportSafeCssValue(prop, value)
      if (!safe || hasUnsupportedCanvasColor(safe)) return ''
      return `${prop}:${safe}`
    })
    .filter(Boolean)
    .join(';')
}

function sanitizeUnsupportedCanvasCss(root, clonedWindow = window) {
  if (!root) return
  const nodes = [root, ...Array.from(root.querySelectorAll?.('*') || [])]
  nodes.forEach((node) => {
    if (!(node instanceof clonedWindow.HTMLElement)) return
    const style = node.style
    const props = []
    for (let i = 0; i < style.length; i += 1) props.push(style.item(i))
    props.forEach((prop) => {
      const value = style.getPropertyValue(prop)
      if ((prop.startsWith('--') && !isExportSafeCustomProp(prop)) || hasUnsupportedCanvasColor(value)) {
        const safe = exportSafeCssValue(prop, value)
        if (safe && !hasUnsupportedCanvasColor(safe)) style.setProperty(prop, safe, style.getPropertyPriority(prop) || 'important')
        else style.removeProperty(prop)
      }
    })
    ;['color','background','background-color','background-image','border','border-color','border-top-color','border-right-color','border-bottom-color','border-left-color','outline-color','box-shadow','text-shadow','fill','stroke','caret-color','accent-color'].forEach((prop) => {
      const value = style.getPropertyValue(prop)
      if (hasUnsupportedCanvasColor(value)) {
        const safe = exportSafeCssValue(prop, value)
        if (safe && !hasUnsupportedCanvasColor(safe)) style.setProperty(prop, safe, 'important')
        else style.removeProperty(prop)
      }
    })
    const finalStyle = node.getAttribute('style') || ''
    if (hasUnsupportedCanvasColor(finalStyle)) node.setAttribute('style', sanitizeStyleAttributeText(finalStyle))
  })
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

  // Keep timetable layout variables that are needed after the export clone is resized.
  const originalStyle = target.getAttribute('style') || ''
  for (const prop of EXPORT_SAFE_CUSTOM_PROPS) {
    const match = originalStyle.match(new RegExp(`${prop.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*([^;]+)`))
    if (match?.[1]) target.style.setProperty(prop, match[1].trim())
  }

  const computed = window.getComputedStyle(source)
  for (const prop of computed) {
    if (!EXPORT_SAFE_STYLE_PROPS.has(prop) || prop.startsWith('--')) continue
    const value = exportSafeCssValue(prop, computed.getPropertyValue(prop))
    if (!value || hasUnsupportedCanvasColor(value)) continue
    try {
      target.style.setProperty(prop, value, computed.getPropertyPriority(prop) || '')
    } catch {
      // Ignore properties that cannot be assigned in the export clone.
    }
  }

  // Re-apply the variables after computed styles so later compact-export math can read them.
  for (const prop of EXPORT_SAFE_CUSTOM_PROPS) {
    const match = originalStyle.match(new RegExp(`${prop.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*([^;]+)`))
    if (match?.[1]) target.style.setProperty(prop, match[1].trim())
  }

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
  const rawTimetableOpacity = Number.parseFloat(rootStyle.getPropertyValue('--timetable-opacity'))
  const rawStoredTimetableOpacity = Number.parseFloat(localStorage.getItem('uniplan:timetableOpacity') || '0')
  const rawCourseCardOpacity = Number.parseFloat(rootStyle.getPropertyValue('--course-card-alpha'))
  const rawStoredCourseCardOpacity = Number.parseFloat(localStorage.getItem('uniplan:courseCardOpacity') || '.72')
  const timetableOpacity = Number.isFinite(rawTimetableOpacity) ? rawTimetableOpacity : (Number.isFinite(rawStoredTimetableOpacity) ? rawStoredTimetableOpacity : 0)
  const courseCardOpacity = Number.isFinite(rawCourseCardOpacity) ? rawCourseCardOpacity : (Number.isFinite(rawStoredCourseCardOpacity) ? rawStoredCourseCardOpacity : .72)
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
  // Keep the original course data untouched, but make exported timetable cards
  // cleaner by removing class suffixes such as "(B班)" / "（B班）".
  let text = makeExportText(value)
  const classSuffix = /[\s　]*[（(]\s*[A-Za-zＡ-Ｚａ-ｚ0-9０-９一二三四五六七八九十甲乙丙丁戊己庚辛壬癸]\s*班\s*[）)]\s*$/u
  while (classSuffix.test(text)) text = text.replace(classSuffix, '').trim()
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


function rgbaAlphaFromCss(value, fallback = 0) {
  const raw = String(value || '').trim()
  if (!raw || raw === 'transparent') return 0
  const rgba = raw.match(/rgba?\(([^)]+)\)/i)
  if (!rgba) return raw.startsWith('#') ? 1 : fallback
  const parts = rgba[1].split(',').map((part) => part.trim())
  if (parts.length < 3) return fallback
  if (parts.length >= 4) {
    const alpha = Number.parseFloat(parts[3])
    return Number.isFinite(alpha) ? Math.max(0, Math.min(1, alpha)) : fallback
  }
  return 1
}

function readExportTileAppearance(grid, appearance) {
  const tile = grid?.querySelector?.('.timetableCourseTile, .timetableConflictTile')
  if (!(tile instanceof HTMLElement)) {
    const cardAlpha = Math.max(0, Math.min(1, appearance.courseCardOpacity ?? 0))
    return {
      alpha: cardAlpha,
      background: cardAlpha > 0.04 ? `rgba(37,99,235,${cardAlpha})` : 'transparent',
      border: cardAlpha > 0.04 ? `1px solid rgba(147,197,253,${Math.min(.36, cardAlpha * .36).toFixed(3)})` : '0',
      radius: cardAlpha > 0.04 ? '10px' : '0',
      shadow: cardAlpha > 0.04 ? `0 10px 22px rgba(2,6,23,${Math.min(.24, cardAlpha * .24).toFixed(3)})` : 'none',
      padding: cardAlpha > 0.04 ? '7px 8px' : '4px 8px',
    }
  }
  const cs = window.getComputedStyle(tile)
  const bgColor = exportSafeCssValue('background-color', cs.getPropertyValue('background-color') || '')
  const bgAlpha = rgbaAlphaFromCss(bgColor, 0)
  const storedAlpha = Math.max(0, Math.min(1, appearance.courseCardOpacity ?? bgAlpha))
  const visibleAlpha = Math.max(bgAlpha, storedAlpha <= 0.02 ? 0 : bgAlpha)
  const hasSurface = visibleAlpha > 0.04
  const borderWidth = px(cs.getPropertyValue('border-top-width'), 0)
  const borderColor = exportSafeCssValue('border-color', cs.getPropertyValue('border-top-color') || 'rgba(147,197,253,.28)')
  const radius = cs.getPropertyValue('border-radius') || '10px'
  const shadow = exportSafeCssValue('box-shadow', cs.getPropertyValue('box-shadow') || '')
  return {
    alpha: hasSurface ? visibleAlpha : 0,
    background: hasSurface ? bgColor : 'transparent',
    border: hasSurface && borderWidth > 0 ? `${Math.max(1, Math.round(borderWidth))}px solid ${borderColor}` : '0',
    radius: hasSurface ? radius : '0',
    shadow: hasSurface && shadow && shadow !== 'none' ? shadow : 'none',
    padding: hasSurface ? '7px 8px' : '4px 8px',
  }
}

function visualLengthForExport(text = '') {
  return Array.from(String(text || '')).reduce((sum, ch) => {
    if (/\s/.test(ch)) return sum + 0.25
    if (/[\u3000-\u9fff]/.test(ch)) return sum + 1
    if (/[A-Z0-9]/.test(ch)) return sum + 0.68
    return sum + 0.56
  }, 0)
}

function fitExportFontSize(text, boxWidth, boxHeight, base = 13, min = 8, maxLines = 2) {
  const len = Math.max(1, visualLengthForExport(text))
  const availablePerLine = Math.max(4, (boxWidth - 18) / base)
  const allowedLines = Math.max(1, Math.min(maxLines, Math.floor((boxHeight - 14) / (base * 1.14)) || 1))
  const capacity = availablePerLine * allowedLines
  if (len <= capacity) return base
  const ratio = Math.max(0.36, capacity / len)
  return Math.max(min, Math.min(base, Math.floor(base * Math.sqrt(ratio))))
}

function applyExportTextFit(element, text, width, height, base = 13, min = 8, maxLines = 2) {
  if (!(element instanceof HTMLElement)) return
  const size = fitExportFontSize(text, width, height, base, min, maxLines)
  element.style.fontSize = `${size}px`
  element.style.lineHeight = size <= 9 ? '1.08' : '1.12'
  element.style.maxHeight = `${Math.max(size + 2, Math.floor(height * 0.68))}px`
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


function hexToRgbaForExport(hex, alpha = 1) {
  const value = String(hex || '').trim().replace('#', '')
  const safe = value.length === 3
    ? value.split('').map((ch) => ch + ch).join('')
    : value.padEnd(6, '0').slice(0, 6)
  const r = Number.parseInt(safe.slice(0, 2), 16)
  const g = Number.parseInt(safe.slice(2, 4), 16)
  const b = Number.parseInt(safe.slice(4, 6), 16)
  return `rgba(${Number.isFinite(r) ? r : 37},${Number.isFinite(g) ? g : 99},${Number.isFinite(b) ? b : 235},${Math.max(0, Math.min(1, alpha))})`
}

function buildStableExportDom(element, semester = '課表') {
  const panel = element.querySelector('.semesterPanel') || element
  const grid = panel.querySelector('.timetableGridClean') || panel.querySelector('.grid') || panel
  const backgroundUrl = readBackgroundFromElement(panel)
  const appearance = readCurrentAppearance()
  const timetableTint = cssColorToRgba(appearance.tint || '#081426', [8, 20, 38, 1])
  const exportTintOpacity = Math.max(0, Math.min(1, appearance.timetableOpacity ?? 0.44))
  const exportCardOpacity = Math.max(0, Math.min(1, appearance.courseCardOpacity ?? 0.72))
  const tileAppearance = readExportTileAppearance(grid, appearance)
  const hasCardSurface = tileAppearance.alpha > 0.04
  const exportCourseBackground = tileAppearance.background
  const exportCourseBorder = tileAppearance.border
  const exportCourseShadow = tileAppearance.shadow
  const exportCourseRadius = tileAppearance.radius
  const exportCoursePadding = tileAppearance.padding

  // Build a fresh export-only timetable from the existing timetable data in the DOM.
  // This avoids the old bug-prone path that cloned live CSS, then fought html2canvas
  // over calc(), CSS variables, color(), backdrop-filter, and export-only overrides.
  const rows = Array.from(grid.querySelectorAll(':scope > .gridRow'))
  const usedDays = new Set()
  const usedRows = new Set()
  rows.forEach((row, rowIndex) => {
    const cells = Array.from(row.querySelectorAll(':scope > .timetableCell'))
    cells.forEach((cell, dayIndex) => {
      const hasTile = Boolean(cell.querySelector(':scope > .timetableCourseTile, :scope > .timetableConflictTile'))
      const occupied = cell.classList.contains('hasCourse') || hasTile
      if (!occupied) return
      usedDays.add(dayIndex)
      usedRows.add(rowIndex)
      const tile = cell.querySelector(':scope > .timetableCourseTile, :scope > .timetableConflictTile')
      const spanRaw = tile?.style?.getPropertyValue('--tile-span') || '1'
      const span = Math.max(1, Number.parseFloat(String(spanRaw).trim()) || 1)
      for (let i = 1; i < span; i += 1) usedRows.add(rowIndex + i)
    })
  })

  const keepDays = [0, 1, 2, 3, 4].filter((day) => day < DAYS.length)
  ;[5, 6].forEach((day) => { if (usedDays.has(day)) keepDays.push(day) })
  const maxUsedRow = usedRows.size ? Math.min(9, Math.max(...Array.from(usedRows))) : 9
  const periodCount = Math.min(10, Math.max(6, maxUsedRow + 1))
  const columnCount = keepDays.length || 5

  const cornerW = 66
  const headerRowH = 52
  const rowH = periodCount <= 6 ? 74 : periodCount <= 8 ? 68 : 62
  const dayW = columnCount <= 5 ? 186 : 164
  const gridWidth = cornerW + dayW * columnCount
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
  style.dataset.uniplanExportStyle = 'true'
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
      border:1px solid rgba(147,197,253,${(0.30 * exportTintOpacity).toFixed(3)});
      background:${rgbaString(timetableTint, exportTintOpacity)};
      box-shadow:none;
    }
    .uniplanStableExportBg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center center;z-index:0;pointer-events:none;}
    .uniplanStableExportTint{position:absolute;inset:0;background:${rgbaString(timetableTint, exportTintOpacity)};z-index:1;pointer-events:none;}
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
      background:rgba(15,23,42,${(0.18 * exportTintOpacity).toFixed(3)});
    }
    .uniplanStableExportCell.head,.uniplanStableExportCell.corner,.uniplanStableExportCell.period{
      background:rgba(15,23,42,${(0.46 * exportTintOpacity).toFixed(3)});
      color:#f3f8ff;
      text-shadow:0 1px 8px rgba(0,0,0,.20);
    }
    .uniplanStableExportCell.period{font-size:17px;color:#e6eefb;}
    .uniplanStableExportCourse{
      position:absolute;
      z-index:4;
      border-radius:${exportCourseRadius};
      padding:${exportCoursePadding};
      overflow:hidden;
      border:${exportCourseBorder};
      background:${exportCourseBackground}!important;
      box-shadow:${exportCourseShadow}!important;
    }
    .uniplanStableExportCourse::before,.uniplanStableExportCourse::after{content:none!important;display:none!important;}
    .uniplanStableExportCourseTitle{
      position:relative;z-index:1;display:block;font-size:13px;line-height:1.12;font-weight:950;color:#fff;
      word-break:break-word;overflow:hidden;max-height:42px;text-shadow:0 1px 6px rgba(0,0,0,.25);
    }
    .uniplanStableExportCourseMeta{position:relative;z-index:1;display:block;margin-top:6px;font-size:12px;line-height:1.15;font-weight:850;color:#e4efff;opacity:.95;}
    .uniplanStableExportDot{display:inline-block;width:9px;height:9px;border-radius:999px;background:#60a5fa;margin-right:7px;box-shadow:0 0 0 3px rgba(96,165,250,.20);vertical-align:1px;}
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
  keepDays.forEach((dayIndex, columnIndex) => addCell('head', `週${DAYS[dayIndex]}`, cornerW + dayW * columnIndex, 0, dayW, headerRowH))
  PERIODS.slice(0, periodCount).forEach((period, rowIndex) => addCell('period', String(period), 0, headerRowH + rowH * rowIndex, cornerW, rowH))
  PERIODS.slice(0, periodCount).forEach((period, rowIndex) => {
    keepDays.forEach((dayIndex, columnIndex) => addCell('', '', cornerW + dayW * columnIndex, headerRowH + rowH * rowIndex, dayW, rowH))
  })

  const addExportCourseTile = ({ tile, rowIndex, columnIndex, tileIndex = 0, stackCount = 1, onePeriod = false }) => {
    const spanRaw = tile.style.getPropertyValue('--tile-span') || window.getComputedStyle(tile).getPropertyValue('--tile-span') || '1'
    const rawSpan = Math.max(1, Math.min(periodCount - rowIndex, Math.round(px(spanRaw, 1))))
    const repeatRows = onePeriod ? 1 : rawSpan
    for (let offset = 0; offset < repeatRows; offset += 1) {
      const targetRow = rowIndex + offset
      if (targetRow >= periodCount) continue
      const left = cornerW + dayW * columnIndex + 8
      const fullTop = headerRowH + rowH * targetRow + 6
      const fullHeight = Math.max(42, rowH - 12)
      const topPx = stackCount > 1 ? fullTop + (fullHeight / stackCount) * tileIndex : fullTop
      const widthPx = dayW - 16
      const heightPx = stackCount > 1 ? Math.max(32, fullHeight / stackCount - 4) : fullHeight

      if (tile.classList.contains('mergedHalfTile') || tile.classList.contains('halfSemesterSplitTile')) {
        const course = document.createElement('div')
        course.className = 'uniplanStableExportCourse uniplanStableMergedHalfCourse'
        course.style.left = `${left}px`
        course.style.top = `${topPx}px`
        course.style.width = `${widthPx}px`
        course.style.height = `${heightPx}px`
        course.style.display = 'grid'
        course.style.gridTemplateColumns = '1fr 1fr'
        course.style.gap = '0'
        course.style.padding = '0'
        course.style.background = exportCourseBackground
        course.style.border = exportCourseBorder
        course.style.borderRadius = exportCourseRadius
        course.style.boxShadow = exportCourseShadow
        const segments = Array.from(tile.querySelectorAll('.mergedHalfSegment, .halfSemesterSegment')).slice(0, 2)
        segments.forEach((segment, segmentIndex) => {
          const part = document.createElement('div')
          part.style.position = 'relative'
          part.style.overflow = 'hidden'
          part.style.padding = '5px 6px'
          part.style.display = 'flex'
          part.style.flexDirection = 'column'
          part.style.justifyContent = 'center'
          part.style.background = 'transparent'
          if (segmentIndex === 1) part.style.borderLeft = hasCardSurface ? '1px solid rgba(147,197,253,.28)' : '1px solid rgba(147,197,253,.20)'
          const title = document.createElement('span')
          title.className = 'uniplanStableExportCourseTitle'
          const segmentTitle = makeExportCourseName(segment.querySelector('.tileTitle')?.textContent || segment.textContent || '課程')
          title.textContent = segmentTitle
          applyExportTextFit(title, segmentTitle, Math.max(38, widthPx / 2 - 12), Math.max(24, heightPx - 18), 11, 7, 2)
          const meta = document.createElement('span')
          meta.className = 'uniplanStableExportCourseMeta'
          meta.style.fontSize = heightPx <= 46 ? '8px' : '9px'
          meta.style.marginTop = '3px'
          meta.textContent = makeExportText(segment.querySelector('.tileMeta')?.textContent || '')
          part.appendChild(title)
          part.appendChild(meta)
          course.appendChild(part)
        })
        gridEl.appendChild(course)
        continue
      }

      const titleText = makeExportCourseName(tile.querySelector('.tileTitle')?.textContent || tile.querySelector('strong')?.textContent || tile.textContent)
      const metaText = makeExportText(tile.querySelector('.tileMeta')?.textContent || tile.querySelector('small')?.textContent || '')
      const course = document.createElement('div')
      course.className = 'uniplanStableExportCourse'
      course.style.left = `${left}px`
      course.style.top = `${topPx}px`
      course.style.width = `${widthPx}px`
      course.style.height = `${heightPx}px`
      course.style.background = exportCourseBackground
      course.style.border = exportCourseBorder
      course.style.borderRadius = exportCourseRadius
      course.style.boxShadow = exportCourseShadow

      const title = document.createElement('span')
      title.className = 'uniplanStableExportCourseTitle'
      const dot = document.createElement('i')
      dot.className = 'uniplanStableExportDot'
      title.appendChild(dot)
      title.appendChild(document.createTextNode(titleText || '課程'))
      applyExportTextFit(title, titleText || '課程', widthPx, Math.max(24, heightPx - 18), 13, 8, heightPx <= 48 ? 2 : 3)
      course.appendChild(title)

      const meta = document.createElement('span')
      meta.className = 'uniplanStableExportCourseMeta'
      meta.style.fontSize = heightPx <= 46 ? '9px' : '10px'
      meta.style.marginTop = heightPx <= 46 ? '2px' : '4px'
      meta.textContent = metaText
      course.appendChild(meta)

      gridEl.appendChild(course)
    }
  }

  rows.slice(0, periodCount).forEach((row, rowIndex) => {
    const cells = Array.from(row.querySelectorAll(':scope > .timetableCell'))
    keepDays.forEach((dayIndex, columnIndex) => {
      const cell = cells[dayIndex]
      if (!cell) return
      const tiles = Array.from(cell.querySelectorAll(':scope > .timetableCourseTile, :scope > .timetableConflictTile'))
      if (!tiles.length) return
      const stackCount = tiles.length
      tiles.forEach((tile, tileIndex) => {
        // Export in traditional grid mode: a 2-4 period course appears in every
        // 2/3/4 cell instead of one tall card. This avoids span-height bugs and
        // matches the requested clean timetable export format.
        addExportCourseTile({ tile, rowIndex, columnIndex, tileIndex, stackCount, onePeriod: false })
      })
    })
  })

  root.appendChild(gridEl)
  return { root, width: exportWidth, height: exportHeight }
}



function createExportProgressOverlay() {
  const overlay = document.createElement('div')
  overlay.setAttribute('data-uniplan-export-overlay', 'true')
  overlay.style.cssText = [
    'position:fixed',
    'inset:0',
    'z-index:2147483647',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'background:rgba(8,20,38,.86)',
    'color:#f8fafc',
    'font:600 15px -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans TC","Microsoft JhengHei",Arial,sans-serif',
    'letter-spacing:.04em',
    'pointer-events:none'
  ].join(';')
  const box = document.createElement('div')
  box.textContent = '正在匯出課表…'
  box.style.cssText = [
    'padding:14px 22px',
    'border-radius:999px',
    'background:rgba(15,23,42,.92)',
    'border:1px solid rgba(147,197,253,.45)',
    'box-shadow:0 18px 50px rgba(0,0,0,.32)',
    'color:#f8fafc'
  ].join(';')
  overlay.appendChild(box)
  document.body.appendChild(overlay)
  return () => overlay.remove()
}

function disableCanvasUnsafeGlobalStyles(keepRoot) {
  const disabled = []
  const nodes = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
  nodes.forEach((node) => {
    if (keepRoot?.contains?.(node)) return
    const isStyle = node.tagName === 'STYLE'
    const text = isStyle ? String(node.textContent || '') : ''
    const likelyUnsafe = !isStyle || UNSUPPORTED_CANVAS_COLOR_FN.test(text)
    if (!likelyUnsafe) return
    const sheet = node.sheet || null
    disabled.push({ node, nodeDisabled: node.disabled, sheet, sheetDisabled: sheet?.disabled })
    try { node.disabled = true } catch {}
    try { if (sheet) sheet.disabled = true } catch {}
  })
  return () => {
    disabled.reverse().forEach(({ node, nodeDisabled, sheet, sheetDisabled }) => {
      try { node.disabled = nodeDisabled } catch {}
      try { if (sheet) sheet.disabled = sheetDisabled } catch {}
    })
  }
}

function sanitizeExportClone(root) {
  if (!root) return
  root.querySelectorAll('button').forEach((button) => {
    button.setAttribute('aria-hidden', 'false')
    button.style.cursor = 'default'
  })
  root.querySelectorAll('.emptySlotButton').forEach((button) => {
    button.style.display = 'none'
  })
  root.querySelectorAll('.halfSemesterContinuationHitbox').forEach((hitbox) => {
    hitbox.remove()
  })
  root.querySelectorAll('.occupiedContinuation').forEach((node) => {
    node.remove()
  })
}

function prepareCompactTimetableExport(root, fallbackWidth = 1180, fallbackHeight = 780) {
  if (!root) return { width: fallbackWidth, height: fallbackHeight }
  const panel = root.querySelector('.semesterPanel.activeSemesterPanel') || root.querySelector('.semesterPanel')
  const grid = root.querySelector('.timetableGridClean')
  if (!panel || !grid) return { width: fallbackWidth, height: fallbackHeight }

  const dayHeaders = Array.from(grid.querySelectorAll(':scope > .timetableDay'))
  const rows = Array.from(grid.querySelectorAll(':scope > .gridRow'))
  const usedDays = new Set()
  const usedRows = new Set()

  rows.forEach((row, rowIndex) => {
    const cells = Array.from(row.querySelectorAll(':scope > .timetableCell'))
    cells.forEach((cell, dayIndex) => {
      const occupied = cell.classList.contains('hasCourse')
        || Boolean(cell.querySelector('.timetableCourseTile,.timetableConflictTile,.halfSemesterSplitTile'))
      if (occupied) {
        usedDays.add(dayIndex)
        usedRows.add(rowIndex)
      }
    })
  })

  // 課表匯出預設保留週一到週五；週末只有真的有課才留下。
  const keepDays = [0, 1, 2, 3, 4].filter((day) => dayHeaders[day])
  ;[5, 6].forEach((day) => {
    if (usedDays.has(day) && dayHeaders[day]) keepDays.push(day)
  })
  if (!keepDays.length) dayHeaders.slice(0, 5).forEach((_, index) => keepDays.push(index))
  const keepDaySet = new Set(keepDays)

  dayHeaders.forEach((header, dayIndex) => {
    if (!keepDaySet.has(dayIndex)) header.remove()
  })

  const maxUsedRow = usedRows.size ? Math.max(...Array.from(usedRows)) : 9
  // 保留到最後一堂課所在節次；至少保留 6 節，避免只有上午課時畫面太扁。
  const keepRowCount = Math.min(10, Math.max(6, maxUsedRow + 1))
  rows.forEach((row, rowIndex) => {
    if (rowIndex >= keepRowCount) {
      row.remove()
      return
    }
    const cells = Array.from(row.querySelectorAll(':scope > .timetableCell'))
    cells.forEach((cell, dayIndex) => {
      if (!keepDaySet.has(dayIndex)) cell.remove()
    })
  })

  const columnCount = keepDays.length
  const periodColumn = 56
  const dayColumn = columnCount <= 5 ? 184 : 168
  const gridWidth = periodColumn + columnCount * dayColumn
  const rowHeight = keepRowCount <= 6 ? 68 : 62
  const headerHeight = 42
  const gridHeight = headerHeight + keepRowCount * rowHeight
  const exportWidth = Math.max(760, Math.min(1320, gridWidth + 48))
  const exportHeight = Math.max(520, Math.min(1100, gridHeight + 118))

  root.classList.add('uniplanCompactScheduleExport')
  root.style.setProperty('width', `${exportWidth}px`, 'important')
  root.style.setProperty('min-width', `${exportWidth}px`, 'important')
  root.style.setProperty('height', `${exportHeight}px`, 'important')
  root.style.setProperty('min-height', `${exportHeight}px`, 'important')
  root.style.setProperty('padding', '0', 'important')
  root.style.setProperty('overflow', 'hidden', 'important')

  panel.style.setProperty('width', `${exportWidth}px`, 'important')
  panel.style.setProperty('min-width', `${exportWidth}px`, 'important')
  panel.style.setProperty('height', `${exportHeight}px`, 'important')
  panel.style.setProperty('min-height', `${exportHeight}px`, 'important')
  panel.style.setProperty('padding', '22px 24px 24px', 'important')
  panel.style.setProperty('box-sizing', 'border-box', 'important')
  panel.style.setProperty('overflow', 'hidden', 'important')

  grid.style.setProperty('width', `${gridWidth}px`, 'important')
  grid.style.setProperty('max-width', `calc(100% - 0px)`, 'important')
  grid.style.setProperty('min-width', '0', 'important')
  grid.style.setProperty('height', `${gridHeight}px`, 'important')
  grid.style.setProperty('min-height', `${gridHeight}px`, 'important')
  grid.style.setProperty('grid-template-columns', `${periodColumn}px repeat(${columnCount}, ${dayColumn}px)`, 'important')
  grid.style.setProperty('grid-auto-rows', `${rowHeight}px`, 'important')
  grid.style.setProperty('margin', '12px auto 0', 'important')
  grid.style.setProperty('border-radius', '18px', 'important')

  grid.querySelectorAll('.timetableCourseTile,.timetableConflictTile').forEach((tile) => {
    const rawSpan = tile.style.getPropertyValue('--tile-span')
      || tile.getAttribute('style')?.match(/--tile-span\s*:\s*([^;]+)/)?.[1]
      || '1'
    const span = Math.max(1, Number.parseFloat(String(rawSpan).trim()) || 1)
    const pixelHeight = Math.max(34, Math.round(rowHeight * span - 12))

    // html2canvas and some browsers do not reliably preserve calc() expressions
    // with custom-property multiplication after the export clone is resized.
    // Use an explicit px height so multi-period cards keep their real body text
    // instead of collapsing into only the top strip.
    tile.style.setProperty('inset', '6px', 'important')
    tile.style.setProperty('top', '6px', 'important')
    tile.style.setProperty('right', '6px', 'important')
    tile.style.setProperty('bottom', 'auto', 'important')
    tile.style.setProperty('left', '6px', 'important')
    tile.style.setProperty('height', `${pixelHeight}px`, 'important')
    tile.style.setProperty('min-height', `${pixelHeight}px`, 'important')
    tile.style.setProperty('max-height', `${pixelHeight}px`, 'important')
    tile.style.setProperty('overflow', 'hidden', 'important')
  })

  return { width: exportWidth, height: exportHeight }
}

export async function exportPngFromDom(element, semester = '課表') {
  if (!element) {
    alert('找不到目前課表畫面，無法匯出 PNG。')
    return false
  }

  let exportRoot = null
  let restoreCanvasStyles = null
  let removeExportOverlay = null
  try {
    removeExportOverlay = createExportProgressOverlay()
    await new Promise((resolve) => requestAnimationFrame(resolve))
    const stable = buildStableExportDom(element, semester)
    exportRoot = stable.root
    document.body.appendChild(exportRoot)
    restoreCanvasStyles = disableCanvasUnsafeGlobalStyles(exportRoot)
    exportRoot.dataset.restoreCanvasStyles = 'pending'
    await waitForImages(exportRoot)
    if (document.fonts?.ready) await document.fonts.ready
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(exportRoot, {
      backgroundColor: null,
      scale: Math.max(2, Math.min(3, window.devicePixelRatio || 2)),
      useCORS: true,
      allowTaint: false,
      imageTimeout: 15000,
      logging: false,
      width: stable.width,
      height: stable.height,
      windowWidth: stable.width,
      windowHeight: stable.height,
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
    console.error('Timetable PNG export failed.', error)
    alert('PNG 匯出失敗：目前畫面匯出失敗，請回報 Console 錯誤。')
    return false
  } finally {
    if (exportRoot?.dataset?.restoreCanvasStyles === 'pending') {
      // restore is kept on the function scope through the export root marker
    }
    if (typeof restoreCanvasStyles === 'function') restoreCanvasStyles()
    if (typeof removeExportOverlay === 'function') removeExportOverlay()
    if (exportRoot?.parentNode) exportRoot.parentNode.removeChild(exportRoot)
  }
}





export async function exportCleanPng(plan, semester = '課表') {
  // Wallpaper Export V5: smart phone-wallpaper layout.
  // Hides unused weekend columns, crops empty periods, and uses proportional widget cards that keep cross-period intuition.
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
  const marginX = 42
  const topY = 104
  const tableX = marginX
  const tableY = 226
  const tableW = canvasW - marginX * 2
  const timeW = 62
  const headH = 84
  const idealRowH = visiblePeriods.length <= 6 ? 244 : visiblePeriods.length <= 8 ? 215 : 188
  const maxTableH = canvasH - tableY - 210
  const tableH = Math.min(maxTableH, headH + idealRowH * visiblePeriods.length)
  const rowH = (tableH - headH) / visiblePeriods.length
  const dayW = (tableW - timeW) / visibleDays.length
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
  const coursePalette = [
    ['#2563eb', '#7c3aed'],
    ['#0ea5e9', '#2563eb'],
    ['#14b8a6', '#0f766e'],
    ['#8b5cf6', '#4338ca'],
    ['#f59e0b', '#ea580c'],
    ['#22c55e', '#15803d'],
    ['#ec4899', '#7e22ce'],
  ]
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
  const exportTintAlpha = Math.max(0, Math.min(1, appearance.timetableOpacity ?? .22))
  veil.addColorStop(0, rgbaString(tint, exportTintAlpha))
  veil.addColorStop(.46, rgbaString(tint, exportTintAlpha))
  veil.addColorStop(1, rgbaString(tint, exportTintAlpha))
  ctx.fillStyle = veil
  ctx.fillRect(0, 0, canvasW, canvasH)

  // Compact title; leaves the wallpaper center for the timetable/widget area.
  ctx.save()
  ctx.fillStyle = 'rgba(248,250,252,.62)'
  ctx.font = '900 18px Inter, Noto Sans TC, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('UNIPLAN', marginX + 8, topY)
  ctx.fillStyle = '#ffffff'
  ctx.font = '900 52px Inter, Noto Sans TC, sans-serif'
  ctx.shadowColor = 'rgba(0,0,0,.36)'
  ctx.shadowBlur = 18
  ctx.fillText(`${semester}課表`, marginX + 6, topY + 66)
  ctx.restore()

  // Smart timetable plate.
  const plate = ctx.createLinearGradient(tableX, tableY, tableX, tableY + tableH)
  plate.addColorStop(0, `rgba(15,23,42,${(exportTintAlpha * .46).toFixed(3)})`)
  plate.addColorStop(1, `rgba(15,23,42,${(exportTintAlpha * .28).toFixed(3)})`)
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,.22)'
  ctx.shadowBlur = 34
  ctx.shadowOffsetY = 14
  fillRound(tableX, tableY, tableW, tableH, 46, plate)
  ctx.restore()
  if (exportTintAlpha > 0) strokeRound(tableX, tableY, tableW, tableH, 46, `rgba(255,255,255,${(0.22 * exportTintAlpha).toFixed(3)})`, 1.15)

  ctx.save()
  roundRect(tableX, tableY, tableW, tableH, 46)
  ctx.clip()

  ctx.fillStyle = `rgba(255,255,255,${(0.036 * exportTintAlpha).toFixed(3)})`
  ctx.fillRect(tableX, tableY, tableW, headH)
  ctx.textAlign = 'center'
  ctx.font = '900 29px Inter, Noto Sans TC, sans-serif'
  visibleDays.forEach((day, i) => {
    const cx = tableX + timeW + i * dayW + dayW / 2
    const cy = tableY + headH / 2
    const capsuleW = Math.min(108, Math.max(76, dayW * .42))
    fillRound(cx - capsuleW / 2, cy - 23, capsuleW, 46, 23, `rgba(255,255,255,${(0.11 * exportTintAlpha).toFixed(3)})`)
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

  ctx.textAlign = 'center'
  ctx.font = '900 23px Inter, Noto Sans TC, sans-serif'
  visiblePeriods.forEach((period, r) => {
    const y = tableY + headH + r * rowH + rowH / 2
    fillRound(tableX + 13, y - 21, 38, 42, 20, `rgba(255,255,255,${(0.064 * exportTintAlpha).toFixed(3)})`)
    ctx.fillStyle = 'rgba(255,255,255,.68)'
    ctx.fillText(`${period}`, tableX + 32, y + 8)
  })

  const slotGroups = []
  const usedSlots = new Set()
  allSlots.forEach((slot, index) => {
    if (usedSlots.has(index)) return
    const group = [slot]
    allSlots.forEach((other, otherIndex) => {
      if (otherIndex <= index || usedSlots.has(otherIndex)) return
      if (slot.day === other.day && slot.start === other.start && slot.end === other.end && mergeableHalfSemesterGroup(slot.course, other.course)) {
        group.push(other)
        usedSlots.add(otherIndex)
      }
    })
    usedSlots.add(index)
    slotGroups.push(group)
  })

  const placedKeys = new Set()
  const drawCourseCard = (slotGroup) => {
    const slot = slotGroup[0]
    if (!dayToIndex.has(slot.day) || slot.end < firstPeriod || slot.start > lastPeriod) return
    const safeStart = Math.max(firstPeriod, slot.start)
    const key = `${slotGroup.map((entry) => uid(entry.course)).join('-')}-${slot.day}-${safeStart}`
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
    const baseA = cssColorToRgba(appearance.accent || palette[0], [37, 99, 235, 1])
    const baseB = cssColorToRgba(palette[1], [124, 58, 237, 1])
    const top = brightenRgba(baseA, .25)
    const bottom = mixRgba(baseA, baseB, .58)
    const deep = darkenRgba(bottom, .20)

    const cardAlpha = Math.max(0, Math.min(1, appearance.courseCardOpacity ?? .72))

    ctx.save()
    ctx.shadowColor = rgbaString(baseA, .52 * cardAlpha)
    ctx.shadowBlur = 34
    ctx.shadowOffsetY = 10
    const glow = ctx.createRadialGradient(x + w / 2, y + h / 2, 12, x + w / 2, y + h / 2, Math.max(w, h))
    glow.addColorStop(0, rgbaString(baseA, .22 * cardAlpha))
    glow.addColorStop(1, 'rgba(255,255,255,0)')
    fillRound(x - 8, y - 8, w + 16, h + 16, 38, glow)
    const card = ctx.createLinearGradient(x, y, x + w, y + h)
    card.addColorStop(0, rgbaString(top, cardAlpha))
    card.addColorStop(.58, rgbaString(bottom, cardAlpha))
    card.addColorStop(1, rgbaString(deep, cardAlpha))
    fillRound(x, y, w, h, 34, card)
    ctx.restore()
    if (cardAlpha > 0) strokeRound(x, y, w, h, 34, `rgba(255,255,255,${(0.42 * cardAlpha).toFixed(3)})`, 1.25)

    ctx.save()
    roundRect(x, y, w, h, 34)
    ctx.clip()
    const shine = ctx.createLinearGradient(x, y, x, y + h * .58)
    shine.addColorStop(0, `rgba(255,255,255,${(0.34 * cardAlpha).toFixed(3)})`)
    shine.addColorStop(.7, `rgba(255,255,255,${(0.04 * cardAlpha).toFixed(3)})`)
    shine.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = shine
    ctx.fillRect(x, y, w, h * .62)
    ctx.fillStyle = `rgba(2,6,23,${(0.12 * cardAlpha).toFixed(3)})`
    ctx.fillRect(x, y + h * .68, w, h * .32)

    if (slotGroup.length > 1) {
      ctx.fillStyle = `rgba(255,255,255,${(0.18 * cardAlpha).toFixed(3)})`
      ctx.fillRect(x + w / 2 - .7, y, 1.4, h)
      ctx.fillStyle = `rgba(236,72,153,${(cardAlpha * .22).toFixed(3)})`
      ctx.fillRect(x + w / 2, y, w / 2, h)
    }
    ctx.restore()

    ctx.save()
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0,0,0,.36)'
    ctx.shadowBlur = 10
    const room = c.classroom || c.room || c.location || ''
    const timeRange = span > 1 ? `第 ${safeStart}–${Math.min(lastPeriod, slot.end)} 節` : `第 ${safeStart} 節`

    if (slotGroup.length > 1) {
      const orderedParts = slotGroup.slice(0, 2).sort((a, b) => {
        const getWeekStart = (item) => {
          const label = scheduleRuleLabel(item.course) || ''
          const match = String(label).match(/(\d{1,2})\s*[-－~～]/)
          return match ? Number(match[1]) : 99
        }
        return getWeekStart(a) - getWeekStart(b)
      })
      orderedParts.forEach((entry, partIndex) => {
        const pc = getCourse(entry.course)
        const partName = makeExportCourseName(pc.name || '課程')
        const cx = x + (partIndex === 0 ? w * .25 : w * .75)
        const partW = w / 2 - 18
        ctx.fillStyle = '#ffffff'
        ctx.font = '900 22px Inter, Noto Sans TC, sans-serif'
        drawCenteredLines(partName || '課程', cx, y + h * .36, partW, 25, 2)
        ctx.font = '850 18px Inter, Noto Sans TC, sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,.90)'
        ctx.fillText(scheduleRuleLabel(entry.course) || timeRange, cx, y + h - (room ? 48 : 24))
        const partRoom = pc.classroom || pc.room || pc.location || room
        if (partRoom) {
          ctx.font = '850 17px Inter, Noto Sans TC, sans-serif'
          ctx.fillStyle = 'rgba(255,255,255,.78)'
          ctx.fillText(partRoom, cx, y + h - 21)
        }
      })
    } else {
      ctx.fillStyle = '#ffffff'
      ctx.font = '900 30px Inter, Noto Sans TC, sans-serif'
      const nameLines = w >= 210 ? 1 : 2
      const nameY = y + (h >= 220 ? h * .39 : h * .43) - (nameLines === 2 ? 12 : 0)
      drawCenteredLines(displayName || '課程', x + w / 2, nameY, w - 34, 32, nameLines)
      ctx.font = '850 22px Inter, Noto Sans TC, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,.86)'
      ctx.fillText(scheduleRuleLabel(slot.course) || timeRange, x + w / 2, y + h - (room ? 58 : 30))
      if (room) {
        ctx.font = '850 21px Inter, Noto Sans TC, sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,.78)'
        ctx.fillText(room, x + w / 2, y + h - 25)
      }
    }
    ctx.restore()
  }

  slotGroups.forEach(drawCourseCard)
  ctx.restore()

  ctx.save()
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255,255,255,.42)'
  ctx.font = '800 21px Inter, Noto Sans TC, sans-serif'
  ctx.fillText(`智慧桌布 V5 · ${visibleDays.length}日 / ${visiblePeriods[0]}-${visiblePeriods[visiblePeriods.length - 1]}節`, canvasW / 2, canvasH - 118)
  ctx.restore()

  await new Promise((resolve) => {
    canvas.toBlob((blob) => {
      try {
        const url = blob ? URL.createObjectURL(blob) : canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.href = url
        a.download = `${semester}_手機桌布課表_V5.png`
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

