import { useEffect, useMemo, useState } from 'react'
import { fetchCourses, fetchMetadata } from '../api'
import { COURSE_CATALOG_TERMS, catalogTermForSemester, courseCatalogTermValue, courseSmartScore, extractCourseList, findConflict, getCourse, credits, courseKey, reviewKey } from '../utils/coursePlanning'
import { COURSE_TAGS, countCourseTagVotes } from '../data/courses/courseTags'


function normalizeSearchText(value = '') {
  return String(value || '').replace(/[（）()\s:：／/\-—_]/g, '').toLowerCase()
}

function stripClassSuffix(value = '') {
  return String(value || '')
    .replace(/\s*[（(][^）)]*班[）)]\s*$/i, '')
    .trim()
}

function relevanceScore(course, query) {
  const c = getCourse(course)
  const q = normalizeSearchText(query)
  if (!q) return 0
  const name = normalizeSearchText(c.name || c.course_name || '')
  const baseName = normalizeSearchText(stripClassSuffix(c.name || c.course_name || ''))
  const code = normalizeSearchText(c.serial || c.code || c.course_id || '')
  const teacher = normalizeSearchText(c.teacher || c.instructor || '')
  const unit = normalizeSearchText(c.department || c.major || c.unit || c.category || '')
  let score = 0
  if (baseName === q) score += 1000
  if (name === q) score += 900
  if (baseName.startsWith(q)) score += 650
  if (name.startsWith(q)) score += 600
  if (name.includes(q)) score += 420
  if (code === q) score += 500
  if (code.includes(q)) score += 180
  if (teacher.includes(q)) score += 90
  if (unit.includes(q)) score += 50
  score += Math.max(0, 80 - Math.abs(name.length - q.length) * 4)
  return score
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
    const list = (courses || []).filter((course) => {
      // 課程來源篩選已經由 runCourseSearch 的 courseCatalogTerm 處理。
      // 這裡不要再用目前課表學期 activeSemester 二次過濾，否則選 114 下學期但目前課表停在大一上時會被清成 0 筆。
      if (searchOnlyAvailable && findConflict(course, plan[activeSemester] || [])) return false
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
        const diff = relevanceScore(b, queryText) - relevanceScore(a, queryText)
        if (diff) return diff
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
  }, [courses, activeSemester, searchOnlyAvailable, searchSort, favorites, candidates, plan, searchFilters.tag, tagVotes, query])

  const majorOptions = useMemo(() => Array.from(new Set([...(metadata.majors || []), ...courses.map((course) => getCourse(course).major).filter(Boolean)])).filter(Boolean).slice(0, 300), [metadata, courses])
  const departmentOptions = useMemo(() => {
    const isRealDepartment = (value) => {
      const text = String(value || '').trim()
      if (!text) return false
      if (/^[A-ZＡ-Ｚ]班?$/.test(text)) return false
      if (/^[甲乙丙丁戊己庚辛壬癸]班?$/.test(text)) return false
      if (/^[ABCD]$/.test(text)) return false
      return true
    }
    return Array.from(new Set([...(metadata.departments || []), ...courses.map((course) => getCourse(course).department).filter(Boolean)]))
      .filter(isRealDepartment)
      .sort((a, b) => String(a).localeCompare(String(b), 'zh-Hant'))
      .slice(0, 300)
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
