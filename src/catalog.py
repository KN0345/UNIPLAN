import os
import sqlite3
import requests
API_BASE_URL = "http://127.0.0.1:8000"

# --- SQLite 連線強化補丁 ---
_original_connect = sqlite3.connect
def _robust_connect(*args, **kwargs):
    if args and isinstance(args[0], str):
        os.makedirs(os.path.dirname(args[0]), exist_ok=True) # 確保資料夾絕對存在
    kwargs.setdefault('timeout', 30.0) # 延長等待時間，避免 Database is locked
    kwargs.setdefault('check_same_thread', False) # 允許雲端多執行緒存取
    return _original_connect(*args, **kwargs)
sqlite3.connect = _robust_connect
# ---------------------------

import json
import re
from contextlib import closing
from bs4 import BeautifulSoup
from typing import List, Optional, Tuple
from .models import Course
from .parser import CourseParser
from .config import DB_PATH, DEFAULT_GRADUATION_REQ
import streamlit as st

# 嘗試初始化 Supabase 雲端資料庫客戶端
try:
    from supabase import create_client, Client
    SUPABASE_URL = st.secrets.get("SUPABASE_URL", "")
    SUPABASE_KEY = st.secrets.get("SUPABASE_KEY", "")
    if SUPABASE_URL and SUPABASE_KEY:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    else:
        supabase = None
except (ImportError, FileNotFoundError):
    supabase = None

class CourseCatalog:
    """負責處理本地課程資料的資料庫存取與查詢"""
    DB_PATH_STR = str(DB_PATH)

    @staticmethod
    def get_course_folders(base_dir: str) -> dict:
        """掃描指定目錄下包含 'CLASS' 的資料夾"""
        folder_map = {}
        if os.path.exists(base_dir):
            for item in os.listdir(base_dir):
                item_path = os.path.join(base_dir, item)
                if os.path.isdir(item_path) and "CLASS" in item.upper():
                    folder_map[item] = item_path
        return folder_map

    @staticmethod
    def init_db():
        with closing(sqlite3.connect(CourseCatalog.DB_PATH_STR)) as conn:
            with conn: # 自動處理 commit / rollback
                conn.execute('''
                    CREATE TABLE IF NOT EXISTS courses (
                        serial TEXT, code TEXT, name TEXT, credits INTEGER, category TEXT,
                        teacher TEXT, classroom TEXT, capacity TEXT, time_data TEXT,
                        semester_source TEXT, grade TEXT, major TEXT, sem_seq TEXT,
                        class_name TEXT, group_type TEXT, time_info TEXT,
                        department TEXT, notes TEXT,
                        PRIMARY KEY (serial, semester_source)
                    )
                ''')
                # 無縫升級：若舊資料庫沒這欄位，自動補上
                try:
                    conn.execute("ALTER TABLE courses ADD COLUMN department TEXT")
                except sqlite3.OperationalError:
                    pass # 欄位已存在
                try:
                    conn.execute("ALTER TABLE courses ADD COLUMN notes TEXT")
                except sqlite3.OperationalError:
                    pass # 欄位已存在
                    
                conn.execute('''CREATE TABLE IF NOT EXISTS reviews (
                    code TEXT, user_id TEXT, content TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )''')
                # 無縫升級：新增星數與標籤欄位
                try: conn.execute("ALTER TABLE reviews ADD COLUMN rating INTEGER DEFAULT 5")
                except sqlite3.OperationalError: pass
                try: conn.execute("ALTER TABLE reviews ADD COLUMN tags TEXT DEFAULT ''")
                except sqlite3.OperationalError: pass

                conn.execute('''CREATE TABLE IF NOT EXISTS course_demand (
                    semester_source TEXT, serial TEXT, user_id TEXT, PRIMARY KEY (semester_source, serial, user_id)
                )''')
                conn.execute('''CREATE TABLE IF NOT EXISTS graduation_rules (
                    dept_code TEXT, admission_year INTEGER, req_data TEXT, PRIMARY KEY (dept_code, admission_year)
                )''')
                
                # 無縫升級 program_rules 支援科系代碼
                try:
                    conn.execute("SELECT dept_code FROM program_rules LIMIT 1")
                except sqlite3.OperationalError:
                    conn.execute("DROP TABLE IF EXISTS program_rules")
                    conn.execute('''CREATE TABLE program_rules (
                        program_name TEXT, dept_code TEXT, req_data TEXT, PRIMARY KEY (program_name, dept_code)
                    )''')

    @staticmethod
    def migrate_default_rules():
        """無縫轉移舊資料：若資料庫內沒規則，自動寫入預設值"""
        CourseCatalog.init_db()
        with closing(sqlite3.connect(CourseCatalog.DB_PATH_STR)) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM graduation_rules")
            if cursor.fetchone()[0] == 0:
                conn.execute("INSERT INTO graduation_rules VALUES (?, ?, ?)", ("ALL", 0, json.dumps(DEFAULT_GRADUATION_REQ, ensure_ascii=False)))
                old_data = {
                    "41": {
                        "default": {"院必修": 0, "系必修": 72, "系選修": 28, "自由學分": 0, "中國語文能力表達": 2, "外國語文": 8, "學習發展": 1, "社團學分": 1, "人工智慧導論": 1, "探索永續": 1, "人文領域": 2, "社會領域": 2, "科學領域": 2, "總計": 128},
                        114: {"院必修": 0, "系必修": 70, "系選修": 30, "自由學分": 0, "中國語文能力表達": 2, "外國語文": 8, "學習發展": 1, "社團學分": 1, "人工智慧導論": 1, "探索永續": 1, "人文領域": 2, "社會領域": 2, "科學領域": 2, "總計": 128}
                    },
                    "11": {
                        "default": {"院必修": 0, "系必修": 68, "系選修": 32, "自由學分": 0, "中國語文能力表達": 2, "外國語文": 8, "學習發展": 1, "社團學分": 1, "人工智慧導論": 1, "探索永續": 1, "人文領域": 2, "社會領域": 2, "科學領域": 2, "總計": 128}
                    }
                }
                for dept, years in old_data.items():
                    for y, req in years.items():
                        year_int = 0 if y == "default" else int(y)
                        conn.execute("INSERT INTO graduation_rules VALUES (?, ?, ?)", (dept, year_int, json.dumps(req, ensure_ascii=False)))
                conn.commit()

    @staticmethod
    def get_graduation_req(dept_code: str, admission_year: int) -> dict:
        try:
            res = requests.get(f"{API_BASE_URL}/rules/graduation/{dept_code}/{admission_year}", timeout=5)
            if res.status_code == 200:
                data = res.json().get("data", {})
                if data: return data
        except Exception as e:
            print(f"[API] 讀取畢業規則失敗: {e}")
        return DEFAULT_GRADUATION_REQ

    @staticmethod
    def set_graduation_req(dept_code: str, admission_year: int, req_data: dict):
        st.cache_data.clear() # 清除快取，讓最新設定立即生效
        try:
            payload = {"dept_code": dept_code, "name_or_year": str(admission_year), "req_data": req_data}
            requests.post(f"{API_BASE_URL}/rules/graduation", json=payload, timeout=5)
        except Exception as e:
            print(f"[API] 寫入畢業規則失敗: {e}")

    @staticmethod
    @st.cache_data(ttl=1800, show_spinner=False)
    def get_all_program_names() -> List[str]:
        try:
            res = requests.get(f"{API_BASE_URL}/rules/programs", timeout=5)
            if res.status_code == 200:
                return res.json().get("data", [])
        except Exception as e:
            print(f"[API] 讀取學程清單失敗: {e}")
        return []

    @staticmethod
    def get_program_req(name: str, dept_code: str) -> dict:
        try:
            res = requests.get(f"{API_BASE_URL}/rules/program/{name}?dept_code={dept_code}", timeout=5)
            if res.status_code == 200:
                return res.json().get("data", {})
        except Exception as e:
            print(f"[API] 讀取學程規則失敗: {e}")
        return {}

    @staticmethod
    @st.cache_data(ttl=1800, show_spinner=False)
    def get_program_depts(name: str) -> List[str]:
        """獲取該學程有設定的所有科系代碼"""
        try:
            res = requests.get(f"{API_BASE_URL}/rules/program-depts/{name}", timeout=5)
            if res.status_code == 200:
                return res.json().get("data", [])
        except Exception as e:
            print(f"[API] 讀取學程科系失敗: {e}")
        return []

    @staticmethod
    def set_program_req(name: str, dept_code: str, req_data: dict):
        st.cache_data.clear()
        try:
            payload = {"dept_code": dept_code, "name_or_year": name, "req_data": req_data}
            requests.post(f"{API_BASE_URL}/rules/program", json=payload, timeout=5)
        except Exception as e:
            print(f"[API] 寫入學程規則失敗: {e}")

    @staticmethod
    def delete_program(name: str, dept_code: str = None):
        st.cache_data.clear()
        dept = dept_code if dept_code else "ALL"
        try:
            requests.delete(f"{API_BASE_URL}/rules/program/{name}/{dept}", timeout=5)
        except Exception as e:
            print(f"[API] 刪除學程失敗: {e}")

    @staticmethod
    def sync_all_folders(folder_map: dict):
        CourseCatalog.init_db()
        st.cache_data.clear()
        total_files, total_courses = 0, 0

        with closing(sqlite3.connect(CourseCatalog.DB_PATH_STR)) as conn:
            with conn: # 自動處理 commit / rollback
                cursor = conn.cursor()
                for sem_label, folder_path in folder_map.items():
                    abs_path = os.path.abspath(folder_path)
                    if not os.path.exists(abs_path):
                        print(f"[錯誤] 找不到資料夾: {abs_path}")
                        continue
                    
                    files = []
                    for root, _, filenames in os.walk(abs_path):
                        for f in filenames:
                            if f.lower().endswith((".htm", ".html")):
                                files.append(os.path.join(root, f))
                    
                    print(f"[系統] 資料夾 [{sem_label}] 發現 {len(files)} 個檔案，開始解析...")
        
                    for file_path in files:
                        courses = CourseParser.fetch_courses_offline(file_path)
                        
                        if courses:
                            for c in courses:
                                c.semester_source = sem_label 
                                cursor.execute('''
                                    INSERT OR REPLACE INTO courses
                                    (serial, code, name, credits, category, teacher, classroom, capacity, time_data, semester_source,
                                     grade, major, sem_seq, class_name, group_type, time_info, department, notes)
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                                ''', (c.serial, c.code, c.name, c.credits, c.category, c.teacher,
                                      c.classroom, c.capacity, json.dumps(c.time_slots), c.semester_source,
                                      c.grade, c.major, c.sem_seq, c.class_name, c.group_type, c.time_info, getattr(c, 'department', ''), getattr(c, 'notes', '')))
                                total_courses += 1
                            print(f"   [成功] {os.path.basename(file_path)}: 讀取到 {len(courses)} 堂課")
                        total_files += 1

        print(f"[完成] 總計匯入 {total_courses} 堂課程。")
        return total_files, total_courses

    @staticmethod
    @st.cache_data(ttl=1800, show_spinner=False)
    def get_all_departments() -> List[str]:
        """獲取所有不重複的科系名稱以供下拉選單使用"""
        if not os.path.exists(CourseCatalog.DB_PATH_STR):
            return []
        try:
            with closing(sqlite3.connect(CourseCatalog.DB_PATH_STR)) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT DISTINCT department FROM courses WHERE department IS NOT NULL AND department != '' ORDER BY department")
                return [row[0] for row in cursor.fetchall()]
        except sqlite3.Error:
            return []
            
    @staticmethod
    @st.cache_data(ttl=1800, show_spinner=False)
    def get_all_categories() -> List[str]:
        """獲取所有不重複的必選修類別以供下拉選單使用"""
        if not os.path.exists(CourseCatalog.DB_PATH_STR):
            return []
        try:
            with closing(sqlite3.connect(CourseCatalog.DB_PATH_STR)) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT DISTINCT category FROM courses WHERE category IS NOT NULL AND category != '' ORDER BY category")
                return [row[0] for row in cursor.fetchall()]
        except sqlite3.Error:
            return []

    @staticmethod
    @st.cache_data(ttl=1800, show_spinner=False)
    def get_all_grades() -> List[str]:
        """獲取所有不重複的年級以供下拉選單使用"""
        if not os.path.exists(CourseCatalog.DB_PATH_STR):
            return []
        try:
            with closing(sqlite3.connect(CourseCatalog.DB_PATH_STR)) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT DISTINCT grade FROM courses WHERE grade IS NOT NULL AND grade != '' ORDER BY grade")
                return [row[0] for row in cursor.fetchall()]
        except sqlite3.Error:
            return []

    @staticmethod
    @st.cache_data(ttl=1800, show_spinner=False)
    def get_total_count() -> int:
        """獲取資料庫中的課程總數"""
        if supabase:
            try:
                # Supabase 的 count 會比較慢，但為了雲端一致性
                res = supabase.table("courses").select("serial", count='exact').execute()
                return res.count
            except Exception as e:
                print(f"[Supabase] 獲取課程總數失敗: {e}")
                return 0
        else:
            if not os.path.exists(CourseCatalog.DB_PATH_STR): return 0
            try:
                with closing(sqlite3.connect(CourseCatalog.DB_PATH_STR)) as conn:
                    cursor = conn.cursor()
                    cursor.execute("SELECT COUNT(*) FROM courses")
                    return cursor.fetchone()[0]
            except sqlite3.Error:
                return 0

    @staticmethod
    @st.cache_data(ttl=1800, show_spinner=False)
    def get_all_course_names() -> List[str]:
        """獲取所有不重複且乾淨的課程名稱 (不含班級後綴)"""
        if supabase:
            try:
                res = supabase.table("courses").select("name").execute()
            except Exception as e:
                print(f"[Supabase] 獲取課程名稱失敗: {e}")
                res = None
        else:
            if not os.path.exists(CourseCatalog.DB_PATH_STR): return []
            try:
                with closing(sqlite3.connect(CourseCatalog.DB_PATH_STR)) as conn:
                    cursor = conn.cursor()
                    cursor.execute("SELECT name FROM courses WHERE name IS NOT NULL AND name != ''")
                    res = [{"name": row[0]} for row in cursor.fetchall()]
            except sqlite3.Error:
                return []
        
        if not res or (hasattr(res, 'data') and not res.data): return []
        
        names = set()
        data = res.data if hasattr(res, 'data') else res
        for item in data:
            name = item['name'].split(' (')[0].strip() if ' (' in item['name'] else item['name']
            names.add(name)
        return sorted(list(names))

    @staticmethod
    def add_review(code: str, user_id: str, content: str, rating: int = 5, tags: str = ""):
        CourseCatalog.init_db() # 寫入前自動確保表格存在
        if supabase:
            supabase.table("reviews").insert({"code": code, "user_id": user_id, "content": content, "rating": rating, "tags": tags}).execute()
        else:
            with closing(sqlite3.connect(CourseCatalog.DB_PATH_STR)) as conn:
                with conn:
                    conn.execute("INSERT INTO reviews (code, user_id, content, rating, tags) VALUES (?, ?, ?, ?, ?)", (code, user_id, content, rating, tags))

    @staticmethod
    def get_reviews(code: str) -> List[dict]:
        CourseCatalog.init_db() # 確保表格已經無縫升級
        if supabase:
            try:
                res = supabase.table("reviews").select("user_id, content, timestamp, rating, tags").eq("code", code).order("timestamp", desc=True).execute()
                return [{"user": r["user_id"], "content": r["content"], "time": r["timestamp"], "rating": r.get("rating", 5), "tags": r.get("tags", "")} for r in res.data]
            except Exception as e:
                print(f"[Supabase] 讀取評價失敗: {e}")
                return []
        else:
            if not os.path.exists(CourseCatalog.DB_PATH_STR): return []
            try:
                with closing(sqlite3.connect(CourseCatalog.DB_PATH_STR)) as conn:
                    cursor = conn.cursor()
                    cursor.execute("SELECT user_id, content, timestamp, rating, tags FROM reviews WHERE code=? ORDER BY timestamp DESC", (code,))
                    return [{"user": r[0], "content": r[1], "time": r[2], "rating": r[3] if r[3] is not None else 5, "tags": r[4] or ""} for r in cursor.fetchall()]
            except sqlite3.OperationalError:
                return [] # 若表格尚未建立，安全地回傳空陣列

    @staticmethod
    def sync_demand(user_id: str, planned_schedule: dict):
        CourseCatalog.init_db() # 寫入前自動確保表格存在
        demand_data = []
        for sem, courses in planned_schedule.items():
            for c in courses:
                if c.serial and c.semester_source:
                    demand_data.append({"semester_source": c.semester_source, "serial": c.serial, "user_id": user_id})
                    
        if supabase:
            try:
                supabase.table("course_demand").delete().eq("user_id", user_id).execute()
                if demand_data:
                    supabase.table("course_demand").upsert(demand_data).execute()
            except Exception as e:
                print(f"[Supabase] 寫入預排熱度失敗: {e}")
        else:
            with closing(sqlite3.connect(CourseCatalog.DB_PATH_STR)) as conn:
                with conn:
                    conn.execute("DELETE FROM course_demand WHERE user_id=?", (user_id,))
                    for d in demand_data:
                        conn.execute("INSERT INTO course_demand (semester_source, serial, user_id) VALUES (?, ?, ?)", (d["semester_source"], d["serial"], d["user_id"]))

    @staticmethod
    def get_demand(semester_source: str, serial: str) -> int:
        if supabase:
            try:
                res = supabase.table("course_demand").select("user_id", count="exact").eq("semester_source", semester_source).eq("serial", serial).execute()
                return res.count if res.count else 0
            except Exception as e:
                print(f"[Supabase] 讀取預排熱度失敗: {e}")
                return 0
        else:
            if not os.path.exists(CourseCatalog.DB_PATH_STR): return 0
            try:
                with closing(sqlite3.connect(CourseCatalog.DB_PATH_STR)) as conn:
                    cursor = conn.cursor()
                    cursor.execute("SELECT COUNT(*) FROM course_demand WHERE semester_source=? AND serial=?", (semester_source, serial))
                    return cursor.fetchone()[0]
            except sqlite3.OperationalError:
                return 0 # 若表格尚未建立，安全地回傳 0 人

    @staticmethod
    def upload_local_db_to_supabase():
        """將本地 SQLite 資料庫完整上傳至 Supabase"""
        if not supabase or not os.path.exists(CourseCatalog.DB_PATH_STR):
            return False, "Supabase 未設定或本地資料庫不存在"

        st.cache_data.clear()

        try:
            with closing(sqlite3.connect(CourseCatalog.DB_PATH_STR)) as conn:
                cursor = conn.cursor()
                
                # 1. 上傳 courses
                cursor.execute("SELECT * FROM courses")
                courses = []
                for row in cursor.fetchall():
                    item = dict(zip([d[0] for d in cursor.description], row))
                    if isinstance(item.get('time_data'), str):
                        try: item['time_data'] = json.loads(item['time_data'])
                        except Exception: pass
                    courses.append(item)
                if courses:
                    # 分批上傳，避免 Supabase API 負載過大導致當機沒反應
                    for i in range(0, len(courses), 200):
                        supabase.table("courses").upsert(courses[i:i+200]).execute()

                # 2. 上傳 graduation_rules
                cursor.execute("SELECT * FROM graduation_rules")
                grad_rules = []
                for row in cursor.fetchall():
                    item = dict(zip([d[0] for d in cursor.description], row))
                    if isinstance(item.get('req_data'), str):
                        try: item['req_data'] = json.loads(item['req_data'])
                        except Exception: pass
                    grad_rules.append(item)
                if grad_rules: supabase.table("graduation_rules").upsert(grad_rules).execute()

                # 3. 上傳 program_rules
                cursor.execute("SELECT * FROM program_rules")
                prog_rules = []
                for row in cursor.fetchall():
                    item = dict(zip([d[0] for d in cursor.description], row))
                    if isinstance(item.get('req_data'), str):
                        try: item['req_data'] = json.loads(item['req_data'])
                        except Exception: pass
                    prog_rules.append(item)
                if prog_rules: supabase.table("program_rules").upsert(prog_rules).execute()

                # 4. 上傳 reviews
                try:
                    cursor.execute("SELECT * FROM reviews")
                    reviews = [dict(zip([d[0] for d in cursor.description], row)) for row in cursor.fetchall()]
                    if reviews: supabase.table("reviews").insert(reviews).execute()
                except Exception: pass

                # 5. 上傳 course_demand
                try:
                    cursor.execute("SELECT * FROM course_demand")
                    demands = [dict(zip([d[0] for d in cursor.description], row)) for row in cursor.fetchall()]
                    if demands: supabase.table("course_demand").upsert(demands).execute()
                except Exception: pass
            return True, f"成功上傳 {len(courses)} 門課程與所有規則"
        except Exception as e:
            return False, f"上傳失敗: {e}"

    @staticmethod
    def query_db(
        keyword: str = "",
        semester: str = "全部",
        department: str = "全部",
        category: str = "全部",
        grade: str = "全部",
        gen_edu_filter: str = "全部",
        weekday: str = "全部",
        period: str = "全部"
    ):
        """查詢課程。

        優先使用 FastAPI，若後端尚未啟動則自動退回本機 SQLite。
        這樣使用者只開 Streamlit 時，搜尋、加入暫存與課表規劃仍可正常使用。
        """
        params = {
            "keyword": keyword or "",
            "semester": semester or "全部",
            "department": department or "全部",
            "category": category or "全部",
            "grade": grade or "全部",
            "gen_edu_filter": gen_edu_filter or "全部",
            "weekday": weekday or "全部",
            "period": str(period) if period else "全部"
        }

        try:
            res = requests.get(f"{API_BASE_URL}/courses", params=params, timeout=2)
            if res.status_code == 200:
                courses = []
                for c in res.json().get("data", []):
                    try:
                        courses.append(Course(**c))
                    except Exception as e:
                        print("[API]轉換失敗:", e)
                return courses
            print("[API]課程查詢失敗:", res.status_code, res.text)
        except Exception as e:
            print(f"[API]未啟動或查詢失敗，改用 SQLite：{e}")

        return CourseCatalog.query_db_local(
            keyword=keyword,
            semester=semester,
            department=department,
            category=category,
            grade=grade,
            gen_edu_filter=gen_edu_filter,
            weekday=weekday,
            period=period,
        )

    @staticmethod
    def query_db_local(
        keyword: str = "",
        semester: str = "全部",
        department: str = "全部",
        category: str = "全部",
        grade: str = "全部",
        gen_edu_filter: str = "全部",
        weekday: str = "全部",
        period: str = "全部"
    ) -> List[Course]:
        if not os.path.exists(CourseCatalog.DB_PATH_STR):
            return []
        courses: List[Course] = []
        target_w = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '日': 7}.get(weekday, 0)
        try:
            target_p = int(period) if str(period).isdigit() else 0
        except Exception:
            target_p = 0

        sql = "SELECT serial, code, name, credits, category, teacher, classroom, capacity, time_data, semester_source, grade, major, sem_seq, class_name, group_type, time_info, department, notes FROM courses WHERE 1=1"
        values = []
        if keyword:
            sql += " AND (name LIKE ? OR teacher LIKE ? OR code LIKE ? OR notes LIKE ?)"
            like = f"%{keyword}%"
            values.extend([like, like, like, like])
        if semester and semester not in ["全部", "請選擇"]:
            sql += " AND semester_source = ?"
            values.append(semester)
        if department and department not in ["全部", "請選擇"]:
            if department == "通識課程":
                sql += " AND (department LIKE ? OR department LIKE ? OR department LIKE ?)"
                values.extend(['%核心%', '%通識%', '%共通%'])
            elif department == "體育課程":
                sql += " AND department LIKE ?"
                values.append('%體育%')
            elif department == "外語課程":
                sql += " AND (department LIKE ? OR department LIKE ? OR department LIKE ? OR department LIKE ?)"
                values.extend(['%外語%', '%語文%', '%語言%', '%英文%'])
            else:
                sql += " AND department = ?"
                values.append(department)
        if category and category not in ["全部", "請選擇"]:
            sql += " AND category = ?"
            values.append(category)
        if grade and grade not in ["全部", "請選擇"]:
            sql += " AND grade = ?"
            values.append(grade)

        if gen_edu_filter and gen_edu_filter != "全部":
            group_map = {
                "人文領域": ['L', 'P', 'V', 'M'],
                "社會領域": ['W', 'T', 'R', 'S'],
                "科學領域": ['U', 'Z', 'O'],
                "外國語文": ['Q', 'QA', 'QB', 'QC', 'QD', 'QE', 'QF', 'QG'],
            }
            if gen_edu_filter in group_map:
                placeholders = ",".join(["?"] * len(group_map[gen_edu_filter]))
                sql += f" AND group_type IN ({placeholders})"
                values.extend(group_map[gen_edu_filter])
            elif gen_edu_filter == "學習與發展":
                sql += " AND group_type = ?"
                values.append('N')
            elif gen_edu_filter == "課外活動與團隊發展":
                sql += " AND group_type = ?"
                values.append('K')
            else:
                sql += " AND name LIKE ?"
                values.append(f"%{gen_edu_filter}%")

        sql += " ORDER BY semester_source DESC, department, grade, name LIMIT 500"
        try:
            with closing(sqlite3.connect(CourseCatalog.DB_PATH_STR)) as conn:
                cursor = conn.cursor()
                cursor.execute(sql, values)
                for r in cursor.fetchall():
                    time_slots = json.loads(r[8]) if r[8] else []
                    if target_w != 0 or target_p != 0:
                        if not time_slots:
                            continue
                        matched = any(((target_w == 0) or (t[0] == target_w)) and ((target_p == 0) or (t[1] <= target_p <= t[2])) for t in time_slots)
                        if not matched:
                            continue
                    try:
                        courses.append(Course(
                            serial=r[0] or "",
                            code=r[1] or "",
                            name=r[2] or "",
                            credits=int(r[3] or 0),
                            category=r[4] or "",
                            teacher=r[5] or "",
                            classroom=r[6] or "",
                            capacity=r[7] or "",
                            time_slots=[tuple(t) for t in time_slots],
                            semester_source=r[9] or "",
                            grade=r[10] or "",
                            major=r[11] or "",
                            sem_seq=r[12] or "",
                            class_name=r[13] or "",
                            group_type=r[14] or "",
                            time_info=r[15] or "",
                            department=r[16] or "",
                            notes=r[17] or "",
                        ))
                    except Exception as e:
                        print("[SQLite]課程轉換失敗:", e)
        except Exception as e:
            print(f"[SQLite]查詢失敗:{e}")
        return courses

    @staticmethod
    def search_course(catalog: List[Course], code: str) -> Optional[Course]:
        """在抓取下來的清單中搜尋特定課程"""
        return next((c for c in catalog if c.code.startswith(code)), None)
