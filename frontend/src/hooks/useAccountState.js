import { useEffect, useState } from 'react'
import { fetchSchedule, fetchUserData, login, logout as apiLogout, parseStudentId, register, updateProfile } from '../api'
import { DEFAULT_ACCOUNT_PROFILE, PUBLIC_GUEST_USER, applyAdminRole, loadProfileForUser, parseTkuStudentIdLocal, profileStorageKey, purgeRemovedStudentLocalData, readStorageJson } from '../utils/account'
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
    return storedUser && typeof storedUser === 'object' ? applyAdminRole({ role: 'student', ...storedUser }) : PUBLIC_GUEST_USER
  })
  const [loginForm, setLoginForm] = useState({ studentId: '', password: '', displayName: '', email: '' })
  const [authMode, setAuthMode] = useState('login')
  const [studentIdPreview, setStudentIdPreview] = useState(null)
  const [authError, setAuthError] = useState('')
  const [accountProfile, setAccountProfile] = useState(() => loadProfileForUser(readStorageJson('uniplan:user', null) || PUBLIC_GUEST_USER))

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
    try {
      if (authMode === 'register' && loginForm.studentId !== 'admin' && loginForm.studentId !== 'super') {
        const parsed = studentIdPreview || parseTkuStudentIdLocal(loginForm.studentId)
        if (!parsed?.valid) {
          setAuthError(parsed?.reason || '學號格式錯誤')
          return
        }
      }
      const data = authMode === 'register'
        ? await register(loginForm.studentId, loginForm.password, { display_name: loginForm.displayName })
        : await login(loginForm.studentId, loginForm.password)
      if (data?.token) localStorage.setItem('uniplan:token', data.token)
      const remoteUser = data?.user || {}
      const nextUser = applyAdminRole({ studentId: remoteUser.student_id || loginForm.studentId, role: remoteUser.role || 'student' })
      setUser(nextUser)
      localStorage.setItem('uniplan:user', JSON.stringify(nextUser))
      const parsedLoginProfile = studentIdPreview?.valid ? studentIdPreview : parseTkuStudentIdLocal(loginForm.studentId)
      const nextProfile = { ...DEFAULT_ACCOUNT_PROFILE, ...loadProfileForUser(nextUser), ...(remoteUser.profile || {}), ...profileFromParsed(parsedLoginProfile) }
      setAccountProfile(nextProfile)
      localStorage.setItem(profileStorageKey(nextUser), JSON.stringify(nextProfile))
      const cloud = await fetchUserData().catch(() => null)
      if (cloud?.data && Object.keys(cloud.data).length) applyRemoteBundle(cloud.data)
      else {
        const schedule = await fetchSchedule(nextUser.studentId).catch(() => null)
        if (schedule?.schedule_data) setPlan({ ...makePlan(), ...schedule.schedule_data })
      }
      notify(authMode === 'register' ? '註冊並登入成功' : '登入成功')
    } catch (error) {
      const isOffline = !error?.response
      if (!isOffline) {
        setAuthError(error?.response?.data?.detail || error?.response?.data?.message || error?.message || '登入失敗')
        return
      }
      const parsed = parseTkuStudentIdLocal(loginForm.studentId)
      if (authMode === 'register' && loginForm.studentId !== 'admin' && loginForm.studentId !== 'super' && !parsed?.valid) {
        setAuthError(parsed?.reason || '學號格式錯誤')
        return
      }
      const nextUser = applyAdminRole({ studentId: loginForm.studentId.trim(), role: 'student', offline: true })
      setUser(nextUser)
      localStorage.setItem('uniplan:user', JSON.stringify(nextUser))
      const nextProfile = {
        ...DEFAULT_ACCOUNT_PROFILE,
        ...loadProfileForUser(nextUser),
        displayName: authMode === 'register' ? (loginForm.displayName || loginForm.studentId) : (loadProfileForUser(nextUser).displayName || loginForm.studentId),
        ...profileFromParsed(parsed),
      }
      setAccountProfile(nextProfile)
      localStorage.setItem(profileStorageKey(nextUser), JSON.stringify(nextProfile))
      notify('後端未連線，已進入本機開發模式')
    }
  }

  async function logout() {
    await apiLogout().catch(() => null)
    setUser(PUBLIC_GUEST_USER)
    setAccountProfile(DEFAULT_ACCOUNT_PROFILE)
    localStorage.removeItem('uniplan:user')
    localStorage.removeItem('uniplan:token')
    notify?.('已回到本機模式')
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
    accountProfile, setAccountProfile, handleLogin, logout, updateAccountProfile, saveAccountProfile,
    toggleEmailBinding, toggleGoogleBinding, toggleSyncEnabled, exportAccountBundle, importAccountBundle,
  }
}
