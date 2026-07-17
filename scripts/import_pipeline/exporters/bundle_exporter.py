from pathlib import Path
import datetime, hashlib, json, sqlite3

FIELDS = ['serial','code','name','credits','category','teacher','classroom','capacity','time_data','semester_source','grade','major','sem_seq','class_name','group_type','time_info','department','notes']

def write_json(path, payload):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding='utf-8')

def build_bundle(root):
    root = Path(root)
    data_dir, source_dir = root / 'data', root / 'data/source_terms'
    rows, terms = [], []
    for path in sorted(source_dir.glob('*.normalized.json')):
        obj = json.loads(path.read_text(encoding='utf-8'))
        courses = obj.get('courses', obj.get('data', []))
        rows.extend(courses)
        terms.append({'term': obj.get('term', path.name.split('.')[0]), 'count': len(courses), 'source_type': obj.get('source_type', 'normalized')})
    unique = {}
    for row in rows:
        key = (row.get('semester_source'), row.get('serial'), row.get('code'), row.get('class_name'), row.get('name'))
        unique[key] = row
    rows = sorted(unique.values(), key=lambda row: (row.get('semester_source',''), row.get('serial',''), row.get('code','')))
    payload = {'data': rows}
    write_json(data_dir / 'courses.json', payload)
    write_json(root / 'frontend/public/data/courses.json', payload)
    generated = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(timespec='seconds')
    version = {
        'schema_version': 1, 'generated_at': generated, 'total_courses': len(rows), 'terms': terms,
        'content_hash': hashlib.sha256(json.dumps(rows, ensure_ascii=False, sort_keys=True).encode()).hexdigest()[:16]
    }
    write_json(data_dir / 'course_versions.json', version)
    write_json(root / 'frontend/public/data/course_versions.json', version)
    write_json(root / 'frontend/public/data/metadata.json', {'generated_at': generated, 'count': len(rows), 'semesters': {item['term']: item['count'] for item in terms}})
    con = sqlite3.connect(data_dir / 'course_inventory.db')
    con.execute('CREATE TABLE IF NOT EXISTS courses (serial TEXT,code TEXT,name TEXT,credits INTEGER,category TEXT,teacher TEXT,classroom TEXT,capacity TEXT,time_data TEXT,semester_source TEXT,grade TEXT,major TEXT,sem_seq TEXT,class_name TEXT,group_type TEXT,time_info TEXT,department TEXT,notes TEXT,UNIQUE(semester_source, serial, code, class_name, name))')
    con.execute('DELETE FROM courses')
    placeholders = ','.join('?' for _ in FIELDS)
    con.executemany(f"INSERT OR REPLACE INTO courses ({','.join(FIELDS)}) VALUES ({placeholders})", [[row.get(field, '') for field in FIELDS] for row in rows])
    con.commit(); con.close()
    return version
