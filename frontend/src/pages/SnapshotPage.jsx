import { useMemo, useState } from 'react'

export default function SnapshotPage({ snapshots = [], setSnapshots, history = [], plan, restoreSnapshot }) {
  const [selectedId, setSelectedId] = useState(() => snapshots[0]?.id || '')
  const selected = useMemo(() => snapshots.find((item) => String(item.id) === String(selectedId)), [snapshots, selectedId])

  function createPlan() {
    const name = window.prompt('方案名稱')?.trim()
    if (!name) return
    const next = { id: Date.now(), name, at: new Date().toLocaleString(), plan }
    setSnapshots?.((items) => [next, ...(items || [])])
    setSelectedId(next.id)
  }

  function replacePlan() {
    if (!selected) return
    if (!window.confirm(`確定要用目前課表替換「${selected.name}」嗎？`)) return
    setSnapshots?.((items) => (items || []).map((item) => String(item.id) === String(selected.id) ? { ...item, at: new Date().toLocaleString(), plan } : item))
  }

  function deletePlan() {
    if (!selected) return
    if (!window.confirm(`確定刪除「${selected.name}」嗎？刪除後無法復原。`)) return
    setSnapshots?.((items) => (items || []).filter((item) => String(item.id) !== String(selected.id)))
    setSelectedId('')
  }

  return (
    <section className="pageCard planSchemePage">
      <div className="pageHead">
        <div>
          <h2>我的方案</h2>
          <p className="muted">自行保存不同課表版本；系統不提供預設方案。</p>
        </div>
        <div className="pageHeadActions planSchemeActions">
          <button onClick={createPlan}>建立</button>
          <button onClick={replacePlan} disabled={!selected}>替換</button>
          <button onClick={deletePlan} disabled={!selected}>刪除</button>
        </div>
      </div>
      <div className="snapshotGrid planSchemeGrid">
        {snapshots.length ? snapshots.map((s) => (
          <article key={s.id} className={`planSchemeCard ${String(selectedId) === String(s.id) ? 'active' : ''}`} onClick={() => setSelectedId(s.id)}>
            <h3>{s.name}</h3>
            <p>{s.at}</p>
            <button onClick={(event) => { event.stopPropagation(); restoreSnapshot?.(s) }}>套用方案</button>
          </article>
        )) : <div className="emptyPlanSchemes">
          <b>尚未建立方案</b>
          <span>可先排出一版課表，再按「建立」保存。</span>
        </div>}
      </div>
      <h3>最近操作</h3>
      {history.length ? history.slice().reverse().map((h, i) => <p key={`${h.at}-${i}`} className="historyLine">{h.at}｜{h.message}</p>) : <p className="muted">尚無操作紀錄。</p>}
    </section>
  )
}
