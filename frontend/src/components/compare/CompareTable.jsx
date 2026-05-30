import { compareCourseRows } from '../../utils/compareCourses'

const FIELD_ROWS = [
  ['teacher', '教師'],
  ['time', '時間'],
  ['room', '教室'],
  ['credits', '學分'],
  ['requirement', '必/選修'],
  ['department', '開課單位'],
  ['code', '開課序號'],
]

function shortName(name = '') {
  return String(name || '未命名課程').replace(/\s+/g, ' ').trim()
}

function closeOnBackdrop(event, onClose) {
  if (event.target.classList?.contains('compareOverlay')) onClose?.()
}

function valueClass(row, key) {
  if (key === 'time' && row.hasTimeConflict) return 'compareValueDanger'
  if (key === 'credits' && row.hasLowerCredits) return 'compareValueDanger'
  return ''
}

function TagChips({ row }) {
  if (!row.tags?.length) return <span className="compareNoTags">尚無標籤票數</span>
  return (
    <div className="compareTagChips">
      {row.tags.map((tag) => (
        <span key={`${row.id}-${tag.tag}`} className={`compareTagChip ${tag.tone === 'positive' ? 'positive' : ''} ${tag.tone === 'negative' ? 'negative' : ''}`}>
          {tag.tag} {tag.count}
        </span>
      ))}
    </div>
  )
}

export default function CompareTable({ courses = [], tagVotes = {}, onClose, onOpenCourseInfo }) {
  const rows = compareCourseRows(courses, tagVotes)

  return (
    <div className="compareOverlay" onMouseDown={(event) => closeOnBackdrop(event, onClose)}>
      <section className="comparePanel comparePanelRedesign comparePanelSimple" role="dialog" aria-modal="true" aria-label="課程比較">
        <header className="modalHeader compareHeader compareHeaderRedesign">
          <div>
            <p className="compareEyebrow">已選 {rows.length} 門課</p>
            <h2>課程比較</h2>
            <span>衝堂時間與較低學分會以紅色標示；標籤顯示前三高票，正面為綠色、負面為紅色。</span>
          </div>
          <button className="modalClose" type="button" onClick={onClose} aria-label="關閉課程比較">×</button>
        </header>

        <section className="compareSimpleGrid" aria-label="課程比較明細" style={{ '--compare-columns': rows.length }}>
          <div className="compareSimpleHeader compareSimpleRow">
            <span className="compareSimpleLabel">項目</span>
            {rows.map((row) => <b key={`head-${row.id}`}>{shortName(row.name)}</b>)}
          </div>

          {FIELD_ROWS.map(([key, label]) => (
            <div className={`compareSimpleRow compareSimpleRow-${key}`} key={key}>
              <span className="compareSimpleLabel">{label}</span>
              {rows.map((row) => (
                <p key={`${row.id}-${key}`} className={valueClass(row, key)}>{row[key]}</p>
              ))}
            </div>
          ))}

          <div className="compareSimpleRow compareSimpleRow-tags">
            <span className="compareSimpleLabel">前三標籤</span>
            {rows.map((row) => <div key={`${row.id}-tags`} className="compareSimpleTags"><TagChips row={row} /></div>)}
          </div>

          <div className="compareSimpleRow compareSimpleRow-action">
            <span className="compareSimpleLabel">操作</span>
            {rows.map((row) => (
              <div key={`${row.id}-action`} className="compareSimpleActions">
                <button type="button" onClick={() => onOpenCourseInfo?.(row.raw)}>查看資訊</button>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  )
}
