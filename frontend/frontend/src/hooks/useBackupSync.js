import { saveSchedule, syncUserData } from '../api'
import { makePlan, getCourse, userKey } from '../utils/coursePlanning'

export function useBackupSync({ user, plan, setPlan, candidates, setCandidates, favorites, setFavorites, snapshots, setSnapshots, localReviews, tagVotes, makeUserBundle, notify, commit }) {
  function createSnapshot() {
    const name = window.prompt('方案名稱')
    if (!name) return
    setSnapshots((s) => [{ id: Date.now(), name, at: new Date().toLocaleString(), plan }, ...s])
  }

  function restoreSnapshot(snapshot) {
    commit({ ...makePlan(), ...snapshot.plan }, `套用快照：${snapshot.name}`)
  }

  function importBackupFile() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json,.json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const data = JSON.parse(text)
        const nextPlan = { ...makePlan(), ...(data.plan || data.schedule_data || {}) }
        setPlan(nextPlan)
        if (Array.isArray(data.candidates)) setCandidates(data.candidates)
        if (Array.isArray(data.favorites)) setFavorites(data.favorites)
        if (Array.isArray(data.snapshots)) setSnapshots(data.snapshots)
        notify('已匯入 JSON 備份')
      } catch (error) {
        console.error(error)
        alert('匯入失敗，請確認 JSON 格式正確。')
      }
    }
    input.click()
  }

  async function save() {
    const id = user?.studentId || 'guest'
    const bundle = makeUserBundle()
    await saveSchedule(id, plan).catch(() => null)
    await syncUserData(bundle).catch(() => null)
    localStorage.setItem('uniplan:plan', JSON.stringify(plan))
    notify('已儲存並嘗試同步')
  }

  function exportLocalBundle(download) {
    const bundle = { version: 1, exportedAt: new Date().toISOString(), user, plan, candidates, favorites, snapshots, localReviews, tagVotes }
    download(`uniplan_account_${userKey(user)}.json`, JSON.stringify(bundle, null, 2), 'application/json;charset=utf-8')
  }

  return { createSnapshot, restoreSnapshot, importBackupFile, save, exportLocalBundle }
}
