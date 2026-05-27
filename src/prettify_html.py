import os
from bs4 import BeautifulSoup
from .config import RAW_DATA_DIR

def format_all_html_files():
    print(f"🔍 開始掃描目錄：{RAW_DATA_DIR}")
    success_count = 0
    
    for root, _, files in os.walk(RAW_DATA_DIR):
        for file in files:
            if file.lower().endswith(('.htm', '.html')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'rb') as f:
                        raw_data = f.read()

                    # 自動偵測編碼 (與你的 parser 邏輯相同)
                    html_content = None
                    for codec in ['cp950', 'utf-8', 'big5hkscs', 'big5']:
                        try:
                            html_content = raw_data.decode(codec)
                            break
                        except UnicodeDecodeError:
                            continue
                    
                    if not html_content:
                        html_content = raw_data.decode('cp950', errors='replace')

                    # 使用 BeautifulSoup 解析並美化排版 (prettify)
                    soup = BeautifulSoup(html_content, 'html.parser')
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(soup.prettify())
                    success_count += 1
                except Exception as e:
                    print(f"❌ 格式化失敗 {file}: {e}")
                    
    print(f"🎉 格式化完成！共成功整理了 {success_count} 個 HTML 檔案。")

if __name__ == "__main__":
    format_all_html_files()