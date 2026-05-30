export default function LoginPage({ authMode, setAuthMode, loginForm, setLoginForm, studentIdPreview, authError, handleLogin }) {
  return (
    <main className="login">
      <form onSubmit={handleLogin}>
        <h1>UniPlan</h1>
        <p>淡江四年排課助手</p>
        <div className="authSwitch">
          <button type="button" className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>登入</button>
          <button type="button" className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>註冊</button>
        </div>
        {authMode === 'register' && <input placeholder="顯示名稱" value={loginForm.displayName} onChange={(e) => setLoginForm({ ...loginForm, displayName: e.target.value })} />}
        <input placeholder="學號" value={loginForm.studentId} onChange={(e) => setLoginForm({ ...loginForm, studentId: e.target.value.replace(/\D/g, '').slice(0, 9) })} />
        <input placeholder="密碼" type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
        {authMode === 'register' && studentIdPreview && <p className={`studentIdHint ${studentIdPreview.valid ? 'ok' : 'bad'}`}>{studentIdPreview.valid ? '✓ 已辨識學生資料' : `⚠ ${studentIdPreview.reason || '學號格式異常'}`}</p>}
        {authError && <p className="authError">{authError}</p>}
        <button>{authMode === 'register' ? '建立帳號' : '登入'}</button>
        <small>本機測試帳號，正式版可再接入登入系統。</small>
      </form>
    </main>
  )
}
