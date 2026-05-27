import re
from bs4 import BeautifulSoup
from typing import List, Tuple
from .models import Course

class CourseParser:
    """專門負責處理 HTML 的讀取與解析"""

    @staticmethod
    def fetch_courses_offline(file_path: str) -> List[Course]:
        scraped_courses = []
        try:
            with open(file_path, 'rb') as f:
                raw_data = f.read()
            
            # 多重編碼嘗試
            html_content = None
            for codec in ['cp950', 'utf-8', 'big5hkscs', 'big5']:
                try:
                    test_decode = raw_data.decode(codec)
                    check_text = re.sub(r'\s+', '', test_decode)
                    if "科目名稱" in check_text or "開課序號" in check_text or "科目編號" in check_text:
                        html_content = test_decode
                        break
                except UnicodeDecodeError:
                    continue
            
            if not html_content:
                html_content = raw_data.decode('cp950', errors='replace')

            soup = BeautifulSoup(html_content, 'html.parser')
            tables = soup.find_all('table')
            
            mapping = {
                "年級": "grade", "序號": "serial", "開課序號": "serial", "序 號": "serial",
                "科目編號": "code", "課號": "code", "科目名稱": "name", "課程名稱": "name",
                "學分": "credits", "必選修": "category", "選別": "category",
                "授課老師": "teacher", "教師": "teacher", "人數設限": "capacity",
                "上課時間": "time", "時間": "time", "專業別": "major",
                "學期序": "sem_seq", "班別": "class_name", "班級": "class_name", 
                "開課班級": "class_name", "組別": "class_name", "群別": "group_type",
                "備註": "notes", "限制": "notes"
            }

            for table in tables:
                rows = table.find_all('tr')
                if len(rows) < 2: continue

                header_map = {}
                header_row_idx = -1
                current_department = ""
                time_span = 1

                for r_idx, row in enumerate(rows[:10]):
                    # 在尋找表頭時，同時偵測是否已經出現科系名稱 (加強容錯)
                    clean_row = re.sub(r'\s+', '', row.get_text())
                    if '系別(Department)' in clean_row:
                        # 將整列文字抽出，替換 \xa0，並壓扁所有換行符號為單一空白
                        raw_text = row.get_text(separator=' ', strip=True).replace('\xa0', ' ')
                        flat_text = re.sub(r'\s+', ' ', raw_text)
                        # 直接抓出冒號後所有的文字
                        match = re.search(r'系別\s*\(\s*Department\s*\)[\s:：]*(.*)', flat_text, re.IGNORECASE)
                        if match:
                            # 用第一個空白做切割，直接取得代碼與中文系名 (例如: TABAJ.資圖系數位碩專班)
                            current_department = match.group(1).strip().split(' ')[0]

                    cells = row.find_all(['td', 'th'])
                    
                    matches = {}
                    col_idx = 0
                    cur_time_span = 1
                    
                    for cell in cells:
                        txt = re.sub(r'\s+', '', cell.get_text())
                        try:
                            colspan = int(cell['colspan']) if cell.has_attr('colspan') else 1
                        except:
                            colspan = 1
                            
                        for key, val in mapping.items():
                            clean_key = re.sub(r'\s+', '', key)
                            if clean_key in txt and val not in matches:
                                matches[val] = col_idx
                                if val == "time":
                                    cur_time_span = colspan
                        
                        col_idx += colspan
                    
                    if "name" in matches:
                        header_map = matches
                        header_row_idx = r_idx
                        time_span = cur_time_span
                        break
                
                if header_row_idx == -1: continue

                for row in rows[header_row_idx + 1:]:
                    # 偵測科系表頭行 (加強容錯)
                    clean_row = re.sub(r'\s+', '', row.get_text())
                    if '系別(Department)' in clean_row:
                        raw_text = row.get_text(separator=' ', strip=True).replace('\xa0', ' ')
                        flat_text = re.sub(r'\s+', ' ', raw_text)
                        match = re.search(r'系別\s*\(\s*Department\s*\)[\s:：]*(.*)', flat_text, re.IGNORECASE)
                        if match:
                            current_department = match.group(1).strip().split(' ')[0]
                        continue

                    cols = row.find_all(['td', 'th'])
                    if len(cols) < 5: continue
                    
                    extracted_notes = ""
                    name_idx = header_map.get("name")
                    if isinstance(name_idx, int) and name_idx < len(cols):
                        name_cell = cols[name_idx]
                        
                        notes_list = []
                        # 1. 先抓出紅字(red)或暗紅字(maroon)當作備註，並從 DOM 中移除
                        while True:
                            f = name_cell.find('font', color=lambda c: c and c.lower() in ['red', 'maroon'])
                            if not f: break
                            notes_list.append(f.get_text(separator=' ', strip=True))
                            f.extract()
                            
                        # 2. 尋找課名 (優先找 a_tag 或是藍字)
                        a_tag = name_cell.find('a')
                        blue_font = name_cell.find('font', color=lambda c: c and c.lower() == 'blue')
                        
                        if a_tag:
                            clean_name = a_tag.get_text(strip=True)
                            a_tag.extract()
                        elif blue_font:
                            clean_name = blue_font.get_text(strip=True)
                            blue_font.extract()
                        else:
                            # 既無超連結也無藍字：透過 text nodes 拆解，第一段通常是課名，後面的都是備註
                            text_fragments = list(name_cell.stripped_strings)
                            if text_fragments:
                                clean_name = text_fragments[0]
                                notes_list.extend(text_fragments[1:])
                            else:
                                clean_name = ""
                            name_cell.clear()
                            
                        # 若是有 a_tag 或 blue_font 的情況，萃取後剩下的所有一般文字也要當作備註
                        if a_tag or blue_font:
                            notes_list.extend(list(name_cell.stripped_strings))
                            
                        if notes_list:
                            extracted_notes = " ".join(notes_list).replace('\xa0', ' ')
                            
                        name_cell.string = clean_name

                    t = [td.get_text(strip=True).replace('\xa0', '') for td in cols]

                    serial_raw = t[header_map["serial"]] if "serial" in header_map and header_map["serial"] < len(t) else ""
                    serial = "".join(filter(str.isdigit, serial_raw))

                    def get_val(key):
                        idx = header_map.get(key)
                        return t[idx] if isinstance(idx, int) and idx < len(t) else ""

                    # 同時收集多個時間欄位的資料
                    time_raws = []
                    if "time" in header_map:
                        start_idx = header_map["time"]
                        for i in range(time_span):
                            if start_idx + i < len(t) and t[start_idx + i]:
                                time_raws.append(t[start_idx + i])
                    
                    combined_time_raw = " ".join(time_raws)
                    parsed_slots = CourseParser._parse_tku_time(combined_time_raw)
                    
                    classrooms = []
                    time_displays = []
                    for tr in time_raws:
                        if "/" in tr:
                            parts = tr.split('/')
                            if len(parts) >= 3:
                                cr = parts[-1].strip()
                                if cr and cr != "未定": classrooms.append(cr)
                                time_displays.append("/".join(parts[:2]).strip())
                            elif len(parts) == 2:
                                time_displays.append(tr.strip())
                        else:
                            if tr.strip(): time_displays.append(tr.strip())
                    
                    row_classroom = ",".join(dict.fromkeys(classrooms)) if classrooms else "未定"
                    row_time_display = " ".join(time_displays)

                    # 處理助教課或多列排版 (序號為空時，合併至上一堂課)
                    if not serial:
                        name = get_val("name")
                        class_name_raw = get_val("class_name").strip()
                        class_name_val = class_name_raw.replace(" ", "")
                        if name and class_name_val and class_name_val not in ["無", "不分班", "不分", "0"]:
                            suffix = ""
                            if not (class_name_val.endswith("班") or class_name_val.endswith("組")):
                                suffix = "班"
                            name = f"{name} ({class_name_raw}{suffix})"
                            
                        if scraped_courses and (not name or name == scraped_courses[-1].name):
                            if parsed_slots or row_classroom != "未定" or row_time_display:
                                scraped_courses[-1].time_slots.extend(parsed_slots)
                                teacher = get_val("teacher")
                                is_ta = "助教" in teacher or "助 教" in teacher
                                if row_time_display:
                                    if is_ta:
                                        scraped_courses[-1].time_info += f" (助教:{row_time_display})"
                                    else:
                                        scraped_courses[-1].time_info += f" {row_time_display}"
                                
                                if row_classroom and row_classroom != "未定":
                                    prev_cr = scraped_courses[-1].classroom
                                    prev_cr_list = prev_cr.split(',') if prev_cr and prev_cr != "未定" else []
                                    new_cr_list = [c for c in classrooms if c not in prev_cr_list]
                                    if new_cr_list:
                                        scraped_courses[-1].classroom = ",".join(prev_cr_list + new_cr_list)
                        continue

                    name = get_val("name")
                    if not name: continue

                    class_name_raw = get_val("class_name").strip()
                    class_name_val = class_name_raw.replace(" ", "")
                    if class_name_val and class_name_val not in ["無", "不分班", "不分", "0"]:
                        suffix = ""
                        if not (class_name_val.endswith("班") or class_name_val.endswith("組")):
                            suffix = "班"
                        name = f"{name} ({class_name_raw}{suffix})"

                    try:
                        credits = int(float(get_val("credits")))
                    except ValueError:
                        credits = 0

                    col_notes = get_val("notes")
                    final_notes = []
                    if extracted_notes: final_notes.append(extracted_notes)
                    if col_notes: final_notes.append(col_notes)
                    combined_notes = " / ".join(final_notes)

                    new_course = Course(
                        serial=serial, code=get_val("code"), name=name, credits=credits,
                        category=get_val("category"), teacher=get_val("teacher"), classroom=row_classroom,
                        capacity=get_val("capacity"), time_slots=parsed_slots,
                        semester_source="", grade=get_val("grade"), major=get_val("major"),
                        sem_seq=get_val("sem_seq"), class_name=get_val("class_name"),
                        group_type=get_val("group_type"), time_info=row_time_display,
                        department=current_department,
                        notes=combined_notes
                    )
                    scraped_courses.append(new_course)
            
            return scraped_courses
        except Exception as e:
            print(f"[錯誤] 解析 {file_path} 失敗: {e}")
            return []

    @staticmethod
    def _parse_tku_time(time_str: str) -> List[Tuple[int, int, int]]:
        day_map = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '日': 7}
        results = []
        clean_str = time_str.replace(" ", "").replace("\xa0", "")
        matches = re.findall(r'([一二三四五六日])/([\d,]+)', clean_str)
        for d_txt, s_txt in matches:
            day = day_map.get(d_txt, 0)
            nums = [int(n) for n in re.findall(r'\d+', s_txt)]
            if day > 0 and nums:
                results.append((day, min(nums), max(nums)))
        return results