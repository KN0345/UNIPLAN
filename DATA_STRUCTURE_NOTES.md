# UniPlan v0.9.14 資料架構整理紀錄

## 這版的整理原則

- 學生端只顯示排課與進度必要資訊。
- 管理端只保留統計、缺失提醒、帳號管理與意見箱。
- 學程資料只做修課模擬，不處理申請資格、申請時間、審核與證書發放。

## 前端資料層

```txt
frontend/src/data/
├─ README.md
└─ programs/
   ├─ programTypes.js       # 規則型別、狀態、狀態顯示名稱
   ├─ programBuilders.js    # c/group/minCredit/minCourse/select 等資料 helper
   ├─ programTemplates.js   # AI_INTRO、AI_ETHICS、PROGRAMMING、PROBABILITY 等共用模板
   ├─ programData.js        # 全部學程資料 catalog
   └─ programProgress.js    # 學程進度與缺失檢查
```

## 學程資料模型

```txt
Program
├─ id / code / name
├─ college / unit
├─ status
├─ totalRules
├─ groups
│  ├─ rules
│  ├─ courses
│  └─ children
├─ path
├─ notes
└─ sources
```

## 學生端降噪

- 課程卡片移除教師與開課序號顯示，只保留課名、時間/教室、學分。
- 學分進度移除圖例與多餘說明。
- 學程進度只保留總進度、學分、門數與尚缺項目。
- 課程詳細資訊移除課號/序號欄位，避免對學生造成資訊噪音。

## 管理端降噪

- 移除主要 CSV 匯入流程展示。
- 管理後台保留：課程數、缺失資料、重複課號、帳號數、停用帳號、待處理意見。
- 帳號管理只保留啟用/停用操作。
