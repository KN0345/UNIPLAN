import { useEffect, useState } from 'react'
import { readStorageJson } from '../utils/storage'
import { listPublicFeedback, submitPublicFeedback } from '../api'

const TYPES = ['缺失課程回報', '課程/學程資料問題', '帳號問題', '顯示問題', '功能問題']

function makeFeedbackId() {
  return `fb-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

export default function FeedbackPage({ notify }) {
  const [items, setItems] = useState(() => readStorageJson('uniplan:feedbackItems', []))
  const [form, setForm] = useState({ type: TYPES[0], title: '', detail: '', semester: '114上', code: '', courseName: '', department: '', attachments: [] })
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

  function readImageFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve({ name: file.name, type: file.type, dataUrl: reader.result })
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(file)
    })
  }

  async function handleAttachmentChange(event) {
    const files = Array.from(event.target.files || []).slice(0, 3)
    const images = (await Promise.all(files.map(readImageFile))).filter(Boolean)
    setForm((current) => ({ ...current, attachments: images }))
  }

  async function submitFeedback(e) {
    e.preventDefault()
    if (form.type === '缺失課程回報') {
      if (!form.semester.trim() || !form.courseName.trim()) {
        notify?.('請先選擇學期並輸入課名')
        return
      }
    } else if (!form.title.trim() && !form.detail.trim()) {
      notify?.('請先輸入回報內容')
      return
    }
    const nextItem = {
      id: makeFeedbackId(),
      type: form.type,
      title: form.type === '缺失課程回報'
        ? `${form.semester} ${form.courseName}${form.code ? `（${form.code.trim()}）` : ''}`.trim()
        : (form.title.trim() || form.type),
      detail: form.detail.trim(),
      semester: form.semester,
      code: form.code.trim(),
      courseName: form.courseName.trim(),
      department: form.department.trim(),
      courseMeta: { semester: form.semester, code: form.code.trim(), courseName: form.courseName.trim(), department: form.department.trim() },
      attachments: form.attachments || [],
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
    setForm({ type: TYPES[0], title: '', detail: '', semester: '114上', code: '', courseName: '', department: '', attachments: [] })
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
          {form.type === '缺失課程回報' ? (
            <>
              <div className="missingCourseFields missingCourseFieldsSimple">
                <label>學期<span className="requiredMark">*</span><select value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}><option value="114上">114上</option><option value="114下">114下</option><option value="其他">其他</option></select></label>
                <label>課名<span className="requiredMark">*</span><input value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} placeholder="例如：未來學習與人工智慧" /></label>
                <label>課號（選填）<input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="例如：D0778" /></label>
                <label>開課單位（選填）<input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="例如：TGDXB 教育共同科" /></label>
                <label className="feedbackUpload">圖片佐證（選填）<input type="file" accept="image/*" multiple onChange={handleAttachmentChange} /></label>
                {form.attachments?.length ? <small className="muted">已附加 {form.attachments.length} 張圖片</small> : null}
              </div>
              <label>補充內容（選填）<textarea value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} placeholder="例如：學校課程查詢有這門課，但 UniPlan 搜尋不到。" rows={5} /></label>
            </>
          ) : (
            <>
              <label>標題<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="例如：課程時間顯示錯誤" /></label>
              <label>內容<textarea value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} placeholder="簡單描述你遇到的問題" rows={6} /></label>
            </>
          )}
          <button>送出回報</button>
          <p className="muted feedbackNote">送出後由管理端處理。</p>
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
