# UniPlan Cloudflare 全免費部署指南

本方案目標：不使用 Railway / Render，改用全免費架構。

## 架構

```txt
Cloudflare Pages：前端 + Functions API
Neon PostgreSQL：公共可寫資料
localStorage：未登入個人課表、暫存、收藏、方案
Static JSON：課程資料唯讀查詢
```

## 為什麼這樣設計

UniPlan 初期是一次性排課工具，個人課表先保留在本機最穩；真正需要多人共享的是：

- 意見箱
- 課程心得
- 標籤投票
- 管理端回報狀態

這些用 Neon PostgreSQL 儲存。

課程資料是只讀資料，已輸出成：

```txt
frontend/public/data/courses.json
frontend/public/data/metadata.json
```

即使 Neon 還沒設定，課程搜尋仍可用；只有意見箱/心得/投票會顯示後端未設定。

---

# Step 1：建立 Neon PostgreSQL

1. 到 Neon 建立免費專案。
2. 複製 `DATABASE_URL`。
3. 在 Neon SQL Editor 執行：

```txt
deploy/cloudflare/neon_schema.sql
```

---

# Step 2：部署到 Cloudflare Pages

Cloudflare Pages 設定：

```txt
Framework preset：Vite
Root directory：uni/frontend
Build command：npm run build
Build output directory：dist
```

環境變數：

```txt
VITE_API_BASE_URL=/api
DATABASE_URL=你的 Neon PostgreSQL 連線字串
```

`DATABASE_URL` 只給 Cloudflare Functions 使用，不會進到瀏覽器。

---

# Step 3：部署後測試

打開：

```txt
https://你的網站.pages.dev/api/health
```

看到：

```json
{"status":"ok"}
```

代表 API 正常。

再測：

```txt
課程搜尋
意見箱送出
最近回報
課程心得
標籤投票
```

---

# 本機開發

本機仍可沿用 FastAPI：

```bat
cd C:\Users\KN\Desktop\uni
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

前端：

```bat
cd C:\Users\KN\Desktop\uni\frontend
npm install
npm run dev -- --host 0.0.0.0
```

本機預設 API 是 `http://localhost:8000`；部署後預設 API 是 `/api`。

---

# 注意事項

1. Cloudflare Pages Functions 不是 FastAPI；正式上線用的是 `frontend/functions/api/[[path]].js`。
2. FastAPI 後端保留作為本機開發與未來付費部署備用。
3. Neon 免費方案可能有冷啟動，但通常比 Render Free 後端休眠更適合小規模公開。
4. 若未來帳號系統上線，個人課表才需要從 localStorage 搬到 PostgreSQL。
