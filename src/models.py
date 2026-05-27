from dataclasses import dataclass, field
from typing import List, Optional, Tuple

@dataclass
class Course:
    serial: str            # 序號 (如: 0123)
    code: str              # 課程代碼 (如: CS101)
    name: str              # 課程名稱
    credits: int           # 學分數
    category: str          # 類別 (必修/選修/通識)
    teacher: str = ""      # 授課老師
    classroom: str = ""    # 教室
    capacity: str = ""     # 人數 (例如: 50/60)
    semester_source: str = "" # 學期來源 (如: 114-1)
    grade: str = ""        # 年級
    major: str = ""        # 專業別
    sem_seq: str = ""      # 學期序
    class_name: str = ""   # 班別
    group_type: str = ""   # 群別
    time_info: str = ""    # 顯示用的時間 (如: 三/3,4)
    department: str = ""   # 科系
    notes: str = ""        # 備註 (擋修/限制)
    status: str = "planned" # 狀態: planned(計畫中), passed(已通過), failed(未通過)
    prerequisites: List[str] = field(default_factory=list) # 先修課程代碼列表
    time_slots: List[Tuple[int, int, int]] = field(default_factory=list) # (星期1-7, 開始節次, 結束節次)

    def to_dict(self):
        return self.__dict__

    @classmethod
    def from_dict(cls, data):
        return cls(**data)

    def __str__(self):
        time_str = ", ".join([f"週{t[0]}({t[1]}-{t[2]})" for t in self.time_slots])
        return f"[{self.code}] {self.name} ({self.credits}學分 - {self.category}) | 時間: {time_str if time_str else '未定'}"

@dataclass
class Student:
    student_id: str
    is_valid: bool = field(init=False)
    study_level: str = field(init=False)
    admission_year: int = field(init=False)
    department_code: str = field(init=False)
    department_name: str = field(init=False)
    identity: str = field(init=False)
    
    def __post_init__(self):
        self.is_valid = self._validate()
        if self.is_valid:
            self.study_level = self._get_study_level()
            self.admission_year = self._get_admission_year()
            self.department_code = self._get_department_code()
            self.department_name = self._get_department_name()
            self.identity = self._get_identity()
        else:
            self.study_level = ""
            self.admission_year = 0
            self.department_code = ""
            self.department_name = ""
            self.identity = ""

    def _validate(self) -> bool:
        """使用變體 Luhn 演算法驗證學號檢查碼"""
        if len(self.student_id) != 9 or not self.student_id.isdigit():
            return False
        
        weights = [1, 2, 1, 2, 1, 2, 1, 2]
        total_sum = 0
        for i in range(8):
            num = int(self.student_id[i])
            product = num * weights[i]
            # 如果相乘 >= 10，將十位數與個位數相加
            if product >= 10:
                total_sum += (product // 10) + (product % 10)
            else:
                total_sum += product
                
        checksum = 9 - (total_sum % 10)
        return checksum == int(self.student_id[8])

    def _get_study_level(self) -> str:
        level_map = {
            '2': '進學班',
            '4': '學士生',
            '6': '碩士生',
            '7': '碩士在職專班 / 轉入大二',
            '8': '博士生 / 轉入大三',
            '3': '未知學制'
        }
        return level_map.get(self.student_id[0], '未知學制')

    def _get_admission_year(self) -> int:
        year = int(self.student_id[1:3])
        return year + 100 if year <= 14 else year

    def _get_department_code(self) -> str:
        return self.student_id[3:5]

    def _get_department_name(self) -> str:
        dept_map = {
            '00': '資訊與圖書館學系',
            '01': '中國文學學系',
            '03': '歷史學系',
            '04': '資訊傳播學系',
            '05': '大眾傳播學系',
            '08': '法國語文學系',
            '09': '德文系',
            '10': '日本語文學系',
            '11': '英文學系',
            '12': '西班牙語文學系',
            '13': '俄國語文學系',
            '16': '化學系生化組',
            '17': '化學系材化組',
            '19': '數學系數學組',
            '20': '數學系資統組',
            '21': '物理系光電組',
            '22': '物理系應物組',
            '23': '尖端材料科學學程',
            '33': '戰略所碩專班',
            '35': '機械系精密機械組',
            '36': '建築系',
            '37': '機械系光機電整合',
            '38': '土木系工設組 / 碩士班',
            '40': '化材系',
            '41': '資訊工程學系',
            '43': '航太系',
            '44': '電機系電機資訊組',
            '48': '水環系水資源組',
            '49': '電機系電機通訊組',
            '50': '電機系電機與系統組',
            '51': '水環系環工組',
            '53': '財金系',
            '54': '產經系',
            '55': '國際企業系經貿管理組',
            '56': '風保系',
            '57': '經濟系',
            '59': '國企系國際商學組',
            '60': '會計系',
            '61': '企管系',
            '62': '管理科學學系',
            '63': '資訊管理學系',
            '64': '公共行政學系',
            '65': '統計學系',
            '66': '運管系',
            '68': '全財管學程',
            '71': '教設系',
            '73': '教育科技學系',
            '77': '人工智慧學系',
            '80': '外交系',
            '81': '英文系英文英語',
            '82': '政經系',
            '85': '資工系資工英語',
            '86': '觀光系'
        }
        return dept_map.get(self.department_code, '未知科系')

    def _get_identity(self) -> str:
        id_map = {
            '0': '本地生',
            '4': '陸生',
            '5': '境外生',
            '6': '僑、港、澳生 / 身障生',
            '7': '轉學生(大二轉入)',
            '8': '轉學生(大三轉入)'
        }
        return id_map.get(self.student_id[5], '未知身分')
