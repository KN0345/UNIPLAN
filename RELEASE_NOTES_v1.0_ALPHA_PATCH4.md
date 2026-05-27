# UniPlan v1.0 Alpha Patch 4

本版目標：拆分帳號、備份同步與登入/版面元件，讓 `App.jsx` 更接近頁面組合層。

## 本版完成

- 新增 `hooks/useAccountState.js`
  - 集中登入、註冊、本機離線登入、學生資料自動辨識、登出與帳號資料同步。
- 新增 `hooks/useBackupSync.js`
  - 集中儲存、匯入備份、建立快照、還原快照。
- 新增 `hooks/useToast.js`
  - 集中通知訊息狀態。
- 新增 `components/auth/LoginPage.jsx`
  - 登入/註冊畫面從 `App.jsx` 拆出。
- 新增 `components/layout/SideNav.jsx`
  - 側邊選單與學生資訊從 `App.jsx` 拆出。
- 新增 `components/layout/Topbar.jsx`
  - 頂部標題與外觀/登出按鈕從 `App.jsx` 拆出。
- 新增 `components/guide/GuideOverlay.jsx`
  - 快速開始引導從 `App.jsx` 拆出。
- `App.jsx` 從約 689 行降到約 501 行。
- `npm run build` 通過。

## 範圍限制

- 不新增教務爬蟲。
- 不新增學校登入串接。
- 不改首頁主流程。
- 不改學程方塊選課器的互動設計。
