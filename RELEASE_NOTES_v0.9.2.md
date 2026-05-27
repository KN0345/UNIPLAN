# UniPlan v0.9.2 更新紀錄

## 本次更新重點

### 管理模式 Phase 2：課程匯入後半段
- 匯入流程由 5 階段擴充為 6 階段：選擇學期、上傳資料、預覽、檢查錯誤、確認匯入、更新資料。
- 新增 CSV 匯入模板下載。
- 新增匯入預覽 CSV 匯出。
- 後端未連線時，課程匯入會自動落到本機管理資料，避免功能完全中斷。
- 本機匯入資料會保存於 localStorage，重新開啟後仍會保留。
- 新增最近一次本機匯入回滾功能。
- 新增本機匯入歷史列表。
- 匯入後資料會併入 Admin Console 的課程管理列表。

### 檢查結果
- 前端 `npm run build` 通過。
- Python `py_compile` 通過。
- 已清除 `node_modules`、`__pycache__`、`.pyc`、`.vite` 等殘留。
- 未發現實際 `.streamlit/secrets.toml`，僅保留 `secrets.example.toml`。

## 尚未完成
- `.xlsx/.xls` 真正解析仍未接入；目前仍建議另存 CSV。
- 後端課程匯入 API 若未啟動，會使用本機 fallback；正式部署仍需後端權限與資料庫寫入驗證。
- 尚未實作完整批次差異比較頁與多版本回滾。
