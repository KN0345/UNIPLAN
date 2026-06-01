import { useMemo, useState } from 'react'
import { courseKey, credits, getCourse, isCourseAlreadyPlanned } from '../utils/coursePlanning'

export function useCandidateActions({ plan, candidates, setCandidates, favorites, setFavorites, notify }) {
  const [candidateSearch, setCandidateSearch] = useState('')
  const [candidateSort, setCandidateSort] = useState('added')

  function putCandidate(course, { allowPlanned = false, silent = false } = {}) {
    const item = getCourse(course)
    if (!allowPlanned && isCourseAlreadyPlanned(plan, item)) {
      if (!silent) notify('這門課已在課表中，不再加入暫存區')
      return false
    }
    const exists = candidates.some((c) => courseKey(c) === courseKey(item))
    if (exists) {
      if (!silent) notify('已在暫存區')
      return false
    }
    setCandidates((prev) => [...prev, { ...item, candidateGroup: item.candidateGroup || '未分類' }])
    if (!silent) notify(`已加入暫存區：${item.name || '未命名課程'}`)
    return true
  }

  function addCandidate(course) {
    return putCandidate(course)
  }

  function removeCandidate(course) {
    const item = getCourse(course)
    setCandidates((prev) => prev.filter((c) => courseKey(c) !== courseKey(item)))
    notify(`已從暫存區移除：${item.name || '未命名課程'}`)
  }

  function toggleFavorite(course) {
    const item = getCourse(course)
    const exists = favorites.some((c) => courseKey(c) === courseKey(item))
    if (exists) {
      setFavorites((prev) => prev.filter((c) => courseKey(c) !== courseKey(item)))
      notify(`已取消收藏：${item.name || '未命名課程'}`)
      return false
    }
    setFavorites((prev) => [...prev, item])
    notify(`已收藏：${item.name || '未命名課程'}`)
    return true
  }

  function changeCandidateGroup(course, group) {
    const key = courseKey(course)
    setCandidates((prev) => prev.map((item) => courseKey(item) === key ? { ...item, candidateGroup: group } : item))
  }

  const filteredCandidates = useMemo(() => {
    const keyword = candidateSearch.trim().toLowerCase()
    const filtered = candidates.filter((candidate) => {
      const course = getCourse(candidate)
      const text = `${course.name || ''} ${course.teacher || ''} ${course.time_info || ''} ${course.department || ''}`.toLowerCase()
      return !keyword || text.includes(keyword)
    })
    const sorted = [...filtered]
    if (candidateSort === 'name') sorted.sort((a, b) => String(getCourse(a).name || '').localeCompare(String(getCourse(b).name || ''), 'zh-Hant'))
    if (candidateSort === 'credits') sorted.sort((a, b) => credits(b) - credits(a))
    if (candidateSort === 'time') sorted.sort((a, b) => String(getCourse(a).time_info || getCourse(a).time || '').localeCompare(String(getCourse(b).time_info || getCourse(b).time || ''), 'zh-Hant'))
    return sorted
  }, [candidates, candidateSearch, candidateSort])

  return {
    candidateSearch,
    setCandidateSearch,
    candidateSort,
    setCandidateSort,
    filteredCandidates,
    putCandidate,
    addCandidate,
    removeCandidate,
    toggleFavorite,
    changeCandidateGroup,
  }
}
