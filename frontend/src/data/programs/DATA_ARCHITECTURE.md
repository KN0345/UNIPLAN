# programs data architecture

學程只做「修課模擬」，不處理申請資格、申請時間、認證流程或證書發放。

目前資料分層：

```txt
programs/
├─ programData.js        # 目前前端使用的學程 catalog 入口
├─ programTypes.js       # rule/status 常數
├─ programBuilders.js    # 建立學程物件的 helper
├─ programTemplates.js   # 可重用的學程模板
├─ programProgress.js    # 進度計算與缺失檢查
├─ catalog/              # 未來拆分各學院/類型學程
├─ rules/                # 未來拆分共用規則
├─ templates/            # 未來拆分共用課程群組模板
└─ progress/             # 未來拆分進度與推薦演算法
```

前台顯示原則：
- 學生看課程按鈕，不看規則 JSON。
- 已修/已選為綠色。
- 固定必修為紅色。
- 不可選為灰色。
- 一般課程跟隨主題色。
