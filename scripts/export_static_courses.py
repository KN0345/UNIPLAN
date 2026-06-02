"""Export SQLite course catalog to static JSON for Cloudflare Pages.

Run from uni root:
    python scripts/export_static_courses.py
"""
import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DB = ROOT / "data" / "course_inventory.db"
OUT = ROOT / "frontend" / "public" / "data"
OUT.mkdir(parents=True, exist_ok=True)

conn = sqlite3.connect(DB)
conn.row_factory = sqlite3.Row
rows = [dict(row) for row in conn.execute("select * from courses order by semester_source, serial").fetchall()]
for row in rows:
    for key, value in list(row.items()):
        if value is None:
            row[key] = ""

(OUT / "courses.json").write_text(json.dumps({"data": rows}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

def unique(field):
    return sorted({str(row.get(field) or "").strip() for row in rows if str(row.get(field) or "").strip()})

metadata = {
    "departments": unique("department"),
    "majors": unique("major"),
    "grades": unique("grade"),
    "categories": unique("category"),
    "semesters": unique("semester_source"),
}
(OUT / "metadata.json").write_text(json.dumps({"data": metadata}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(f"Exported {len(rows)} courses to {OUT}")
