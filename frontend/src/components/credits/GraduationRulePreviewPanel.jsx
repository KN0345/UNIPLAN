import { creditSummary, universityRequirementAudit, UNIVERSITY_REQUIREMENT_RULE_114 } from '../../utils/coursePlanning'
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
function itemValue(audit, key) {
  return Number(audit?.items?.[key]?.credits || 0)
}
function cappedItemValue(audit, item) {
  return Math.min(itemValue(audit, item.key), Number(item.target || 0))
}
function requirementDone(audit, item) {
  return itemValue(audit, item.key) >= Number(item.target || 0)
}
function entryYearNumber(profile, rule) {
  return Number(rule?.entryYear || profile?.entryYear || profile?.admissionYear || 0)
}
function UniversalRequirementRow({ audit, item }) {
  const value = cappedItemValue(audit, item)
  const pct = progressPercent(value, item.target)
  return <div className={`univReqItem ${requirementDone(audit, item) ? 'done' : ''}`}>
    <span>{requirementDone(audit, item) ? '✓' : '□'} {item.label}</span>
    <strong>{value}/{item.target}</strong>
    <em>{item.counted === false ? '不計畢業學分' : '計入'}</em>
    <i style={{ width: `${pct}%` }} />
  </div>
}
function UniversalRequirementBlock({ title, value, target, children }) {
  const pct = progressPercent(value, target)
  return <section className="univReqBlock">
    <header><b>{title}</b><strong>{value}/{target}</strong><span className="bar"><i style={{ width: `${pct}%` }} /></span></header>
    <div className="univReqGrid">{children}</div>
  </section>
}
function UniversalGraduationRequirements({ audit }) {
  const rules = UNIVERSITY_REQUIREMENT_RULE_114
  return <div className="univReqPanel">
    <div className="univReqTitle"><h4>114 起全校共同必修結構檢查</h4><p>校必修需同時符合子項目，不再只看 26 學分總數。</p></div>
    <UniversalRequirementBlock title="服務與活動課程" value={audit.serviceCounted} target={audit.targets.service}>
      {rules.service.map((item) => <UniversalRequirementRow key={item.key} audit={audit} item={item} />)}
    </UniversalRequirementBlock>
    <UniversalRequirementBlock title="基本知能課程" value={Math.min(audit.basicCounted, audit.targets.basic)} target={audit.targets.basic}>
      {rules.basic.map((item) => <UniversalRequirementRow key={item.key} audit={audit} item={item} />)}
    </UniversalRequirementBlock>
    <UniversalRequirementBlock title="通識核心課程" value={Math.min(audit.coreCounted, audit.targets.core)} target={audit.targets.core}>
      {rules.core.map((item) => <UniversalRequirementRow key={item.key} audit={audit} item={item} />)}
    </UniversalRequirementBlock>
  </div>
}

export default function GraduationRulePreviewPanel({ profile, plan = {} }) {
  const rule = matchedGraduationRuleForProfile(profile)
  const total = Number(rule?.totalCredits || DEFAULT_RULES.totalCredits)
  const rules = rule ? { totalCredits: total, categories: (rule.categories && rule.categories.length ? rule.categories : DEFAULT_RULES.categories) } : DEFAULT_RULES
  const summary = creditSummary(plan, rules)
  const completed = Number(summary.total || 0)
  const percent = progressPercent(completed, total)
  const categories = (rules.categories || []).filter((cat) => categoryTarget(cat) > 0)
  const universalAudit = universityRequirementAudit(plan)
  const showUniversal114 = entryYearNumber(profile, rule) >= 114 || !entryYearNumber(profile, rule)

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
    {showUniversal114 && <UniversalGraduationRequirements audit={universalAudit} />}
  </div>
}
