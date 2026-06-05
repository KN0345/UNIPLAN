import { useState } from 'react'
import { CATEGORY_TONES, STATUS, creditCategory, creditSummary, credits, effectiveCourses, getCourse, courseStatus } from '../../utils/coursePlanning'

function ProgressBar({ value, max, tone = 'catTotal' }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0
  return <span className={`bar ${tone}`}><i style={{ width: `${pct}%` }} /></span>
}

function CreditStackBar({ completed, planned, max }) {
  const completedPct = max ? Math.min(100, (completed / max) * 100) : 0
  const plannedPct = max ? Math.min(100 - completedPct, (planned / max) * 100) : 0
  return (
    <span className="bar creditStackBar">
      <i className="completedSeg" style={{ width: `${completedPct}%` }} />
      <i className="plannedSeg" style={{ width: `${plannedPct}%` }} />
    </span>
  )
}

function CreditProgressModal({ view, onClose }) {
  if (!view) return null
  return (
    <div className="creditProgressBackdrop" onMouseDown={onClose}>
      <section className="creditProgressModal" onMouseDown={(e) => e.stopPropagation()}>
        <header>
          <div>
            <h3>{view.title}</h3>
            <p>{view.courses.length} 門課｜{view.courses.reduce((sum, course) => sum + credits(course), 0)} 學分</p>
          </div>
          <button type="button" onClick={onClose}>×</button>
        </header>
        <div className="creditProgressList">
          {view.courses.length ? view.courses.map((course) => {
            const c = getCourse(course)
            const status = STATUS[courseStatus(course)] || STATUS.planned
            return (
              <article key={`${c.semester_source || ''}-${c.serial || c.code || c.name}-${c.teacher || ''}`}>
                <div>
                  <strong>{c.name || '未命名課程'}</strong>
                  <span>{c.serial || c.code || '未列課號'}｜{c.teacher || '未列教師'}｜{c.time_info || c.time || '未列時間'}</span>
                </div>
                <b className={`statusBadge ${status.tone}`}>{credits(course)} 學分</b>
              </article>
            )
          }) : <p className="muted">目前沒有計入此分類的課程。</p>}
        </div>
      </section>
    </div>
  )
}

function CreditStrip({ plan, rules }) {
  const [view, setView] = useState(null)
  const [expanded, setExpanded] = useState(() => localStorage.getItem('uniplanCreditStripExpanded') === '1')
  const toggleExpanded = () => {
    setExpanded((next) => {
      const value = !next
      localStorage.setItem('uniplanCreditStripExpanded', value ? '1' : '0')
      return value
    })
  }
  const summary = creditSummary(plan, rules)
  const courses = effectiveCourses(plan)
  const openTotal = () => setView({ title: '畢業進度課程', courses })
  const openCategory = (cat) => setView({
    title: `${cat.label}進度課程`,
    courses: courses.filter((course) => creditCategory(course) === cat.key),
  })
  return (
    <>
      <section className={`creditStrip ${expanded ? 'expanded' : 'collapsed'}`}>
        <button type="button" className="creditMain creditProgressButton creditToggleButton" onClick={toggleExpanded} title={expanded ? '收合畢業進度' : '展開畢業進度'}>
          <strong>畢業進度 {summary.total}/{rules.totalCredits}</strong><CreditStackBar completed={summary.completed} planned={summary.planned} max={rules.totalCredits} /><span>{summary.percent}%</span><b className="creditStripChevron">{expanded ? '▾' : '▸'}</b>
        </button>
        {expanded && (
          <div className="creditMini">
            {rules.categories.slice(0, 5).map((cat) => {
              const value = summary.byCat[cat.key] || 0
              return <button type="button" className="creditMiniItem creditProgressButton" key={cat.key} onClick={() => openCategory(cat)} title={`查看${cat.label}課程`}><span><b className={`catDot ${CATEGORY_TONES[cat.key] || 'catFree'}`} />{cat.label} {value}/{cat.required}</span><ProgressBar value={value} max={cat.required} tone={CATEGORY_TONES[cat.key] || 'catFree'} /></button>
            })}
          </div>
        )}
      </section>
      <CreditProgressModal view={view} onClose={() => setView(null)} />
    </>
  )
}

export { ProgressBar, CreditStackBar }
export default CreditStrip
