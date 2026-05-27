# UniPlan v1.0 Alpha Patch 3

## 目標
本版為狀態 hooks 與剩餘架構整理版，不新增功能，專注降低 App.jsx 複雜度。

## 本版完成
- 新增 `hooks/useAppearanceSettings.js`，集中外觀設定與 localStorage 同步。
- 新增 `hooks/usePersistentAcademicState.js`，集中課表、暫存、收藏、快照、本機評價、標籤票選資料。
- 新增 `hooks/useCourseSearchState.js`，集中課程搜尋、篩選、排序與課程 metadata。
- 新增 `components/credits/GraduationRulePreviewPanel.jsx`，把畢業學分預覽從 App.jsx 拆出。
- 移除 App.jsx 內未使用的 CSV 匯入工具與舊管理輔助函式。
- `App.jsx` 從約 1017 行降到約 689 行。
- `npm run build` 通過。

## 不包含
- 不新增教務系統爬蟲。
- 不串接學校登入。
- 不恢復 CSV 為主流程。
- 不改首頁主流程。
