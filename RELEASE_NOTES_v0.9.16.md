# UniPlan v0.9.16 穩定化版本

## 本次目標

本版不新增大型功能，重點放在：

1. 整理資料夾架構
2. 降低學生端不必要文字
3. 穩定學程方塊選課器
4. 簡化畢業學分與管理模式

## 已整理資料夾架構

前端資料層整理為：

```txt
frontend/src/data/
├─ courses/      # 課程資料與欄位定義
├─ graduation/   # 畢業學分規則
├─ programs/     # 學程修課模擬
├─ schedule/     # 課表、暫存、收藏
└─ users/        # 使用者與帳號資料
```

學程資料層補充：

```txt
frontend/src/data/programs/
├─ programData.js
├─ programTypes.js
├─ programBuilders.js
├─ programTemplates.js
├─ programProgress.js
├─ DATA_ARCHITECTURE.md
├─ catalog/
├─ rules/
├─ templates/
└─ progress/
```

目前為漸進式整理：保留既有程式可執行性，不做破壞式大拆分。

## UI 調整

### 課程查詢

- 課程卡片隱藏學期來源標籤，減少資訊干擾。
- 保留教師姓名。
- 保留課名、教師、時間/教室、學分、加入暫存與收藏。
- 學分徽章位置調整，避免與文字重疊。
- 搜尋結果統計改為短句。

### 畢業學分

- 移除下方分類圖例與長說明。
- 只保留總進度、已排學分與進度條。

### 學程進度

- 維持方塊式選課器。
- 學程列表只顯示學程名稱與百分比。
- 課程方塊文字縮短。
- 尚缺資訊改成簡短提示。

### 管理模式

- 管理端維持統計、缺失資料、重複課號、帳號管理、意見箱。
- 不加入 CSV 主流程。

## Build 檢查

已在本機執行：

```bash
npm install
npm run build
```

結果：成功。

## 完整評估

```txt
功能完成度：80%
實際可用度：65%
資料架構穩定度：75%
學生端 UI 清晰度：70%
手機使用穩定度：65%
學程資料完整度：45~55%
```

### 目前優點

- 核心功能已完整：搜尋、暫存、排課、畢業進度、學程選課。
- 學程已從規則展示轉為可操作的選課器。
- 管理端方向已收斂，不再過度複雜。
- 資料層開始分區，後續較容易維護。

### 目前風險

- `App.jsx` 仍然過大，後續需要逐步拆頁面與元件。
- 學程資料仍有不少待校對規則。
- 手機版需要實測課程卡與學程方塊是否仍有擁擠情況。
- 後端 Python requirements 可能因 Python 3.14 套件相容性導致安裝問題，建議使用 Python 3.11。

## 下一步建議

### v0.9.17 建議目標

1. 拆分 `App.jsx`
   - `pages/SearchPage.jsx`
   - `pages/CreditsPage.jsx`
   - `pages/PlannerPage.jsx`
   - `components/course/CourseCard.jsx`
   - `components/admin/AdminDataConsole.jsx`

2. 手機版實測修正
   - 課程卡片高度
   - 學程方塊大小
   - 篩選列折疊
   - 暫存區操作

3. 學程資料校對
   - 優先校對 AI 系列、資料科學、商統、財經法律、智慧人文。

4. 建立最小啟動說明
   - Windows Node 安裝
   - Python 3.11 建議
   - 前端啟動
   - 後端啟動
