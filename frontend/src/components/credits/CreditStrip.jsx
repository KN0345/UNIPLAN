import { CATEGORY_TONES, creditSummary } from '../../utils/coursePlanning'

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

function CreditStrip({ plan, rules }) {
  const summary = creditSummary(plan, rules)
  return (
    <section className="creditStrip">
      <div className="creditMain"><strong>畢業進度 {summary.total}/{rules.totalCredits}</strong><CreditStackBar completed={summary.completed} planned={summary.planned} max={rules.totalCredits} /><span>{summary.percent}%</span></div>
      <div className="creditMini">
        {rules.categories.slice(0, 5).map((cat) => {
          const value = summary.byCat[cat.key] || 0
          return <div className="creditMiniItem" key={cat.key}><span><b className={`catDot ${CATEGORY_TONES[cat.key] || 'catFree'}`} />{cat.label} {value}/{cat.required}</span><ProgressBar value={value} max={cat.required} tone={CATEGORY_TONES[cat.key] || 'catFree'} /></div>
        })}
      </div>
    </section>
  )
}

export { ProgressBar, CreditStackBar }
export default CreditStrip
