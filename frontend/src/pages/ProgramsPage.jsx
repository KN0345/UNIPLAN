import { useMemo, useState } from 'react'
import { fetchCourses } from '../api'
import { PROGRAM_RULE_TYPES } from '../data/programs/programTypes'
import { PROGRAMS, programStatusLabel } from '../data/programs/programData'
import { evaluateProgram, matchCourse } from '../data/programs/programProgress'
import { courseStatus, extractCourseList } from '../utils/coursePlanning'

function norm(value) {
  return String(value || '').replace(/[（）()\s:：／/\-—_]/g, '').toLowerCase()
}
function stripClassSuffix(value) {
  return String(value || '')
    .replace(/\s*[（(][A-ZＰPＯO0-9一二三四五六七八九十甲乙丙丁戊己庚辛壬癸]*班[）)]\s*$/i, '')
    .replace(/\s*[（(][^）)]*班[）)]\s*$/i, '')
    .trim()
}
function normBase(value) {
  return norm(stripClassSuffix(value))
}
const COURSE_NAME_ALIASES = {
  [normBase('人工智慧')]: ['人工智慧', '人工智慧導論', '人工智慧概論', '人工智慧實務'],
}
function acceptableProgramNames(programCourse) {
  const base = normBase(programCourse?.name)
  const aliases = COURSE_NAME_ALIASES[base] || []
  return new Set([base, ...aliases.map(normBase)].filter(Boolean))
}
function getCourse(course) {
  return course?.course || course || {}
}
function courseName(course) {
  return String(getCourse(course).name || getCourse(course).course_name || '').trim()
}
function courseCredits(course) {
  const raw = getCourse(course).credits ?? getCourse(course).credit ?? 0
  const match = String(raw).match(/\d+(\.\d+)?/)
  return Number(match ? match[0] : raw) || 0
}
function courseTime(course) {
  const c = getCourse(course)
  return c.time_info || c.time || c.period || '未列時間'
}
function stripSchoolName(name) {
  return String(name || '').replace(/^淡江大學/, '')
}
function catalogMatches(programCourse, courses = []) {
  const targets = acceptableProgramNames(programCourse)
  if (!targets.size) return []
  const seen = new Set()
  return courses.filter((course) => {
    const name = normBase(courseName(course))
    const ok = name && targets.has(name)
    if (!ok) return false
    const c = getCourse(course)
    const key = `${courseName(course)}-${c.teacher || ''}-${c.serial || c.code || c.id || ''}-${courseTime(course)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).slice(0, 24)
}
function findCatalogMatch(programCourse, courses = []) {
  return catalogMatches(programCourse, courses)[0] || null
}
function minCourseTarget(group) {
  return (group.rules || []).find((rule) => rule.type === PROGRAM_RULE_TYPES.MIN_COURSE || rule.type === PROGRAM_RULE_TYPES.SELECT_N_OF_M)?.count || 0
}
function maxCourseTarget(group) {
  return (group.rules || []).find((rule) => rule.type === PROGRAM_RULE_TYPES.MAX_COURSE)?.count || 0
}
function minCreditTarget(group) {
  return (group.rules || []).find((rule) => rule.type === PROGRAM_RULE_TYPES.MIN_CREDIT)?.credits || 0
}
function maxCreditCap(group) {
  return (group.rules || []).find((rule) => rule.type === PROGRAM_RULE_TYPES.MAX_CREDIT)?.credits || 0
}
function flattenProgramGroups(groups = []) {
  return (groups || []).flatMap((group) => [group, ...flattenProgramGroups(group.children || [])]).filter((group) => (group.courses || []).length || (group.rules || []).length)
}
function programCourseList(program) {
  return flattenProgramGroups(program?.groups || []).flatMap((group) => group.courses || [])
}
function isRequiredGroup(group) {
  return /必修|共同必修|核心/.test(group.name || '') && !(group.rules || []).some((r) => r.type === PROGRAM_RULE_TYPES.MAX_COURSE)
}
function groupHint(group) {
  const minCourse = minCourseTarget(group)
  const maxCourse = maxCourseTarget(group)
  const minCredit = minCreditTarget(group)
  if (maxCourse) return `採計${maxCourse}門`
  if (minCourse) return `至少${minCourse}門`
  if (minCredit) return `至少${minCredit}學分`
  return isRequiredGroup(group) ? '固定' : '自選'
}
function programSelectedKeys(programId, selected) {
  return Object.entries(selected).filter(([key]) => key.startsWith(`${programId}:`)).flatMap(([, list]) => list)
}
function isCompletedProgramMatch(programCourse, pool) {
  return Boolean(matchCourse(programCourse, (pool || []).filter(({ course }) => courseStatus(course) === 'completed')))
}
function isPlannedProgramMatch(programCourse, pool) {
  return Boolean(matchCourse(programCourse, (pool || []).filter(({ course }) => courseStatus(course) !== 'completed' && courseStatus(course) !== 'failed')))
}
function courseButtonState({ done, planned, chosen, required, unavailable }) {
  if (done) return 'done'
  if (planned || chosen) return 'selected'
  if (unavailable) return 'unavailable'
  if (required) return 'required'
  return 'normal'
}
function statusText(program) {
  if (program.status === 'ACTIVE') return ''
  return programStatusLabel(program.status)
}
function getProfileDepartment(profile = {}) {
  return String(profile.department || profile.dept || profile.major || '')
}
function effectiveProgramForProfile(program, profile = {}) {
  if (program.id !== 'C016') return program
  const dept = getProfileDepartment(profile)
  const groups = program.groups || []
  if (/教科|教育科技/.test(dept)) return { ...program, groups: groups.filter((group) => group.id === 'track-b') }
  if (/企管|企業管理/.test(dept)) return { ...program, groups: groups.filter((group) => group.id === 'track-a') }
  return program
}
function groupProgress(group, picked, pool, courses) {
  const names = [...new Set([...(group.courses || []).filter((pc) => matchCourse(pc, pool)).map((pc) => pc.name), ...Array.from(picked || [])])]
  const credit = names.reduce((sum, name) => {
    const pc = (group.courses || []).find((item) => item.name === name)
    const matched = pc && findCatalogMatch(pc, courses)
    return sum + (pc?.credits || courseCredits(matched) || 0)
  }, 0)
  const minCourse = minCourseTarget(group)
  const maxCourse = maxCourseTarget(group)
  const minCredit = minCreditTarget(group)
  const capCredit = maxCreditCap(group)
  const effectiveCredit = capCredit ? Math.min(credit, capCredit) : credit
  const target = minCredit || minCourse || maxCourse || 0
  const current = minCredit ? effectiveCredit : names.length
  const percent = target ? Math.min(100, Math.round((current / target) * 100)) : (current ? 100 : 0)
  const reached = target ? current >= target : Boolean(current)
  const label = minCredit ? `${effectiveCredit}/${target}學分${capCredit && credit > capCredit ? `（已選${credit}）` : ''}` : target ? `${names.length}/${target}門` : `${names.length}門`
  return { current, target, percent, reached, label, unit: minCredit ? '學分' : '門', rawCredit: credit, effectiveCredit, capCredit }
}
function dedupeCourseKey(course) {
  const c = getCourse(course)
  return `${c.name || ''}-${c.teacher || ''}-${c.serial || c.code || c.id || ''}-${courseTime(c)}`
}
function isAlreadyInPool(candidate, pool) {
  const target = norm(courseName(candidate))
  const key = dedupeCourseKey(candidate)
  return pool.some(({ course }) => {
    const c = getCourse(course)
    return dedupeCourseKey(c) === key || (target && norm(courseName(c)) === target)
  })
}

export default function ProgramsPage({ profile, plan, candidates, favorites, courses = [], onAddCandidate, onOpenCourseInfo }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('ALL')
  const [activeProgramId, setActiveProgramId] = useState(PROGRAMS[0]?.id || '')
  const [selected, setSelected] = useState({})
  const [coursePicker, setCoursePicker] = useState(null)
  const context = useMemo(() => ({ plan, candidates, favorites }), [plan, candidates, favorites])
  const rows = useMemo(() => PROGRAMS.map((program) => evaluateProgram(effectiveProgramForProfile(program, profile), context)), [context, profile])
  const filtered = rows.filter(({ program }) => {
    const q = query.trim().toLowerCase()
    const okQuery = !q || `${program.code} ${program.name} ${program.college} ${program.unit}`.toLowerCase().includes(q)
    const okStatus = status === 'ALL' || program.status === status
    return okQuery && okStatus
  })
  const active = rows.find((row) => row.program.id === activeProgramId) || filtered[0] || rows[0]
  const pool = useMemo(() => [
    ...Object.values(plan || {}).flat().filter((course) => courseStatus(course) !== 'failed').map((course) => ({ course, source: '已排' })),
    ...(candidates || []).map((course) => ({ course, source: '暫存' })),
  ], [plan, candidates, favorites])
  const activeSelectedNames = active ? programSelectedKeys(active.program.id, selected) : []
  const selectedCount = activeSelectedNames.length
  const selectedCredit = activeSelectedNames.reduce((sum, name) => {
    const pc = programCourseList(active?.program).find((course) => course.name === name)
    const matched = pc && findCatalogMatch(pc, courses)
    return sum + (pc?.credits || courseCredits(matched) || 0)
  }, 0)

  function selectedSet(groupId) {
    return new Set(selected[`${active?.program?.id}:${groupId}`] || [])
  }
  function toggleCourse(group, programCourse) {
    const groupKey = `${active.program.id}:${group.id}`
    const current = new Set(selected[groupKey] || [])
    const key = programCourse.name
    if (current.has(key)) current.delete(key)
    else current.add(key)
    setSelected((prev) => ({ ...prev, [groupKey]: [...current] }))
  }
  function addSelectedToCandidate() {
    if (!active || !onAddCandidate) return
    const unique = [...new Set(programSelectedKeys(active.program.id, selected))]
    unique.forEach((name) => {
      const programCourse = programCourseList(active.program).find((c) => c.name === name) || { name }
      const matched = findCatalogMatch(programCourse, courses)
      const alreadyDone = isCompletedProgramMatch(programCourse, pool)
      const alreadyPlanned = isPlannedProgramMatch(programCourse, pool)
      if (alreadyDone || alreadyPlanned) return
      onAddCandidate(matched || { name, credits: programCourse.credits || 0, time_info: '', teacher: '', source: 'program' })
    })
  }
  function addVariantToCandidate(programCourse, variant) {
    if (!variant || !onAddCandidate) return
    if (!isAlreadyInPool(variant, pool)) onAddCandidate(getCourse(variant))
    setCoursePicker(null)
  }

  async function openCoursePicker(programCourse) {
    const localMatches = catalogMatches(programCourse, courses)
    setCoursePicker({ programCourse, matches: localMatches, loading: true, source: localMatches.length ? '目前清單' : '搜尋中' })
    try {
      const payload = await fetchCourses({ keyword: programCourse?.name || '', semester: '全部' })
      const dbCourses = extractCourseList(payload)
      const globalMatches = catalogMatches(programCourse, dbCourses)
      const merged = []
      const seen = new Set()
      ;[...localMatches, ...globalMatches].forEach((item) => {
        const key = dedupeCourseKey(item)
        if (!seen.has(key)) {
          seen.add(key)
          merged.push(item)
        }
      })
      setCoursePicker({ programCourse, matches: merged, loading: false, source: globalMatches.length ? '全課程資料庫' : '目前清單' })
    } catch (error) {
      console.error(error)
      setCoursePicker({ programCourse, matches: localMatches, loading: false, source: localMatches.length ? '目前清單' : '搜尋失敗' })
    }
  }

  return <section className="pageCard programPage programChooserPage">
    <div className="pageHead compactHead"><div><h2>學程選課</h2><p className="muted">選好課程後加入暫存區，再回課表確認時間。</p></div></div>
    <div className="programToolbar compactToolbar"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜尋學程" /><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="ALL">全部</option><option value="ACTIVE">已建規則</option><option value="PARTIAL">部分規則</option><option value="NEEDS_RULES">待補規則</option></select></div>
    <div className="programChooserLayout">
      <aside className="programPickerList">{filtered.map((row) => <button key={row.program.id} className={row.program.id === active?.program?.id ? 'active' : ''} onClick={() => setActiveProgramId(row.program.id)}><strong>{stripSchoolName(row.program.name)}</strong><span>{row.percent}%</span>{statusText(row.program) && <small>{statusText(row.program)}</small>}</button>)}</aside>
      {active && <div className="programChoicePanel">
        <div className="programChoiceHead compactStickyAction"><div><span>{active.totalCurrent}/{active.totalTarget}</span><small>已選 {selectedCount} 門｜{selectedCredit} 學分</small></div><button disabled={!selectedCount} onClick={addSelectedToCandidate}>加入暫存區</button></div>
        {flattenProgramGroups(active.program.groups || []).map((group) => {
          const picked = selectedSet(group.id)
          const required = isRequiredGroup(group)
          const progress = groupProgress(group, picked, pool, courses)
          return <section className="programChoiceGroup" key={group.id}>
            <div className="programChoiceGroupHead"><div><h4>{group.name}</h4><span>{groupHint(group)}{progress.reached ? '｜已達建議門檻，可繼續加選' : ''}</span></div><b>{progress.label}</b></div>
            <div className="programGroupProgress"><i style={{ width: `${progress.percent}%` }} /></div>
            <div className="programCourseList">{(group.courses || []).map((programCourse) => {
              const done = isCompletedProgramMatch(programCourse, pool)
              const planned = isPlannedProgramMatch(programCourse, pool)
              const chosen = picked.has(programCourse.name)
              const matches = catalogMatches(programCourse, courses)
              const unavailable = !matches.length && !done && !planned
              const state = courseButtonState({ done, planned, chosen, required, unavailable })
              return <article key={`${group.id}-${programCourse.name}`} className={`programCourseRow ${state}`}>
                <button type="button" disabled={done} className="programCourseMainButton" onClick={() => toggleCourse(group, programCourse)} title={done ? '已修過，已完成此項' : planned ? '已在暫存或課表中' : unavailable ? '本學期找不到同名開課，仍可先規劃' : '點選選擇'}>
                  <strong>{programCourse.name}</strong>
                  <span>{programCourse.credits ? `${programCourse.credits}學分` : groupHint(group)}</span>
                </button>
                <button type="button" className="programCourseInfoDot" aria-label="選擇開課班別" onClick={(event) => { event.stopPropagation(); openCoursePicker(programCourse) }}>i</button>
              </article>
            })}</div>
          </section>
        })}
      </div>}
    </div>
    {coursePicker && <div className="programCourseModalOverlay" onMouseDown={(event) => { if (event.target.className === 'programCourseModalOverlay') setCoursePicker(null) }}>
      <section className="programCourseModal">
        <header><div><h3>{coursePicker.programCourse.name}</h3><p>依課名搜尋全課程資料庫，請選擇想放入暫存區的班別。</p>{coursePicker.source && <small>來源：{coursePicker.source}</small>}</div><button className="modalCloseButton" onClick={() => setCoursePicker(null)} aria-label="關閉">×</button></header>
        <div className="programCourseVariantList">
          {coursePicker.loading ? <div className="emptyVariantBox"><b>正在搜尋全課程資料庫</b><p>請稍候，系統正在依課名查找所有可用班別。</p></div> : coursePicker.matches?.length ? coursePicker.matches.map((match) => {
            const mc = getCourse(match)
            const already = isAlreadyInPool(mc, pool)
            return <article key={dedupeCourseKey(mc)}>
              <button className="variantInfoButton" onClick={() => onOpenCourseInfo?.(mc)}><b>{mc.name || coursePicker.programCourse.name}</b><span>{mc.serial || mc.code || '無序號'}</span></button>
              <p>{mc.teacher || '未列教師'}｜{courseTime(mc)}｜{mc.credits || mc.credit || coursePicker.programCourse.credits || 0}學分</p>
              <button disabled={already} onClick={() => addVariantToCandidate(coursePicker.programCourse, mc)}>{already ? '已在規劃中' : '加入暫存區'}</button>
            </article>
          }) : <div className="emptyVariantBox"><b>本學期找不到同名開課</b><p>仍可先在學程中選取作為規劃目標，等課程資料補齊後再選班別。</p></div>}
        </div>
      </section>
    </div>}
  </section>
}
