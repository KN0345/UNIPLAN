import { useEffect, useState } from 'react'
import { fetchSchedule, fetchUserData, login, logout as apiLogout, parseStudentId, register, updateProfile } from '../api'
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

export function useAccountState({ notify, applyRemoteBundle, setPlan, setCandidates, setFavorites, setSnapshots, setLocalReviews, setTagVotes, currentBundle }) {
  purgeRemovedStudentLocalData()
  const [user, setUser] = useState(() => {
    const storedUser = readStorageJson('uniplan:user', null)
    return storedUser && typeof storedUser === 'object' ? applyAdminRole({ role: 'student', ...storedUser }) : null
  })
  const [loginForm, setLoginForm] = useState({ studentId: '', password: '', displayName: '', email: '', newPassword: '' })
  const [authMode, setAuthMode] = useState('login')
  const [studentIdPreview, setStudentIdPreview] = useState(null)
  const [authError, setAuthError] = useState('')
  const [accountProfile, setAccountProfile] = useState(() => loadProfileForUser(readStorageJson('uniplan:user', null)))

  useEffect(() => {
    const sid = loginForm.studentId.trim()
    if (!sid || sid === 'admin' || sid === 'super') {
      setStudentIdPreview(null)
      return
    }
    const local = parseTkuStudentIdLocal(sid)
    setStudentIdPreview(local)
    if (!/^\d{9}$/.test(sid)) return
    parseStudentId(sid)
      .then((res) => setStudentIdPreview(res?.data || local))
      .catch(() => setStudentIdPreview(local))
  }, [loginForm.studentId])

  useEffect(() => {
    if (user) localStorage.setItem(profileStorageKey(user), JSON.stringify(accountProfile))
  }, [user, accountProfile])

  useEffect(() => {
    if (!user?.studentId) return
    const detected = profileFromParsed(parseTkuStudentIdLocal(user.studentId))
    if (!detected.admissionYear && !detected.department) return
    const needsPatch = ['department', 'admissionYear'].some((key) => String(accountProfile?.[key] || '') !== String(detected[key] || ''))
    if (needsPatch) setAccountProfile((prev) => ({ ...prev, ...detected }))
  }, [user?.studentId])

  async function handleLogin(e) {
    e.preventDefault()
    setAuthError('')
    const sid = loginForm.studentId.trim()
    const parsed = studentIdPreview?.valid ? studentIdPreview : parseTkuStudentIdLocal(sid)
    try {
      if (!sid) throw new Error('請輸入學號')
      if (authMode === 'forgot') {
        resetLocalPassword(sid, loginForm.email, loginForm.newPassword)
        setAuthMode('login')
        setLoginForm((prev) => ({ ...prev, password: '', newPassword: '' }))
        notify('密碼已重設，請使用新密碼登入')
        return
      }
      if (authMode === 'register') {
        if (!parsed?.valid) throw new Error(parsed?.reason || '學號格式錯誤')
        const initialProfile = {
          ...profileFromParsed(parsed),
          displayName: loginForm.displayName || sid,
          email: loginForm.email,
        }
        try {
          const remote = await register(sid, loginForm.password, initialProfile)
          const nextUser = applyAdminRole(remote.user)
          const profile = { ...DEFAULT_ACCOUNT_PROFILE, ...initialProfile, ...(remote.profile || {}) }
          setUser(nextUser)
          localStorage.setItem('uniplan:user', JSON.stringify(nextUser))
          setAccountProfile(profile)
          localStorage.setItem(profileStorageKey(nextUser), JSON.stringify(profile))
          if (remote.data) applyRemoteBundle(remote.data)
          notify('雲端帳號已建立，課表將自動同步')
          return
        } catch (remoteError) {
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
        const remote = await login(sid, loginForm.password)
        const nextUser = applyAdminRole(remote.user)
        setUser(nextUser)
        localStorage.setItem('uniplan:user', JSON.stringify(nextUser))
        const nextProfile = { ...DEFAULT_ACCOUNT_PROFILE, ...profileFromParsed(parsed), ...(remote.profile || {}) }
        setAccountProfile(nextProfile)
        localStorage.setItem(profileStorageKey(nextUser), JSON.stringify(nextProfile))
        if (remote.data) applyRemoteBundle(remote.data)
        notify(remote.data ? '登入成功，已載入雲端課表' : '登入成功，尚未建立雲端課表')
        return
      } catch (remoteError) {
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
    user, setUser, loginForm, setLoginForm, authMode, setAuthMode, studentIdPreview, authError,
    accountProfile, setAccountProfile, handleLogin, handleGuestLogin, logout, updateAccountProfile, saveAccountProfile,
    toggleEmailBinding, toggleGoogleBinding, toggleSyncEnabled, exportAccountBundle, importAccountBundle,
  }
}
