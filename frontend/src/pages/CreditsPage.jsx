import academicRules from '../data/academic/academic_rules.json'

const PROGRAM_TYPES = [
  { key: 'minor', label: '輔系' },
  { key: 'sub_minor', label: '輔修' },
  { key: 'second_major', label: '第二主修' },
  { key: 'double_major', label: '雙主修' },
]

function ruleLabel(rule) {
  const track = rule.track ? `｜${rule.track}` : ''
  const year = rule.entryYearStart ? `｜${rule.entryYearStart}起` : ''
  return `${rule.department}${track}${year}`
}

function availableRules(type) {
  return (academicRules.programs || [])
    .filter((rule) => rule.programType === type)
    .sort((a, b) => ruleLabel(a).localeCompare(ruleLabel(b), 'zh-Hant'))
}

function selectedProgram(profile, type) {
  return profile?.academicPrograms?.[type] || null
}

function programSummary(program) {
  if (!program?.ruleId) return '尚未設定'
  const req = program.requiredCredits ? `${program.requiredCredits}學分` : '依規則計算'
  return `${program.department || '未指定'}${program.track ? `｜${program.track}` : ''}｜${req}`
}

function AcademicProgramSettings({ profile, onProfileChange }) {
  const programs = profile?.academicPrograms || {}

  function updateProgram(type, ruleId) {
    const rules = availableRules(type)
    const rule = rules.find((item) => item.id === ruleId)
    const nextPrograms = { ...programs }
    if (!rule) {
      delete nextPrograms[type]
    } else {
      nextPrograms[type] = {
        type,
        ruleId: rule.id,
        department: rule.department,
        track: rule.track || '',
        entryYearStart: rule.entryYearStart || '',
        requiredCredits: rule.requiredCredits || 0,
      }
    }
    onProfileChange?.({ academicPrograms: nextPrograms })
  }

  return <section className="academicProgramSettings">
    <div className="academicSettingsHeader">
      <div>
        <h3>彈性學制設定</h3>
        <p>在這裡設定輔系、輔修、第二主修與雙主修。畢業規則仍會依你的入學年度分流。</p>
      </div>
      <span>{profile?.department || '未綁定系所'}｜{profile?.admissionYear || profile?.entryYear || '未設定入學年'}</span>
    </div>
    <div className="academicSettingsGrid">
      {PROGRAM_TYPES.map((programType) => {
        const rules = availableRules(programType.key)
        const current = selectedProgram(profile, programType.key)
        return <label key={programType.key} className="academicSettingField">
          <span>{programType.label}</span>
          <select value={current?.ruleId || ''} onChange={(event) => updateProgram(programType.key, event.target.value)}>
            <option value="">未設定</option>
            {rules.map((rule) => <option key={rule.id} value={rule.id}>{ruleLabel(rule)}</option>)}
          </select>
          <small>{programSummary(current)}</small>
        </label>
      })}
    </div>
    <p className="academicSettingsNote">停修與被當不會計入有效學分；這兩種紀錄仍允許同一門課再次加入暫存區與課表。</p>
  </section>
}

export default function CreditsPage({ children, profile, onProfileChange }) {
  return <section className="pageCard simpleCreditsPage">
    <h2>畢業學分</h2>
    <AcademicProgramSettings profile={profile} onProfileChange={onProfileChange} />
    {children}
  </section>
}
