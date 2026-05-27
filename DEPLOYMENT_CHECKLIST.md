# UniPlan 上線檢查表

## 前端

- [ ] Vercel Root Directory = `uni/frontend`
- [ ] `VITE_API_BASE_URL` 已填 Render API URL
- [ ] Build 成功
- [ ] 首頁可開
- [ ] 查課可用

## 後端

- [ ] Render Root Directory = `uni`
- [ ] Build Command = `pip install -r requirements-deploy.txt`
- [ ] Start Command = `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
- [ ] `/health` 正常
- [ ] CORS 已加入 Vercel 網域

## 公測

- [ ] Alpha 提醒清楚
- [ ] 意見箱可用
- [ ] 資料缺失中心正常
- [ ] 不要求登入
- [ ] 不收集敏感資料
