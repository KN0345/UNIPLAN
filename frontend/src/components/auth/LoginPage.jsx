export default function LoginPage({
  authMode,
  setAuthMode,
  loginForm,
  setLoginForm,
  studentIdPreview,
  authError,
  authNotice,
  resetRequested,
  handleLogin,
  handleResendVerification,
  handleGuestLogin,
}) {
  const isRegister = authMode === 'register'
  const isForgot = authMode === 'forgot'
  const isLogin = authMode === 'login'
  const isVerify = authMode === 'verify'

  function updateField(key, value) {
    setLoginForm({ ...loginForm, [key]: value })
  }

  function switchMode(mode) {
    setAuthMode(mode)
    setLoginForm((prev) => ({ ...prev, password: '', newPassword: '', confirmPassword: '', resetCode: '', verificationCode: '' }))
  }

  return (
    <main className="login authPage authV3Page">
      <section className="authHero authV3Hero">
        <div className="authBrandMark">UniPlan</div>
        <h1>淡江四年排課助手</h1>
        <p>登入後同步課表、暫存課程、收藏、主題與帳號設定。這一版開始以雲端帳號為主，本機資料僅作為備援。</p>
        <div className="authFeatureGrid">
          <span>Neon 雲端同步</span>
          <span>課表自動載入</span>
          <span>安全重設密碼</span>
        </div>
      </section>

      <form className={`authCard authV3Card ${isRegister ? 'registerMode' : ''} ${isForgot ? 'forgotMode' : ''}`} onSubmit={handleLogin}>
        <div className="authV3Header">
          <span className="authV3Eyebrow">UniPlan Account</span>
          <h2>{isVerify ? 'Email 驗證' : isForgot ? '重設密碼' : isRegister ? '建立 UniPlan 帳號' : '登入 UniPlan'}</h2>
          <p>
            {isVerify
              ? '請輸入寄到信箱的 6 碼驗證碼。完成驗證後才能登入 UniPlan。'
              : isForgot
                ? (resetRequested ? '請輸入信箱收到的 6 碼驗證碼，並設定新密碼。' : '輸入學號與註冊 Email，系統會寄出一次性驗證碼。')
                : isRegister
                  ? '建立帳號後需先完成 Email 驗證，課表與設定才會綁定到此帳號。'
                  : '使用學號或 Email 登入，載入雲端課表與個人設定。'}
          </p>
        </div>

        {isLogin && (
          <>
            <label className="authField">
              <span>學號或 Email</span>
              <input
                placeholder="輸入學號或 Email"
                value={loginForm.studentId}
                onChange={(e) => updateField('studentId', e.target.value.trim())}
                autoComplete="username"
              />
            </label>
            <label className="authField">
              <span>密碼</span>
              <input
                placeholder="輸入密碼"
                type="password"
                value={loginForm.password}
                onChange={(e) => updateField('password', e.target.value)}
                autoComplete="current-password"
              />
            </label>
          </>
        )}

        {isRegister && (
          <>
            <label className="authField">
              <span>顯示名稱</span>
              <input placeholder="例如：KN" value={loginForm.displayName} onChange={(e) => updateField('displayName', e.target.value)} autoComplete="name" />
            </label>
            <label className="authField">
              <span>學號</span>
              <input placeholder="9 碼學號" value={loginForm.studentId} onChange={(e) => updateField('studentId', e.target.value.replace(/\D/g, '').slice(0, 9))} autoComplete="username" />
            </label>
            <label className="authField">
              <span>Email</span>
              <input placeholder="用於登入與密碼重設" type="email" value={loginForm.email} onChange={(e) => updateField('email', e.target.value)} autoComplete="email" />
            </label>
            <label className="authField">
              <span>密碼</span>
              <input placeholder="至少 6 碼" type="password" value={loginForm.password} onChange={(e) => updateField('password', e.target.value)} autoComplete="new-password" />
            </label>
            <label className="authField">
              <span>確認密碼</span>
              <input placeholder="再次輸入密碼" type="password" value={loginForm.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} autoComplete="new-password" />
            </label>
          </>
        )}

        {isVerify && (
          <>
            <label className="authField">
              <span>學號</span>
              <input placeholder="9 碼學號" value={loginForm.studentId} onChange={(e) => updateField('studentId', e.target.value.replace(/\D/g, '').slice(0, 9))} autoComplete="username" />
            </label>
            <label className="authField">
              <span>註冊 Email</span>
              <input placeholder="帳號綁定的 Email" type="email" value={loginForm.email} onChange={(e) => updateField('email', e.target.value)} autoComplete="email" />
            </label>
            <label className="authField">
              <span>Email 驗證碼</span>
              <input placeholder="6 碼驗證碼" value={loginForm.verificationCode} onChange={(e) => updateField('verificationCode', e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" />
            </label>
          </>
        )}

        {isForgot && !resetRequested && (
          <>
            <label className="authField">
              <span>學號</span>
              <input placeholder="9 碼學號" value={loginForm.studentId} onChange={(e) => updateField('studentId', e.target.value.replace(/\D/g, '').slice(0, 9))} autoComplete="username" />
            </label>
            <label className="authField">
              <span>註冊 Email</span>
              <input placeholder="帳號綁定的 Email" type="email" value={loginForm.email} onChange={(e) => updateField('email', e.target.value)} autoComplete="email" />
            </label>
          </>
        )}

        {isForgot && resetRequested && (
          <>
            <label className="authField">
              <span>驗證碼</span>
              <input placeholder="6 碼驗證碼" value={loginForm.resetCode} onChange={(e) => updateField('resetCode', e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" />
            </label>
            <label className="authField">
              <span>新密碼</span>
              <input placeholder="至少 6 碼" type="password" value={loginForm.newPassword} onChange={(e) => updateField('newPassword', e.target.value)} autoComplete="new-password" />
            </label>
            <label className="authField">
              <span>確認新密碼</span>
              <input placeholder="再次輸入新密碼" type="password" value={loginForm.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} autoComplete="new-password" />
            </label>
          </>
        )}

        {(isRegister || isVerify || (isForgot && !resetRequested)) && studentIdPreview && (
          <p className={`studentIdHint ${studentIdPreview.valid ? 'ok' : 'bad'}`}>
            {studentIdPreview.valid ? `✓ ${studentIdPreview.department_name || '已辨識學生資料'}｜${studentIdPreview.start_grade || '大一'}` : `⚠ ${studentIdPreview.reason || '學號格式異常'}`}
          </p>
        )}

        {authError && <p className="authError">{authError}</p>}
        {authNotice && <p className="authNotice">{authNotice}</p>}

        <button className="authSubmit" type="submit">
          {isVerify ? '完成驗證並登入' : isForgot ? (resetRequested ? '確認重設密碼' : '寄送驗證碼') : isRegister ? '建立帳號並寄送驗證碼' : '登入'}
        </button>

        {isVerify && <button className="authGoogleStub" type="button" onClick={handleResendVerification}>重新寄送 Email 驗證碼</button>}

        {isLogin && <button className="authGoogleStub" type="button" disabled>Google 登入（下一階段啟用）</button>}

        <div className="authV3Links">
          {!isLogin && <button type="button" onClick={() => switchMode('login')}>返回登入</button>}
          {!isRegister && !isVerify && <button type="button" onClick={() => switchMode('register')}>建立帳號</button>}
          {!isForgot && !isVerify && <button type="button" onClick={() => switchMode('forgot')}>忘記密碼</button>}
        </div>

        <button className="authGuest" type="button" onClick={handleGuestLogin}>先以訪客模式使用</button>
        <small>Email 驗證與密碼重設皆使用一次性驗證碼；未驗證帳號不得登入。</small>
      </form>
    </main>
  )
}
