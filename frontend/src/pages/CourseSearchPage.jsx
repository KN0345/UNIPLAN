import { useMemo, useState } from 'react'
import CompareTable from '../components/compare/CompareTable'
import { courseKey } from '../utils/coursePlanning'

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
  const toggleCompare = (course) => {
    const key = getKey(course)
    setCompareKeys((prev) => {
      if (prev.includes(key)) return prev.filter((item) => item !== key)
      if (prev.length >= 4) return prev
      return [...prev, key]
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
                  <label>科系<select value={searchFilters.department} onChange={(e) => setSearchFilters((f) => ({ ...f, department: e.target.value }))}><option>全部</option>{majorOptions.length ? majorOptions.map((item) => <option key={`major-${item}`} value={item}>{item}</option>) : departmentOptions.map((item) => <option key={`dept-${item}`} value={item}>{item}</option>)}</select></label>
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
                <div className="searchMeta searchMetaWithCompare"><span>{searchLoading ? '正在讀取課程資料…' : `顯示 ${sortedFilteredCourses.length} 門課`}</span><div className="compareControl"><span>已選 {compareKeys.length}/4</span><button type="button" disabled={compareKeys.length < 2} onClick={() => setCompareOpen(true)}>比較課程</button><button type="button" disabled={!compareKeys.length} onClick={() => setCompareKeys([])}>清除</button></div></div>
                <div className="courseList">{sortedFilteredCourses.length ? sortedFilteredCourses.map((course) => { const key = getKey(course); const compared = compareKeys.includes(key); return <CourseCard key={uid(course)} course={course} targetSemester={activeSemester} onSelect={openCourseInfo} onCompare={() => toggleCompare(course)} isCompared={compared} compareDisabled={!compared && compareKeys.length >= 4} onAddCandidate={addCandidate} onFavorite={toggleFavorite} isFavorite={favorites.some((f) => getKey(f) === getKey(course))} isCandidate={candidates.some((cand) => getKey(cand) === getKey(course)) || isCourseAlreadyPlanned(plan, course)} recommendationBadges={courseRecommendationBadges(course, { isFavorite: favorites.some((f) => getKey(f) === getKey(course)), hasConflict: Boolean(findConflict(course, plan[activeSemester] || [])) })} /> }) : <div className="emptySearch">目前沒有符合條件的課程。請確認後端已啟動，或調整搜尋與篩選條件。</div>}</div>
                {compareOpen && <CompareTable courses={compareCourses} tagVotes={tagVotes} onClose={() => setCompareOpen(false)} onOpenCourseInfo={(course) => { setCompareOpen(false); openCourseInfo(course) }} />}
                </>}
                {searchTab === 'favorites' && <div className="courseList">{favorites.length ? favorites.map((course) => <CourseCard key={`fav-${uid(course)}`} course={course} targetSemester={activeSemester} onSelect={openCourseInfo} onAddCandidate={addCandidate} onFavorite={toggleFavorite} isFavorite={true} isCandidate={candidates.some((cand) => getKey(cand) === getKey(course)) || isCourseAlreadyPlanned(plan, course)} />) : <div className="emptySearch">尚未收藏課程。可在搜尋結果右下角按 ☆ 收藏。</div>}</div>}
              </div>
            </section>
  )
}
