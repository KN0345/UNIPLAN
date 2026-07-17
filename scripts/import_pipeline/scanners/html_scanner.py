from pathlib import Path

def scan_html(root):
    root = Path(root)
    return sorted(path for path in {*root.rglob('*.htm'), *root.rglob('*.html')} if path.is_file())
