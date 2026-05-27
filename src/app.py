
import base64
import io
import json
from datetime import date, timedelta

import pandas as pd
import requests
import streamlit as st

from .catalog import CourseCatalog
from .config import RAW_DATA_DIR
from .dnd_component import dnd_board
from .models import Student, Course
from .scheduler import CourseScheduler
from .storage import Storage

st.set_page_config(
    page_title="淡江大學四年課程規劃系統",
    layout="wide",
    initial_sidebar_state="expanded",
)

API_BASE_URL = "http://127.0.0.1:8000"

DEPT_MAP = {
    '00': '資訊與圖書館學系', '01': '中國文學學系', '03': '歷史學系', '04': '資訊傳播學系', '05': '大眾傳播學系',
    '08': '法文系', '09': '德文系', '10': '日本語文學系', '11': '英文系', '12': '西班牙語文學系', '13': '俄文系',
    '16': '化學系生化組', '17': '化學系材化組', '19': '數學系數學組', '20': '數學系資統組', '21': '物理系光電組',
    '22': '物理系應物組', '23': '尖端材料科學學程', '33': '戰略所碩專班', '35': '機械系精密機械組', '36': '建築系',
    '37': '機械系光機電整合', '38': '土木系工設組 / 碩士班', '40': '化材系', '41': '資工系', '43': '航太系',
    '44': '電機系電機資訊組', '48': '水環系水資源組', '49': '電機系電機通訊組', '50': '電機系電機與系統組',
    '51': '水環系環工組', '53': '財金系', '54': '產經系', '55': '國際企業系經貿管理組', '56': '風保系',
    '57': '經濟系', '59': '國企系國際商學組', '60': '會計系', '61': '企管系', '62': '管理科學學系', '63': '資管系',
    '64': '公共行政學系', '65': '統計學系', '66': '運管系', '68': '全財管學程', '71': '教設系', '73': '教科系',
    '77': '人工智慧學系', '80': '外交系', '81': '英文系英文英語', '82': '政經系', '85': '資工系資工英語', '86': '觀光系'
}


def setup_pwa() -> None:
    import streamlit.components.v1 as components
    components.html(
        """
        <script>
        try {
            const head = window.parent.document.getElementsByTagName('head')[0];
            if (!window.parent.document.getElementById('pwa-manifest')) {
                const manifest = {
                    "name":"淡江大學四年課程規劃系統",
                    "short_name":"TKU排課",
                    "theme_color":"#0f172a",
                    "background_color":"#0f172a",
                    "display":"standalone",
                    "orientation":"portrait",
                    "start_url": window.parent.location.pathname,
                    "icons":[
                        {"src":"https://upload.wikimedia.org/wikipedia/zh/thumb/3/36/Tamkang_University_logo.svg/192px-Tamkang_University_logo.svg.png","sizes":"192x192","type":"image/png"},
                        {"src":"https://upload.wikimedia.org/wikipedia/zh/thumb/3/36/Tamkang_University_logo.svg/512px-Tamkang_University_logo.svg.png","sizes":"512x512","type":"image/png"}
                    ]
                };
                const blob = new Blob([JSON.stringify(manifest)], {type:'application/json'});
                const link = window.parent.document.createElement('link');
                link.id = 'pwa-manifest';
                link.rel = 'manifest';
                link.href = window.parent.URL.createObjectURL(blob);
                head.appendChild(link);
            }
            if (!window.parent.document.querySelector('meta[name="viewport"]')) {
                const meta = window.parent.document.createElement('meta');
                meta.name = 'viewport';
                meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                head.appendChild(meta);
            }
        } catch(e) { console.log(e); }
        </script>
        """,
        height=0,
        width=0,
    )


setup_pwa()

# 外觀設定預設值需在 CSS 注入前建立，避免切換主題時第一輪畫面不同步。
for _ui_key, _ui_value in {
    "theme_color": "#3867f6",
    "show_weekends": False,
    "show_evening": False,
    "class_time_mode": "日間",
    "bg_image": None,
    "bg_opacity": 0.9,
}.items():
    if _ui_key not in st.session_state:
        st.session_state[_ui_key] = _ui_value


def inject_css(theme_mode: str = "自動") -> None:
    if theme_mode == "深色":
        vars_css = """
        --bg:#0b1120;
        --card:#111827;
        --card2:#0f172a;
        --line:#263449;
        --ink:#f8fafc;
        --muted:#9aa8bd;
        --soft:#182235;
        --field:#1f2433;
        """
    elif theme_mode == "淺色":
        vars_css = """
        --bg:#f5f8ff;
        --card:#ffffff;
        --card2:#f8fafc;
        --line:#dbe4f0;
        --ink:#0f172a;
        --muted:#64748b;
        --soft:#eef4ff;
        --field:#ffffff;
        """
    else:
        vars_css = """
        --bg:#f5f8ff;
        --card:#ffffff;
        --card2:#f8fafc;
        --line:#dbe4f0;
        --ink:#0f172a;
        --muted:#64748b;
        --soft:#eef4ff;
        --field:#ffffff;
        """

    css = """
<style>
:root{
__THEME_VARS__
--blue:__ACCENT_COLOR__;
--green:#22c55e;
--orange:#f59e0b;
--red:#ef4444;
--purple:#8b5cf6;
--radius:22px;
}
@media (prefers-color-scheme: dark){
  :root{
  --bg:#0b1120;
  --card:#111827;
  --card2:#0f172a;
  --line:#263449;
  --ink:#f8fafc;
  --muted:#9aa8bd;
  --soft:#182235;
  --field:#1f2433;
  --blue:#4f7cff;
  --green:#22c55e;
  --orange:#f59e0b;
  --red:#ef4444;
  --purple:#a78bfa;
  --radius:22px;
  }
}
html, body, .stApp{background:var(--bg)!important;color:var(--ink)!important;}
.block-container{padding-top:1.05rem!important;padding-left:1.6rem!important;padding-right:1.6rem!important;max-width:1760px!important;}
#MainMenu, footer, [data-testid="stToolbar"], .stDeployButton, [data-testid="stAppDeployButton"]{display:none!important;}
[data-testid="stSidebar"]{background:linear-gradient(180deg,#0f172a 0%,#111827 100%)!important;border-right:1px solid rgba(255,255,255,.08)!important;}
[data-testid="stSidebar"] *{color:#eef2ff!important;}
[data-testid="stSidebar"] .stSelectbox label,[data-testid="stSidebar"] .stCheckbox label{color:#cbd5e1!important;}
[data-testid="stSidebar"] input,[data-testid="stSidebar"] textarea,[data-testid="stSidebar"] [data-baseweb="select"]{background:#1f2937!important;color:#f8fafc!important;border-color:rgba(255,255,255,.12)!important;}
.stButton button, .stDownloadButton button, .stLinkButton a{border-radius:14px!important;font-weight:800!important;height:42px!important;}
.stTextInput input, .stTextArea textarea{background:var(--field)!important;color:var(--ink)!important;border:1px solid var(--line)!important;border-radius:13px!important;}
[data-baseweb="select"] > div{background:var(--field)!important;border-color:var(--line)!important;border-radius:13px!important;color:var(--ink)!important;}
label, .stMarkdown, p, span, div{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans TC",Roboto,Arial,sans-serif;}
.app-topbar{display:flex;align-items:center;justify-content:space-between;gap:18px;background:var(--card);border:1px solid var(--line);border-radius:24px;padding:16px 18px;margin-bottom:16px;box-shadow:0 12px 30px rgba(15,23,42,.06);}
.brand-wrap{display:flex;align-items:center;gap:13px}.brand-logo{width:44px;height:44px;border-radius:16px;display:grid;place-items:center;background:linear-gradient(135deg,rgba(56,103,246,.15),rgba(139,92,246,.12));font-size:24px}.brand-title{font-size:24px;font-weight:950;color:var(--ink);line-height:1.15}.brand-sub{font-size:13px;color:var(--muted);margin-top:4px}.top-badge{border:1px solid var(--line);background:var(--soft);color:var(--ink);font-size:13px;font-weight:850;padding:9px 12px;border-radius:999px;white-space:nowrap}
.sidebar-card{padding:18px;border-radius:22px;background:linear-gradient(180deg,rgba(30,41,59,.96),rgba(15,23,42,.92));border:1px solid rgba(255,255,255,.10);box-shadow:0 16px 34px rgba(0,0,0,.24);margin-bottom:14px}.side-kicker{font-size:12px;letter-spacing:.14em;color:#93c5fd!important;font-weight:950;margin-bottom:8px}.side-title{font-size:22px;font-weight:950;margin-bottom:16px}.side-field{font-size:12px;color:#94a3b8!important;margin-top:12px}.side-value{font-size:15px;font-weight:900;margin-top:3px}.pill{display:inline-flex;padding:6px 10px;border-radius:999px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.28);font-size:12px;font-weight:900;color:#bbf7d0!important}.side-section{font-size:13px;font-weight:950;letter-spacing:.06em;color:#bfdbfe!important;margin:18px 0 8px}.side-note{font-size:12px;color:#94a3b8!important;line-height:1.55;margin-bottom:10px}.nav-radio [role="radiogroup"]{display:flex;flex-direction:column;gap:6px}.nav-radio label{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);padding:8px 10px;border-radius:13px}
.progress-card{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:16px 18px;min-height:126px;box-shadow:0 12px 30px rgba(15,23,42,.055)}.progress-head{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}.progress-name{font-size:14px;font-weight:900;color:var(--ink)}.progress-pct{font-size:18px;font-weight:950;color:var(--green)}.progress-pct.warn{color:var(--orange)}.progress-value{font-size:26px;font-weight:950;color:var(--ink);margin:12px 0}.progress-track{width:100%;height:10px;border-radius:999px;background:rgba(148,163,184,.28);overflow:hidden;display:flex}.bar-pass{height:100%;background:var(--green)}.bar-plan{height:100%;background:var(--blue)}.legend{display:flex;gap:12px;flex-wrap:wrap;margin-top:10px;color:var(--muted);font-size:12px}.dot{display:inline-block;width:9px;height:9px;border-radius:999px;margin-right:5px}.dot.g{background:var(--green)}.dot.b{background:var(--blue)}.dot.gray{background:#cbd5e1}.hint-box{border:1px dashed var(--line);background:var(--card2);border-radius:14px;padding:12px;color:var(--muted);font-size:12px;line-height:1.55;margin-top:10px}
.section-card{background:var(--card);border:1px solid var(--line);border-radius:24px;padding:16px 18px;box-shadow:0 12px 32px rgba(15,23,42,.055);margin-top:14px}.section-title{font-size:22px;font-weight:950;color:var(--ink);margin-bottom:4px}.section-sub{font-size:13px;color:var(--muted);line-height:1.55;margin-bottom:12px}.control-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.info-box{background:var(--soft);border:1px solid var(--line);border-radius:16px;padding:13px 14px;color:var(--muted);font-size:13px;line-height:1.6}.result-card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:13px 14px;margin:10px 0 8px}.result-title{font-weight:950;color:var(--ink);font-size:15px}.result-meta{font-size:12px;color:var(--muted);line-height:1.6;margin-top:5px}.tag{display:inline-block;padding:3px 8px;border-radius:999px;font-size:11px;font-weight:950;margin-right:6px}.tag-req{background:rgba(56,103,246,.13);color:#4f7cff}.tag-ele{background:rgba(139,92,246,.13);color:#a78bfa}.tag-gen{background:rgba(34,197,94,.13);color:#22c55e}.tag-other{background:rgba(245,158,11,.13);color:#f59e0b}.staging-preview{display:flex;gap:8px;overflow-x:auto;padding:4px 0 8px}.preview-chip{flex:0 0 auto;border:1px solid var(--line);background:var(--card2);border-radius:999px;padding:7px 10px;font-size:12px;font-weight:850;color:var(--ink)}
.semester-map{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.sem-node{border:1px solid var(--line);background:var(--card2);border-radius:18px;padding:12px}.sem-node-title{font-weight:950;color:var(--ink);font-size:14px}.sem-node-meta{color:var(--muted);font-size:12px;line-height:1.6;margin-top:6px}.sem-node.warn{border-color:rgba(245,158,11,.55)}.sem-node.danger{border-color:rgba(239,68,68,.55)}.mobile-widget{max-width:390px;border-radius:28px;background:linear-gradient(180deg,var(--card),var(--card2));border:1px solid var(--line);box-shadow:0 18px 45px rgba(15,23,42,.16);padding:18px;margin:10px 0}.widget-title{font-size:13px;color:var(--muted);font-weight:850}.widget-main{font-size:24px;font-weight:950;color:var(--ink);margin-top:8px}.widget-sub{font-size:13px;color:var(--muted);line-height:1.55;margin-top:8px}.widget-row{display:flex;justify-content:space-between;border-top:1px solid var(--line);padding-top:10px;margin-top:10px;font-size:13px;color:var(--ink)}@media(max-width:720px){.semester-map{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}}@media (max-width: 1000px){.block-container{padding-left:.8rem!important;padding-right:.8rem!important}.app-topbar{flex-direction:column;align-items:flex-start}.brand-title{font-size:20px}.top-badge{white-space:normal}.progress-card{min-height:auto}.desktop-grid{display:block!important}.search-panel{margin-top:14px}}

/* UI polish layer: student-first, minimal learning curve */
.hero-panel{position:relative;overflow:hidden;background:linear-gradient(135deg,var(--card) 0%,var(--card2) 58%,rgba(56,103,246,.08) 100%);border:1px solid var(--line);border-radius:28px;padding:20px 22px;margin-bottom:16px;box-shadow:0 20px 48px rgba(15,23,42,.075)}
.hero-panel::after{content:"";position:absolute;right:-72px;top:-86px;width:220px;height:220px;border-radius:999px;background:radial-gradient(circle,rgba(56,103,246,.20),rgba(139,92,246,.10),transparent 70%);pointer-events:none}.hero-main{position:relative;z-index:1;display:flex;justify-content:space-between;align-items:flex-start;gap:20px}.hero-kicker{font-size:12px;font-weight:950;letter-spacing:.16em;color:var(--blue);text-transform:uppercase;margin-bottom:7px}.hero-title{font-size:30px;font-weight:980;letter-spacing:-.035em;line-height:1.1;color:var(--ink)}.hero-desc{font-size:14px;color:var(--muted);line-height:1.7;margin-top:8px;max-width:680px}.hero-actions{display:flex;gap:9px;flex-wrap:wrap;justify-content:flex-end}.hero-chip{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line);background:rgba(255,255,255,.44);border-radius:999px;padding:9px 12px;color:var(--ink);font-size:12px;font-weight:900;white-space:nowrap}.hero-chip strong{font-size:15px;color:var(--blue)}
.quick-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:8px 0 14px}.quick-card{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:14px 15px;box-shadow:0 12px 28px rgba(15,23,42,.052)}.quick-label{font-size:12px;color:var(--muted);font-weight:850}.quick-value{font-size:24px;font-weight:980;color:var(--ink);margin-top:6px;line-height:1.1}.quick-note{font-size:12px;color:var(--muted);margin-top:8px;line-height:1.4}.quick-good{color:var(--green)!important}.quick-warn{color:var(--orange)!important}.quick-bad{color:var(--red)!important}
.step-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:10px 0 2px}.step-item{border:1px solid var(--line);background:var(--card2);border-radius:16px;padding:12px 13px;color:var(--muted);font-size:12px;line-height:1.45}.step-item b{display:block;color:var(--ink);font-size:13px;margin-bottom:4px}.step-num{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:999px;background:var(--blue);color:white;font-size:12px;font-weight:950;margin-right:6px}.search-panel .stButton button{height:38px!important;font-size:13px!important}.search-panel .stSelectbox label,.search-panel .stTextInput label{font-size:12px!important;color:var(--muted)!important}.section-card.compact{padding:14px 15px}.mobile-only-hint{display:none}.floating-mobile-help{display:none}.mini-progress{display:flex;gap:6px;align-items:center;margin-top:10px}.mini-progress span{height:7px;border-radius:999px;background:rgba(148,163,184,.24);flex:1}.mini-progress span.on{background:var(--blue)}
.course-action-note{border-left:4px solid var(--blue);background:var(--soft);border-radius:14px;padding:10px 12px;color:var(--muted);font-size:12px;line-height:1.55;margin-top:10px}.ui-divider{height:1px;background:var(--line);margin:12px 0}.top-status-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.status-pill{border-radius:999px;border:1px solid var(--line);background:var(--soft);padding:7px 10px;font-size:12px;font-weight:850;color:var(--muted)}.status-pill b{color:var(--ink)}
@media(max-width:900px){.hero-panel{padding:16px 15px;border-radius:22px}.hero-main{flex-direction:column;gap:12px}.hero-title{font-size:23px}.hero-desc{font-size:13px}.hero-actions{justify-content:flex-start}.hero-chip{padding:7px 10px}.quick-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.quick-card{padding:12px;border-radius:18px}.quick-value{font-size:20px}.step-strip{grid-template-columns:1fr}.mobile-only-hint{display:block}.floating-mobile-help{display:block;position:sticky;bottom:8px;z-index:50;background:rgba(15,23,42,.92);color:#fff;border-radius:16px;padding:10px 12px;font-size:12px;line-height:1.45;box-shadow:0 14px 34px rgba(15,23,42,.25);margin-top:10px}.floating-mobile-help b{color:#fff}.semester-map{grid-template-columns:1fr!important}.app-topbar{display:none}.sidebar-card .side-title{font-size:18px}}


/* --- UI cleanup patch: simpler, paged schedule workspace --- */
.section-card{box-shadow:none!important;background:rgba(15,23,42,.72)!important;border-color:rgba(148,163,184,.22)!important}
.quick-card,.progress-card,.result-card{box-shadow:none!important}
.hero-panel,.step-strip{display:none!important}
[data-testid="stTabs"] [role="tablist"]{gap:8px;border-bottom:1px solid rgba(148,163,184,.22);padding-bottom:6px;margin-bottom:12px}
[data-testid="stTabs"] [role="tab"]{border:1px solid rgba(148,163,184,.25);border-radius:999px;padding:7px 14px;background:rgba(15,23,42,.72)}
[data-testid="stTabs"] [aria-selected="true"]{background:rgba(37,99,235,.24)!important;border-color:rgba(96,165,250,.55)!important}
.compact-toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:2px 0 12px 0}.compact-pill{padding:6px 10px;border-radius:999px;background:rgba(37,99,235,.13);border:1px solid rgba(96,165,250,.28);font-size:12px;font-weight:850;color:#bfdbfe!important}.workspace-note{font-size:13px;color:#94a3b8!important;margin-top:-4px;margin-bottom:8px;line-height:1.5}
@media(max-width:900px){.section-card{border-radius:18px!important;padding:12px!important}.quick-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.floating-mobile-help{display:none!important}}

/* --- Hamburger drawer navigation patch --- */
[data-testid="stSidebar"]{min-width:300px!important;max-width:300px!important;}
[data-testid="stSidebarCollapsedControl"]{left:14px!important;top:14px!important;background:var(--card)!important;border:1px solid var(--line)!important;border-radius:14px!important;box-shadow:0 10px 24px rgba(15,23,42,.12)!important;}
.block-container{padding-top:3.2rem!important;}
.menu-hint{position:fixed;left:58px;top:18px;z-index:999;color:var(--muted);font-size:12px;font-weight:850;background:var(--card);border:1px solid var(--line);border-radius:999px;padding:6px 10px;box-shadow:0 10px 22px rgba(15,23,42,.08)}
.nav-radio label{margin-bottom:4px!important;transition:.15s ease;}
.nav-radio label:hover{background:rgba(59,130,246,.15)!important;border-color:rgba(96,165,250,.38)!important;}
@media(max-width:900px){[data-testid="stSidebar"]{min-width:82vw!important;max-width:82vw!important}.menu-hint{display:none}.block-container{padding-top:2.8rem!important}}


/* --- Final product UI: clean planner dashboard matching four-year map concept --- */
html,body,.stApp{background:var(--bg)!important;color:var(--ink)!important;}.block-container{padding-top:1.2rem!important;padding-left:1.55rem!important;padding-right:1.55rem!important;max-width:1720px!important;}
[data-testid="stSidebar"]{background:linear-gradient(180deg,#111827 0%,#0f172a 100%)!important;border-right:1px solid rgba(255,255,255,.08)!important;box-shadow:18px 0 45px rgba(15,23,42,.16)!important;}
[data-testid="stSidebarCollapsedControl"]{background:#ffffff!important;border:1px solid #dbe4f0!important;border-radius:14px!important;color:#0f172a!important;box-shadow:0 10px 24px rgba(15,23,42,.14)!important;}.menu-hint{display:none!important;}
.app-shell-header{display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid var(--line);border-radius:0;padding:14px 18px;margin:-18px -12px 16px -12px;box-shadow:0 8px 24px rgba(15,23,42,.045)}.header-title{font-size:24px;font-weight:950;letter-spacing:-.03em;color:#0f172a}.header-right{display:flex;align-items:center;gap:12px;color:#334155;font-weight:800}.header-icon{width:36px;height:36px;border-radius:999px;border:1px solid #dbe4f0;display:grid;place-items:center;background:#f8fafc}.user-pill{padding:8px 12px;border-radius:999px;background:#f8fafc;border:1px solid #dbe4f0;font-size:13px}
.four-map{background:#fff;border:1px solid var(--line);border-radius:24px;padding:18px 22px;margin-bottom:16px;box-shadow:0 18px 42px rgba(15,23,42,.05)}.map-line{display:grid;grid-template-columns:repeat(4,1fr);align-items:start;gap:0;position:relative}.map-line:before{content:"";position:absolute;left:10%;right:10%;top:22px;height:4px;background:#e5e7eb;border-radius:999px}.year-node{position:relative;z-index:1;text-align:center}.year-dot{width:42px;height:42px;border-radius:999px;margin:0 auto 8px auto;display:grid;place-items:center;background:#fff;border:3px solid #cbd5e1;color:#64748b;font-weight:950}.year-node.active .year-dot{width:154px;border-radius:999px;border:0;background:linear-gradient(135deg,#635bff,#4f46e5);color:#fff;box-shadow:0 12px 28px rgba(79,70,229,.28)}.year-node.done .year-dot{border-color:#4f46e5;color:#4f46e5}.year-name{font-size:20px;font-weight:950;color:#0f172a}.year-meta{font-size:13px;color:#64748b;margin-top:6px}.year-node.active .year-meta{color:#4f46e5;font-weight:850}
.summary-banner{display:grid;grid-template-columns:1.4fr .7fr .7fr .7fr 1.1fr;gap:14px;align-items:center;background:#fff;border:1px solid var(--line);border-radius:24px;padding:18px 22px;margin-bottom:16px;box-shadow:0 18px 42px rgba(15,23,42,.05)}.sem-big-title{font-size:28px;font-weight:950;color:#0f172a;letter-spacing:-.03em}.sem-status{display:inline-block;font-size:13px;font-weight:900;color:#315efb;background:#eef4ff;border-radius:10px;padding:5px 10px;margin-left:8px}.summary-stat{display:flex;gap:10px;align-items:center;border-left:1px solid #e2e8f0;padding-left:16px}.stat-icon{width:42px;height:42px;border-radius:999px;display:grid;place-items:center;background:#eef4ff;color:#4f46e5;font-size:19px}.stat-num{font-size:22px;font-weight:950;color:#0f172a;line-height:1}.stat-label{font-size:12px;color:#64748b;margin-top:4px}.ai-cta{height:64px;border-radius:14px;background:linear-gradient(135deg,#635bff,#4f46e5);color:#fff;display:grid;place-items:center;text-align:center;font-weight:950;font-size:17px;box-shadow:0 14px 30px rgba(79,70,229,.26)}.ai-cta small{display:block;font-size:11px;font-weight:700;opacity:.82;margin-top:3px}
.dashboard-grid{display:grid;grid-template-columns:320px minmax(540px,1fr) 360px;gap:16px;align-items:start}.section-card{background:#fff!important;border:1px solid var(--line)!important;border-radius:22px!important;box-shadow:0 12px 32px rgba(15,23,42,.045)!important;padding:16px!important;margin-top:0!important}.section-title{font-size:18px!important;font-weight:950!important;color:#0f172a!important}.section-sub{font-size:12px!important;color:#64748b!important;margin-bottom:12px!important}.result-card{background:#fff!important;border:1px solid #e2e8f0!important;border-radius:16px!important;margin:10px 0 6px!important;padding:12px 12px!important;box-shadow:0 8px 20px rgba(15,23,42,.035)!important}.result-title{font-size:15px!important;color:#0f172a!important}.result-meta{color:#64748b!important}.staging-preview{background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:8px;margin-bottom:10px}.preview-chip{background:#fff!important;border-color:#dbe4f0!important;color:#334155!important}.compact-toolbar{margin:0 0 10px!important}.compact-pill{background:#eef4ff!important;border:1px solid #dbeafe!important;color:#315efb!important}.stButton button,.stDownloadButton button{border-radius:12px!important;font-weight:900!important}.stButton button[kind="primary"]{background:linear-gradient(135deg,#635bff,#4f46e5)!important;border:0!important}.stTextInput input,.stTextArea textarea,[data-baseweb="select"]>div{background:#fff!important;border:1px solid #dbe4f0!important;color:#0f172a!important;border-radius:12px!important}.stRadio [role="radiogroup"]{gap:8px}.stRadio label{border:1px solid #dbe4f0;background:#fff;border-radius:999px;padding:7px 12px;margin-right:4px}.stRadio label:has(input:checked){background:#eef4ff;border-color:#93c5fd;color:#315efb}.assistant-panel{background:#fff;border:1px solid var(--line);border-radius:22px;padding:16px;box-shadow:0 12px 32px rgba(15,23,42,.045)}.assistant-course{border:1px solid #e2e8f0;border-radius:18px;padding:14px;background:#fff;margin-bottom:12px}.assistant-title{font-size:20px;font-weight:950;color:#0f172a;line-height:1.25}.assistant-tag{display:inline-block;margin-left:6px;background:#eef4ff;color:#4f46e5;border-radius:999px;font-size:12px;font-weight:900;padding:4px 8px}.assistant-meta{font-size:13px;color:#64748b;line-height:1.8;margin-top:8px}.assistant-tabs{display:flex;gap:8px;border-bottom:1px solid #e2e8f0;margin:10px 0 14px}.assistant-tabs span{font-size:13px;font-weight:900;color:#64748b;padding:8px 4px}.assistant-tabs span:first-child{color:#4f46e5;border-bottom:2px solid #4f46e5}.fact-row{display:flex;gap:10px;align-items:flex-start;margin:12px 0;color:#334155;font-size:13px}.fact-row b{color:#0f172a}.bottom-strip{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-top:16px}.bottom-card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:14px 16px;box-shadow:0 10px 24px rgba(15,23,42,.04)}.bottom-label{font-size:12px;color:#64748b;font-weight:900}.bottom-main{font-size:20px;color:#0f172a;font-weight:950;margin-top:6px}.bottom-sub{font-size:12px;color:#64748b;margin-top:4px}.progress-card,.quick-card{background:#fff!important;border-color:#e2e8f0!important;box-shadow:0 10px 24px rgba(15,23,42,.04)!important}.quick-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.hero-panel,.step-strip{display:none!important}
[data-testid="stSidebar"] .stRadio label{border:0!important;background:transparent!important;color:#e2e8f0!important;border-radius:14px!important;padding:10px 12px!important;font-weight:850!important}.nav-radio label:hover{background:rgba(99,102,241,.18)!important}.sidebar-card{background:transparent!important;border:0!important;box-shadow:none!important;padding:14px 10px!important}.side-title{font-size:20px!important}.side-section{color:#94a3b8!important;font-size:12px;font-weight:950;letter-spacing:.08em;margin:16px 0 8px}.pill{background:rgba(99,102,241,.18);color:#c7d2fe!important;border:1px solid rgba(129,140,248,.32);padding:5px 9px;border-radius:999px;font-size:12px;font-weight:900}
@media(max-width:1200px){.dashboard-grid{grid-template-columns:1fr}.summary-banner{grid-template-columns:1fr 1fr}.ai-cta{grid-column:1/-1}.bottom-strip{grid-template-columns:1fr}.four-map{overflow-x:auto}.map-line{min-width:720px}}
@media(max-width:720px){.block-container{padding-left:.75rem!important;padding-right:.75rem!important}.app-shell-header{margin:-12px -4px 12px -4px;border-radius:0}.header-title{font-size:20px}.header-right .header-icon{display:none}.four-map,.summary-banner,.section-card,.assistant-panel{border-radius:18px!important;padding:13px!important}.summary-banner{grid-template-columns:1fr}.summary-stat{border-left:0;padding-left:0;border-top:1px solid #e2e8f0;padding-top:10px}.sem-big-title{font-size:22px}.quick-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.year-node.active .year-dot{width:112px}.dashboard-grid{gap:12px}}


/* --- Stable planner shell: no Streamlit sidebar, real in-page hamburger --- */
[data-testid="stSidebar"], [data-testid="stSidebarCollapsedControl"]{display:none!important;}
.block-container{padding-top:.6rem!important;max-width:1640px!important;}
.app-shell-header{position:sticky;top:0;z-index:50;display:grid;grid-template-columns:48px 1fr auto;align-items:center;gap:12px;background:rgba(255,255,255,.96);backdrop-filter:blur(16px);border:1px solid #e2e8f0;border-radius:0 0 22px 22px;padding:12px 16px;margin:-10px -4px 14px -4px;box-shadow:0 14px 36px rgba(15,23,42,.06)}
.hamburger-button button{height:42px!important;width:42px!important;border-radius:14px!important;padding:0!important;background:#fff!important;border:1px solid #dbe4f0!important;color:#0f172a!important;font-size:20px!important;box-shadow:0 8px 18px rgba(15,23,42,.08)!important;}
.header-title{font-size:21px!important;font-weight:950!important;color:#0f172a!important}.header-sub{font-size:12px;color:#64748b;font-weight:800;margin-top:2px}.header-right{display:flex;gap:8px;align-items:center}.header-icon,.user-pill{background:#fff;border:1px solid #dbe4f0;border-radius:999px;padding:9px 12px;font-size:13px;font-weight:900;color:#0f172a;box-shadow:0 8px 18px rgba(15,23,42,.04)}
.drawer-card{position:sticky;top:76px;z-index:40;background:#0f172a;border:1px solid rgba(255,255,255,.12);border-radius:24px;padding:14px;box-shadow:0 22px 56px rgba(15,23,42,.26);margin-bottom:14px}.drawer-brand{font-size:18px;font-weight:950;color:#fff;margin-bottom:4px}.drawer-sub{font-size:12px;color:#94a3b8;margin-bottom:14px;line-height:1.5}.drawer-section{font-size:11px;letter-spacing:.12em;color:#93c5fd;font-weight:950;margin:12px 0 7px}.drawer-card .stButton button{background:rgba(255,255,255,.06)!important;color:#e2e8f0!important;border:1px solid rgba(255,255,255,.09)!important;border-radius:14px!important;justify-content:flex-start!important;text-align:left!important}.drawer-card .stButton button:hover{background:rgba(99,102,241,.22)!important;border-color:rgba(129,140,248,.45)!important}.drawer-card .stButton button[kind="primary"]{background:linear-gradient(135deg,#635bff,#4f46e5)!important;color:#fff!important;border:0!important}.drawer-small{color:#94a3b8;font-size:12px;line-height:1.55;margin-top:10px}.drawer-overlay-grid{display:grid;grid-template-columns:270px minmax(0,1fr);gap:16px;align-items:start}
.four-map{padding:14px 18px!important;margin-bottom:14px!important}.map-line{display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:18px!important;position:relative}.year-node{text-align:center;min-width:0}.year-dot{margin:auto!important}.year-name{font-size:17px!important}.year-meta{font-size:12px!important}.summary-banner{grid-template-columns:1.25fr repeat(3,.62fr) 1.05fr!important;margin-bottom:16px!important;padding:16px 20px!important}.sem-big-title{font-size:26px!important}.dashboard-grid{display:grid!important;grid-template-columns:minmax(260px,330px) minmax(640px,1fr) minmax(280px,340px)!important;gap:16px!important;align-items:start}.search-panel .section-title,.schedule-panel .section-title{font-size:18px!important}.search-panel .section-sub,.schedule-panel .section-sub{font-size:12px!important}.search-panel .stTextInput input{height:42px!important}.filter-compact{display:flex;align-items:center;gap:8px;color:#64748b;font-size:12px;font-weight:800;margin:6px 0 10px}.result-card{padding:10px 11px!important;margin:8px 0!important}.result-title{font-size:14px!important}.result-meta{font-size:12px!important}.course-detail-inline{display:none!important}.schedule-panel{padding:14px!important}.compact-toolbar{margin-bottom:8px!important}.staging-preview{max-height:72px;overflow:auto}.assistant-panel{position:sticky;top:76px}.assistant-course{padding:13px!important}.assistant-title{font-size:18px!important}.bottom-strip{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:14px}.menu-hint{display:none!important}
@media(max-width:980px){.app-shell-header{grid-template-columns:46px 1fr;}.header-right{display:none}.drawer-overlay-grid{grid-template-columns:1fr}.drawer-card{position:relative;top:0}.dashboard-grid{grid-template-columns:1fr!important}.assistant-panel{position:relative;top:0}.summary-banner{grid-template-columns:1fr!important}.map-line{gap:8px!important}.year-node.active .year-dot{width:96px!important}.bottom-strip{grid-template-columns:1fr}.four-map{overflow-x:auto}.block-container{padding-left:.7rem!important;padding-right:.7rem!important}}


/* --- Final alignment / common-web controls patch --- */
.stApp > header{background:transparent!important;box-shadow:none!important;}
.block-container{padding-top:.75rem!important;padding-left:1.25rem!important;padding-right:1.25rem!important;max-width:1680px!important;}
.app-shell-header{display:grid!important;grid-template-columns:48px 1fr minmax(300px,420px) auto!important;gap:14px!important;align-items:center!important;margin:0 0 14px 0!important;border-radius:22px!important;padding:12px 14px!important;background:rgba(255,255,255,.98)!important;border:1px solid #e2e8f0!important;box-shadow:0 12px 34px rgba(15,23,42,.06)!important;}
.header-title{font-size:21px!important;line-height:1.15!important;}
.header-sub{font-size:12px!important;color:#64748b!important;}
.header-search{min-width:260px;}
.header-search input{height:42px!important;border-radius:999px!important;background:#f8fafc!important;}
.header-right{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;white-space:nowrap!important;}
.header-icon,.user-pill{height:38px!important;display:flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;}
.four-map,.summary-banner,.section-card,.assistant-panel,.bottom-card,.quick-card,.progress-card{box-sizing:border-box!important;}
.four-map{margin:0 0 14px 0!important;}
.summary-banner{margin:0 0 14px 0!important;align-items:center!important;}
.summary-stat{min-height:48px!important;}
.section-card{margin:0!important;}
.schedule-panel-clean{padding:16px!important;}
.schedule-toolbar{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;flex-wrap:wrap!important;margin-bottom:12px!important;}
.schedule-toolbar-left,.schedule-toolbar-right{display:flex!important;align-items:center!important;gap:8px!important;flex-wrap:wrap!important;}
.mode-chip{display:inline-flex!important;align-items:center!important;gap:6px!important;padding:7px 10px!important;border-radius:999px!important;border:1px solid #dbe4f0!important;background:#fff!important;color:#334155!important;font-size:12px!important;font-weight:900!important;}
.mode-chip.active{background:#eef4ff!important;border-color:#93c5fd!important;color:#315efb!important;}
.staging-preview{max-height:86px!important;overflow:auto!important;}
.assistant-panel{position:sticky!important;top:88px!important;}
[data-testid="stHorizontalBlock"]{align-items:start!important;}
.stButton button{white-space:nowrap!important;}
button[kind="secondary"], button[kind="primary"]{min-height:40px!important;}
@media(max-width:1180px){.app-shell-header{grid-template-columns:48px 1fr auto!important}.header-search{grid-column:1/-1}.assistant-panel{position:relative!important;top:0!important}.summary-banner{grid-template-columns:1fr 1fr!important}.ai-cta{grid-column:1/-1!important}}
@media(max-width:720px){.block-container{padding-left:.7rem!important;padding-right:.7rem!important}.app-shell-header{grid-template-columns:44px 1fr!important;gap:8px!important;border-radius:18px!important}.header-right{display:none!important}.header-search{grid-column:1/-1!important}.summary-banner{grid-template-columns:1fr!important}.schedule-toolbar{align-items:stretch!important}.schedule-toolbar-left,.schedule-toolbar-right{width:100%!important}.four-map{overflow-x:auto!important}.map-line{min-width:680px!important}}


/* === Reference UI final pass: stable sidebar + clean aligned dashboard === */
[data-testid="stSidebar"]{display:block!important;background:linear-gradient(180deg,#111827 0%,#172033 100%)!important;border-right:1px solid rgba(255,255,255,.08)!important;box-shadow:18px 0 48px rgba(15,23,42,.10)!important;min-width:278px!important;max-width:278px!important;}
[data-testid="stSidebar"] *{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans TC",Roboto,Arial,sans-serif!important;}
[data-testid="stSidebar"] [data-testid="stMarkdownContainer"]{color:#e5edff!important;}
[data-testid="stSidebar"] .stRadio > label{display:none!important;}
[data-testid="stSidebar"] [role="radiogroup"]{display:flex!important;flex-direction:column!important;gap:8px!important;margin-top:10px!important;}
[data-testid="stSidebar"] [role="radiogroup"] label{width:100%!important;background:transparent!important;border:0!important;border-radius:14px!important;padding:0!important;margin:0!important;color:#cbd5e1!important;}
[data-testid="stSidebar"] [role="radiogroup"] label > div:last-child{font-weight:900!important;font-size:15px!important;padding:12px 14px!important;border-radius:14px!important;color:#dbeafe!important;}
[data-testid="stSidebar"] [role="radiogroup"] label:has(input:checked) > div:last-child{background:linear-gradient(135deg,#625bff,#4f46e5)!important;color:#fff!important;box-shadow:0 14px 30px rgba(79,70,229,.34)!important;}
[data-testid="stSidebar"] [role="radiogroup"] label:hover > div:last-child{background:rgba(255,255,255,.08)!important;color:#fff!important;}
.side-logo-row{display:flex;align-items:center;gap:12px;margin:8px 4px 26px 4px;color:#fff}.side-logo{width:38px;height:38px;border-radius:12px;background:rgba(255,255,255,.09);display:grid;place-items:center;font-size:20px}.side-app-name{font-size:19px;font-weight:950;color:#fff}.side-app-sub{font-size:12px;color:#94a3b8;margin-top:3px}.side-progress-card{margin-top:28px;border:1px solid rgba(255,255,255,.10);border-radius:22px;padding:18px;background:rgba(255,255,255,.06);box-shadow:0 20px 42px rgba(0,0,0,.16)}.side-progress-title{font-size:14px;color:#cbd5e1;font-weight:900}.side-progress-number{font-size:36px;line-height:1;font-weight:950;color:#fff;margin:18px 0 14px}.side-progress-track{height:9px;border-radius:999px;background:rgba(148,163,184,.25);overflow:hidden}.side-progress-track div{height:100%;border-radius:999px;background:linear-gradient(90deg,#625bff,#7c6cff)}.side-progress-sub{font-size:12px;color:#94a3b8;margin-top:12px}.side-mini-note{font-size:12px;color:#94a3b8;line-height:1.6;margin:16px 4px 0 4px}.block-container{max-width:1560px!important;padding-top:1.1rem!important;padding-left:1.45rem!important;padding-right:1.45rem!important;background:#f4f7fb!important}.stApp{background:#f4f7fb!important}.app-shell-header{display:none!important}.header-title{font-size:24px!important;font-weight:950!important;color:#0f172a!important;margin-top:2px!important}.header-sub{font-size:12px!important;color:#64748b!important}.four-map{background:#fff!important;border:1px solid #dfe7f2!important;border-radius:24px!important;padding:18px 26px!important;margin:16px 0!important;box-shadow:0 12px 34px rgba(15,23,42,.045)!important}.map-line:before{top:21px!important;left:11%!important;right:11%!important;height:4px!important;background:#e5eaf2!important}.year-dot{width:42px!important;height:42px!important;border:3px solid #cbd5e1!important;background:#fff!important;color:#64748b!important}.year-node.active .year-dot{width:160px!important;height:42px!important;border-radius:999px!important;border:0!important;background:linear-gradient(135deg,#625bff,#4f46e5)!important;color:#fff!important;box-shadow:0 16px 34px rgba(79,70,229,.25)!important}.year-name{font-size:20px!important;font-weight:950!important;color:#0f172a!important;margin-top:8px!important}.year-meta{font-size:12px!important;color:#64748b!important}.summary-banner{display:grid!important;grid-template-columns:1.45fr .64fr .64fr .64fr 1.15fr!important;align-items:center!important;gap:20px!important;background:#fff!important;border:1px solid #dfe7f2!important;border-radius:24px!important;padding:16px 24px!important;margin:0 0 16px 0!important;box-shadow:0 12px 34px rgba(15,23,42,.045)!important}.sem-big-title{font-size:29px!important;font-weight:950!important;color:#0f172a!important}.sem-status{background:#eef4ff!important;color:#4f46e5!important;font-size:12px!important;font-weight:950!important;border-radius:10px!important;padding:6px 10px!important;margin-left:8px!important}.summary-stat{display:flex!important;align-items:center!important;gap:12px!important;border-left:1px solid #e2e8f0!important;padding-left:20px!important}.stat-icon{width:42px!important;height:42px!important;border-radius:999px!important;background:#f1f5ff!important;display:grid!important;place-items:center!important}.stat-num{font-size:24px!important;font-weight:950!important;color:#0f172a!important}.stat-label{font-size:12px!important;color:#64748b!important}.ai-cta{border-radius:16px!important;background:linear-gradient(135deg,#635bff,#4f46e5)!important;color:#fff!important;font-size:16px!important;font-weight:950!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;min-height:66px!important;box-shadow:0 16px 30px rgba(79,70,229,.25)!important}.ai-cta small{font-size:11px!important;opacity:.85!important;margin-top:4px!important}.dashboard-grid{display:grid!important;grid-template-columns:330px minmax(620px,1fr) 360px!important;gap:18px!important;align-items:start!important}.section-card,.assistant-panel,.bottom-card{background:#fff!important;border:1px solid #dfe7f2!important;border-radius:22px!important;box-shadow:0 12px 32px rgba(15,23,42,.045)!important}.section-card{padding:16px!important}.section-title{font-size:19px!important;font-weight:950!important;color:#0f172a!important}.section-sub{font-size:12px!important;color:#64748b!important;line-height:1.55!important}.search-panel .stTextInput input{height:46px!important;border-radius:14px!important}.result-card{border-radius:16px!important;padding:12px!important;margin:9px 0!important}.schedule-panel-clean{padding:16px!important;min-height:760px!important}.schedule-toolbar{display:flex!important;justify-content:space-between!important;align-items:center!important;margin-bottom:10px!important}.mode-chip{display:inline-flex!important;align-items:center!important;margin:3px!important;padding:7px 10px!important;border-radius:999px!important;background:#eef4ff!important;border:1px solid #dbeafe!important;color:#315efb!important;font-size:12px!important;font-weight:950!important}.staging-preview{border-radius:16px!important;background:#f8fafc!important;border:1px solid #dfe7f2!important;max-height:70px!important;overflow:auto!important}.assistant-panel{padding:16px!important;position:sticky!important;top:18px!important}.assistant-course{border:1px solid #e2e8f0!important;border-radius:18px!important;background:#fff!important}.assistant-title{font-size:20px!important;color:#0f172a!important}.assistant-tag{background:#eef4ff!important;color:#4f46e5!important}.bottom-strip{display:grid!important;grid-template-columns:1fr 1fr 1fr!important;gap:16px!important;margin-top:18px!important}.bottom-card{padding:16px!important}.bottom-label{color:#64748b!important;font-size:12px!important;font-weight:900!important}.bottom-main{font-size:20px!important;font-weight:950!important;color:#0f172a!important;margin-top:6px!important}.bottom-sub{font-size:12px!important;color:#64748b!important;margin-top:4px!important}[data-testid="stSidebarCollapsedControl"]{display:block!important}@media(max-width:1180px){.dashboard-grid{grid-template-columns:1fr!important}.summary-banner{grid-template-columns:1fr 1fr!important}.ai-cta{grid-column:1/-1}.assistant-panel{position:relative!important;top:0!important}.bottom-strip{grid-template-columns:1fr!important}}@media(max-width:760px){.block-container{padding-left:.75rem!important;padding-right:.75rem!important}.summary-banner{grid-template-columns:1fr!important}.four-map{overflow-x:auto!important}.map-line{min-width:640px!important}.year-node.active .year-dot{width:112px!important}.sem-big-title{font-size:23px!important}.summary-stat{border-left:0!important;border-top:1px solid #e2e8f0!important;padding:12px 0 0 0!important}}

</style>
""".replace("__THEME_VARS__", vars_css).replace("__ACCENT_COLOR__", st.session_state.get("theme_color", "#3867f6"))
    st.markdown(css, unsafe_allow_html=True)


if "ui_theme_mode" not in st.session_state:
    st.session_state.ui_theme_mode = "淺色"
inject_css(st.session_state.ui_theme_mode)


def format_dept_name(dept_str: str) -> str:
    if not dept_str:
        return ""
    if dept_str in ["全部", "通識課程", "體育課程", "外語課程"]:
        return dept_str
    return dept_str.split(".", 1)[-1] if "." in dept_str else dept_str


def get_building_info(classroom_str: str) -> str:
    if not classroom_str or classroom_str == "未定":
        return ""
    import re
    first_room = classroom_str.split(",")[0].strip()
    match = re.match(r"([A-Za-z]+)", first_room)
    if not match:
        return ""
    buildings = {
        "B": "商管大樓", "C": "鍾靈化學館", "D": "台北校區", "E": "工學大樓", "ED": "教育館",
        "FL": "外語大樓", "G": "工學館", "H": "建築館", "HC": "教學館", "I": "覺生紀念圖書館",
        "L": "文學館", "M": "覺生綜合大樓", "O": "驚聲紀念大樓", "Q": "守謙國際會議中心",
        "R": "覺生綜合大樓", "S": "海事博物館", "SG": "紹謨體育館", "T": "驚聲紀念大樓",
        "U": "驚聲紀念大樓", "V": "傳播館", "Z": "活動中心",
    }
    return buildings.get(match.group(1).upper(), "")


def category_tag(category: str) -> str:
    text = category or "其他"
    if "必" in text:
        cls = "tag tag-req"
    elif "選" in text:
        cls = "tag tag-ele"
    elif "通" in text or "核心" in text:
        cls = "tag tag-gen"
    else:
        cls = "tag tag-other"
    return f'<span class="{cls}">{text}</span>'


def send_otp_email(student_id: str) -> tuple[bool, str]:
    try:
        res = requests.post(f"{API_BASE_URL}/auth/send-otp", json={"student_id": student_id}, timeout=8)
        if res.status_code == 200:
            data = res.json()
            if "otp" in data:
                st.session_state.reset_otp = data.get("otp")
            if "dev_otp" in data:
                st.session_state.reset_otp = data.get("dev_otp")
            return True, data.get("message", "驗證碼已發送")
        return False, res.json().get("detail", "發送失敗")
    except Exception as e:
        return False, f"無法連線至 API 伺服器：{e}"


def auto_save() -> None:
    if st.session_state.get("student") and st.session_state.get("scheduler"):
        Storage.save_data(
            st.session_state.student.student_id,
            st.session_state.scheduler.planned_schedule,
            st.session_state.scheduler.staging_area,
            st.session_state.get("student_pwd"),
        )
        try:
            CourseCatalog.sync_demand(st.session_state.student.student_id, st.session_state.scheduler.planned_schedule)
        except Exception as e:
            print(f"[API] 預排熱度同步失敗：{e}")


def generate_ics(scheduler: CourseScheduler, current_student: Student) -> bytes:
    ics_content = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//TKU Course Scheduler//TW"]
    day_map = {1: "MO", 2: "TU", 3: "WE", 4: "TH", 5: "FR", 6: "SA", 7: "SU"}
    time_map = {
        1: ("081000", "090000"), 2: ("091000", "100000"), 3: ("101000", "110000"),
        4: ("111000", "120000"), 5: ("121000", "130000"), 6: ("131000", "140000"),
        7: ("141000", "150000"), 8: ("151000", "160000"), 9: ("161000", "170000"),
        10: ("171000", "180000"), 11: ("181000", "190000"), 12: ("191000", "200000"),
        13: ("201000", "210000"), 14: ("211000", "220000"),
    }
    grade_offset = {"大一": 0, "大二": 1, "大三": 2, "大四": 3, "大五": 4, "大六": 5, "大七": 6}
    for sem, courses in scheduler.planned_schedule.items():
        sem_name, term = sem[:2], sem[2:]
        start_year = current_student.admission_year + 1911 + grade_offset.get(sem_name, 0)
        if "上" in term:
            base_date = date(start_year, 9, 8)
            while base_date.weekday() != 0:
                base_date += timedelta(days=1)
        elif "下" in term:
            base_date = date(start_year + 1, 2, 16)
            while base_date.weekday() != 0:
                base_date += timedelta(days=1)
        else:
            base_date = date(start_year, 7, 1)
        for c in courses:
            for slot in c.time_slots:
                d, start_p, end_p = slot
                if start_p not in time_map or end_p not in time_map:
                    continue
                dt_str = (base_date + timedelta(days=d - 1)).strftime("%Y%m%d")
                location = c.classroom or "未定"
                building = get_building_info(location)
                if building:
                    location = f"{location} ({building})"
                ics_content.extend([
                    "BEGIN:VEVENT",
                    f"SUMMARY:{c.name}",
                    f"LOCATION:{location}",
                    f"DTSTART;TZID=Asia/Taipei:{dt_str}T{time_map[start_p][0]}",
                    f"DTEND;TZID=Asia/Taipei:{dt_str}T{time_map[end_p][1]}",
                    f"RRULE:FREQ=WEEKLY;COUNT=18;BYDAY={day_map.get(d, 'MO')}",
                    "END:VEVENT",
                ])
    ics_content.append("END:VCALENDAR")
    return "\n".join(ics_content).encode("utf-8")


def render_login() -> None:
    st.markdown(
        """
        <div class="app-topbar" style="max-width:1100px;margin:42px auto 24px auto;">
          <div class="brand-wrap">
            <div class="brand-logo">🎓</div>
            <div><div class="brand-title">淡江大學四年課程規劃系統</div><div class="brand-sub">課程搜尋・暫存排課・學分追蹤</div></div>
          </div>
          <div class="top-badge">Python / Streamlit</div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    left, mid, right = st.columns([1, 1.15, 1])
    with mid:
        st.markdown('<div class="section-card">', unsafe_allow_html=True)
        tab_stu, tab_adm = st.tabs(["學生登入", "管理員入口"])
        with tab_stu:
            with st.form("student_login_form"):
                student_id_input = st.text_input("學號（9碼）", max_chars=9, placeholder="例：414730209")
                password_input = st.text_input("密碼", type="password", placeholder="首次登入會自動建立密碼")
                submitted = st.form_submit_button("登入系統", type="primary", use_container_width=True)
            if submitted:
                if not student_id_input or not password_input:
                    st.warning("請輸入學號與密碼。")
                else:
                    student = Student(student_id_input)
                    if not student.is_valid:
                        st.error("學號格式錯誤或檢查碼驗證失敗。")
                    else:
                        ok, msg = Storage.authenticate(student_id_input, password_input)
                        if ok:
                            st.session_state.student = student
                            st.session_state.student_pwd = password_input
                            st.session_state.save_local_storage = True
                            if msg in ["註冊成功", "密碼已更新"]:
                                st.session_state.needs_initial_save = True
                            st.rerun()
                        else:
                            st.error(msg)
            with st.expander("忘記密碼"):
                forgot_uid = st.text_input("學號", max_chars=9, key="forgot_uid_input")
                if st.button("發送驗證碼", use_container_width=True):
                    if not forgot_uid or len(forgot_uid) != 9:
                        st.warning("請輸入正確 9 碼學號。")
                    else:
                        ok, msg = send_otp_email(forgot_uid)
                        if ok:
                            st.session_state.reset_uid = forgot_uid
                            st.success(msg)
                        else:
                            st.error(msg)
                if st.session_state.get("reset_uid"):
                    otp = st.text_input("驗證碼", max_chars=6, key="reset_otp_input")
                    new_pwd = st.text_input("新密碼", type="password", key="reset_new_pwd")
                    if st.button("確認重設密碼", type="primary", use_container_width=True):
                        if not new_pwd:
                            st.warning("請輸入新密碼。")
                        else:
                            ok, msg = Storage.reset_password(st.session_state.reset_uid, otp, new_pwd)
                            if ok:
                                st.success("密碼已重設，請重新登入。")
                                st.session_state.pop("reset_uid", None)
                                st.session_state.pop("reset_otp", None)
                            else:
                                st.error(msg)
        with tab_adm:
            with st.form("admin_login_form"):
                admin_pw = st.text_input("管理員密碼", type="password")
                if st.form_submit_button("進入後台", type="primary", use_container_width=True):
                    expected_pw = st.secrets.get("ADMIN_PASSWORD", "kobe1522")
                    if admin_pw == expected_pw:
                        st.session_state.is_admin = True
                        st.rerun()
                    else:
                        st.error("密碼錯誤。")
        st.markdown('</div>', unsafe_allow_html=True)
    st.stop()


if "student" not in st.session_state:
    st.session_state.student = None
if "is_admin" not in st.session_state:
    st.session_state.is_admin = False

if st.session_state.student is None and not st.session_state.is_admin:
    render_login()


# ---------- admin ----------
if st.session_state.is_admin:
    st.title("管理後台")
    if st.sidebar.button("登出管理員", use_container_width=True):
        st.session_state.is_admin = False
        st.rerun()
    tab_db, tab_grad, tab_prog, tab_users = st.tabs(["資料庫同步", "畢業門檻", "學程", "使用者"])
    with tab_db:
        folder_map = CourseCatalog.get_course_folders(str(RAW_DATA_DIR))
        st.info(f"資料庫目前共有 {CourseCatalog.get_total_count()} 門課程，偵測到 {len(folder_map)} 個資料夾。")
        if st.button("掃描並同步課程資料", type="primary"):
            n_files, n_courses = CourseCatalog.sync_all_folders(folder_map)
            st.success(f"同步完成：{n_files} 個檔案，{n_courses} 門課程。")
    with tab_grad:
        c1, c2 = st.columns(2)
        with c1:
            edit_dept = st.selectbox("科系", ["ALL"] + list(DEPT_MAP.keys()), format_func=lambda x: "全校預設" if x == "ALL" else f"{DEPT_MAP.get(x, x)} ({x})")
        with c2:
            edit_year = st.number_input("入學年度（0=預設）", min_value=0, max_value=200, value=0)
        current_rule = CourseCatalog.get_graduation_req(edit_dept, int(edit_year))
        rule_text = st.text_area("JSON 規則", value=json.dumps(current_rule, indent=4, ensure_ascii=False), height=360)
        if st.button("儲存畢業規則", type="primary"):
            try:
                CourseCatalog.set_graduation_req(edit_dept, int(edit_year), json.loads(rule_text))
                st.success("已儲存。")
            except Exception as e:
                st.error(f"JSON 格式錯誤：{e}")
    with tab_prog:
        st.caption('設定學程規則。格式支援 {"核心課程": {"target": 6, "courses": ["課程A", "課程B"]}}。')
        prog_name = st.text_input("學程名稱", placeholder="例：人工智慧應用微學程")
        prog_dept = st.selectbox("適用科系", ["ALL"] + list(DEPT_MAP.keys()), format_func=lambda x: "全校適用" if x == "ALL" else f"{DEPT_MAP.get(x, x)} ({x})", key="admin_prog_dept")
        if prog_name:
            current_prog_rule = CourseCatalog.get_program_req(prog_name, prog_dept)
        else:
            current_prog_rule = {"核心課程": {"target": 6, "courses": []}, "選修課程": {"target": 6, "courses": []}}
        prog_rule_text = st.text_area("學程 JSON 規則", value=json.dumps(current_prog_rule or {"核心課程": {"target": 6, "courses": []}, "選修課程": {"target": 6, "courses": []}}, indent=4, ensure_ascii=False), height=300)
        c_save, c_delete = st.columns(2)
        with c_save:
            if st.button("儲存學程規則", type="primary", use_container_width=True):
                if not prog_name.strip():
                    st.warning("請先輸入學程名稱。")
                else:
                    try:
                        CourseCatalog.set_program_req(prog_name.strip(), prog_dept, json.loads(prog_rule_text))
                        st.success("學程規則已儲存。")
                    except Exception as e:
                        st.error(f"JSON 格式錯誤：{e}")
        with c_delete:
            if st.button("刪除此學程規則", use_container_width=True):
                if prog_name.strip():
                    CourseCatalog.delete_program(prog_name.strip(), prog_dept)
                    st.success("已刪除。")
                else:
                    st.warning("請先輸入學程名稱。")
    with tab_users:
        with st.form("admin_reset_password_form"):
            reset_uid = st.text_input("學號", max_chars=9)
            reset_pwd = st.text_input("新密碼")
            if st.form_submit_button("重設密碼", type="primary"):
                ok, msg = Storage.reset_password(reset_uid, "", reset_pwd)
                st.success(msg) if ok else st.error(msg)
    st.stop()


# ---------- main state ----------
student: Student = st.session_state.student
if st.session_state.get("save_local_storage"):
    uid = student.student_id
    pwd = st.session_state.get("student_pwd", "")
    st.components.v1.html(f"""<script>window.parent.localStorage.setItem('tku_auth_uid','{uid}');window.parent.localStorage.setItem('tku_auth_pwd','{pwd}');</script>""", height=0)
    st.session_state.save_local_storage = False

folder_map = CourseCatalog.get_course_folders(str(RAW_DATA_DIR))
try:
    CourseCatalog.migrate_default_rules()
    if CourseCatalog.get_total_count() == 0:
        CourseCatalog.sync_all_folders(folder_map)
except Exception as e:
    st.sidebar.warning(f"資料庫初始化提醒：{e}")

if "scheduler" not in st.session_state:
    st.session_state.scheduler = CourseScheduler()
    existing = Storage.load_data(student.student_id)
    if existing:
        st.session_state.scheduler.load_existing_data(existing)
    if st.session_state.get("needs_initial_save", False):
        auto_save()
        st.session_state.needs_initial_save = False
scheduler: CourseScheduler = st.session_state.scheduler

for k, v in {
    "theme_color": "#3867f6",
    "show_weekends": False,
    "show_evening": False,
    "class_time_mode": "日間",
    "bg_image": None,
    "bg_opacity": 0.9,
}.items():
    if k not in st.session_state:
        st.session_state[k] = v

# dnd actions
_dnd = st.session_state.get("main_dnd_board")
if _dnd and st.session_state.get("last_dnd_action_main") != _dnd:
    st.session_state["last_dnd_action_main"] = _dnd
    action = _dnd.get("action")
    if action == "move":
        ok, msg = scheduler.move_course(_dnd["serial"], _dnd["source"], _dnd["target"])
        if ok:
            auto_save()
            if "⚠️" in msg:
                st.toast(msg, icon="⚠️")
        else:
            st.toast(f"移動失敗：{msg}", icon="🚨")
    elif action == "trash":
        source, serial = _dnd.get("source"), _dnd.get("serial")
        if source == "staging":
            scheduler.staging_area = [c for c in scheduler.staging_area if c.serial != serial]
        elif source in scheduler.planned_schedule:
            scheduler.planned_schedule[source] = [c for c in scheduler.planned_schedule[source] if c.serial != serial]
        auto_save()
    elif action == "clear_semester":
        sem = _dnd.get("semester")
        if sem in scheduler.planned_schedule:
            for c in scheduler.planned_schedule[sem]:
                if not any(s.serial == c.serial for s in scheduler.staging_area):
                    scheduler.staging_area.append(c)
            scheduler.planned_schedule[sem] = []
            auto_save()
    elif action == "toggle_status":
        scheduler.toggle_course_status(_dnd.get("semester"), _dnd.get("serial"))
        auto_save()
    elif action == "search_empty":
        day_map = {1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六", 7: "日"}
        st.session_state.search_weekday = day_map.get(_dnd.get("weekday"), "全部")
        st.session_state.search_period = str(_dnd.get("period"))
        st.toast(f"已帶入空堂條件：星期{st.session_state.search_weekday} 第{st.session_state.search_period}節", icon="🎯")


def build_schedule_rows() -> list[dict]:
    rows = []
    for sem in scheduler.SEMESTER_ORDER:
        for c in scheduler.planned_schedule.get(sem, []):
            rows.append({
                "學期": sem,
                "代碼": c.code,
                "課名": c.name,
                "學分": c.credits,
                "必選修": c.category,
                "老師": c.teacher,
                "時間": c.time_info,
                "教室": c.classroom,
                "狀態": getattr(c, "status", "planned"),
            })
    return rows


def get_semester_load_level(credits: int, conflicts_count: int) -> tuple[str, str]:
    if conflicts_count > 0 or credits > 25:
        return "danger", "高風險"
    if credits < 9 or credits > 22:
        return "warn", "需留意"
    return "", "正常"


def build_four_year_plan_html() -> str:
    cards = []
    for sem in scheduler.SEMESTER_ORDER[:8]:
        count, credits, conflict_count = scheduler.get_semester_stats(sem)
        level, label = get_semester_load_level(credits, conflict_count)
        course_list = scheduler.planned_schedule.get(sem, [])
        names = "、".join([c.name for c in course_list[:3]]) or "尚未排課"
        if len(course_list) > 3:
            names += "…"
        cards.append(
            f'<div class="sem-node {level}">'
            f'<div class="sem-node-title">{sem}</div>'
            f'<div class="sem-node-meta">{count} 門｜{credits} 學分｜{label}</div>'
            f'<div class="sem-node-meta">{names}</div>'
            '</div>'
        )
    return '<div class="semester-map">' + ''.join(cards) + '</div>'


def generate_schedule_html_export() -> str:
    accent = st.session_state.get("theme_color", "#3867f6")
    rows = build_schedule_rows()
    row_html = "".join([
        f"<tr><td>{r['學期']}</td><td>{r['課名']}</td><td>{r['學分']}</td><td>{r['老師']}</td><td>{r['時間']}</td><td>{r['教室']}</td><td>{r['狀態']}</td></tr>"
        for r in rows
    ])
    return f'''<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>淡江四年課表</title><style>body{{font-family:-apple-system,BlinkMacSystemFont,"Noto Sans TC",sans-serif;background:#f6f8fc;color:#0f172a;padding:24px}}.wrap{{max-width:1100px;margin:auto;background:white;border-radius:24px;padding:24px;box-shadow:0 18px 45px rgba(15,23,42,.08)}}h1{{color:{accent}}}table{{width:100%;border-collapse:collapse}}th,td{{border-bottom:1px solid #e2e8f0;padding:10px;text-align:left;font-size:14px}}th{{background:#f8fafc}}.meta{{color:#64748b;margin-bottom:18px}}@media(max-width:720px){{body{{padding:10px}}.wrap{{padding:16px;border-radius:18px}}table{{font-size:12px}}th,td{{padding:8px 6px}}}}</style></head><body><div class="wrap"><h1>淡江四年課表</h1><div class="meta">{student.department_name}｜{student.student_id}｜共 {len(rows)} 門課</div><table><thead><tr><th>學期</th><th>課名</th><th>學分</th><th>老師</th><th>時間</th><th>教室</th><th>狀態</th></tr></thead><tbody>{row_html}</tbody></table></div></body></html>'''


def generate_mobile_widget_html() -> str:
    rows = build_schedule_rows()
    next_course = rows[0] if rows else {"課名": "尚未排課", "時間": "-", "教室": "-", "老師": "-"}
    total_credits = sum(int(r.get("學分", 0) or 0) for r in rows)
    accent = st.session_state.get("theme_color", "#3867f6")
    return f'''<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TKU 課表小工具</title><style>body{{margin:0;padding:18px;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,"Noto Sans TC",sans-serif}}.widget{{max-width:360px;margin:auto;border-radius:28px;background:linear-gradient(180deg,#ffffff,#f8fafc);padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.25)}}.label{{font-size:13px;color:#64748b;font-weight:800}}.title{{font-size:26px;font-weight:950;color:#0f172a;margin:10px 0}}.accent{{color:{accent}}}.sub{{font-size:14px;color:#64748b;line-height:1.7}}.row{{display:flex;justify-content:space-between;border-top:1px solid #e2e8f0;margin-top:14px;padding-top:12px;font-size:14px}}</style></head><body><div class="widget"><div class="label">下一堂課</div><div class="title accent">{next_course['課名']}</div><div class="sub">{next_course['時間']}｜{next_course['教室']}｜{next_course['老師']}</div><div class="row"><b>四年規劃</b><span>{len(rows)} 門 / {total_credits} 學分</span></div></div></body></html>'''


def render_four_year_map() -> None:
    st.markdown('<div class="section-card">', unsafe_allow_html=True)
    st.markdown('<div class="section-title">四年規劃地圖</div><div class="section-sub">每一格代表一個學期；橘色代表學分偏低或偏高，紅色代表有衝堂或負荷過高。</div>', unsafe_allow_html=True)
    st.markdown(build_four_year_plan_html(), unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)


def render_program_credit_checker() -> None:
    program_names = CourseCatalog.get_all_program_names()
    st.markdown('<div class="section-card">', unsafe_allow_html=True)
    st.markdown('<div class="section-title">學程學分檢查</div><div class="section-sub">選擇已設定的學程後，系統會用目前四年規劃比對學程門檻。</div>', unsafe_allow_html=True)
    if not program_names:
        st.info("目前尚未建立學程規則。可由管理後台新增，或先使用畢業學分檢查。")
    else:
        selected_program = st.selectbox("選擇學程", program_names, key="selected_program_credit")
        prog_req = CourseCatalog.get_program_req(selected_program, student.department_code)
        if not prog_req:
            st.warning("此學程尚未針對你的科系或全校設定規則。")
        else:
            prog_report = scheduler.check_graduation_status(prog_req)
            table_rows = []
            for key, data in prog_report.items():
                if isinstance(data, dict) and data.get("target", 0):
                    table_rows.append({"項目": key, "已通過": data.get("passed", 0), "已規劃": data.get("planned", 0), "需求": data.get("target", 0), "狀態": "完成" if data.get("is_met") else "未完成"})
            if table_rows:
                st.dataframe(pd.DataFrame(table_rows), use_container_width=True, hide_index=True)
            else:
                st.info("此學程規則沒有可分析的學分項目。")
    st.markdown('</div>', unsafe_allow_html=True)


def render_mobile_tools_page() -> None:
    render_topbar()
    st.markdown('<div class="section-card">', unsafe_allow_html=True)
    st.markdown('<div class="section-title">手機使用與桌面小工具</div><div class="section-sub">手機版保留最常用資訊：下一堂課、今日課表、四年學分進度。可先下載 HTML 小工具作為雛形，後續再接原生 Android / iOS Widget。</div>', unsafe_allow_html=True)
    rows = build_schedule_rows()
    next_course = rows[0] if rows else {"課名": "尚未排課", "時間": "-", "教室": "-", "老師": "-"}
    total_credits = sum(int(r.get("學分", 0) or 0) for r in rows)
    c1, c2 = st.columns([.55, .45], gap="large")
    with c1:
        st.markdown(f'<div class="mobile-widget"><div class="widget-title">下一堂課</div><div class="widget-main">{next_course["課名"]}</div><div class="widget-sub">{next_course["時間"]}｜{next_course["教室"]}｜{next_course["老師"]}</div><div class="widget-row"><span>四年規劃</span><b>{len(rows)} 門 / {total_credits} 學分</b></div></div>', unsafe_allow_html=True)
        st.download_button("下載手機小工具 HTML", data=generate_mobile_widget_html(), file_name="tku_mobile_widget.html", mime="text/html", use_container_width=True)
    with c2:
        st.markdown('''
        **手機使用重點**

        - 手機版優先使用首頁、搜尋、課表、學分檢查。
        - 可透過瀏覽器「加入主畫面」接近 App 使用。
        - 桌面小工具目前提供 HTML 雛形，正式版可再做成 PWA Widget 或原生 App Widget。
        ''')
    st.markdown('</div>', unsafe_allow_html=True)

# navigation state
if 'menu_open' not in st.session_state:
    st.session_state.menu_open = False
if 'active_page' not in st.session_state:
    st.session_state.active_page = '我的規劃'

# calculations
req = CourseCatalog.get_graduation_req(student.department_code, student.admission_year)
report = scheduler.check_graduation_status(req)
conflicts = sum(scheduler.get_semester_stats(sem)[2] for sem in scheduler.SEMESTER_ORDER)


def progress_card(title: str, key: str, fallback_target: int = 0, warn: bool = False) -> str:
    data = report.get(key, {"passed": 0, "planned": 0, "target": fallback_target})
    passed = data.get("passed", 0) or 0
    planned = data.get("planned", 0) or 0
    target = data.get("target", fallback_target) or fallback_target
    current = passed + planned
    if target > 0:
        pass_pct = min(passed / target * 100, 100)
        plan_pct = min(planned / target * 100, max(0, 100 - pass_pct))
        pct = min(current / target * 100, 999)
        value = f"{current} / {target} 學分"
        remain = max(0, target - current)
    else:
        base = max(current, 1)
        pass_pct = passed / base * 100
        plan_pct = planned / base * 100
        pct = 100 if current else 0
        value = f"{current} 學分"
        remain = 0
    cls = "progress-pct warn" if warn else "progress-pct"
    return f"""
    <div class="progress-card">
      <div class="progress-head"><div class="progress-name">{title}</div><div class="{cls}">{pct:.1f}%</div></div>
      <div class="progress-value">{value}</div>
      <div class="progress-track"><div class="bar-pass" style="width:{pass_pct:.1f}%"></div><div class="bar-plan" style="width:{plan_pct:.1f}%"></div></div>
      <div class="legend"><span><i class="dot g"></i>已通過 {passed}</span><span><i class="dot b"></i>已排入 {planned}</span><span><i class="dot gray"></i>尚未完成 {remain}</span></div>
    </div>
    """


def set_page(page: str) -> None:
    st.session_state.active_page = page
    st.session_state.menu_open = False
    st.rerun()


def render_hamburger_drawer() -> None:
    if not st.session_state.get("menu_open", False):
        return
    st.markdown('<div class="drawer-card">', unsafe_allow_html=True)
    st.markdown(
        f"""
        <div class="drawer-brand">UniPlan 智慧排課</div>
        <div class="drawer-sub">{student.student_id}｜{student.department_name}<br>{student.identity}｜{student.admission_year} 學年度入學</div>
        <div class="drawer-section">主要功能</div>
        """,
        unsafe_allow_html=True,
    )
    nav_items = [
        ("我的規劃", "🗓️ 我的規劃"),
        ("課程搜尋", "🔍 課程搜尋"),
        ("一鍵排課", "✨ 一鍵排課"),
        ("四年總覽", "🧭 四年總覽"),
        ("學分進度", "📊 學分進度"),
        ("手機工具", "📱 手機工具"),
        ("設定", "⚙️ 設定"),
    ]
    for page, label in nav_items:
        btn_type = "primary" if st.session_state.get("active_page") == page else "secondary"
        if st.button(label, key=f"drawer_nav_{page}", use_container_width=True, type=btn_type):
            set_page(page)
    st.markdown('<div class="drawer-section">快速操作</div>', unsafe_allow_html=True)
    if st.button("💾 儲存目前進度", key="drawer_save", use_container_width=True):
        auto_save()
        st.toast("已儲存", icon="✅")
    if st.button("↩️ 收合選單", key="drawer_close", use_container_width=True):
        st.session_state.menu_open = False
        st.rerun()
    st.markdown('<div class="drawer-small">提示：排課主畫面以中間課表為主；搜尋與課程資訊只保留在左右兩側。</div>', unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)


def render_topbar() -> None:
    total_credits = sum(int(getattr(c, "credits", 0) or 0) for courses in scheduler.planned_schedule.values() for c in courses)
    target = report.get("總計", {}).get("target", 128) or 128
    pct = min(999, total_credits / target * 100) if target else 0
    active_page_name = st.session_state.get("active_page", "我的規劃")

    c_title, c_search, c_actions = st.columns([0.52, 0.30, 0.18], gap="medium")
    with c_title:
        st.markdown(
            f'<div class="header-title">我的四年地圖</div><div class="header-sub">{active_page_name}｜已規劃 {total_credits} / {target} 學分，完成度 {pct:.0f}%</div>',
            unsafe_allow_html=True,
        )
    with c_search:
        q = st.text_input("全站搜尋", value=st.session_state.get("global_search_kw", ""), placeholder="搜尋課程、教師、代碼", label_visibility="collapsed", key="topbar_global_search")
        if q and q != st.session_state.get("global_search_kw"):
            st.session_state.global_search_kw = q
    with c_actions:
        a1, a2, a3 = st.columns([.8, .8, 1.4], gap="small")
        with a1:
            if st.button("🔔", key="notice_toggle", help="通知"):
                st.session_state.show_notice_panel = not st.session_state.get("show_notice_panel", False)
                st.session_state.show_help_panel = False
                st.rerun()
        with a2:
            if st.button("?", key="help_toggle", help="說明"):
                st.session_state.show_help_panel = not st.session_state.get("show_help_panel", False)
                st.session_state.show_notice_panel = False
                st.rerun()
        with a3:
            st.markdown(f'<div class="user-pill">{student.identity} ▾</div>', unsafe_allow_html=True)

    if st.session_state.get("show_notice_panel", False):
        st.markdown(
            f"""
            <div class="section-card" style="margin-bottom:14px!important">
              <div class="section-title">通知中心</div>
              <div class="section-sub">目前 {conflicts} 組衝堂；四年規劃已排入 {total_credits} 學分。</div>
            </div>
            """,
            unsafe_allow_html=True,
        )
    if st.session_state.get("show_help_panel", False):
        st.markdown(
            """
            <div class="section-card" style="margin-bottom:14px!important">
              <div class="section-title">快速說明</div>
              <div class="section-sub">搜尋課程加入候選，再拖進中間課表；日間 / 夜間可在課表工具列切換。</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    if st.session_state.get("global_search_kw") and st.session_state.get("active_page") != "課程搜尋":
        st.session_state.search_kw = st.session_state.global_search_kw

    active_year = st.session_state.get("schedule_year_tab", "大二")
    years = ["大一", "大二", "大三", "大四"]
    nodes = []
    for y in years:
        idx = years.index(y)
        active_idx = years.index(active_year) if active_year in years else 1
        cls = "year-node active" if y == active_year else ("year-node done" if idx < active_idx else "year-node")
        meta = "進行中" if y == active_year else ("已完成" if idx < active_idx else "規劃中")
        sems = scheduler.SEMESTER_ORDER[idx*2:idx*2+2]
        y_credits = sum(sum(int(getattr(c, "credits", 0) or 0) for c in scheduler.planned_schedule.get(sem, [])) for sem in sems)
        nodes.append(f'<div class="{cls}"><div class="year-dot">{y}</div><div class="year-name">{y}</div><div class="year-meta">{meta}｜{y_credits} 學分</div></div>')
    st.markdown(f'<div class="four-map"><div class="map-line">{"".join(nodes)}</div></div>', unsafe_allow_html=True)

def render_progress_overview() -> None:
    pc1, pc2, pc3, pc4 = st.columns([1, 1, 1, .55], gap="medium")
    with pc1:
        st.markdown(progress_card("總畢業學分進度", "總計", 128), unsafe_allow_html=True)
    with pc2:
        st.markdown(progress_card("系必修進度", "系必修", 60), unsafe_allow_html=True)
    with pc3:
        st.markdown(progress_card("通識與共同科目", "外國語文", 8, warn=True), unsafe_allow_html=True)
    with pc4:
        conflict_color = "var(--red)" if conflicts else "var(--ink)"
        st.markdown(
            f"""
            <div class="progress-card">
              <div class="progress-name">課程衝堂</div>
              <div class="progress-value" style="color:{conflict_color}">{conflicts} 組</div>
              <div class="hint-box">衝堂會在拖曳排課時即時提醒。</div>
            </div>
            """,
            unsafe_allow_html=True,
        )




def render_quick_summary() -> None:
    total_courses = sum(len(v) for v in scheduler.planned_schedule.values())
    total_credits = sum(int(getattr(c, "credits", 0) or 0) for courses in scheduler.planned_schedule.values() for c in courses)
    used_semesters = len([1 for v in scheduler.planned_schedule.values() if v])
    target = report.get("總計", {}).get("target", 128) or 128
    remaining = max(0, target - total_credits)
    conflict_class = "quick-bad" if conflicts else "quick-good"
    remain_class = "quick-good" if remaining == 0 else "quick-warn"
    st.markdown(
        f"""
        <div class="quick-grid">
          <div class="quick-card"><div class="quick-label">已規劃課程</div><div class="quick-value">{total_courses}</div><div class="quick-note">分布於 {used_semesters} 個學期</div></div>
          <div class="quick-card"><div class="quick-label">四年規劃學分</div><div class="quick-value">{total_credits}</div><div class="quick-note">目標 {target} 學分</div></div>
          <div class="quick-card"><div class="quick-label">剩餘學分</div><div class="quick-value {remain_class}">{remaining}</div><div class="quick-note">依目前畢業規則估算</div></div>
          <div class="quick-card"><div class="quick-label">衝堂狀態</div><div class="quick-value {conflict_class}">{conflicts}</div><div class="quick-note">拖曳調整後即時更新</div></div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_usage_steps() -> None:
    st.markdown(
        """
        <div class="section-card compact">
          <div class="section-title">建議操作順序</div>
          <div class="section-sub">讓第一次使用的人不用研究功能，只照三步完成四年課表。</div>
          <div class="step-strip">
            <div class="step-item"><b><span class="step-num">1</span>搜尋並收藏</b>先找必修、通識、想修課，加入暫存區。</div>
            <div class="step-item"><b><span class="step-num">2</span>拖曳或一鍵排入</b>把暫存課程放進大一上到大四下。</div>
            <div class="step-item"><b><span class="step-num">3</span>檢查與匯出</b>確認衝堂、學分、學程需求，再匯出課表。</div>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

def get_syllabus_url(course) -> str | None:
    sem_code = "".join(filter(str.isdigit, getattr(course, "semester_source", "") or ""))
    serial = getattr(course, "serial", "") or ""
    if len(sem_code) >= 3 and serial and not serial.startswith("CUST"):
        y, term = sem_code[:-1], sem_code[-1]
        return f"https://webp1.emis.tku.edu.tw/{y}_{term}/{y}_{term}_{serial}.PDF"
    return None


def render_course_detail(course, compact: bool = False) -> None:
    """搜尋結果內嵌課程詳情，保留課程資訊、教學計畫表與評論功能。"""
    url = get_syllabus_url(course)
    with st.expander("課程詳細資訊 / 課綱 / 評論", expanded=False):
        d1, d2, d3 = st.columns(3)
        d1.metric("學分", course.credits)
        d2.metric("必選修", course.category or "未標示")
        d3.metric("年級", course.grade or "未標示")
        st.markdown(
            f"""
            **課程代碼**：{course.code or '-'}  
            **流水號**：{course.serial or '-'}  
            **教師**：{course.teacher or '未定'}  
            **時間**：{course.time_info or '未定'}  
            **教室**：{course.classroom or '未定'} {get_building_info(course.classroom)}  
            **開課單位**：{format_dept_name(course.department)}  
            **備註**：{course.notes or '無'}
            """
        )
        if url:
            st.link_button("開啟教學計畫表 / 課綱 PDF", url, use_container_width=True)
        else:
            st.info("此課程目前沒有可判讀的教學計畫表連結。")

        reviews = CourseCatalog.get_reviews(course.code)
        if reviews:
            st.markdown("**學生評論**")
            for r in reviews[:5]:
                stars = "★" * int(r.get("rating", 5) or 5)
                tags = r.get("tags", "") or ""
                st.markdown(f"- {stars}　{tags}  \n  {r.get('content','')}  \n  <small>{r.get('user','匿名')}｜{r.get('time','')}</small>", unsafe_allow_html=True)
        else:
            st.caption("目前尚無評論。")

        with st.form(f"review_form_{course.semester_source}_{course.serial}_{course.code}", clear_on_submit=True):
            st.markdown("**新增評論**")
            rating = st.slider("推薦星數", 1, 5, 5, key=f"rating_{course.semester_source}_{course.serial}_{course.code}")
            tags = st.text_input("標籤", placeholder="例：作業少、考試難、老師清楚", key=f"tags_{course.semester_source}_{course.serial}_{course.code}")
            content = st.text_area("評論內容", height=90, key=f"content_{course.semester_source}_{course.serial}_{course.code}")
            if st.form_submit_button("送出評論"):
                if content.strip():
                    CourseCatalog.add_review(course.code, student.student_id, content.strip(), rating, tags.strip())
                    st.success("評論已送出。")
                else:
                    st.warning("請先輸入評論內容。")

# search state
if "search_weekday" not in st.session_state:
    st.session_state.search_weekday = "全部"
if "search_period" not in st.session_state:
    st.session_state.search_period = "全部"
if "catalog" not in st.session_state:
    st.session_state.catalog = []
if "search_has_run" not in st.session_state:
    st.session_state.search_has_run = False
if "active_sems" not in st.session_state:
    st.session_state.active_sems = scheduler.SEMESTER_ORDER[:2] if len(scheduler.SEMESTER_ORDER) >= 2 else scheduler.SEMESTER_ORDER[:1]

# 使用者偏好與輕量功能狀態；僅存在 session，不破壞原有資料格式。
for _k, _v in {
    "favorites": [],
    "avoid_teachers": "",
    "avoid_weekdays": [],
    "avoid_periods": [],
    "compare_courses": [],
    "saved_plan_snapshots": {},
    "auto_plan_results": [],
    "quick_mode": "平衡模式",
    "class_time_mode": "日間",
    "global_search_kw": "",
    "show_help_panel": False,
    "show_notice_panel": False,
}.items():
    if _k not in st.session_state:
        st.session_state[_k] = _v



def course_uid(course) -> str:
    return f"{getattr(course, 'semester_source', '')}:{getattr(course, 'serial', '')}:{getattr(course, 'code', '')}"


def course_max_period(course) -> int:
    slots = getattr(course, "time_slots", []) or []
    max_p = 0
    for slot in slots:
        try:
            if len(slot) >= 3:
                max_p = max(max_p, int(slot[2]))
            elif len(slot) >= 2:
                max_p = max(max_p, int(slot[1]))
        except Exception:
            continue
    return max_p


def course_matches_class_time_mode(course, mode: str) -> bool:
    """日間/夜間搜尋過濾。夜間以第 11 節以後視為夜間課。"""
    max_p = course_max_period(course)
    if mode == "日間":
        return max_p == 0 or max_p <= 10
    if mode == "夜間":
        return max_p >= 11
    return True


def filter_courses_by_class_time(courses: list, mode: str) -> list:
    return [c for c in courses if course_matches_class_time_mode(c, mode)]


def all_planned_courses() -> list:
    return [c for courses in scheduler.planned_schedule.values() for c in courses]


def is_course_favorite(course) -> bool:
    return course_uid(course) in st.session_state.get("favorites", [])


def toggle_favorite(course) -> None:
    uid = course_uid(course)
    favs = list(st.session_state.get("favorites", []))
    if uid in favs:
        favs.remove(uid)
    else:
        favs.append(uid)
    st.session_state.favorites = favs


def favorite_courses_from_sources() -> list:
    fav_uids = set(st.session_state.get("favorites", []))
    pool = []
    pool.extend(st.session_state.get("catalog", []))
    pool.extend(scheduler.staging_area)
    pool.extend(all_planned_courses())
    seen = set()
    out = []
    for c in pool:
        uid = course_uid(c)
        if uid in fav_uids and uid not in seen:
            out.append(c)
            seen.add(uid)
    return out


def course_matches_avoid(course) -> list[str]:
    reasons = []
    avoid_teachers = [x.strip() for x in st.session_state.get("avoid_teachers", "").replace("，", ",").split(",") if x.strip()]
    if avoid_teachers and any(t in getattr(course, "teacher", "") for t in avoid_teachers):
        reasons.append("避開教師")
    weekday_map = {"一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "日": 7}
    avoid_days = {weekday_map.get(x) for x in st.session_state.get("avoid_weekdays", [])}
    avoid_days.discard(None)
    avoid_periods = {int(x) for x in st.session_state.get("avoid_periods", []) if str(x).isdigit()}
    for d, start, end in getattr(course, "time_slots", []) or []:
        if d in avoid_days:
            reasons.append("避開星期")
            break
        if avoid_periods and any(start <= p <= end for p in avoid_periods):
            reasons.append("避開節次")
            break
    return sorted(set(reasons))


def semester_credit(sem: str) -> int:
    return sum(int(getattr(c, "credits", 0) or 0) for c in scheduler.planned_schedule.get(sem, []))


def course_load_score(course) -> int:
    # 沒有真實作業量資料時，用學分、時段、早八、評論作保守估算。
    credits = int(getattr(course, "credits", 0) or 0)
    slots = getattr(course, "time_slots", []) or []
    early = sum(1 for _, s0, _ in slots if s0 <= 2)
    evening = sum(1 for _, s0, _ in slots if s0 >= 11)
    return credits * 2 + len(slots) + early * 2 + evening


def summarize_plan(plan: dict) -> dict:
    courses = [c for sem_courses in plan.values() for c in sem_courses]
    credits = sum(int(getattr(c, "credits", 0) or 0) for c in courses)
    early = sum(1 for c in courses for _, s0, _ in (getattr(c, "time_slots", []) or []) if s0 <= 2)
    days = set()
    for c in courses:
        for d, _, _ in getattr(c, "time_slots", []) or []:
            if 1 <= d <= 7:
                days.add(d)
    loads = [sum(int(getattr(c, "credits", 0) or 0) for c in plan.get(sem, [])) for sem in scheduler.SEMESTER_ORDER[:8]]
    spread = max(loads) - min(loads) if loads else 0
    return {"courses": len(courses), "credits": credits, "early": early, "days": len(days), "spread": spread}


def simulate_auto_plan(mode: str, target_semesters: list[str], max_credit: int) -> dict:
    import copy
    temp = CourseScheduler()
    temp.planned_schedule = {sem: list(courses) for sem, courses in scheduler.planned_schedule.items()}
    temp.staging_area = list(scheduler.staging_area)
    temp.SEMESTER_ORDER = list(scheduler.SEMESTER_ORDER)
    courses = list(temp.staging_area)

    def sort_key(c):
        cat_priority = 0 if getattr(c, "category", "") in ["必", "必修"] else 1
        avoid_penalty = len(course_matches_avoid(c)) * 100
        slots = getattr(c, "time_slots", []) or []
        early = sum(1 for _, s0, _ in slots if s0 <= 2)
        days = len({d for d, _, _ in slots})
        credits = int(getattr(c, "credits", 0) or 0)
        if mode == "最少早八":
            return (avoid_penalty + early * 30, cat_priority, -credits, getattr(c, "name", ""))
        if mode == "三天課模式":
            return (avoid_penalty + days * 6, cat_priority, -credits, getattr(c, "name", ""))
        if mode == "最輕鬆模式":
            return (avoid_penalty + course_load_score(c), cat_priority, credits, getattr(c, "name", ""))
        if mode == "提前畢業":
            return (avoid_penalty, cat_priority, -credits, getattr(c, "name", ""))
        if mode == "GPA 優先":
            reviews = CourseCatalog.get_reviews(getattr(c, "code", ""))
            avg = sum(int(r.get("rating", 5) or 5) for r in reviews) / len(reviews) if reviews else 4
            return (avoid_penalty, -avg, course_load_score(c), getattr(c, "name", ""))
        if mode == "最少空堂":
            return (avoid_penalty, cat_priority, len(slots), getattr(c, "name", ""))
        return (avoid_penalty, cat_priority, -credits, getattr(c, "name", ""))

    courses = sorted(courses, key=sort_key)
    placed, skipped = [], []

    def has_conflict(plan_courses, course):
        for existing in plan_courses:
            if temp._check_two_courses_conflict(existing, course):
                return True
        return False

    for course in courses:
        best = None
        for sem in target_semesters:
            if sem not in temp.planned_schedule:
                temp.planned_schedule[sem] = []
            after_credit = sum(int(getattr(c, "credits", 0) or 0) for c in temp.planned_schedule[sem]) + int(getattr(course, "credits", 0) or 0)
            if after_credit > max_credit:
                continue
            if has_conflict(temp.planned_schedule[sem], course):
                continue
            avoid = len(course_matches_avoid(course))
            score = after_credit
            if mode == "提前畢業":
                score += scheduler.SEMESTER_ORDER.index(sem) * 2
            elif mode == "平衡模式":
                score += abs(after_credit - 18)
            elif mode == "三天課模式":
                days = {d for c in temp.planned_schedule[sem] for d, _, _ in (getattr(c, "time_slots", []) or [])}
                days.update({d for d, _, _ in (getattr(course, "time_slots", []) or [])})
                score += len(days) * 4
            elif mode == "最輕鬆模式":
                score += course_load_score(course)
            score += avoid * 200
            if best is None or score < best[0]:
                best = (score, sem)
        if best is None:
            skipped.append((course, "沒有符合限制的學期"))
        else:
            temp.planned_schedule[best[1]].append(course)
            placed.append((course, best[1]))
    placed_ids = {course_uid(c) for c, _ in placed}
    temp.staging_area = [c for c in temp.staging_area if course_uid(c) not in placed_ids]
    return {"mode": mode, "plan": temp.planned_schedule, "placed": placed, "skipped": skipped, "summary": summarize_plan(temp.planned_schedule)}


def apply_simulated_plan(result: dict) -> None:
    scheduler.planned_schedule = result["plan"]
    placed_ids = {course_uid(c) for c, _ in result.get("placed", [])}
    scheduler.staging_area = [c for c in scheduler.staging_area if course_uid(c) not in placed_ids]
    auto_save()


def build_google_calendar_url(row: dict) -> str:
    from urllib.parse import quote
    title = quote(row.get("課名", "淡江課程"))
    details = quote(f"老師：{row.get('老師','')}\n學期：{row.get('學期','')}\n時間：{row.get('時間','')}")
    location = quote(row.get("教室", ""))
    return f"https://calendar.google.com/calendar/render?action=TEMPLATE&text={title}&details={details}&location={location}"



def render_plan_templates_and_snapshots() -> None:
    st.markdown('<div class="section-card">', unsafe_allow_html=True)
    st.markdown('<div class="section-title">規劃模板與版本</div><div class="section-sub">不增加操作負擔：快速建立不同規劃版本，方便比較一般版、輕鬆版、提前畢業版。</div>', unsafe_allow_html=True)
    t1, t2 = st.tabs(["學長姐路線模板", "多版本備份"])
    with t1:
        template = st.selectbox("選擇模板", ["一般穩畢業型", "高 GPA 型", "三天課型", "交換準備型", "提前畢業型"], key="route_template")
        tips = {
            "一般穩畢業型": ["每學期 16–20 學分", "必修優先放前兩年", "通識平均分散"],
            "高 GPA 型": ["避免同學期塞入過多硬課", "優先參考評論評分", "保留期中期末準備時間"],
            "三天課型": ["偏好集中星期二到星期四", "適合打工或社團固定時段", "需注意單日負荷"],
            "交換準備型": ["大三前補齊主要必修", "保留大三下或大四上彈性", "外語與通識提前完成"],
            "提前畢業型": ["學分上限提高", "暑修或密集學期規劃", "高風險，需定期檢查畢業門檻"],
        }
        st.info("\n".join([f"- {x}" for x in tips.get(template, [])]))
        if st.button("用此模板產生建議方案", type="primary", use_container_width=True):
            mode_map = {"高 GPA 型":"GPA 優先", "三天課型":"三天課模式", "提前畢業型":"提前畢業", "交換準備型":"平衡模式", "一般穩畢業型":"平衡模式"}
            st.session_state.auto_plan_results = [simulate_auto_plan(mode_map.get(template, "平衡模式"), scheduler.SEMESTER_ORDER[:8], 25 if template == "提前畢業型" else 22)]
            st.success("已在課表管理頁的一鍵方案中產生模板方案。")
    with t2:
        name = st.text_input("版本名稱", placeholder="例：一般版 / 輕鬆版 / 交換版", key="snapshot_name")
        c1, c2 = st.columns(2)
        with c1:
            if st.button("儲存目前版本", use_container_width=True):
                if not name:
                    st.warning("請先輸入版本名稱。")
                else:
                    st.session_state.saved_plan_snapshots[name] = {sem: [c.to_dict() for c in courses] for sem, courses in scheduler.planned_schedule.items()}
                    st.success(f"已儲存版本：{name}")
        with c2:
            snap_names = list(st.session_state.saved_plan_snapshots.keys())
            selected = st.selectbox("讀取版本", ["請選擇"] + snap_names, key="snapshot_load")
            if st.button("套用版本", use_container_width=True):
                if selected == "請選擇":
                    st.warning("請選擇版本。")
                else:
                    scheduler.planned_schedule = {sem: [Course.from_dict(c) for c in courses] for sem, courses in st.session_state.saved_plan_snapshots[selected].items()}
                    auto_save()
                    st.toast("版本已套用。", icon="✅")
                    st.rerun()
        if st.session_state.saved_plan_snapshots:
            rows = []
            for n, plan in st.session_state.saved_plan_snapshots.items():
                total = sum(int(c.get("credits", 0) or 0) for courses in plan.values() for c in courses)
                count = sum(len(courses) for courses in plan.values())
                rows.append({"版本": n, "課程數": count, "學分": total})
            st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)
    st.markdown('</div>', unsafe_allow_html=True)

def render_smart_tools_panel() -> None:
    st.markdown('<div class="section-card">', unsafe_allow_html=True)
    st.markdown('<div class="section-title">便捷工具</div><div class="section-sub">保留簡單操作：偏好設定、一鍵產生方案、收藏、比較與快速匯出。</div>', unsafe_allow_html=True)
    tab_auto, tab_pref, tab_compare, tab_export = st.tabs(["一鍵方案", "偏好避雷", "收藏/比較", "快速匯出"])
    with tab_auto:
        c1, c2 = st.columns([.55, .45])
        with c1:
            modes = ["平衡模式", "最少空堂", "最少早八", "三天課模式", "最輕鬆模式", "GPA 優先", "提前畢業"]
            selected_modes = st.multiselect("要產生的方案", modes, default=["平衡模式", "最少空堂", "最少早八"], key="auto_modes")
            target = st.multiselect("套用學期", scheduler.SEMESTER_ORDER[:8], default=st.session_state.active_sems or scheduler.SEMESTER_ORDER[:8], key="auto_target_sems")
            max_credit2 = st.slider("每學期學分上限", 12, 35, int(st.session_state.get("auto_max_credit", 22)), 1, key="auto_panel_credit")
            if st.button("產生多個排課方案", type="primary", use_container_width=True):
                if not scheduler.staging_area:
                    st.warning("暫存區沒有課程。請先搜尋並加入想修課程。")
                else:
                    st.session_state.auto_plan_results = [simulate_auto_plan(m, target, max_credit2) for m in selected_modes]
                    st.success(f"已產生 {len(st.session_state.auto_plan_results)} 個方案。")
        with c2:
            results = st.session_state.get("auto_plan_results", [])
            if not results:
                st.info("先把想修課程加入暫存，再產生方案。")
            for i, res in enumerate(results):
                sm = res["summary"]
                st.markdown(f"**方案 {i+1}｜{res['mode']}**  \n排入 {len(res['placed'])} 門｜未排 {len(res['skipped'])} 門｜總 {sm['credits']} 學分｜早八 {sm['early']} 次｜分散 {sm['days']} 天")
                if st.button(f"套用方案 {i+1}", key=f"apply_plan_{i}", use_container_width=True):
                    apply_simulated_plan(res)
                    st.toast("方案已套用。", icon="✅")
                    st.rerun()
    with tab_pref:
        st.session_state.avoid_teachers = st.text_input("避開教師（逗號分隔）", value=st.session_state.get("avoid_teachers", ""), placeholder="例：王老師, 陳老師")
        st.session_state.avoid_weekdays = st.multiselect("避開星期", ["一", "二", "三", "四", "五", "六", "日"], default=st.session_state.get("avoid_weekdays", []))
        st.session_state.avoid_periods = st.multiselect("避開節次", [str(i) for i in range(1, 15)], default=st.session_state.get("avoid_periods", []))
        st.caption("避雷規則會影響多方案排序與搜尋結果提示，但不會禁止你手動排入。")
    with tab_compare:
        favs = favorite_courses_from_sources()
        st.markdown(f"**收藏課程：{len(st.session_state.get('favorites', []))} 門**")
        if favs:
            for c in favs[:8]:
                if st.button(f"加入暫存｜{c.name}｜{c.teacher or '未定'}", key=f"fav_stage_{course_uid(c)}", use_container_width=True):
                    ok, msg = scheduler.add_to_staging(c)
                    if ok:
                        auto_save(); st.toast("已加入暫存", icon="✅"); st.rerun()
                    else:
                        st.toast(msg, icon="⚠️")
        compare_ids = st.session_state.get("compare_courses", [])
        pool = {course_uid(c): c for c in (st.session_state.get("catalog", []) + scheduler.staging_area + all_planned_courses())}
        compare_courses = [pool[x] for x in compare_ids if x in pool]
        if compare_courses:
            rows = []
            for c in compare_courses[:4]:
                reviews = CourseCatalog.get_reviews(c.code)
                avg = round(sum(int(r.get("rating", 5) or 5) for r in reviews) / len(reviews), 1) if reviews else "-"
                rows.append({"課程": c.name, "教師": c.teacher, "學分": c.credits, "時間": c.time_info, "類別": c.category, "評論數": len(reviews), "平均評分": avg})
            st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)
            if st.button("清空比較清單", use_container_width=True):
                st.session_state.compare_courses = []
                st.rerun()
        else:
            st.info("在搜尋結果按「比較」即可加入。")
    with tab_export:
        rows = build_schedule_rows()
        if rows:
            st.link_button("加入 Google Calendar（以第一堂課為範例）", build_google_calendar_url(rows[0]), use_container_width=True)
            share_payload = base64.urlsafe_b64encode(json.dumps(rows[:30], ensure_ascii=False).encode("utf-8")).decode("utf-8")[:120]
            st.code(f"TKU-SHARE-{share_payload}", language="text")
            st.caption("這是輕量分享碼雛形；正式上線時可改成後端短連結。")
        else:
            st.info("目前沒有可匯出的課程。")
    st.markdown('</div>', unsafe_allow_html=True)

def render_search_panel() -> None:
    st.markdown('<div class="section-card search-panel">', unsafe_allow_html=True)
    st.markdown('<div class="section-title">課程搜尋</div><div class="section-sub">搜尋、收藏，或直接丟進候選清單。</div>', unsafe_allow_html=True)

    kw = st.text_input("搜尋課程", value=st.session_state.get("search_kw", ""), placeholder="課名、教師、代碼", label_visibility="collapsed", key="compact_search_kw")
    with st.expander("篩選條件", expanded=False):
        dept = st.selectbox("科系", ["全部"] + CourseCatalog.get_all_departments(), index=0, format_func=format_dept_name, key="compact_dept")
        cat = st.selectbox("必選修", ["全部"] + CourseCatalog.get_all_categories(), index=0, key="compact_cat")
        grade = st.selectbox("年級", ["全部"] + CourseCatalog.get_all_grades(), index=0, key="compact_grade")
        c1, c2 = st.columns(2)
        with c1:
            weekday_options = ["全部", "一", "二", "三", "四", "五", "六", "日"]
            weekday = st.selectbox("星期", weekday_options, index=weekday_options.index(st.session_state.search_weekday) if st.session_state.search_weekday in weekday_options else 0, key="compact_weekday")
        with c2:
            period_options = ["全部"] + [str(i) for i in range(1, 15)]
            period = st.selectbox("節次", period_options, index=period_options.index(st.session_state.search_period) if st.session_state.search_period in period_options else 0, key="compact_period")
        st.session_state.class_time_mode = st.radio("日間 / 夜間", ["全部", "日間", "夜間"], index=["全部", "日間", "夜間"].index(st.session_state.get("class_time_mode", "日間")), horizontal=True, key="compact_class_time_mode")
    if st.button("搜尋課程", type="primary", use_container_width=True, key="compact_search_btn"):
        st.session_state.search_kw = kw
        st.session_state.search_weekday = st.session_state.get("compact_weekday", "全部")
        st.session_state.search_period = st.session_state.get("compact_period", "全部")
        with st.spinner("搜尋中..."):
            raw_catalog = CourseCatalog.query_db(
                keyword=kw,
                semester="全部",
                department=st.session_state.get("compact_dept", "全部"),
                category=st.session_state.get("compact_cat", "全部"),
                grade=st.session_state.get("compact_grade", "全部"),
                gen_edu_filter="全部",
                weekday=st.session_state.search_weekday,
                period=st.session_state.search_period,
            )
            st.session_state.catalog = filter_courses_by_class_time(raw_catalog, st.session_state.get("class_time_mode", "日間"))
        st.session_state.search_has_run = True
        if st.session_state.catalog:
            st.session_state.selected_course_uid = course_uid(st.session_state.catalog[0])

    if not st.session_state.search_has_run:
        fav_count = len(st.session_state.get("favorites", []))
        staging_count = len(scheduler.staging_area)
        st.markdown(f'<div class="info-box">收藏 {fav_count} 門｜候選 {staging_count} 門。搜尋後可加入候選或直接排入。</div>', unsafe_allow_html=True)
    elif not st.session_state.catalog:
        st.info("沒有符合條件的課程。")
    else:
        st.markdown(f'<div class="filter-compact">找到 {len(st.session_state.catalog)} 門課程</div>', unsafe_allow_html=True)
        items_per_page = 4
        total_pages = max(1, (len(st.session_state.catalog) - 1) // items_per_page + 1)
        page = st.selectbox("頁數", range(1, total_pages + 1), format_func=lambda x: f"{x}/{total_pages}", key="search_page", label_visibility="collapsed")
        start = (page - 1) * items_per_page
        for c in st.session_state.catalog[start:start + items_per_page]:
            cid = course_uid(c)
            selected_mark = "｜已選" if st.session_state.get("selected_course_uid") == cid else ""
            st.markdown(
                f"""
                <div class="result-card">
                  <div class="result-title">{category_tag(c.category)}{c.name}{selected_mark}</div>
                  <div class="result-meta">{c.teacher or '未定'}｜{c.time_info or '未定'}｜{c.credits} 學分</div>
                </div>
                """,
                unsafe_allow_html=True,
            )
            b1, b2, b3 = st.columns([1, 1, .72])
            with b1:
                if st.button("查看", key=f"select_{c.semester_source}_{c.serial}", use_container_width=True):
                    st.session_state.selected_course_uid = cid
                    st.rerun()
            with b2:
                if st.button("加入候選", key=f"add_{c.semester_source}_{c.serial}", use_container_width=True):
                    ok, msg = scheduler.add_to_staging(c)
                    if ok:
                        auto_save(); st.toast(f"已加入：{c.name}", icon="✅"); st.rerun()
                    else:
                        st.toast(msg, icon="⚠️")
            with b3:
                fav_label = "♥" if is_course_favorite(c) else "♡"
                if st.button(fav_label, key=f"fav_{c.semester_source}_{c.serial}", use_container_width=True):
                    toggle_favorite(c)
                    st.rerun()
    st.markdown('</div>', unsafe_allow_html=True)

def render_schedule_workspace() -> None:
    st.markdown('<div class="section-card schedule-panel-clean">', unsafe_allow_html=True)
    year_map = {
        "大一": scheduler.SEMESTER_ORDER[0:2],
        "大二": scheduler.SEMESTER_ORDER[2:4],
        "大三": scheduler.SEMESTER_ORDER[4:6],
        "大四": scheduler.SEMESTER_ORDER[6:8],
    }
    current_year = st.session_state.get("schedule_year_tab", "大二")
    if current_year not in year_map:
        current_year = "大二"
        st.session_state.schedule_year_tab = current_year
    active_sems = year_map[current_year]
    st.session_state.active_sems = active_sems

    count_sum = sum(len(scheduler.planned_schedule.get(sem, [])) for sem in active_sems)
    credit_sum = sum(sum(int(getattr(c, "credits", 0) or 0) for c in scheduler.planned_schedule.get(sem, [])) for sem in active_sems)
    conflict_sum = sum(scheduler.get_semester_stats(sem)[2] for sem in active_sems)
    mode = st.session_state.get("class_time_mode", "日間")

    st.markdown(
        f'''
        <div class="schedule-toolbar">
          <div class="schedule-toolbar-left">
            <div><div class="section-title">學期課表</div><div class="section-sub">只顯示目前年級上下學期，避免畫面過長。</div></div>
          </div>
          <div class="schedule-toolbar-right">
            <span class="mode-chip active">{current_year}</span>
            <span class="mode-chip">{count_sum} 門</span>
            <span class="mode-chip">{credit_sum} 學分</span>
            <span class="mode-chip">{conflict_sum} 衝堂</span>
            <span class="mode-chip {'active' if mode == '夜間' else ''}">{'🌙 夜間' if mode == '夜間' else '☀ 日間'}</span>
          </div>
        </div>
        ''',
        unsafe_allow_html=True,
    )

    y1, y2, y3 = st.columns([1.3, 1, 1], gap="small")
    with y1:
        current_year = st.radio("年級", list(year_map.keys()), horizontal=True, key="schedule_year_tab", label_visibility="collapsed")
        active_sems = year_map[current_year]
        st.session_state.active_sems = active_sems
    with y2:
        st.session_state.class_time_mode = st.radio("課表時段", ["日間", "夜間"], index=0 if st.session_state.get("class_time_mode", "日間") != "夜間" else 1, horizontal=True, key="workspace_class_time_mode", label_visibility="collapsed")
        st.session_state.show_evening = st.session_state.class_time_mode == "夜間"
    with y3:
        st.session_state.show_weekends = st.toggle("顯示週末", value=bool(st.session_state.get("show_weekends", False)), key="workspace_show_weekends")

    control_col1, control_col2, control_col3 = st.columns([.8, .9, .9], gap="medium")
    with control_col1:
        max_credit = st.number_input("單學期學分上限", min_value=9, max_value=35, value=int(st.session_state.get("auto_max_credit", 22)), step=1, key="auto_max_credit")
    with control_col2:
        if st.button("一鍵排入此年級", use_container_width=True, type="primary"):
            result = scheduler.auto_arrange_staging(active_sems, int(max_credit))
            auto_save()
            placed_count = len(result.get("placed", []))
            skipped_count = len(result.get("skipped", []))
            if placed_count:
                st.toast(f"已自動排入 {placed_count} 門課；未排入 {skipped_count} 門。", icon="✅")
            else:
                st.toast("目前沒有可自動排入的候選課程。", icon="⚠️")
            st.rerun()
    with control_col3:
        if st.button("清空此年級課表", use_container_width=True):
            for sem in active_sems:
                for c in scheduler.planned_schedule.get(sem, []):
                    if not any(s.serial == c.serial for s in scheduler.staging_area):
                        scheduler.staging_area.append(c)
                scheduler.planned_schedule[sem] = []
            auto_save()
            st.rerun()

    if scheduler.staging_area:
        preview = "".join([f'<span class="preview-chip">{c.name}｜{c.credits}學分</span>' for c in scheduler.staging_area[:8]])
        extra = max(0, len(scheduler.staging_area) - 8)
        if extra:
            preview += f'<span class="preview-chip">+{extra}</span>'
        st.markdown(f'<div class="staging-preview">{preview}</div>', unsafe_allow_html=True)

    dnd_data = {
        "staging": [c.to_dict() for c in scheduler.staging_area],
        "schedule": {sem: [c.to_dict() for c in scheduler.planned_schedule.get(sem, [])] for sem in active_sems},
        "semesters": active_sems,
        "settings": {
            "theme_color": st.session_state.theme_color,
            "show_weekends": st.session_state.show_weekends,
            "show_evening": st.session_state.show_evening,
            "bg_image": st.session_state.bg_image,
            "bg_opacity": st.session_state.bg_opacity,
            "ui_theme_mode": st.session_state.ui_theme_mode,
        },
    }
    board_height = 900 if st.session_state.get("show_evening", False) else 760
    dnd_board(data=dnd_data, key=f"main_dnd_board_{current_year}_{st.session_state.get('class_time_mode')}_{st.session_state.get('show_weekends')}", height=board_height)
    st.markdown('</div>', unsafe_allow_html=True)

def render_overview_page() -> None:
    render_topbar()
    render_quick_summary()
    render_progress_overview()
    render_four_year_map()
    render_plan_templates_and_snapshots()
    st.markdown('<div class="section-card">', unsafe_allow_html=True)
    st.markdown('<div class="section-title">目前狀態</div>', unsafe_allow_html=True)
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("暫存課程", len(scheduler.staging_area))
    c2.metric("已規劃課程", sum(len(v) for v in scheduler.planned_schedule.values()))
    c3.metric("已使用學期", len([1 for v in scheduler.planned_schedule.values() if v]))
    c4.metric("衝堂", conflicts)
    st.markdown('</div>', unsafe_allow_html=True)


def render_credit_page() -> None:
    render_topbar()
    render_quick_summary()
    render_progress_overview()
    st.markdown('<div class="section-card">', unsafe_allow_html=True)
    st.markdown('<div class="section-title">學分分析明細</div><div class="section-sub">綠色為已通過，藍色為已排入規劃。</div>', unsafe_allow_html=True)
    for key, data in report.items():
        if not isinstance(data, dict):
            continue
        st.markdown(progress_card(key, key, data.get("target", 0) or 0), unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)
    render_program_credit_checker()


def render_settings_page() -> None:
    render_topbar()
    st.markdown('<div class="section-card">', unsafe_allow_html=True)
    st.markdown('<div class="section-title">課表外觀設定</div><div class="section-sub">這裡只調整顯示與匯出外觀，不影響課程資料。</div>', unsafe_allow_html=True)
    c1, c2 = st.columns(2)
    with c1:
        st.session_state.theme_color = st.color_picker("主色", st.session_state.theme_color)
        st.session_state.ui_theme_mode = st.selectbox("介面模式", ["自動", "淺色", "深色"], index=["自動", "淺色", "深色"].index(st.session_state.ui_theme_mode), key="settings_theme_mode")
    with c2:
        bg_file = st.file_uploader("課表背景圖", type=["png", "jpg", "jpeg"], key="schedule_bg_file")
        st.session_state.bg_opacity = st.slider("背景透明度", 0.1, 1.0, float(st.session_state.bg_opacity), 0.05)
        if bg_file:
            st.session_state.bg_image = "data:image/png;base64," + base64.b64encode(bg_file.read()).decode("utf-8")
    if st.button("套用外觀", type="primary", use_container_width=True):
        auto_save()
        st.success("外觀已套用。若顏色未立即更新，重新整理頁面即可。")
    st.markdown('</div>', unsafe_allow_html=True)


def render_schedule_shell(title: str, subtitle: str) -> None:
    render_topbar()
    render_quick_summary()
    render_progress_overview()
    st.markdown(
        f'<div class="section-card compact"><div class="section-title">{title}</div><div class="section-sub">{subtitle}</div></div>',
        unsafe_allow_html=True,
    )


def render_right_assistant() -> None:
    rows = build_schedule_rows()
    active_sems = st.session_state.get("active_sems", scheduler.SEMESTER_ORDER[:2])
    planned = []
    for sem in active_sems:
        planned.extend(scheduler.planned_schedule.get(sem, []))
    course = None
    selected_uid = st.session_state.get("selected_course_uid")
    if selected_uid:
        pool = list(st.session_state.get("catalog", [])) + list(scheduler.staging_area) + planned
        for item in pool:
            if course_uid(item) == selected_uid:
                course = item
                break
    if course is None and planned:
        course = planned[0]
    elif course is None and st.session_state.get("catalog"):
        course = st.session_state.catalog[0]
    total_credits = sum(int(getattr(c, "credits", 0) or 0) for c in planned)
    missing = []
    for key, data in report.items():
        if isinstance(data, dict):
            target = data.get("target", 0) or 0
            current = (data.get("passed", 0) or 0) + (data.get("planned", 0) or 0)
            if target and current < target:
                missing.append(f"{key} 少 {target-current} 學分")
    if course:
        title = getattr(course, "name", "課程資訊")
        category = getattr(course, "category", "") or "課程"
        teacher = getattr(course, "teacher", "未定") or "未定"
        time_info = getattr(course, "time_info", "未定") or "未定"
        classroom = getattr(course, "classroom", "未定") or "未定"
        credits = getattr(course, "credits", 0) or 0
        code = getattr(course, "code", "-") or "-"
    else:
        title, category, teacher, time_info, classroom, credits, code = "尚未選擇課程", "提示", "-", "-", "-", 0, "-"
    st.markdown(
        f"""
        <div class="assistant-panel">
          <div class="assistant-course">
            <div class="assistant-title">{title}<span class="assistant-tag">{category}</span></div>
            <div class="assistant-meta">{teacher}｜{credits} 學分｜{code}</div>
            <div class="assistant-tabs"><span>課程資訊</span><span>教學計畫</span><span>評論</span></div>
            <div class="fact-row">📅 <div><b>時間</b><br>{time_info}</div></div>
            <div class="fact-row">📍 <div><b>教室</b><br>{classroom}</div></div>
            <div class="fact-row">ℹ️ <div><b>備註</b><br>可在課程搜尋結果展開完整課綱與評論。</div></div>
          </div>
          <div class="assistant-course">
            <div class="assistant-title">規劃助理</div>
            <div class="assistant-meta">目前年級分頁已排 {len(planned)} 門，合計 {total_credits} 學分。</div>
            <div class="ui-divider"></div>
            <div class="fact-row">🎓 <div><b>畢業檢查</b><br>{('<br>'.join(missing[:4]) if missing else '目前沒有明顯缺口')}</div></div>
            <div class="fact-row">⚠️ <div><b>衝堂</b><br>{conflicts} 組</div></div>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    if course:
        if st.button("加入規劃", key="assistant_add_current", use_container_width=True, type="primary"):
            ok, msg = scheduler.add_to_staging(course)
            if ok:
                auto_save(); st.toast("已加入候選課程", icon="✅"); st.rerun()
            else:
                st.toast(msg, icon="⚠️")
        if st.button("加入收藏", key="assistant_fav_current", use_container_width=True):
            toggle_favorite(course); st.rerun()

def render_schedule_page() -> None:
    render_topbar()
    active_year = st.session_state.get("schedule_year_tab", "大二")
    year_map = {
        "大一": scheduler.SEMESTER_ORDER[0:2],
        "大二": scheduler.SEMESTER_ORDER[2:4],
        "大三": scheduler.SEMESTER_ORDER[4:6],
        "大四": scheduler.SEMESTER_ORDER[6:8],
    }
    active_sems = year_map.get(active_year, scheduler.SEMESTER_ORDER[2:4])
    active_courses = [c for sem in active_sems for c in scheduler.planned_schedule.get(sem, [])]
    active_credits = sum(int(getattr(c, "credits", 0) or 0) for c in active_courses)
    required_count = len([c for c in active_courses if "必" in (getattr(c, "category", "") or "")])
    general_count = len([c for c in active_courses if "通識" in (getattr(c, "category", "") or "")])
    st.markdown(
        f"""
        <div class="summary-banner">
          <div><span class="sem-big-title">{active_year}學期</span><span class="sem-status">進行中</span></div>
          <div class="summary-stat"><div class="stat-icon">✓</div><div><div class="stat-num">{active_credits}</div><div class="stat-label">已選學分</div></div></div>
          <div class="summary-stat"><div class="stat-icon">📖</div><div><div class="stat-num">{required_count}</div><div class="stat-label">必修課程</div></div></div>
          <div class="summary-stat"><div class="stat-icon">🎓</div><div><div class="stat-num">{general_count}</div><div class="stat-label">通識課程</div></div></div>
          <div class="ai-cta">✨ 幫我排課<small>AI 智慧排課</small></div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    left, center, right = st.columns([0.72, 2.05, 0.86], gap="medium")
    with left:
        render_search_panel()
    with center:
        render_schedule_workspace()
    with right:
        render_right_assistant()
    rows = build_schedule_rows()
    next_course = rows[0] if rows else {"課名":"尚未排課","時間":"-","教室":"-"}
    st.markdown(
        f"""
        <div class="bottom-strip">
          <div class="bottom-card"><div class="bottom-label">下一堂課</div><div class="bottom-main">{next_course.get('課名','尚未排課')}</div><div class="bottom-sub">{next_course.get('時間','-')}｜{next_course.get('教室','-')}</div></div>
          <div class="bottom-card"><div class="bottom-label">本週課程</div><div class="bottom-main">{len(rows)} 堂課</div><div class="bottom-sub">已排入四年規劃的課程總數</div></div>
          <div class="bottom-card"><div class="bottom-label">重要提醒</div><div class="bottom-main">{conflicts} 組衝堂</div><div class="bottom-sub">建議先處理衝堂與缺學分項目</div></div>
        </div>
        """,
        unsafe_allow_html=True,
    )

def render_course_search_page() -> None:
    render_schedule_shell("課程搜尋", "搜尋課程、加入候選清單，或直接排入指定學期。")
    render_search_panel()


def render_smart_tools_page() -> None:
    render_schedule_shell("一鍵排課", "一鍵排課、避雷偏好、課程比較、路線模板與快速匯出。")
    render_smart_tools_panel()



def render_sidebar_navigation() -> str:
    total_credits = sum(int(getattr(c, "credits", 0) or 0) for courses in scheduler.planned_schedule.values() for c in courses)
    target = report.get("總計", {}).get("target", 128) or 128
    pct = int(min(100, (total_credits / target * 100))) if target else 0
    with st.sidebar:
        st.markdown(
            f"""
            <div class="side-logo-row">
              <div class="side-logo">☰</div>
              <div><div class="side-app-name">UniPlan 智慧排課</div><div class="side-app-sub">淡江四年課程規劃</div></div>
            </div>
            """,
            unsafe_allow_html=True,
        )
        page_options = ["我的規劃", "課程搜尋", "一鍵排課", "四年總覽", "學分進度", "手機工具", "設定"]
        current = st.session_state.get("active_page", "我的規劃")
        if current not in page_options:
            current = "我的規劃"
        chosen = st.radio(
            "主要功能",
            page_options,
            index=page_options.index(current),
            key="sidebar_page_radio",
            format_func=lambda x: {
                "我的規劃": "⌂  我的規劃",
                "課程搜尋": "⌕  課程搜尋",
                "一鍵排課": "✦  一鍵排課",
                "四年總覽": "◇  四年總覽",
                "學分進度": "▣  學分進度",
                "手機工具": "▢  手機工具",
                "設定": "⚙  設定",
            }.get(x, x),
        )
        st.session_state.active_page = chosen
        st.markdown(
            f"""
            <div class="side-progress-card">
              <div class="side-progress-title">畢業進度</div>
              <div class="side-progress-number">{pct}%</div>
              <div class="side-progress-track"><div style="width:{pct}%"></div></div>
              <div class="side-progress-sub">已規劃 {total_credits} / {target} 學分</div>
            </div>
            """,
            unsafe_allow_html=True,
        )
        c1, c2 = st.columns(2)
        with c1:
            if st.button("💾 儲存", use_container_width=True, key="sidebar_save_btn"):
                auto_save(); st.toast("已儲存", icon="✅")
        with c2:
            if st.button("🌙/☀", use_container_width=True, key="sidebar_theme_btn"):
                st.session_state.ui_theme_mode = "深色" if st.session_state.get("ui_theme_mode") != "深色" else "淺色"
                st.rerun()
        st.markdown('<div class="side-mini-note">桌機使用左側功能列；手機會自動收合為系統側欄。</div>', unsafe_allow_html=True)
    return st.session_state.active_page

active_page = render_sidebar_navigation()

if active_page == "四年總覽":
    render_overview_page()
elif active_page == "學分進度":
    render_credit_page()
elif active_page == "手機工具":
    render_mobile_tools_page()
elif active_page == "設定":
    render_settings_page()
elif active_page == "課程搜尋":
    render_course_search_page()
elif active_page == "一鍵排課":
    render_smart_tools_page()
else:
    render_schedule_page()
