#!/usr/bin/env python3
from pathlib import Path
import argparse, datetime, json, shutil
from .loaders.archive_loader import extract_archive
from .scanners.html_scanner import scan_html
from .parsers.parser_115 import parse_files
from .validators.course_validator import validate
from .exporters.bundle_exporter import write_json, build_bundle

def main():
    parser = argparse.ArgumentParser(description='UniPlan 課程資料匯入管線')
    parser.add_argument('source')
    parser.add_argument('--semester', default='1151CLASS')
    parser.add_argument('--root', default=str(Path(__file__).resolve().parents[2]))
    parser.add_argument('--publish', action='store_true')
    args = parser.parse_args()
    root = Path(args.root)
    job = root / 'data/import_jobs' / args.semester
    extracted = job / 'extracted'
    shutil.rmtree(extracted, ignore_errors=True)
    extract_archive(args.source, extracted)
    files = scan_html(extracted)
    rows = parse_files(files, args.semester)
    report = validate(rows)
    clean_map = {}
    for row in rows:
        item = dict(row)
        item.pop('_source_file', None)
        key = (item.get('semester_source'), item.get('serial'), item.get('code'), item.get('class_name'), item.get('name'))
        previous = clean_map.get(key)
        if previous is None or len(str(item.get('notes', ''))) > len(str(previous.get('notes', ''))):
            clean_map[key] = item
    clean_rows = list(clean_map.values())
    generated = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(timespec='seconds')
    normalized = {'term': args.semester, 'source_type': 'html_archive', 'parser': 'parser_115', 'parser_version': '1.0.0', 'generated_at': generated, 'source_files': len(files), 'raw_rows': len(rows), 'courses': clean_rows}
    write_json(root / 'data/source_terms' / f'{args.semester}.normalized.json', normalized)
    write_json(job / 'reports/validation_summary.json', report)
    write_json(job / 'reports/html_structure.json', {'html_files': len(files), 'parsed_courses': len(rows), 'semester': args.semester})
    history_path = root / 'data/course_import_history.json'
    history = json.loads(history_path.read_text(encoding='utf-8')) if history_path.exists() else []
    history.append({'semester': args.semester, 'time': generated, 'courses': len(clean_rows), 'raw_rows': len(rows), 'html_files': len(files), 'duplicates': len(report['duplicates']), 'missing': len(report['missing_required']), 'invalid_time': len(report['invalid_time']), 'status': report['status']})
    write_json(history_path, history[-100:])
    result = {'files': len(files), 'raw_rows': len(rows), 'courses': len(clean_rows), 'validation': report['status']}
    if args.publish:
        result['bundle'] = build_bundle(root)
    print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
