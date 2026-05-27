# TKU Planner React Connected

這版已把 React 前端接上現有 FastAPI API。

## 前端
cd frontend
npm install
npm run dev

開啟：
http://127.0.0.1:5173/

## 後端
請在原本專案 src 啟動：
cd src
python -m uvicorn main:app --reload --port 8000

## 重要
原本後端 main.py 的 CORS 只允許 3000。
若 React 查詢 API 被 CORS 擋，請把 backend_patch/src/main.py 覆蓋到你原本的 src/main.py。
這個 patch 只新增 5173 到 CORS allow_origins，其他 API 保留。
