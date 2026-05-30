import { useState } from 'react'
import { createPortal } from 'react-dom'

const UI_THEMES = [
  { key: 'clean', label: '清透白', desc: '明亮、乾淨、低干擾' },
  { key: 'night', label: '深夜藍', desc: '深色介面、降低刺眼感' },
  { key: 'mist', label: '櫻霧粉', desc: '柔霧粉白、輕盈溫和' },
  { key: 'forest', label: '松石綠', desc: '深綠木質、安靜專注' },
  { key: 'lavender', label: '琥珀墨', desc: '琥珀光感、沉穩暖調' },
  { key: 'graphite', label: '高對比黑', desc: '黑底高對比、強工作感' },
]
const ACCENT_COLORS = [
  '#2563eb', '#7c3aed', '#db2777', '#dc2626',
  '#ea580c', '#d97706', '#65a30d', '#16a34a',
  '#059669', '#0d9488', '#0891b2', '#0284c7',
  '#4f46e5', '#9333ea', '#475569', '#111827',
]

function loadImageFromDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}

async function fileToCompressedDataUrl(file) {
  if (!file?.type?.startsWith('image/')) {
    throw new Error('請選擇圖片檔。')
  }

  const rawDataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('圖片讀取失敗。'))
    reader.readAsDataURL(file)
  })

  const img = await loadImageFromDataUrl(rawDataUrl)
  const maxWidth = 2200
  const maxHeight = 1600
  const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height)
  const width = Math.max(1, Math.round(img.width * scale))
  const height = Math.max(1, Math.round(img.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#0f1b32'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(img, 0, 0, width, height)

  let quality = 0.86
  let output = canvas.toDataURL('image/jpeg', quality)
  while (output.length > 2_800_000 && quality > 0.52) {
    quality -= 0.08
    output = canvas.toDataURL('image/jpeg', quality)
  }

  if (output.length > 3_600_000) {
    throw new Error('圖片仍然太大，請改用較小的圖片。')
  }

  return output
}

function AppearanceModal({
  open,
  onClose,
  uiTheme,
  setUiTheme,
  accent,
  setAccent,
  buttonAccent,
  setButtonAccent,
  timetableTint,
  setTimetableTint,
  timetableOpacity,
  setTimetableOpacity,
  timetableBg,
  setTimetableBg,
  courseCardOpacity,
  setCourseCardOpacity,
}) {
  const [imageStatus, setImageStatus] = useState('')
  const [imageError, setImageError] = useState('')

  if (!open) return null

  function handleBackdrop(event) {
    if (event.target === event.currentTarget) onClose()
  }

  async function handleTimetableImage(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setImageError('')
    setImageStatus('正在處理圖片...')
    try {
      const dataUrl = await fileToCompressedDataUrl(file)
      setTimetableBg(dataUrl)
      setImageStatus(`已套用：${file.name}`)
    } catch (error) {
      setImageStatus('')
      setImageError(error?.message || '圖片匯入失敗。')
    } finally {
      event.target.value = ''
    }
  }

  return createPortal(
    <div className="appearanceModalLayer" onMouseDown={handleBackdrop} role="presentation">
      <section className="appearanceModal" role="dialog" aria-modal="true" aria-labelledby="appearance-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="appearanceHeader">
          <div>
            <h2 id="appearance-title">外觀設定</h2>
            <p>調整主題、重點色、按鈕色與課表玻璃質感。</p>
          </div>
          <button className="miniClose" type="button" onClick={onClose} aria-label="關閉外觀設定">×</button>
        </header>

        <div className="appearanceBody">
          <section className="appearanceSection">
            <h3>網頁主題</h3>
            <div className="themeCards">
              {UI_THEMES.map((themeOption) => (
                <button
                  key={themeOption.key}
                  type="button"
                  className={uiTheme === themeOption.key ? 'active' : ''}
                  onClick={() => setUiTheme(themeOption.key)}
                >
                  <strong>{themeOption.label}</strong>
                  <span>{themeOption.desc}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="appearanceSection">
            <h3>主色與按鈕色</h3>
            <label className="inlineControl">
              <span>主色</span>
              <input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} />
            </label>
            <div className="accentGrid compactAccentGrid">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={`accent-${color}`}
                  type="button"
                  className={accent === color ? 'active' : ''}
                  style={{ background: color }}
                  aria-label={`設定主色 ${color}`}
                  onClick={() => setAccent(color)}
                />
              ))}
            </div>
            <label className="inlineControl">
              <span>按鈕色</span>
              <input type="color" value={buttonAccent} onChange={(event) => setButtonAccent(event.target.value)} />
            </label>
            <div className="accentGrid compactAccentGrid">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={`button-${color}`}
                  type="button"
                  className={buttonAccent === color ? 'active' : ''}
                  style={{ background: color }}
                  aria-label={`設定按鈕色 ${color}`}
                  onClick={() => setButtonAccent(color)}
                />
              ))}
            </div>
          </section>

          <section className="appearanceSection">
            <h3>課表外觀</h3>
            <p className="appearanceHint">調整課程卡片材質：數值越高越接近霧面壓克力；降到 0 時只保留文字與色點。</p>
            <label className="inlineControl">
              <span>課表色調</span>
              <input type="color" value={timetableTint} onChange={(event) => setTimetableTint(event.target.value)} />
            </label>
            <label className="inlineControl">
              <span>課表透明</span>
              <input type="range" min="0" max="1" step="0.05" value={timetableOpacity} onChange={(event) => setTimetableOpacity(event.target.value)} />
            </label>
            <label className="inlineControl">
              <span>課程卡霧面</span>
              <input type="range" min="0" max="1" step="0.05" value={courseCardOpacity} onChange={(event) => setCourseCardOpacity(event.target.value)} />
            </label>
            <div className="backgroundUploadBox">
              <label className="fileControl backgroundUploadControl">
                <span>上傳本機背景圖片</span>
                <input type="file" accept="image/png,image/jpeg,image/webp,image/*" onChange={handleTimetableImage} />
              </label>
              <p className="appearanceHint">圖片會自動壓縮並存在目前瀏覽器；使用本機上傳圖片可正常匯出 PNG，外部圖片網址可能被瀏覽器安全限制擋下。</p>
              {imageStatus && <p className="appearanceStatus">{imageStatus}</p>}
              {imageError && <p className="appearanceError">{imageError}</p>}
              {timetableBg && (
                <div className="backgroundPreviewRow">
                  <div className="backgroundPreview" style={{ backgroundImage: `url(${timetableBg})` }} />
                  <button type="button" onClick={() => { setTimetableBg(''); setImageStatus('已移除背景圖片'); setImageError('') }}>移除背景圖片</button>
                </div>
              )}
            </div>
          </section>
        </div>

        <footer className="appearanceFooter">
          <button type="button" onClick={() => {
            setUiTheme('clean')
            setAccent('#2563eb')
            setButtonAccent('#2563eb')
            setTimetableTint('#101f3a')
            setTimetableOpacity('0')
            setCourseCardOpacity('0.72')
            setTimetableBg('')
          }}>恢復預設</button>
          <button className="primary" type="button" onClick={onClose}>完成</button>
        </footer>
      </section>
    </div>,
    document.body,
  )
}

export default AppearanceModal
