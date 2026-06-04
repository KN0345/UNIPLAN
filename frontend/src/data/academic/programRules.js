import academicRules from './academic_rules.json'

export function getAcademicPrograms({ department, track, programType, entryYear } = {}) {
  const year = Number(entryYear || 0)
  return (academicRules.programs || []).filter((rule) => {
    if (department && rule.department !== department) return false
    if (track && rule.track && rule.track !== track) return false
    if (programType && rule.programType !== programType) return false
    if (year && rule.entryYearStart && year < Number(rule.entryYearStart)) return false
    if (year && rule.entryYearEnd && year > Number(rule.entryYearEnd)) return false
    return true
  })
}

export function getBestAcademicProgram(query = {}) {
  const matches = getAcademicPrograms(query)
  return matches.sort((a, b) => Number(b.entryYearStart || 0) - Number(a.entryYearStart || 0))[0] || null
}

export default academicRules
