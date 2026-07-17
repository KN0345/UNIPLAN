from pathlib import Path
import re
from bs4 import BeautifulSoup, NavigableString

WEEKDAY = {'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'日':7}

def clean(value):
    return re.sub(r'\s+', ' ', value or '').strip()

def split_course_name_notes(cell):
    outer = cell.find('font')
    parts = []
    if outer:
        for child in outer.children:
            if isinstance(child, NavigableString):
                text = clean(str(child))
                if text:
                    parts.append(text)
            elif getattr(child, 'name', None) != 'font':
                text = clean(child.get_text(' ', strip=True))
                if text:
                    parts.append(text)
    full = clean(cell.get_text(' ', strip=True))
    name = clean(' '.join(parts)) or full
    notes = clean(full[len(name):]) if name and full.startswith(name) else ''
    return name, notes

def parse_time_cell(text):
    text = clean(text)
    if not text:
        return None
    parts = [clean(value) for value in text.split('/')]
    if len(parts) < 2:
        return {'raw': text, 'time_info': text, 'classroom': ''}
    day, slots = parts[0], parts[1]
    if not day and not slots:
        return None
    room = parts[2] if len(parts) > 2 else ''
    numbers = [int(value) for value in re.findall(r'\d+', slots)]
    return {'day': WEEKDAY.get(day), 'slots': numbers, 'classroom': room, 'time_info': f'{day} / {slots}', 'raw': text}

def parse_file(path, semester='1151CLASS'):
    path = Path(path)
    soup = BeautifulSoup(path.read_text(encoding='utf-8-sig', errors='replace'), 'html.parser')
    rows, current_department, page_notice = [], '', ''
    for table in soup.find_all('table'):
        trs = table.find_all('tr')
        if not trs:
            continue
        first = clean(trs[0].get_text(' ', strip=True))
        if first.startswith('系別(Department)：'):
            current_department = clean(first.split('：', 1)[1])
        elif len(trs) == 1 and first:
            page_notice = first
        for tr in trs:
            cells = tr.find_all(['td', 'th'], recursive=False)
            if len(cells) != 15:
                continue
            values = [clean(cell.get_text(' ', strip=True)) for cell in cells]
            if not re.fullmatch(r'\d{1,4}', values[1] or ''):
                continue
            name, notes = split_course_name_notes(cells[10])
            times = [item for item in (parse_time_cell(values[13]), parse_time_cell(values[14])) if item]
            time_data = [[item['day'], *item['slots']] for item in times if item.get('day') and item.get('slots')]
            rooms = []
            for item in times:
                room = item.get('classroom', '')
                if room and room not in rooms:
                    rooms.append(room)
            try:
                credits = float(values[8])
                credits = int(credits) if credits.is_integer() else credits
            except ValueError:
                credits = 0
            rows.append({
                'serial': values[1].zfill(4), 'code': values[2], 'name': name,
                'credits': credits, 'category': values[7], 'teacher': values[12],
                'classroom': '；'.join(rooms), 'capacity': values[11],
                'time_data': str(time_data).replace(' ', ''), 'semester_source': semester,
                'grade': values[0], 'major': values[3], 'sem_seq': values[4],
                'class_name': values[5], 'group_type': values[6],
                'time_info': '；'.join(item['time_info'] for item in times),
                'department': current_department, 'notes': notes or page_notice,
                '_source_file': path.name,
            })
    return rows

def parse_files(files, semester='1151CLASS'):
    rows = []
    for path in files:
        rows.extend(parse_file(path, semester))
    return rows
