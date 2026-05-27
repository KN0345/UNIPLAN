# UniPlan v1.0 Alpha Patch 2：剩餘元件拆分版評估

## 本版定位
本版不新增功能，專注把 v1.0 Alpha Patch 中仍留在 App.jsx 的大型 UI 元件拆出，降低後續維護風險。

## 已完成
- App.jsx 從約 1549 行降至約 1017 行。
- 拆出 CourseCard。
- 拆出 SemesterGrid。
- 拆出 CourseInfo。
- 拆出 CoursePopover。
- 拆出 AppearanceModal。
- 拆出 CandidateManagerModal。
- 拆出 CreditStrip / ProgressBar / CreditStackBar。
- 拆出 SnapshotPage。
- npm run build 通過。

## 評估
- 功能完整度：90%
- 學生端可用度：82%
- 手機可用度：78%
- 資料架構穩定度：88%
- 學程模組成熟度：84%
- 管理端成熟度：78%
- 維護性：88%

## 主要風險
App.jsx 已經明顯下降，但仍包含大量全域狀態、資料同步、登入、匯出、管理模式切換與事件處理。下一步若要再降複雜度，應拆 hooks，而不是繼續只拆 UI。
