import { useState } from 'react'
import { createPortal } from 'react-dom'
import { DAYS, PERIODS, STATUS, credits, getCourse, semesterCreditStatus, semesterWarnings, slotsOf, uid, courseStatus, hasAnyConflict, scheduleRuleLabel, mergeableHalfSemesterGroup } from '../../utils/coursePlanning'

function SemesterGrid({ semester, courses, plan, onDropCourse, onMoveCourse, onCourseClick, onEmptySlotClick, onDeleteCourse, onMoveToCandidate }) {
  const warnings = semesterWarnings(semester, courses, plan)
  const [conflictViewer, setConflictViewer] = useState(null)

  function handleCourseClick(course, event) {
    event.stopPropagation()
    onCourseClick(course, semester, event)
  }

  function openCourseFromConflict(course, event) {
    event.stopPropagation()
    setConflictViewer(null)
    onCourseClick(course, semester, event)
  }

  function slotsForDay(course, dayIndex) {
    return slotsOf(course).filter((slot) => slot.day === dayIndex + 1)
  }

  function activeCoursesAt(dayIndex, period) {
    // Failed courses remain visible on the historical schedule, but they are excluded
    // from credit/progress calculations elsewhere. This prevents the record from
    // disappearing while still allowing the student to retake it later.
    return courses.filter((course) => slotsForDay(course, dayIndex).some((slot) => period >= slot.start && period <= slot.end))
  }

  function startingCoursesAt(dayIndex, period) {
    return courses.filter((course) => slotsForDay(course, dayIndex).some((slot) => slot.start === period))
  }

  function spanForCourse(course, dayIndex, period) {
    const slot = slotsForDay(course, dayIndex).find((entry) => entry.start === period)
    if (!slot) return 1
    return Math.max(1, Math.min(10 - period + 1, slot.end - slot.start + 1))
  }

  function courseMeta(course) {
    const c = getCourse(course)
    const room = c.classroom || c.room || c.location || ''
    const label = scheduleRuleLabel(course)
    return [label, room || '未列教室'].filter(Boolean).join('｜')
  }


  function startsAt(course, dayIndex, period) {
    return slotsForDay(course, dayIndex).some((slot) => slot.start === period)
  }

  function canMergeInCurrentCell(a, b, dayIndex, period) {
    // Prefer the global utility when the full slot signature matches.
    if (mergeableHalfSemesterGroup(a, b)) return true
    // Fallback for 淡江 half-semester courses that share the same visible cell
    // but have slightly different raw slot metadata or extra secondary slots.
    if (!startsAt(a, dayIndex, period) || !startsAt(b, dayIndex, period)) return false
    const aLabel = scheduleRuleLabel(a)
    const bLabel = scheduleRuleLabel(b)
    if (!/\d+\s*[-－～~]\s*\d+\s*週/.test(aLabel) || !/\d+\s*[-－～~]\s*\d+\s*週/.test(bLabel)) return false
    return !hasAnyConflict([a, b])
  }

  function buildStartingGroups(entries, dayIndex, period) {
    const groups = []
    const used = new Set()
    entries.forEach((course, index) => {
      if (used.has(index)) return
      const group = [course]
      entries.forEach((other, otherIndex) => {
        if (otherIndex <= index || used.has(otherIndex)) return
        if (group.length < 2 && canMergeInCurrentCell(group[0], other, dayIndex, period)) {
          group.push(other)
          used.add(otherIndex)
        }
      })
      used.add(index)
      // Put 1-9週 on the left and 10-18週 on the right when possible.
      group.sort((a, b) => String(scheduleRuleLabel(a)).localeCompare(String(scheduleRuleLabel(b)), 'zh-Hant'))
      groups.push(group)
    })
    return groups
  }

  function mergedHalfTile(group, di, p, stackIndex = 0, stackCount = 1) {
    const span = Math.max(...group.map((entry) => spanForCourse(entry, di, p)))
    return (
      <div
        key={`merged-${group.map(uid).join('-')}-${di}-${p}`}
        className={`halfSemesterSplitTile ${stackCount > 1 ? 'stackedTile' : ''}`}
        style={{
          '--tile-span': span,
          '--stack-index': stackIndex,
          '--stack-count': stackCount,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gridAutoRows: '1fr',
          alignItems: 'stretch',
        }}
        title="同一課程不同週次，左右分欄顯示"
      >
        {group.slice(0, 2).map((course) => {
          const c = getCourse(course)
          return (
            <button
              key={uid(course)}
              type="button"
              className="halfSemesterSegment"
              style={{ minWidth: 0, height: '100%' }}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('application/json', JSON.stringify({ source: 'planned', semester, course }))}
              onClick={(e) => handleCourseClick(course, e)}
              title="點擊操作此週次課程"
            >
              <b className={`courseTypeDot ${STATUS[courseStatus(course)]?.tone || 'blue'}`} />
              <span className="tileTitle">{c.name}</span>
              <span className="tileMeta">{[scheduleRuleLabel(course), c.classroom || c.room || c.location || '未列教室'].filter(Boolean).join('｜')}</span>
            </button>
          )
        })}
      </div>
    )
  }

  function tileButton(course, di, p, stackIndex = 0, stackCount = 1) {
    return (
      <button
        key={uid(course)}
        className={`timetableCourseTile ${stackCount > 1 ? 'stackedTile' : ''}`}
        style={{
          '--tile-span': spanForCourse(course, di, p),
          '--stack-index': stackIndex,
          '--stack-count': stackCount,
        }}
        draggable
        onDragStart={(e) => e.dataTransfer.setData('application/json', JSON.stringify({ source: 'planned', semester, course }))}
        onClick={(e) => handleCourseClick(course, e)}
        title="點擊開啟快速操作"
      >
        <b className={`courseTypeDot ${STATUS[courseStatus(course)]?.tone || 'blue'}`} />
        <span className="tileTitle">{getCourse(course).name}</span>
        <span className="tileMeta">{courseMeta(course)}</span>
      </button>
    )
  }

  return (
    <section className="semesterPanel activeSemesterPanel" onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropCourse(e, semester)}>
      <header className="semesterHeader"><div><h3>{semester}</h3><span>{courses.filter((c) => courseStatus(c) !== 'failed').reduce((sum, course) => sum + credits(course), 0)} 學分</span></div><div className="semesterBadges"><b className={`creditStatus ${semesterCreditStatus(courses).tone}`}>{semesterCreditStatus(courses).label}</b></div></header>
      {warnings.length ? <div className="warnings">{warnings.slice(0, 3).map((w) => <span key={w}>{w}</span>)}</div> : null}
      <div className="grid timetableGridClean">
        <div className="timetableCorner">節</div>{DAYS.map((d) => <div className="timetableDay" key={d}>週{d}</div>)}
        {PERIODS.slice(0, 10).map((p) => (
          <div className="gridRow" key={p}>
            <div className="timetablePeriod">{p}</div>
            {DAYS.map((d, di) => {
              const activeCourses = activeCoursesAt(di, p)
              const startingCourses = startingCoursesAt(di, p)
              const hasCourse = activeCourses.length > 0
              const startingGroups = buildStartingGroups(startingCourses, di, p)
              const hasStartingConflict = startingGroups.length > 1 && hasAnyConflict(startingGroups.map((group) => group[0]))
              const course = startingCourses[0]
              const continuationCourse = activeCourses[0]
              const hasContinuingConflict = !course && activeCourses.length > 1 && hasAnyConflict(activeCourses)
              return (
                <div className={`timetableCell ${hasCourse ? 'hasCourse' : ''}`} key={`${d}-${p}`}>
                  {hasStartingConflict ? (
                    <button
                      type="button"
                      className="timetableConflictTile"
                      style={{ '--tile-span': Math.max(...startingGroups.map((group) => Math.max(...group.map((entry) => spanForCourse(entry, di, p))))) }}
                      onClick={(e) => { e.stopPropagation(); setConflictViewer({ day: d, period: `${p}`, courses: startingCourses }) }}
                      title="點擊查看衝堂課程"
                    >
                      <span className="conflictMark">!</span>
                      <strong>衝堂 {startingGroups.length} 組</strong>
                      <small>{startingGroups.slice(0, 2).map((group) => getCourse(group[0]).name).join('、')}</small>
                    </button>
                  ) : startingGroups.length ? (
                    startingGroups.map((group, index) => group.length > 1
                      ? mergedHalfTile(group, di, p, index, startingGroups.length)
                      : tileButton(group[0], di, p, index, startingGroups.length))
                  ) : hasCourse ? (
                    <button
                      type="button"
                      className={`occupiedContinuation ${hasContinuingConflict ? 'continuationConflict' : ''}`}
                      title={activeCourses.length > 1 ? '此節次有多門週次課程，點擊查看' : hasContinuingConflict ? '此節次有衝堂課程，點擊查看' : '此節次已被跨節課程占用，可拖曳或點擊課程'}
                      draggable={!hasContinuingConflict && activeCourses.length === 1 && Boolean(continuationCourse)}
                      onDragStart={(e) => {
                        if (!continuationCourse || hasContinuingConflict) { e.preventDefault(); return }
                        e.dataTransfer.setData('application/json', JSON.stringify({ source: 'planned', semester, course: continuationCourse }))
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (hasContinuingConflict || activeCourses.length > 1) {
                          setConflictViewer({ day: d, period: `${p}`, courses: activeCourses })
                        } else if (continuationCourse) {
                          handleCourseClick(continuationCourse, e)
                        }
                      }}
                      aria-label={hasContinuingConflict ? '查看衝堂課程' : '開啟跨節課程'}
                    />
                  ) : (
                    <button type="button" className="emptySlotButton" onClick={() => onEmptySlotClick?.(semester, di + 1, p)} title="點擊檢索此空堂可排課程">＋</button>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <div className="unscheduled">{courses.filter((course) => slotsOf(course).length === 0).map((course) => <button type="button" className="unscheduledItem glassCourse" key={uid(course)} draggable onDragStart={(e) => e.dataTransfer.setData('application/json', JSON.stringify({ source: 'planned', semester, course }))} onClick={(e) => handleCourseClick(course, e)}><b className={`statusBadge ${STATUS[courseStatus(course)].tone}`} /><strong>{getCourse(course).name}</strong><small>{credits(course)} 學分｜無固定時間</small></button>)}</div>
      {conflictViewer && createPortal(
        <div className="conflictModalBackdrop" onMouseDown={() => setConflictViewer(null)}>
          <section className="conflictModal" onMouseDown={(e) => e.stopPropagation()}>
            <header>
              <div>
                <h3>衝堂課程</h3>
                <p>週{conflictViewer.day} 第 {conflictViewer.period} 節｜點課程可操作</p>
              </div>
              <button type="button" onClick={() => setConflictViewer(null)}>×</button>
            </header>
            <div className="conflictCourseList">
              {conflictViewer.courses.map((course) => {
                const c = getCourse(course)
                return (
                  <article
                    key={uid(course)}
                    className="conflictCourseItem"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('application/json', JSON.stringify({ source: 'planned', semester, course }))}
                  >
                    <button type="button" className="conflictCourseMain" onClick={(e) => openCourseFromConflict(course, e)}>
                      <strong>{c.name || '未命名課程'}</strong>
                      <span>{credits(course)} 學分｜{c.time_info || c.time || '未列時間'}</span>
                      <small>{c.classroom || c.room || c.location || '未列教室'}</small>
                    </button>
                    <div className="conflictCourseActions">
                      <button type="button" onClick={(e) => { e.stopPropagation(); onMoveToCandidate?.(semester, uid(course)); setConflictViewer(null) }}>移至暫存</button>
                      <button type="button" className="danger" onClick={(e) => { e.stopPropagation(); onDeleteCourse?.(semester, uid(course)); setConflictViewer(null) }}>刪除</button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        </div>,
        document.body,
      )}
    </section>
  )
}

export default SemesterGrid
