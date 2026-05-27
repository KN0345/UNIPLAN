import { compareCourseHints, compareCourseRows } from '../../utils/compareCourses'

const FIELDS = [
  ['teacher', '教師'],
  ['time', '時間'],
  ['credits', '學分'],
  ['requirement', '必/選修'],
  ['department', '開課單位'],
  ['code', '開課序號'],
  ['tagList', '標籤票數'],
]

export default function CompareTable({ courses = [], tagVotes = {}, onClose, onOpenCourseInfo }) {
  const rows = compareCourseRows(courses, tagVotes)
  const hints = compareCourseHints(courses, tagVotes)
  return (
    <div className="compareOverlay" onMouseDown={(event) => { if (event.target.className === 'compareOverlay') onClose?.() }}>
      <section className="comparePanel" role="dialog" aria-modal="true" aria-label="課程比較">
        <header className="modalHeader compareHeader">
          <div>
            <h2>課程比較</h2>
            <p className="muted">用時間、學分、標籤票數快速判斷哪門課比較適合。</p>
          </div>
          <button className="modalClose" type="button" onClick={onClose}>×</button>
        </header>
        <div className="compareSummaryGrid">
          {rows.map((row) => <article key={`summary-${row.id}`} className="compareSummaryCard">
            <strong>{row.name}</strong>
            <span>{row.credits}｜{row.teacher}</span>
            <b>{row.topTag}</b>
            <button type="button" onClick={() => onOpenCourseInfo?.(row.raw)}>查看資訊</button>
          </article>)}
        </div>
        <div className="compareHints">
          <b>比較觀察</b>
          {hints.length ? hints.map((hint) => <p key={hint}>{hint}</p>) : <p>目前資料差異不明顯，可依時間與教師自行判斷。</p>}
        </div>
        <div className="compareTableWrap">
          <table className="compareTable">
            <thead>
              <tr>
                <th>項目</th>
                {rows.map((row) => <th key={row.id}>{row.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {FIELDS.map(([key, label]) => (
                <tr key={key}>
                  <th>{label}</th>
                  {rows.map((row) => <td key={`${row.id}-${key}`}>{row[key]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
