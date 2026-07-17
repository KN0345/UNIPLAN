import { STATUS, courseMatchesSemester, courseStatus, courseTermLabel, credits, getCourse } from '../../utils/coursePlanning'

function courseCode(course) {
  const c = getCourse(course)
  return c.serial || c.code || c.course_id || c.class_id || c.id || ''
}


function cleanTeacherName(value) {
  return String(value || '')
    .replace(/（[^）]*\*{2,}[^）]*）/g, '')
    .replace(/\([^)]*\*{2,}[^)]*\)/g, '')
    .replace(/\s*,\s*/g, '、')
    .replace(/\s+/g, ' ')
    .trim()
}

function courseUnit(course) {
  const c = getCourse(course)
  return c.department || c.major || c.unit || c.opening_unit || c.category || ''
}

function CourseCard({ course, draggable = true, onSelect, compact = false, dragSource = 'course', dragSemester = '', targetSemester = '', onAddCandidate, onFavorite, isFavorite = false, isCandidate = false, onCompare, isCompared = false, compareDisabled = false }) {
  const c = getCourse(course)
  const status = courseStatus(course)
  const semesterMismatch = false
  const code = courseCode(c)
  const unit = courseUnit(c)
  const teacherName = cleanTeacherName(c.teacher || c.instructor) || '未列教師'
  const timeMeta = c.time_info || c.time || '未列時間'
  const roomMeta = c.classroom || c.room || c.location || ''
  const className = String(c.class_name || c.className || c.class || '').trim()
  const hasLongTimeMeta = String(timeMeta || '').length > 18 || String(timeMeta || '').includes('｜') || String(timeMeta || '').includes('|') || Boolean(roomMeta)
  function handleAction(event, action) {
    event.preventDefault()
    event.stopPropagation()
    action?.(c)
  }
  return (
    <article className={`courseCard ${compact ? 'compact' : ''} ${semesterMismatch ? 'semesterMismatch' : ''} ${hasLongTimeMeta ? 'longTimeMeta' : ''}`} draggable={draggable && !semesterMismatch} onDragStart={(e) => { if (semesterMismatch) { e.preventDefault(); return } e.dataTransfer.setData('application/json', JSON.stringify({ source: dragSource, semester: dragSemester, course })) }} onClick={() => onSelect?.(c)}>
      <div className="cardHead"><strong>{c.name || '未命名課程'}</strong></div>
      <div className="courseCardDetails">
        <p className="courseTeacherName">教師｜{teacherName}</p>
        {unit && <p className="courseDeptName">開課｜{unit}</p>}
        <p className="courseTimeLine">時間｜{timeMeta}</p>
        {roomMeta && <p className="courseRoomLine">教室｜{roomMeta}</p>}
      </div>
      <div className="courseCardFooter">
        <div className="courseBottomBadges">
          {code && <span className="courseSerialPill" title="開課序號與班別">{code}{className ? `｜${className}班` : ''}</span>}
          <span className="courseCreditPill" title="學分數">{credits(c)} 學分</span>
        </div>
        {(onCompare || onAddCandidate || onFavorite) && <div className="searchCardActions">
          {onCompare && <button className={isCompared ? 'active compareAction' : 'compareAction'} disabled={!isCompared && compareDisabled} title={isCompared ? '取消比較' : compareDisabled ? '最多比較 4 門課' : '加入比較'} aria-label={isCompared ? '取消比較' : '加入比較'} onClick={(event) => handleAction(event, onCompare)}>{isCompared ? '比✓' : '比'}</button>}
          {onAddCandidate && <button className={`candidateAction ${isCandidate ? 'active candidateAdded' : semesterMismatch ? 'semesterDifferent' : ''}`} disabled={isCandidate} title={isCandidate ? '已加入課表或暫存區' : semesterMismatch ? `可先加入暫存區；這門課屬於 ${courseTermLabel(c)}，目前課表是 ${targetSemester}` : '加入暫存區'} aria-label={isCandidate ? '已加入課表或暫存區' : '加入暫存區'} onClick={(event) => { if (isCandidate) { event.preventDefault(); event.stopPropagation(); return } handleAction(event, onAddCandidate) }}>{isCandidate ? '✓' : '＋'}</button>}
          {onFavorite && <button className={isFavorite ? 'active' : ''} title={isFavorite ? '取消收藏' : '收藏'} aria-label={isFavorite ? '取消收藏' : '收藏'} onClick={(event) => handleAction(event, onFavorite)}>{isFavorite ? '★' : '☆'}</button>}
        </div>}
      </div>
    </article>
  )
}

export default CourseCard
