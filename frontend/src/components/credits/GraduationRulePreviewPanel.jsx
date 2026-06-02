import { creditSummary } from '../../utils/coursePlanning'
import { DEFAULT_RULES, matchedGraduationRuleForProfile } from '../../data/graduation/graduationRulesPreview'

function categoryLabel(cat) {
  return cat?.label || cat?.name || cat?.key || '分類'
}
function categoryTarget(cat) {
  return Number(cat?.required || cat?.credits || cat?.target || cat?.minCredits || 0) || 0
}
function progressPercent(value, target) {
  return target ? Math.min(100, Math.round((Number(value || 0) / target) * 100)) : 0
}

export default function GraduationRulePreviewPanel({ profile, plan = {} }) {
  const rule = matchedGraduationRuleForProfile(profile)
  const total = Number(rule?.totalCredits || DEFAULT_RULES.totalCredits)
  const rules = rule ? { totalCredits: total, categories: (rule.categories && rule.categories.length ? rule.categories : DEFAULT_RULES.categories) } : DEFAULT_RULES
  const summary = creditSummary(plan, rules)
  const completed = Number(summary.total || 0)
  const percent = progressPercent(completed, total)
  const categories = (rules.categories || []).filter((cat) => categoryTarget(cat) > 0)

  return <div className="gradPreviewPanel autoGradPanel simpleGradPanel detailedGradPanel">
    <div className="simpleProgressHeader"><div><h3>{rule?.department || '通用'}｜{rule?.entryYear || profile?.entryYear || '目前'}</h3><p className="muted">總學分</p></div><strong>{percent}%</strong></div>
    <div className="creditStrip gradCreditStrip simpleOnly"><div className="creditMain"><strong>{completed}/{total}</strong><span className="bar creditStackBar"><i className="completedSeg" style={{ width: `${percent}%` }} /></span><b>{percent}%</b></div></div>
    <div className="gradCategoryRows">
      {categories.map((cat, index) => {
        const current = Number(summary.byCat?.[cat.key] || 0)
        const target = categoryTarget(cat)
        const pct = progressPercent(current, target)
        return <div key={cat.key} className={`gradCategoryLine tone${index % 6}`}>
          <b>{categoryLabel(cat)}</b>
          <strong>{current}/{target}</strong>
          <span className="bar"><i style={{ width: `${pct}%` }} /></span>
          <em>{pct}%</em>
        </div>
      })}
    </div>
  </div>
}
