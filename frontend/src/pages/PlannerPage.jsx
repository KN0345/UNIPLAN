import { useState } from 'react'
export default function PlannerPage(props) {
  const [showManualCourse, setShowManualCourse] = useState(false)
  const [showPlanSchemes, setShowPlanSchemes] = useState(false)
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
    dropDelete
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
      alert('暫存區目前沒有課程。')
      return
    }
    const semesters = selectedAutoPlanSemesters()
    const result = autoPlace({ semesters }) || { placed: 0, skipped: candidates.length, bySemester: {} }
    const placedText = Object.entries(result.bySemester || {}).map(([semester, count]) => `${semester}：${count} 門`).join('\n') || '無'
    alert(`一鍵排入完成\n\n已排入：${result.placed || 0} 門\n未排入：${result.skipped || 0} 門\n\n分配結果：\n${placedText}\n\n未排入原因可能包含：學期不符、課表衝堂、重複課程或單學期超過 25 學分。`)
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
                  <section className="toolCard quickActions"><h3>操作</h3><div className="toolButtons plannerActionGrid"><button onClick={undo} disabled={!history.length}>復原</button><button onClick={redo} disabled={!future.length}>重做</button><button onClick={() => { save(); setShowPlanSchemes(true); }}>儲存快照</button><button onClick={() => exportExcel(plan)}>匯出試算表</button><button onClick={importBackupFile}>匯入文字</button><button onClick={() => download('uniplan.json', JSON.stringify({ plan, candidates, favorites, snapshots, localReviews, tagVotes }, null, 2), 'application/json;charset=utf-8')}>匯出文字</button><button onClick={async () => { await exportPngFromDom(scheduleExportRef.current, activeSemester); }}>匯出課表</button><button onClick={async () => { await exportCleanPng(plan, activeSemester); }}>匯出桌布</button><button onClick={() => exportCalendar(plan, activeSemester)}>匯出行事曆</button><button className="wideToolButton" onClick={() => setShowManualCourse(true)}>新增自訂課程</button></div></section>
                  <section className="toolCard autoPlanCard">
                    <div className="railHead"><h3>一鍵排入</h3><span>{selectedAutoPlanSemesters().length} 學期</span></div>
                    <p>自動把暫存區課程分配到指定學期範圍，優先避開衝堂、重複課程與單學期 25 學分上限。</p>
                    <div className="autoPlanRange">
                      <label>起始<select value={autoPlanStart} onChange={(e) => setAutoPlanStart(e.target.value)}>{SEMESTERS.map((sem) => <option key={sem} value={sem}>{sem}</option>)}</select></label>
                      <label>結束<select value={autoPlanEnd} onChange={(e) => setAutoPlanEnd(e.target.value)}>{SEMESTERS.map((sem) => <option key={sem} value={sem}>{sem}</option>)}</select></label>
                    </div>
                    <button className="autoPlanButton" disabled={!candidates.length} onClick={runAutoPlanRange}>自動排入暫存區</button>
                    <small>排入後會從暫存區移除；無法排入者會保留。</small>
                  </section>
                  <section className="toolCard candidateRail sideCandidateRail" onDragOver={(e) => e.preventDefault()} onDrop={dropToCandidates}>
                    <div className="railHead"><h3>暫存區</h3><span>{candidates.length} 門</span></div>
                    <div className="candidateSummary noCategoryMenu"><input value={candidateSearch} onChange={(e) => setCandidateSearch(e.target.value)} placeholder="搜尋暫存課程" /><select value={candidateSort} onChange={(e) => setCandidateSort(e.target.value)}><option value="added">加入順序</option><option value="name">課名</option><option value="credits">學分</option><option value="time">時間</option></select></div>
                    <div className="candidateList liveCandidateList">
                      {filteredCandidates.length ? filteredCandidates.map((c) => {
                        const course = getCourse(c)
                        return <article key={uid(c)} className="candidateLiveCard" draggable onDragStart={(e) => e.dataTransfer.setData('application/json', JSON.stringify({ source: 'candidate', course: c }))}>
                          <button className="candidateLiveMain" onClick={() => openCourseInfo(c)}><strong>{course.name || '未命名課程'}</strong><span>{credits(c)} 學分</span><small>{course.time_info || course.time || '未列時間'}</small></button>
                          <div className="candidateLiveActions noCategoryMenu"><button disabled={!courseMatchesSemester(c, activeSemester)} title={!courseMatchesSemester(c, activeSemester) ? `這門課屬於 ${courseTermLabel(c)}，目前課表是 ${activeSemester}` : '加入目前課表'} onClick={() => addCourseToSemester(c, activeSemester, 'planned', { removeCandidate: true })}>{courseMatchesSemester(c, activeSemester) ? '加入' : '學期不符'}</button><button onClick={() => removeCandidate(c)}>移除</button></div>
                        </article>
                      }) : <p className="muted">尚未加入課程。</p>}
                    </div>
                  </section>
                  <div className="deleteZone sideDelete" onDragOver={(e) => e.preventDefault()} onDrop={dropDelete}>拖曳到此刪除</div>
                </aside>
              </div>


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
