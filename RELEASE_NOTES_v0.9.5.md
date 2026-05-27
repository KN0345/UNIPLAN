# UniPlan v0.9.5 — Student Tooling Refactor + Empty Slot Hotfix

## Fixed
- 修正空堂檢索後需要再按一次搜尋才顯示結果的問題。
- `runCourseSearch` 現在可接收即時覆寫條件，避免 React state 尚未更新時使用舊篩選條件。
- 重設搜尋也改為使用同一份即時條件執行搜尋。
- 後端搜尋失敗時不再清空既有課程清單，避免短暫連線問題造成搜尋頁空白。

## Changed
- 管理模式重新定位為「UniPlan Tools / 維護工具台」，不再朝學校端校務後台發展。
- 左側功能縮減為：總覽、資料匯入、資料修復、匯入紀錄、操作紀錄、系統狀態。
- 保留匯入、檢查、紀錄與偵錯功能；移除主要導覽中的課程詳情、學制學分、使用者詳情、後台設定等校務型入口。

## Added
- 新增資料修復頁：檢查缺課名、缺教師、缺時間、學分異常、缺課號、重複課號與衝堂樣本。
- 新增匯入紀錄頁：集中查看本機匯入歷史與後端匯入紀錄。
- 新增系統狀態頁：顯示課程資料、暫存、收藏、已排課程與資料來源狀態。

## Validation
- Frontend build passed.
- Python syntax compile passed.
- ZIP root contains only `uni/`.
