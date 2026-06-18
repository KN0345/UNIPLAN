import { credits, getCourse, uid } from '../../utils/coursePlanning'

function CandidateManagerModal({ open, onClose, candidates, filteredCandidates, search, setSearch, sort, setSort, onRemove, onSelect, onAddToSemester, activeSemester }) {
  if (!open) return null
  return (
    <div className="candidateModalLayer" onMouseDown={onClose}>
      <section className="candidateModal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="暫存區管理">
        <header className="candidateModalHeader"><div><h2>暫存區管理</h2><p>{candidates.length} 門課，可搜尋、排序、拖曳到目前課表或刪除區。</p></div><button className="miniClose" onClick={onClose}>×</button></header>
        <div className="candidateModalControls"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜尋課名或時間" /><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="added">加入順序</option><option value="name">課名</option><option value="credits">學分高到低</option><option value="time">上課時間</option></select></div>
        <div className="candidateManagerList">
          {filteredCandidates.length ? filteredCandidates.map((course) => {
            const c = getCourse(course)
            return <article className="candidateManagerCard" key={uid(course)} draggable onDragStart={(e) => e.dataTransfer.setData('application/json', JSON.stringify({ source: 'candidate', course }))}>
              <button className="candidateCardMain" onClick={() => onSelect(course)}><strong>{c.name || '未命名課程'}</strong><span>{credits(course)} 學分｜{c.time_info || c.time || '未列時間'}</span></button>
              <div className="candidateCardActions"><button onClick={() => onAddToSemester(course, activeSemester)}>加入{activeSemester}</button><button onClick={() => onRemove(course)}>移除</button></div>
            </article>
          }) : <div className="emptySearch">沒有符合條件的暫存課程。</div>}
        </div>
      </section>
    </div>
  )
}

export default CandidateManagerModal
