import { useEffect, useMemo, useState } from 'react'
import { fetchCourses, fetchMetadata } from '../api'
import { COURSE_CATALOG_TERMS, catalogTermForSemester, courseCatalogTermValue, courseSmartScore,  extractCourseList, findConflict, getCourse, credits, courseKey, reviewKey, requiredTypeLabel } from '../utils/coursePlanning'
import { COURSE_TAGS, countCourseTagVotes } from '../data/courses/courseTags'


function normalizeSearchText(value = '') {
  return String(value || '').replace(/[（）()\s:：／/\-—_]/g, '').toLowerCase()
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
  const text = String(value || '')
  const aliases = new Set([text])
  aliases.add(text.replace(/系$/, ''))
  if (/企管|企業管理/.test(text)) ['企管', '企業管理', '企管系', '企業管理系'].forEach((x) => aliases.add(x))
  if (/教科|教育科技/.test(text)) ['教科', '教育科技', '教科系', '教育科技系'].forEach((x) => aliases.add(x))
  if (/觀光/.test(text)) ['觀光', '觀光系'].forEach((x) => aliases.add(x))
  if (/資管|資訊管理/.test(text)) ['資管', '資訊管理', '資管系', '資訊管理系'].forEach((x) => aliases.add(x))
  if (/中文|中國文學/.test(text)) ['中文', '中文系', '中國文學'].forEach((x) => aliases.add(x))
  return [...aliases].filter(Boolean)
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

function sameDepartmentSortKey(course) {
  const c = getCourse(course)
  return String(c.department || c.major || c.unit || c.category || '')
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
    const params = {
      keyword: String(nextQuery || '').trim(),
      semester: nextCatalogTerm || '全部',
      department: nextFilters.department !== '全部' ? nextFilters.department : '全部',
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

  const sortedFilteredCourses = useMemo(() => {
    // Course source (114上/114下) is controlled by courseCatalogTerm and already
    // filtered by /api/courses. Do not filter again by the target timetable semester
    // here; otherwise selecting 114下 while the active timetable is 大一上 will
    // incorrectly hide every 1142CLASS course.
    const departmentPool = Array.from(new Set([...(metadata.departments || []), ...(metadata.units || []), ...(metadata.majors || []), ...(courses || []).flatMap(extractDepartmentCandidates)]))
    const parsedQuery = parseSmartQuery(query, departmentPool)
    const list = (courses || []).filter((course) => {
      const c = getCourse(course)
      if (searchOnlyAvailable && findConflict(course, plan[activeSemester] || [])) return false
      if (searchFilters.department && searchFilters.department !== '全部' && !extractDepartmentCandidates(course).some((item) => String(item).includes(searchFilters.department))) return false
      if (!requirementMatches(course, searchFilters.requirement)) return false
      if (searchFilters.grade && searchFilters.grade !== '全部' && String(c.grade || '') !== String(searchFilters.grade)) return false
      if (parsedQuery.department && !extractDepartmentCandidates(course).some((item) => normalizeSearchText(item).includes(normalizeSearchText(parsedQuery.department)))) return false
      if (query && !courseMatchesQuery(course, query, departmentPool)) return false
      return true
    })
    const tagFilter = searchFilters.tag || '全部'
    if (tagFilter !== '全部') {
      return list.sort((a, b) => {
        const scoreB = countCourseTagVotes(tagVotes, reviewKey(getCourse(b)), tagFilter)
        const scoreA = countCourseTagVotes(tagVotes, reviewKey(getCourse(a)), tagFilter)
        if (scoreB !== scoreA) return scoreB - scoreA
        return String(getCourse(a).name || '').localeCompare(String(getCourse(b).name || ''), 'zh-Hant')
      })
    }
    const queryText = String(query || '').trim()
    if (queryText && (searchSort === 'smart' || searchSort === 'default')) {
      return list.sort((a, b) => {
        const diff = relevanceScore(b, queryText, departmentPool) - relevanceScore(a, queryText, departmentPool)
        if (diff) return diff
        const deptDiff = sameDepartmentSortKey(a).localeCompare(sameDepartmentSortKey(b), 'zh-Hant')
        if (deptDiff) return deptDiff
        return String(getCourse(a).name || '').localeCompare(String(getCourse(b).name || ''), 'zh-Hant')
      })
    }
    if (searchSort === 'credits' || searchSort === 'creditsDesc') return list.sort((a, b) => credits(b) - credits(a))
    if (searchSort === 'name') return list.sort((a, b) => String(getCourse(a).name || '').localeCompare(String(getCourse(b).name || ''), 'zh-Hant'))
    if (searchSort === 'favorite') return list.sort((a, b) => Number(favorites.some((f) => courseKey(f) === courseKey(b))) - Number(favorites.some((f) => courseKey(f) === courseKey(a))))
    if (searchSort === 'candidate') return list.sort((a, b) => Number(candidates.some((c) => courseKey(c) === courseKey(b))) - Number(candidates.some((c) => courseKey(c) === courseKey(a))))
    return list.sort((a, b) => {
      const ctxA = { isFavorite: favorites.some((f) => courseKey(f) === courseKey(a)), hasConflict: Boolean(findConflict(a, plan[activeSemester] || [])) }
      const ctxB = { isFavorite: favorites.some((f) => courseKey(f) === courseKey(b)), hasConflict: Boolean(findConflict(b, plan[activeSemester] || [])) }
      return courseSmartScore(b, ctxB) - courseSmartScore(a, ctxA)
    })
  }, [courses, activeSemester, searchOnlyAvailable, searchSort, favorites, candidates, plan, searchFilters.tag, searchFilters.department, searchFilters.requirement, searchFilters.grade, tagVotes, query, metadata])

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
    return Array.from(new Set([...fromMetadata, ...fromCourses].map(normalizeDepartmentOption)))
      .filter(isRealDepartment)
      .sort((a, b) => String(a).localeCompare(String(b), 'zh-Hant'))
      .slice(0, 800)
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
