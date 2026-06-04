import { useEffect, useState } from 'react'
import { addReview, fetchReviews } from '../api'
import { getCourse, reviewKey, userKey } from '../utils/coursePlanning'
import { courseTagVoteKey } from '../data/courses/courseTags'

export function useCourseSelection({ user, localReviews, setLocalReviews, setTagVotes }) {
  const [coursePopover, setCoursePopover] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [infoOpen, setInfoOpen] = useState(false)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    if (!selectedCourse) return
    fetchReviews(selectedCourse.code || selectedCourse.serial || selectedCourse.name)
      .then((data) => {
        const remote = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : (data?.items || []))
        const local = localReviews[reviewKey(selectedCourse)] || []
        setReviews([...local, ...remote])
      })
      .catch(() => setReviews(localReviews[reviewKey(selectedCourse)] || []))
  }, [selectedCourse, localReviews])

  function openCourseInfo(course) {
    setSelectedCourse(getCourse(course))
    setInfoOpen(true)
  }

  function openCoursePopover(course, semester, event) {
    setSelectedCourse(getCourse(course))
    setCoursePopover({ course, semester, x: event.clientX + 12, y: event.clientY + 12 })
  }

  function toggleTeacherTag(courseOrTeacher, tag) {
    const voter = userKey(user)
    const course = typeof courseOrTeacher === 'object' ? getCourse(courseOrTeacher) : selectedCourse
    const key = courseTagVoteKey(reviewKey(course || {}), tag, voter)
    setTagVotes((prev) => {
      const next = { ...prev }
      if (next[key]) delete next[key]
      else next[key] = true
      return next
    })
  }

  async function handleAddReview(payload) {
    const key = payload.courseKey
    const item = { ...payload, id: `${Date.now()}-${Math.random().toString(16).slice(2)}` }
    setLocalReviews((prev) => ({ ...prev, [key]: [item, ...(prev[key] || [])] }))
    try { await addReview(payload) } catch { /* 本機先保存，後端可用時再擴充同步 */ }
  }

  function updateLocalReview(reviewId, patch) {
    const key = selectedCourse ? reviewKey(selectedCourse) : ''
    if (!key) return
    setLocalReviews((prev) => ({ ...prev, [key]: (prev[key] || []).map((item) => (item.id || '') === reviewId ? { ...item, ...patch } : item) }))
  }

  function deleteLocalReview(reviewId) {
    const key = selectedCourse ? reviewKey(selectedCourse) : ''
    if (!key) return
    setLocalReviews((prev) => ({ ...prev, [key]: (prev[key] || []).filter((item) => (item.id || '') !== reviewId) }))
  }

  return {
    coursePopover,
    setCoursePopover,
    selectedCourse,
    setSelectedCourse,
    infoOpen,
    setInfoOpen,
    reviews,
    openCourseInfo,
    openCoursePopover,
    toggleTeacherTag,
    handleAddReview,
    updateLocalReview,
    deleteLocalReview,
  }
}
