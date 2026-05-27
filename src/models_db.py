from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Feedback(Base):
    __tablename__ = 'feedback'
    
    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Integer, nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<Feedback(id={self.id}, rating={self.rating})>"

class UserSchedule(Base):
    __tablename__ = 'user_schedules'
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, unique=True, index=True, nullable=False)
    schedule_data = Column(JSON, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<UserSchedule(student_id={self.student_id})>"

class UserAccount(Base):
    __tablename__ = "user_accounts"

    student_id = Column(String, primary_key=True, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="student", nullable=False)
    email = Column(String, default="")
    display_name = Column(String, default="")
    department = Column(String, default="")
    grade = Column(String, default="")
    admission_year = Column(String, default="")
    student_status = Column(String, default="在學")
    email_bound = Column(Boolean, default=False)
    google_bound = Column(Boolean, default=False)
    sync_enabled = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class UserSession(Base):
    __tablename__ = "user_sessions"

    token = Column(String, primary_key=True, index=True)
    student_id = Column(String, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserDataBundle(Base):
    __tablename__ = "user_data_bundles"

    student_id = Column(String, primary_key=True, index=True)
    data = Column(JSON, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class PasswordResetOTP(Base):
    __tablename__ = "password_reset_otps"

    student_id = Column(String, primary_key=True, index=True)
    otp_hash = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class CourseDB(Base):
    __tablename__ = 'courses'
    
    serial = Column(String, primary_key=True)
    semester_source = Column(String, primary_key=True)
    code = Column(String, index=True)
    name = Column(String, index=True)
    credits = Column(Integer)
    category = Column(String)
    teacher = Column(String, index=True)
    classroom = Column(String)
    capacity = Column(String)
    time_data = Column(String)
    grade = Column(String)
    major = Column(String)
    sem_seq = Column(String)
    class_name = Column(String)
    group_type = Column(String)
    time_info = Column(String)
    department = Column(String, index=True)
    notes = Column(String)

class Review(Base):
    __tablename__ = 'reviews'
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, index=True, nullable=False) # 課程編號
    user_id = Column(String, nullable=False)          # 留言者學號
    content = Column(String, nullable=False)          # 心得內容
    rating = Column(Integer, default=5)               # 星數評分
    tags = Column(String, default="")                 # 課程標籤(逗號分隔)
    timestamp = Column(DateTime, default=datetime.utcnow)

class CourseDemand(Base):
    __tablename__ = 'course_demand'
    
    semester_source = Column(String, primary_key=True)
    serial = Column(String, primary_key=True)
    user_id = Column(String, primary_key=True)

class GraduationRule(Base):
    __tablename__ = 'graduation_rules'
    
    dept_code = Column(String, primary_key=True)
    admission_year = Column(Integer, primary_key=True)
    req_data = Column(JSON, nullable=False)

class ProgramRule(Base):
    __tablename__ = 'program_rules'
    
    program_name = Column(String, primary_key=True)
    dept_code = Column(String, primary_key=True)
    req_data = Column(JSON, nullable=False)
class CourseClassification(Base):
    __tablename__ = 'course_classifications'

    id = Column(Integer, primary_key=True, index=True)
    rule_id = Column(String, default='generic', index=True)
    dept_code = Column(String, default='ALL', index=True)
    admission_year = Column(Integer, default=0, index=True)
    course_key = Column(String, index=True, nullable=False)
    course_name = Column(String, default='')
    category_key = Column(String, default='freeElective', index=True)
    category_label = Column(String, default='自由')
    credit_override = Column(Integer, nullable=True)
    is_required = Column(Boolean, default=False)
    prerequisites = Column(JSON, default=list)
    followups = Column(JSON, default=list)
    notes = Column(String, default='')
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class DataImportLog(Base):
    __tablename__ = 'data_import_logs'

    id = Column(Integer, primary_key=True, index=True)
    data_type = Column(String, index=True, nullable=False)
    source_name = Column(String, default='')
    count = Column(Integer, default=0)
    actor = Column(String, default='')
    summary = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)


class DepartmentCode(Base):
    __tablename__ = 'department_codes'

    code = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, default='')
    college = Column(String, default='')
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
