# UniPlan v0.9.8 graduation rules preview

## 本版重點
- 新增 113 / 114 / 115 畢業學分規則驗證資料。
- 學分進度頁新增「畢業規則驗證板」，可切換入學年度與系所/組別驗證數字。
- 更新 SQLite 規則庫：`data/graduation_rules/graduation_rules_113.db`、`graduation_rules_114.db`、`graduation_rules_115.db`。
- 新增 `data/graduation_rules/graduation_rules_preview.json` 供人工核對。
- 保留土木工程學系缺資料標記。

## 已入庫規則類型
- 基本畢業學分：校必修、院必修、系必修、系選修、自由選修、總學分。
- 部分特殊規則備註：停招、系所整併、歐語系組別、學分排除、歷史系上下學期採計、國觀全英替代課提醒。

## 測試目的
本版先讓使用者登入後進入「學分進度」頁，切換不同年度與系所確認資料是否放錯；尚未作為正式畢業判定引擎。
