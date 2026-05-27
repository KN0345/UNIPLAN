# UniPlan Deploy Ready Guide

## 目標

本版本用於小規模公開 Alpha / Beta Candidate 測試。

暫不包含：

- 學校教務系統爬蟲
- 學校登入串接
- 正式雲端帳號同步
- App 推播

目前重點是：讓陌生使用者能打開網站、查課、排課、學程規劃、匯出資料與回報問題。

---

## 建議部署架構

```txt
GitHub
├─ frontend → Vercel
└─ backend  → Render
```

前端：Vercel
後端：Render
資料庫：先使用 SQLite，只讀課程資料為主

---

## 一、本機啟動

### 後端

```bash
cd uni
pip install -r requirements-deploy.txt
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

健康檢查：

```txt
http://127.0.0.1:8000/health
```

### 前端

```bash
cd uni/frontend
npm install
npm run dev:host
```

開啟：

```txt
http://127.0.0.1:5173
```

---

## 二、部署後端到 Render

1. 將整個 `uni` 專案推到 GitHub。
2. 到 Render 建立 Web Service。
3. Root Directory 填：

```txt
uni
```

4. Build Command：

```bash
pip install -r requirements-deploy.txt
```

5. Start Command：

```bash
uvicorn src.main:app --host 0.0.0.0 --port $PORT
```

6. Environment Variables：

```txt
UNIPLAN_CORS_ORIGINS=https://你的前端網域.vercel.app
UNIPLAN_DB_PATH=/opt/render/project/src/data/course_inventory.db
```

7. 部署完成後測試：

```txt
https://你的-render-api.onrender.com/health
```

---

## 三、部署前端到 Vercel

1. 到 Vercel 匯入同一個 GitHub 專案。
2. Root Directory 填：

```txt
uni/frontend
```

3. Framework 選 Vite。
4. Build Command：

```bash
npm run build
```

5. Output Directory：

```txt
dist
```

6. Environment Variables：

```txt
VITE_API_BASE_URL=https://你的-render-api.onrender.com
```

7. 部署完成後打開前端網址測試。

---

## 四、CORS 設定

如果前端打 API 失敗，通常是 CORS 沒設定。

到 Render 環境變數更新：

```txt
UNIPLAN_CORS_ORIGINS=https://你的前端網域.vercel.app
```

如果有多個前端網址，用逗號分隔：

```txt
https://a.vercel.app,https://www.uniplan.app
```

---

## 五、公開測試前檢查

- [ ] 前端首頁可開啟
- [ ] `/health` 回傳 `status: ok`
- [ ] 課程搜尋可載入
- [ ] 課程資訊可打開
- [ ] 暫存與課表可用
- [ ] 匯出文字可用
- [ ] 意見箱可送出
- [ ] 管理端資料中心可讀

---

## 六、目前部署限制

1. SQLite 在免費部署環境可能不是永久寫入資料庫；課程資料可讀取，但正式帳號/雲端同步不建議現在依賴它。
2. 意見箱若要真的跨使用者集中，需要後端 feedback API 與持久化資料庫。
3. 正式 Beta 建議升級 PostgreSQL。
4. 手機端目前不是主要優先，桌面版優先公開測試。
