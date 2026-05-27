# UniPlan v1.0 Deploy Ready

## 更新內容

- 新增後端 `/health` 健康檢查 API。
- CORS 改為可由 `UNIPLAN_CORS_ORIGINS` 環境變數控制。
- SQLite 資料庫路徑可由 `UNIPLAN_DB_PATH` 控制。
- 前端 API 改支援 `VITE_API_BASE_URL`。
- 新增 Render 部署設定 `render.yaml`。
- 新增 Vercel 設定 `frontend/vercel.json`。
- 新增部署用依賴 `requirements-deploy.txt`。
- 新增 `.env.example` 與 `frontend/.env.example`。
- 新增 `DEPLOYMENT_GUIDE.md` 與 `DEPLOYMENT_CHECKLIST.md`。

## 部署定位

此版本用於小規模公開 Alpha / Beta Candidate。

不包含教務爬蟲、學校登入、正式雲端帳號同步。
