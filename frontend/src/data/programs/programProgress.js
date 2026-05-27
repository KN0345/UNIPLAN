import { PROGRAM_RULE_TYPES } from './programData'

export function getCourseName(course) {
  const raw = course?.course || course || {}
  return String(raw.name || raw.course_name || raw.title || raw.subject || raw.courseTitle || '').trim()
}
export function getCourseCredits(course) {
  const raw = course?.course || course || {}
  const value = raw.credits ?? raw.credit ?? raw.credit_count ?? raw.credit_hours ?? 0
  const match = String(value).match(/\d+(\.\d+)?/)
  const num = Number(match ? match[0] : value)
  return Number.isFinite(num) ? num : 0
}
function norm(value) {
  return String(value || '').replace(/[（）()\s:：／/\-—_]/g, '').toLowerCase()
}
function stripClassSuffix(value) {
  return String(value || '')
    .replace(/\s*[（(][A-ZＰPＯO0-9一二三四五六七八九十甲乙丙丁戊己庚辛壬癸]*班[）)]\s*$/i, '')
    .replace(/\s*[（(][^）)]*班[）)]\s*$/i, '')
    .trim()
}
function normBase(value) { return norm(stripClassSuffix(value)) }
function courseStatus(course) {
  const raw = course?.course || course || {}
  return raw.planningStatus || 'planned'
}
function programEligible(course) {
  const raw = course?.course || course || {}
  if (courseStatus(raw) === 'failed') return false
  if (raw.manual && raw.includeProgram === false) return false
  return true
}
function plannedCoursePool(plan = {}, candidates = [], favorites = []) {
  // Program progress should represent actual/planned course-taking. Favorites are
  // interest markers and must not satisfy program rules. Failed records are also
  // kept visible in the planner but excluded from progress. Manual courses count
  // only when explicitly marked as program-applicable.
  const planned = Object.values(plan || {}).flat().filter(programEligible).map((course) => ({ course, source: '已排' }))
  const temp = (candidates || []).filter(programEligible).map((course) => ({ course, source: '暫存' }))
  return [...planned, ...temp]
}
export function matchCourse(programCourse, coursePool) {
  const target = normBase(programCourse?.name)
  if (!target) return null
  return coursePool.find(({ course }) => {
    const name = norm(getCourseName(course))
    return name && name === target
  }) || null
}
function summarizeRule(rule) {
  if (!rule) return ''
  if (rule.type === PROGRAM_RULE_TYPES.MIN_CREDIT) return `至少 ${rule.credits} 學分`
  if (rule.type === PROGRAM_RULE_TYPES.MIN_COURSE) return `至少 ${rule.count} 門`
  if (rule.type === PROGRAM_RULE_TYPES.SELECT_N_OF_M) return `${rule.total ? `${rule.total} 選 ` : ''}${rule.count}`
  if (rule.type === PROGRAM_RULE_TYPES.MAX_COURSE) return `至多承認 ${rule.count || 1} 門`
  if (rule.type === PROGRAM_RULE_TYPES.MAX_CREDIT) return `至多採計 ${rule.credits} 學分`
  if (rule.type === PROGRAM_RULE_TYPES.MIN_OUTSIDE_MAJOR_CREDIT) return `非主修至少 ${rule.credits} 學分（提醒）`
  if (rule.type === PROGRAM_RULE_TYPES.ALL_GROUPS_REQUIRED) return '所有群組皆需完成'
  if (rule.type === PROGRAM_RULE_TYPES.NOTE) return rule.text
  return rule.label || rule.type
}
export function ruleTextList(rules = []) {
  return (rules || []).map(summarizeRule).filter(Boolean)
}
function flattenGroups(groups = []) {
  return groups.flatMap((group) => [group, ...flattenGroups(group.children || [])])
}
export function evaluateProgram(program, context = {}) {
  const pool = plannedCoursePool(context.plan, context.candidates, context.favorites)
  const flatGroups = flattenGroups(program.groups || [])
  const groupResults = flatGroups.map((group) => {
    const matched = (group.courses || []).map((pc) => ({ programCourse: pc, match: matchCourse(pc, pool) })).filter((item) => item.match)
    const matchedCredits = matched.reduce((sum, item) => sum + (item.programCourse.credits || getCourseCredits(item.match.course) || 0), 0)
    const matchedCount = matched.length
    const minCreditRules = (group.rules || []).filter((r) => r.type === PROGRAM_RULE_TYPES.MIN_CREDIT)
    const minCourseRules = (group.rules || []).filter((r) => r.type === PROGRAM_RULE_TYPES.MIN_COURSE)
    const maxCourseRules = (group.rules || []).filter((r) => r.type === PROGRAM_RULE_TYPES.MAX_COURSE)
    const maxCreditRules = (group.rules || []).filter((r) => r.type === PROGRAM_RULE_TYPES.MAX_CREDIT)
    const creditTarget = minCreditRules[0]?.credits || 0
    const courseTarget = minCourseRules[0]?.count || maxCourseRules[0]?.count || 0
    const target = creditTarget || courseTarget || 0
    const effectiveMatchedCredits = maxCreditRules[0]?.credits ? Math.min(matchedCredits, maxCreditRules[0].credits) : matchedCredits
    const current = creditTarget ? effectiveMatchedCredits : matchedCount
    const completed = target ? current >= target : matchedCount > 0
    return { group, matched, matchedCredits: effectiveMatchedCredits, rawMatchedCredits: matchedCredits, matchedCount, creditTarget, courseTarget, maxCredit: maxCreditRules[0]?.credits || 0, target, current, completed, rules: ruleTextList(group.rules) }
  })
  const totalMatchedCredits = groupResults.reduce((sum, r) => sum + r.matchedCredits, 0)
  const totalMatchedCount = groupResults.reduce((sum, r) => sum + r.matchedCount, 0)
  const totalCreditTarget = (program.totalRules || []).find((r) => r.type === PROGRAM_RULE_TYPES.MIN_CREDIT)?.credits || groupResults.reduce((sum, r) => sum + (r.creditTarget || 0), 0)
  const totalCourseTarget = (program.totalRules || []).find((r) => r.type === PROGRAM_RULE_TYPES.MIN_COURSE)?.count || 0
  const totalTarget = totalCreditTarget || totalCourseTarget || groupResults.filter((r) => r.target).length || 1
  const totalCurrent = totalCreditTarget ? totalMatchedCredits : totalCourseTarget ? totalMatchedCount : groupResults.filter((r) => r.completed).length
  const percent = Math.max(0, Math.min(100, Math.round((totalCurrent / Math.max(1, totalTarget)) * 100)))
  const missingGroups = groupResults.filter((r) => r.target && !r.completed).slice(0, 6).map((r) => ({ group: r.group.name, need: Math.max(0, r.target - r.current), unit: r.creditTarget ? '學分' : '門' }))
  return { program, groupResults, totalMatchedCredits, totalMatchedCount, totalCreditTarget, totalCourseTarget, totalCurrent, totalTarget, percent, missingGroups }
}
export function programCompleteness(program) {
  const flat = flattenGroups(program.groups || [])
  const totalGroups = flat.length
  const courseCount = flat.reduce((sum, g) => sum + (g.courses?.length || 0), 0)
  const ruleCount = flat.reduce((sum, g) => sum + (g.rules?.length || 0), 0) + (program.totalRules?.length || 0)
  const issues = []
  if (!totalGroups) issues.push('尚未建立課程群組')
  if (!courseCount) issues.push('尚未建立課程清單')
  if (!ruleCount) issues.push('尚未建立進度規則')
  if (program.status === 'NEEDS_RULES') issues.push('只有學程索引，缺詳細修業規則')
  if (program.status === 'PARTIAL') issues.push('已建立部分資料，仍需人工校對')
  return { totalGroups, courseCount, ruleCount, issues, score: Math.max(0, 100 - issues.length * 25) }
}
