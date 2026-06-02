import { useEffect, useState } from 'react'
import { completeGoogleSetup, fetchMe, fetchUserData, login, logout as apiLogout, parseStudentId, register, requestPasswordReset, resendVerification, resetPassword, updateProfile, verifyEmail } from '../api'
import { DEFAULT_ACCOUNT_PROFILE, PUBLIC_GUEST_USER, applyAdminRole, loadProfileForUser, loadBoundAcademicBundle, loginLocalAccount, parseTkuStudentIdLocal, profileStorageKey, purgeRemovedStudentLocalData, readStorageJson, registerLocalAccount, resetLocalPassword } from '../utils/account'
import { download, makePlan, userKey } from '../utils/coursePlanning'

function profileFromParsed(parsed) {
  if (!parsed?.valid) return {}
  return {
    department: parsed.department_name || '',
    grade: parsed.start_grade || (parsed.program_code === '4' ? '大一' : ''),
    admissionYear: String(parsed.admission_year || ''),
    studentStatus: parsed.identity_name || '在學',
    transferEntryGrade: parsed.transfer_entry_grade || '',
  }
}

function decodeJwtPayload(token) {
  try {
    const payload = String(token || '').split('.')[1]
    if (!payload) return {}
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4)
    return JSON.parse(decodeURIComponent(escape(atob(padded))))
  } catch {
    return {}
  }
}

export function useAccountState({ notify, applyRemoteBundle, setPlan, setCandidates, setFavorites, setSnapshots, setLocalReviews, setTagVotes, currentBundle }) {
  purgeRemovedStudentLocalData()
  const [user, setUser] = useState(() => {
    const storedUser = readStorageJson('uniplan:user', null)
    return storedUser && typeof storedUser === 'object' ? applyAdminRole({ role: 'student', ...storedUser }) : null
  })
  const [loginForm, setLoginForm] = useState({ studentId: '', password: '', displayName: '', email: '', newPassword: '', confirmPassword: '', resetCode: '', verificationCode: '', googleSetupToken: '', googleEmail: '', googleName: '', googlePicture: '' })
  const [authMode, setAuthMode] = useState('login')
  const [studentIdPreview, setStudentIdPreview] = useState(null)
  const [authError, setAuthError] = useState('')
  const [authNotice, setAuthNotice] = useState('')
  const [resetRequested, setResetRequested] = useState(false)
  const [accountProfile, setAccountProfile] = useState(() => loadProfileForUser(readStorageJson('uniplan:user', null)))

  useEffect(() => {
    const sid = loginForm.studentId.trim()
    const shouldPreview = ['register', 'register-password', 'verify', 'forgot', 'google-setup'].includes(authMode)
    if (!shouldPreview || !sid || sid === 'admin' || sid === 'super') {
      setStudentIdPreview(null)
      return
    }
    const local = parseTkuStudentIdLocal(sid)
    setStudentIdPreview(local)
    if (!/^\d{9}$/.test(sid)) return
    let cancelled = false
    const timer = window.setTimeout(() => {
      parseStudentId(sid)
        .then((res) => { if (!cancelled) setStudentIdPreview(res?.data || local) })
        .catch(() => { if (!cancelled) setStudentIdPreview(local) })
    }, 220)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [loginForm.studentId, authMode])

  useEffect(() => {
    if (user) localStorage.setItem(profileStorageKey(user), JSON.stringify(accountProfile))
  }, [user, accountProfile])

  useEffect(() => {
    if (authMode !== 'forgot') setResetRequested(false)
    setAuthNotice('')
  }, [authMode])


  useEffect(() => {
    if (!user?.studentId) return
    const detected = profileFromParsed(parseTkuStudentIdLocal(user.studentId))
    if (!detected.admissionYear && !detected.department) return
    const needsPatch = ['department', 'admissionYear'].some((key) => String(accountProfile?.[key] || '') !== String(detected[key] || ''))
    if (needsPatch) setAccountProfile((prev) => ({ ...prev, ...detected }))
  }, [user?.studentId])


  function applyAuthenticatedRemote(remote, parsed, fallbackProfile = {}) {
    const nextUser = applyAdminRole(remote.user)
    setUser(nextUser)
    localStorage.setItem('uniplan:user', JSON.stringify(nextUser))
    const nextProfile = { ...DEFAULT_ACCOUNT_PROFILE, ...profileFromParsed(parsed), ...fallbackProfile, ...(remote.profile || {}) }
    setAccountProfile(nextProfile)
    localStorage.setItem(profileStorageKey(nextUser), JSON.stringify(nextProfile))
    if (remote.data) applyRemoteBundle(remote.data)
    return nextUser
  }

  function shouldFallbackToLocal(error) {
    return !error?.response || error?.response?.status >= 500
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('google_token')
    const setupToken = params.get('google_setup')
    const googleError = params.get('google_error')
    if (googleError) {
      setAuthMode('login')
      setAuthError(decodeURIComponent(googleError))
      window.history.replaceState({}, document.title, window.location.pathname)
      return
    }
    if (setupToken) {
      const setup = decodeJwtPayload(setupToken)
      setAuthMode('google-setup')
      setLoginForm((prev) => ({
        ...prev,
        studentId: '',
        password: '',
        displayName: setup.googleName || setup.name || prev.displayName || '',
        email: setup.email || prev.email || '',
        googleEmail: setup.email || '',
        googleName: setup.googleName || setup.name || '',
        googlePicture: setup.googlePicture || setup.picture || '',
        googleSetupToken: setupToken,
      }))
      setAuthNotice('Google 帳號已驗證，請補上學號完成 UniPlan 首次設定。')
      window.history.replaceState({}, document.title, window.location.pathname)
      return
    }
    if (!token) return
    let cancelled = false
    async function completeGoogleLogin() {
      try {
        localStorage.setItem('uniplan:token', token)
        const me = await fetchMe()
        const data = await fetchUserData().catch(() => null)
        if (cancelled) return
        const remote = { user: me.user, profile: me.profile || {}, data: data?.data || null }
        applyAuthenticatedRemote(remote, parseTkuStudentIdLocal(me.user?.studentId || ''))
        notify('Google 登入成功，已載入雲端資料')
      } catch (error) {
        localStorage.removeItem('uniplan:token')
        setAuthMode('login')
        setAuthError(error?.response?.data?.error || error?.message || 'Google 登入失敗')
      } finally {
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
    completeGoogleLogin()
    return () => { cancelled = true }
  }, [])


  async function handleLogin(e) {
    e.preventDefault()
    setAuthError('')
    setAuthNotice('')
    const sid = loginForm.studentId.trim()
    const parsed = studentIdPreview?.valid ? studentIdPreview : parseTkuStudentIdLocal(sid)
    try {
      if (!sid) throw new Error(authMode === 'login' ? '請輸入學號或 Email' : '請輸入學號')
      if (authMode === 'google-setup') {
        if (!parsed?.valid) throw new Error(parsed?.reason || '學號格式錯誤')
        if (!loginForm.googleSetupToken) throw new Error('Google 首次設定憑證已失效，請重新使用 Google 登入')
        const remote = await completeGoogleSetup(loginForm.googleSetupToken, {
          student_id: sid,
          displayName: loginForm.displayName || loginForm.googleName || sid,
          email: loginForm.googleEmail || loginForm.email,
          ...profileFromParsed(parsed),
        })
        applyAuthenticatedRemote(remote, parsed, { email: loginForm.googleEmail || loginForm.email, boundGoogle: true, boundEmail: true })
        setAuthMode('login')
        setLoginForm((prev) => ({ ...prev, googleSetupToken: '', googleEmail: '', googleName: '', googlePicture: '', password: '' }))
        notify(remote?.message || 'Google 帳號已完成首次設定')
        return
      }
      if (authMode === 'register') {
        if (!parsed?.valid) throw new Error(parsed?.reason || '學號格式錯誤')
        if (!loginForm.email.trim()) throw new Error('請輸入 Email')
        setAuthMode('register-password')
        return
      }
      if (authMode === 'forgot') {
        if (!resetRequested) {
          if (!/^\d{9}$/.test(sid)) throw new Error('請輸入 9 碼學號')
          if (!loginForm.email.trim()) throw new Error('請輸入註冊 Email')
          const res = await requestPasswordReset(sid, loginForm.email.trim())
          setResetRequested(true)
          setAuthNotice(res?.message || '驗證碼已寄出，請檢查信箱')
          notify('密碼重設驗證碼已送出')
          return
        }
        if (!loginForm.resetCode || loginForm.resetCode.length !== 6) throw new Error('請輸入 6 碼驗證碼')
        if (loginForm.newPassword.length < 6) throw new Error('新密碼至少需要 6 碼')
        if (loginForm.newPassword !== loginForm.confirmPassword) throw new Error('兩次密碼輸入不一致')
        await resetPassword(sid, loginForm.email.trim(), loginForm.resetCode, loginForm.newPassword)
        setAuthMode('login')
        setResetRequested(false)
        setLoginForm((prev) => ({ ...prev, password: '', newPassword: '', confirmPassword: '', resetCode: '' }))
        notify('密碼已重設，請使用新密碼登入')
        return
      }
      if (authMode === 'verify') {
        if (!/^\d{9}$/.test(sid)) throw new Error('請輸入 9 碼學號')
        if (!loginForm.email.trim()) throw new Error('請輸入註冊 Email')
        if (!loginForm.verificationCode || loginForm.verificationCode.length !== 6) throw new Error('請輸入 6 碼 Email 驗證碼')
        const remote = await verifyEmail(sid, loginForm.email.trim(), loginForm.verificationCode)
        applyAuthenticatedRemote(remote, parsed, { email: loginForm.email })
        setAuthMode('login')
        setLoginForm((prev) => ({ ...prev, password: '', verificationCode: '' }))
        notify(remote?.message || 'Email 驗證完成，已登入')
        return
      }
      if (authMode === 'register-password') {
        if (!parsed?.valid) throw new Error(parsed?.reason || '學號格式錯誤')
        if (!loginForm.email.trim()) throw new Error('請輸入 Email')
        if (loginForm.password.length < 6) throw new Error('密碼至少需要 6 碼')
        if (loginForm.password !== loginForm.confirmPassword) throw new Error('兩次密碼輸入不一致')
        const initialProfile = {
          ...profileFromParsed(parsed),
          displayName: loginForm.displayName || sid,
          email: loginForm.email,
        }
        try {
          const remote = await register(sid, loginForm.password, initialProfile)
          setAuthMode('verify')
          setAuthNotice(remote?.message || '驗證碼已寄出，請完成 Email 驗證後登入')
          setLoginForm((prev) => ({ ...prev, verificationCode: '', password: '', confirmPassword: '' }))
          notify('帳號已建立，請先完成 Email 驗證')
          return
        } catch (remoteError) {
          if (!shouldFallbackToLocal(remoteError)) throw new Error(remoteError?.response?.data?.error || remoteError?.message || '註冊失敗')
          const { user: nextUser, profile } = registerLocalAccount({
            studentId: sid,
            password: loginForm.password,
            displayName: loginForm.displayName || sid,
            email: loginForm.email,
            profile: initialProfile,
          })
          setUser(nextUser)
          localStorage.setItem('uniplan:user', JSON.stringify(nextUser))
          setAccountProfile(profile)
          localStorage.setItem(profileStorageKey(nextUser), JSON.stringify(profile))
          const boundBundle = loadBoundAcademicBundle(nextUser)
          if (boundBundle) applyRemoteBundle(boundBundle)
          notify('後端未連線，已建立本機帳號')
          return
        }
      }
      try {
        if (!loginForm.password) throw new Error('請輸入密碼')
        const remote = await login(sid, loginForm.password)
        applyAuthenticatedRemote(remote, parsed)
        notify(remote.data ? '登入成功，已載入雲端課表' : '登入成功，尚未建立雲端課表')
        return
      } catch (remoteError) {
        const apiError = remoteError?.response?.data
        if (apiError?.code === 'EMAIL_NOT_VERIFIED') {
          setAuthMode('verify')
          setLoginForm((prev) => ({ ...prev, studentId: apiError.studentId || sid, email: apiError.email || prev.email, verificationCode: '', password: '' }))
          setAuthNotice('此帳號尚未完成 Email 驗證。請輸入驗證碼，或重新寄送驗證碼。')
          return
        }
        if (!shouldFallbackToLocal(remoteError)) throw new Error(apiError?.error || remoteError?.message || '登入失敗')
        const { user: nextUser, profile } = loginLocalAccount(sid, loginForm.password)
        setUser(nextUser)
        localStorage.setItem('uniplan:user', JSON.stringify(nextUser))
        const nextProfile = { ...DEFAULT_ACCOUNT_PROFILE, ...profile, ...profileFromParsed(parsed) }
        setAccountProfile(nextProfile)
        localStorage.setItem(profileStorageKey(nextUser), JSON.stringify(nextProfile))
        const boundBundle = loadBoundAcademicBundle(nextUser)
        if (boundBundle) applyRemoteBundle(boundBundle)
        notify(boundBundle ? '後端未連線，已載入本機課表' : '後端未連線，已使用本機帳號登入')
      }
    } catch (error) {
      setAuthError(error?.message || '登入失敗')
    }
  }


  async function handleResendVerification() {
    setAuthError('')
    setAuthNotice('')
    const sid = loginForm.studentId.trim()
    try {
      if (!/^\d{9}$/.test(sid)) throw new Error('請輸入 9 碼學號')
      if (!loginForm.email.trim()) throw new Error('請輸入註冊 Email')
      const res = await resendVerification(sid, loginForm.email.trim())
      setAuthNotice(res?.message || 'Email 驗證碼已重新寄出')
      notify('Email 驗證碼已重新寄出')
    } catch (error) {
      setAuthError(error?.response?.data?.error || error?.message || '重新寄送失敗')
    }
  }

  function handleGuestLogin() {
    const nextUser = PUBLIC_GUEST_USER
    setUser(nextUser)
    localStorage.setItem('uniplan:user', JSON.stringify(nextUser))
    setAccountProfile({ ...DEFAULT_ACCOUNT_PROFILE, displayName: '本機使用者' })
    notify('已進入訪客模式')
  }

  async function logout() {
    await apiLogout().catch(() => null)
    setUser(null)
    setAccountProfile(DEFAULT_ACCOUNT_PROFILE)
    localStorage.removeItem('uniplan:user')
    localStorage.removeItem('uniplan:token')
    notify?.('已登出')
  }

  function updateAccountProfile(patch) {
    setAccountProfile((prev) => ({ ...prev, ...patch }))
  }

  async function saveAccountProfile() {
    if (!user) return
    localStorage.setItem(profileStorageKey(user), JSON.stringify(accountProfile))
    try {
      const data = await updateProfile(accountProfile)
      const remoteProfile = data?.user?.profile
      if (remoteProfile) setAccountProfile({ ...DEFAULT_ACCOUNT_PROFILE, ...remoteProfile })
      notify('帳號資料已同步')
    } catch {
      notify('已儲存在本機；後端未連線')
    }
  }

  function toggleEmailBinding() {
    if (!accountProfile.email && !accountProfile.boundEmail) {
      notify('請先填寫 Email')
      return
    }
    setAccountProfile((prev) => ({ ...prev, boundEmail: !prev.boundEmail }))
    notify(accountProfile.boundEmail ? '已解除 Email 綁定' : 'Email 已綁定')
  }

  function toggleGoogleBinding() {
    setAccountProfile((prev) => ({ ...prev, boundGoogle: !prev.boundGoogle }))
    notify(accountProfile.boundGoogle ? '已解除 Google 綁定' : 'Google 已綁定')
  }

  function toggleSyncEnabled() {
    setAccountProfile((prev) => ({ ...prev, syncEnabled: !prev.syncEnabled }))
    notify(accountProfile.syncEnabled ? '已關閉同步' : '已開啟同步')
  }

  function exportAccountBundle() {
    const bundle = { version: 1, exportedAt: new Date().toISOString(), user, profile: accountProfile, ...(currentBundle?.() || {}) }
    download(`uniplan_account_${userKey(user)}.json`, JSON.stringify(bundle, null, 2), 'application/json;charset=utf-8')
  }

  function importAccountBundle() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const data = JSON.parse(await file.text())
        if (data.profile) setAccountProfile({ ...DEFAULT_ACCOUNT_PROFILE, ...data.profile })
        if (data.plan) setPlan({ ...makePlan(), ...data.plan })
        if (Array.isArray(data.candidates)) setCandidates(data.candidates)
        if (Array.isArray(data.favorites)) setFavorites(data.favorites)
        if (Array.isArray(data.snapshots)) setSnapshots(data.snapshots)
        if (data.localReviews) setLocalReviews(data.localReviews)
        if (data.tagVotes) setTagVotes(data.tagVotes)
        notify('帳號資料已匯入')
      } catch {
        notify('匯入失敗，請確認 JSON 格式')
      }
    }
    input.click()
  }

  return {
    user, setUser, loginForm, setLoginForm, authMode, setAuthMode, studentIdPreview, authError, authNotice, resetRequested, setResetRequested,
    accountProfile, setAccountProfile, handleLogin, handleResendVerification, handleGuestLogin, logout, updateAccountProfile, saveAccountProfile,
    toggleEmailBinding, toggleGoogleBinding, toggleSyncEnabled, exportAccountBundle, importAccountBundle,
  }
}
