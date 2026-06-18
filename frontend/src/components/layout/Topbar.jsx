const PAGE_TITLES = {
  planner: '我的規劃',
  search: '課程搜尋',
  credits: '學分進度',
  programs: '學程進度',
  flexiblePrograms: '彈性學制',
  adminPrograms: '學程資料',
  admin: '管理模式',
  feedback: '意見箱',
}

export default function Topbar({ activeMenu, onOpenSettings, onLogout, user }) {
  return (
    <header className="topbar">
      <div>
        <h1>{PAGE_TITLES[activeMenu] || '管理模式'}</h1>
      </div>
      <div className="topActions">
        <button onClick={onOpenSettings}>外觀</button>
        <button onClick={onLogout}>{user?.publicAlpha ? '回登入' : '登出'}</button>
      </div>
    </header>
  )
}
