# UniPlan v1.0 Cloudflare Free Deploy

## 目的

把 UniPlan 從 Render/Railway 後端架構改成全免費可公開測試架構。

## 架構

- Cloudflare Pages：前端
- Cloudflare Pages Functions：輕量 API
- Neon PostgreSQL：公共可寫資料
- Static JSON：課程資料唯讀查詢
- localStorage：未登入個人課表、暫存、收藏、方案
- FastAPI：保留為本機開發與未來備用

## 本版修改

1. 新增 Cloudflare Pages Functions API：`frontend/functions/api/[[path]].js`
2. 新增 Neon PostgreSQL schema：`deploy/cloudflare/neon_schema.sql`
3. 新增 Cloudflare 部署說明：`CLOUDFLARE_FREE_DEPLOY_GUIDE.md`
4. 新增靜態課程資料：`frontend/public/data/courses.json`
5. 新增靜態 metadata：`frontend/public/data/metadata.json`
6. 前端 API 預設：本機走 FastAPI，部署走 `/api`
7. 課程搜尋若 API 不可用，會 fallback 到靜態 JSON
8. 意見箱可送到 Cloudflare Functions + Neon
9. 保留本機 FastAPI 啟動方式

## 已支援的 Cloudflare API

- `GET /api/health`
- `GET /api/feedback`
- `POST /api/feedback`
- `GET /api/admin/feedback`
- `PATCH /api/admin/feedback/:id`
- `GET /api/reviews/:courseKey`
- `POST /api/reviews`
- `GET /api/course-tags/:courseKey`
- `POST /api/course-tags/vote`
- `GET /api/admin/data-summary`

## 注意

課程資料目前不寫入 Neon，先用靜態 JSON 提供查詢。這樣可以降低免費資料庫壓力，也避免初期部署複雜化。
