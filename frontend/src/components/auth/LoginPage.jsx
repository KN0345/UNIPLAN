export default function LoginPage({
  authMode,
  setAuthMode,
  loginForm,
  setLoginForm,
  studentIdPreview,
  authError,
  handleLogin,
  handleGuestLogin,
}) {
  const isRegister = authMode === 'register'
  const isForgot = authMode === 'forgot'

  function updateField(key, value) {
    setLoginForm({ ...loginForm, [key]: value })
  }

  return (
    <main className="login authPage">
      <section className="authHero">
        <div className="authBrandMark">UniPlan</div>
        <h1>淡江四年排課助手</h1>
        <p>登入後可同步個人課表、暫存課程、收藏與主題設定。若雲端暫時無法連線，系統仍會保留本機備援。</p>
        <div className="authFeatureGrid">
          <span>雲端註冊</span>
          <span>課表同步</span>
          <span>忘記密碼</span>
        </div>
      </section>

      <form className="authCard" onSubmit={handleLogin}>
        <h2>{isForgot ? '重設密碼' : isRegister ? '建立 UniPlan 帳號' : '登入 UniPlan'}</h2>
        <p>{isForgot ? '輸入學號與註冊 Email 後即可重設本機密碼。' : '登入後會載入此帳號綁定的課表、收藏與設定。'}</p>

        <div className="authSwitch">
          <button type="button" className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>登入</button>
          <button type="button" className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>註冊</button>
          <button type="button" className={authMode === 'forgot' ? 'active' : ''} onClick={() => setAuthMode('forgot')}>忘記密碼</button>
        </div>

        {isRegister && (
          <label className="authField">
            <span>顯示名稱</span>
            <input placeholder="例如：本機使用者" value={loginForm.displayName} onChange={(e) => updateField('displayName', e.target.value)} />
          </label>
        )}

        <label className="authField">
          <span>學號</span>
          <input placeholder="9 碼學號" value={loginForm.studentId} onChange={(e) => updateField('studentId', e.target.value.replace(/\D/g, '').slice(0, 9))} />
        </label>

        {(isRegister || isForgot) && (
          <label className="authField">
            <span>Email</span>
            <input placeholder="用於本機忘記密碼驗證" type="email" value={loginForm.email} onChange={(e) => updateField('email', e.target.value)} />
          </label>
        )}

        {!isForgot && (
          <label className="authField">
            <span>密碼</span>
            <input placeholder="至少 6 碼" type="password" value={loginForm.password} onChange={(e) => updateField('password', e.target.value)} />
          </label>
        )}

        {isForgot && (
          <label className="authField">
            <span>新密碼</span>
            <input placeholder="至少 6 碼" type="password" value={loginForm.newPassword} onChange={(e) => updateField('newPassword', e.target.value)} />
          </label>
        )}

        {(isRegister || isForgot) && studentIdPreview && (
          <p className={`studentIdHint ${studentIdPreview.valid ? 'ok' : 'bad'}`}>
            {studentIdPreview.valid ? `✓ ${studentIdPreview.department_name || '已辨識學生資料'}｜${studentIdPreview.start_grade || '大一'}` : `⚠ ${studentIdPreview.reason || '學號格式異常'}`}
          </p>
        )}

        {authError && <p className="authError">{authError}</p>}

        <button className="authSubmit" type="submit">{isForgot ? '重設密碼' : isRegister ? '建立帳號並登入' : '登入'}</button>
        <button className="authGuest" type="button" onClick={handleGuestLogin}>先以訪客模式使用</button>

        <small>目前為雲端帳號第一階段：資料會同步至資料庫，並保留本機備援。</small>
      </form>
    </main>
  )
}
