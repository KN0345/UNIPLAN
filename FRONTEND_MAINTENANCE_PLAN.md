# 前端維護計畫

## 已完成
- 學程頁獨立為 `pages/ProgramsPage.jsx`
- 畢業頁外框獨立為 `pages/CreditsPage.jsx`
- 管理端主頁獨立為 `components/admin/AdminDataConsole.jsx`
- 管理端學程資料頁獨立為 `components/admin/AdminProgramsPage.jsx`
- storage 工具獨立為 `utils/storage.js`

## 仍需拆分
- `App.jsx` 仍包含課程搜尋、課表、外觀設定、課程資訊抽屜、匯出工具。
- 下一階段可拆：
  - `pages/CourseSearchPage.jsx`
  - `components/courses/CourseCard.jsx`
  - `components/courses/CourseInfoDrawer.jsx`
  - `pages/PlannerPage.jsx`
  - `components/planner/SemesterGrid.jsx`

## 為什麼沒有一次完全拆完
目前應優先保持可執行與可測試。`App.jsx` 仍大，但已可逐步切割，不會影響學生端主要流程。
