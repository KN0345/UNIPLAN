import { isSuperAdminUser } from '../../utils/account'

const MAIN_MENU = [
  ['planner', '我的規劃'],
  ['search', '課程搜尋'],
  ['credits', '學分進度'],
  ['programs', '學程進度'],
  ['snapshots', '我的方案'],
  ['feedback', '意見箱'],
]

export function StudentInfoDock({ user, accountProfile }) {
  return (
    <div className="sideUser studentInfoDock">
      <span>學生資料</span>
      <strong>{accountProfile.displayName || user.studentId || 'guest'}</strong>
      <small>{user.offline ? '本機模式' : `學號：${user.studentId || 'guest'}`}</small>
      <small>{accountProfile.department || (isSuperAdminUser(user) ? '管理者' : '系所待確認')}</small>
    </div>
  )
}

export default function SideNav({ user, accountProfile, activeMenu, setActiveMenu }) {
  return (
    <aside className="sideNav">
      <div className="brand"><b>UniPlan</b><span>四年排課助手</span></div>
      <nav className="mainMenu">
        {MAIN_MENU.map(([key, label]) => (
          <button key={key} className={activeMenu === key ? 'active' : ''} onClick={() => setActiveMenu(key)}>{label}</button>
        ))}
        {isSuperAdminUser(user) && <button className={activeMenu === 'admin' ? 'active' : ''} onClick={() => setActiveMenu('admin')}>管理模式</button>}
      </nav>
      <StudentInfoDock user={user} accountProfile={accountProfile} />
    </aside>
  )
}
