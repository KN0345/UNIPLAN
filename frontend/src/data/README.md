# UniPlan data layer

資料夾分層原則：

```txt
src/data/
├─ courses/      # 課程資料與欄位定義
├─ graduation/   # 畢業規則
├─ programs/     # 學程修課模擬
├─ schedule/     # 課表、暫存、收藏
└─ users/        # 使用者與帳號資料
```

原則：
1. data 只描述資料，不放畫面樣式。
2. UI 只呼叫 data 與 progress helper，不直接硬寫規則。
3. 學程只做修課模擬，不做行政申請。
4. 學生端只顯示必要資訊，管理端只顯示統計與缺失提醒。
