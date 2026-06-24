import { useEffect, useMemo, useState } from 'react'
import { fetchCourses, fetchMetadata } from '../api'
import { COURSE_CATALOG_TERMS, catalogTermForSemester, courseCatalogTermValue, courseSmartScore,  extractCourseList, findConflict, getCourse, credits, courseKey, reviewKey, requiredTypeLabel } from '../utils/coursePlanning'
import { COURSE_TAGS, countCourseTagVotes } from '../data/courses/courseTags'


const CHEAP_NEAR_SOUND_CANONICAL = {
  郭: '國', 過: '國', 鍋: '國', 果: '國',
  繼: '際', 計: '際', 記: '際', 季: '際', 紀: '際', 技: '際', 濟: '際',
  裡: '理', 裏: '理', 里: '理', 禮: '理', 李: '理',
}

function normalizeSearchText(value = '') {
  return [...String(value || '')]
    .map((char) => CHEAP_NEAR_SOUND_CANONICAL[char] || char)
    .join('')
    .replace(/[（）()\s:：／/\-—_\.．。，,、;；]/g, '')
    .toLowerCase()
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

const KNOWN_DEPARTMENT_CODE_ALIASES = {
  TGAXM: ['文學院共同科碩', '文學院共同科－碩', '文學院共同科-碩', '文學院共同科', '文學院碩士共同科'],
  TGDXM: ['教育學院共同科碩', '教育學院共同－碩', '教育學院共同科-碩', '教育學院共同科', '教育學院碩士共同科'],
  TGEXM: ['工學院共同科碩', '工學院共同－碩', '工學院共同科-碩', '工學院共同科', '工學院碩士共同科'],
  TGKXM: ['創智學院共同科碩', '創智學院共同科-碩', '創智學院共同－碩', '創智學院共同科', 'AI學院共同科碩'],
  TGLXM: ['商管學院共同科碩', '商管學院共同－碩', '商管學院共同科-碩', '商管學院共同科', '商管學院碩士共同科'],
  TGSXM: ['理學院共同科碩', '理學院共同－碩', '理學院共同科-碩', '理學院共同科', '理學院碩士共同科'],
  TGAXB: ['文學院共同科日', '文學院共同科', '文學院共同科學士', '文學院共同科－日'],
  TGDXB: ['教育學院共同科日', '教育學院共同科', '教育學院共同科學士', '教育學院共同科－日'],
  TGEXB: ['工學院共同科日', '工學院共同科', '工學院共同科學士', '工學院共同科－日'],
  TGKXB: ['創智學院共同科日', '創智學院共同科', '創智學院共同科學士', 'AI學院共同科'],
  TGLXB: ['商管學院共同科日', '商管學院共同科', '商管學院共同科學士', '商管學院共同科－日'],
  TGRXB: ['國際學院共同科日', '國際學院共同科', '國際學院共同科學士', '國際學院共同科－日'],
  TGSXB: ['理學院共同科日', '理學院共同科', '理學院共同科學士', '理學院共同科－日'],
}

function addDepartmentCodeAliases(text, aliases) {
  const codePrefix = String(text || '').match(/^([A-Za-z]{2,6}[A-Za-z0-9]{0,4})[.．。\s_-]?/)?.[1]?.toUpperCase()
  if (codePrefix) {
    aliases.add(codePrefix)
    ;(KNOWN_DEPARTMENT_CODE_ALIASES[codePrefix] || []).forEach((item) => aliases.add(item))
  }
  Object.entries(KNOWN_DEPARTMENT_CODE_ALIASES).forEach(([code, names]) => {
    names.forEach((name) => {
      if (String(text || '').includes(name)) aliases.add(code)
    })
  })
}

function departmentAliases(value = '') {
  const text = String(value || '').trim()
  const aliases = new Set([text])
  aliases.add(text.replace(/系$/, ''))
  addDepartmentCodeAliases(text, aliases)
  if (/共同科/.test(text)) aliases.add(text.replace(/^([A-Za-z0-9]+)[.．。]?/, ''))
  if (/企管|企業管理/.test(text)) ['企管', '企業管理', '企管系', '企業管理系', '企業管理學系'].forEach((x) => aliases.add(x))
  if (/教科|教育科技|教育科系/.test(text)) ['教科', '教育科技', '教科系', '教育科技系', '教育科技學系', '教育科系學系'].forEach((x) => aliases.add(x))
  if (/觀光/.test(text)) ['觀光', '觀光系'].forEach((x) => aliases.add(x))
  if (/資管|資訊管理/.test(text)) ['資管', '資訊管理', '資管系', '資訊管理系', '資訊管理學系'].forEach((x) => aliases.add(x))
  if (/資工|資訊工程/.test(text)) ['資工', '資工系', '資訊工程', '資訊工程系', '資訊工程學系'].forEach((x) => aliases.add(x))
  if (/中文|中國文學/.test(text)) ['中文', '中文系', '中國文學', '中國文學學系'].forEach((x) => aliases.add(x))
  return [...aliases].map((x) => String(x || '').trim()).filter(Boolean)
}

function parseSmartQuery(rawQuery, departments = []) {
  let raw = String(rawQuery || '').trim()
  const compact = normalizeSearchText(raw)
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
    const leftover = normalizeSearchText(courseQuery)
    const deptText = normalizeSearchText(departmentHit.dept)
    if (leftover && deptText.includes(leftover)) courseQuery = ''
  }
  return { raw, compact, department: departmentHit?.dept || '', courseQuery: courseQuery || raw }
}

function courseMatchesQuery(course, query, departments = []) {
  const parsed = parseSmartQuery(query, departments)
  const q = normalizeSearchText(parsed.courseQuery)
  if (!q) return true
  const f = fieldText(course)
  const text = normalizeSearchText(`${f.name} ${f.baseName} ${f.code} ${f.teacher} ${f.unit}`)
  if (text.includes(q)) return true
  const pieces = q.split(/\s+/).filter(Boolean)
  return pieces.length > 1 && pieces.every((piece) => text.includes(piece))
}

function relevanceScore(course, query, departments = []) {
  const c = getCourse(course)
  const parsed = parseSmartQuery(query, departments)
  const q = normalizeSearchText(parsed.courseQuery)
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
  if (unit.includes(q)) score += 80
  if (parsed.department && !unit.includes(normalizeSearchText(parsed.department))) score -= 260
  score += Math.max(0, 80 - Math.abs(name.length - q.length) * 4)
  return score
}



function buildCourseSearchEntry(course) {
  const c = getCourse(course)
  const f = fieldText(c)
  const departments = extractDepartmentCandidates(c)
  const departmentAliasTexts = departments.flatMap((item) => [item, ...departmentAliases(item)])
  const searchText = normalizeSearchText(`${f.name} ${f.baseName} ${f.code} ${f.teacher} ${f.unit} ${departmentAliasTexts.join(' ')}`)
  return {
    course,
    data: c,
    nameRaw: String(f.name || ''),
    deptSort: sameDepartmentSortKey(c),
    searchText,
    departments,
    departmentText: normalizeSearchText(departmentAliasTexts.join(' ')),
    name: normalizeSearchText(f.name),
    baseName: normalizeSearchText(f.baseName),
    code: normalizeSearchText(f.code),
    teacher: normalizeSearchText(f.teacher),
    unit: normalizeSearchText(f.unit),
    requiredLabel: requiredTypeLabel(c),
    creditsValue: credits(c),
    reviewId: reviewKey(c),
    key: courseKey(c),
  }
}

function entryMatchesQuery(entry, parsedQuery) {
  const q = normalizeSearchText(parsedQuery.courseQuery)
  if (!q) return true
  if (entry.searchText.includes(q)) return true
  const pieces = q.split(/\s+/).filter(Boolean)
  return pieces.length > 1 && pieces.every((piece) => entry.searchText.includes(piece))
}

function entryRelevanceScore(entry, parsedQuery) {
  const q = normalizeSearchText(parsedQuery.courseQuery)
  if (!q && !parsedQuery.department) return 0
  let score = 0
  const deptQuery = normalizeSearchText(parsedQuery.department)
  if (deptQuery && entry.departmentText.includes(deptQuery)) score += 900
  if (entry.baseName === q) score += 1000
  if (entry.name === q) score += 900
  if (entry.baseName.startsWith(q)) score += 650
  if (entry.name.startsWith(q)) score += 600
  if (entry.name.includes(q)) score += 420
  if (entry.code === q) score += 500
  if (entry.code.includes(q)) score += 180
  if (entry.teacher.includes(q)) score += 130
  if (entry.unit.includes(q)) score += 80
  if (deptQuery && !entry.departmentText.includes(deptQuery)) score -= 260
  score += Math.max(0, 80 - Math.abs(entry.name.length - q.length) * 4)
  return score
}

function requirementMatchesEntry(entry, requirement) {
  if (!requirement || requirement === '全部') return true
  const label = entry.requiredLabel
  if (requirement === '必修') return /必/.test(label) && !/選/.test(label)
  if (requirement === '選修') return /選/.test(label)
  return true
}

function sameDepartmentSortKey(course) {
  const c = getCourse(course)
  return String(c.department || c.major || c.unit || c.category || '')
}

const COURSE_RESULT_RENDER_LIMIT = 420

function visibleCourseLimit(query) {
  return String(query || '').trim() ? 650 : COURSE_RESULT_RENDER_LIMIT
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

  const indexedCourses = useMemo(() => (courses || []).map(buildCourseSearchEntry), [courses])

  const favoriteKeySetForSort = useMemo(() => new Set((favorites || []).map(courseKey)), [favorites])
  const candidateKeySetForSort = useMemo(() => new Set((candidates || []).map(courseKey)), [candidates])
  const activePlanCourses = plan?.[activeSemester] || []

  const sortedFilteredCourses = useMemo(() => {
    // Course source (114上/114下) is controlled by courseCatalogTerm and already
    // filtered by /api/courses. Do not filter again by the target timetable semester
    // here; otherwise selecting 114下 while the active timetable is 大一上 will
    // incorrectly hide every 1142CLASS course.
    const parsedQuery = parseSmartQuery(query, departmentPool)
    const queryText = String(query || '').trim()
    const deptTargets = searchFilters.department && searchFilters.department !== '全部'
      ? departmentAliases(searchFilters.department).map(normalizeSearchText).filter(Boolean)
      : []
    const parsedDeptTargets = parsedQuery.department
      ? departmentAliases(parsedQuery.department).map(normalizeSearchText).filter(Boolean)
      : []
    const departmentTargetMatches = (entry, targets) => {
      if (!targets.length) return true
      return targets.some((target) => entry.departmentText.includes(target) || target.includes(entry.unit) || target === entry.unit)
    }
    const tagFilter = searchFilters.tag || '全部'

    const entries = indexedCourses.filter((entry) => {
      const c = entry.data
      if (searchOnlyAvailable && findConflict(entry.course, activePlanCourses)) return false
      if (!departmentTargetMatches(entry, deptTargets)) return false
      if (!requirementMatchesEntry(entry, searchFilters.requirement)) return false
      if (searchFilters.grade && searchFilters.grade !== '全部' && String(c.grade || '') !== String(searchFilters.grade)) return false
      if (!departmentTargetMatches(entry, parsedDeptTargets)) return false
      if (queryText && !entryMatchesQuery(entry, parsedQuery)) return false
      return true
    })

    const limit = visibleCourseLimit(query)
    if (tagFilter !== '全部') {
      return entries
        .map((entry) => ({ entry, score: countCourseTagVotes(tagVotes, entry.reviewId, tagFilter) }))
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score
          return a.entry.nameRaw.localeCompare(b.entry.nameRaw, 'zh-Hant')
        })
        .slice(0, limit)
        .map(({ entry }) => entry.course)
    }

    if (queryText && (searchSort === 'smart' || searchSort === 'default')) {
      return entries
        .map((entry) => ({ entry, score: entryRelevanceScore(entry, parsedQuery) }))
        .sort((a, b) => {
          const diff = b.score - a.score
          if (diff) return diff
          const deptDiff = a.entry.deptSort.localeCompare(b.entry.deptSort, 'zh-Hant')
          if (deptDiff) return deptDiff
          return a.entry.nameRaw.localeCompare(b.entry.nameRaw, 'zh-Hant')
        })
        .slice(0, limit)
        .map(({ entry }) => entry.course)
    }

    if (searchSort === 'credits' || searchSort === 'creditsDesc') return entries.sort((a, b) => b.creditsValue - a.creditsValue).slice(0, limit).map((entry) => entry.course)
    if (searchSort === 'name') return entries.sort((a, b) => a.nameRaw.localeCompare(b.nameRaw, 'zh-Hant')).slice(0, limit).map((entry) => entry.course)
    if (searchSort === 'favorite') return entries.sort((a, b) => Number(favoriteKeySetForSort.has(b.key)) - Number(favoriteKeySetForSort.has(a.key))).slice(0, limit).map((entry) => entry.course)
    if (searchSort === 'candidate') return entries.sort((a, b) => Number(candidateKeySetForSort.has(b.key)) - Number(candidateKeySetForSort.has(a.key))).slice(0, limit).map((entry) => entry.course)
    return entries.sort((a, b) => {
      const ctxA = { isFavorite: favoriteKeySetForSort.has(a.key), hasConflict: false }
      const ctxB = { isFavorite: favoriteKeySetForSort.has(b.key), hasConflict: false }
      return courseSmartScore(b.course, ctxB) - courseSmartScore(a.course, ctxA)
    }).slice(0, limit).map((entry) => entry.course)
  }, [indexedCourses, activeSemester, searchOnlyAvailable, searchSort, favoriteKeySetForSort, candidateKeySetForSort, activePlanCourses, searchFilters.tag, searchFilters.department, searchFilters.requirement, searchFilters.grade, tagVotes, query, departmentPool])

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
    const fromCourses = courses.flatMap(extractDepartmentCandidates)
    const fromMetadata = courses.length ? [] : [
      ...(metadata.departments || []),
      ...(metadata.departmentOptions || []),
      ...(metadata.units || []),
      ...(metadata.openingUnits || []),
      ...(metadata.majors || []),
    ]
    const options = Array.from(new Set([...fromCourses, ...fromMetadata].map(normalizeDepartmentOption)))
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
