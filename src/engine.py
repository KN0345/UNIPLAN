# 這裡將負責處理排課演算法與核心商業邏輯

def check_time_conflicts(courses: list) -> list:
    """
    檢查傳入的課程清單是否有時間衝突。
    接收的 courses 為字典格式的列表。
    """
    conflicts = []
    # 兩兩比對課程時間
    for i in range(len(courses)):
        for j in range(i + 1, len(courses)):
            c1 = courses[i]
            c2 = courses[j]
            
            slots1 = c1.get("time_slots", [])
            slots2 = c2.get("time_slots", [])
            
            for t1 in slots1:
                for t2 in slots2:
                    # t 格式為 [星期, 開始節次, 結束節次]
                    # 如果是同一天
                    if t1[0] == t2[0]:
                        # 檢查區間是否有交集: (start1 <= end2) and (start2 <= end1)
                        if t1[1] <= t2[2] and t2[1] <= t1[2]:
                            conflicts.append({
                                "course1": c1.get("name"),
                                "course2": c2.get("name"),
                                "day": t1[0],
                                "overlap_start": max(t1[1], t2[1]),
                                "overlap_end": min(t1[2], t2[2])
                            })
    return conflicts

def check_prerequisites(courses: list, completed_courses: list) -> list:
    """
    檢查先修條件是否滿足
    """
    warnings = []
    completed_codes = [c.get("code") for c in completed_courses]
    
    for c in courses:
        prereqs = c.get("prerequisites", [])
        missing = [p for p in prereqs if p not in completed_codes]
        if missing:
            warnings.append({
                "course": c.get("name"),
                "missing_prerequisites": missing
            })
    return warnings

def run_scheduling_algorithm(course_data: dict) -> dict:
    """
    接收前端傳來的課程與條件，執行排課演算。
    """
    courses = course_data.get("courses", [])
    completed = course_data.get("completed_courses", [])
    
    # 1. 執行時間衝突檢查
    conflicts = check_time_conflicts(courses)
    
    # 2. 執行先修課程檢查
    prereq_warnings = check_prerequisites(courses, completed)
    
    # 若有衝突則提早回傳錯誤
    if conflicts:
        return {
            "status": "error",
            "message": "發現時間衝突！",
            "conflicts": conflicts
        }
        
    return {
        "status": "success",
        "message": "排課驗證通過",
        "warnings": prereq_warnings,
        "schedule": courses
    }

def analyze_graduation_status(courses: list, requirements: dict) -> dict:
    """
    接收全部課程清單與畢業門檻規則，分析目前的學分狀態。
    courses: 包含所有學期 (已修與計畫中) 的課程列表 (字典格式)
    requirements: 該科系的畢業門檻規則 (字典格式)
    """
    stats = {}
    
    for c in courses:
        status = c.get('status', 'planned')
        if status == 'failed':
            continue # 不採計未通過的學分
            
        dept = c.get('department', '')
        name = c.get('name', '')
        credits = c.get('credits', 0)
        group_type = c.get('group_type', '')
        category = c.get('category', '')
        
        def add_stat(k, val):
            if k not in stats:
                stats[k] = {'passed': 0, 'planned': 0}
            stats[k][status] += val

        is_activity = False
        # 體育與服務學習、國防 (不計入總學分)
        if "體育" in dept or "體育" in name:
            add_stat("體育", credits)
            is_activity = True
        elif "服務學習" in dept or "服務學習" in name:
            add_stat("校園與社區服務學習", credits)
            is_activity = True
        elif "軍事訓練" in name or "國防" in name:
            add_stat("全民國防", credits)
            is_activity = True

        if not is_activity:
            add_stat("總計", credits)

        # 清理課名 (去掉班別) 進行個別課程統計
        clean_name = name.split(' (')[0].strip() if ' (' in name else name
        add_stat(name, credits)
        if clean_name != name:
            add_stat(clean_name, credits)

        is_gen_ed = False
        # 細部通識與核心分類
        if "中國語文能力表達" in name:
            add_stat("中國語文能力表達", credits)
            is_gen_ed = True
        elif "人工智慧導論" in name:
            add_stat("人工智慧導論", credits)
            is_gen_ed = True
        elif "探索永續" in name:
            add_stat("探索永續", credits)
            is_gen_ed = True
        elif group_type == 'N' or "學習與發展" in dept or "大學學習" in name:
            add_stat("學習發展", credits)
            is_gen_ed = True
        elif group_type == 'K' or "社團學習" in name:
            add_stat("社團學分", credits)
            is_gen_ed = True
        elif group_type in ['Q', 'QA', 'QB', 'QC', 'QD', 'QE', 'QF', 'QG'] or "外國語文" in dept or "英文(" in name or "日文(" in name:
            add_stat("外國語文", credits)
            is_gen_ed = True
        elif group_type in ['L', 'P', 'V', 'M']:
            add_stat("人文領域", credits)
            is_gen_ed = True
        elif group_type in ['W', 'T', 'R', 'S']:
            add_stat("社會領域", credits)
            is_gen_ed = True
        elif group_type in ['U', 'Z', 'O']:
            add_stat("科學領域", credits)
            is_gen_ed = True
        elif "通識" in dept or "核心" in dept or "共通" in dept:
            is_gen_ed = True

        # 必選修分類
        if not is_activity and not is_gen_ed:
            if category in ['必', '必修']:
                if "院必修" in name:
                    add_stat("院必修", credits)
                else:
                    add_stat("系必修", credits)
            elif category in ['選', '選修']:
                add_stat("系選修", credits)
            else:
                add_stat("自由學分", credits)
                
    # 與 Requirements (規則) 進行核對
    report = {}
    for key, condition in requirements.items():
        if isinstance(condition, dict) and "courses" in condition:
            # 學程專用的陣列比對邏輯 (支援 M選N 與同名多老師)
            target = condition.get("target", 0)
            course_list = condition.get("courses", [])
            
            passed_sum = 0
            planned_sum = 0
            counted_ids = set() # 避免重複計算同名或重修課程
            
            for c in courses:
                c_id = c.get('serial') or c.get('code') or c.get('name')
                if c_id in counted_ids: continue
                
                status = c.get('status', 'planned')
                if status == 'failed': continue
                
                name = c.get('name', '')
                clean_name = name.split(' (')[0].strip() if ' (' in name else name
                if name in course_list or clean_name in course_list:
                    credits = c.get('credits', 0)
                    if status == 'passed':
                        passed_sum += credits
                    else:
                        planned_sum += credits
                    counted_ids.add(c_id)
            
            current = passed_sum + planned_sum
            report[key] = {
                "passed": passed_sum,
                "planned": planned_sum,
                "current": current,
                "target": target,
                "is_met": current >= target,
                "unit": condition.get("unit", "學分")
            }
        else:
            # 如果門檻是一般數字 (如: "系必修": 60)
            target = condition if isinstance(condition, (int, float)) else 0
            passed = stats.get(key, {}).get('passed', 0)
            planned = stats.get(key, {}).get('planned', 0)
            current = passed + planned
            
            report[key] = {
                "passed": passed,
                "planned": planned,
                "current": current,
                "target": target,
                "is_met": current >= target,
                "unit": "學分"
            }
        
    # 補上那些有修、但沒在畢業門檻明確列出的分類 (如: 自由學分、體育、社團等)
    for key, vals in stats.items():
        if key not in report:
            passed = vals.get('passed', 0)
            planned = vals.get('planned', 0)
            report[key] = {
                "passed": passed,
                "planned": planned,
                "current": passed + planned,
                "target": 0,
                "is_met": True,
                "unit": "學分"
            }

    return report