from fastapi import FastAPI, HTTPException, Depends, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, or_
from sqlalchemy.orm import sessionmaker, Session
import json
import os
import smtplib
import random
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from passlib.hash import bcrypt
import hashlib
import secrets
import sqlite3
from datetime import datetime, timedelta

try:
    from .models_db import Base, Feedback, UserSchedule, CourseDB, Review, CourseDemand, GraduationRule, ProgramRule, UserAccount, UserSession, UserDataBundle, PasswordResetOTP, CourseClassification, DataImportLog, DepartmentCode
    from .student_id import DEFAULT_DEPARTMENT_CODES, parse_student_id
    from . import engine
except ImportError:  # 支援直接從 src 目錄執行的舊啟動方式
    from models_db import Base, Feedback, UserSchedule, CourseDB, Review, CourseDemand, GraduationRule, ProgramRule, UserAccount, UserSession, UserDataBundle, PasswordResetOTP, CourseClassification, DataImportLog, DepartmentCode
    from student_id import DEFAULT_DEPARTMENT_CODES, parse_student_id
    import engine

# 1. 資料庫初始化
# 部署時可用 UNIPLAN_DB_PATH 指定資料庫位置；未指定時使用專案內 data/course_inventory.db。
DEFAULT_DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'course_inventory.db'))
DB_PATH = os.path.abspath(os.environ.get('UNIPLAN_DB_PATH', DEFAULT_DB_PATH))
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"
db_engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)

# 建立所有資料表
Base.metadata.create_all(bind=db_engine)

def ensure_account_schema():
    # SQLite create_all 不會自動替舊資料表新增欄位；這裡補齊帳號系統欄位，避免舊 DB 啟動失敗。
    columns = {
        "role": "TEXT DEFAULT 'student'",
        "email": "TEXT DEFAULT ''",
        "display_name": "TEXT DEFAULT ''",
        "department": "TEXT DEFAULT ''",
        "grade": "TEXT DEFAULT ''",
        "admission_year": "TEXT DEFAULT ''",
        "student_status": "TEXT DEFAULT '在學'",
        "email_bound": "BOOLEAN DEFAULT 0",
        "google_bound": "BOOLEAN DEFAULT 0",
        "sync_enabled": "BOOLEAN DEFAULT 1",
        "is_active": "BOOLEAN DEFAULT 1",
    }
    try:
        with sqlite3.connect(DB_PATH) as conn:
            existing = {row[1] for row in conn.execute("PRAGMA table_info(user_accounts)").fetchall()}
            if not existing:
                return
            for name, ddl in columns.items():
                if name not in existing:
                    conn.execute(f"ALTER TABLE user_accounts ADD COLUMN {name} {ddl}")
            conn.commit()
    except Exception as exc:
        print(f"[schema warning] user_accounts migration skipped: {exc}")

ensure_account_schema()

def ensure_department_codes():
    try:
        db = SessionLocal()
        for code, (name, college) in DEFAULT_DEPARTMENT_CODES.items():
            existing = db.query(DepartmentCode).filter(DepartmentCode.code == code).first()
            if not existing:
                db.add(DepartmentCode(code=code, name=name, college=college, is_active=True))
        db.commit()
    except Exception as exc:
        print(f"[schema warning] department code seed skipped: {exc}")
    finally:
        try:
            db.close()
        except Exception:
            pass

ensure_department_codes()

def lookup_department_from_db(db: Session, code: str):
    row = db.query(DepartmentCode).filter(DepartmentCode.code == code, DepartmentCode.is_active == True).first()
    if not row:
        return None
    return {"code": row.code, "name": row.name, "college": row.college}

app = FastAPI(title="TKU 排課系統 API", version="1.0.0")

# CORS 設定
# 本機預設允許 Vite；部署時請在環境變數 UNIPLAN_CORS_ORIGINS 填入正式前端網址，
# 例如：https://uniplan.vercel.app,https://www.uniplan.app
def _read_cors_origins():
    defaults = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    raw = os.environ.get("UNIPLAN_CORS_ORIGINS", "")
    configured = [origin.strip().rstrip("/") for origin in raw.split(",") if origin.strip()]
    return sorted(set(defaults + configured))

app.add_middleware(
    CORSMiddleware,
    allow_origins=_read_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Dependency: 取得資料庫 Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 3. Pydantic 驗證模型
class ScheduleRequest(BaseModel):
    student_id: str
    courses: list = Field(default_factory=list, description="欲排課的課程清單")
    completed_courses: list = Field(default_factory=list, description="已修畢的課程清單")
    preferences: dict = Field(default_factory=dict, description="排課偏好(如不排早八等)")

class SaveScheduleRequest(BaseModel):
    student_id: str = Field(..., description="學號")
    schedule_data: dict = Field(..., description="課表與暫存區資料(JSON)")

class FeedbackRequest(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="評分 1 到 5 星")
    content: str = Field(..., min_length=1, description="回饋內容")

class GraduationRequest(BaseModel):
    courses: list = Field(..., description="已修與計畫中的所有課程(展平的列表)")
    requirements: dict = Field(..., description="該科系的畢業門檻規則")

class SubmitReviewRequest(BaseModel):
    code: str = Field(..., description="課程編號 (例如 S0358)")
    user_id: str = Field(..., description="學號")
    content: str = Field(..., description="心得內容")
    rating: int = Field(5, ge=1, le=5, description="推薦星數")
    tags: str = Field("", description="標籤，以逗號分隔")

class LoginRequest(BaseModel):
    student_id: str = Field(..., description="學號")
    password: str = Field(..., description="密碼")

class RegisterRequest(BaseModel):
    student_id: str = Field(..., description="學號")
    password: str = Field(..., description="密碼")
    display_name: str = Field("", description="顯示名稱")

class ProfileRequest(BaseModel):
    display_name: str = ""
    email: str = ""
    department: str = ""
    grade: str = ""
    admission_year: str = ""
    student_status: str = "在學"
    email_bound: bool = False
    google_bound: bool = False
    sync_enabled: bool = True

class UserDataSyncRequest(BaseModel):
    data: dict = Field(default_factory=dict, description="前端完整使用者資料包")

class SendOTPRequest(BaseModel):
    student_id: str = Field(..., description="學號")

class ResetPasswordRequest(BaseModel):
    student_id: str = Field(..., description="學號")
    otp: str = Field("", description="OTP 驗證碼，可留空（管理員重設）")
    new_password: str = Field(..., description="新密碼")

class DemandItem(BaseModel):
    semester_source: str
    serial: str

class SyncDemandRequest(BaseModel):
    user_id: str
    demand_data: list[DemandItem] = Field(..., description="欲同步的課程清單")

class SetRuleRequest(BaseModel):
    dept_code: str = Field(..., description="科系代碼")
    name_or_year: str = Field(..., description="入學年度 或 學程名稱")
    req_data: dict = Field(..., description="規則 JSON")

class CourseImportRequest(BaseModel):
    semester_source: str = Field(..., description="學期來源，例如 114_2")
    courses: list[dict] = Field(default_factory=list, description="官方課程資料陣列")
    overwrite_semester: bool = Field(False, description="是否覆蓋同一學期既有資料")
    source_name: str = Field("manual", description="資料來源名稱")

class CourseClassificationRequest(BaseModel):
    id: int | None = None
    rule_id: str = "generic"
    dept_code: str = "ALL"
    admission_year: int = 0
    course_key: str
    course_name: str = ""
    category_key: str = "freeElective"
    category_label: str = "自由"
    credit_override: int | None = None
    is_required: bool = False
    prerequisites: list[str] = Field(default_factory=list)
    followups: list[str] = Field(default_factory=list)
    notes: str = ""

class GraduationRuleUpsertRequest(BaseModel):
    dept_code: str = "ALL"
    admission_year: int = 0
    req_data: dict = Field(default_factory=dict)

class ProgramRuleUpsertRequest(BaseModel):
    program_name: str
    dept_code: str = "ALL"
    req_data: dict = Field(default_factory=dict)


@app.get("/health", summary="健康檢查")
def health_check():
    return {"status": "ok", "service": "uniplan-api", "database": os.path.basename(DB_PATH)}

# 4. API 路由定義
@app.post("/solve", summary="執行排課演算法")
async def solve_schedule(request: ScheduleRequest):
    try:
        # 將處理邏輯丟給 engine
        result = engine.run_scheduling_algorithm(request.dict())
        return {"message": "排課運算成功", "data": result}
    except Exception as e:
        # 捕捉未知錯誤並回傳 500
        raise HTTPException(status_code=500, detail=f"排課處理發生錯誤: {str(e)}")

@app.post("/feedback", summary="新增使用者回饋")
async def submit_feedback(request: FeedbackRequest, db: Session = Depends(get_db)):
    try:
        new_feedback = Feedback(rating=request.rating, content=request.content)
        db.add(new_feedback)
        db.commit()
        db.refresh(new_feedback)
        return {"message": "感謝您的回饋！", "feedback_id": new_feedback.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"儲存回饋時發生錯誤: {str(e)}")

@app.post("/schedule", summary="儲存使用者課表")
async def save_schedule(request: SaveScheduleRequest, db: Session = Depends(get_db)):
    try:
        db_schedule = db.query(UserSchedule).filter(UserSchedule.student_id == request.student_id).first()
        if db_schedule:
            # 若已有紀錄則更新 (Upsert)
            db_schedule.schedule_data = request.schedule_data
        else:
            # 若無紀錄則新增
            db_schedule = UserSchedule(student_id=request.student_id, schedule_data=request.schedule_data)
            db.add(db_schedule)
        db.commit()
        return {"message": "課表儲存成功"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"儲存課表時發生錯誤: {str(e)}")

@app.get("/schedule/{student_id}", summary="讀取使用者課表")
async def get_schedule(student_id: str, db: Session = Depends(get_db)):
    db_schedule = db.query(UserSchedule).filter(UserSchedule.student_id == student_id).first()
    if not db_schedule:
        return {"message": "無存檔紀錄", "data": {}}
    return {"message": "課表讀取成功", "data": db_schedule.schedule_data}

@app.post("/analyze-graduation", summary="計算畢業學分與門檻狀態")
async def analyze_graduation(request: GraduationRequest):
    try:
        report = engine.analyze_graduation_status(request.courses, request.requirements)
        return {"message": "學分分析成功", "data": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"學分分析發生錯誤: {str(e)}")

@app.get("/courses", summary="取得課程清單 (Course Catalog)")
async def get_courses(
    keyword: str = Query("", description="搜尋課名、老師、代碼"),
    semester: str = Query("全部", description="學期來源"),
    department: str = Query("全部", description="科系"),
    category: str = Query("全部", description="必選修"),
    grade: str = Query("全部", description="年級"),
    gen_edu_filter: str = Query("全部", description="通識與群別"),
    weekday: str = Query("全部", description="星期 (一~日)"),
    period: str = Query("全部", description="節次 (1~14)"),
    db: Session = Depends(get_db)
):
    try:
        query = db.query(CourseDB)
        
        if keyword:
            query = query.filter(
                or_(
                    CourseDB.name.ilike(f"%{keyword}%"),
                    CourseDB.teacher.ilike(f"%{keyword}%"),
                    CourseDB.code.ilike(f"%{keyword}%"),
                    CourseDB.notes.ilike(f"%{keyword}%")
                )
            )
            
        if semester and semester not in ["全部", "請選擇"]:
            query = query.filter(CourseDB.semester_source == semester)
            
        if department and department not in ["全部", "請選擇"]:
            if department == "通識課程":
                query = query.filter(or_(CourseDB.department.ilike('%核心%'), CourseDB.department.ilike('%通識%'), CourseDB.department.ilike('%共通%')))
            elif department == "體育課程":
                query = query.filter(CourseDB.department.ilike('%體育%'))
            elif department == "外語課程":
                query = query.filter(or_(CourseDB.department.ilike('%外語%'), CourseDB.department.ilike('%語文%'), CourseDB.department.ilike('%語言%'), CourseDB.department.ilike('%英文%')))
            else:
                query = query.filter(CourseDB.department == department)
                
        if category and category not in ["全部", "請選擇"]:
            query = query.filter(CourseDB.category == category)
            
        if grade and grade not in ["全部", "請選擇"]:
            query = query.filter(CourseDB.grade == grade)
            
        if gen_edu_filter and gen_edu_filter != "全部":
            if gen_edu_filter == "人文領域":
                query = query.filter(CourseDB.group_type.in_(['L', 'P', 'V', 'M']))
            elif gen_edu_filter == "社會領域":
                query = query.filter(CourseDB.group_type.in_(['W', 'T', 'R', 'S']))
            elif gen_edu_filter == "科學領域":
                query = query.filter(CourseDB.group_type.in_(['U', 'Z', 'O']))
            elif gen_edu_filter == "外國語文":
                query = query.filter(CourseDB.group_type.in_(['Q', 'QA', 'QB', 'QC', 'QD', 'QE', 'QF', 'QG']))
            elif gen_edu_filter == "學習與發展":
                query = query.filter(CourseDB.group_type == 'N')
            elif gen_edu_filter == "課外活動與團隊發展":
                query = query.filter(CourseDB.group_type == 'K')
            elif gen_edu_filter == "中國語文能力表達":
                query = query.filter(CourseDB.name.ilike('%中國語文能力表達%'))
            elif gen_edu_filter == "人工智慧導論":
                query = query.filter(CourseDB.name.ilike('%人工智慧導論%'))
            elif gen_edu_filter == "探索永續":
                query = query.filter(CourseDB.name.ilike('%探索永續%'))
            
        # 限制回傳筆數，避免 payload 過大
        results = query.limit(500).all()
        
        courses = []
        target_w = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '日': 7}.get(weekday, 0)
        target_p = int(period) if period.isdigit() else 0

        for r in results:
            time_slots = json.loads(r.time_data) if r.time_data else []
            
            # Python 端進行空堂過濾 (因為時間是 JSON 陣列，不適合直接用 SQL WHERE 篩選)
            if target_w != 0 or target_p != 0:
                if not time_slots: continue
                match = any(((target_w == 0) or (t[0] == target_w)) and ((target_p == 0) or (t[1] <= target_p <= t[2])) for t in time_slots)
                if not match: continue

            # 將 SQLAlchemy 物件轉換為字典
            courses.append({
                "serial": r.serial, "code": r.code, "name": r.name, "credits": r.credits,
                "category": r.category, "teacher": r.teacher, "classroom": r.classroom,
                "capacity": r.capacity, "time_slots": time_slots, "semester_source": r.semester_source,
                "grade": r.grade, "major": r.major, "sem_seq": r.sem_seq, "class_name": r.class_name,
                "group_type": r.group_type, "time_info": r.time_info, "department": r.department, "notes": r.notes
            })
            
        return {"message": "查詢成功", "total": len(courses), "data": courses}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"查詢課程發生錯誤: {str(e)}")

@app.get("/courses/metadata", summary="取得課程中繼資料(包含科系、年級、必選修等下拉選項)")
async def get_course_metadata(db: Session = Depends(get_db)):
    total = db.query(CourseDB).count()
    
    depts = [r[0] for r in db.query(CourseDB.department).filter(CourseDB.department.isnot(None), CourseDB.department != '').distinct().order_by(CourseDB.department).all()]
    
    cats = [r[0] for r in db.query(CourseDB.category).filter(CourseDB.category.isnot(None), CourseDB.category != '').distinct().order_by(CourseDB.category).all()]
    
    grades = [r[0] for r in db.query(CourseDB.grade).filter(CourseDB.grade.isnot(None), CourseDB.grade != '').distinct().order_by(CourseDB.grade).all()]
    
    names_raw = [r[0] for r in db.query(CourseDB.name).filter(CourseDB.name.isnot(None), CourseDB.name != '').distinct().all()]
    names_set = set()
    for n in names_raw:
        clean_n = n.split(' (')[0].strip() if ' (' in n else n
        names_set.add(clean_n)
        
    return {
        "message": "獲取成功",
        "data": {
            "total": total,
            "departments": depts,
            "categories": cats,
            "grades": grades,
            "names": sorted(list(names_set))
        }
    }

@app.post("/reviews", summary="新增課程評價")
async def add_review(request: SubmitReviewRequest, db: Session = Depends(get_db)):
    try:
        new_review = Review(
            code=request.code,
            user_id=request.user_id,
            content=request.content,
            rating=request.rating,
            tags=request.tags
        )
        db.add(new_review)
        db.commit()
        return {"message": "評價送出成功！"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"新增評價發生錯誤: {str(e)}")

@app.get("/reviews/{code}", summary="獲取特定課程的評價")
async def get_reviews(code: str, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.code == code).order_by(Review.timestamp.desc()).all()
    # 處理學號隱私 (例如 414410018 -> 414***018)
    for r in reviews:
        r.user_id = r.user_id[:3] + "***" + r.user_id[-3:] if len(r.user_id) >= 6 else "***"
    return {"message": "獲取成功", "data": reviews}

# ----- [ 5. 會員驗證系統 API ] -----

def password_hash(password: str) -> str:
    return bcrypt.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.verify(password, hashed)
    except Exception:
        # 兼容舊版 sha256 帳號
        return hashlib.sha256(password.encode()).hexdigest() == hashed

def public_user(account: UserAccount) -> dict:
    return {
        "student_id": account.student_id,
        "role": account.role or "student",
        "profile": {
            "displayName": account.display_name or "",
            "email": account.email or "",
            "department": account.department or "",
            "grade": account.grade or "",
            "admissionYear": account.admission_year or "",
            "studentStatus": account.student_status or "在學",
            "boundEmail": bool(account.email_bound),
            "boundGoogle": bool(account.google_bound),
            "syncEnabled": bool(account.sync_enabled),
        }
    }

def create_session(db: Session, student_id: str) -> str:
    token = secrets.token_urlsafe(32)
    expires = datetime.utcnow() + timedelta(days=14)
    db.add(UserSession(token=token, student_id=student_id, expires_at=expires))
    db.commit()
    return token

def get_current_account(authorization: str = Header(""), db: Session = Depends(get_db)) -> UserAccount:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="尚未登入")
    token = authorization.replace("Bearer ", "", 1).strip()
    session = db.query(UserSession).filter(UserSession.token == token).first()
    if not session or session.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="登入已過期")
    account = db.query(UserAccount).filter(UserAccount.student_id == session.student_id).first()
    if not account or not account.is_active:
        raise HTTPException(status_code=401, detail="帳號不存在或已停用")
    return account

@app.get("/student-id/parse/{student_id}", summary="解析並驗證學號")
async def parse_student_id_api(student_id: str, db: Session = Depends(get_db)):
    result = parse_student_id(student_id, lambda code: lookup_department_from_db(db, code))
    if not result.get("valid"):
        raise HTTPException(status_code=400, detail=result.get("reason", "學號格式錯誤"))
    return {"message": "解析成功", "data": result}

@app.get("/department-codes", summary="取得系所代碼表")
async def list_department_codes(db: Session = Depends(get_db)):
    rows = db.query(DepartmentCode).filter(DepartmentCode.is_active == True).order_by(DepartmentCode.code).all()
    return {"message": "讀取成功", "data": [{"code": r.code, "name": r.name, "college": r.college} for r in rows]}

@app.post("/auth/register", summary="註冊帳號")
async def auth_register(request: RegisterRequest, db: Session = Depends(get_db)):
    student_id = request.student_id.strip()
    if not student_id:
        raise HTTPException(status_code=400, detail="請輸入學號")
    if db.query(UserAccount).filter(UserAccount.student_id == student_id).first():
        raise HTTPException(status_code=409, detail="此學號已註冊")
    parsed = None
    if student_id not in {"admin", "super"}:
        parsed = parse_student_id(student_id, lambda code: lookup_department_from_db(db, code))
        if not parsed.get("valid"):
            raise HTTPException(status_code=400, detail=parsed.get("reason", "學號格式錯誤"))
    role = "super_admin" if student_id == "super" else "admin" if student_id == "admin" else "student"
    account = UserAccount(
        student_id=student_id,
        password_hash=password_hash(request.password.strip()),
        role=role,
        email="",
        display_name=(request.display_name or student_id).strip(),
        department=(parsed or {}).get("department_name", ""),
        grade="大一" if (parsed or {}).get("program_code") == "4" else "",
        admission_year=str((parsed or {}).get("admission_year", "")),
        email_bound=False,
        sync_enabled=True,
    )
    db.add(account)
    db.commit()
    token = create_session(db, student_id)
    return {"message": "註冊成功", "success": True, "token": token, "user": public_user(account)}

@app.post("/auth/login", summary="登入驗證")
async def auth_login(request: LoginRequest, db: Session = Depends(get_db)):
    account = db.query(UserAccount).filter(UserAccount.student_id == request.student_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="帳號不存在，請先註冊")
    if not account.is_active:
        raise HTTPException(status_code=403, detail="帳號已停用")
    if not verify_password(request.password, account.password_hash):
        raise HTTPException(status_code=401, detail="密碼錯誤")
    # 舊 sha256 密碼登入成功後升級 bcrypt
    if len(account.password_hash) == 64:
        account.password_hash = password_hash(request.password)
    token = create_session(db, account.student_id)
    return {"message": "登入成功", "success": True, "token": token, "user": public_user(account)}

@app.get("/auth/me", summary="取得目前登入帳號")
async def auth_me(account: UserAccount = Depends(get_current_account)):
    return {"message": "取得成功", "user": public_user(account)}

@app.put("/auth/profile", summary="更新個人資料與綁定狀態")
async def update_profile(request: ProfileRequest, account: UserAccount = Depends(get_current_account), db: Session = Depends(get_db)):
    account.display_name = request.display_name
    account.email = request.email
    account.department = request.department
    account.grade = request.grade
    account.admission_year = request.admission_year
    account.student_status = request.student_status
    account.email_bound = request.email_bound and bool(request.email)
    account.google_bound = request.google_bound
    account.sync_enabled = request.sync_enabled
    db.commit()
    return {"message": "個人資料已更新", "user": public_user(account)}

@app.post("/auth/logout", summary="登出並刪除目前 session")
async def auth_logout(authorization: str = Header(""), db: Session = Depends(get_db)):
    if authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "", 1).strip()
        db.query(UserSession).filter(UserSession.token == token).delete()
        db.commit()
    return {"message": "已登出"}

@app.get("/user/data", summary="讀取目前使用者完整同步資料")
async def get_user_data(account: UserAccount = Depends(get_current_account), db: Session = Depends(get_db)):
    bundle = db.query(UserDataBundle).filter(UserDataBundle.student_id == account.student_id).first()
    return {"message": "讀取成功", "data": bundle.data if bundle else {}}

@app.put("/user/data", summary="儲存目前使用者完整同步資料")
async def put_user_data(request: UserDataSyncRequest, account: UserAccount = Depends(get_current_account), db: Session = Depends(get_db)):
    bundle = db.query(UserDataBundle).filter(UserDataBundle.student_id == account.student_id).first()
    if bundle:
        bundle.data = request.data
    else:
        db.add(UserDataBundle(student_id=account.student_id, data=request.data))
    db.commit()
    return {"message": "同步成功"}

@app.post("/auth/send-otp", summary="發送忘記密碼 OTP (SMTP)")
async def send_otp(request: SendOTPRequest, db: Session = Depends(get_db)):
    account = db.query(UserAccount).filter(UserAccount.student_id == request.student_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="該學號尚未註冊")
    otp = str(random.randint(100000, 999999))
    otp_hash = hashlib.sha256(otp.encode()).hexdigest()
    db.merge(PasswordResetOTP(student_id=request.student_id, otp_hash=otp_hash, expires_at=datetime.utcnow() + timedelta(minutes=10)))
    db.commit()

    smtp_server = os.getenv("SMTP_SERVER", "")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_pwd = os.getenv("SMTP_PASSWORD", "")
    if not smtp_server or not smtp_user:
        return {"message": "開發環境未設定 SMTP，回傳測試 OTP", "otp": otp}

    receiver_email = account.email or f"{request.student_id}@o365.tku.edu.tw"
    msg = MIMEMultipart()
    msg['From'], msg['To'], msg['Subject'] = smtp_user, receiver_email, "[UniPlan] 密碼重設驗證碼"
    msg.attach(MIMEText(f"您的密碼重設驗證碼為：{otp}，10 分鐘內有效。", 'plain', 'utf-8'))
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_pwd)
        server.send_message(msg)
        server.quit()
        return {"message": "驗證碼已發送"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"信件寄送失敗: {str(e)}")

@app.post("/auth/reset-password", summary="重設密碼")
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    account = db.query(UserAccount).filter(UserAccount.student_id == request.student_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="找不到帳號")
    record = db.query(PasswordResetOTP).filter(PasswordResetOTP.student_id == request.student_id).first()
    expected = hashlib.sha256(request.otp.encode()).hexdigest() if request.otp else ""
    if not record or record.expires_at < datetime.utcnow() or record.otp_hash != expected:
        raise HTTPException(status_code=400, detail="驗證碼錯誤或已過期")
    account.password_hash = password_hash(request.new_password)
    db.query(PasswordResetOTP).filter(PasswordResetOTP.student_id == request.student_id).delete()
    db.commit()
    return {"message": "密碼重設成功"}

# ----- [ 6. 課程熱度統計 API ] -----
@app.post("/demand/sync", summary="同步使用者的排課熱度")
async def sync_demand(request: SyncDemandRequest, db: Session = Depends(get_db)):
    try:
        db.query(CourseDemand).filter(CourseDemand.user_id == request.user_id).delete()
        for d in request.demand_data:
            db.add(CourseDemand(semester_source=d.semester_source, serial=d.serial, user_id=request.user_id))
        db.commit()
        return {"message": "熱度同步成功"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/demand/{semester_source}/{serial}", summary="獲取特定課程的熱度")
async def get_demand(semester_source: str, serial: str, db: Session = Depends(get_db)):
    count = db.query(CourseDemand).filter(CourseDemand.semester_source == semester_source, CourseDemand.serial == serial).count()
    return {"count": count}

# ----- [ 7. 畢業與學程規則管理 API ] -----
@app.get("/rules/graduation/{dept_code}/{year}", summary="獲取科系畢業門檻")
async def get_grad_rule(dept_code: str, year: int, db: Session = Depends(get_db)):
    for test_dept, test_year in [(dept_code, year), (dept_code, 0), ("ALL", 0)]:
        rule = db.query(GraduationRule).filter_by(dept_code=test_dept, admission_year=test_year).first()
        if rule: return {"message": "獲取成功", "data": rule.req_data}
    return {"message": "未找到規則", "data": {}}

@app.post("/rules/graduation", summary="後台設定畢業門檻")
async def set_grad_rule(request: SetRuleRequest, db: Session = Depends(get_db)):
    try:
        year = int(request.name_or_year)
        rule = db.query(GraduationRule).filter_by(dept_code=request.dept_code, admission_year=year).first()
        if rule: rule.req_data = request.req_data
        else: db.add(GraduationRule(dept_code=request.dept_code, admission_year=year, req_data=request.req_data))
        db.commit()
        return {"message": "畢業門檻更新成功"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/rules/programs", summary="獲取所有微學程清單")
async def get_programs(db: Session = Depends(get_db)):
    programs = db.query(ProgramRule.program_name).distinct().all()
    return {"message": "獲取成功", "data": sorted([p[0] for p in programs])}

@app.get("/rules/program-depts/{name}", summary="獲取特定學程的適用科系")
async def get_program_depts(name: str, db: Session = Depends(get_db)):
    depts = db.query(ProgramRule.dept_code).filter(ProgramRule.program_name == name).all()
    return {"message": "獲取成功", "data": [d[0] for d in depts]}

@app.get("/rules/program/{name}", summary="獲取特定學程規則")
async def get_program_rule(name: str, dept_code: str = Query("ALL"), db: Session = Depends(get_db)):
    for test_dept in [dept_code, "ALL"]:
        rule = db.query(ProgramRule).filter_by(program_name=name, dept_code=test_dept).first()
        if rule: return {"message": "獲取成功", "data": rule.req_data}
    return {"message": "未找到規則", "data": {}}

@app.post("/rules/program", summary="後台設定學程規則")
async def set_program_rule(request: SetRuleRequest, db: Session = Depends(get_db)):
    try:
        rule = db.query(ProgramRule).filter_by(program_name=request.name_or_year, dept_code=request.dept_code).first()
        if rule: rule.req_data = request.req_data
        else: db.add(ProgramRule(program_name=request.name_or_year, dept_code=request.dept_code, req_data=request.req_data))
        db.commit()
        return {"message": "學程規則更新成功"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/rules/program/{name}/{dept_code}", summary="後台刪除學程設定")
async def delete_program_rule(name: str, dept_code: str, db: Session = Depends(get_db)):
    try:
        db.query(ProgramRule).filter_by(program_name=name, dept_code=dept_code).delete()
        db.commit()
        return {"message": "刪除成功"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
# ----- [ 8. 正式版資料層 API：課程、畢業規則、學程、課程分類 ] -----

def require_admin(account: UserAccount = Depends(get_current_account)) -> UserAccount:
    if (account.role or 'student') != 'admin':
        raise HTTPException(status_code=403, detail='需要管理員權限')
    return account

def safe_json_loads(value, default):
    if value in [None, '']:
        return default
    if isinstance(value, (list, dict)):
        return value
    try:
        return json.loads(value)
    except Exception:
        return default

def course_to_dict(r: CourseDB) -> dict:
    return {
        'serial': r.serial,
        'code': r.code,
        'name': r.name,
        'credits': r.credits,
        'category': r.category,
        'teacher': r.teacher,
        'classroom': r.classroom,
        'capacity': r.capacity,
        'time_slots': safe_json_loads(r.time_data, []),
        'semester_source': r.semester_source,
        'grade': r.grade,
        'major': r.major,
        'sem_seq': r.sem_seq,
        'class_name': r.class_name,
        'group_type': r.group_type,
        'time_info': r.time_info,
        'department': r.department,
        'notes': r.notes,
    }

def normalize_course_row(row: dict, fallback_semester: str) -> dict:
    serial = str(row.get('serial') or row.get('開課序號') or row.get('id') or row.get('course_id') or '').strip()
    code = str(row.get('code') or row.get('課號') or row.get('course_code') or '').strip()
    name = str(row.get('name') or row.get('課程名稱') or row.get('course_name') or '').strip()
    teacher = str(row.get('teacher') or row.get('教師') or row.get('instructor') or '').strip()
    semester = str(row.get('semester_source') or row.get('semester') or row.get('學期') or fallback_semester).strip()
    if not serial:
        serial = code or f"{name}-{teacher}-{semester}"
    credits_raw = row.get('credits') or row.get('學分') or row.get('credit') or 0
    try:
        credits = int(float(credits_raw))
    except Exception:
        credits = 0
    slots = row.get('time_slots') or row.get('timeSlots') or row.get('time_data') or []
    if isinstance(slots, str):
        slots = safe_json_loads(slots, [])
    return {
        'serial': serial,
        'semester_source': semester,
        'code': code,
        'name': name,
        'credits': credits,
        'category': str(row.get('category') or row.get('必選修') or '').strip(),
        'teacher': teacher,
        'classroom': str(row.get('classroom') or row.get('教室') or '').strip(),
        'capacity': str(row.get('capacity') or row.get('限修人數') or '').strip(),
        'time_data': json.dumps(slots, ensure_ascii=False),
        'grade': str(row.get('grade') or row.get('年級') or '').strip(),
        'major': str(row.get('major') or row.get('科系') or '').strip(),
        'sem_seq': str(row.get('sem_seq') or '').strip(),
        'class_name': str(row.get('class_name') or row.get('班級') or '').strip(),
        'group_type': str(row.get('group_type') or row.get('通識群別') or '').strip(),
        'time_info': str(row.get('time_info') or row.get('時間') or row.get('time') or '').strip(),
        'department': str(row.get('department') or row.get('開課單位') or '').strip(),
        'notes': str(row.get('notes') or row.get('備註') or '').strip(),
    }

def classification_to_dict(item: CourseClassification) -> dict:
    return {
        'id': item.id,
        'rule_id': item.rule_id,
        'dept_code': item.dept_code,
        'admission_year': item.admission_year,
        'course_key': item.course_key,
        'course_name': item.course_name,
        'category_key': item.category_key,
        'category_label': item.category_label,
        'credit_override': item.credit_override,
        'is_required': bool(item.is_required),
        'prerequisites': item.prerequisites or [],
        'followups': item.followups or [],
        'notes': item.notes,
        'updated_at': item.updated_at.isoformat() if item.updated_at else '',
    }

@app.get('/admin/data-summary', summary='管理後台資料概況')
async def admin_data_summary(_: UserAccount = Depends(require_admin), db: Session = Depends(get_db)):
    return {
        'message': '讀取成功',
        'data': {
            'courses': db.query(CourseDB).count(),
            'graduationRules': db.query(GraduationRule).count(),
            'programRules': db.query(ProgramRule).count(),
            'courseClassifications': db.query(CourseClassification).count(),
            'reviews': db.query(Review).count(),
            'users': db.query(UserAccount).count(),
            'imports': db.query(DataImportLog).count(),
        }
    }

@app.post('/admin/courses/import', summary='管理員匯入官方課程資料 JSON')
async def admin_import_courses(request: CourseImportRequest, account: UserAccount = Depends(require_admin), db: Session = Depends(get_db)):
    if request.overwrite_semester:
        db.query(CourseDB).filter(CourseDB.semester_source == request.semester_source).delete()
    count = 0
    for raw in request.courses:
        row = normalize_course_row(raw, request.semester_source)
        if not row['serial'] or not row['semester_source']:
            continue
        existing = db.query(CourseDB).filter_by(serial=row['serial'], semester_source=row['semester_source']).first()
        if existing:
            for key, value in row.items():
                setattr(existing, key, value)
        else:
            db.add(CourseDB(**row))
        count += 1
    db.add(DataImportLog(data_type='courses', source_name=request.source_name, count=count, actor=account.student_id, summary={'semester_source': request.semester_source, 'overwrite': request.overwrite_semester}))
    db.commit()
    return {'message': '課程資料匯入完成', 'count': count}

@app.get('/admin/import-logs', summary='管理員讀取資料匯入紀錄')
async def admin_import_logs(_: UserAccount = Depends(require_admin), db: Session = Depends(get_db)):
    logs = db.query(DataImportLog).order_by(DataImportLog.created_at.desc()).limit(50).all()
    return {'message': '讀取成功', 'data': [{'id': l.id, 'data_type': l.data_type, 'source_name': l.source_name, 'count': l.count, 'actor': l.actor, 'summary': l.summary, 'created_at': l.created_at.isoformat() if l.created_at else ''} for l in logs]}

@app.get('/rules/graduation', summary='列出畢業學分規則')
async def list_graduation_rules(dept_code: str = Query(''), db: Session = Depends(get_db)):
    q = db.query(GraduationRule)
    if dept_code:
        q = q.filter(GraduationRule.dept_code == dept_code)
    rows = q.order_by(GraduationRule.dept_code, GraduationRule.admission_year.desc()).all()
    return {'message': '讀取成功', 'data': [{'dept_code': r.dept_code, 'admission_year': r.admission_year, 'req_data': r.req_data} for r in rows]}

@app.put('/admin/rules/graduation', summary='管理員新增或更新畢業學分規則')
async def admin_upsert_graduation_rule(request: GraduationRuleUpsertRequest, _: UserAccount = Depends(require_admin), db: Session = Depends(get_db)):
    rule = db.query(GraduationRule).filter_by(dept_code=request.dept_code, admission_year=request.admission_year).first()
    if rule:
        rule.req_data = request.req_data
    else:
        db.add(GraduationRule(dept_code=request.dept_code, admission_year=request.admission_year, req_data=request.req_data))
    db.commit()
    return {'message': '畢業規則已儲存'}

@app.delete('/admin/rules/graduation/{dept_code}/{year}', summary='管理員刪除畢業學分規則')
async def admin_delete_graduation_rule(dept_code: str, year: int, _: UserAccount = Depends(require_admin), db: Session = Depends(get_db)):
    db.query(GraduationRule).filter_by(dept_code=dept_code, admission_year=year).delete()
    db.commit()
    return {'message': '畢業規則已刪除'}

@app.get('/rules/programs/full', summary='列出完整學分學程規則')
async def list_program_rules(db: Session = Depends(get_db)):
    rows = db.query(ProgramRule).order_by(ProgramRule.program_name, ProgramRule.dept_code).all()
    return {'message': '讀取成功', 'data': [{'program_name': r.program_name, 'dept_code': r.dept_code, 'req_data': r.req_data} for r in rows]}

@app.put('/admin/rules/program', summary='管理員新增或更新學分學程規則')
async def admin_upsert_program_rule(request: ProgramRuleUpsertRequest, _: UserAccount = Depends(require_admin), db: Session = Depends(get_db)):
    rule = db.query(ProgramRule).filter_by(program_name=request.program_name, dept_code=request.dept_code).first()
    if rule:
        rule.req_data = request.req_data
    else:
        db.add(ProgramRule(program_name=request.program_name, dept_code=request.dept_code, req_data=request.req_data))
    db.commit()
    return {'message': '學程規則已儲存'}

@app.delete('/admin/rules/program/{program_name}/{dept_code}', summary='管理員刪除學分學程規則')
async def admin_delete_program_rule(program_name: str, dept_code: str, _: UserAccount = Depends(require_admin), db: Session = Depends(get_db)):
    db.query(ProgramRule).filter_by(program_name=program_name, dept_code=dept_code).delete()
    db.commit()
    return {'message': '學程規則已刪除'}

@app.get('/rules/course-classifications', summary='取得課程分類對應表')
async def list_course_classifications(rule_id: str = Query(''), dept_code: str = Query(''), admission_year: int | None = Query(None), db: Session = Depends(get_db)):
    q = db.query(CourseClassification)
    if rule_id:
        q = q.filter(CourseClassification.rule_id == rule_id)
    if dept_code:
        q = q.filter(CourseClassification.dept_code == dept_code)
    if admission_year is not None:
        q = q.filter(CourseClassification.admission_year == admission_year)
    rows = q.order_by(CourseClassification.dept_code, CourseClassification.admission_year.desc(), CourseClassification.course_name).limit(1000).all()
    return {'message': '讀取成功', 'data': [classification_to_dict(r) for r in rows]}

@app.put('/admin/rules/course-classification', summary='管理員新增或更新課程分類對應')
async def upsert_course_classification(request: CourseClassificationRequest, _: UserAccount = Depends(require_admin), db: Session = Depends(get_db)):
    item = db.query(CourseClassification).filter(CourseClassification.id == request.id).first() if request.id else None
    payload = request.dict()
    if item:
        payload.pop('id', None)
        for key, value in payload.items():
            setattr(item, key, value)
    else:
        payload.pop('id', None)
        item = CourseClassification(**payload)
        db.add(item)
    db.commit()
    db.refresh(item)
    return {'message': '課程分類已儲存', 'data': classification_to_dict(item)}

@app.delete('/admin/rules/course-classification/{item_id}', summary='管理員刪除課程分類對應')
async def delete_course_classification(item_id: int, _: UserAccount = Depends(require_admin), db: Session = Depends(get_db)):
    db.query(CourseClassification).filter(CourseClassification.id == item_id).delete()
    db.commit()
    return {'message': '課程分類已刪除'}

@app.post('/analyze-program', summary='依學分學程規則計算完成度')
async def analyze_program(payload: dict):
    courses = payload.get('courses') or []
    rule = payload.get('rule') or {}
    groups = rule.get('groups') or []
    completed_keys = {str(c.get('serial') or c.get('code') or c.get('name') or '') for c in courses if c.get('planningStatus') != 'failed'}
    result_groups = []
    total_required = 0
    total_earned = 0
    for group in groups:
        required = int(group.get('requiredCredits') or group.get('required') or 0)
        allowed = {str(x) for x in (group.get('courses') or group.get('courseKeys') or [])}
        matched = [c for c in courses if str(c.get('serial') or c.get('code') or c.get('name') or '') in allowed and c.get('planningStatus') != 'failed']
        earned = sum(int(c.get('credits') or 0) for c in matched)
        total_required += required
        total_earned += min(earned, required) if required else earned
        result_groups.append({'name': group.get('name') or '未命名群組', 'required': required, 'earned': earned, 'matched': matched})
    return {'message': '學程分析成功', 'data': {'required': total_required, 'earned': total_earned, 'groups': result_groups}}
