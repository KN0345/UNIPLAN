import { PROGRAMS, programStatusLabel } from '../../data/programs/programData'
import { programCompleteness } from '../../data/programs/programProgress'

function classifyIssue(issue = '') {
  if (/群組|課程清單|規則|索引|校對/.test(issue)) return '學程規則'
  if (/學分/.test(issue)) return '學分資料'
  if (/時間|時段/.test(issue)) return '時間資料'
  return '基本資料'
}

export default function AdminProgramsPage() {
  const rows = PROGRAMS.map((program) => ({ program, meta: programCompleteness(program) }))
  const issueRows = rows.flatMap(({ program, meta }) => meta.issues.map((issue) => ({ program, issue, type: classifyIssue(issue) })))
  const issueTypes = issueRows.reduce((acc, row) => ({ ...acc, [row.type]: (acc[row.type] || 0) + 1 }), {})
  return <section className="pageCard adminProgramPage simpleAdminProgramPage"><div className="pageHead"><div><h2>學程資料</h2><p className="muted">統計與缺失提醒。</p></div><strong>{rows.length} 筆</strong></div>
    <div className="adminProgramSummary"><article><b>{rows.filter((r) => r.program.status === 'ACTIVE').length}</b><span>已建規則</span></article><article><b>{rows.filter((r) => r.program.status === 'PARTIAL').length}</b><span>部分規則</span></article><article><b>{rows.filter((r) => r.program.status === 'NEEDS_RULES').length}</b><span>待補規則</span></article><article><b>{issueRows.length}</b><span>缺失項目</span></article></div>
    <div className="adminIssueGrid">
      {['學程規則', '學分資料', '時間資料', '基本資料'].map((type) => <article key={type}><b>{issueTypes[type] || 0}</b><span>{type}</span></article>)}
    </div>
    <div className="adminTableWrap"><table className="adminTable compactAdminTable"><thead><tr><th>學程</th><th>狀態</th><th>資料量</th><th>缺失</th></tr></thead><tbody>{rows.map(({ program, meta }) => <tr key={program.id}><td><b>{program.name}</b></td><td>{programStatusLabel(program.status)}</td><td>{meta.totalGroups} 組 / {meta.courseCount} 課</td><td>{meta.issues.length ? meta.issues.join('、') : '完整'}</td></tr>)}</tbody></table></div>
  </section>
}
