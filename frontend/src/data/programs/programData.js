import { PROGRAM_RULE_TYPES, PROGRAM_STATUS, programStatusLabel } from './programTypes'
import { c, group, minCredit, minCourse, select, maxCourse, maxCredit, outsideMajor, note } from './programBuilders'
import { AI_INTRO, AI_ETHICS, PROGRAMMING, PROBABILITY } from './programTemplates'

const RAW_PROGRAMS = [
  {
    id: 'C002', code: 'C002', name: '商管學院資安大數據與人工智慧碩士學分學程', college: '商管學院', unit: '資管系', status: PROGRAM_STATUS.PARTIAL,
    summary: '資安、大數據與AI方向，含核心選修、產學合作與輔助課程。', totalRules: [],
    groups: [
      group('base-core', '基礎核心', [select(1, 2)], [c('人工智慧', 2), c('資訊安全管理', 3)]),
      group('advanced-core', '進階核心', [select(1, 2)], [c('機器學習', 2), c('電子商務安全', 3)]),
      group('industry', '產學合作', [select(2, 3)], [c('商業智慧分析', 2), c('資訊安全管理實務', 3), c('資訊安全實習', 2)]),
      group('support', '輔助課程', [minCourse(3)], [c('AI於智慧城市發展', 3), c('巨量資料探勘', 3), c('進階機器學習', 2), c('演算法', 2), c('資安攻防', 2), c('電腦鑑識', 2), c('網路安全技術', 2), c('資訊科技治理', 2), c('系統安全', 2), c('資訊安全', 2), c('無線行動安全', 2), c('資安管理專題', 2)]),
      group('certificate', '證照與實習提醒', [note('AI/AWS/ISO27001 LA/BS10012 LA 等證照條件需再依正式規則確認，暫不納入進度計算。')], [c('AI證照', 0), c('AWS證照', 0), c('ISO27001 LA證照', 0), c('BS10012 LA證照', 0)]),
    ], path: ['基礎核心', '進階核心', '產學合作', '輔助課程'], sources: ['使用者提供圖片', '跨系所院學分學程一覽表'],
  },
  {
    id: 'C004', code: 'C004', name: '商管學院財經法律學分學程', college: '商管學院', unit: '經濟系', status: PROGRAM_STATUS.ACTIVE,
    summary: '經濟學門與法律學門。經濟基礎6學分、經濟專業6學分、法律基礎至少2科5學分、財經法律至少3科7學分。', totalRules: [],
    groups: [
      group('econ-basic', '經濟學門－基礎經濟理論', [minCredit(6)], [c('個體經濟學', 3), c('總體經濟學', 3)]),
      group('econ-advanced', '經濟學門－專業經濟分析', [minCredit(6)], [c('產業結構與賽局分析', 3), c('財務經濟學', 3), c('公共經濟學', 3), c('財政學', 3), c('國際金融', 3), c('國際金融市場', 3), c('國際貿易理論與政策', 3), c('國際金融理論', 3, { status: '歷史課程' }), c('國際貿易理論', 3, { status: '歷史課程' }), c('國際貿易', 3, { status: '歷史課程' })]),
      group('law-basic', '法律學門－基礎法律', [minCourse(2), minCredit(5)], [c('憲法', 2), c('法學緒論', 2), c('民法概要', 2), c('勞動法', 2), c('行政法', 2), c('刑法概要', 2, { status: '歷史課程' })]),
      group('law-finance', '法律學門－財經法律', [minCourse(3), minCredit(7)], [c('商事法', 2), c('商事法實務', 2), c('證券金融法規', 2), c('證券交易法規理論與實務', 3), c('保險法規', 2), c('保險法', 2, { status: '歷史課程' }), c('國際貿易法規', 2), c('智慧財產權案例分析', 2), c('公平交易法', 2, { status: '歷史課程' }), c('證券交易法', 2, { status: '歷史課程' }), c('消費者保護法', 2, { status: '歷史課程' }), c('金融實務與法規', 3, { status: '歷史課程' })]),
    ], sources: ['附件2_財經法律學分學程修習科目一覽表_10903修.pdf'],
  },
  {
    id: 'C005', code: 'C005', name: '商管學院會計財金學分學程', college: '商管學院', unit: '會計系', status: PROGRAM_STATUS.PARTIAL,
    summary: '會計必修搭配財金選修，含多組二選一。', groups: [
      group('required', '必修', [minCredit(11)], [c('財務管理', 3), c('中級會計學', 8)]),
      group('elective', '選修與二選一群', [], [c('投資學', 3), c('個體經濟學', 3), c('財務數量方法', 4), c('貨幣銀行學', 4), c('財務報表分析', 2), c('財務報告分析', 2), c('投資銀行', 2), c('金融機構經營管理', 2), c('衍生性商品投資實務', 3), c('期貨與選擇權', 3), c('證券交易法規理論與實務', 3), c('證券投資實務', 3), c('財務風險控管', 3), c('財金英文', 3), c('財金英文應用', 2), c('國際投資', 2), c('國際金融', 3), c('財金軟體應用', 3), c('計量經濟學', 3), c('數理統計', 6), c('AI與金融科技', 2), c('金融創新', 3), c('財金資料庫', 2), c('固定收益證券', 2)], [], ['財務報表分析/財務報告分析、投資銀行/金融機構經營管理等為二選一群，後續可在管理端細切 ChoiceBlock。']),
    ], sources: ['會計財金學程114學年度課程清單'],
  },
  {
    id: 'C009', code: 'C009', name: '商管學院商業統計與管理學分學程', college: '商管學院', unit: '統計系', status: PROGRAM_STATUS.ACTIVE,
    summary: '跨統計、財金、計量、行銷管理；含統計系/非統計系條件與二選一、三選一。', groups: [
      group('stat-info', '統計與資訊', [], [c('迴歸分析', 3), c('無母數統計', 3), c('應用多變量分析', 3), c('多變量分析', 3), c('資料探勘', 3), c('資料探勘與分析導論', 3), c('巨量資料探勘', 2), c('機器學習', 3)]),
      group('investment', '證券投資', [], [c('證券交易法規理論與實務', 3), c('證券投資實務', 3), c('證券投資分析', 3), c('投資學', 2)]),
      group('econometrics', '計量經濟', [], [c('計量經濟學', 3), c('計量經濟學導論', 2), c('計量經濟學原理', 3)]),
      group('finance', '財務金融', [], [c('貨幣銀行學', 2), c('財務報表分析', 3), c('財務分析與投資', 3), c('財務數量方法', 2), c('財務管理', 3), c('金融科技', 2), c('財務資料分析', 3)]),
      group('marketing', '行銷與管理', [], [c('行銷管理', 3), c('行銷學', 2), c('國際行銷學', 3), c('市場調查', 3), c('市場調查與預測', 3), c('市場調查與統計', 2), c('零售業管理', 3), c('顧客關係管理', 2), c('供應鏈管理', 3), c('科技管理', 2)]),
    ], notes: ['統計系學生僅能修習本系開設課程；非統計系學生在部分群組二選一或三選一。'], sources: ['1141/1142商統學分學程課程清單'],
  },
  {
    id: 'C010', code: 'C010', name: '淡江大學法語企管學分學程', college: '外語學院/商管學院', unit: '企管系、法文系', status: PROGRAM_STATUS.PARTIAL,
    groups: [
      group('french', '法國語文學系課程', [], [c('閱讀與習作（一）', 4), c('閱讀與習作（二）', 4), c('法文文法（一）', 4), c('法文文法（二）', 4), c('法語會話（一）', 4), c('法語會話（二）', 4), c('法文作文（一）', 4), c('法語語音學', 2), c('法國廿世紀史', 2), c('法國18世紀文學導讀', 2), c('商業法文', 2)]),
      group('business', '企業管理學系課程', [], [c('企業概論', 3), c('管理學', 3), c('行銷管理', 3), c('人力資源管理', 3), c('財務管理', 3), c('資訊管理', 3), c('作業管理', 3), c('組織行為', 3), c('策略管理', 3), c('企管系選修科目', 2)]),
    ], notes: ['原兩系擋修規定仍有效；商管其他學系同課名原則上不得抵用企管系課程。'], sources: ['法語企管學分學程修習課程清單'],
  },
  {
    id: 'C012', code: 'C012', name: '淡江大學智慧人文實務創新學分學程', college: '文學院', unit: '文學院', status: PROGRAM_STATUS.ACTIVE,
    summary: '五大領域，基礎4、進階8、實務4，合計16學分。', totalRules: [minCredit(16)],
    groups: [
      group('base', '基礎課程', [minCredit(4)], [c('AI與人文創意敘事協作', 2), c('文化觀覽與AI產業概論', 2), c('數位典藏與數位人文概論', 2), c('影視娛樂產業概論', 2), c('數位內容產業概論', 2)]),
      group('advanced', '進階課程', [minCredit(8)], [c('跨文化溝通', 2), c('古典文化與AI創意應用', 2), c('AI與博物館應用', 2), c('資訊視覺化', 2), c('網絡分析', 2), c('數位藝術與人機互動', 2), c('社群媒體行銷', 3), c('ESG行銷策略', 2), c('人工智慧與數位人文', 2), c('大數據概論與應用', 2)]),
      group('practice', '實作課程', [minCredit(4)], [c('中文實務實習', 2), c('歷史實務實習', 2), c('圖書資訊產學實習', 2), c('校外媒體實務', 2), c('創意數位媒體實務（一）', 3), c('智慧人文講堂', 2)], [], ['校內外創新創業競賽前2名可抵免實務實習課程2學分，系統僅提醒不自動判定。']),
    ], tags: ['多元表達', '文化觀覽', '人文資料分析', '跨域敘事', '數位內容'], sources: ['114學年度智慧人文實務創新學程一覽表'],
  },
  {
    id: 'C014', code: 'C014', name: '商管學院商業財經學分學程', college: '商管學院', unit: '國企系', status: PROGRAM_STATUS.ACTIVE,
    totalRules: [minCredit(24), outsideMajor(12)], summary: '核心課程12學分、選修課程12學分；選修進度中財金系至多採計6學分、國企系至多採計6學分，超過可多修但不推進學程進度。',
    groups: [
      group('core', '核心課程', [minCredit(12)], [c('總體經濟學', 3), c('財務管理', 3), c('行銷管理', 3), c('管理學', 3)]),
      group('elective-finance', '選修－財金系', [minCredit(6), maxCredit(6)], [c('投資學', 3), c('金融機構管理', 3), c('國際金融理論', 3, { status: '歷史課程' }), c('金融實務與法規', 3), c('期貨與選擇權', 3), c('財務工程', 3), c('固定收益證券', 2), c('投資銀行', 2), c('國際財務管理', 3), c('個體經濟學', 3)]),
      group('elective-ib', '選修－國企系', [minCredit(6), maxCredit(6)], [c('國際金融', 3), c('國際財務管理', 3), c('個體經濟學', 3), c('國際企業管理', 3), c('國際貿易實務', 3), c('國際貿易理論與政策', 3), c('國際行銷學', 3)]),
    ], notes: ['本學程最低總學分24學分，含核心12學分與選修12學分。', '選修課程包含財金系至少6學分、國企系至少6學分；系統將各系選修進度採計上限設為6學分。', '全學年科目僅修單學期不予承認。'], sources: ['商業財經學分學程.pdf'],
  },
  {
    id: 'C016', code: 'C016', name: '淡江大學企業訓練與數位學習學分學程', college: '商管學院/教育學院', unit: '企管系、教科系', status: PROGRAM_STATUS.ACTIVE,
    totalRules: [minCredit(20), outsideMajor(9)], summary: '依學生系所分A/B修課組合，非兩系可擇一。',
    groups: [
      group('track-a', '修課組合A：企管學生修教科科目', [minCredit(20)], [c('教育科技概論', 3), c('企業訓練實務', 2), c('數位教材發展與評鑑', 2), c('績效科技概論', 2), c('成人學習', 2), c('數位教材製作', 2), c('網頁設計與製作', 3), c('企業概論', 3), c('管理學', 3), c('人力資源管理', 3)]),
      group('track-b', '修課組合B：教科學生修企管科目', [minCredit(21)], [c('企業概論', 3), c('管理學', 3), c('人力資源管理', 3), c('人力資源訓練與發展', 2), c('績效管理', 2), c('科技與服務業經營管理研討', 2), c('國際人力資源管理', 2), c('管理心理學', 2), c('教育科技概論', 3), c('績效科技概論', 2), c('成人學習', 2)]),
    ], path: ['管理學', '人力資源管理'], notes: ['擋修：須先修管理學才能修人力資源管理。'], sources: ['企業訓練與數位學習學分學程實施規則'],
  },
  {
    id: 'C020', code: 'C020', name: '外國語文學院外語翻譯學分學程', college: '外語學院', unit: '外語學院', status: PROGRAM_STATUS.ACTIVE,
    totalRules: [minCredit(18), outsideMajor(9)], groups: [
      group('common', '共同必修', [minCredit(8)], [c('口譯入門', 2), c('筆譯入門', 2), c('翻譯理論導論', 2), c('實務翻譯概論', 2)]),
      group('major-required', '專業必修', [minCredit(4)], [c('英文翻譯（一）', 2), c('英文翻譯（二）', 2), c('西班牙文翻譯（一）', 4), c('法文翻譯（一）', 2), c('法文翻譯（二）', 2), c('德文翻譯（一）', 2), c('德文翻譯（二）', 2), c('日文翻譯（一）', 2), c('日文翻譯（二）', 2), c('俄文證照班B1（一）', 2), c('俄文證照班B1（二）', 2)]),
      group('major-elective', '專業選修', [minCredit(6)], [c('逐步口譯（一）', 2), c('逐步口譯（二）', 2), c('國際會議英文', 2), c('翻譯與文化', 2), c('同步口譯', 2), c('AI輔助口譯入門', 2), c('西語文化導覽', 4), c('中西會議口譯（一）', 2), c('口譯與AI應用（一）', 2), c('AI德語口筆譯（一）', 2), c('日文進階筆譯與AI運用', 2), c('俄國時事熱搜', 2)]),
    ], sources: ['外語翻譯學分學程實施規則'],
  },
  {
    id: 'C023', code: 'C023', name: '商管學院物流管理學分學程', college: '商管學院', unit: '運管系', status: PROGRAM_STATUS.PARTIAL,
    groups: [group('required', '必修', [minCredit(6)], [c('物流管理', 3), c('物流與供應鏈實務專題', 3)]), group('transport', '運輸與物流選修', [minCourse(2)], [c('國際貨物運輸', 2), c('航港管理', 2), c('空運系統營運管理', 3), c('商用車輛營運管理', 3), c('智慧物流營運管理', 2), c('工程經濟學', 3), c('港埠經營與管理', 2), c('航業經營與管理', 2)]), group('business', '商管與資訊選修', [minCourse(2)], [c('生產與作業管理', 3), c('企業資源規劃', 3), c('顧客關係管理', 2), c('電子商務', 3), c('供應鏈管理', 3), c('國際貿易實務', 2), c('國際企業經營實務', 3), c('品質管理', 2)])], sources: ['物流管理學分學程課程清單114'],
  },
  {
    id: 'C029', code: 'C029', name: '淡江大學企業諮商與員工協助方案碩士學分學程', college: '商管學院/教育學院', unit: '企管系、教心所', status: PROGRAM_STATUS.ACTIVE,
    totalRules: [minCredit(12)], groups: [group('counseling', '教育心理與諮商研究所課程', [minCredit(6)], [c('生涯諮商專題研究', 2), c('多元文化諮商專題研究', 2), c('學校社區及企業心理健康專題', 2), c('正向心理學專題研究', 2), c('方案規劃與教育訓練', 2)]), group('business-master', '企業管理學系碩士班課程', [minCredit(6)], [c('組織理論與管理', 3), c('組織行為', 3), c('人力資源管理研討', 3), c('管理心理學', 3)])], sources: ['企業諮商與員工協助方案碩士學分學程'],
  },
  { id: 'C030', code: 'C030', name: '淡江大學精算學分學程', college: '商管學院', unit: '統計系', status: PROGRAM_STATUS.PARTIAL, groups: [group('base', '基礎課程', [], [c('微積分', 4), c('機率論', 3), c('統計學', 3), c('經濟學', 3)]), group('advanced', '進階課程', [], [c('保險精算', 3), c('壽險數學', 3), c('風險理論', 3), c('財務數學', 3)])], sources: ['精算學分學程課程清單圖片'], notes: ['目前由圖片整理，請以原表逐項校對。'] },
  {
    id: 'C042', code: 'C042', name: '工學院智慧機器人學分學程', college: '工學院', unit: '電機系', status: PROGRAM_STATUS.PARTIAL,
    groups: [
      group('base', '基礎必修課程', [minCredit(6)], [c('機器人概論', 2), c('機器人學', 3), c('人工智慧實務', 3), c('邏輯設計', 2), c('數位邏輯設計', 2), c('機器視覺', 3), c('機器人實驗', 2), c('光機電整合實驗', 2)]),
      group('professional', '專業必修', [minCredit(11)], [c('類神經網路概論', 3), c('模糊控制', 3), c('自動控制', 3), c('微處理機', 3), c('微處理機概論', 3)]),
      group('elective', '專業選修', [minCredit(9), outsideMajor(9)], [c('感測器原理及應用', 3), c('機器學習', 3), c('深度學習', 3), c('影像處理', 3), c('無線通訊網路', 2)])
    ], sources: ['使用者提供智慧機器人圖片'],
  },
  {
    id: 'C045', code: 'C045', name: '淡江大學外語華語教學學分學程', college: '外語學院', unit: '外語學院', status: PROGRAM_STATUS.ACTIVE,
    totalRules: [minCredit(20), outsideMajor(9)], groups: [group('common', '共同必修', [minCredit(8)], [c('華語文數位化教學與實務', 2), c('華語文教學概論', 2), c('華語口語與表達', 2), c('漢語語言學', 2)]), group('major-required', '專業必修', [minCredit(6)], [c('英語華語教學', 2), c('法語華語教學', 2), c('德語華語教學', 2), c('日語華語教學', 2), c('俄語華語教學法', 2), c('初階西語華語教學', 4)]), group('major-elective', '專業選修', [minCredit(6)], [c('閱讀當代文化', 2), c('翻譯與文化', 2), c('西語國家文化概論', 2), c('法國文化概論', 2), c('德國文化概論', 2), c('日本歷史（一）', 2), c('千年俄羅斯文化：建築、繪畫、雕塑', 2)])], sources: ['外語華語教學學分學程實施規則'],
  },
  { id: 'C047', code: 'C047', name: '淡江大學民航學分學程（飛行專技組）', college: '工學院/商管學院', unit: '航太系', status: PROGRAM_STATUS.ACTIVE, totalRules: [minCredit(15)], groups: [group('core', '核心課程', [{ type: PROGRAM_RULE_TYPES.MAX_COURSE, credits: 12 }, outsideMajor(6)], [c('運輸學', 3), c('管理學', 3), c('資料探勘與分析導論', 3), c('決策分析', 3), c('人因工程學', 3), c('留學英語會話', 2), c('飛航實務概論', 2), c('航空運輸專題', 2)]), group('flight', '飛行專技組進階', [minCredit(15)], [c('航空工程概論', 1), c('飛行力學', 3), c('飛機系統', 2), c('航空氣象專論', 2), c('基礎航行學', 2), c('航機英文', 2), c('航空儀表學', 2), c('空中交通管制', 2), c('空氣動力學', 3), c('航空英文', 2), c('航空電子系統', 3), c('民用航空法規概論', 2), c('飛機性能分析', 2), c('飛行安全專論', 2), c('航空發動機', 3)])], sources: ['民航學分學程計畫書'] },
  { id: 'C048', code: 'C048', name: '淡江大學民航學分學程（修護組）', college: '工學院/商管學院', unit: '航太系', status: PROGRAM_STATUS.ACTIVE, totalRules: [minCredit(15)], groups: [group('maintenance', '修護組進階', [minCredit(15), outsideMajor(6)], [c('航空工程概論', 1), c('民航學程實習', 9), c('飛機系統', 2), c('廿一世紀的航太產業', 2), c('航太專案管理', 2), c('航機英文', 2), c('航空電子系統', 3), c('航空發動機', 3)])], sources: ['民航學分學程計畫書'] },
  { id: 'C049', code: 'C049', name: '淡江大學空運管理學分學程', college: '商管學院', unit: '運管系', status: PROGRAM_STATUS.PARTIAL, groups: [group('required', '必修', [minCredit(6)], [c('航空規劃管理', 3), c('空運系統營運管理', 3)]), group('transport', '運輸/航空選修', [minCourse(2)], [c('運輸工程', 2), c('運輸經濟', 2), c('航空工程概論', 1), c('空中交通管制', 2), c('物流管理', 3), c('物流與供應鏈實務專題', 3), c('國際貨物運輸', 3), c('工程經濟學', 3), c('運輸事業管理', 3)]), group('business', '商管選修', [minCourse(2)], [c('旅遊事業經營管理', 2), c('民用航空法規概論', 2), c('品質管理', 3), c('供應鏈管理', 3), c('電子商務', 3), c('國際貿易實務', 2), c('行銷策略與實務', 3), c('國際商務英語溝通', 2)])], sources: ['空運管理學分學程課程清單114'] },
  { id: 'C056', code: 'C056', name: '淡江大學外文外交學分學程', college: '外語學院', unit: '外語學院', status: PROGRAM_STATUS.ACTIVE, totalRules: [minCredit(20), outsideMajor(9)], groups: [group('language', '外語能力', [minCredit(8)], [c('外語學院各系必修課程', 8), c('外語授課課程', 8)]), group('politics', '政治群組', [minCourse(1)], [c('國際禮儀', 2), c('國際關係名著選讀', 2), c('西洋外交史', 2), c('拉丁美洲現勢', 2), c('政治學', 3), c('比較政府', 3), c('政治學概論', 2), c('國際現勢', 2)]), group('trade', '經貿群組', [minCourse(1)], [c('國際行銷學', 3), c('國際貿易實務', 2), c('國際貿易理論與政策', 2), c('國際金融', 2), c('國際企業管理', 3), c('國際貿易', 3), c('國際經貿情勢分析', 2)]), group('culture', '文化群組', [minCourse(1)], [c('西語國家文化概論', 2), c('法國廿世紀史', 2), c('德國文化概論', 2), c('德國在歐盟的角色', 2), c('日本社會文化（一）', 2), c('日本歷史（一）', 2), c('俄羅斯概論', 2), c('東亞與世界', 2), c('歐洲文化史', 2), c('文化全球化', 2)])], sources: ['外文外交學分學程實施規則'] },
  { id: 'C060', code: 'C060', name: '淡江大學西語國際企業學分學程', college: '外語學院/商管學院', unit: '西文組', status: PROGRAM_STATUS.ACTIVE, totalRules: [minCredit(24)], groups: [group('spanish', '實用西語課程', [minCredit(15)], [c('西班牙語會話（二）', 8), c('商務西文', 4), c('西語經貿實務', 4)]), group('business', '國際貿易與行銷課程', [minCredit(9)], [c('經濟學', 4), c('管理學', 3), c('行銷管理', 3), c('供應鏈管理', 3), c('行銷策略與實務', 2), c('國際企業管理', 3), c('國際貿易實務', 4), c('全球經貿實務', 2), c('國際行銷學', 3), c('科技管理', 2)])], sources: ['西語國際企業學分學程修習科目認定表'] },
  { id: 'C061', code: 'C061', name: '淡江大學德語國際企業學分學程', college: '外語學院/商管學院', unit: '德文組', status: PROGRAM_STATUS.ACTIVE, totalRules: [minCredit(32)], groups: [group('german', '德語課程', [minCredit(20)], [c('初級德文', 12), c('初級德文文法', 8, { status: '至112學年度' }), c('德語國家面面觀', 2), c('德國文化概論', 2), c('基礎職場德語', 2), c('經貿德語', 2), c('觀光德語', 2)]), group('business', '國際貿易基礎、實務和行銷課程', [minCredit(12)], [c('經濟學', 4), c('管理學', 3), c('行銷管理', 3), c('供應鏈管理', 3), c('行銷策略與實務', 2), c('國際企業管理', 3), c('國際貿易實務', 4), c('國際行銷學', 3)])], sources: ['德語國際企業學分學程設置計畫書'] },
  { id: 'C062', code: 'C062', name: '淡江大學工學院物聯網學分學程', college: '工學院', unit: '資工系', status: PROGRAM_STATUS.ACTIVE, totalRules: [minCredit(21), outsideMajor(9)], groups: [group('base', '基礎課程', [minCredit(6)], [c('計算機程式語言', 3), c('資訊概論', 3), c('程式設計（一）（二）', 4), c('邏輯設計/數位系統設計', 4), c('微處理機', 3)]), group('core', '核心課程', [minCredit(6)], [c('開源軟體實務', 3), c('自動控制', 3), c('微處理機概論', 3), c('作業系統', 3), c('精密機械製造', 3), c('網路概論', 3)]), group('advanced', '進階專業選修', [minCredit(9)], [c('物聯網核心技術', 2), c('大數據與物聯網', 2), c('物聯網概論與應用', 2), c('人工智慧', 2), c('物聯網安全', 2), c('無線通訊網路', 2), c('工業物聯網', 2), c('感測器原理及應用', 3), c('工業4.0特色技術', 3), c('精密加工概論', 3), c('製造聯網整合技術', 3), c('物聯網概論', 3), c('無線網路概論', 3), c('無線感測網路', 3), c('人工智慧與物聯網', 3), c('雲端計算', 3)])], sources: ['工學院物聯網學分學程修業科目表'] },
  { id: 'C063', code: 'C063', name: '淡江大學工程專業領導人才培育學分學程', college: '工學院', unit: '電機系', status: PROGRAM_STATUS.PARTIAL, totalRules: [minCredit(20), outsideMajor(9)], groups: [group('service', '社團與服務選修', [minCredit(2)], [c('社團學習與實作', 1), c('創意與溝通', 1), c('國際領導與服務', 1), c('社團服務學習', 2), c('社團經營與職涯發展', 2)]), group('base', '基礎選修', [minCredit(8)], [c('工程倫理', 2), c('企業倫理', 2), c('管理經濟', 2), c('工程服務管理概論', 2), c('科技永續', 2), c('環境未來', 2), c('科技趨勢', 2), c('經濟未來', 2)]), group('advanced', '專業與進階選修', [minCredit(8)], [c('專業領導相關進階課程', 8)])], sources: ['使用者提供工程專業領導圖片'] },
  { id: 'C064', code: 'C064', name: '淡江大學雙外語經貿人才學分學程', college: '外語學院/商管學院', unit: '外語學院、商管學院', status: PROGRAM_STATUS.ACTIVE, totalRules: [minCredit(23), outsideMajor(9)], groups: [group('base', '基礎課程', [minCredit(5)], [c('企業倫理', 2), c('管理學', 3)]), group('trade', '經貿知識課程', [minCourse(3), minCredit(8)], [c('作業管理', 3), c('行銷管理', 3), c('人力資源管理', 3), c('資訊管理', 3), c('財務管理', 3), c('貨幣與金融體系', 3), c('國際企業管理', 3), c('國際經濟學', 3), c('國際貿易實務', 4)]), group('language', '第二外語語言課程', [minCredit(4)], [c('西班牙文（一）', 4), c('西班牙文（二）', 4), c('法文（一）', 4), c('法文（二）', 4), c('德文（一）', 4), c('德文（二）', 4), c('日文（一）', 4), c('日文（二）', 4), c('俄文（一）', 4), c('俄文（二）', 4)]), group('culture', '第二外語文化課程', [minCourse(2), minCredit(6)], [c('閱讀當代文化', 2), c('西語國家文化概論', 2), c('法國文化概論', 2), c('法國文學概要', 2), c('德語國家面面觀', 2), c('德國文化概論', 2), c('日本社會文化（一）', 2), c('日本現勢', 2), c('千年俄羅斯文化：建築、繪畫、雕塑', 2), c('經貿俄語實務講座', 2)])], sources: ['雙外語經貿人才學分學程實施規則'] },
  { id: 'C068', code: 'C068', name: '淡江大學外語航太學分學程', college: '外語學院/工學院/商管學院', unit: '外語學院、航太系、運管系', status: PROGRAM_STATUS.ACTIVE, totalRules: [minCredit(22), outsideMajor(9)], groups: [group('base', '基礎課程', [minCredit(4)], [c('飛航實務概論', 2), c('航空英文', 2)]), group('aviation', '民航課程', [minCourse(4), minCredit(8)], [c('二十一世紀的航太產業', 2), c('空運系統營運管理', 3), c('航太專案管理', 2), c('航空工程概論', 1), c('飛機系統', 2), c('基礎航行學', 2), c('航空儀表學', 2), c('空中交通管制', 2), c('民用航空法規概論', 2)]), group('language', '第二外語語言課程', [minCredit(4)], [c('英文（一）', 4), c('英文（二）', 4), c('西班牙文（一）', 4), c('法文（一）', 4), c('德文（一）', 4), c('日文（一）', 4), c('俄文（一）', 4)]), group('culture', '第二外語文化課程', [minCourse(2), minCredit(6)], [c('閱讀當代文化', 2), c('閱讀電影文化', 2), c('西語國家文化概論', 2), c('法國文化概論', 2), c('德國文化概論', 2), c('日本社會文化（一）', 2), c('經貿俄語實務講座', 2), c('創新創業企業實習', 2)])], sources: ['外語航太學分學程實施規則'] },
  { id: 'C069', code: 'C069', name: '淡江大學教育心理健康與科技碩士學分學程', college: '教育學院', unit: '教科系、教心所', status: PROGRAM_STATUS.ACTIVE, totalRules: [minCredit(12)], groups: [group('psych', '教育心理與諮商研究所課程', [minCredit(6)], [c('諮商與心理治療理論研究', 3), c('靈性治療專題研究', 2), c('正向心理學與治療專題研究', 2), c('學習診斷與輔導', 2), c('學校輔導工作專題研究', 2), c('創造性藝術治療專題研究', 3), c('學校社區與企業心理健康專題', 2), c('敘事取向同理心訓練專題研究', 2), c('關鍵提問與思考專題研究', 2), c('數位科技應用於教育心理學專題研究', 2)]), group('edtech', '教育科技學系碩士班課程', [minCredit(6)], [c('績效科技', 3), c('訊息介面設計', 3), c('創意學習科技專題研究', 3), c('教育創新與推廣', 3), c('專案管理與評鑑', 3), c('網頁教材設計與製作', 3), c('遠距教育', 3)])], sources: ['使用者提供教育心理健康與科技圖片'] },
  { id: 'C072', code: 'C072', name: '淡江大學永續治理學分學程', college: '商管學院', unit: '企管系', status: PROGRAM_STATUS.PARTIAL, groups: [group('base', '基礎跨域', [minCourse(1)], [c('管理學', 3), c('經濟學', 3), c('企業倫理', 2), c('環境規劃與管理', 3)]), group('topic', '議題主題', [minCourse(1)], [c('永續治理與智慧創新', 3), c('能源經濟', 3), c('金融機構管理', 3), c('運輸環境影響評估', 3), c('專案管理', 3), c('環境經濟學', 3), c('永續觀光運輸', 3), c('產業分析研究', 3), c('環境生態學', 3)]), group('practice', '實作取向', [minCourse(1)], [c('財務報表分析', 3), c('金融實務法規', 3), c('國際企業實務', 3), c('企業環境管理', 3)])], totalRules: [minCourse(4), { type: PROGRAM_RULE_TYPES.ALL_GROUPS_REQUIRED }], notes: ['此筆以114跨領域企業永續治理微學程資料建立。若C072正式學分學程規則不同，需再拆分。'], sources: ['114學年度跨領域企業永續治理微學程圖片'] },
  { id: 'C073', code: 'C073', name: '淡江大學資料科學學分學程', college: '商管學院', unit: '統計系', status: PROGRAM_STATUS.PARTIAL, groups: [group('db', 'DB模組', [], [c('資料庫相關課程', 3)]), group('da', 'DA模組', [], [c('資料分析相關課程', 3)]), group('ai', 'AI模組', [], [c('人工智慧相關課程', 3)])], sources: ['資料科學學分學程課程清單圖片'], notes: ['目前由圖片附件建立骨架，請依原圖補完整課程與學分。'] },
  { id: 'C074', code: 'C074', name: '淡江大學高齡健康服務人才培力學分學程', college: 'USR', unit: '大學社會責任實踐計畫辦公室', status: PROGRAM_STATUS.NEEDS_RULES, groups: [], notes: ['目前僅有一覽表名稱與管理單位，尚缺修業科目表。'], sources: ['跨系所院學分學程一覽表'] },
  { id: 'C075', code: 'C075', name: '淡江大學食農教育人才培力學分學程', college: 'USR', unit: '大學社會責任實踐計畫辦公室', status: PROGRAM_STATUS.NEEDS_RULES, groups: [], notes: ['目前僅有一覽表名稱與管理單位，尚缺修業科目表。'], sources: ['跨系所院學分學程一覽表'] },
  { id: 'AI-EXPLORE', code: 'AI-EXPLORE', name: '淡江大學人工智慧探索應用學分學程', college: 'TAICA/淡江', unit: '跨域AI', status: PROGRAM_STATUS.PARTIAL, groups: [group('probability', '機率', [maxCourse(1)], PROBABILITY), group('programming', '程式設計', [maxCourse(1)], PROGRAMMING), group('ethics', '人工智慧倫理', [maxCourse(1)], AI_ETHICS), group('intro', '人工智慧導論/生成式人工智慧導論', [maxCourse(1)], AI_INTRO), group('application', '人工智慧應用', [maxCourse(1)], [c('機器導航與探索', 3), c('生成式AI應用系統與工程', 3), c('金融科技導論', 3), c('大型語言模型與資訊安全系統', 3), c('AI技術實務', 3), c('AI醫療影像診斷方法', 3)])], path: ['機率', '程式設計', '人工智慧倫理', '人工智慧導論/生成式人工智慧導論', '人工智慧應用'], sources: ['使用者提供AI探索應用圖片'] },
  { id: 'AI-NLP', code: 'AI-NLP', name: '淡江大學人工智慧自然語言技術學分學程', college: 'TAICA/淡江', unit: '跨域AI', status: PROGRAM_STATUS.PARTIAL, groups: [group('intro', '生成式AI基礎/人工智慧導論', [maxCourse(1)], AI_INTRO), group('ethics', 'AI倫理', [maxCourse(1)], AI_ETHICS), group('human-ai', '智慧人機互動', [maxCourse(1)], [c('智慧人機互動', 3), c('網路互動程式設計', 3)]), group('data-mining', '資料探勘與應用', [maxCourse(1)], [c('資料探勘與應用', 3), c('人工智慧與學習', 3)]), group('nlp', '自然語言處理', [maxCourse(1)], [c('自然語言處理', 3)])], path: ['AI導論', 'AI倫理', '智慧人機互動', '資料探勘與應用', '自然語言處理'], sources: ['使用者提供AI自然語言技術圖片'] },
  { id: 'AI-VISION', code: 'AI-VISION', name: '淡江大學人工智慧視覺技術學分學程', college: 'TAICA/淡江', unit: '跨域AI', status: PROGRAM_STATUS.PARTIAL, groups: [group('ml', '機器學習', [maxCourse(1)], [c('生成式AI與機器學習導論', 3), c('機器學習', 3), c('機器學習數學', 3), c('機器學習概論', 3)]), group('ethics', 'AI倫理', [maxCourse(1)], AI_ETHICS), group('dl', '深度學習', [maxCourse(1)], [c('深度學習', 3), c('進階深度學習', 3), c('AI之深度計算入門', 3), c('深度學習概論', 3)]), group('cv', '電腦視覺', [maxCourse(1)], [c('電腦視覺實務與深度學習', 3), c('多媒體與電腦視覺應用', 3)]), group('image-app', 'AI影像應用', [maxCourse(1)], [c('機器導航與探索', 3)])], path: ['機器學習', 'AI倫理', '深度學習', '電腦視覺', 'AI影像應用'], sources: ['使用者提供AI視覺技術圖片'] },
]

export const PROGRAMS = RAW_PROGRAMS
  .filter((program) => !['C074', 'C075'].includes(program.id))
  .map((program) => ({
    ...program,
    name: String(program.name || '').replace(/^淡江大學/, ''),
  }))

export { PROGRAM_RULE_TYPES, PROGRAM_STATUS, programStatusLabel }
