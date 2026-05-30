import { useEffect, useMemo, useState } from 'react'
import { readStorageJson } from '../../utils/storage'
import { PROGRAMS } from '../../data/programs/programData'
import { GRADUATION_RULE_PREVIEW } from '../../data/graduation/graduationRulesPreview'

function getCourse(course) {
  return course?.course || course || {}
}
function credits(course) {
  const c = getCourse(course)
  const raw = c.credits ?? c.credit ?? c.units ?? 0
  const match = String(raw).match(/\d+(\.\d+)?/)
  return Number(match ? match[0] : raw) || 0
}
function effectiveCourses(plan = {}) {
  return Object.values(plan || {}).flatMap((courses) => Array.isArray(courses) ? courses : [])
}
function normalizeText(value) {
  return String(value || '').replace(/[（）()\s:：／/\-—_]/g, '').toLowerCase()
}
function normalizeAdminCourse(course, index = 0) {
  const c = getCourse(course)
  const time = c.time_info || c.time || c.period || ''
  return {
    id: String(c.id || c.uid || c.serial || c.code || `${c.name || 'course'}-${index}`),
    code: c.code || c.serial || c.course_id || '',
    name: c.name || c.course_name || '未命名課程',
    teacher: c.teacher || c.instructor || '',
    department: c.department || c.major || c.college || '',
    credits: credits(c),
    time,
    requiredType: c.required_type || c.requiredType || c.type || c.category || '',
    academicYear: c.academic_year || c.year || c.entryYear || c.school_year || '',
    status: c.status || 'active',
  }
}
function issueYearText(item = {}) {
  return item.academicYear || item.entryYear || item.year || item.code || '未標示學年'
}

function normalizeUsers(user, profile) {
  const currentStudentId = '414730209'
  return [{
    id: currentStudentId,
    name: profile?.displayName || 'KN',
    studentId: currentStudentId,
    role: 'admin',
    department: profile?.department || '教育科技學系',
    grade: profile?.grade || '',
    admissionYear: profile?.admissionYear || '',
    status: 'active',
    passwordMode: '本機/平台密碼',
    googleBound: Boolean(profile?.boundGoogle),
  }]
}
function flattenGroups(groups = [], parent = '') {
  return groups.flatMap((group) => {
    const path = parent ? `${parent} / ${group.name}` : group.name
    return [{ ...group, path }, ...flattenGroups(group.children || [], path)]
  })
}
const FEEDBACK_ACTIONS = [
  { label: '拒絕', value: '已拒絕' },
  { label: '通過', value: '已通過' },
  { label: '完成', value: '已處理' },
]

function DetailModal({ title, children, onClose }) {
  if (!title) return null
  return <div className="adminModalOverlay" onClick={onClose}>
    <section className="adminModal" onClick={(event) => event.stopPropagation()}>
      <header><h3>{title}</h3><button onClick={onClose}>×</button></header>
      <div className="adminModalBody">{children}</div>
    </section>
  </div>
}

export default function AdminDataConsole({ notify, courses = [], user, profile, plan = {}, candidates = [], favorites = [] }) {
  const [activeTab, setActiveTab] = useState('feedback')
  const [adminUsers, setAdminUsers] = useState(() => normalizeUsers(user, profile))
  const [feedbackItems, setFeedbackItems] = useState(() => readStorageJson('uniplan:feedbackItems', []))
  const [modal, setModal] = useState(null)

  useEffect(() => {
    setAdminUsers(normalizeUsers(user, profile))
  }, [user?.studentId, profile?.displayName, profile?.department, profile?.grade, profile?.admissionYear, profile?.boundGoogle])
  useEffect(() => { localStorage.setItem('uniplan:adminUsers', JSON.stringify(adminUsers)) }, [adminUsers])
  useEffect(() => { localStorage.setItem('uniplan:feedbackItems', JSON.stringify(feedbackItems)) }, [feedbackItems])

  const adminCourses = useMemo(() => {
    const base = courses.length ? courses : [...effectiveCourses(plan), ...candidates, ...favorites]
    const seen = new Set()
    return base.map((course, index) => normalizeAdminCourse(course, index)).filter((course) => {
      const key = course.id || `${course.name}-${course.teacher}-${course.time}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [courses, plan, candidates, favorites])

  const courseMissingIssues = useMemo(() => adminCourses.flatMap((course) => {
    const issues = []
    if (!course.name || course.name === '未命名課程') issues.push('缺課名')
    if (!course.credits) issues.push('缺學分')
    if (!course.time) issues.push('缺時間')
    if (!course.department) issues.push('缺系所')
    if (!course.requiredType) issues.push('缺必/選修')
    return issues.length ? [{ type: '課程資料缺失', id: course.id, name: course.name || '未命名課程', code: course.code || '無課號', academicYear: course.academicYear || '未標示學年', teacher: course.teacher || '', issues: [`缺失學年：${course.academicYear || '未標示學年'}`, ...issues] }] : []
  }), [adminCourses])

  const duplicateCodeIssues = useMemo(() => {
    const map = new Map()
    adminCourses.forEach((course) => {
      if (!course.code) return
      if (!map.has(course.code)) map.set(course.code, [])
      map.get(course.code).push(course)
    })
    return Array.from(map.entries()).flatMap(([code, list]) => {
      if (list.length <= 1) return []
      const uniqueNames = [...new Set(list.map((item) => normalizeText(item.name)).filter(Boolean))]
      if (uniqueNames.length <= 1) return []
      return [{ type: '重複課號異常', code, name: list.map((item) => item.name).join(' / '), academicYear: list.find((item) => item.academicYear)?.academicYear || '未標示學年', issues: [`缺失學年：${list.find((item) => item.academicYear)?.academicYear || '未標示學年'}`, `同一課號對應 ${uniqueNames.length} 個不同課名`], items: list }]
    })
  }, [adminCourses])

  const programRuleIssues = useMemo(() => PROGRAMS.flatMap((program) => {
    const issues = []
    if (program.status && program.status !== 'ACTIVE') issues.push('學程規則尚未完整')
    const flat = flattenGroups(program.groups || [])
    if (!flat.length) issues.push('缺課程群組')
    flat.forEach((group) => {
      if (!(group.rules || []).length && !(group.children || []).length) issues.push(`${group.path} 缺規則`)
      if (!(group.courses || []).length && !(group.children || []).length) issues.push(`${group.path} 缺課程`)
    })
    return issues.length ? [{ type: '學程規則缺失', code: program.code, name: String(program.name || '').replace(/^淡江大學/, ''), academicYear: program.academicYear || program.year || '未標示學年', issues: [`缺失學年：${program.academicYear || program.year || '未標示學年'}`, ...new Set(issues)].slice(0, 13) }] : []
  }), [])

  const graduationIssues = useMemo(() => {
    const knownDepts = [...new Set(adminCourses.map((course) => course.department).filter(Boolean).map((value) => String(value).replace(/學系|系/g, '')))].slice(0, 80)
    const ruleKeys = new Set(GRADUATION_RULE_PREVIEW.map((rule) => `${rule.entryYear}:${normalizeText(rule.department)}`))
    const gaps = []
    knownDepts.forEach((dept) => {
      ;[113, 114, 115].forEach((year) => {
        if (!ruleKeys.has(`${year}:${normalizeText(dept)}`)) gaps.push({ type: '畢業規則缺失', code: `${year}`, name: `${dept}｜${year}`, academicYear: `${year}`, issues: [`缺失學年：${year}`, '尚未建立對應畢業規則'] })
      })
    })
    GRADUATION_RULE_PREVIEW.forEach((rule) => {
      const issues = []
      if (!rule.totalCredits) issues.push('缺總學分')
      if (!(rule.categories || []).length) issues.push('缺分類學分')
      if ((rule.categories || []).some((cat) => !cat.required)) issues.push('分類缺學分數')
      if (issues.length) gaps.push({ type: '畢業規則缺失', code: rule.entryYear, name: `${rule.department}｜${rule.entryYear}`, academicYear: rule.entryYear, issues: [`缺失學年：${rule.entryYear || '未標示學年'}`, ...issues] })
    })
    return gaps.slice(0, 200)
  }, [adminCourses])

  const allIssues = useMemo(() => [...courseMissingIssues, ...duplicateCodeIssues, ...programRuleIssues, ...graduationIssues], [courseMissingIssues, duplicateCodeIssues, programRuleIssues, graduationIssues])
  const issueGroups = useMemo(() => {
    return allIssues.reduce((acc, item) => {
      acc[item.type] = acc[item.type] || []
      acc[item.type].push(item)
      return acc
    }, {})
  }, [allIssues])

  const feedbackStats = useMemo(() => {
    const stats = { total: feedbackItems.length }
    feedbackItems.forEach((item) => { stats[item.type] = (stats[item.type] || 0) + 1; stats[item.status || '待處理'] = (stats[item.status || '待處理'] || 0) + 1 })
    return stats
  }, [feedbackItems])

  function updateUser(id, patch) {
    setAdminUsers((prev) => prev.map((item) => item.id === id ? { ...item, ...patch, role: patch.role === 'student' ? 'student' : 'admin' } : item))
    notify?.('帳號資料已更新')
  }
  function updateFeedbackStatus(id, status) {
    if (status === '已拒絕' || status === '已處理') {
      setFeedbackItems((prev) => prev.filter((item) => item.id !== id))
      setModal(null)
      notify?.(`意見已${status === '已拒絕' ? '拒絕' : '處理'}並移除`)
      return
    }
    setFeedbackItems((prev) => prev.map((item) => item.id === id ? { ...item, status } : item))
    notify?.('意見狀態已更新')
  }

  return (
    <section className="pageCard adminConsolePage">
      <div className="pageHead"><div><h2>管理後台</h2><p className="muted">統計、意見回報與帳號管理。</p></div></div>
      <div className="adminConsoleLayout">
        <aside className="adminTabs">
          <button className={activeTab === 'feedback' ? 'active' : ''} onClick={() => setActiveTab('feedback')}>意見回報</button>
          <button className={activeTab === 'accounts' ? 'active' : ''} onClick={() => setActiveTab('accounts')}>帳號管理</button>
          <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>資料中心</button>
        </aside>
        <div className="adminConsoleContent">
          {activeTab === 'feedback' && <section className="adminSection">
            <div className="adminStatCards">
              <article><b>{feedbackStats.total || 0}</b><span>全部意見</span></article>
              <article><b>{feedbackStats['待處理'] || 0}</b><span>待處理</span></article>
              <article><b>{feedbackStats['課程/學程資料問題'] || 0}</b><span>資料問題</span></article>
              <article><b>{feedbackStats['顯示問題'] || 0}</b><span>顯示問題</span></article>
            </div>
            <div className="adminCardList">
              {feedbackItems.length ? feedbackItems.map((item) => <article className="adminFeedbackCard" key={item.id}>
                <button className="adminCardHeader" onClick={() => setModal({ type: 'feedback', item })}><span><b>{item.title || item.type}</b><small>{item.type}｜{item.status || '待處理'}｜{item.createdAt}</small></span><em>查看</em></button>
              </article>) : <p className="muted">目前沒有意見回報。</p>}
            </div>
          </section>}

          {activeTab === 'accounts' && <section className="adminSection">
            <div className="adminStatCards"><article><b>{adminUsers.length}</b><span>帳號</span></article><article><b>1</b><span>管理員</span></article><article><b>0</b><span>學生</span></article></div>
            <div className="accountCards">{adminUsers.map((item) => <article className="accountAdminCard" key={item.id}>
              <button className="adminCardHeader" onClick={() => setModal({ type: 'account', item })}><span><b>{item.name}</b><small>{item.studentId}｜{item.role === 'admin' ? '管理員' : '學生'}｜{item.status === 'active' ? '啟用' : '停用'}</small></span><em>管理</em></button>
            </article>)}</div>
          </section>}

          {activeTab === 'stats' && <section className="adminSection adminStatsDashboard">
            <div className="adminDashboardOverview">
              <article><b>{adminCourses.length}</b><span>課程資料</span></article>
              <article><b>{PROGRAMS.length}</b><span>學程資料</span></article>
              <article><b>{adminUsers.length}</b><span>帳號</span></article>
              <article><b>{feedbackStats['待處理'] || 0}</b><span>待處理意見</span></article>
            </div>
            <div className="adminDashboardColumns adminIssueOnlyColumns">
              <div className="adminCompactPanel adminIssueCenterPanel">
                <h3>異常中心</h3>
                <p className="muted adminIssueIntro">所有缺失、重複、規則未完整的資料集中在這裡。點開後可查看學年、課程/學程名稱與缺失欄位；資料找不到或尚未釋出的項目可先保留。</p>
                <div className="adminIssueBoard">
                  {Object.entries(issueGroups).map(([type, list]) => <button key={type} className="adminIssueTile" onClick={() => setModal({ type: 'issues', title: type, list })}>
                    <b>{list.length}</b><span>{type}</span><small>{list[0]?.academicYear ? `含 ${list[0].academicYear} 等學年` : '查看詳細資料'}</small>
                  </button>)}
                  {!allIssues.length && <p className="muted">目前沒有明顯缺失。</p>}
                </div>
              </div>
            </div>
          </section>}
        </div>
      </div>

      {modal?.type === 'feedback' && <DetailModal title="意見內容" onClose={() => setModal(null)}>
        <p><b>{modal.item.title || modal.item.type}</b></p>
        <p className="muted">{modal.item.type}｜{modal.item.status || '待處理'}｜{modal.item.createdAt}</p>
        <p>{modal.item.detail || '無完整說明'}</p>
        <div className="statusActionRow">{FEEDBACK_ACTIONS.map((action) => <button key={action.value} onClick={() => updateFeedbackStatus(modal.item.id, action.value)}>{action.label}</button>)}</div>
      </DetailModal>}

      {modal?.type === 'account' && <DetailModal title="帳號管理" onClose={() => setModal(null)}>
        <div className="accountFields modalAccountFields">
          <label>權限<select value={modal.item.role} onChange={(e) => updateUser(modal.item.id, { role: e.target.value })}><option value="admin">管理員</option><option value="student">學生</option></select></label>
          <label>狀態<select value={modal.item.status} onChange={(e) => updateUser(modal.item.id, { status: e.target.value })}><option value="active">啟用</option><option value="disabled">停用</option></select></label>
          <label>平台密碼<input value={modal.item.passwordMode || '本機/平台密碼'} onChange={(e) => updateUser(modal.item.id, { passwordMode: e.target.value })} /></label>
          <label>Google綁定<select value={modal.item.googleBound ? 'bound' : 'none'} onChange={(e) => updateUser(modal.item.id, { googleBound: e.target.value === 'bound' })}><option value="none">未綁定</option><option value="bound">已綁定</option></select></label>
          <label>學號<input value={modal.item.studentId} readOnly /></label>
          <label>系所<input value={modal.item.department || ''} onChange={(e) => updateUser(modal.item.id, { department: e.target.value })} /></label>
          <label>年級<input value={modal.item.grade || ''} onChange={(e) => updateUser(modal.item.id, { grade: e.target.value })} /></label>
          <label>學年度<input value={modal.item.admissionYear || ''} onChange={(e) => updateUser(modal.item.id, { admissionYear: e.target.value })} /></label>
        </div>
      </DetailModal>}

      {modal?.type === 'issues' && <DetailModal title={modal.title} onClose={() => setModal(null)}>
        <div className="issueDetailList">{modal.list.map((item, index) => <article key={`${item.type}-${item.code}-${index}`}>
          <b>{item.name}</b><small>{item.code || '無代碼'}｜{issueYearText(item)}</small>
          <ul>{(item.issues || []).map((issue) => <li key={issue}>{issue}</li>)}</ul>
          {item.items?.length ? <div className="issueSubList">{item.items.map((course) => <p key={course.id}>{course.code}｜{course.name}｜{course.teacher || '未列教師'}</p>)}</div> : null}
        </article>)}</div>
      </DetailModal>}
    </section>
  )
}
