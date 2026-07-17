import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import CompareTable from '../components/compare/CompareTable'
import { courseKey } from '../utils/coursePlanning'


function normalizeOptionText(value = '') {
  return String(value || '').replace(/[（）()\s:：／/\-—_\.．。]/g, '').toLowerCase()
}


const KNOWN_DEPARTMENT_CODE_ALIASES = {
  TGAXM: ['文學院共同科碩', '文學院共同科－碩', '文學院共同科-碩', '文學院共同科', '文學院碩士共同科'],
  TGDXM: ['教育學院共同科碩', '教育學院共同－碩', '教育學院共同科-碩', '教育學院共同科', '教育學院碩士共同科'],
  TGEXM: ['工學院共同科碩', '工學院共同－碩', '工學院共同科-碩', '工學院共同科', '工學院碩士共同科'],
  TGKXM: ['創智學院共同科碩', '創智學院共同科-碩', '創智學院共同－碩', '創智學院共同科', 'AI學院共同科碩'],
  TGLXM: ['商管學院共同科碩', '商管學院共同－碩', '商管學院共同科-碩', '商管學院共同科', '商管學院碩士共同科'],
  TGSXM: ['理學院共同科碩', '理學院共同－碩', '理學院共同科-碩', '理學院共同科', '理學院碩士共同科'],
  TGAXB: ['文學院共同科日', '文學院共同科', '文學院共同科學士', '文學院共同科－日'],
  TGDXB: ['教育學院共同科日', '教育學院共同科', '教育學院共同科學士', '教育學院共同科－日'],
  TGEXB: ['工學院共同科日', '工學院共同科', '工學院共同科學士', '工學院共同科－日'],
  TGKXB: ['創智學院共同科日', '創智學院共同科', '創智學院共同科學士', 'AI學院共同科'],
  TGLXB: ['商管學院共同科日', '商管學院共同科', '商管學院共同科學士', '商管學院共同科－日'],
  TGRXB: ['國際學院共同科日', '國際學院共同科', '國際學院共同科學士', '國際學院共同科－日'],
  TGSXB: ['理學院共同科日', '理學院共同科', '理學院共同科學士', '理學院共同科－日'],
  TGAHB: ['文學院榮譽學程', '文學榮譽學程'],
  TGDHB: ['教育榮譽學程', '教育學院榮譽學程'],
  TGEHB: ['工學院榮譽學程', '工程榮譽學程'],
  TGKHB: ['AI榮譽學程', '創智榮譽學程', '創智學院榮譽學程'],
  TGLBH: ['商管榮譽學程', '商管學院榮譽學程'],
  TGRHB: ['國際榮譽學程', '國際學院榮譽學程'],
  TGSHB: ['理學院榮譽學程', '理學榮譽學程'],
  TGFHB: ['外語榮譽學程', '外語學院榮譽學程'],
}


const GENERIC_DEPARTMENT_ALIASES = [
  ['教育科技學系', '教育科技 教育科技系 教科 教科系 教育科系學系 教育科技學習'],
  ['教科系', '教育科技 教育科技系 教育科技學系 教育科系學系'],
  ['資訊工程學系', '資訊工程 資訊工程系 資工 資工系'],
  ['中國文學學系', '中國文學 中國文學系 中文 中文系'],
  ['企業管理學系', '企業管理 企業管理系 企管 企管系'],
  ['資訊管理學系', '資訊管理 資訊管理系 資管 資管系'],
  ['觀光事業學系', '觀光 觀光系 觀光事業 觀光事業系'],
  ['大眾傳播學系', '大眾傳播 大傳 大傳系 大傳系日'],
  ['英文學系', '英文 英文系 英文學系'],
  ['歷史學系', '歷史 歷史系'],
  ['國際企業學系', '國際企業 國企 國企系'],
  ['財務金融學系', '財務金融 財金 財金系'],
  ['會計學系', '會計 會計系'],
]

function genericDepartmentAliases(value = '') {
  const raw = String(value || '')
  const normalized = normalizeOptionText(raw)
  const out = []
  GENERIC_DEPARTMENT_ALIASES.forEach(([name, aliases]) => {
    const text = normalizeOptionText(`${name} ${aliases}`)
    if (normalized && (text.includes(normalized) || normalized.includes(normalizeOptionText(name)))) out.push(name, aliases)
    if (raw.includes(name)) out.push(aliases)
  })
  return out
}

function departmentOptionSearchText(value = '') {
  const raw = String(value || '').trim()
  const code = raw.match(/^([A-Za-z]{2,6}[A-Za-z0-9]{0,4})/)?.[1]?.toUpperCase()
  const parts = [raw]
  if (code) parts.push(code, ...(KNOWN_DEPARTMENT_CODE_ALIASES[code] || []))
  Object.entries(KNOWN_DEPARTMENT_CODE_ALIASES).forEach(([key, names]) => {
    names.forEach((name) => {
      if (raw.includes(name)) parts.push(key)
    })
  })
  genericDepartmentAliases(raw).forEach((item) => parts.push(item))
  return normalizeOptionText(parts.join(' '))
}


function normalizeDepartmentDisplayName(name = '') {
  let text = String(name || '').trim()
  text = text
    .replace(/共同科?日$/, '共同科－日')
    .replace(/共同科?碩$/, '共同科－碩')
    .replace(/共同科?博$/, '共同科－博')
    .replace(/共同碩專$/, '共同科－碩專')
    .replace(/學院共同－碩$/, '學院共同科－碩')
  if (/^榮譽進階/.test(text)) text = text.replace(/^榮譽進階專業?－?/, '').replace(/^榮譽進階－?/, '') + '榮譽學程'
  const honorCollege = { 文: '文學院', 教: '教育學院', 工: '工學院', 外: '外語學院', 商: '商管學院', 國: '國際學院', 理: '理學院', 'ＡＩ': 'AI', AI: 'AI' }
  Object.entries(honorCollege).forEach(([key, value]) => {
    if (text === `${key}榮譽學程`) text = `${value}榮譽學程`
  })
  return text
}

function departmentOptionLabel(value = '') {
  const raw = String(value || '').trim()
  if (raw === '全部') return '全部'
  const matched = raw.match(/^([A-Za-z]{2,6}[A-Za-z0-9]{0,4})[.．。]?(.*)$/)
  if (!matched) return raw
  const code = matched[1].toUpperCase()
  const name = normalizeDepartmentDisplayName(matched[2] || raw)
  return name && name !== code ? `${name}（${code}）` : code
}

function DepartmentFilter({ value, options = [], onChange }) {
  const [open, setOpen] = useState(false)
  const [draftValue, setDraftValue] = useState(value === '全部' ? '' : value)
  useEffect(() => { setDraftValue(value === '全部' ? '' : value) }, [value])
  const deferredDraftValue = useDeferredValue(draftValue)
  const filteredOptions = useMemo(() => {
    const keyword = normalizeOptionText(deferredDraftValue)
    const list = (options || []).filter((item) => item && item !== '全部')
    const matched = keyword ? list.filter((item) => departmentOptionSearchText(item).includes(keyword)) : list
    return ['全部', ...matched.slice(0, 120)]
  }, [options, deferredDraftValue])
  const choose = (item) => {
    const next = item || '全部'
    onChange(next)
    setDraftValue(next === '全部' ? '' : next)
    setOpen(false)
  }
  const commitDraft = () => {
    const text = draftValue.trim()
    if (!text) return choose('全部')
    const exact = (options || []).find((item) => normalizeOptionText(item) === normalizeOptionText(text))
    const fuzzy = filteredOptions.find((item) => item !== '全部')
    choose(exact || fuzzy || text)
  }
  return (
    <label className="departmentFilterField">科系
      <div className="departmentCombo" onBlur={() => window.setTimeout(() => { setOpen(false); commitDraft() }, 120)}>
        <input
          className="filterTextInput departmentUnifiedInput"
          value={draftValue}
          onFocus={() => setOpen(true)}
          onChange={(e) => { setDraftValue(e.target.value); setOpen(true) }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitDraft() } }}
          placeholder="全部／輸入科系或代碼"
        />
        {draftValue ? <button type="button" className="departmentClearButton" onMouseDown={(e) => e.preventDefault()} onClick={() => choose('全部')}>×</button> : null}
        {open && <div className="departmentComboMenu">
          {filteredOptions.map((item) => <button type="button" key={`dept-option-${item}`} className={item === value ? 'active' : ''} onMouseDown={(e) => e.preventDefault()} onClick={() => choose(item)}>{departmentOptionLabel(item)}</button>)}
          {filteredOptions.length === 1 && draftValue ? <div className="departmentComboEmpty">沒有相符科系，仍會用輸入文字篩選</div> : null}
        </div>}
      </div>
    </label>
  )
}

export default function CourseSearchPage(props) {
  const {
    searchTab,
    setSearchTab,
    favorites,
    runCourseSearch,
    query,
    setQuery,
    searchLoading,
    courseCatalogTerm,
    setCourseCatalogTerm,
    COURSE_CATALOG_TERMS,
    searchFilters,
    setSearchFilters,
    majorOptions,
    departmentOptions,
    gradeOptions,
    DAYS,
    PERIODS,
    setSearchOnlyAvailable,
    setSearchSort,
    searchSort,
    searchOnlyAvailable,
    activeSemester,
    searchError,
    sortedFilteredCourses,
    CourseCard,
    uid,
    openCourseInfo,
    addCandidate,
    toggleFavorite,
    candidates,
    courseKey: propCourseKey,
    isCourseAlreadyPlanned,
    plan,
    courseRecommendationBadges,
    findConflict,
    tagVotes,
    courseTagOptions = []
  } = props
  const getKey = propCourseKey || courseKey
  const [compareOpen, setCompareOpen] = useState(false)
  const [compareKeys, setCompareKeys] = useState([])
  const compareCourses = useMemo(() => sortedFilteredCourses.filter((course) => compareKeys.includes(getKey(course))).slice(0, 4), [sortedFilteredCourses, compareKeys])
  const favoriteKeySet = useMemo(() => new Set((favorites || []).map((course) => getKey(course))), [favorites, getKey])
  const candidateKeySet = useMemo(() => new Set((candidates || []).map((course) => getKey(course))), [candidates, getKey])
  const activePlanCourses = useMemo(() => plan?.[activeSemester] || [], [plan, activeSemester])
  const toggleCompare = (course) => {
    const key = getKey(course)
    setCompareKeys((prev) => {
      if (prev.includes(key)) return prev.filter((item) => item !== key)
      if (prev.length >= 4) return prev
      return [...prev, key]
    })
  }

  const preserveSearchScroll = (action) => {
    const root = document.querySelector('.content')
    const windowY = window.scrollY
    const rootY = root?.scrollTop
    action()
    requestAnimationFrame(() => {
      if (root) root.scrollTop = rootY
      window.scrollTo({ top: windowY, left: window.scrollX, behavior: 'auto' })
    })
  }

  return (
    <section className="searchPage singleColumn">
              <div className="searchColumn">
                <div className="searchTabs"><button className={searchTab === 'results' ? 'active' : ''} onClick={() => setSearchTab('results')}>搜尋結果</button><button className={searchTab === 'favorites' ? 'active' : ''} onClick={() => setSearchTab('favorites')}>我的收藏 {favorites.length}</button></div>
                {searchTab === 'results' && <><form className="courseSearchToolbar" onSubmit={(e) => { e.preventDefault(); runCourseSearch() }}>
                  <input className="searchInput" type="text" placeholder="輸入課程名稱或課號" value={query} onChange={(e) => setQuery(e.target.value)} />
                  <button className="searchButton" type="submit" disabled={searchLoading}>{searchLoading ? '搜尋中' : '搜尋'}</button>
                </form>
                <div className="courseFilters">
                  <label>課程來源<select value={courseCatalogTerm} onChange={(e) => setCourseCatalogTerm(e.target.value)}>{COURSE_CATALOG_TERMS.map((term) => <option key={term.value} value={term.value}>{term.label}</option>)}</select></label>
                  <DepartmentFilter value={searchFilters.department} options={departmentOptions} onChange={(department) => setSearchFilters((f) => ({ ...f, department }))} />
                  <label>必/選修<select value={searchFilters.requirement} onChange={(e) => setSearchFilters((f) => ({ ...f, requirement: e.target.value }))}><option>全部</option><option>必修</option><option>選修</option></select></label>
                  <label>年級<select value={searchFilters.grade} onChange={(e) => setSearchFilters((f) => ({ ...f, grade: e.target.value }))}><option>全部</option>{gradeOptions.map((item) => <option key={`grade-${item}`} value={item}>{item}</option>)}</select></label>
                  <label>星期<select value={searchFilters.weekday} onChange={(e) => setSearchFilters((f) => ({ ...f, weekday: e.target.value }))}><option>全部</option>{DAYS.map((day) => <option key={day}>{day}</option>)}</select></label>
                  <label>節次<select value={searchFilters.period} onChange={(e) => setSearchFilters((f) => ({ ...f, period: e.target.value }))}><option>全部</option>{PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}</select></label>
                  <label>標籤<select value={searchFilters.tag || '全部'} onChange={(e) => setSearchFilters((f) => ({ ...f, tag: e.target.value }))}><option>全部</option>{courseTagOptions.map((tag) => <option key={tag} value={tag}>{tag}</option>)}</select></label>
                  <button type="button" onClick={() => { const nextFilters = { department: '全部', requirement: '全部', grade: '全部', weekday: '全部', period: '全部', tag: '全部' }; setQuery(''); setSearchFilters(nextFilters); setSearchOnlyAvailable(false); setSearchSort('default'); runCourseSearch({ query: '', searchFilters: nextFilters }) }}>重設</button>
                </div>
                <div className="searchSortBar">
                  <label>排序<select value={searchSort} onChange={(e) => setSearchSort(e.target.value)}><option value="smart">智慧排序</option><option value="default">原始順序</option><option value="name">課名</option><option value="creditsDesc">學分高到低</option><option value="teacher">教師</option><option value="time">時間</option><option value="favorite">已收藏優先</option><option value="candidate">已暫存優先</option></select></label>
                  {searchFilters.tag && searchFilters.tag !== '全部' ? <span className="tagSortHint">依「{searchFilters.tag}」得票數排序</span> : null}
                  <label className="checkLine"><input type="checkbox" checked={searchOnlyAvailable} onChange={(e) => setSearchOnlyAvailable(e.target.checked)} />只看可排入 {activeSemester} 且不衝堂</label>
                </div>
                {searchError && <p className="searchError">{searchError}</p>}
                <div className="searchMeta searchMetaWithCompare"><span>{searchLoading ? '正在讀取課程資料…' : `符合 ${sortedFilteredCourses.length} 門`}</span><div className="compareControl"><span>已選 {compareKeys.length}/4</span><button type="button" disabled={compareKeys.length < 2} onClick={() => setCompareOpen(true)}>比較課程</button><button type="button" disabled={!compareKeys.length} onClick={() => setCompareKeys([])}>清除</button></div></div>
                <div className="courseList">{sortedFilteredCourses.length ? sortedFilteredCourses.map((course) => { const key = getKey(course); const compared = compareKeys.includes(key); const isFavoriteCourse = favoriteKeySet.has(key); const isCandidateCourse = candidateKeySet.has(key) || isCourseAlreadyPlanned(plan, course); const hasConflict = Boolean(findConflict(course, activePlanCourses)); return <CourseCard key={uid(course)} course={course} targetSemester={activeSemester} onSelect={openCourseInfo} onCompare={() => toggleCompare(course)} isCompared={compared} compareDisabled={!compared && compareKeys.length >= 4} onAddCandidate={addCandidate} onFavorite={(course) => preserveSearchScroll(() => toggleFavorite(course))} isFavorite={isFavoriteCourse} isCandidate={isCandidateCourse} recommendationBadges={courseRecommendationBadges(course, { isFavorite: isFavoriteCourse, hasConflict })} /> }) : <div className="emptySearch">目前沒有符合條件的課程。請確認後端已啟動，或調整搜尋與篩選條件。</div>}</div>
                {compareOpen && <CompareTable courses={compareCourses} tagVotes={tagVotes} onClose={() => setCompareOpen(false)} onOpenCourseInfo={(course) => { setCompareOpen(false); openCourseInfo(course) }} />}
                </>}
                {searchTab === 'favorites' && <div className="courseList">{favorites.length ? favorites.map((course) => <CourseCard key={`fav-${uid(course)}`} course={course} targetSemester={activeSemester} onSelect={openCourseInfo} onAddCandidate={addCandidate} onFavorite={(course) => preserveSearchScroll(() => toggleFavorite(course))} isFavorite={true} isCandidate={candidates.some((cand) => getKey(cand) === getKey(course)) || isCourseAlreadyPlanned(plan, course)} />) : <div className="emptySearch">尚未收藏課程。可在搜尋結果右下角按 ☆ 收藏。</div>}</div>}
              </div>
            </section>
  )
}
