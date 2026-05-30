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
  if (!open) return null

  function handleBackdrop(event) {
    if (event.target === event.currentTarget) onClose()
  }

  function handleTimetableImage(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setTimetableBg(String(reader.result || ''))
    reader.readAsDataURL(file)
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
            <label className="fileControl">
              <span>背景圖片</span>
              <input type="file" accept="image/*" onChange={handleTimetableImage} />
            </label>
            {timetableBg && <button type="button" onClick={() => setTimetableBg('')}>移除課表背景圖片</button>}
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
