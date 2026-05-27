# UniPlan v0.9.4 Register Contract Hotfix

## 修正
- 修正 `/auth/register` 可能因前後端註冊欄位契約不一致或密碼長度限制而回傳 422 的問題。
- 註冊 API 維持只需要 `student_id`、`password`，`display_name` 為選填；不再要求 Email。
- 後端會將空白顯示名稱回填為學號，降低空值造成的後續登入資料異常。
- 輸出 ZIP 根目錄調整為單一 `uni/` 資料夾。

## 檢查
- Python 語法檢查通過。
- 已清除快取與殘留檔案。
