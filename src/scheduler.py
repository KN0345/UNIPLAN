from .models import Course

class CourseScheduler:
    SEMESTER_ORDER = [
        "大一上", "大一下", "大二上", "大二下",
        "大三上", "大三下", "大四上", "大四下",
        "大五上", "大五下"
    ]

    def __init__(self):
        self.planned_schedule = {sem: [] for sem in self.SEMESTER_ORDER}
        self.staging_area = []

    def load_existing_data(self, data: dict):
        """將讀取的字典資料載入到排課器中"""
        if "schedule" in data:
            for sem, courses in data["schedule"].items():
                if sem not in self.planned_schedule:
                    self.planned_schedule[sem] = []
                if sem not in self.SEMESTER_ORDER:
                    self.SEMESTER_ORDER.append(sem)
                self.planned_schedule[sem] = courses
            self.staging_area = data.get("staging", [])
        else:
            # 向後相容舊資料
            for sem, courses in data.items():
                if sem not in self.planned_schedule:
                    self.planned_schedule[sem] = []
                if sem not in self.SEMESTER_ORDER:
                    self.SEMESTER_ORDER.append(sem)
                self.planned_schedule[sem] = courses

    def add_to_staging(self, course: Course):
        """將課程加入暫存區"""
        if any(c.code == course.code for c in self.staging_area):
            return False, "已在暫存區中"
        for sem_courses in self.planned_schedule.values():
            if any(c.code == course.code for c in sem_courses):
                return False, f"已經在規劃中。"
        self.staging_area.append(course)
        return True, "成功加入暫存區"

    def toggle_course_status(self, semester: str, serial: str):
        if semester == "staging":
            for c in self.staging_area:
                if c.serial == serial:
                    self._cycle_status(c)
                    return True
        elif semester in self.planned_schedule:
            for c in self.planned_schedule[semester]:
                if c.serial == serial:
                    self._cycle_status(c)
                    return True
        return False

    def _cycle_status(self, course: Course):
        current = getattr(course, 'status', 'planned')
        if current == 'planned': course.status = 'passed'
        elif current == 'passed': course.status = 'failed'
        else: course.status = 'planned'

    def move_course(self, serial: str, source: str, target: str):
        """處理拖放時在學期與暫存區間的移動"""
        course_to_move = None
        if source == "staging":
            for c in self.staging_area:
                if c.serial == serial:
                    course_to_move = c
                    break
        else:
            for c in self.planned_schedule.get(source, []):
                if c.serial == serial:
                    course_to_move = c
                    break
        
        if not course_to_move:
            return False, "找不到該課程"

        warning_msg = ""
        # 若移入學期，需檢查時間與先修衝突
        if target != "staging":
            conflict = self._check_time_conflict(target, course_to_move)
            if conflict: return False, f"時間衝突！與 [{conflict.name}] 重疊。"
            missing_pre = self._check_prerequisites(target, course_to_move)
            if missing_pre: 
                warning_msg = f"⚠️ 警告: 尚未通過先修要求 ({', '.join(missing_pre)})"
                
        if source == "staging":
            self.staging_area = [c for c in self.staging_area if c.serial != serial]
        else:
            self.planned_schedule[source] = [c for c in self.planned_schedule[source] if c.serial != serial]

        if target == "staging":
            self.staging_area.append(course_to_move)
        else:
            self.planned_schedule[target].append(course_to_move)
            
        if warning_msg:
            return True, warning_msg
        return True, "移動成功"

    def add_course(self, semester: str, course: Course):
        # 動態兼容未來可能新增的特殊學期 (如: 暑修、大六)
        if semester not in self.planned_schedule:
            self.planned_schedule[semester] = []
        if semester not in self.SEMESTER_ORDER:
            self.SEMESTER_ORDER.append(semester)
        
        # 檢查是否已修過 (簡單查重)
        for sem_courses in self.planned_schedule.values():
            if any(c.code == course.code for c in sem_courses):
                return False, f"課程 {course.name} 已經在規劃中。"

        # 檢查時間衝突
        conflict_course = self._check_time_conflict(semester, course)
        if conflict_course:
            return False, f"時間衝突！與該學期的課程 [{conflict_course.name}] 重疊。"

        # 檢查先修課程是否在之前的學期
        missing_pre = self._check_prerequisites(semester, course)
        warning_msg = ""
        if missing_pre:
            warning_msg = f"⚠️ 警告: 尚未通過先修要求 ({', '.join(missing_pre)})"

        self.planned_schedule[semester].append(course)
        if warning_msg:
            return True, warning_msg
        return True, "成功加入課表"

    def remove_course_by_serial(self, semester: str, serial: str) -> bool:
        if semester not in self.planned_schedule:
            return False
        course_to_remove = next((c for c in self.planned_schedule[semester] if c.serial == serial), None)
        
        if course_to_remove:
            original_count = len(self.planned_schedule[semester])
            self.planned_schedule[semester] = [c for c in self.planned_schedule[semester] if c.serial != serial]
            # 移除時回到暫存區
            if not any(c.serial == serial for c in self.staging_area):
                self.staging_area.append(course_to_remove)
            return len(self.planned_schedule[semester]) < original_count
        return False

    def remove_course_by_code(self, semester: str, code: str) -> bool:
        if semester not in self.planned_schedule:
            return False
        course_to_remove = next((c for c in self.planned_schedule[semester] if c.code == code), None)
        
        if course_to_remove:
            original_count = len(self.planned_schedule[semester])
            self.planned_schedule[semester] = [c for c in self.planned_schedule[semester] if c.code != code]
            if not any(c.code == code for c in self.staging_area):
                self.staging_area.append(course_to_remove)
            return len(self.planned_schedule[semester]) < original_count
        return False

    def _check_time_conflict(self, semester, new_course: Course):
        """檢查新課程與該學期已排課程是否時間重疊"""
        for existing_course in self.planned_schedule[semester]:
            for new_t in new_course.time_slots:
                for ext_t in existing_course.time_slots:
                    # 如果是同一天且節次有重疊
                    if new_t[0] == ext_t[0]:
                        # 檢查區間是否有交集: (start1 < end2) and (start2 < end1)
                        if new_t[1] <= ext_t[2] and ext_t[1] <= new_t[2]:
                            return existing_course
        return None

    def _check_prerequisites(self, current_semester, course: Course):
        if not course.prerequisites:
            return []

        current_idx = self.SEMESTER_ORDER.index(current_semester)
        completed_course_codes = []
        
        # 收集當前學期之前的所有課程
        for i in range(current_idx):
            sem = self.SEMESTER_ORDER[i]
            for c in self.planned_schedule[sem]:
                if getattr(c, 'status', 'planned') != 'failed':
                    completed_course_codes.append(c.code)

        return [p for p in course.prerequisites if p not in completed_course_codes]


    def auto_arrange_staging(self, target_semesters=None, max_credits_per_semester: int = 22, prefer_same_term: bool = True):
        """將暫存區課程自動排入指定學期。

        設計原則：
        1. 不破壞既有已排課程。
        2. 不排入會衝堂的學期。
        3. 盡量讓每學期學分接近但不超過上限。
        4. 若課程有上/下學期線索，優先排入同學期序。
        """
        if target_semesters is None:
            target_semesters = list(self.SEMESTER_ORDER)
        target_semesters = [s for s in target_semesters if s in self.planned_schedule]
        if not target_semesters:
            return {"placed": [], "skipped": [(c, "沒有可排入的學期") for c in self.staging_area]}

        placed = []
        skipped = []
        remaining = []

        def current_credits(sem):
            return sum(c.credits for c in self.planned_schedule.get(sem, []))

        def semester_term(sem):
            if sem.endswith("上"):
                return "上"
            if sem.endswith("下"):
                return "下"
            return ""

        def course_term(course):
            seq = str(getattr(course, "sem_seq", "") or "")
            source = str(getattr(course, "semester_source", "") or "")
            if seq in ["1", "上"] or source.endswith("1"):
                return "上"
            if seq in ["2", "下"] or source.endswith("2"):
                return "下"
            return ""

        priority = {"必": 0, "必修": 0, "選": 1, "選修": 1}
        courses = sorted(
            list(self.staging_area),
            key=lambda c: (priority.get(getattr(c, "category", ""), 2), -int(getattr(c, "credits", 0) or 0), getattr(c, "name", ""))
        )

        for course in courses:
            candidates = []
            cterm = course_term(course)
            for sem in target_semesters:
                credits_after = current_credits(sem) + int(getattr(course, "credits", 0) or 0)
                if max_credits_per_semester and credits_after > max_credits_per_semester:
                    continue
                conflict = self._check_time_conflict(sem, course)
                if conflict:
                    continue
                missing_pre = self._check_prerequisites(sem, course)
                term_penalty = 0
                if prefer_same_term and cterm and semester_term(sem) and cterm != semester_term(sem):
                    term_penalty = 8
                # 越低越好：先修警告 > 學期不符 > 學分越低越優先
                score = len(missing_pre) * 20 + term_penalty + current_credits(sem)
                candidates.append((score, sem, missing_pre))
            if not candidates:
                remaining.append(course)
                skipped.append((course, "沒有找到不衝堂且符合學分上限的學期"))
                continue
            candidates.sort(key=lambda x: x[0])
            _, chosen_sem, missing_pre = candidates[0]
            self.planned_schedule[chosen_sem].append(course)
            placed.append((course, chosen_sem, missing_pre))

        placed_serials = {c.serial for c, _, _ in placed}
        self.staging_area = [c for c in self.staging_area if c.serial not in placed_serials]
        return {"placed": placed, "skipped": skipped}


    def get_total_credits(self):
        total = 0
        for courses in self.planned_schedule.values():
            total += sum(c.credits for c in courses)
        return total

    def check_graduation_status(self, requirements: dict):
        """
        requirements 範例: {"必修": 60, "選修": 40, "通識": 28, "總計": 128}
        """
        stats = {}
        for courses in self.planned_schedule.values():
            for c in courses:
                status = getattr(c, 'status', 'planned')
                if status == 'failed':
                    continue # 不採計未通過的學分

                dept = getattr(c, 'department', '')
                name = c.name
                
                def add_stat(k, val):
                    if k not in stats:
                        stats[k] = {'passed': 0, 'planned': 0}
                    stats[k][status] += val

                is_activity = False
                if "體育" in dept or "體育" in name:
                    add_stat("體育", c.credits)
                    is_activity = True
                elif "服務學習" in dept or "服務學習" in name:
                    add_stat("校園與社區服務學習", c.credits)
                    is_activity = True
                elif "軍事訓練" in name or "國防" in name:
                    add_stat("全民國防", c.credits)
                    is_activity = True

                if not is_activity:
                    add_stat("總計", c.credits)

                # 自動萃取不含班別的乾淨課名 (解決同名不同班、多位老師的問題)
                clean_name = name.split(' (')[0].strip() if ' (' in name else name
                add_stat(name, c.credits)
                if clean_name != name:
                    add_stat(clean_name, c.credits)

                is_gen_ed = False
                # 細部通識與核心分類
                if "中國語文能力表達" in name:
                    add_stat("中國語文能力表達", c.credits)
                    is_gen_ed = True
                elif "人工智慧導論" in name:
                    add_stat("人工智慧導論", c.credits)
                    is_gen_ed = True
                elif "探索永續" in name:
                    add_stat("探索永續", c.credits)
                    is_gen_ed = True
                elif c.group_type == 'N' or "學習與發展" in dept or "大學學習" in name:
                    add_stat("學習發展", c.credits)
                    is_gen_ed = True
                elif c.group_type == 'K' or "社團學習" in name:
                    add_stat("社團學分", c.credits)
                    is_gen_ed = True
                elif c.group_type in ['Q', 'QA', 'QB', 'QC', 'QD', 'QE', 'QF', 'QG'] or "外國語文" in dept or "英文(" in name or "日文(" in name or "西班牙文(" in name or "法文(" in name or "德文(" in name or "俄文(" in name:
                    add_stat("外國語文", c.credits)
                    is_gen_ed = True
                elif c.group_type in ['L', 'P', 'V', 'M']:
                    add_stat("人文領域", c.credits)
                    is_gen_ed = True
                elif c.group_type in ['W', 'T', 'R', 'S']:
                    add_stat("社會領域", c.credits)
                    is_gen_ed = True
                elif c.group_type in ['U', 'Z', 'O']:
                    add_stat("科學領域", c.credits)
                    is_gen_ed = True
                elif "通識" in dept or "核心" in dept or "共通" in dept:
                    is_gen_ed = True

                if not is_activity and not is_gen_ed:
                    cat = getattr(c, 'category', '')
                    if cat == '必' or cat == '必修':
                        if "院必修" in name:
                            add_stat("院必修", c.credits)
                        else:
                            add_stat("系必修", c.credits)
                    elif cat == '選' or cat == '選修':
                        add_stat("系選修", c.credits)
                    else:
                        add_stat("自由學分", c.credits)
        
        report = {}
        for key, condition in requirements.items():
            if isinstance(condition, dict) and "courses" in condition:
                # 學程專用的陣列比對邏輯 (支援 M選N 與同名多老師)
                target = condition.get("target", 0)
                course_list = condition.get("courses", [])
                
                passed_sum = 0
                planned_sum = 0
                counted_serials = set()
                
                for courses in self.planned_schedule.values():
                    for c in courses:
                        if c.serial in counted_serials: continue
                        status = getattr(c, 'status', 'planned')
                        if status == 'failed': continue
                        
                        clean_name = c.name.split(' (')[0].strip() if ' (' in c.name else c.name
                        if c.name in course_list or clean_name in course_list:
                            if status == 'passed':
                                passed_sum += c.credits
                            else:
                                planned_sum += c.credits
                            counted_serials.add(c.serial)
                            
                current = passed_sum + planned_sum
                report[key] = {
                    "passed": passed_sum,
                    "planned": planned_sum,
                    "current": current,
                    "target": target,
                    "is_met": current >= target
                }
            else:
                # 傳統一般門檻
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

    def get_semester_stats(self, semester: str):
        """獲取特定學期的課程數、總學分、以及衝突課程對數"""
        courses = self.planned_schedule.get(semester, [])
        total_credits = sum(c.credits for c in courses)
        conflict_count = 0
        for i in range(len(courses)):
            for j in range(i + 1, len(courses)):
                if self._check_two_courses_conflict(courses[i], courses[j]):
                    conflict_count += 1
        return len(courses), total_credits, conflict_count

    def _check_two_courses_conflict(self, c1, c2):
        """內部邏輯：檢查兩堂課是否衝突"""
        for t1 in c1.time_slots:
            for t2 in c2.time_slots:
                if t1[0] == t2[0]:
                    if t1[1] <= t2[2] and t2[1] <= t1[2]:
                        return True
        return False
