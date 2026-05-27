from __future__ import annotations

PROGRAM_MAP = {
    '2': '進學班',
    '4': '學士生',
    '6': '碩士生',
    '7': '碩士在職專班 / 轉入大二',
    '8': '博士生 / 轉入大三',
    '3': '未知學制',
}

IDENTITY_MAP = {
    '0': '本地生',
    '1': '本地生',
    '2': '本地生',
    '3': '本地生',
    '4': '陸生',
    '5': '境外生',
    '6': '僑、港、澳生 / 身障生',
    '7': '轉學生（大二轉入）',
    '8': '轉學生（大三轉入）',
}

TRANSFER_ENTRY_GRADE = {
    '7': '大二',
    '8': '大三',
}

DEFAULT_DEPARTMENT_CODES = {
    '00': ('資訊與圖書館學系', '文學院'),
    '01': ('中國文學學系', '文學院'),
    '03': ('歷史學系', '文學院'),
    '04': ('資訊傳播學系', '文學院'),
    '05': ('大眾傳播學系', '文學院'),
    '08': ('法國語文學系', '外語學院'),
    '09': ('德國語文學系', '外語學院'),
    '10': ('日本語文學系', '外語學院'),
    '11': ('英文學系', '外語學院'),
    '12': ('西班牙語文學系', '外語學院'),
    '13': ('俄國語文學系', '外語學院'),
    '16': ('化學學系生物化學組', '理學院'),
    '17': ('化學學系材料化學組', '理學院'),
    '19': ('數學學系數學組', '理學院'),
    '20': ('數學學系資料科學與數理統計組', '理學院'),
    '21': ('物理學系光電物理組', '理學院'),
    '22': ('物理學系應用物理組', '理學院'),
    '23': ('尖端材料科學學士學位學程', '理學院'),
    '33': ('戰略所碩專班', '國際研究學院'),
    '35': ('機械與機電工程學系精密機械組', '工學院'),
    '36': ('建築學系', '工學院'),
    '37': ('機械與機電工程學系光機電整合組', '工學院'),
    '38': ('土木工程學系工程設施組', '工學院'),
    '40': ('化學工程與材料工程學系', '工學院'),
    '41': ('資訊工程學系', '工學院'),
    '43': ('航空太空工程學系', '工學院'),
    '44': ('電機工程學系電機資訊組', '工學院'),
    '48': ('水資源及環境工程學系水資源工程組', '工學院'),
    '49': ('電機工程學系電機通訊組', '工學院'),
    '50': ('電機工程學系電機與系統組', '工學院'),
    '51': ('水資源及環境工程學系環境工程組', '工學院'),
    '53': ('財務金融學系', '商管學院'),
    '54': ('產業經濟學系', '商管學院'),
    '55': ('國際企業學系經貿管理組', '商管學院'),
    '56': ('風險管理與保險學系', '商管學院'),
    '57': ('經濟學系', '商管學院'),
    '59': ('國際企業學系國際商學組', '商管學院'),
    '60': ('會計學系', '商管學院'),
    '61': ('企業管理學系', '商管學院'),
    '62': ('管理科學學系', '商管學院'),
    '63': ('資訊管理學系', '商管學院'),
    '64': ('公共行政學系', '商管學院'),
    '65': ('統計學系', '商管學院'),
    '66': ('運輸管理學系', '商管學院'),
    '68': ('全球財務管理全英語學士學位學程', '商管學院'),
    '71': ('教育與未來設計學系', '教育學院'),
    '73': ('教育科技學系', '教育學院'),
    '77': ('人工智慧學系', 'AI創智學院'),
    '80': ('外交與國際關係學系', '國際事務學院'),
    '81': ('英文學系全英語學士班', '外語學院'),
    '82': ('全球政治經濟學系', '國際事務學院'),
    '85': ('資訊工程學系全英語學士班', '工學院'),
    '86': ('國際觀光管理學系', '國際事務學院'),
}

def roc_year_from_code(year_code: str) -> int:
    value = int(year_code)
    # 00~14 對應民國 100~114；96~99 對應民國 96~99。
    # 保留此判斷避免 99 被誤算為 199。
    return value + 100 if value <= 14 else value

def calc_check_digit(first8: str) -> int:
    weights = [1, 2, 1, 2, 1, 2, 1, 2]
    total = 0
    for digit, weight in zip(first8, weights):
        product = int(digit) * weight
        total += product - 9 if product >= 10 else product
    return 9 - (total % 10)

def parse_student_id(student_id: str, department_lookup=None) -> dict:
    sid = str(student_id or '').strip()
    if not sid:
        return {'valid': False, 'reason': '請輸入學號'}
    if len(sid) != 9 or not sid.isdigit():
        return {'valid': False, 'reason': '學號必須為 9 碼數字'}
    expected = calc_check_digit(sid[:8])
    actual = int(sid[8])
    if expected != actual:
        return {'valid': False, 'reason': f'學號檢查碼錯誤，應為 {expected}'}

    program_code = sid[0]
    year_code = sid[1:3]
    department_code = sid[3:5]
    identity_code = sid[5]
    serial_number = sid[6:8]
    department = department_lookup(department_code) if department_lookup else None
    if not department:
        default = DEFAULT_DEPARTMENT_CODES.get(department_code)
        department = {'code': department_code, 'name': default[0], 'college': default[1]} if default else {'code': department_code, 'name': '待確認系所', 'college': ''}
    transfer_entry_grade = TRANSFER_ENTRY_GRADE.get(identity_code, '')
    return {
        'valid': True,
        'student_id': sid,
        'program_code': program_code,
        'program_name': PROGRAM_MAP.get(program_code, '未知學制'),
        'admission_year': roc_year_from_code(year_code),
        'admission_ad_year': roc_year_from_code(year_code) + 1911,
        'department_code': department_code,
        'department_name': department.get('name') or '待確認系所',
        'college': department.get('college') or '',
        'identity_code': identity_code,
        'identity_name': IDENTITY_MAP.get(identity_code, '未知身分'),
        'is_transfer': bool(transfer_entry_grade),
        'transfer_entry_grade': transfer_entry_grade,
        'start_grade': transfer_entry_grade or '大一',
        'start_semester': f"{transfer_entry_grade or '大一'}上",
        'department_sequence': serial_number,
        'serial_number': serial_number,
        'check_digit': sid[8],
    }
