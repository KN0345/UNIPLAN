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
  const isRegisterPassword = authMode === 'register-password'
  const isForgot = authMode === 'forgot'
  const isLogin = authMode === 'login'
  const isVerify = authMode === 'verify'
  const isGoogleSetup = authMode === 'google-setup'

  function updateField(key, value) {
    setLoginForm({ ...loginForm, [key]: value })
  }

  function switchMode(mode) {
    setAuthMode(mode)
    setLoginForm((prev) => ({
      ...prev,
      password: '',
      newPassword: '',
      confirmPassword: '',
      resetCode: '',
      verificationCode: '',
    }))
  }

  function goGoogleLogin() {
    window.location.href = '/api/auth/google/start'
  }

  const title = isVerify
    ? 'Email 驗證'
    : isGoogleSetup
      ? '完成首次設定'
    : isForgot
      ? '重設密碼'
      : isRegister
        ? '建立帳號'
        : isRegisterPassword
          ? '設定密碼'
          : '登入 UniPlan'

  const description = isVerify
    ? '輸入信箱收到的 6 碼驗證碼，完成後即可登入。'
    : isGoogleSetup
      ? 'Google 帳號已驗證，請補上淡江學號並確認顯示名稱。'
    : isForgot
      ? (resetRequested ? '輸入驗證碼並設定新密碼。' : '輸入學號與註冊 Email，系統會寄出一次性驗證碼。')
      : isRegister
        ? '先填寫基本資料，下一步再設定密碼。'
        : isRegisterPassword
          ? '請設定至少 6 碼密碼，建立後需完成 Email 驗證。'
          : '使用學號、Email 或 Google 帳號登入。'

  return (
    <main className="login authPage authV4Page">
      <section className="authHero authV5Hero">
        <div className="authV5BrandRow">
          <span className="authV5BrandMark">UniPlan</span>
          <span className="authV5SchoolTag">TKU Planner</span>
        </div>

        <div className="authV5HeroText">
          <p className="authV5Kicker">淡江學生專用</p>
          <h1>淡江四年排課助手</h1>
          <p className="authV5Lead">
            從大一到畢業，將課表、學程與畢業學分規劃整合在同一個工作區。
          </p>
        </div>

        <div className="authV5FeatureList" aria-label="UniPlan 功能摘要">
          <span>課表規劃</span>
          <span>學程追蹤</span>
          <span>畢業學分檢查</span>
          <span>收藏與比較課程</span>
          <span>雲端同步資料</span>
        </div>

        <div className="authV5Stats" aria-label="資料概況">
          <div><strong>500+</strong><span>課程資料</span></div>
          <div><strong>20+</strong><span>學程資料</span></div>
          <div><strong>114</strong><span>學年度</span></div>
        </div>
      </section>

      <form className={`authCard authV4Card ${isRegister ? 'registerInfoMode' : ''} ${isRegisterPassword ? 'registerPasswordMode' : ''} ${isForgot ? 'forgotMode' : ''} ${isGoogleSetup ? 'googleSetupMode' : ''}`} onSubmit={handleLogin}>
        <div className="authV4Header">
          <span className="authV4Eyebrow">UniPlan Account</span>
          <h2>{title}</h2>
          <p>{description}</p>
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

        {isGoogleSetup && (
          <>
            <div className="authGoogleIdentity">
              {loginForm.googlePicture && <img src={loginForm.googlePicture} alt="Google avatar" />}
              <div>
                <strong>{loginForm.googleName || 'Google 使用者'}</strong>
                <span>{loginForm.googleEmail || loginForm.email}</span>
              </div>
            </div>
            <label className="authField">
              <span>顯示名稱</span>
              <input placeholder="例如：KN" value={loginForm.displayName} onChange={(e) => updateField('displayName', e.target.value)} autoComplete="name" />
            </label>
            <label className="authField">
              <span>淡江學號</span>
              <input placeholder="9 碼學號" value={loginForm.studentId} onChange={(e) => updateField('studentId', e.target.value.replace(/\D/g, '').slice(0, 9))} autoComplete="username" />
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
          </>
        )}

        {isRegisterPassword && (
          <>
            <div className="authSummaryBox">
              <strong>{loginForm.displayName || '未命名使用者'}</strong>
              <span>{loginForm.studentId || '尚未填寫學號'}</span>
              <span>{loginForm.email || '尚未填寫 Email'}</span>
            </div>
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

        {(isRegister || isVerify || isRegisterPassword || isGoogleSetup || (isForgot && !resetRequested)) && studentIdPreview && (
          <p className={`studentIdHint ${studentIdPreview.valid ? 'ok' : 'bad'}`}>
            {studentIdPreview.valid ? `✓ ${studentIdPreview.department_name || '已辨識學生資料'}｜${studentIdPreview.start_grade || '大一'}` : `⚠ ${studentIdPreview.reason || '學號格式異常'}`}
          </p>
        )}

        {authError && <p className="authError">{authError}</p>}
        {authNotice && <p className="authNotice">{authNotice}</p>}

        <button className="authSubmit" type="submit">
          {isGoogleSetup ? '完成設定並登入' : isVerify ? '完成驗證並登入' : isForgot ? (resetRequested ? '確認重設密碼' : '寄送驗證碼') : isRegister ? '下一步' : isRegisterPassword ? '建立帳號並寄送驗證碼' : '登入'}
        </button>

        {isLogin && (
          <>
            <div className="authDivider"><span>或</span></div>
            <button className="authGoogleButton" type="button" onClick={goGoogleLogin}>使用 Google 登入</button>
          </>
        )}

        {isVerify && <button className="authGoogleStub" type="button" onClick={handleResendVerification}>重新寄送 Email 驗證碼</button>}

        <div className="authV4Links">
          {isRegisterPassword && <button type="button" onClick={() => setAuthMode('register')}>返回上一步</button>}
          {!isLogin && <button type="button" onClick={() => switchMode('login')}>返回登入</button>}
          {!isRegister && !isRegisterPassword && !isVerify && !isGoogleSetup && <button type="button" onClick={() => switchMode('register')}>建立帳號</button>}
          {!isForgot && !isVerify && !isRegisterPassword && !isGoogleSetup && <button type="button" onClick={() => switchMode('forgot')}>忘記密碼</button>}
        </div>

        <button className="authGuest" type="button" onClick={handleGuestLogin}>先以訪客模式使用</button>
        <small>註冊需完成 Email 驗證；Google 登入會綁定相同 Email 的 UniPlan 帳號。</small>
      </form>
    </main>
  )
}
