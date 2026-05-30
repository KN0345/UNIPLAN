import { createPortal } from 'react-dom'
import { SEMESTERS, STATUS, STATUS_ORDER, courseStatus, credits, getCourse, uid } from '../../utils/coursePlanning'

function nextStatus(value) {
  const index = STATUS_ORDER.indexOf(value)
  return STATUS_ORDER[(index + 1) % STATUS_ORDER.length]
}

function CoursePopover({ data, onClose, onStatus, onMove, onInfo, onFavorite }) {
  if (!data?.course) return null
  const course = data.course
  const c = getCourse(course)
  const status = courseStatus(course)
  const popoverWidth = 282
  const popoverHeight = 310
  const viewportW = typeof window === 'undefined' ? 1200 : window.innerWidth
  const viewportH = typeof window === 'undefined' ? 800 : window.innerHeight
  const x = Math.max(12, Math.min(data.x || 260, viewportW - popoverWidth - 12))
  const requestedY = data.y || 220
  const openUp = requestedY + popoverHeight > viewportH - 16
  const y = Math.max(12, openUp ? requestedY - popoverHeight - 16 : Math.min(requestedY, viewportH - popoverHeight - 12))
  return createPortal(
    <div className="popoverBackdrop" onMouseDown={onClose}>
      <div className={`coursePopover ${openUp ? 'openUp' : ''}`} style={{ left: x, top: y }} onMouseDown={(e) => e.stopPropagation()}>
        <div className="popoverHead">
          <button className={`statusBadge statusButton ${STATUS[status]?.tone || 'blue'}`} onClick={() => onStatus(data.semester, uid(course), nextStatus(status))} title="切換狀態" />
          <div><strong>{c.name || '未命名課程'}</strong><span>{credits(c)} 學分</span></div>
          <button className="miniClose" onClick={onClose}>×</button>
        </div>
        <div className="popoverActions">
          <button onClick={() => onFavorite(c)}>☆ 收藏</button>
          <button onClick={() => onInfo(c)}>資訊</button>
        </div>
        <div className="moveBlock">
          <span>移動到學期</span>
          <div className="moveSemesterGrid">{SEMESTERS.map((sem) => <button key={sem} className={sem === data.semester ? 'active' : ''} disabled={sem === data.semester} onClick={() => onMove(data.semester, uid(course), sem)}>{sem}</button>)}</div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default CoursePopover
