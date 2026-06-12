import { useEffect, useMemo, useState } from 'react'
import { readStorageJson } from '../../utils/storage'
import { PROGRAMS } from '../../data/programs/programData'
import { GRADUATION_RULE_PREVIEW } from '../../data/graduation/graduationRulesPreview'
import { importOfficialCourses, importPatchedCourses } from '../../api'

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

const COURSE_IMPORT_COLUMNS = [
  ['semester_source', '學期'],
  ['serial', '開課序號'],
  ['code', '課號'],
  ['name', '課程名稱'],
  ['credits', '學分'],
  ['category', '必選修'],
  ['teacher', '教師'],
  ['time_info', '時間'],
  ['classroom', '教室'],
  ['department', '開課系所'],
  ['grade', '年級'],
  ['class_name', '班級'],
]

function normalizeImportSemester(value, fallback = '') {
  const normalized = normalizeSemesterCode(value)
  const safeFallback = String(fallback || '').trim().toUpperCase().replace(/\s+/g, '')
  return normalized || safeFallback
}
function displayImportSemester(value) {
  return String(value || '').toUpperCase().replace(/\s+/g, '')
}

function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]
    const next = text[i + 1]
    if (ch === '"' && quoted && next === '"') {
      cell += '"'
      i += 1
    } else if (ch === '"') {
      quoted = !quoted
    } else if (ch === ',' && !quoted) {
      row.push(cell)
      cell = ''
    } else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && next === '\n') i += 1
      row.push(cell)
      if (row.some((value) => String(value || '').trim())) rows.push(row)
      row = []
      cell = ''
    } else {
      cell += ch
    }
  }
  row.push(cell)
  if (row.some((value) => String(value || '').trim())) rows.push(row)
  if (rows.length < 2) return []
  const headers = rows[0].map((header) => String(header || '').trim())
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ''])))
}


function decodeHtmlText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function stripTeacherCode(value) {
  return decodeHtmlText(value).replace(/\s*[（(]\d{3}\*{3}[）)]\s*/g, '').trim()
}

function extractRoomFromTimeInfo(value) {
  const text = decodeHtmlText(value)
  const parts = text.split(/[,，；;]+/).map((item) => item.trim()).filter(Boolean)
  const rooms = []
  parts.forEach((part) => {
    const slashParts = part.split('/').map((item) => item.trim()).filter(Boolean)
    if (slashParts.length >= 3) rooms.push(slashParts.slice(2).join(' / '))
  })
  return [...new Set(rooms)].join('；')
}

function normalizeSemesterCode(value) {
  const raw = String(value || '').trim().toUpperCase().replace(/\s+/g, '')
  if (!raw) return ''
  if (/^\d{3}[12]CLASS$/.test(raw)) return raw
  const compact = raw.replace(/學年度|學年|第|學期/g, '')
  const yearMatch = compact.match(/(\d{3})/)
  if (!yearMatch) return raw
  const year = yearMatch[1]
  if (/下|第二|2/.test(compact)) return `${year}2CLASS`
  if (/上|第一|1/.test(compact)) return `${year}1CLASS`
  return raw
}

function parseHtmlCourseImport(text, fileName, semester) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(String(text || ''), 'text/html')
  const titleText = decodeHtmlText(doc.body?.innerText || '')
  const inferredSemester = normalizeSemesterCode(titleText) || normalizeImportSemester(semester)
  const rows = []
  let currentDepartment = ''

  doc.querySelectorAll('tr').forEach((tr) => {
    const cells = Array.from(tr.querySelectorAll('td,th')).map((cell) => decodeHtmlText(cell.textContent))
    if (!cells.length) return

    const joined = cells.join(' ')
    const deptMatch = joined.match(/系別\(Department\)：\s*([^\s]+)\s*(.*)/i)
    if (deptMatch) {
      currentDepartment = decodeHtmlText(`${deptMatch[1]} ${deptMatch[2] || ''}`)
      return
    }

    const serial = cells[1]
    const name = cells[10]
    if (!/^\d{3,5}$/.test(String(serial || '').trim()) || !name || /科目|名稱|Courses/i.test(name)) return

    const timeInfo = cells.slice(13).filter(Boolean).join('；')
    rows.push({
      semester_source: normalizeImportSemester(semester || inferredSemester),
      grade: cells[0] || '',
      serial: cells[1] || '',
      code: cells[2] || '',
      sem_seq: cells[4] || '',
      class_name: cells[5] || '',
      group_type: cells[6] || '',
      category: cells[7] || '',
      credits: cells[8] || '',
      major: cells[9] || '',
      name: cells[10] || '',
      capacity: cells[11] || '',
      teacher: stripTeacherCode(cells[12] || ''),
      time_info: timeInfo,
      classroom: extractRoomFromTimeInfo(timeInfo),
      department: currentDepartment,
      notes: '',
      raw_json: { source_file: fileName, cells },
    })
  })

  return rows
}

function normalizeImportCourse(row, semester) {
  const pick = (...keys) => keys.map((key) => row[key]).find((value) => value !== undefined && value !== null && String(value).trim() !== '') || ''
  return {
    semester_source: normalizeImportSemester(pick('semester_source', 'semester', '學期') || semester),
    serial: String(pick('serial', '開課序號')).trim(),
    code: String(pick('code', 'course_code', '課號')).trim(),
    name: String(pick('name', 'course_name', '課程名稱', '科目名稱')).trim(),
    credits: String(pick('credits', 'credit', '學分')).trim(),
    category: String(pick('category', 'required_type', '必選修')).trim(),
    teacher: String(pick('teacher', 'instructor', '教師')).trim(),
    time_info: String(pick('time_info', 'time', '時間')).trim(),
    classroom: String(pick('classroom', 'room', '教室')).trim(),
    department: String(pick('department', '開課系所', '系所')).trim(),
    grade: String(pick('grade', '年級')).trim(),
    class_name: String(pick('class_name', 'className', '班級')).trim(),
    major: String(pick('major', '班別')).trim(),
    notes: String(pick('notes', '備註')).trim(),
    raw_json: row,
  }
}

function parseCourseImportText(text, fileName, semester) {
  const trimmed = String(text || '').trim()
  if (!trimmed) return []
  if (/\.html?$/i.test(fileName) || /<\s*html|<\s*table|系別\(Department\)/i.test(trimmed)) {
    return parseHtmlCourseImport(trimmed, fileName, semester)
  }
  let rows = []
  if (/\.json$/i.test(fileName) || trimmed.startsWith('{') || trimmed.startsWith('[')) {
    const payload = JSON.parse(trimmed)
    rows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []
  } else {
    rows = parseCsv(trimmed)
  }
  return rows.map((row) => normalizeImportCourse(row, semester))
}

function validateImportCourses(courses) {
  const errors = []
  courses.forEach((course, index) => {
    if (!course.semester_source) errors.push(`第 ${index + 1} 筆缺少學期`)
    if (!course.name) errors.push(`第 ${index + 1} 筆缺少課程名稱`)
  })
  return errors.slice(0, 20)
}

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
  const [importSemester, setImportSemester] = useState('1142CLASS')
  const [importFileName, setImportFileName] = useState('')
  const [importRows, setImportRows] = useState([])
  const [importErrors, setImportErrors] = useState([])
  const [importBusy, setImportBusy] = useState(false)
  const [patchImportBusy, setPatchImportBusy] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [clearSemesterBeforeImport, setClearSemesterBeforeImport] = useState(false)

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


  async function handleCourseImportFile(event) {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    setImportFileName(files.length === 1 ? files[0].name : `${files.length} 個 HTML 檔案`)
    setImportResult(null)
    try {
      const parsedGroups = []
      for (const file of files) {
        const text = await file.text()
        parsedGroups.push(...parseCourseImportText(text, file.name, importSemester))
      }
      const normalizedRows = parsedGroups.map((row) => ({ ...row, semester_source: normalizeImportSemester(row.semester_source || importSemester) }))
      const errors = validateImportCourses(normalizedRows)
      setImportRows(normalizedRows)
      setImportErrors(errors)
      notify?.(`已讀取 ${files.length} 個檔案，共 ${normalizedRows.length} 筆課程資料`)
    } catch (error) {
      setImportRows([])
      setImportErrors([error?.message || '檔案解析失敗'])
      notify?.('課程檔案解析失敗')
    } finally {
      event.target.value = ''
    }
  }

  async function confirmCourseImport() {
    if (!importRows.length) {
      notify?.('請先選擇課程檔案')
      return
    }
    const errors = validateImportCourses(importRows)
    setImportErrors(errors)
    if (errors.length) {
      notify?.('仍有必要欄位缺漏，請修正後再匯入')
      return
    }
    setImportBusy(true)
    setImportResult(null)
    try {
      const result = await importOfficialCourses({
        semester: importSemester,
        courses: importRows,
        clearSemester: clearSemesterBeforeImport,
      })
      setImportResult(result)
      notify?.(`匯入完成：${result.imported || 0} 筆`)
    } catch (error) {
      const message = error?.response?.data?.error || error?.message || '匯入失敗'
      setImportResult({ ok: false, error: message })
      notify?.(message)
    } finally {
      setImportBusy(false)
    }
  }


  const COMPLETE_FRONTEND_PATCH = {
    key: 'complete',
    label: '完整前端補丁',
    description: '一次執行目前版本內建的完整資料補丁；後續新增修正也統一接到這個入口。',
    payload: () => ({
      action: 'complete',
      completePatch: true,
      repairAcademicYear114: true,
      includeCollegeRequiredRules: true,
    }),
    done: (result) => `完整補丁已送出：匯入 ${result.imported || 0} 筆${result.repairedWrongSemester ? `，清除/修復錯置 ${result.repairedWrongSemester} 筆` : ''}${result.embeddedStaticCount === 0 ? '；未讀到靜態課表，已採安全補丁模式' : ''}`,
  }

  async function runCompleteFrontendPatch() {
    setPatchImportBusy(true)
    setImportResult(null)
    try {
      const result = await importPatchedCourses(COMPLETE_FRONTEND_PATCH.payload())
      setImportResult({ ...result, patchAction: COMPLETE_FRONTEND_PATCH.label })
      notify?.(COMPLETE_FRONTEND_PATCH.done(result))
    } catch (error) {
      const message = error?.response?.data?.error || error?.response?.data?.message || error?.message || `${COMPLETE_FRONTEND_PATCH.label} 執行失敗`
      setImportResult({ ok: false, error: message, patchAction: COMPLETE_FRONTEND_PATCH.label })
      notify?.(message)
    } finally {
      setPatchImportBusy(false)
    }
  }



  return (
    <section className="pageCard adminConsolePage">
      <div className="pageHead"><div><h2>管理後台</h2><p className="muted">統計、意見回報與帳號管理。</p></div></div>
      <div className="adminConsoleLayout">
        <aside className="adminTabs">
          <button className={activeTab === 'feedback' ? 'active' : ''} onClick={() => setActiveTab('feedback')}>意見回報</button>
          <button className={activeTab === 'accounts' ? 'active' : ''} onClick={() => setActiveTab('accounts')}>帳號管理</button>
          <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>資料中心</button>
          <button className={activeTab === 'courseImport' ? 'active' : ''} onClick={() => setActiveTab('courseImport')}>課程匯入</button>
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

          {activeTab === 'courseImport' && <section className="adminSection adminImportSection">
            <div className="adminImportHead">
              <div>
                <h3>課程匯入</h3>
                <p className="muted">上傳教務處 HTML 課程表，預覽資料後寫入後端 Neon courses；也可將目前內建缺失課程補丁直接寫入後端。學期欄可自由輸入新代碼，例如 1151CLASS。</p>
              </div>
              <div className="adminImportControls">
                <label>目標學期
                  <input
                    list="semesterImportPresets"
                    value={importSemester}
                    onChange={(event) => setImportSemester(displayImportSemester(event.target.value))}
                    placeholder="例如 1151CLASS"
                  />
                  <datalist id="semesterImportPresets">
                    <option value="1141CLASS">114 學年度上學期</option>
                    <option value="1142CLASS">114 學年度下學期</option>
                    <option value="1151CLASS">115 學年度上學期</option>
                    <option value="1152CLASS">115 學年度下學期</option>
                  </datalist>
                </label>
                <label className="adminImportCheckbox"><input type="checkbox" checked={clearSemesterBeforeImport} onChange={(event) => setClearSemesterBeforeImport(event.target.checked)} /> 匯入前清空此學期</label>
              </div>
            </div>
            <div className="adminImportDropzone">
              <input type="file" accept=".htm,.html,.csv,.json,text/html,application/json,text/csv" multiple webkitdirectory="" onChange={handleCourseImportFile} />
              <b>{importFileName || '選擇或拖曳 HTML 課程檔案 / 資料夾'}</b>
              <span>主要支援教務處 HTML 離線課程表，也保留 CSV / JSON 匯入。</span>
            </div>
            <div className="adminImportSummary">
              <article><b>{importRows.length}</b><span>預覽筆數</span></article>
              <article><b>{importErrors.length}</b><span>錯誤</span></article>
              <article><b>{importRows.filter((row) => row.semester_source === normalizeImportSemester(importSemester)).length}</b><span>目標學期</span></article>
              <article><b>{[...new Set(importRows.map((row) => row.semester_source).filter(Boolean))].length}</b><span>學期數</span></article>
            </div>
            {importErrors.length ? <div className="adminImportErrors"><b>匯入前檢查</b>{importErrors.map((message) => <p key={message}>{message}</p>)}</div> : null}
            {importRows.length ? <div className="adminImportPreview"><table><thead><tr>{COURSE_IMPORT_COLUMNS.slice(1, 9).map(([key, label]) => <th key={key}>{label}</th>)}</tr></thead><tbody>{importRows.slice(0, 8).map((row, index) => <tr key={`${row.serial}-${row.name}-${index}`}>{COURSE_IMPORT_COLUMNS.slice(1, 9).map(([key]) => <td key={key}>{row[key] || '—'}</td>)}</tr>)}</tbody></table></div> : <p className="muted">尚未選擇匯入檔案。</p>}
            <div className="adminImportActions">
              <button disabled={!importRows.length || importBusy || importErrors.length > 0} onClick={confirmCourseImport}>{importBusy ? '匯入中…' : '確認匯入 Neon'}</button>
              <div className="adminPatchUnifiedControl singlePatchControl">
                <div><b>完整前端補丁</b><p>{COMPLETE_FRONTEND_PATCH.description}</p></div>
                <button type="button" disabled={patchImportBusy} onClick={runCompleteFrontendPatch}>{patchImportBusy ? '執行中…' : '執行完整補丁'}</button>
              </div>
              <button type="button" onClick={() => { setImportRows([]); setImportErrors([]); setImportFileName(''); setImportResult(null) }}>清除預覽</button>
            </div>
            {importResult && <div className={importResult.ok === false ? 'adminImportResult error' : 'adminImportResult'}>
              {importResult.ok === false ? <p>{importResult.error}</p> : <p>已匯入 / 更新 {importResult.imported || 0} 筆。{importResult.failed ? `失敗 ${importResult.failed} 筆。` : ''}{importResult.repairedWrongSemester ? `已清除錯置 ${importResult.repairedWrongSemester} 筆。` : ''}{importResult.bySemester ? ` 學期分布：${Object.entries(importResult.bySemester).map(([term, count]) => `${term} ${count}`).join('、')}` : ''}</p>}
            </div>}
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
