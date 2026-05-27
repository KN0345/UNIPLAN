import { useState } from 'react'
import { createPortal } from 'react-dom'
import { DAYS, PERIODS, STATUS, credits, getCourse, riskScore, semesterCreditStatus, semesterWarnings, slotsOf, uid, courseStatus } from '../../utils/coursePlanning'

function SemesterGrid({ semester, courses, plan, onDropCourse, onMoveCourse, onCourseClick, onEmptySlotClick, onDeleteCourse, onMoveToCandidate }) {
  const warnings = semesterWarnings(semester, courses, plan)
  const risk = riskScore(semester, courses, plan)
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
    return room || '未列教室'
  }

  return (
    <section className="semesterPanel activeSemesterPanel" onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropCourse(e, semester)}>
      <header className="semesterHeader"><div><h3>{semester}</h3><span>{courses.filter((c) => courseStatus(c) !== 'failed').reduce((sum, course) => sum + credits(course), 0)} 學分</span></div><div className="semesterBadges"><b className={`creditStatus ${semesterCreditStatus(courses).tone}`}>{semesterCreditStatus(courses).label}</b><b className={risk.score >= 70 ? 'riskHigh' : risk.score >= 40 ? 'riskMid' : 'riskLow'}>風險 {risk.score}</b></div></header>
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
              const hasStartingConflict = startingCourses.length > 1
              const course = startingCourses[0]
              const continuationCourse = activeCourses[0]
              const hasContinuingConflict = !course && activeCourses.length > 1
              return (
                <div className={`timetableCell ${hasCourse ? 'hasCourse' : ''}`} key={`${d}-${p}`}>
                  {hasStartingConflict ? (
                    <button
                      type="button"
                      className="timetableConflictTile"
                      style={{ '--tile-span': Math.max(...startingCourses.map((entry) => spanForCourse(entry, di, p))) }}
                      onClick={(e) => { e.stopPropagation(); setConflictViewer({ day: d, period: `${p}`, courses: startingCourses }) }}
                      title="點擊查看衝堂課程"
                    >
                      <span className="conflictMark">!</span>
                      <strong>衝堂 {startingCourses.length} 門</strong>
                      <small>{startingCourses.slice(0, 2).map((entry) => getCourse(entry).name).join('、')}</small>
                    </button>
                  ) : course ? (
                    <button
                      className="timetableCourseTile"
                      style={{ '--tile-span': spanForCourse(course, di, p) }}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('application/json', JSON.stringify({ source: 'planned', semester, course }))}
                      onClick={(e) => handleCourseClick(course, e)}
                      title="點擊開啟快速操作"
                    >
                      <b className={`courseTypeDot ${STATUS[courseStatus(course)]?.tone || 'blue'}`} />
                      <span className="tileTitle">{getCourse(course).name}</span>
                      <span className="tileMeta">{courseMeta(course)}</span>
                    </button>
                  ) : hasCourse ? (
                    <button
                      type="button"
                      className={`occupiedContinuation ${hasContinuingConflict ? 'continuationConflict' : ''}`}
                      title={hasContinuingConflict ? '此節次有衝堂課程，點擊查看' : '此節次已被跨節課程占用，可拖曳或點擊課程'}
                      draggable={!hasContinuingConflict && Boolean(continuationCourse)}
                      onDragStart={(e) => {
                        if (!continuationCourse || hasContinuingConflict) { e.preventDefault(); return }
                        e.dataTransfer.setData('application/json', JSON.stringify({ source: 'planned', semester, course: continuationCourse }))
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (hasContinuingConflict) {
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
