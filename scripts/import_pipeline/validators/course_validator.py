from collections import Counter
REQUIRED = ('serial', 'code', 'name', 'semester_source', 'department')

def validate(rows):
    missing, invalid_time, keys = [], [], []
    for index, row in enumerate(rows):
        absent = [field for field in REQUIRED if not str(row.get(field, '')).strip()]
        if absent:
            missing.append({'index': index, 'serial': row.get('serial'), 'fields': absent, 'source_file': row.get('_source_file', '')})
        if row.get('time_info') and row.get('time_data') in ('', '[]', None):
            invalid_time.append({'index': index, 'serial': row.get('serial'), 'time_info': row.get('time_info'), 'source_file': row.get('_source_file', '')})
        keys.append((row.get('semester_source'), row.get('serial'), row.get('code'), row.get('class_name'), row.get('name')))
    duplicates = [{'key': list(key), 'count': count} for key, count in Counter(keys).items() if count > 1]
    return {
        'total': len(rows), 'missing_required': missing, 'invalid_time': invalid_time,
        'duplicates': duplicates, 'status': 'success' if not missing and not duplicates else 'warning'
    }
