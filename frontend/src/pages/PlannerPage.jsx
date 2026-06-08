import { useState } from 'react'

function cleanupCandidateDragPreview() {
  document.querySelectorAll('.draggingSource').forEach((node) => node.classList.remove('draggingSource'))
  document.querySelectorAll('.dragImageClone').forEach((node) => node.remove())
}

function makeCandidateDragPreview(event) {
  const source = event.currentTarget
  if (!source || !event.dataTransfer) return

  cleanupCandidateDragPreview()

  const rect = source.getBoundingClientRect()
  const offsetX = Math.max(0, Math.min(rect.width, event.clientX - rect.left))
  const offsetY = Math.max(0, Math.min(rect.height, event.clientY - rect.top))
  const preview = source.cloneNode(true)
  preview.classList.remove('draggingSource')
  preview.classList.remove('dragFloatingClone')
  preview.classList.add('dragImageClone')
  preview.removeAttribute('draggable')
  preview.style.width = `${Math.max(120, rect.width)}px`
  preview.style.height = `${Math.max(64, rect.height)}px`
  preview.style.position = 'fixed'
  preview.style.top = '-1200px'
  preview.style.left = '-1200px'
  preview.style.zIndex = '99999'
  preview.style.pointerEvents = 'none'
  preview.style.margin = '0'
  preview.style.opacity = '1'
  preview.style.transform = 'none'
  preview.style.transition = 'none'
  document.body.appendChild(preview)

  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setDragImage(preview, Math.min(offsetX, rect.width / 2), Math.min(offsetY, rect.height / 2))

  window.requestAnimationFrame(() => source.classList.add('draggingSource'))

  const cleanup = () => cleanupCandidateDragPreview()
  document.addEventListener('drop', cleanup, { once: true })
  source.addEventListener('dragend', cleanup, { once: true })
  window.setTimeout(() => preview.remove(), 0)
}



export default function PlannerPage(props) {
  const [showManualCourse, setShowManualCourse] = useState(false)
  const [showPlanSchemes, setShowPlanSchemes] = useState(false)
  const [showAutoPlanModal, setShowAutoPlanModal] = useState(false)
  const [autoPlanResult, setAutoPlanResult] = useState(null)
  const [selectedSchemeId, setSelectedSchemeId] = useState('')
  const [autoPlanStart, setAutoPlanStart] = useState('大一上')
  const [autoPlanEnd, setAutoPlanEnd] = useState('大四下')
  const [manualCourse, setManualCourse] = useState({
    name: '',
    credits: '2',
    category: 'freeElective',
    type: '一般',
    note: '',
    includeGraduation: true,
    includeProgram: false,
  })

  function updateManualCourse(field, value) {
    setManualCourse((prev) => ({ ...prev, [field]: value }))
  }

  function submitManualCourse(e) {
    e.preventDefault()
    const name = manualCourse.name.trim()
    if (!name) {
      alert('請輸入課程名稱')
      return
    }
    const creditValue = Number(manualCourse.credits) || 0
    const manualId = `manual_${Date.now()}`
    const item = {
      uid: manualId,
      id: manualId,
      course_id: manualId,
      serial: manualId,
      code: '手動',
      name,
      teacher: manualCourse.type,
      credits: creditValue,
      credit: creditValue,
      semester_source: activeSemester?.endsWith('下') ? '1142CLASS' : '1141CLASS',
      category: manualCourse.category,
      required_type: manualCourse.category,
      time_info: manualCourse.note || '無固定時間',
      manual: true,
      manualType: manualCourse.type,
      includeGraduation: manualCourse.includeGraduation,
      includeProgram: manualCourse.includeProgram,
    }
    addCourseToSemester(item, activeSemester, 'planned')
    setShowManualCourse(false)
    setManualCourse({ name: '', credits: '2', category: 'freeElective', type: '一般', note: '', includeGraduation: true, includeProgram: false })
  }

  const {
    CreditStrip,
    plan,
    rules,
    scheduleExportRef,
    activeSemester,
    semesterAnimKey,
    SemesterGrid,
    handleDropCourse,
    autoPlace,
    openCoursePopover,
    searchEmptySlot,
    deletePlannedCourse,
    movePlannedToCandidate,
    SEMESTERS,
    switchSemester,
    save,
    undo,
    history,
    redo,
    future,
    download,
    candidates,
    favorites,
    snapshots,
    setSnapshots,
    restoreSnapshot,
    localReviews,
    tagVotes,
    importBackupFile,
    exportPngFromDom,
    exportCleanPng,
    exportExcel,
    exportCalendar,
    createSnapshot,
    dropToCandidates,
    candidateSearch,
    setCandidateSearch,
    candidateSort,
    setCandidateSort,
    filteredCandidates,
    getCourse,
    uid,
    openCourseInfo,
    credits,
    courseMatchesSemester,
    courseTermLabel,
    addCourseToSemester,
    removeCandidate,
    dropDelete,
    clearTimetable
  } = props

  function selectedAutoPlanSemesters() {
    const startIndex = SEMESTERS.indexOf(autoPlanStart)
    const endIndex = SEMESTERS.indexOf(autoPlanEnd)
    if (startIndex < 0 || endIndex < 0) return [activeSemester]
    const from = Math.min(startIndex, endIndex)
    const to = Math.max(startIndex, endIndex)
    return SEMESTERS.slice(from, to + 1)
  }

  function runAutoPlanRange() {
    if (!candidates.length) {
      setAutoPlanResult({
        empty: true,
        placed: 0,
        skipped: 0,
        bySemester: {},
        message: '暫存區目前沒有課程。'
      })
      return
    }
    const semesters = selectedAutoPlanSemesters()
    const result = autoPlace({ semesters }) || { placed: 0, skipped: candidates.length, bySemester: {} }
    setAutoPlanResult({
      empty: false,
      placed: result.placed || 0,
      skipped: result.skipped || 0,
      bySemester: result.bySemester || {},
      groups: result.groups || 0,
      alternatives: result.alternatives || 0,
      smartGrouped: Boolean(result.smartGrouped),
      message: '智慧排入完成'
    })
  }

  const selectedScheme = (snapshots || []).find((item) => String(item.id) === String(selectedSchemeId)) || null
  function createSchemeFromPlanner() {
    const name = window.prompt('方案名稱')?.trim()
    if (!name) return
    const next = { id: Date.now(), name, at: new Date().toLocaleString(), plan }
    setSnapshots?.((items) => [next, ...(items || [])])
    setSelectedSchemeId(String(next.id))
  }
  function replaceSchemeFromPlanner() {
    if (!selectedScheme) return
    if (!window.confirm(`確定要用目前課表替換「${selectedScheme.name}」嗎？`)) return
    setSnapshots?.((items) => (items || []).map((item) => String(item.id) === String(selectedScheme.id) ? { ...item, at: new Date().toLocaleString(), plan } : item))
  }
  function deleteSchemeFromPlanner() {
    if (!selectedScheme) return
    if (!window.confirm(`確定刪除「${selectedScheme.name}」嗎？刪除後無法復原。`)) return
    setSnapshots?.((items) => (items || []).filter((item) => String(item.id) !== String(selectedScheme.id)))
    setSelectedSchemeId('')
  }

  return (
    <>
              <CreditStrip plan={plan} rules={rules} />
              <div className="plannerLayout">
                <div className="workspace">
                  <div className="semesterScroller singleSemesterWorkspace"><div ref={scheduleExportRef} key={`${activeSemester}-${semesterAnimKey}`} className="semesterSlide exportScheduleCanvas"><SemesterGrid semester={activeSemester} courses={plan[activeSemester] || []} plan={plan} onDropCourse={handleDropCourse} onMoveCourse={autoPlace} onCourseClick={openCoursePopover} onEmptySlotClick={searchEmptySlot} onDeleteCourse={deletePlannedCourse} onMoveToCandidate={movePlannedToCandidate} /></div></div>
                </div>
                <aside className="plannerTools">
                  <section className="toolCard semesterPicker"><h3>切換學期</h3><div className="semesterButtons embedded">{SEMESTERS.map((sem) => <button key={sem} className={activeSemester === sem ? 'active' : ''} onClick={() => switchSemester(sem)}>{sem}</button>)}</div></section>
                  <section className="toolCard quickActions"><h3>操作</h3>
                    <div className="toolButtons plannerActionGrid"><button onClick={undo} disabled={!history.length}>復原</button><button onClick={redo} disabled={!future.length}>重做</button><button onClick={() => { save(); setShowPlanSchemes(true); }}>儲存快照</button><button onClick={() => exportExcel(plan)}>匯出試算表</button><button onClick={importBackupFile}>匯入文字</button><button onClick={() => download('uniplan.json', JSON.stringify({ plan, candidates, favorites, snapshots, localReviews, tagVotes }, null, 2), 'application/json;charset=utf-8')}>匯出文字</button><button onClick={async () => { await exportPngFromDom(scheduleExportRef.current, activeSemester); }}>匯出課表</button><button onClick={async () => { await exportCleanPng(plan, activeSemester); }}>匯出桌布</button><button onClick={() => exportCalendar(plan, activeSemester)}>匯出行事曆</button><button className="autoPlanOpenButton" disabled={!candidates.length} onClick={() => setShowAutoPlanModal(true)}>智慧排入</button><button className="dangerToolButton" onClick={() => clearTimetable?.('all')}>清除課表</button><button className="wideToolButton" onClick={() => setShowManualCourse(true)}>新增自訂課程</button></div></section>
                  <section className="toolCard candidateRail sideCandidateRail" onDragOver={(e) => e.preventDefault()} onDrop={dropToCandidates}>
                    <div className="railHead"><h3>暫存區</h3><span>{candidates.length} 門</span></div>
                    <div className="candidateSummary noCategoryMenu"><input value={candidateSearch} onChange={(e) => setCandidateSearch(e.target.value)} placeholder="搜尋暫存課程" /><select value={candidateSort} onChange={(e) => setCandidateSort(e.target.value)}><option value="added">加入順序</option><option value="name">課名</option><option value="credits">學分</option><option value="time">時間</option></select></div>
                    <div className="candidateList liveCandidateList">
                      {filteredCandidates.length ? filteredCandidates.map((c) => {
                        const course = getCourse(c)
                        return <article key={uid(c)} className="candidateLiveCard" data-drag-course-id={uid(c)} draggable onDragStart={(e) => { makeCandidateDragPreview(e); e.dataTransfer.setData('application/json', JSON.stringify({ source: 'candidate', course: c })) }}>
                          <button className="candidateLiveMain" onClick={() => openCourseInfo(c)}><strong>{course.name || '未命名課程'}</strong><span>{credits(c)} 學分</span><small>{course.time_info || course.time || '未列時間'}</small></button>
                          <div className="candidateLiveActions noCategoryMenu"><button disabled={!courseMatchesSemester(c, activeSemester)} title={!courseMatchesSemester(c, activeSemester) ? `這門課屬於 ${courseTermLabel(c)}，目前課表是 ${activeSemester}` : '加入目前課表'} onClick={() => addCourseToSemester(c, activeSemester, 'planned', { removeCandidate: true })}>{courseMatchesSemester(c, activeSemester) ? '加入' : '學期不符'}</button><button onClick={() => removeCandidate(c)}>移除</button></div>
                        </article>
                      }) : <p className="muted">尚未加入課程。</p>}
                    </div>
                  </section>
                  <div className="deleteZone sideDelete" onDragOver={(e) => e.preventDefault()} onDrop={dropDelete}>拖曳到此刪除</div>
                </aside>
              </div>


      {showAutoPlanModal && (
        <div className="manualCourseBackdrop autoPlanBackdrop" onMouseDown={() => setShowAutoPlanModal(false)}>
          <section className="manualCourseModal autoPlanModal" onMouseDown={(e) => e.stopPropagation()}>
            <header className="manualCourseHeader">
              <div><h3>智慧排入</h3><p>會自動把同課不同班分組，每組只選一班，找出較不衝堂且較有效率的組合。</p></div>
              <button type="button" onClick={() => setShowAutoPlanModal(false)}>×</button>
            </header>
            <div className="autoPlanRange modalAutoPlanRange">
              <label>起始學期<select value={autoPlanStart} onChange={(e) => setAutoPlanStart(e.target.value)}>{SEMESTERS.map((sem) => <option key={sem} value={sem}>{sem}</option>)}</select></label>
              <label>結束學期<select value={autoPlanEnd} onChange={(e) => setAutoPlanEnd(e.target.value)}>{SEMESTERS.map((sem) => <option key={sem} value={sem}>{sem}</option>)}</select></label>
            </div>
            <p className="muted autoPlanModalHint">目前將嘗試排入 {selectedAutoPlanSemesters().length} 個學期；同課不同班會自動擇優，不會整組全排。</p>
            <button className="primaryManualButton" disabled={!candidates.length} onClick={() => { runAutoPlanRange(); setShowAutoPlanModal(false); }}>開始智慧排入</button>
          </section>
        </div>
      )}

      {autoPlanResult && (
        <div className="manualCourseBackdrop autoPlanResultBackdrop" onMouseDown={() => setAutoPlanResult(null)}>
          <section className="manualCourseModal autoPlanResultModal" onMouseDown={(e) => e.stopPropagation()}>
            <header className="manualCourseHeader">
              <div>
                <h3>{autoPlanResult.message}</h3>
                <p>已排入 {autoPlanResult.placed} 門，未排入 {autoPlanResult.skipped} 門。{autoPlanResult.smartGrouped ? ` 已檢查 ${autoPlanResult.groups || 0} 組候選課程。` : ''}</p>
              </div>
              <button type="button" onClick={() => setAutoPlanResult(null)}>×</button>
            </header>
            {!autoPlanResult.empty && (
              <>
                <div className="autoPlanResultStats">
                  <span><b>{autoPlanResult.placed}</b> 已排入</span>
                  <span><b>{autoPlanResult.skipped}</b> 未排入</span>
                </div>
                <div className="autoPlanResultList">
                  <h4>分配結果</h4>
                  {Object.entries(autoPlanResult.bySemester || {}).length
                    ? Object.entries(autoPlanResult.bySemester || {}).map(([semester, count]) => (
                      <div key={semester}><span>{semester}</span><b>{count} 門</b></div>
                    ))
                    : <p className="muted">沒有可顯示的分配結果。</p>}
                </div>
                <p className="muted">未排入原因可能包含：學期不符、課表衝堂、重複課程、候選組已擇一或單學期超過 25 學分。</p>
              </>
            )}
            {autoPlanResult.empty && <p className="muted">{autoPlanResult.message}</p>}
            <button className="primaryManualButton" type="button" onClick={() => setAutoPlanResult(null)}>完成</button>
          </section>
        </div>
      )}

      {showPlanSchemes && (
        <div className="planSchemeBackdrop" onMouseDown={() => setShowPlanSchemes(false)}>
          <section className="planSchemeModal" onMouseDown={(e) => e.stopPropagation()}>
            <header className="manualCourseHeader"><div><h3>儲存快照 / 我的方案</h3><p>建立、替換或刪除你自己的課表方案。</p></div><button type="button" onClick={() => setShowPlanSchemes(false)}>×</button></header>
            <div className="planSchemeToolbar"><button onClick={createSchemeFromPlanner}>建立</button><button disabled={!selectedScheme} onClick={replaceSchemeFromPlanner}>替換</button><button disabled={!selectedScheme} onClick={deleteSchemeFromPlanner}>刪除</button></div>
            <div className="planSchemeModalList">
              {(snapshots || []).length ? (snapshots || []).map((scheme) => (
                <article key={scheme.id} className={String(selectedSchemeId) === String(scheme.id) ? 'active' : ''} onClick={() => setSelectedSchemeId(String(scheme.id))}>
                  <div><strong>{scheme.name}</strong><span>{scheme.at}</span></div>
                  <button type="button" onClick={(event) => { event.stopPropagation(); restoreSnapshot?.(scheme); setShowPlanSchemes(false) }}>套用</button>
                </article>
              )) : <div className="emptyPlanSchemes"><b>尚未建立方案</b><span>按「建立」即可保存目前課表。</span></div>}
            </div>
          </section>
        </div>
      )}

      {showManualCourse && (
        <div className="manualCourseBackdrop" onMouseDown={() => setShowManualCourse(false)}>
          <form className="manualCourseModal" onSubmit={submitManualCourse} onMouseDown={(e) => e.stopPropagation()}>
            <header className="manualCourseHeader"><div><h3>新增自訂課程</h3><p>可用於暑修、補修、抵免或跨校課程。</p></div><button type="button" onClick={() => setShowManualCourse(false)}>×</button></header>
            <label>課程名稱<input value={manualCourse.name} onChange={(e) => updateManualCourse('name', e.target.value)} placeholder="例如：暑修英文" /></label>
            <div className="manualCourseFields">
              <label>學分<input type="number" min="0" step="1" value={manualCourse.credits} onChange={(e) => updateManualCourse('credits', e.target.value)} /></label>
              <label>類型<select value={manualCourse.type} onChange={(e) => updateManualCourse('type', e.target.value)}><option>一般</option><option>暑修</option><option>補修</option><option>抵免</option><option>跨校</option><option>其他</option></select></label>
            </div>
            <label>學分分類<select value={manualCourse.category} onChange={(e) => updateManualCourse('category', e.target.value)}><option value="universityRequired">校必修</option><option value="collegeRequired">院必修</option><option value="departmentRequired">系必修</option><option value="departmentElective">系選修</option><option value="freeElective">自由選修</option></select></label>
            <label>備註<input value={manualCourse.note} onChange={(e) => updateManualCourse('note', e.target.value)} placeholder="例如：無固定時間、抵免來源" /></label>
            <div className="manualCourseChecks"><label><input type="checkbox" checked={manualCourse.includeGraduation} onChange={(e) => updateManualCourse('includeGraduation', e.target.checked)} />計入畢業模擬</label><label><input type="checkbox" checked={manualCourse.includeProgram} onChange={(e) => updateManualCourse('includeProgram', e.target.checked)} />計入學程模擬</label></div>
            <button type="submit" className="primaryManualButton">加入 {activeSemester}</button>
          </form>
        </div>
      )}
            </>
  )
}
