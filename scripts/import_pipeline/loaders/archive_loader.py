from pathlib import Path
import shutil

def extract_archive(source, destination):
    source, destination = Path(source), Path(destination)
    destination.mkdir(parents=True, exist_ok=True)
    if source.is_dir():
        shutil.copytree(source, destination, dirs_exist_ok=True)
        return destination
    suffix = source.suffix.lower()
    if suffix == '.zip':
        shutil.unpack_archive(str(source), str(destination), 'zip')
        return destination
    if suffix == '.rar':
        try:
            import libarchive
        except ImportError as exc:
            raise RuntimeError('RAR 匯入需要：pip install libarchive-c') from exc
        with libarchive.file_reader(str(source)) as archive:
            for entry in archive:
                target = destination / entry.pathname
                if entry.isdir:
                    target.mkdir(parents=True, exist_ok=True)
                    continue
                target.parent.mkdir(parents=True, exist_ok=True)
                with target.open('wb') as output:
                    for block in entry.get_blocks():
                        output.write(block)
        return destination
    raise ValueError(f'不支援的來源格式：{source}')
