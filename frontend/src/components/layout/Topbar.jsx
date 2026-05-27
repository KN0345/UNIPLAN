const PAGE_TITLES = {
  planner: '我的規劃',
  search: '課程搜尋',
  credits: '學分進度',
  snapshots: '我的方案',
  programs: '學程進度',
  adminPrograms: '學程資料',
  admin: '管理模式',
  feedback: '意見箱',
}

export default function Topbar({ activeMenu, onOpenSettings, onLogout, user }) {
  return (
    <header className="topbar">
      <div>
        <h1>{PAGE_TITLES[activeMenu] || '管理模式'}</h1>
        <p>Alpha 測試版，資料存在此裝置。</p>
      </div>
      <div className="topActions">
        <button onClick={onOpenSettings}>外觀</button>
        {!user?.offline && <button onClick={onLogout}>登出</button>}
      </div>
    </header>
  )
}
