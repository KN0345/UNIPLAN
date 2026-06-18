import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { fetchCourses, fetchMetadata } from '../api'
import { COURSE_CATALOG_TERMS, catalogTermForSemester, courseCatalogTermValue, courseSmartScore,  extractCourseList, findConflict, getCourse, credits, courseKey, reviewKey, requiredTypeLabel } from '../utils/coursePlanning'
import { COURSE_TAGS, countCourseTagVotes } from '../data/courses/courseTags'

function useDebouncedValue(value, delay = 180) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])
  return debounced
}


function normalizeSearchText(value = '') {
  return String(value || '').replace(/[（）()\s:：／/\-—_\.．。]/g, '').toLowerCase()
}

const PHONETIC_GROUPS = [
  '郭國過鍋果', '繼際紀季計記技濟劑績', '管館冠觀關官', '理裡裏禮李里', '學薛雪', '程城成承呈', '設社射涉', '資知之支職', '料聊寮', '結節捷傑潔', '構購溝夠', '經京精菁晶', '濟季際計技記', '統同通童', '計技記季際濟', '管館冠', '企起啟', '商傷尚', '工公攻宮', '文聞蚊', '教交焦郊', '育玉遇域', '科顆柯', '院願苑', '榮容融', '譽玉育遇', '智知製置治', '慧惠會繪', '數術樹', '位味未衛', '金今津', '融容榮', '創窗闖', '新心薪', '英應鷹', '日入', '法發髮', '德得', '西希吸', '班般斑', '國郭', '際記季計技繼', '政正症', '治製志智'
]
const PHONETIC_MAP = PHONETIC_GROUPS.reduce((map, group) => {
  const chars = [...group]
  chars.forEach((char) => { map[char] = chars.filter((x) => x !== char) })
  return map
}, {})

function expandNearSoundText(value = '') {
  const raw = String(value || '')
  const variants = new Set([raw])
  const chars = [...raw]
  chars.forEach((char, index) => {
    ;(PHONETIC_MAP[char] || []).slice(0, 8).forEach((alt) => {
      const next = [...chars]
      next[index] = alt
      variants.add(next.join(''))
    })
  })
  return [...variants].join(' ')
}

function levenshteinWithin(a = '', b = '', limit = 1) {
  a = String(a || '')
  b = String(b || '')
  if (!a || !b) return false
  if (Math.abs(a.length - b.length) > limit) return false
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i += 1) {
    let rowMin = i
    let last = prev[0]
    prev[0] = i
    for (let j = 1; j <= b.length; j += 1) {
      const temp = prev[j]
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      const next = Math.min(prev[j] + 1, prev[j - 1] + 1, last + cost)
      prev[j] = next
      last = temp
      if (next < rowMin) rowMin = next
    }
    if (rowMin > limit) return false
  }
  return prev[b.length] <= limit
}

function fuzzyTokenMatch(text = '', piece = '') {
  const target = normalizeSearchText(piece)
  if (!target || target.length < 2) return true
  if (text.includes(target)) return true
  const variants = tokenizeCourseText(expandNearSoundText(piece))
  if (variants.some((item) => item && text.includes(item))) return true
  if (target.length >= 2 && /[\u4e00-\u9fff]/.test(piece)) {
    const cjkTokens = (text.match(/[\u4e00-\u9fff]{2,8}/g) || []).flatMap((run) => {
      const out = []
      for (let size = Math.max(2, target.length - 1); size <= Math.min(run.length, target.length + 1); size += 1) {
        for (let i = 0; i <= run.length - size; i += 1) out.push(run.slice(i, i + size))
      }
      return out
    })
    if (cjkTokens.some((token) => levenshteinWithin(normalizeSearchText(token), target, 1))) return true
  }
  return false
}

const SMART_SEARCH_ALIASES = [
  ['管理學', 'guanlixue glx 管理'],
  ['教育科技', 'jiaoyukeji jykj 教科'],
  ['教育科技概論', 'jiaoyukejigailun jykjgl 教科概論'],
  ['人工智慧', 'rengongzhihui rgzh ai'],
  ['程式設計', 'chengshisheji chengshe cssj 程設'],
  ['資料結構', 'ziliejiegou zljg 資結'],
  ['微積分', 'weijifen wjf'],
  ['統計學', 'tongjixue tjx 統計'],
  ['經濟學', 'jingjixue jjx 經濟'],
  ['會計學', 'kuaijixue kjx 會計'],
  ['心理學', 'xinlixue xlx 心理'],
  ['英文', 'yingwen yw english'],
  ['日本', 'riben rb'],
  ['法文', 'fawen fw'],
  ['德文', 'dewen dw'],
  ['西班牙', 'xibanya xby'],
  ['永續', 'yongxu yx esg'],
  ['生成式', 'shengchengshi scs generative'],
  ['數位', 'shuwei sw digital'],
  ['商管', 'shangguan sg'],
  ['文學院', 'wenxueyuan wxy'],
  ['工學院', 'gongxueyuan gxy'],
  ['理學院', 'lixueyuan lxy'],
  ['教育學院', 'jiaoyuxueyuan jyxy'],
  ['國際', 'guoji gj'],
  ['共同科', 'gongtongke gtk'],
  ['榮譽學程', 'rongyuxuecheng ryxc'],
]

function expandSmartText(value = '') {
  const raw = String(value || '')
  const normalized = normalizeSearchText(raw)
  const chunks = [raw, normalized, expandNearSoundText(raw)]
  SMART_SEARCH_ALIASES.forEach(([word, aliases]) => {
    if (raw.includes(word) || normalized.includes(normalizeSearchText(word))) chunks.push(aliases)
  })
  return normalizeSearchText(chunks.join(' '))
}

function tokenizeCourseText(value = '') {
  const raw = String(value || '')
  const cleaned = raw.replace(/[（）()\s:：／/\-—_\.．。，,、;；]+/g, ' ').trim()
  const tokens = cleaned.split(/\s+/).filter(Boolean)
  const cjkRuns = raw.match(/[\u4e00-\u9fff]{2,}/g) || []
  cjkRuns.forEach((run) => {
    for (let size = 2; size <= Math.min(4, run.length); size += 1) {
      for (let i = 0; i <= run.length - size; i += 1) tokens.push(run.slice(i, i + size))
    }
  })
  return [...new Set(tokens.map(normalizeSearchText).filter(Boolean))]
}

function buildSearchText(course) {
  const f = fieldText(course)
  const deptAliases = extractDepartmentCandidates(course).flatMap(departmentAliases)
  const source = [f.name, f.baseName, f.code, f.teacher, f.unit, ...deptAliases].join(' ')
  return `${expandSmartText(source)} ${tokenizeCourseText(source).join(' ')}`
}

function stripClassSuffix(value = '') {
  return String(value || '')
    .replace(/\s*[（(][^）)]*班[）)]\s*$/i, '')
    .trim()
}

function fieldText(course) {
  const c = getCourse(course)
  return {
    name: String(c.name || c.course_name || ''),
    baseName: stripClassSuffix(c.name || c.course_name || ''),
    code: String(c.serial || c.code || c.course_id || ''),
    teacher: String(c.teacher || c.instructor || ''),
    unit: String(c.department || c.major || c.unit || c.category || ''),
  }
}


function extractDepartmentCandidates(course) {
  const c = getCourse(course)
  return [
    c.department,
    c.dept,
    c.major,
    c.unit,
    c.opening_unit,
    c.openingUnit,
    c.category,
    c.raw_json?.department,
    c.raw_json?.major,
    c.raw_json?.unit,
    c.raw_json?.opening_unit,
  ].map((value) => String(value || '').trim()).filter(Boolean)
}

function normalizeDepartmentOption(value = '') {
  return String(value || '').trim()
    .replace(/^系別[:：]\s*/, '')
    .replace(/^Department\s*[:：]?\s*/i, '')
    .replace(/\s+/g, ' ')
}

function departmentAliases(value = '') {
  const text = String(value || '').trim()
  const aliases = new Set([text])
  aliases.add(text.replace(/系$/, ''))

  // 共同科／榮譽學程的 department 常見格式：TGAXM.文學院共同科－碩。
  // 使用者通常會直接搜尋 TGAXM、TGDXM、TGEXB 這類代碼，所以要把代碼前綴也當成科系別名。
  const codePrefix = text.match(/^([A-Za-z]{2,6}[A-Za-z0-9]{0,4})[.．。\s_-]/)?.[1]
  if (codePrefix) aliases.add(codePrefix.toUpperCase())
  const normalizedCodePrefix = text.match(/^([A-Za-z]{2,6}[A-Za-z0-9]{0,4})/)?.[1]
  if (normalizedCodePrefix && /^TG[A-Z0-9]+$/i.test(normalizedCodePrefix)) aliases.add(normalizedCodePrefix.toUpperCase())

  if (/共同科/.test(text)) aliases.add(text.replace(/^([A-Za-z0-9]+)[.．。]?/, ''))
  if (/企管|企業管理/.test(text)) ['企管', '企業管理', '企管系', '企業管理系'].forEach((x) => aliases.add(x))
  if (/教科|教育科技/.test(text)) ['教科', '教育科技', '教科系', '教育科技系'].forEach((x) => aliases.add(x))
  if (/觀光/.test(text)) ['觀光', '觀光系'].forEach((x) => aliases.add(x))
  if (/資管|資訊管理/.test(text)) ['資管', '資訊管理', '資管系', '資訊管理系'].forEach((x) => aliases.add(x))
  if (/中文|中國文學/.test(text)) ['中文', '中文系', '中國文學'].forEach((x) => aliases.add(x))
  return [...aliases].map((x) => String(x || '').trim()).filter(Boolean)
}

function parseSmartQuery(rawQuery, departments = []) {
  let raw = String(rawQuery || '').trim()
  const compact = expandSmartText(raw)
  const hits = []
  ;(departments || []).forEach((dept) => {
    departmentAliases(dept).forEach((alias) => {
      const normalized = normalizeSearchText(alias)
      if (normalized && compact.includes(normalized)) hits.push({ dept, alias, normalized, length: normalized.length })
    })
  })
  hits.sort((a, b) => b.length - a.length)
  const departmentHit = hits[0] || null
  let courseQuery = raw
  if (departmentHit) {
    departmentAliases(departmentHit.dept).sort((a, b) => String(b).length - String(a).length).forEach((alias) => {
      if (!alias) return
      courseQuery = courseQuery.replaceAll(alias, ' ')
      courseQuery = courseQuery.replaceAll(alias.replace(/系$/, ''), ' ')
    })
    courseQuery = courseQuery.replace(/\s+/g, ' ').trim()
    // 如果剩下的字只是 department label 的一部分，例如「TGAXM 文學」或「TGDXM 教育」，
    // 視為純科系代碼搜尋，不再拿殘字去比對課名，避免把正確結果過濾掉。
    const leftover = normalizeSearchText(courseQuery)
    const deptText = normalizeSearchText(departmentHit.dept)
    if (leftover && deptText.includes(leftover)) courseQuery = ''
  }
  return { raw, compact, department: departmentHit?.dept || '', courseQuery: courseQuery || raw }
}

function courseMatchesQuery(course, query, departments = []) {
  const parsed = parseSmartQuery(query, departments)
  const q = expandSmartText(parsed.courseQuery)
  if (!q) return true
  const f = fieldText(course)
  const text = buildSearchText(course)
  if (text.includes(q)) return true
  const pieces = tokenizeCourseText(parsed.courseQuery || query).concat(String(parsed.courseQuery || query).split(/\s+/).map(normalizeSearchText)).filter(Boolean)
  return pieces.length > 1 && pieces.every((piece) => fuzzyTokenMatch(text, piece))
}


function courseMatchesParsed(course, parsed) {
  const q = expandSmartText(parsed?.courseQuery || '')
  if (!q) return true
  const f = fieldText(course)
  const text = buildSearchText(course)
  if (text.includes(q)) return true
  const pieces = tokenizeCourseText(parsed?.courseQuery || '').concat(String(parsed?.courseQuery || '').split(/\s+/).map(normalizeSearchText)).filter(Boolean)
  return pieces.length > 1 && pieces.every((piece) => fuzzyTokenMatch(text, piece))
}

function relevanceScoreParsed(course, parsed) {
  const c = getCourse(course)
  const q = expandSmartText(parsed?.courseQuery || '')
  if (!q && !parsed?.department) return 0
  const f = fieldText(c)
  const name = normalizeSearchText(f.name)
  const baseName = normalizeSearchText(f.baseName)
  const code = normalizeSearchText(f.code)
  const teacher = normalizeSearchText(f.teacher)
  const unit = normalizeSearchText(f.unit)
  const dept = normalizeSearchText(parsed?.department || '')
  let score = 0
  if (dept && unit.includes(dept)) score += 900
  if (baseName === q) score += 1000
  if (name === q) score += 900
  if (baseName.startsWith(q)) score += 650
  if (name.startsWith(q)) score += 600
  if (name.includes(q)) score += 420
  if (code === q) score += 500
  if (code.includes(q)) score += 180
  if (teacher.includes(q)) score += 130
  if (!teacher.includes(q) && fuzzyTokenMatch(teacher, parsed?.courseQuery || '')) score += 95
  if (unit.includes(q)) score += 80
  if (dept && !unit.includes(dept)) score -= 260
  score += Math.max(0, 80 - Math.abs(name.length - q.length) * 4)
  return score
}

function relevanceScore(course, query, departments = []) {
  const c = getCourse(course)
  const parsed = parseSmartQuery(query, departments)
  const q = expandSmartText(parsed.courseQuery)
  if (!q && !parsed.department) return 0
  const f = fieldText(c)
  const name = normalizeSearchText(f.name)
  const baseName = normalizeSearchText(f.baseName)
  const code = normalizeSearchText(f.code)
  const teacher = normalizeSearchText(f.teacher)
  const unit = normalizeSearchText(f.unit)
  let score = 0
  if (parsed.department && unit.includes(normalizeSearchText(parsed.department))) score += 900
  if (baseName === q) score += 1000
  if (name === q) score += 900
  if (baseName.startsWith(q)) score += 650
  if (name.startsWith(q)) score += 600
  if (name.includes(q)) score += 420
  if (code === q) score += 500
  if (code.includes(q)) score += 180
  if (teacher.includes(q)) score += 130
  if (!teacher.includes(q) && fuzzyTokenMatch(teacher, parsed?.courseQuery || '')) score += 95
  if (unit.includes(q)) score += 80
  if (parsed.department && !unit.includes(normalizeSearchText(parsed.department))) score -= 260
  score += Math.max(0, 80 - Math.abs(name.length - q.length) * 4)
  return score
}

function sameDepartmentSortKey(course) {
  const c = getCourse(course)
  return String(c.department || c.major || c.unit || c.category || '')
}

const COURSE_RESULT_RENDER_LIMIT = 12000
const COURSE_RESULT_QUERY_LIMIT = 12000

function visibleCourseLimit(query) {
  return String(query || '').trim() ? COURSE_RESULT_QUERY_LIMIT : COURSE_RESULT_RENDER_LIMIT
}


function buildCourseSearchRecord(course) {
  const c = getCourse(course)
  const departmentCandidates = extractDepartmentCandidates(course)
  return {
    course,
    c,
    searchText: buildSearchText(course),
    departmentKeys: departmentCandidates.map(normalizeSearchText),
    sortDepartment: sameDepartmentSortKey(course),
    nameSort: String(c.name || ''),
    reviewKey: reviewKey(c),
    courseKey: courseKey(course),
    smartBaseScore: courseSmartScore(course, { isFavorite: false, hasConflict: false }),
  }
}

function courseRecordMatchesParsed(record, parsed) {
  const q = expandSmartText(parsed?.courseQuery || '')
  if (!q) return true
  if (record.searchText.includes(q)) return true
  const pieces = tokenizeCourseText(parsed?.courseQuery || '').concat(String(parsed?.courseQuery || '').split(/\s+/).map(normalizeSearchText)).filter(Boolean)
  return pieces.length > 1 && pieces.every((piece) => fuzzyTokenMatch(record.searchText, piece))
}

function relevanceScoreRecord(record, parsed) {
  const q = expandSmartText(parsed?.courseQuery || '')
  const dept = normalizeSearchText(parsed?.department || '')
  if (!q && !dept) return 0
  const f = fieldText(record.c)
  const name = normalizeSearchText(f.name)
  const baseName = normalizeSearchText(f.baseName)
  const code = normalizeSearchText(f.code)
  const teacher = normalizeSearchText(f.teacher)
  const unit = normalizeSearchText(f.unit)
  let score = 0
  if (dept && unit.includes(dept)) score += 900
  if (baseName === q) score += 1000
  if (name === q) score += 900
  if (baseName.startsWith(q)) score += 650
  if (name.startsWith(q)) score += 600
  if (name.includes(q)) score += 420
  if (code === q) score += 500
  if (code.includes(q)) score += 180
  if (teacher.includes(q)) score += 130
  if (!teacher.includes(q) && fuzzyTokenMatch(teacher, parsed?.courseQuery || '')) score += 95
  if (unit.includes(q)) score += 80
  if (dept && !unit.includes(dept)) score -= 260
  score += Math.max(0, 80 - Math.abs(name.length - q.length) * 4)
  return score
}

function requirementMatches(course, requirement) {
  if (!requirement || requirement === '全部') return true
  const label = requiredTypeLabel(course)
  if (requirement === '必修') return /必/.test(label) && !/選/.test(label)
  if (requirement === '選修') return /選/.test(label)
  return true
}

export function useCourseSearchState({ activeSemester, favorites = [], candidates = [], plan = [], tagVotes = {} }) {
  const [courses, setCourses] = useState([])
  const [query, setQuery] = useState('')
  const [metadata, setMetadata] = useState({ departments: [], categories: [], grades: [], majors: [], semesters: [] })
  const [searchFilters, setSearchFilters] = useState({ department: '全部', requirement: '全部', grade: '全部', weekday: '全部', period: '全部', tag: '全部' })
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [courseCatalogTerm, setCourseCatalogTerm] = useState(() => localStorage.getItem('uniplan:courseCatalogTerm') ?? catalogTermForSemester('大一上'))
  const [searchTab, setSearchTab] = useState('results')
  const [searchSort, setSearchSort] = useState('smart')
  const [searchOnlyAvailable, setSearchOnlyAvailable] = useState(false)
  const debouncedQuery = useDebouncedValue(query, 180)
  const deferredQuery = useDeferredValue(debouncedQuery)

  async function runCourseSearch(overrides = {}) {
    const nextQuery = Object.prototype.hasOwnProperty.call(overrides, 'query') ? overrides.query : query
    const nextFilters = overrides.searchFilters || searchFilters
    const nextCatalogTerm = Object.prototype.hasOwnProperty.call(overrides, 'courseCatalogTerm') ? overrides.courseCatalogTerm : courseCatalogTerm
    setSearchLoading(true)
    setSearchError('')
    const backendKeyword = Object.prototype.hasOwnProperty.call(overrides, 'backendKeyword')
      ? overrides.backendKeyword
      : ''
    const params = {
      // 搜尋字詞只做前端即時篩選，避免每次按搜尋或切換條件時讓後端先縮掉資料池。
      // 需要後端精準查詢時可由 overrides.backendKeyword 顯式指定。
      keyword: String(backendKeyword || '').trim(),
      semester: nextCatalogTerm || '全部',
      // 科系／共同科篩選改由前端做模糊比對。
      // 不送 department 給後端，避免後端精準查詢把 TGEXB/TGLXM 等共同科整批排除。
      department: '全部',
      grade: nextFilters.grade,
      weekday: nextFilters.weekday,
      period: nextFilters.period,
    }
    try {
      const data = await fetchCourses(params)
      const nextCourses = extractCourseList(data)
      setCourses(nextCourses)
      return nextCourses
    } catch (error) {
      console.error(error)
      setSearchError('課程搜尋失敗。請確認後端是否已啟動，或稍後再試。')
      return []
    } finally {
      setSearchLoading(false)
    }
  }

  useEffect(() => {
    fetchMetadata()
      .then((payload) => setMetadata(payload?.data || payload || { departments: [], categories: [], grades: [], majors: [], semesters: [] }))
      .catch(() => null)
    runCourseSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    localStorage.setItem('uniplan:courseCatalogTerm', courseCatalogTerm)
    runCourseSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseCatalogTerm])

  const departmentPool = useMemo(() => Array.from(new Set([...(metadata.departments || []), ...(metadata.units || []), ...(metadata.majors || []), ...(courses || []).flatMap(extractDepartmentCandidates)])), [metadata, courses])
  const indexedCourses = useMemo(() => (courses || []).map(buildCourseSearchRecord), [courses])
  const favoriteKeys = useMemo(() => new Set(favorites.map(courseKey)), [favorites])
  const candidateKeys = useMemo(() => new Set(candidates.map(courseKey)), [candidates])

  const sortedFilteredCourses = useMemo(() => {
    // Course source (114上/114下) is controlled by courseCatalogTerm and already
    // filtered by /api/courses. Do not filter again by the target timetable semester
    // here; otherwise selecting 114下 while the active timetable is 大一上 will
    // incorrectly hide every 1142CLASS course.
    const parsedQuery = parseSmartQuery(deferredQuery, departmentPool)
    const selectedDepartment = normalizeSearchText(searchFilters.department)
    const parsedDepartment = normalizeSearchText(parsedQuery.department)
    const activePlan = plan[activeSemester] || []
    const list = indexedCourses.filter((record) => {
      const c = record.c
      if (searchOnlyAvailable && findConflict(record.course, activePlan)) return false
      // 當搜尋框本身輸入 TGAXM/TGDXM/TGEXB 這類科系代碼時，搜尋意圖比舊的下拉篩選更明確。
      // 因此有 parsedQuery.department 時，暫時不讓下拉篩選互相卡住，避免選單停在 TGAXM 時搜 TGDXM 變成 0 筆。
      if (!parsedQuery.department && searchFilters.department && searchFilters.department !== '全部') {
        const deptMatched = record.departmentKeys.some((deptText) => deptText.includes(selectedDepartment) || selectedDepartment.includes(deptText))
        if (!deptMatched) return false
      }
      if (!requirementMatches(record.course, searchFilters.requirement)) return false
      if (searchFilters.grade && searchFilters.grade !== '全部' && String(c.grade || '') !== String(searchFilters.grade)) return false
      if (parsedQuery.department && !record.departmentKeys.some((item) => item.includes(parsedDepartment))) return false
      if (deferredQuery && !courseRecordMatchesParsed(record, parsedQuery)) return false
      return true
    })
    const tagFilter = searchFilters.tag || '全部'
    if (tagFilter !== '全部') {
      return list.sort((a, b) => {
        const scoreB = countCourseTagVotes(tagVotes, b.reviewKey, tagFilter)
        const scoreA = countCourseTagVotes(tagVotes, a.reviewKey, tagFilter)
        if (scoreB !== scoreA) return scoreB - scoreA
        return a.nameSort.localeCompare(b.nameSort, 'zh-Hant')
      }).slice(0, visibleCourseLimit(deferredQuery)).map((record) => record.course)
    }
    const queryText = String(deferredQuery || '').trim()
    if (queryText && (searchSort === 'smart' || searchSort === 'default')) {
      return list.sort((a, b) => {
        const diff = relevanceScoreRecord(b, parsedQuery) - relevanceScoreRecord(a, parsedQuery)
        if (diff) return diff
        const deptDiff = a.sortDepartment.localeCompare(b.sortDepartment, 'zh-Hant')
        if (deptDiff) return deptDiff
        return a.nameSort.localeCompare(b.nameSort, 'zh-Hant')
      }).slice(0, visibleCourseLimit(deferredQuery)).map((record) => record.course)
    }
    if (searchSort === 'credits' || searchSort === 'creditsDesc') return list.sort((a, b) => credits(b.course) - credits(a.course)).slice(0, visibleCourseLimit(deferredQuery)).map((record) => record.course)
    if (searchSort === 'name') return list.sort((a, b) => a.nameSort.localeCompare(b.nameSort, 'zh-Hant')).slice(0, visibleCourseLimit(deferredQuery)).map((record) => record.course)
    if (searchSort === 'favorite') return list.sort((a, b) => Number(favoriteKeys.has(b.courseKey)) - Number(favoriteKeys.has(a.courseKey))).slice(0, visibleCourseLimit(deferredQuery)).map((record) => record.course)
    if (searchSort === 'candidate') return list.sort((a, b) => Number(candidateKeys.has(b.courseKey)) - Number(candidateKeys.has(a.courseKey))).slice(0, visibleCourseLimit(deferredQuery)).map((record) => record.course)
    return list.sort((a, b) => {
      const ctxA = { isFavorite: favoriteKeys.has(a.courseKey), hasConflict: Boolean(findConflict(a.course, activePlan)) }
      const ctxB = { isFavorite: favoriteKeys.has(b.courseKey), hasConflict: Boolean(findConflict(b.course, activePlan)) }
      return courseSmartScore(b.course, ctxB) - courseSmartScore(a.course, ctxA)
    }).slice(0, visibleCourseLimit(deferredQuery)).map((record) => record.course)
  }, [indexedCourses, activeSemester, searchOnlyAvailable, searchSort, favoriteKeys, candidateKeys, plan, searchFilters.tag, searchFilters.department, searchFilters.requirement, searchFilters.grade, tagVotes, deferredQuery, departmentPool])

  const majorOptions = useMemo(() => Array.from(new Set([...(metadata.majors || []), ...courses.map((course) => getCourse(course).major).filter(Boolean)])).filter(Boolean).slice(0, 300), [metadata, courses])
  const departmentOptions = useMemo(() => {
    const isRealDepartment = (value) => {
      const text = normalizeDepartmentOption(value)
      if (!text) return false
      if (/^[A-ZＡ-Ｚ]班?$/.test(text)) return false
      if (/^[甲乙丙丁戊己庚辛壬癸]班?$/.test(text)) return false
      if (/^[ABCD]$/.test(text)) return false
      if (/^\d+$/.test(text)) return false
      if (/^(必|選|必修|選修|學分|年級|群別|班別)$/.test(text)) return false
      return true
    }
    const fromMetadata = [
      ...(metadata.departments || []),
      ...(metadata.departmentOptions || []),
      ...(metadata.units || []),
      ...(metadata.openingUnits || []),
      ...(metadata.majors || []),
    ]
    const fromCourses = courses.flatMap(extractDepartmentCandidates)
    const options = Array.from(new Set([...fromMetadata, ...fromCourses].map(normalizeDepartmentOption)))
      .filter(isRealDepartment)
      .sort((a, b) => String(a).localeCompare(String(b), 'zh-Hant'))
      .slice(0, 800)
    return ['全部', ...options]
  }, [metadata, courses])
  const gradeOptions = useMemo(() => Array.from(new Set([...(metadata.grades || []), ...courses.map((course) => getCourse(course).grade).filter(Boolean)])).filter(Boolean).slice(0, 120), [metadata, courses])

  return {
    courses,
    setCourses,
    query,
    setQuery,
    metadata,
    searchFilters,
    setSearchFilters,
    searchLoading,
    searchError,
    courseCatalogTerm,
    setCourseCatalogTerm,
    searchTab,
    setSearchTab,
    searchSort,
    setSearchSort,
    searchOnlyAvailable,
    setSearchOnlyAvailable,
    sortedFilteredCourses,
    majorOptions,
    departmentOptions,
    gradeOptions,
    courseTagOptions: COURSE_TAGS,
    runCourseSearch,
    COURSE_CATALOG_TERMS,
    courseCatalogTermValue,
  }
}
