import { useEffect, useState } from 'react'
import { readStorageJson } from '../utils/storage'
import { listPublicFeedback, submitPublicFeedback } from '../api'

const TYPES = ['課程/學程資料問題', '帳號問題', '顯示問題', '功能問題']

function makeFeedbackId() {
  return `fb-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

export default function FeedbackPage({ notify }) {
  const [items, setItems] = useState(() => readStorageJson('uniplan:feedbackItems', []))
  const [form, setForm] = useState({ type: TYPES[0], title: '', detail: '' })
  const [remoteLoaded, setRemoteLoaded] = useState(false)
  useEffect(() => {
    let alive = true
    listPublicFeedback({ limit: 20 })
      .then((payload) => {
        if (!alive) return
        const list = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []
        if (list.length) {
          const mapped = list.map((item) => ({
            id: item.id,
            type: item.type || item.category || '功能問題',
            title: item.title || item.type || '未命名回報',
            detail: item.detail || item.content || '',
            status: item.status || '待處理',
            createdAt: item.created_at || item.createdAt || '',
          }))
          setItems(mapped)
        }
        setRemoteLoaded(true)
      })
      .catch(() => setRemoteLoaded(true))
    return () => { alive = false }
  }, [])
  const recent = items.filter((item) => item.status !== '已拒絕' && item.status !== '已處理').slice(0, 10)
  const recentFallback = [
    { id: 'sample-course', title: '課程/學程資料問題', type: '可回報課程時間、學分、學程規則錯誤', status: '參考', createdAt: '' },
    { id: 'sample-display', title: '顯示問題', type: '可回報手機版文字擠壓或按鈕錯位', status: '參考', createdAt: '' },
  ]
  const recentView = recent.length ? recent : recentFallback

  async function submitFeedback(e) {
    e.preventDefault()
    if (!form.title.trim() && !form.detail.trim()) {
      notify?.('請先輸入回報內容')
      return
    }
    const nextItem = {
      id: makeFeedbackId(),
      type: form.type,
      title: form.title.trim() || form.type,
      detail: form.detail.trim(),
      status: '待處理',
      createdAt: new Date().toLocaleString('zh-TW', { hour12: false }),
    }
    let savedItem = nextItem
    try {
      const payload = await submitPublicFeedback(nextItem)
      savedItem = payload?.data || payload || nextItem
    } catch (error) {
      savedItem = { ...nextItem, offline: true }
    }
    const normalized = { ...nextItem, ...savedItem, createdAt: savedItem.created_at || savedItem.createdAt || nextItem.createdAt }
    const nextItems = [normalized, ...items]
    setItems(nextItems)
    localStorage.setItem('uniplan:feedbackItems', JSON.stringify(nextItems))
    setForm({ type: TYPES[0], title: '', detail: '' })
    notify?.('已送出回報')
  }

  return (
    <section className="feedbackPage feedbackSplitPage">
      <div className="feedbackMainPane">
        <div className="pageHead feedbackTitleBlock">
          <div>
            <h2>意見箱</h2>
            <p>回報資料、帳號、畫面或功能問題。</p>
          </div>
        </div>
        <form className="feedbackForm" onSubmit={submitFeedback}>
          <label>分類<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
          <label>標題<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="例如：課程時間顯示錯誤" /></label>
          <label>內容<textarea value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} placeholder="簡單描述你遇到的問題" rows={6} /></label>
          <button>送出回報</button>
          <p className="muted feedbackNote">送出後會交由管理端處理。未來可加入通知中心，用來顯示選課時間提醒與回報處理結果。</p>
        </form>
      </div>
      <aside className="recentFeedbackPanel feedbackRecentPane">
        <h3>最近回報</h3>
        <p className="muted">若已有人回報相同問題，可以先等待處理。{remoteLoaded ? '' : '（載入中）'}</p>
        <div className="recentFeedbackList">
          {recentView.map((item) => <article key={item.id} className={!recent.length ? 'placeholderFeedback' : ''}>
            <b>{item.title || item.type}</b>
            <span>{item.type}</span>
            <small>{item.status || '待處理'}{item.createdAt ? `｜${item.createdAt}` : ''}</small>
          </article>)}
        </div>
      </aside>
    </section>
  )
}
