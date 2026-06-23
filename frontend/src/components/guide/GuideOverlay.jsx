export default function GuideOverlay({ open, onClose }) {
  if (!open) return null
  return (
    <div className="guideLayer">
      <section className="guideBox compactGuideBox">
        <h2>快速開始</h2>
        <ol>
          <li>到「課程搜尋」找課。</li>
          <li>按＋把課加入暫存區。</li>
          <li>回「我的規劃」把暫存課放進課表。</li>
        </ol>
        <button onClick={onClose}>開始使用</button>
      </section>
    </div>
  )
}
