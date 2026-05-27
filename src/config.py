import os
from pathlib import Path

# 取得專案根目錄 (移至 uni 目錄)
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
RAW_DATA_DIR = BASE_DIR / "raw_data"

# 確保資料夾存在
DATA_DIR.mkdir(parents=True, exist_ok=True)
RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)

# 定義共用路徑
DB_PATH = DATA_DIR / "course_inventory.db"
CLOUD_BACKUP_PATH = DATA_DIR / "cloud_backup.json"
LOCAL_PLAN_PATH = DATA_DIR / "my_four_year_plan.json"

# 預設畢業門檻設定 (當學生的科系沒有特別設定時使用)
DEFAULT_GRADUATION_REQ = {
    "院必修": 0, "系必修": 60, "系選修": 40, "自由學分": 0,
    "中國語文能力表達": 2, "外國語文": 8, "學習發展": 1, "社團學分": 1,
    "人工智慧導論": 1, "探索永續": 1, "人文領域": 2, "社會領域": 2, "科學領域": 2,
    "校園與社區服務學習": 0, "全民國防": 0, "體育": 0, "總計": 128
}