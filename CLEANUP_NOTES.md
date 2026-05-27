# UniPlan timetable cleanup

This cleanup isolates the timetable and in-grid course cards from legacy hotfix selectors.

## Main changes
- Rebuilt the timetable cell classes so they no longer use legacy `.slot`, `.slotCourse`, `.glassCourse`, or `.referenceSlotCourse` for scheduled courses.
- Added clean timetable-only classes:
  - `.timetableGridClean`
  - `.timetableCell`
  - `.timetableCourseTile`
  - `.timetableConflictTile`
- Course cards now render only at the course start period and use a calculated tile height for multi-period courses.
- Conflict cells render as one conflict tile; clicking it opens the existing conflict list modal.
- Timetable background image, timetable opacity, and course-card frost controls are connected to the new clean classes.
- Removed root-level legacy changelog files from this packaged folder.

## Not changed
- Course search cards
- Account system
- Admin console
- Credit-progress logic
- Backend files

## v0.9.1 更新紀錄

### 已更新：管理模式 Phase 2 課程匯入
- 將資料匯入頁由純 JSON textarea 升級為階段式匯入流程。
- 新增學期選擇：114 學年度上學期 / 114 學年度下學期。
- 新增 CSV / TSV / JSON 檔案上傳與貼上資料雙入口。
- 新增中文欄位別名映射：課號、課程名稱、教師、學分、時間、教室、系所等。
- 新增匯入預檢：缺少必要欄位、重複課號、學分格式、容量格式、未提供時間。
- 新增匯入差異摘要：總筆數、新增、更新、忽略風險。
- 新增預覽表格與錯誤 / 提醒分流。
- 匯入前若仍有阻擋錯誤，會禁止送出。

### 已清理
- 移除不完整 node_modules，避免跨平台殘留依賴造成 Vite / Rollup 錯誤。
- 移除 frontend/.vite 快取。
- 移除 Python __pycache__ 與 .pyc。
- 移除實際 secrets.toml，改留 secrets.example.toml，避免把部署金鑰放入版本包。

### 已檢查
- React/Vite build：通過。
- Python py_compile：通過。
- dist 已重新產生。

### 注意
- 前端目前可直接解析 CSV / TSV / JSON。
- .xlsx / .xls 二進位 Excel 檔目前會提示改存 CSV；正式支援 Excel 需加入 xlsx 解析套件或後端解析流程。
