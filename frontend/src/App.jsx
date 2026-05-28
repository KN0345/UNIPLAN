import { Component, useRef, useState } from 'react'
import './style.css'
import './uniplan-final-fix.css'
import ProgramsPage from './pages/ProgramsPage'
import AdminProgramsPage from './components/admin/AdminProgramsPage'
import AdminDataConsolePanel from './components/admin/AdminDataConsole'
import CreditsPage from './pages/CreditsPage'
import CourseSearchPage from './pages/CourseSearchPage'
import PlannerPage from './pages/PlannerPage'
import CourseCard from './components/course/CourseCard'
import CreditStrip from './components/credits/CreditStrip'
import SemesterGrid from './components/planner/SemesterGrid'
import CourseInfo from './components/course/CourseInfo'
import CoursePopover from './components/course/CoursePopover'
import AppearanceModal from './components/settings/AppearanceModal'
import SnapshotPage from './pages/SnapshotPage'
import GraduationRulePreviewPanel from './components/credits/GraduationRulePreviewPanel'
import SideNav from './components/layout/SideNav'
import Topbar from './components/layout/Topbar'
import GuideOverlay from './components/guide/GuideOverlay'
import FeedbackPage from './pages/FeedbackPage'
import { isSuperAdminUser } from './utils/account'
import { DEFAULT_RULES } from './data/graduation/graduationRulesPreview'
import {
  COURSE_CATALOG_TERMS,
  DAYS,
  PERIODS,
  SEMESTERS,
  courseKey,
  courseMatchesSemester,
  courseRecommendationBadges,
  courseTermLabel,
  credits,
  download,
  exportCalendar,
  exportCleanPng,
  exportExcel,
  exportPngFromDom,
  findConflict,
  getCourse,
  isCourseAlreadyPlanned,
  uid,
  userKey,
} from './utils/coursePlanning'
import { useAppearanceSettings } from './hooks/useAppearanceSettings'
import { usePersistentAcademicState } from './hooks/usePersistentAcademicState'
import { useCourseSearchState } from './hooks/useCourseSearchState'
import { useToast } from './hooks/useToast'
import { useAccountState } from './hooks/useAccountState'
import { useBackupSync } from './hooks/useBackupSync'
import { useCourseSelection } from './hooks/useCourseSelection'
import { useCandidateActions } from './hooks/useCandidateActions'
import { usePlannerActions } from './hooks/usePlannerActions'

class UniPlanErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('UniPlan render error captured:', error, info)
  }

  clearRuntimeCache = () => {
    const keepKeys = new Set(['uniplan:user', 'uniplan:token'])
    Object.keys(localStorage || {})
      .filter((key) => key.startsWith('uniplan:') && !keepKeys.has(key))
      .forEach((key) => localStorage.removeItem(key))
    window.location.reload()
  }

  fullReset = () => {
    Object.keys(localStorage || {})
      .filter((key) => key.startsWith('uniplan:'))
      .forEach((key) => localStorage.removeItem(key))
    window.location.reload()
  }

  render() {
    if (!this.state.error) return this.props.children
    return <main className="login crashRecovery"><section className="crashCard"><h1>UniPlan</h1><h2>畫面載入失敗</h2><p>偵測到舊版本機資料或頁面狀態造成登入後畫面中斷。可以先清除排課暫存資料保留帳號登入，若仍無法恢復再完整重置。</p><pre>{String(this.state.error?.message || this.state.error).slice(0, 500)}</pre><div className="crashActions"><button onClick={this.clearRuntimeCache}>保留帳號並修復</button><button onClick={this.fullReset}>完整重置</button></div></section></main>
  }
}

export default function AppWithBoundary() {
  return <UniPlanErrorBoundary><App /></UniPlanErrorBoundary>
}

function App() {
  const [activeMenu, setActiveMenu] = useState('planner')
  const [activeSemester, setActiveSemester] = useState('大一上')
  const [semesterAnimKey, setSemesterAnimKey] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showGuide, setShowGuide] = useState(() => localStorage.getItem('uniplan:guideSeen') !== '1')
  const [rules] = useState(DEFAULT_RULES)
  const scheduleExportRef = useRef(null)

  const { toast, notify } = useToast()
  const {
    plan, setPlan, candidates, setCandidates, favorites, setFavorites, snapshots, setSnapshots,
    localReviews, setLocalReviews, tagVotes, setTagVotes, applyRemoteBundle, makeUserBundle,
  } = usePersistentAcademicState()
  const {
    user, loginForm, setLoginForm, authMode, setAuthMode, studentIdPreview, authError,
    accountProfile, handleLogin, logout,
  } = useAccountState({
    notify,
    applyRemoteBundle,
    setPlan,
    setCandidates,
    setFavorites,
    setSnapshots,
    setLocalReviews,
    setTagVotes,
    currentBundle: () => ({ plan, candidates, favorites, snapshots, localReviews, tagVotes }),
  })
  const {
    courses, query, setQuery, searchFilters, setSearchFilters, searchLoading, searchError,
    courseCatalogTerm, setCourseCatalogTerm, searchTab, setSearchTab, searchSort, setSearchSort,
    searchOnlyAvailable, setSearchOnlyAvailable, sortedFilteredCourses, majorOptions, departmentOptions,
    gradeOptions, courseTagOptions, runCourseSearch,
  } = useCourseSearchState({ activeSemester, favorites, candidates, plan, tagVotes })
  const {
    theme, uiTheme, setUiTheme, accent, setAccent, buttonAccent, setButtonAccent, timetableTint, setTimetableTint,
    timetableOpacity, setTimetableOpacity, timetableBg, setTimetableBg, courseCardOpacity, setCourseCardOpacity,
  } = useAppearanceSettings()
  const {
    coursePopover,
    setCoursePopover,
    selectedCourse,
    setSelectedCourse,
    infoOpen,
    setInfoOpen,
    reviews,
    openCourseInfo,
    openCoursePopover,
    toggleTeacherTag,
    handleAddReview,
    updateLocalReview,
    deleteLocalReview,
  } = useCourseSelection({ user, localReviews, setLocalReviews, setTagVotes })
  const {
    candidateSearch,
    setCandidateSearch,
    candidateSort,
    setCandidateSort,
    filteredCandidates,
    putCandidate,
    addCandidate,
    removeCandidate,
    toggleFavorite,
  } = useCandidateActions({ plan, candidates, setCandidates, favorites, setFavorites, notify })
  const plannerActions = usePlannerActions({
    plan,
    setPlan,
    candidates,
    setCandidates,
    activeSemester,
    setActiveSemester,
    setSemesterAnimKey,
    searchFilters,
    setSearchFilters,
    setSearchOnlyAvailable,
    setSearchTab,
    setActiveMenu,
    runCourseSearch,
    notify,
    putCandidate,
    addCandidate,
    removeCandidate,
    setSelectedCourse,
    setCoursePopover,
  })
  const {
    history,
    future,
    commit,
    switchSemester,
    searchEmptySlot,
    movePlannedCourse,
    addCourseToSemester,
    handleDropCourse,
    dropToCandidates,
    dropDelete,
    setPlannedCourseStatus,
    autoPlace,
    movePlannedToCandidate,
    deletePlannedCourse,
    undo,
    redo,
  } = plannerActions
  const { createSnapshot, restoreSnapshot, importBackupFile, save } = useBackupSync({
    user,
    plan,
    setPlan,
    candidates,
    setCandidates,
    favorites,
    setFavorites,
    snapshots,
    setSnapshots,
    localReviews,
    tagVotes,
    makeUserBundle,
    notify,
    commit,
  })

  return (
    <div className="appShell">
      <SideNav user={user} accountProfile={accountProfile} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <main className="main">
        <Topbar activeMenu={activeMenu} user={user} onOpenSettings={() => setSettingsOpen(true)} onLogout={logout} />

        {activeMenu === 'planner' && <PlannerPage CreditStrip={CreditStrip} plan={plan} rules={rules} scheduleExportRef={scheduleExportRef} activeSemester={activeSemester} semesterAnimKey={semesterAnimKey} SemesterGrid={SemesterGrid} handleDropCourse={handleDropCourse} autoPlace={autoPlace} openCoursePopover={openCoursePopover} searchEmptySlot={searchEmptySlot} deletePlannedCourse={deletePlannedCourse} movePlannedToCandidate={movePlannedToCandidate} SEMESTERS={SEMESTERS} switchSemester={switchSemester} save={save} undo={undo} history={history} redo={redo} future={future} download={download} candidates={candidates} favorites={favorites} snapshots={snapshots} setSnapshots={setSnapshots} restoreSnapshot={restoreSnapshot} localReviews={localReviews} tagVotes={tagVotes} importBackupFile={importBackupFile} exportPngFromDom={exportPngFromDom} exportCleanPng={exportCleanPng} exportExcel={exportExcel} exportCalendar={exportCalendar} createSnapshot={createSnapshot} dropToCandidates={dropToCandidates} candidateSearch={candidateSearch} setCandidateSearch={setCandidateSearch} candidateSort={candidateSort} setCandidateSort={setCandidateSort} filteredCandidates={filteredCandidates} getCourse={getCourse} uid={uid} openCourseInfo={openCourseInfo} credits={credits} courseMatchesSemester={courseMatchesSemester} courseTermLabel={courseTermLabel} addCourseToSemester={addCourseToSemester} removeCandidate={removeCandidate} dropDelete={dropDelete} />}

        {activeMenu === 'search' && <CourseSearchPage searchTab={searchTab} setSearchTab={setSearchTab} favorites={favorites} runCourseSearch={runCourseSearch} query={query} setQuery={setQuery} searchLoading={searchLoading} courseCatalogTerm={courseCatalogTerm} setCourseCatalogTerm={setCourseCatalogTerm} COURSE_CATALOG_TERMS={COURSE_CATALOG_TERMS} searchFilters={searchFilters} setSearchFilters={setSearchFilters} majorOptions={majorOptions} departmentOptions={departmentOptions} gradeOptions={gradeOptions} DAYS={DAYS} PERIODS={PERIODS} setSearchOnlyAvailable={setSearchOnlyAvailable} setSearchSort={setSearchSort} searchSort={searchSort} searchOnlyAvailable={searchOnlyAvailable} activeSemester={activeSemester} searchError={searchError} sortedFilteredCourses={sortedFilteredCourses} CourseCard={CourseCard} uid={uid} openCourseInfo={openCourseInfo} addCandidate={addCandidate} toggleFavorite={toggleFavorite} candidates={candidates} courseKey={courseKey} isCourseAlreadyPlanned={isCourseAlreadyPlanned} plan={plan} courseRecommendationBadges={courseRecommendationBadges} findConflict={findConflict} tagVotes={tagVotes} courseTagOptions={courseTagOptions} />}

        {activeMenu === 'credits' && <CreditsPage><GraduationRulePreviewPanel profile={accountProfile} plan={plan} /></CreditsPage>}

        {activeMenu === 'programs' && <ProgramsPage profile={accountProfile} plan={plan} candidates={candidates} favorites={favorites} courses={courses} onAddCandidate={addCandidate} onOpenCourseInfo={openCourseInfo} />}

        {activeMenu === 'feedback' && <FeedbackPage notify={notify} />}

        {activeMenu === 'snapshots' && <SnapshotPage snapshots={snapshots} history={history} setSnapshots={setSnapshots} restoreSnapshot={restoreSnapshot} plan={plan} />}

        {activeMenu === 'admin' && isSuperAdminUser(user) && <AdminDataConsolePanel notify={notify} courses={courses} user={user} profile={accountProfile} plan={plan} candidates={candidates} favorites={favorites} />}

        {activeMenu === 'adminPrograms' && isSuperAdminUser(user) && <AdminProgramsPage />}

        {coursePopover && <CoursePopover data={coursePopover} onClose={() => setCoursePopover(null)} onStatus={setPlannedCourseStatus} onMove={movePlannedCourse} onInfo={(course) => { setCoursePopover(null); openCourseInfo(course) }} onFavorite={toggleFavorite} />}
        {infoOpen && <div className="infoOverlay" onMouseDown={(e) => { if (e.target.className === 'infoOverlay') setInfoOpen(false) }}><div className="infoDrawerPanel"><button className="closeInfo" onClick={() => setInfoOpen(false)}>關閉</button><CourseInfo course={selectedCourse} reviews={reviews} tagVotes={tagVotes} onTagVote={toggleTeacherTag} userId={userKey(user)} onAddReview={handleAddReview} onUpdateReview={updateLocalReview} onDeleteReview={deleteLocalReview} /></div></div>}
      </main>
      {toast && <div className="toast" role="status">{toast}</div>}
      <GuideOverlay open={showGuide} onClose={() => { localStorage.setItem('uniplan:guideSeen', '1'); setShowGuide(false) }} />
      <AppearanceModal open={settingsOpen} onClose={() => setSettingsOpen(false)} uiTheme={uiTheme} setUiTheme={setUiTheme} accent={accent} setAccent={setAccent} buttonAccent={buttonAccent} setButtonAccent={setButtonAccent} timetableTint={timetableTint} setTimetableTint={setTimetableTint} timetableOpacity={timetableOpacity} setTimetableOpacity={setTimetableOpacity} timetableBg={timetableBg} setTimetableBg={setTimetableBg} courseCardOpacity={courseCardOpacity} setCourseCardOpacity={setCourseCardOpacity} />
    </div>
  )
}
