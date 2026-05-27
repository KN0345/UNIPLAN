from fastapi import FastAPI, HTTPException, Depends, Query
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
from datetime import datetime, timedelta

from models_db import Base, Feedback, UserSchedule, CourseDB, Review, CourseDemand, GraduationRule, ProgramRule, UserAccount
import engine

# 1. 資料庫初始化 (連接至原本的 course_inventory.db)
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'course_inventory.db'))
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"
db_engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)

# 建立所有資料表
Base.metadata.create_all(bind=db_engine)

app = FastAPI(title="TKU 排課系統 API", version="1.0.0")

# 設定 CORS 允許 Next.js 前端存取
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"], # 允許的前端網址
    allow_credentials=True,
    allow_methods=["*"], # 允許所有 HTTP 方法 (GET, POST, etc.)
    allow_headers=["*"], # 允許所有標頭
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

    majors = [r[0] for r in db.query(CourseDB.major).filter(CourseDB.major.isnot(None), CourseDB.major != '').distinct().order_by(CourseDB.major).all()]

    semesters = [r[0] for r in db.query(CourseDB.semester_source).filter(CourseDB.semester_source.isnot(None), CourseDB.semester_source != '').distinct().order_by(CourseDB.semester_source).all()]
    
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
            "majors": majors,
            "semesters": semesters,
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
import hashlib
import secrets
from datetime import datetime, timedelta


def account_payload(account):
    return {
        "student_id": account.student_id,
        "role": getattr(account, "role", "student") or "student",
        "profile": {
            "displayName": getattr(account, "display_name", "") or "",
            "email": getattr(account, "email", "") or "",
            "department": getattr(account, "department", "") or "",
            "grade": getattr(account, "grade", "") or "",
            "admissionYear": getattr(account, "admission_year", "") or "",
            "studentStatus": getattr(account, "student_status", "在學") or "在學",
            "boundEmail": bool(getattr(account, "email_bound", False)),
            "boundGoogle": bool(getattr(account, "google_bound", False)),
            "syncEnabled": bool(getattr(account, "sync_enabled", True)),
        }
    }

def make_token():
    return secrets.token_urlsafe(32)

@app.post("/auth/register", summary="註冊帳號，不需 Email")
async def auth_register(request: RegisterRequest, db: Session = Depends(get_db)):
    student_id = request.student_id.strip()
    if not student_id:
        raise HTTPException(status_code=400, detail="請輸入學號")

    existing = db.query(UserAccount).filter(UserAccount.student_id == student_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="此學號已被註冊")

    password_hash = hashlib.sha256(request.password.strip().encode()).hexdigest()
    account = UserAccount(
        student_id=student_id,
        password_hash=password_hash,
        display_name=(request.display_name or student_id).strip(),
        role="student",
        email="",
        email_bound=False,
        is_active=True,
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    return {
        "message": "註冊成功",
        "success": True,
        "token": make_token(),
        "user": account_payload(account),
    }

@app.post("/auth/login", summary="登入驗證與綁定")
async def auth_login(request: LoginRequest, db: Session = Depends(get_db)):
    student_id = request.student_id.strip()
    password_hash = hashlib.sha256(request.password.strip().encode()).hexdigest()

    account = db.query(UserAccount).filter(UserAccount.student_id == student_id).first()

    if not account:
        raise HTTPException(status_code=404, detail="此學號尚未註冊，請先註冊")

    if not getattr(account, "is_active", True):
        raise HTTPException(status_code=403, detail="此帳號已停用")

    if account.password_hash != password_hash:
        raise HTTPException(status_code=401, detail="密碼錯誤")

    return {
        "message": "登入成功",
        "success": True,
        "token": make_token(),
        "user": account_payload(account),
    }

@app.post("/auth/send-otp", summary="發送忘記密碼 OTP (SMTP)")
async def send_otp(request: SendOTPRequest, db: Session = Depends(get_db)):
    if not db.query(UserSchedule).filter(UserSchedule.student_id == request.student_id).first():
        raise HTTPException(status_code=404, detail="該學號尚未在系統中註冊！")
    
    otp = str(random.randint(100000, 999999))
    smtp_server = os.getenv("SMTP_SERVER", "")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_pwd = os.getenv("SMTP_PASSWORD", "")
    
    if not smtp_server or not smtp_user:
        return {"message": "開發環境未設定 SMTP，已允許前端測試", "otp": otp}
        
    receiver_email = f"{request.student_id}@o365.tku.edu.tw"
    msg = MIMEMultipart()
    msg['From'], msg['To'], msg['Subject'] = smtp_user, receiver_email, "[TKU排課系統] 密碼重設驗證碼"
    msg.attach(MIMEText(f"同學您好：\n\n您的密碼重設驗證碼為：【 {otp} 】\n請在網頁上輸入此驗證碼。", 'plain', 'utf-8'))
    
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_pwd)
        server.send_message(msg)
        server.quit()
        return {"message": "驗證碼已發送至學校信箱", "otp": otp}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"信件寄送失敗: {str(e)}")

@app.post("/auth/reset-password", summary="重設密碼")
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    db_schedule = db.query(UserSchedule).filter(UserSchedule.student_id == request.student_id).first()
    if not db_schedule: raise HTTPException(status_code=404, detail="找不到學號")
    
    data = db_schedule.schedule_data if isinstance(db_schedule.schedule_data, dict) else {}
    data["password"] = request.new_password
    db_schedule.schedule_data = data
    db.commit()
    return {"message": "密碼重設成功！"}

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