# Windows 啟動方式

## 前端

```powershell
cd frontend
npm install
npm run dev
```

如果 npm 壞掉，可改：

```powershell
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
pnpm dev
```

## 後端

建議使用 Python 3.11，不建議 Python 3.14。

```powershell
py -3.11 -m pip install fastapi uvicorn sqlalchemy pandas openpyxl python-multipart
py -3.11 -m uvicorn src.main:app --reload
```

若只裝了 Python 3.14，可以先試：

```powershell
pip install fastapi uvicorn sqlalchemy pandas openpyxl python-multipart
python -m uvicorn src.main:app --reload
```
