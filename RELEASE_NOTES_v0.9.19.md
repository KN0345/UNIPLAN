# UniPlan v0.9.19 - App 拆檔與維護穩定版

## 本版重點

- 不改首頁。
- 不新增 CSV 主流程。
- 將管理後台主畫面從 `App.jsx` 抽離到 `frontend/src/components/admin/AdminDataConsole.jsx`。
- 將畢業學分頁外框抽離到 `frontend/src/pages/CreditsPage.jsx`。
- 新增共用 localStorage 工具 `frontend/src/utils/storage.js`。
- 維持 v0.9.18 的學程方塊選課器與管理端缺失分類。
- 已執行 `npm run build` 並通過。

## 架構整理

目前前端已開始拆分：

```txt
frontend/src/
├─ App.jsx
├─ api.js
├─ style.css
├─ pages/
│  ├─ ProgramsPage.jsx
│  └─ CreditsPage.jsx
├─ components/
│  └─ admin/
│     ├─ AdminProgramsPage.jsx
│     └─ AdminDataConsole.jsx
├─ data/
│  ├─ courses/
│  ├─ graduation/
│  ├─ programs/
│  ├─ schedule/
│  └─ users/
└─ utils/
   └─ storage.js
```

## 尚未完成

`App.jsx` 仍然偏大，課程搜尋、課表、課程資訊抽屜、外觀設定與快照仍集中在同一檔案。下一版應繼續拆分課程搜尋與課表頁。
