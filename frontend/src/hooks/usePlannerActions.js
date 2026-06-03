import { useState } from 'react'
import {
  DAYS,
  STATUS,
  courseKey,
  courseMatchesSemester,
  courseStatus, isInactiveCourse,
  courseTermLabel,
  credits,
  findConflict,
  getCourse,
  isCourseAlreadyPlanned,
  setCourseStatus,
  uid,
} from '../utils/coursePlanning'

export function usePlannerActions({
  plan,
  setPlan,
  candidates,
  setCandidates,
  activeSemester,
  setActiveSemester,
  setSemesterAnimKey,
  searchFilters,
  setSearchFilters,
  setSearchOnlyAvailable,
  setSearchTab,
  setActiveMenu,
  runCourseSearch,
  notify,
  putCandidate,
  addCandidate,
  removeCandidate,
  setSelectedCourse,
  setCoursePopover,
}) {
  const [history, setHistory] = useState([])
  const [future, setFuture] = useState([])

  function commit(nextPlan, message) {
    setHistory((h) => [...h.slice(-30), { at: new Date().toLocaleTimeString(), message, plan }])
    setFuture([])
    setPlan(nextPlan)
  }

  function switchSemester(semester) {
    if (semester === activeSemester) return
    setActiveSemester(semester)
    setSemesterAnimKey((v) => v + 1)
    setCoursePopover(null)
  }

  function searchEmptySlot(semester, dayNumber, period) {
    const weekday = DAYS[dayNumber - 1] || '全部'
    const nextFilters = { ...searchFilters, weekday, period: String(period) }
    setActiveSemester(semester)
    setSearchFilters(nextFilters)
    setSearchOnlyAvailable(true)
    setSearchTab('results')
    setActiveMenu('search')
    notify(`已檢索 ${semester} 週${weekday} 第 ${period} 節可排課程`)
    runCourseSearch({ searchFilters: nextFilters })
  }

  function movePlannedCourse(fromSemester, courseId, toSemester) {
    if (fromSemester === toSemester) return
    const moving = (plan[fromSemester] || []).find((course) => uid(course) === courseId)
    if (!moving) return
    if (!courseMatchesSemester(moving, toSemester)) {
      alert(`學期不符：這門課屬於 ${courseTermLabel(moving)}，不能移到 ${toSemester}。`)
      return
    }
    const next = { ...plan }
    next[fromSemester] = (next[fromSemester] || []).filter((course) => uid(course) !== courseId)
    next[toSemester] = [...(next[toSemester] || []), moving]
    commit(next, `移動 ${getCourse(moving).name}：${fromSemester} → ${toSemester}`)
    setCoursePopover(null)
    switchSemester(toSemester)
  }

  function addCourseToSemester(course, semester, status = courseStatus(course), options = {}) {
    if (!courseMatchesSemester(course, semester)) {
      alert(`學期不符：這門課屬於 ${courseTermLabel(course)}，不能放入 ${semester}。`)
      return false
    }
    if (isCourseAlreadyPlanned(plan, course)) {
      alert('這門課已經在課表中，不能重複排入。')
      return false
    }
    const item = setCourseStatus(course, status)
    const next = { ...plan, [semester]: [...(plan[semester] || []), { ...item, instanceId: `${courseKey(item)}-${Date.now()}` }] }
    commit(next, `加入 ${getCourse(course).name} 到 ${semester}`)
    if (options.removeCandidate) removeCandidate(course)
    return true
  }

  function handleDropCourse(e, semester) {
    e.preventDefault()
    let data
    try { data = JSON.parse(e.dataTransfer.getData('application/json')) } catch { return }
    if (!data?.course) return
    if (data.source === 'planned') {
      if (!courseMatchesSemester(data.course, semester)) {
        alert(`學期不符：這門課屬於 ${courseTermLabel(data.course)}，不能放入 ${semester}。`)
        return
      }
      const next = { ...plan }
      next[data.semester] = (next[data.semester] || []).filter((c) => uid(c) !== uid(data.course))
      next[semester] = [...(next[semester] || []), data.course]
      commit(next, `移動 ${getCourse(data.course).name}：${data.semester} → ${semester}`)
    } else {
      addCourseToSemester(data.course, semester, courseStatus(data.course), { removeCandidate: data.source === 'candidate' && !e.shiftKey })
    }
  }

  function dropToCandidates(e) {
    e.preventDefault()
    e.stopPropagation()
    let data
    try { data = JSON.parse(e.dataTransfer.getData('application/json')) } catch { return }
    if (!data?.course) return
    if (data.source === 'planned') {
      const next = { ...plan, [data.semester]: (plan[data.semester] || []).filter((c) => uid(c) !== uid(data.course)) }
      const movedToCandidate = putCandidate(data.course, { allowPlanned: true, silent: true })
      commit(next, `移回暫存區：${getCourse(data.course).name}`)
      notify(movedToCandidate ? `已移回暫存區：${getCourse(data.course).name}` : '已從課表移除，暫存區已有同一門課')
      return
    }
    if (data.source === 'course') addCandidate(data.course)
  }

  function dropDelete(e) {
    e.preventDefault()
    let data
    try { data = JSON.parse(e.dataTransfer.getData('application/json')) } catch { return }
    if (!data?.course) return
    if (data.source === 'planned') {
      const next = { ...plan, [data.semester]: (plan[data.semester] || []).filter((c) => uid(c) !== uid(data.course)) }
      commit(next, `刪除 ${getCourse(data.course).name}`)
      return
    }
    if (['candidate', 'course'].includes(data.source)) {
      removeCandidate(data.course)
    }
  }

  function setPlannedCourseStatus(semester, courseId, status) {
    const target = (plan[semester] || []).find((course) => uid(course) === courseId)
    const next = { ...plan, [semester]: (plan[semester] || []).map((course) => uid(course) === courseId ? { ...course, planningStatus: status } : course) }
    if (target) {
      const updated = { ...target, planningStatus: status }
      setSelectedCourse(getCourse(updated))
      setCoursePopover((prev) => prev?.course && uid(prev.course) === courseId ? { ...prev, course: updated } : prev)
    }
    commit(next, `將 ${semester} 課程狀態改為 ${STATUS[status]?.label || status}`)
  }

  function autoPlace(semester) {
    let placed = 0
    const placedKeys = new Set()
    const next = { ...plan, [semester]: [...(plan[semester] || [])] }
    candidates.forEach((course) => {
      const currentCredits = next[semester].reduce((s, c) => s + (!isInactiveCourse(c) ? credits(c) : 0), 0)
      if (courseMatchesSemester(course, semester) && !isCourseAlreadyPlanned(next, course) && !findConflict(course, next[semester]) && currentCredits + credits(course) <= 25) {
        const item = setCourseStatus(course, 'planned')
        next[semester].push({ ...item, instanceId: `${courseKey(item)}-${Date.now()}-${placed}` })
        placedKeys.add(courseKey(course))
        placed += 1
      }
    })
    if (placed) setCandidates((prev) => prev.filter((course) => !placedKeys.has(courseKey(course))))
    commit(next, `一鍵排入 ${semester}：${placed} 門`)
  }

  function movePlannedToCandidate(semester, courseId) {
    const target = (plan[semester] || []).find((course) => uid(course) === courseId)
    if (!target) return
    const next = { ...plan, [semester]: (plan[semester] || []).filter((course) => uid(course) !== courseId) }
    const movedToCandidate = putCandidate(target, { allowPlanned: true, silent: true })
    commit(next, `移回暫存區：${getCourse(target).name}`)
    notify(movedToCandidate ? `已移回暫存區：${getCourse(target).name}` : '已從課表移除，暫存區已有同一門課')
  }

  function deletePlannedCourse(semester, courseId) {
    const target = (plan[semester] || []).find((course) => uid(course) === courseId)
    const next = { ...plan, [semester]: (plan[semester] || []).filter((course) => uid(course) !== courseId) }
    commit(next, `刪除 ${target ? getCourse(target).name : '課程'}`)
  }

  function undo() {
    const last = history.at(-1)
    if (!last) return
    setFuture((f) => [{ at: new Date().toLocaleTimeString(), message: '重做點', plan }, ...f])
    setPlan(last.plan)
    setHistory((h) => h.slice(0, -1))
  }

  function redo() {
    const next = future[0]
    if (!next) return
    setHistory((h) => [...h, { at: new Date().toLocaleTimeString(), message: '復原前', plan }])
    setPlan(next.plan)
    setFuture((f) => f.slice(1))
  }

  return {
    history,
    future,
    commit,
    switchSemester,
    searchEmptySlot,
    movePlannedCourse,
    addCourseToSemester,
    handleDropCourse,
    dropToCandidates,
    dropDelete,
    setPlannedCourseStatus,
    autoPlace,
    movePlannedToCandidate,
    deletePlannedCourse,
    undo,
    redo,
  }
}
