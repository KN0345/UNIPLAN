import { compareCourseHints, compareCourseRows } from '../../utils/compareCourses'

const FIELDS = [
  ['teacher', '教師'],
  ['time', '時間'],
  ['room', '教室'],
  ['credits', '學分'],
  ['requirement', '必/選修'],
  ['department', '開課單位'],
  ['code', '開課序號'],
  ['tagList', '標籤票數'],
]

function shortName(name = '') {
  return String(name || '未命名課程').replace(/\s+/g, ' ').trim()
}

function closeOnBackdrop(event, onClose) {
  if (event.target.classList?.contains('compareOverlay')) onClose?.()
}

export default function CompareTable({ courses = [], tagVotes = {}, onClose, onOpenCourseInfo }) {
  const rows = compareCourseRows(courses, tagVotes)
  const hints = compareCourseHints(courses, tagVotes)

  return (
    <div className="compareOverlay" onMouseDown={(event) => closeOnBackdrop(event, onClose)}>
      <section className="comparePanel comparePanelRedesign" role="dialog" aria-modal="true" aria-label="課程比較">
        <header className="modalHeader compareHeader compareHeaderRedesign">
          <div>
            <p className="compareEyebrow">已選 {rows.length} 門課</p>
            <h2>課程比較</h2>
            <span>快速比較教師、時間、教室、學分與評價標籤。</span>
          </div>
          <button className="modalClose" type="button" onClick={onClose} aria-label="關閉課程比較">×</button>
        </header>

        <div className="compareCourseCards">
          {rows.map((row, index) => (
            <article key={`summary-${row.id}`} className="compareCourseCard">
              <div className="compareCourseIndex">{index + 1}</div>
              <div className="compareCourseCardBody">
                <strong>{shortName(row.name)}</strong>
                <div className="compareCourseMetaChips">
                  <span>{row.credits}</span>
                  <span>{row.code}</span>
                  <span>{row.requirement}</span>
                </div>
                <p>教師｜{row.teacher}</p>
                <p>時間｜{row.time}</p>
                {row.room !== '未列' && <p>教室｜{row.room}</p>}
              </div>
              <button type="button" onClick={() => onOpenCourseInfo?.(row.raw)}>查看資訊</button>
            </article>
          ))}
        </div>

        <section className="compareInsightPanel" aria-label="比較觀察">
          <b>比較觀察</b>
          <div className="compareInsightList">
            {hints.length ? hints.map((hint) => <span key={hint}>{hint}</span>) : <span>目前沒有明顯差異，可依時間、教師或個人偏好選擇。</span>}
          </div>
        </section>

        <section className="compareMatrix" aria-label="比較明細" style={{ '--compare-columns': rows.length }}>
          <div className="compareMatrixHeader">
            <span>比較項目</span>
            {rows.map((row) => <b key={`head-${row.id}`}>{shortName(row.name)}</b>)}
          </div>
          {FIELDS.map(([key, label]) => (
            <div className={`compareMatrixRow compareMatrixRow-${key}`} key={key}>
              <span className="compareMatrixLabel">{label}</span>
              {rows.map((row) => <p key={`${row.id}-${key}`}>{row[key]}</p>)}
            </div>
          ))}
        </section>
      </section>
    </div>
  )
}
