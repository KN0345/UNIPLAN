import { neon } from '@neondatabase/serverless'

const ADMIN_STUDENT_IDS = new Set(['414730209'])
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30

const PATCHED_COMMON_COURSES = [
  {
    "serial": "0600",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王慧娟 (119***)",
    "classroom": "E  401",
    "capacity": "80",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TEIDB.資工系英語班",
    "notes": "限全英語專班學生 ◇全英語授課"
  },
  {
    "serial": "0605",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "馬天樂 (161***)",
    "classroom": "E  304",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TEIDB.資工系英語班",
    "notes": "限全英語專班學生。加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。 ◇全英語授課"
  },
  {
    "serial": "1128",
    "code": "A0159",
    "name": "文學作品讀法 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳凱書 (151***)",
    "classroom": "B  425",
    "capacity": "80",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 6,7",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1129",
    "code": "A0506",
    "name": "英作文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "莊晏甄 (138***)",
    "classroom": "SG 603",
    "capacity": "25",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1130",
    "code": "A0506",
    "name": "英作文（一） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "張介英 (159***)",
    "classroom": "SG 602",
    "capacity": "25",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1131",
    "code": "A0529",
    "name": "英語會話 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "小澤自然 (143***)",
    "classroom": "T  308",
    "capacity": "22",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 8,9",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1132",
    "code": "A0529",
    "name": "英語會話 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "張介英 (159***)",
    "classroom": "E  414",
    "capacity": "22",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 8,9",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1133",
    "code": "A1376",
    "name": "中國語文能力表達 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊素梅 (161***)",
    "classroom": "L  304",
    "capacity": "75",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TFLAB.英文系英語班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1134",
    "code": "E1836",
    "name": "人工智慧導論 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "林先彥 (162***)",
    "classroom": "B  130",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 1,2",
    "department": "TFLAB.英文系英語班",
    "notes": "第10-18週上課，一年級限修本班。111學年度前入學者認列為自由選修學分。通識教育跨領域微學程課程。 ◇全英語授課"
  },
  {
    "serial": "1135",
    "code": "F0755",
    "name": "大一英文 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王蔚婷 (133***)",
    "classroom": "B  120",
    "capacity": "70",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1136",
    "code": "T0863",
    "name": "大學學習 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "張介英, 劉佩勳(159***,165***)",
    "classroom": "B  309",
    "capacity": "10",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "N",
    "time_info": "二 / 9,10",
    "department": "TFLAB.英文系英語班",
    "notes": "隔週上課,一年級限修本班 ◇全英語授課"
  },
  {
    "serial": "1137",
    "code": "T3151",
    "name": "希臘羅馬神話導讀 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "包俊傑 (133***)",
    "classroom": "C  013",
    "capacity": "69",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TFLAB.英文系英語班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1138",
    "code": "T3174",
    "name": "探索永續 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "齊嵩齡 (128***)",
    "classroom": "E  302",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 1,2",
    "department": "TFLAB.英文系英語班",
    "notes": "第1-9週上課，一年級限修本班。111學年度前入學者認列為自由選修學分。 ◇全英語授課"
  },
  {
    "serial": "1139",
    "code": "T9607",
    "name": "校園與社區服務學習 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "賴淑秀 (167***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TFLAB.英文系英語班",
    "notes": "一年級限修本班。 ◇全英語授課"
  },
  {
    "serial": "1140",
    "code": "T9869",
    "name": "男、女生體育 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "吳采陵 (169***)",
    "classroom": "未定",
    "capacity": "70",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TFLAB.英文系英語班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1141",
    "code": "A0318",
    "name": "西洋文學概論 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "齊嵩齡 (128***)",
    "classroom": "T  404",
    "capacity": "80",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TFLAB.英文系英語班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1142",
    "code": "A0507",
    "name": "英作文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "齊嵩齡 (128***)",
    "classroom": "E  302",
    "capacity": "60",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1143",
    "code": "A0535",
    "name": "英語語言學概論 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉佩勳 (165***)",
    "classroom": "E  414",
    "capacity": "75",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1144",
    "code": "A1312",
    "name": "電影與文學 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "莊晏甄 (138***)",
    "classroom": "T  701",
    "capacity": "70",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TFLAB.英文系英語班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1145",
    "code": "A1858",
    "name": "英國文學 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "包俊傑 (133***)",
    "classroom": "B  425",
    "capacity": "80",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1146",
    "code": "F0101",
    "name": "英語口語表達 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王蔚婷 (133***)",
    "classroom": "B  429",
    "capacity": "60",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1147",
    "code": "A0988",
    "name": "小說選讀 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "齊嵩齡 (128***)",
    "classroom": "E  404",
    "capacity": "70",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TFLAB.英文系英語班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1148",
    "code": "A1152",
    "name": "西洋文學批評導讀 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "莊晏甄 (138***)",
    "classroom": "SG 603",
    "capacity": "70",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 6,7",
    "department": "TFLAB.英文系英語班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1149",
    "code": "A0472",
    "name": "美國文學 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "羅艾琳 (136***)",
    "classroom": "Q  202",
    "capacity": "70",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 6,7",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1150",
    "code": "A0484",
    "name": "英文翻譯 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "齊嵩齡 (128***)",
    "classroom": "T  808",
    "capacity": "25",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1151",
    "code": "A0642",
    "name": "莎士比亞 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "莊晏甄 (138***)",
    "classroom": "SG 603",
    "capacity": "95",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TFLAB.英文系英語班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1152",
    "code": "A0888",
    "name": "女性文學 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "涂銘宏 (124***)",
    "classroom": "T  404",
    "capacity": "80",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TFLAB.英文系英語班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1153",
    "code": "A2675",
    "name": "畢業專題(一) (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "齊嵩齡 (128***)",
    "classroom": "T  808",
    "capacity": "",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1154",
    "code": "B0395",
    "name": "商用英文 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "劉佩勳 (165***)",
    "classroom": "B  116",
    "capacity": "90",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TFLAB.英文系英語班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1155",
    "code": "A0159",
    "name": "文學作品讀法 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡振興 (088***)",
    "classroom": "T  212",
    "capacity": "80",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1156",
    "code": "A0159",
    "name": "文學作品讀法 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳怡芬 (119***)",
    "classroom": "L  306",
    "capacity": "80",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系生 ◇全英語授課"
  },
  {
    "serial": "1157",
    "code": "A0506",
    "name": "英作文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "雷　凱 (141***)",
    "classroom": "T  506",
    "capacity": "25",
    "time_data": [
      [
        2,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 8,9",
    "department": "TFLXB.英文系（日）",
    "notes": "A1,限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1158",
    "code": "A0506",
    "name": "英作文（一） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "薛玉政 (134***)",
    "classroom": "L  305",
    "capacity": "25",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "A2,限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1159",
    "code": "A0506",
    "name": "英作文（一） (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "林銘輝 (144***)",
    "classroom": "L  416",
    "capacity": "25",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TFLXB.英文系（日）",
    "notes": "B1,限本系生 ◇以實整虛課程◇雙語授課(中文/英文)"
  },
  {
    "serial": "1160",
    "code": "A0506",
    "name": "英作文（一） (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "熊婷惠 (154***)",
    "classroom": "T  506",
    "capacity": "25",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "D",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "B2,限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1161",
    "code": "A0506",
    "name": "英作文（一） (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳瑜雲 (078***)",
    "classroom": "T  601",
    "capacity": "25",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "E",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "A+B,限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1162",
    "code": "A0529",
    "name": "英語會話 (AA班)",
    "credits": 2,
    "category": "必",
    "teacher": "林嘉鴻 (165***)",
    "classroom": "E  415,T  211",
    "capacity": "22",
    "time_data": [
      [
        2,
        1,
        2
      ],
      [
        2,
        10,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AA",
    "group_type": "",
    "time_info": "二 / 1,2 二 / 10",
    "department": "TFLXB.英文系（日）",
    "notes": "A1,限本系生 ◇全英語授課"
  },
  {
    "serial": "1163",
    "code": "A0529",
    "name": "英語會話 (AB班)",
    "credits": 2,
    "category": "必",
    "teacher": "林嘉鴻 (165***)",
    "classroom": "E  415,V  102",
    "capacity": "22",
    "time_data": [
      [
        2,
        1,
        2
      ],
      [
        4,
        10,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AB",
    "group_type": "",
    "time_info": "二 / 1,2 四 / 10",
    "department": "TFLXB.英文系（日）",
    "notes": "A1,限本系生 ◇全英語授課"
  },
  {
    "serial": "1164",
    "code": "A0529",
    "name": "英語會話 (BA班)",
    "credits": 2,
    "category": "必",
    "teacher": "郭家珍 (141***)",
    "classroom": "T  308,T  211",
    "capacity": "22",
    "time_data": [
      [
        1,
        7,
        8
      ],
      [
        5,
        6,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BA",
    "group_type": "",
    "time_info": "一 / 7,8 五 / 6",
    "department": "TFLXB.英文系（日）",
    "notes": "A2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1165",
    "code": "A0529",
    "name": "英語會話 (BB班)",
    "credits": 2,
    "category": "必",
    "teacher": "郭家珍 (141***)",
    "classroom": "T  308,T  211",
    "capacity": "22",
    "time_data": [
      [
        1,
        7,
        8
      ],
      [
        2,
        10,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BB",
    "group_type": "",
    "time_info": "一 / 7,8 二 / 10",
    "department": "TFLXB.英文系（日）",
    "notes": "A2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1166",
    "code": "A0529",
    "name": "英語會話 (CA班)",
    "credits": 2,
    "category": "必",
    "teacher": "錢欽昭 (134***)",
    "classroom": "SG 602,V  102",
    "capacity": "22",
    "time_data": [
      [
        3,
        7,
        8
      ],
      [
        4,
        10,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "CA",
    "group_type": "",
    "time_info": "三 / 7,8 四 / 10",
    "department": "TFLXB.英文系（日）",
    "notes": "A3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1167",
    "code": "A0529",
    "name": "英語會話 (CB班)",
    "credits": 2,
    "category": "必",
    "teacher": "錢欽昭 (134***)",
    "classroom": "SG 602,T  211",
    "capacity": "22",
    "time_data": [
      [
        3,
        7,
        8
      ],
      [
        5,
        6,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "CB",
    "group_type": "",
    "time_info": "三 / 7,8 五 / 6",
    "department": "TFLXB.英文系（日）",
    "notes": "A3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1168",
    "code": "A0529",
    "name": "英語會話 (DA班)",
    "credits": 2,
    "category": "必",
    "teacher": "雷　凱 (141***)",
    "classroom": "L  304,V  201",
    "capacity": "22",
    "time_data": [
      [
        2,
        6,
        7
      ],
      [
        2,
        1,
        1
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "DA",
    "group_type": "",
    "time_info": "二 / 6,7 二 / 1",
    "department": "TFLXB.英文系（日）",
    "notes": "B1,限本系生 ◇全英語授課"
  },
  {
    "serial": "1169",
    "code": "A0529",
    "name": "英語會話 (DB班)",
    "credits": 2,
    "category": "必",
    "teacher": "雷　凱 (141***)",
    "classroom": "L  304,V  201",
    "capacity": "22",
    "time_data": [
      [
        2,
        6,
        7
      ],
      [
        2,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "DB",
    "group_type": "",
    "time_info": "二 / 6,7 二 / 2",
    "department": "TFLXB.英文系（日）",
    "notes": "B1,限本系生 ◇全英語授課"
  },
  {
    "serial": "1170",
    "code": "A0529",
    "name": "英語會話 (EA班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳凱書 (151***)",
    "classroom": "B  115,V  102",
    "capacity": "22",
    "time_data": [
      [
        4,
        3,
        4
      ],
      [
        3,
        8,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "EA",
    "group_type": "",
    "time_info": "四 / 3,4 三 / 8",
    "department": "TFLXB.英文系（日）",
    "notes": "B2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1171",
    "code": "A0529",
    "name": "英語會話 (EB班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳凱書 (151***)",
    "classroom": "B  115,V  201",
    "capacity": "22",
    "time_data": [
      [
        4,
        3,
        4
      ],
      [
        2,
        1,
        1
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "EB",
    "group_type": "",
    "time_info": "四 / 3,4 二 / 1",
    "department": "TFLXB.英文系（日）",
    "notes": "B2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1172",
    "code": "A0529",
    "name": "英語會話 (FA班)",
    "credits": 2,
    "category": "必",
    "teacher": "熊婷惠 (154***)",
    "classroom": "T  505,V  201",
    "capacity": "22",
    "time_data": [
      [
        4,
        3,
        4
      ],
      [
        2,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "FA",
    "group_type": "",
    "time_info": "四 / 3,4 二 / 2",
    "department": "TFLXB.英文系（日）",
    "notes": "B3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1173",
    "code": "A0529",
    "name": "英語會話 (FB班)",
    "credits": 2,
    "category": "必",
    "teacher": "熊婷惠 (154***)",
    "classroom": "T  505,V  102",
    "capacity": "22",
    "time_data": [
      [
        4,
        3,
        4
      ],
      [
        3,
        8,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "FB",
    "group_type": "",
    "time_info": "四 / 3,4 三 / 8",
    "department": "TFLXB.英文系（日）",
    "notes": "B3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1174",
    "code": "E1836",
    "name": "人工智慧導論 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "饒建奇 (116***)",
    "classroom": "B  217",
    "capacity": "70",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "第10-18週上課，一年級限修本班。111學年度前入學者認列為自由選修學分。通識教育跨領域微學程課程。"
  },
  {
    "serial": "1175",
    "code": "E1836",
    "name": "人工智慧導論 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "饒建奇 (116***)",
    "classroom": "B  217",
    "capacity": "70",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "第1-9週上課，一年級限修本班。111學年度前入學者認列為自由選修學分。通識教育跨領域微學程課程。"
  },
  {
    "serial": "1176",
    "code": "F0755",
    "name": "大一英文 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "雷　凱 (141***)",
    "classroom": "T  404",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "A班 ◇全英語授課"
  },
  {
    "serial": "1177",
    "code": "F0755",
    "name": "大一英文 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "包俊傑 (133***)",
    "classroom": "G  315",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "五 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "B班 ◇全英語授課"
  },
  {
    "serial": "1178",
    "code": "T0863",
    "name": "大學學習 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "薛玉政, 雷　凱(134***,141***)",
    "classroom": "L  201",
    "capacity": "10",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "N",
    "time_info": "一 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "隔週上課，一年級限修本班。轉學生及大二(含)以上凡未取得本課程學分者，得以「學習與發展學門」課程替代。"
  },
  {
    "serial": "1179",
    "code": "T0863",
    "name": "大學學習 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "張雅慧, 熊婷惠(126***,154***)",
    "classroom": "B  120",
    "capacity": "10",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "N",
    "time_info": "一 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "隔週上課，一年級限修本班。轉學生及大二(含)以上凡未取得本課程學分者，得以「學習與發展學門」課程替代。"
  },
  {
    "serial": "1180",
    "code": "T3174",
    "name": "探索永續 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "王㻑媛 (168***)",
    "classroom": "T  401",
    "capacity": "70",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "第1-9週上課，一年級限修本班。111學年度前入學者認列為自由選修學分。"
  },
  {
    "serial": "1181",
    "code": "T3174",
    "name": "探索永續 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "王㻑媛 (168***)",
    "classroom": "T  401",
    "capacity": "70",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "第10-18週上課，一年級限修本班。111學年度前入學者認列為自由選修學分。"
  },
  {
    "serial": "1182",
    "code": "T9607",
    "name": "校園與社區服務學習 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "賴淑秀 (167***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "一年級限修本班，校外課程。"
  },
  {
    "serial": "1183",
    "code": "T9607",
    "name": "校園與社區服務學習 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "賴淑秀 (167***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "一年級限修本班。"
  },
  {
    "serial": "1184",
    "code": "T9703",
    "name": "全民國防教育軍事訓練（一）－國防科技 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "徐建中 (167***)",
    "classroom": "T  311",
    "capacity": "120",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "一年級限修本班"
  },
  {
    "serial": "1185",
    "code": "T9703",
    "name": "全民國防教育軍事訓練（一）－國防科技 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "徐建中 (167***)",
    "classroom": "T  311",
    "capacity": "120",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "一年級限修本班"
  },
  {
    "serial": "1186",
    "code": "T9869",
    "name": "男、女生體育 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳文和 (137***)",
    "classroom": "未定",
    "capacity": "70",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 7,8",
    "department": "TFLXB.英文系（日）",
    "notes": ""
  },
  {
    "serial": "1187",
    "code": "T9869",
    "name": "男、女生體育 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃嘉笙 (158***)",
    "classroom": "未定",
    "capacity": "70",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "五 / 7,8",
    "department": "TFLXB.英文系（日）",
    "notes": ""
  },
  {
    "serial": "1188",
    "code": "A0318",
    "name": "西洋文學概論 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "郭家珍 (141***)",
    "classroom": "T  310",
    "capacity": "80",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "P",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "1189",
    "code": "A0507",
    "name": "英作文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳瑜雲 (078***)",
    "classroom": "T  703",
    "capacity": "25",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "A1,限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1190",
    "code": "A0507",
    "name": "英作文（二） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉佩勳 (165***)",
    "classroom": "E  414",
    "capacity": "25",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "A2,限本系生 ◇以實整虛課程◇雙語授課(中文/英文)"
  },
  {
    "serial": "1191",
    "code": "A0507",
    "name": "英作文（二） (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "王蔚婷 (133***)",
    "classroom": "T  401",
    "capacity": "25",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "A3,限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1192",
    "code": "A0507",
    "name": "英作文（二） (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "張慈珊 (125***)",
    "classroom": "L  407",
    "capacity": "25",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "D",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "B1,限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1193",
    "code": "A0507",
    "name": "英作文（二） (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "張雅慧 (126***)",
    "classroom": "L  417",
    "capacity": "25",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "E",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "B2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1194",
    "code": "A0507",
    "name": "英作文（二） (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "錢欽昭 (134***)",
    "classroom": "Q  202",
    "capacity": "25",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "F",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "B3,限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1195",
    "code": "A0514",
    "name": "英國文學（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "熊婷惠 (154***)",
    "classroom": "T  311",
    "capacity": "80",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1196",
    "code": "A0514",
    "name": "英國文學（一） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡振興 (088***)",
    "classroom": "T  311",
    "capacity": "80",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1197",
    "code": "A0535",
    "name": "英語語言學概論 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "薛玉政 (134***)",
    "classroom": "L  205",
    "capacity": "75",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1198",
    "code": "A0535",
    "name": "英語語言學概論 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "曾郁景 (134***)",
    "classroom": "B  111",
    "capacity": "75",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系生 ◇以實整虛課程◇雙語授課(中文/英文)"
  },
  {
    "serial": "1199",
    "code": "F0101",
    "name": "英語口語表達 (AA班)",
    "credits": 2,
    "category": "必",
    "teacher": "涂銘宏 (124***)",
    "classroom": "L  310,V  102",
    "capacity": "22",
    "time_data": [
      [
        4,
        7,
        8
      ],
      [
        3,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AA",
    "group_type": "",
    "time_info": "四 / 7,8 三 / 2",
    "department": "TFLXB.英文系（日）",
    "notes": "A1,限本系生 ◇跨國遠距◇全英語授課"
  },
  {
    "serial": "1200",
    "code": "F0101",
    "name": "英語口語表達 (AB班)",
    "credits": 2,
    "category": "必",
    "teacher": "涂銘宏 (124***)",
    "classroom": "L  310,V  102",
    "capacity": "22",
    "time_data": [
      [
        4,
        7,
        8
      ],
      [
        4,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AB",
    "group_type": "",
    "time_info": "四 / 7,8 四 / 2",
    "department": "TFLXB.英文系（日）",
    "notes": "A1,限本系生 ◇跨國遠距◇全英語授課"
  },
  {
    "serial": "1201",
    "code": "F0101",
    "name": "英語口語表達 (BA班)",
    "credits": 2,
    "category": "必",
    "teacher": "林怡弟 (118***)",
    "classroom": "T  211,V  102",
    "capacity": "22",
    "time_data": [
      [
        5,
        2,
        3
      ],
      [
        5,
        4,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "BA",
    "group_type": "",
    "time_info": "五 / 2,3 五 / 4",
    "department": "TFLXB.英文系（日）",
    "notes": "A2,限本系 ◇跨國遠距◇全英語授課"
  },
  {
    "serial": "1202",
    "code": "F0101",
    "name": "英語口語表達 (BB班)",
    "credits": 2,
    "category": "必",
    "teacher": "林怡弟 (118***)",
    "classroom": "T  211,V  102",
    "capacity": "22",
    "time_data": [
      [
        5,
        2,
        3
      ],
      [
        3,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "BB",
    "group_type": "",
    "time_info": "五 / 2,3 三 / 2",
    "department": "TFLXB.英文系（日）",
    "notes": "A2,限本系 ◇跨國遠距◇全英語授課"
  },
  {
    "serial": "1203",
    "code": "F0101",
    "name": "英語口語表達 (CA班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄧秋蓉 (138***)",
    "classroom": "T  308,V  102",
    "capacity": "22",
    "time_data": [
      [
        1,
        3,
        4
      ],
      [
        4,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "CA",
    "group_type": "",
    "time_info": "一 / 3,4 四 / 2",
    "department": "TFLXB.英文系（日）",
    "notes": "A3,限本系 ◇全英語授課"
  },
  {
    "serial": "1204",
    "code": "F0101",
    "name": "英語口語表達 (CB班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄧秋蓉 (138***)",
    "classroom": "T  308,V  102",
    "capacity": "22",
    "time_data": [
      [
        1,
        3,
        4
      ],
      [
        5,
        4,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "CB",
    "group_type": "",
    "time_info": "一 / 3,4 五 / 4",
    "department": "TFLXB.英文系（日）",
    "notes": "A3,限本系 ◇全英語授課"
  },
  {
    "serial": "1205",
    "code": "F0101",
    "name": "英語口語表達 (DA班)",
    "credits": 2,
    "category": "必",
    "teacher": "薛玉政 (134***)",
    "classroom": "L  305,V  102",
    "capacity": "22",
    "time_data": [
      [
        3,
        6,
        7
      ],
      [
        3,
        9,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "DA",
    "group_type": "",
    "time_info": "三 / 6,7 三 / 9",
    "department": "TFLXB.英文系（日）",
    "notes": "B1,限本系生 ◇全英語授課"
  },
  {
    "serial": "1206",
    "code": "F0101",
    "name": "英語口語表達 (DB班)",
    "credits": 2,
    "category": "必",
    "teacher": "薛玉政 (134***)",
    "classroom": "L  305,V  102",
    "capacity": "22",
    "time_data": [
      [
        3,
        6,
        7
      ],
      [
        4,
        8,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "DB",
    "group_type": "",
    "time_info": "三 / 6,7 四 / 8",
    "department": "TFLXB.英文系（日）",
    "notes": "B1,限本系生 ◇全英語授課"
  },
  {
    "serial": "1207",
    "code": "F0101",
    "name": "英語口語表達 (EA班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳怡芬 (119***)",
    "classroom": "T  308,V  102",
    "capacity": "22",
    "time_data": [
      [
        2,
        7,
        8
      ],
      [
        5,
        3,
        3
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "EA",
    "group_type": "",
    "time_info": "二 / 7,8 五 / 3",
    "department": "TFLXB.英文系（日）",
    "notes": "B2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1208",
    "code": "F0101",
    "name": "英語口語表達 (EB班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳怡芬 (119***)",
    "classroom": "T  308,V  102",
    "capacity": "22",
    "time_data": [
      [
        2,
        7,
        8
      ],
      [
        3,
        9,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "EB",
    "group_type": "",
    "time_info": "二 / 7,8 三 / 9",
    "department": "TFLXB.英文系（日）",
    "notes": "B2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1209",
    "code": "F0101",
    "name": "英語口語表達 (FA班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡瑞敏 (132***)",
    "classroom": "T  606,V  102",
    "capacity": "22",
    "time_data": [
      [
        2,
        6,
        7
      ],
      [
        4,
        8,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "FA",
    "group_type": "",
    "time_info": "二 / 6,7 四 / 8",
    "department": "TFLXB.英文系（日）",
    "notes": "B3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1210",
    "code": "F0101",
    "name": "英語口語表達 (FB班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡瑞敏 (132***)",
    "classroom": "T  606,V  102",
    "capacity": "22",
    "time_data": [
      [
        2,
        6,
        7
      ],
      [
        5,
        3,
        3
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "FB",
    "group_type": "",
    "time_info": "二 / 6,7 五 / 3",
    "department": "TFLXB.英文系（日）",
    "notes": "B3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1211",
    "code": "F0497",
    "name": "英詩選讀 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "小澤自然 (143***)",
    "classroom": "T  212",
    "capacity": "150",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1212",
    "code": "F0640",
    "name": "希臘神話 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "吳瑜雲 (078***)",
    "classroom": "T  212",
    "capacity": "120",
    "time_data": [
      [
        1,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "一 / 8,9",
    "department": "TFLXB.英文系（日）",
    "notes": ""
  },
  {
    "serial": "1213",
    "code": "A0515",
    "name": "英國文學（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "小澤自然 (143***)",
    "classroom": "T  310",
    "capacity": "75",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系生 ◇全英語授課"
  },
  {
    "serial": "1214",
    "code": "A0515",
    "name": "英國文學（二） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "涂銘宏 (124***)",
    "classroom": "L  212",
    "capacity": "75",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1215",
    "code": "A0532",
    "name": "英語演講 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉佩勳 (165***)",
    "classroom": "T  702",
    "capacity": "22",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "A1,限本系生 ◇全英語授課"
  },
  {
    "serial": "1216",
    "code": "A0532",
    "name": "英語演講 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "張雅慧 (126***)",
    "classroom": "T  308",
    "capacity": "22",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "A2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1217",
    "code": "A0532",
    "name": "英語演講 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "包俊傑 (133***)",
    "classroom": "E  415",
    "capacity": "22",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "A3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1218",
    "code": "A0532",
    "name": "英語演講 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "羅艾琳 (136***)",
    "classroom": "T  309",
    "capacity": "22",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "D",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "A+B,限本系生 ◇全英語授課"
  },
  {
    "serial": "1219",
    "code": "A0532",
    "name": "英語演講 (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "張雅慧 (126***)",
    "classroom": "T  506",
    "capacity": "22",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "E",
    "group_type": "",
    "time_info": "二 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "B1,限本系生 ◇全英語授課"
  },
  {
    "serial": "1220",
    "code": "A0532",
    "name": "英語演講 (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "林銘輝 (144***)",
    "classroom": "T  506",
    "capacity": "22",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "F",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "B2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1221",
    "code": "A0532",
    "name": "英語演講 (G班)",
    "credits": 2,
    "category": "必",
    "teacher": "張慈珊 (125***)",
    "classroom": "L  417",
    "capacity": "22",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "G",
    "group_type": "",
    "time_info": "一 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "B3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1222",
    "code": "A0642",
    "name": "莎士比亞 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "吳怡芬 (119***)",
    "classroom": "T  308",
    "capacity": "95",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1223",
    "code": "A0685",
    "name": "新聞英文 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "黃永裕 (035***)",
    "classroom": "T  310",
    "capacity": "175",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "P",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": ""
  },
  {
    "serial": "1224",
    "code": "A1053",
    "name": "英作文（三） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林嘉鴻 (165***)",
    "classroom": "B  429",
    "capacity": "25",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 8,9",
    "department": "TFLXB.英文系（日）",
    "notes": "A1,限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1225",
    "code": "A1053",
    "name": "英作文（三） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "羅艾琳 (136***)",
    "classroom": "T  309",
    "capacity": "25",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 8,9",
    "department": "TFLXB.英文系（日）",
    "notes": "A2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1226",
    "code": "A1053",
    "name": "英作文（三） (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "包俊傑 (133***)",
    "classroom": "E  415",
    "capacity": "25",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "A3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1227",
    "code": "A1053",
    "name": "英作文（三） (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "涂銘宏 (124***)",
    "classroom": "T  309",
    "capacity": "25",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "D",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "B1,限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1228",
    "code": "A1053",
    "name": "英作文（三） (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "小澤自然 (143***)",
    "classroom": "T  308",
    "capacity": "25",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "E",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "B2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1229",
    "code": "A1053",
    "name": "英作文（三） (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "雷　凱 (141***)",
    "classroom": "T  604",
    "capacity": "25",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "F",
    "group_type": "",
    "time_info": "三 / 8,9",
    "department": "TFLXB.英文系（日）",
    "notes": "B3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1230",
    "code": "F0252",
    "name": "句法學 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "曾郁景 (134***)",
    "classroom": "B  111",
    "capacity": "175",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": ""
  },
  {
    "serial": "1231",
    "code": "F0788",
    "name": "英語教學導論 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "蔡瑞敏 (132***)",
    "classroom": "Q  202",
    "capacity": "175",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "P",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "1232",
    "code": "F0869",
    "name": "語言學習策略與應用 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "雷　凱 (141***)",
    "classroom": "T  212",
    "capacity": "175",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1233",
    "code": "F1079",
    "name": "逐步口譯 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "王　潔 (145***)",
    "classroom": "E  414",
    "capacity": "30",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "P",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "1234",
    "code": "F1081",
    "name": "戲劇與表演 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "林嘉鴻 (165***)",
    "classroom": "T  310",
    "capacity": "175",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "P",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "限英文系學生，且需參與戲劇公演。"
  },
  {
    "serial": "1235",
    "code": "F1677",
    "name": "二語教學法 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "張慈珊 (125***)",
    "classroom": "T  606",
    "capacity": "50",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "P",
    "group_type": "",
    "time_info": "三 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "1236",
    "code": "A0472",
    "name": "美國文學 (A班)",
    "credits": 3,
    "category": "必",
    "teacher": "錢欽昭 (134***)",
    "classroom": "L  416,Q  202",
    "capacity": "70",
    "time_data": [
      [
        2,
        6,
        6
      ],
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 6 四 / 8,9",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系大四生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1237",
    "code": "A0472",
    "name": "美國文學 (B班)",
    "credits": 3,
    "category": "必",
    "teacher": "莊晏甄 (138***)",
    "classroom": "E  413,T  701",
    "capacity": "70",
    "time_data": [
      [
        4,
        5,
        5
      ],
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 5 四 / 8,9",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系大四生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1238",
    "code": "A0472",
    "name": "美國文學 (C班)",
    "credits": 3,
    "category": "必",
    "teacher": "鄧秋蓉 (138***)",
    "classroom": "T  311,T  404",
    "capacity": "70",
    "time_data": [
      [
        3,
        3,
        4
      ],
      [
        3,
        6,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 3,4 三 / 6",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系大四生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1239",
    "code": "A0484",
    "name": "英文翻譯 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄧秋蓉 (138***)",
    "classroom": "SG 602",
    "capacity": "25",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "A1,限本系大四生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1240",
    "code": "A0484",
    "name": "英文翻譯 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳佩筠 (130***)",
    "classroom": "T  704",
    "capacity": "25",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "A2,限本系大四生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1241",
    "code": "A0484",
    "name": "英文翻譯 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "郭家珍 (141***)",
    "classroom": "T  605",
    "capacity": "25",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "B1,限本系大四生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1242",
    "code": "A0484",
    "name": "英文翻譯 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳家倩 (158***)",
    "classroom": "T  702",
    "capacity": "25",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "1",
    "class_name": "D",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "B2,限本系大四生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1243",
    "code": "A0484",
    "name": "英文翻譯 (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳怡芬 (119***)",
    "classroom": "T  308",
    "capacity": "25",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "1",
    "class_name": "E",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "C1,限本系大四生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1244",
    "code": "A0484",
    "name": "英文翻譯 (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "管雅凡 (167***)",
    "classroom": "E  415",
    "capacity": "25",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "1",
    "class_name": "F",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "C2,限本系大四生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1245",
    "code": "A1152",
    "name": "西洋文學批評導讀 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "蔡振興 (088***)",
    "classroom": "T  212",
    "capacity": "175",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "1",
    "class_name": "P",
    "group_type": "",
    "time_info": "五 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "1246",
    "code": "B0395",
    "name": "商用英文 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "張介英 (159***)",
    "classroom": "T  110",
    "capacity": "90",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "1",
    "class_name": "P",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "1247",
    "code": "F0426",
    "name": "閱讀當代文化 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "鄧秋蓉 (138***)",
    "classroom": "T  110",
    "capacity": "90",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "五 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "限大四生"
  },
  {
    "serial": "1248",
    "code": "F0693",
    "name": "同步口譯 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "張介英 (159***)",
    "classroom": "SG 602",
    "capacity": "30",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "1249",
    "code": "F0787",
    "name": "翻譯與文化 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳佩筠 (130***)",
    "classroom": "T  401",
    "capacity": "50",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": ""
  },
  {
    "serial": "1250",
    "code": "F0915",
    "name": "閱讀私探小說 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "錢欽昭 (134***)",
    "classroom": "L  416",
    "capacity": "90",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系生"
  },
  {
    "serial": "1252",
    "code": "F1236",
    "name": "國際會議英文 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "王　潔 (145***)",
    "classroom": "E  415",
    "capacity": "30",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": ""
  },
  {
    "serial": "1253",
    "code": "F1237",
    "name": "企業實習 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "蔡瑞敏 (132***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "1",
    "class_name": "P",
    "group_type": "",
    "time_info": "一 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "本課程為英文系產學合作課程，選課請洽英文系辦。 ◇非全時全職校外實習課程"
  },
  {
    "serial": "1254",
    "code": "F1634",
    "name": "影視翻譯實務 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳家倩 (158***)",
    "classroom": "T  110",
    "capacity": "90",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "1255",
    "code": "F1675",
    "name": "ＡＩ文學與實務 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "林嘉鴻 (165***)",
    "classroom": "T  311",
    "capacity": "90",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "三 / 8,9",
    "department": "TFLXB.英文系（日）",
    "notes": ""
  },
  {
    "serial": "1453",
    "code": "T0466",
    "name": "英文（一） (H班)",
    "credits": 2,
    "category": "必",
    "teacher": "卓建宏 (120***)",
    "classroom": "B  701,L  310",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        5,
        1,
        1
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "H",
    "group_type": "QA",
    "time_info": "五 / 8,9 五 / 1",
    "department": "TGAEB.文學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1457",
    "code": "A0050",
    "name": "英文（二） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳秋月 (127***)",
    "classroom": "B  516",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "QG",
    "time_info": "五 / 8,9",
    "department": "TGAEB.文學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1467",
    "code": "A3321",
    "name": "歷史與數位科技 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "古怡青 (144***)",
    "classroom": "L  303",
    "capacity": "",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "三 / 6,7",
    "department": "TGAHB.榮譽進階專業－文",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1469",
    "code": "A2559",
    "name": "故事企劃實務 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "林其樂 (143***)",
    "classroom": "N  203",
    "capacity": "60",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGAXB.文學院共同科－日",
    "notes": "淡江大學智慧人文實務創新學分學程"
  },
  {
    "serial": "1478",
    "code": "A3328",
    "name": "互動新媒體整合應用 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "施建州, 林俊賢(093***,153***)",
    "classroom": "O  205",
    "capacity": "60",
    "time_data": [
      [
        1,
        6,
        7
      ],
      [
        1,
        8,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 6,7 一 / 8",
    "department": "TGAXB.文學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1487",
    "code": "T2895",
    "name": "愛情關係管理 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "曾陽晴 (998***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "/",
    "department": "TGDLM.遠距教學課程－日",
    "notes": "遠距收播中原大學課程，教學計畫表請至遠距中心網頁查詢 ◇遠距收播外校課程"
  },
  {
    "serial": "1488",
    "code": "T3107",
    "name": "飲食與生醫保健 (A班)",
    "credits": 1,
    "category": "選",
    "teacher": "蘇正元 (998***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "/",
    "department": "TGDLM.遠距教學課程－日",
    "notes": "遠距收播中原大學課程，教學計畫表請至遠距中心網頁查詢 ◇遠距收播外校課程"
  },
  {
    "serial": "1489",
    "code": "T3159",
    "name": "生態材料與經濟 (A班)",
    "credits": 1,
    "category": "選",
    "teacher": "陳宸權 (998***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [
      [
        3,
        10,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 10",
    "department": "TGDLM.遠距教學課程－日",
    "notes": "遠距收播中原大學課程，教學計畫表請至遠距中心網頁查詢 ◇遠距收播外校課程"
  },
  {
    "serial": "1490",
    "code": "D0778",
    "name": "未來學習與人工智慧 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "郭盈芝 (169***)",
    "classroom": "L  110",
    "capacity": "",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 6,7",
    "department": "TGDXB.教育共同科－日",
    "notes": ""
  },
  {
    "serial": "1491",
    "code": "D0778",
    "name": "未來學習與人工智慧 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "郭盈芝 (169***)",
    "classroom": "L  110",
    "capacity": "",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGDXB.教育共同科－日",
    "notes": ""
  },
  {
    "serial": "1492",
    "code": "D0778",
    "name": "未來學習與人工智慧 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "邱俊達 (160***)",
    "classroom": "SG 603",
    "capacity": "",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGDXB.教育共同科－日",
    "notes": "以實整虛課程"
  },
  {
    "serial": "1499",
    "code": "T0466",
    "name": "英文（一） (AG班)",
    "credits": 2,
    "category": "必",
    "teacher": "卓建宏 (120***)",
    "classroom": "E  405,V  201",
    "capacity": "76",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        2,
        9,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AG",
    "group_type": "QA",
    "time_info": "五 / 3,4 二 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1500",
    "code": "T0466",
    "name": "英文（一） (AH班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃郁傑 (152***)",
    "classroom": "B  702,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        2,
        9,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AH",
    "group_type": "QA",
    "time_info": "五 / 3,4 二 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1501",
    "code": "T0466",
    "name": "英文（一） (AI班)",
    "credits": 2,
    "category": "必",
    "teacher": "高淑婷 (134***)",
    "classroom": "E  512,L  104",
    "capacity": "72",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        2,
        9,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AI",
    "group_type": "QA",
    "time_info": "五 / 3,4 二 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1502",
    "code": "T0466",
    "name": "英文（一） (AJ班)",
    "credits": 2,
    "category": "必",
    "teacher": "葉威廷 (161***)",
    "classroom": "E  509,V  102",
    "capacity": "64",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        1,
        9,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AJ",
    "group_type": "QA",
    "time_info": "五 / 3,4 一 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1503",
    "code": "T0466",
    "name": "英文（一） (AK班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳家倩 (158***)",
    "classroom": "E  830,V  201",
    "capacity": "76",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        1,
        9,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AK",
    "group_type": "QA",
    "time_info": "五 / 3,4 一 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1504",
    "code": "T0466",
    "name": "英文（一） (AL班)",
    "credits": 2,
    "category": "必",
    "teacher": "周佳欣 (162***)",
    "classroom": "E  412,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        1,
        9,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AL",
    "group_type": "QA",
    "time_info": "五 / 3,4 一 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1505",
    "code": "T0466",
    "name": "英文（一） (AM班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳律明 (154***)",
    "classroom": "E  416,L  104",
    "capacity": "72",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        1,
        9,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AM",
    "group_type": "QA",
    "time_info": "五 / 3,4 一 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1506",
    "code": "T0466",
    "name": "英文（一） (AN班)",
    "credits": 2,
    "category": "必",
    "teacher": "張淑貞 (153***)",
    "classroom": "E  413,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        4,
        1,
        1
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AN",
    "group_type": "QA",
    "time_info": "五 / 3,4 四 / 1",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1507",
    "code": "T0466",
    "name": "英文（一） (AO班)",
    "credits": 2,
    "category": "必",
    "teacher": "戴淳文 (156***)",
    "classroom": "B  608,L  310",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        4,
        1,
        1
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AO",
    "group_type": "QA",
    "time_info": "五 / 3,4 四 / 1",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1508",
    "code": "T0466",
    "name": "英文（一） (AP班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳璽光 (154***)",
    "classroom": "E  310,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        2,
        9,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AP",
    "group_type": "QA",
    "time_info": "五 / 3,4 二 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1509",
    "code": "T0466",
    "name": "英文（一） (AQ班)",
    "credits": 2,
    "category": "必",
    "teacher": "邱春煌 (161***)",
    "classroom": "B  507,L  202",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        2,
        9,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AQ",
    "group_type": "QA",
    "time_info": "五 / 3,4 二 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1510",
    "code": "T0466",
    "name": "英文（一） (AR班)",
    "credits": 2,
    "category": "必",
    "teacher": "簡伊佐 (153***)",
    "classroom": "B  602,L  310",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        2,
        9,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AR",
    "group_type": "QA",
    "time_info": "五 / 3,4 二 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1511",
    "code": "T0466",
    "name": "英文（一） (AS班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄭秀彬 (164***)",
    "classroom": "E  409,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        1,
        9,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AS",
    "group_type": "QA",
    "time_info": "五 / 3,4 一 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1512",
    "code": "T0466",
    "name": "英文（一） (AT班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳彥凱 (160***)",
    "classroom": "B  607,L  202",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        1,
        9,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AT",
    "group_type": "QA",
    "time_info": "五 / 3,4 一 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1513",
    "code": "T0466",
    "name": "英文（一） (AU班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉育全 (165***)",
    "classroom": "E  415,L  310",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        1,
        9,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AU",
    "group_type": "QA",
    "time_info": "五 / 3,4 一 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1514",
    "code": "A0050",
    "name": "英文（二） (AA班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳瑜雲 (078***)",
    "classroom": "T  701",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AA",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1515",
    "code": "A0050",
    "name": "英文（二） (AB班)",
    "credits": 2,
    "category": "必",
    "teacher": "李金安 (134***)",
    "classroom": "SG 314",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AB",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1516",
    "code": "A0050",
    "name": "英文（二） (AC班)",
    "credits": 2,
    "category": "必",
    "teacher": "薛玉政 (134***)",
    "classroom": "T  404",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AC",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。 ◇全英語授課"
  },
  {
    "serial": "1517",
    "code": "A0050",
    "name": "英文（二） (AD班)",
    "credits": 2,
    "category": "必",
    "teacher": "蘇琬婷 (139***)",
    "classroom": "B  427",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AD",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1518",
    "code": "A0050",
    "name": "英文（二） (AE班)",
    "credits": 2,
    "category": "必",
    "teacher": "高淑婷 (134***)",
    "classroom": "B  426",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AE",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1519",
    "code": "A0050",
    "name": "英文（二） (AF班)",
    "credits": 2,
    "category": "必",
    "teacher": "許邏灣 (085***)",
    "classroom": "E  405",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AF",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1520",
    "code": "A0050",
    "name": "英文（二） (AG班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳韻如 (154***)",
    "classroom": "B  425",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AG",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1521",
    "code": "A0050",
    "name": "英文（二） (AH班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳秋月 (127***)",
    "classroom": "B  516",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AH",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1522",
    "code": "A0050",
    "name": "英文（二） (AI班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃翊之 (161***)",
    "classroom": "B  429",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AI",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。 ◇全英語授課"
  },
  {
    "serial": "1523",
    "code": "A0050",
    "name": "英文（二） (AJ班)",
    "credits": 2,
    "category": "必",
    "teacher": "倪志昇 (136***)",
    "classroom": "B  508",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AJ",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1524",
    "code": "A0050",
    "name": "英文（二） (AK班)",
    "credits": 2,
    "category": "必",
    "teacher": "林楸燕 (143***)",
    "classroom": "B  110",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AK",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1525",
    "code": "A0050",
    "name": "英文（二） (AL班)",
    "credits": 2,
    "category": "必",
    "teacher": "湯雅蘭 (141***)",
    "classroom": "E  830",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AL",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1526",
    "code": "A0050",
    "name": "英文（二） (AM班)",
    "credits": 2,
    "category": "必",
    "teacher": "邱春煌 (161***)",
    "classroom": "B  701",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AM",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1527",
    "code": "A0050",
    "name": "英文（二） (AN班)",
    "credits": 2,
    "category": "必",
    "teacher": "余佳紋 (134***)",
    "classroom": "E  509",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AN",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1528",
    "code": "A0050",
    "name": "英文（二） (AO班)",
    "credits": 2,
    "category": "必",
    "teacher": "周佳欣 (162***)",
    "classroom": "L  413",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AO",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1529",
    "code": "A0050",
    "name": "英文（二） (AP班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃志永 (124***)",
    "classroom": "E  508",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AP",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1530",
    "code": "A0050",
    "name": "英文（二） (AQ班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳潔晞 (159***)",
    "classroom": "E  416",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AQ",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1531",
    "code": "A0050",
    "name": "英文（二） (AR班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳璽光 (154***)",
    "classroom": "E  310",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AR",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1532",
    "code": "A0050",
    "name": "英文（二） (AS班)",
    "credits": 2,
    "category": "必",
    "teacher": "高興雲 (168***)",
    "classroom": "B  116",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AS",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1533",
    "code": "A0050",
    "name": "英文（二） (AT班)",
    "credits": 2,
    "category": "必",
    "teacher": "林怡嘉 (169***)",
    "classroom": "T  109",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AT",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1534",
    "code": "A0050",
    "name": "英文（二） (AU班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉育全 (165***)",
    "classroom": "B  602",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AU",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1535",
    "code": "E3371",
    "name": "工程數理解析 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉承揚 (137***)",
    "classroom": "E  214",
    "capacity": "",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "五 / 1,2",
    "department": "TGEHB.榮譽進階專業－工",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1536",
    "code": "E3495",
    "name": "工程競賽實務與應用 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "曾憲威 (141***)",
    "classroom": "E  232",
    "capacity": "",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "四 / 8,9",
    "department": "TGEHB.榮譽進階專業－工",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1537",
    "code": "E0033",
    "name": "工程與環境 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "李柏青 (122***)",
    "classroom": "E  787",
    "capacity": "140",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 8,9",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1538",
    "code": "E1402",
    "name": "工程倫理 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "蔡明修 (132***)",
    "classroom": "E  787",
    "capacity": "120",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TGEXB.工學院共同科－日",
    "notes": "◇講座課程"
  },
  {
    "serial": "1539",
    "code": "E1670",
    "name": "微機電系統概論 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "楊龍杰 (096***)",
    "classroom": "E  787",
    "capacity": "140",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGEXB.工學院共同科－日",
    "notes": "◇遠距非同步課程"
  },
  {
    "serial": "1540",
    "code": "E1836",
    "name": "人工智慧導論 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "朱威達 (996***)",
    "classroom": "O  502",
    "capacity": "50",
    "time_data": [
      [
        4,
        6,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 6,7,8",
    "department": "TGEXB.工學院共同科－日",
    "notes": "遠距收播【TAICA課程】，請至https://taicatw.net/fall-114/網頁查詢上課方式。 ◇遠距收播外校課程"
  },
  {
    "serial": "1541",
    "code": "E2727",
    "name": "廿一世紀的航太產業 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "馬述聖 (160***)",
    "classroom": "E  787",
    "capacity": "140",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1542",
    "code": "E3405",
    "name": "節能照明技術 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "許世杰 (137***)",
    "classroom": "E  308",
    "capacity": "140",
    "time_data": [
      [
        2,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 8,9",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1543",
    "code": "E3907",
    "name": "建築產業趨勢 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "游雅婷 (150***)",
    "classroom": "B  713",
    "capacity": "140",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGEXB.工學院共同科－日",
    "notes": "◇講座課程"
  },
  {
    "serial": "1544",
    "code": "E3910",
    "name": "智慧製造技術 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "李彥霆 (167***)",
    "classroom": "E  787",
    "capacity": "140",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TGEXB.工學院共同科－日",
    "notes": "◇講座課程"
  },
  {
    "serial": "1545",
    "code": "E4212",
    "name": "建築工程估價概論 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "林景棋 (167***)",
    "classroom": "E  787",
    "capacity": "140",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 6,7",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1546",
    "code": "E4324",
    "name": "人工智慧產業技術 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "游國忠 (133***)",
    "classroom": "E  787",
    "capacity": "140",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGEXB.工學院共同科－日",
    "notes": "◇講座課程"
  },
  {
    "serial": "1547",
    "code": "E4325",
    "name": "半導體世界 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳信良 (124***)",
    "classroom": "E  787",
    "capacity": "140",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 6,7",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1549",
    "code": "E4327",
    "name": "碳定價：趨勢與管理應用 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "劉哲良 (162***)",
    "classroom": "E  411",
    "capacity": "140",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 1,2",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1550",
    "code": "E4331",
    "name": "環境永續與淨零碳管理 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "江昭龍 (168***)",
    "classroom": "E  787",
    "capacity": "140",
    "time_data": [
      [
        1,
        6,
        7
      ],
      [
        2,
        8,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 6,7 二 / 8",
    "department": "TGEXB.工學院共同科－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "1551",
    "code": "E4443",
    "name": "ESG永續發展科技探索 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "林怡仲 (153***)",
    "classroom": "E  787",
    "capacity": "140",
    "time_data": [
      [
        5,
        8,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 8,9,10",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1552",
    "code": "E4444",
    "name": "淨零碳排證照與ESG商機 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "楊少明 (169***)",
    "classroom": "E  787",
    "capacity": "140",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 6,7",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1553",
    "code": "E4464",
    "name": "基礎程式設計（Ｃ＋＋） (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "惠　霖, 温宏斌(121***,996***)",
    "classroom": "E 101A",
    "capacity": "30",
    "time_data": [
      [
        1,
        2,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 2,3,4",
    "department": "TGEXB.工學院共同科－日",
    "notes": "遠距收播【TAICA課程】，請至https://taicatw.net/fall-114/網頁查詢上課方式。惠　霖老師為本校協同教師。 ◇遠距收播外校課程"
  },
  {
    "serial": "1554",
    "code": "S0238",
    "name": "偏微分方程 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "湯敬民 (095***)",
    "classroom": "E  415",
    "capacity": "140",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 6,7",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1555",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "喬　治 (159***)",
    "classroom": "E  404,T  211",
    "capacity": "72",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        3,
        10,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "QA",
    "time_info": "五 / 8,9 三 / 10",
    "department": "TGFEB.外語學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。 ◇全英語授課"
  },
  {
    "serial": "1556",
    "code": "T0466",
    "name": "英文（一） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄧秋蓉 (138***)",
    "classroom": "T  110,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        5,
        7,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "QA",
    "time_info": "五 / 8,9 五 / 7",
    "department": "TGFEB.外語學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1557",
    "code": "T0466",
    "name": "英文（一） (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉俊興 (154***)",
    "classroom": "E  509,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        3,
        10,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "QA",
    "time_info": "五 / 8,9 三 / 10",
    "department": "TGFEB.外語學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1558",
    "code": "T0466",
    "name": "英文（一） (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡郁瑄 (134***)",
    "classroom": "B  513,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        5,
        7,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "D",
    "group_type": "QA",
    "time_info": "五 / 8,9 五 / 7",
    "department": "TGFEB.外語學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1559",
    "code": "T0466",
    "name": "英文（一） (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "喻沐英 (159***)",
    "classroom": "E  410,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        3,
        10,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "E",
    "group_type": "QA",
    "time_info": "五 / 8,9 三 / 10",
    "department": "TGFEB.外語學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1560",
    "code": "T0466",
    "name": "英文（一） (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "張淑貞 (153***)",
    "classroom": "B  606,L  202",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        5,
        7,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "F",
    "group_type": "QA",
    "time_info": "五 / 8,9 五 / 7",
    "department": "TGFEB.外語學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1561",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "薛玉政 (134***)",
    "classroom": "E  308",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGFEB.外語學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。 ◇全英語授課"
  },
  {
    "serial": "1562",
    "code": "A0050",
    "name": "英文（二） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "蘇琬婷 (139***)",
    "classroom": "E  512",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGFEB.外語學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1563",
    "code": "A0050",
    "name": "英文（二） (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃翊之 (161***)",
    "classroom": "B  709",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGFEB.外語學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。 ◇全英語授課"
  },
  {
    "serial": "1564",
    "code": "A0050",
    "name": "英文（二） (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "熊婷惠 (154***)",
    "classroom": "T  605",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "D",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGFEB.外語學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1565",
    "code": "A0050",
    "name": "英文（二） (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳勁宏 (164***)",
    "classroom": "T  704",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "E",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGFEB.外語學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1566",
    "code": "A0050",
    "name": "英文（二） (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "湯雅蘭 (141***)",
    "classroom": "T  401",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "F",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGFEB.外語學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1567",
    "code": "A0050",
    "name": "英文（二） (G班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃志永 (124***)",
    "classroom": "E  508",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "G",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGFEB.外語學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1568",
    "code": "F1753",
    "name": "德國哲學歷史 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "施侯格 (141***)",
    "classroom": "T  705",
    "capacity": "",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "一 / 6,7",
    "department": "TGFHB.榮譽進階專業－外",
    "notes": "榮譽學程進階專業課程，限符合資格者修習 ◇全英語授課"
  },
  {
    "serial": "1569",
    "code": "F1754",
    "name": "西語影視與社會批判 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "羅雅芳 (164***)",
    "classroom": "B  115",
    "capacity": "",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "三 / 7,8",
    "department": "TGFHB.榮譽進階專業－外",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1570",
    "code": "A2516",
    "name": "華語文教學概論 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "袁寧均 (148***)",
    "classroom": "B  425",
    "capacity": "66",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TGFXB.外語學院共同科日",
    "notes": ""
  },
  {
    "serial": "1571",
    "code": "F0782",
    "name": "筆譯入門 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "黃永裕 (035***)",
    "classroom": "E  413",
    "capacity": "50",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TGFXB.外語學院共同科日",
    "notes": "外語學院及外語翻譯學程學生優先選課"
  },
  {
    "serial": "1572",
    "code": "F1103",
    "name": "韓文（一） (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "李相美 (139***)",
    "classroom": "E  405",
    "capacity": "90",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 1,2",
    "department": "TGFXB.外語學院共同科日",
    "notes": ""
  },
  {
    "serial": "1573",
    "code": "F1111",
    "name": "華語文數位化教學與實務 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "袁寧均 (148***)",
    "classroom": "B  216",
    "capacity": "70",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGFXB.外語學院共同科日",
    "notes": ""
  },
  {
    "serial": "1574",
    "code": "F1487",
    "name": "AI與外語學習 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "曾秋桂 (095***)",
    "classroom": "T  212",
    "capacity": "110",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGFXB.外語學院共同科日",
    "notes": "◇講座課程"
  },
  {
    "serial": "1575",
    "code": "F1488",
    "name": "文教產業的創新與創業 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "張義雄 (132***)",
    "classroom": "B  309",
    "capacity": "120",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGFXB.外語學院共同科日",
    "notes": ""
  },
  {
    "serial": "1576",
    "code": "F1530",
    "name": "大學、創新與永續發展 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳麗娟 (135***)",
    "classroom": "E  404",
    "capacity": "160",
    "time_data": [
      [
        1,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 8,9",
    "department": "TGFXB.外語學院共同科日",
    "notes": "◇講座課程"
  },
  {
    "serial": "1577",
    "code": "F1532",
    "name": "印尼文與文化（一） (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "何景榮 (157***)",
    "classroom": "O  306",
    "capacity": "160",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 1,2",
    "department": "TGFXB.外語學院共同科日",
    "notes": ""
  },
  {
    "serial": "1578",
    "code": "F1536",
    "name": "越南文與文化（一） (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "何金蘭 (029***)",
    "classroom": "L  407",
    "capacity": "160",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TGFXB.外語學院共同科日",
    "notes": ""
  },
  {
    "serial": "1580",
    "code": "F1557",
    "name": "烏克蘭文與文化 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "裴方嵐 (161***)",
    "classroom": "T  311",
    "capacity": "160",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGFXB.外語學院共同科日",
    "notes": ""
  },
  {
    "serial": "1581",
    "code": "F1694",
    "name": "外語與會展活動策畫 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "劉愛玲 (122***)",
    "classroom": "T  401",
    "capacity": "70",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGFXB.外語學院共同科日",
    "notes": "◇講座課程"
  },
  {
    "serial": "1582",
    "code": "X0002",
    "name": "進修英文 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "曾郁景 (134***)",
    "classroom": "未定",
    "capacity": "175",
    "time_data": [
      [
        1,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 11,12",
    "department": "TGFXB.外語學院共同科日",
    "notes": "無校際選課，不列入畢業學分數及當學期成績總修學分與平均計算。請依英文系網頁＞通識外語學門公告加選。 ◇遠距非同步課程"
  },
  {
    "serial": "1583",
    "code": "X0002",
    "name": "進修英文 (B班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳佩筠 (130***)",
    "classroom": "未定",
    "capacity": "175",
    "time_data": [
      [
        1,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 11,12",
    "department": "TGFXB.外語學院共同科日",
    "notes": "無校際選課，不列入畢業學分數及當學期成績總修學分與平均計算。請依英文系網頁＞通識外語學門公告加選。 ◇遠距非同步課程"
  },
  {
    "serial": "1584",
    "code": "X0002",
    "name": "進修英文 (C班)",
    "credits": 2,
    "category": "選",
    "teacher": "王慧娟 (119***)",
    "classroom": "未定",
    "capacity": "175",
    "time_data": [
      [
        3,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 11,12",
    "department": "TGFXB.外語學院共同科日",
    "notes": "無校際選課，不列入畢業學分數及當學期成績總修學分與平均計算。請依英文系網頁＞通識外語學門公告加選。 ◇遠距非同步課程"
  },
  {
    "serial": "1585",
    "code": "X0002",
    "name": "進修英文 (D班)",
    "credits": 2,
    "category": "選",
    "teacher": "郭家珍 (141***)",
    "classroom": "未定",
    "capacity": "175",
    "time_data": [
      [
        1,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "",
    "time_info": "一 / 11,12",
    "department": "TGFXB.外語學院共同科日",
    "notes": "無校際選課，不列入畢業學分數及當學期成績總修學分與平均計算。請依英文系網頁＞通識外語學門公告加選。 ◇遠距非同步課程"
  },
  {
    "serial": "1586",
    "code": "K0004",
    "name": "機器學習與應用 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王銀添 (090***)",
    "classroom": "G  102",
    "capacity": "",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "四 / 3,4",
    "department": "TGKHB.榮譽進階－ＡＩ",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1587",
    "code": "E4460",
    "name": "生成式人工智慧與機器學習導論 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "李宏毅 (996***)",
    "classroom": "E  415",
    "capacity": "20",
    "time_data": [
      [
        5,
        7,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 7,8,9",
    "department": "TGKXB.創智學院共同科日",
    "notes": "遠距收播【TAICA課程】，請至https://taicatw.net/fall-114/網頁查詢上課方式。 ◇遠距收播外校課程"
  },
  {
    "serial": "1588",
    "code": "T0466",
    "name": "英文（一） (AA班)",
    "credits": 2,
    "category": "必",
    "teacher": "涂銘宏 (124***)",
    "classroom": "B  309,V  102",
    "capacity": "64",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        5,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AA",
    "group_type": "QA",
    "time_info": "五 / 6,7 五 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1589",
    "code": "T0466",
    "name": "英文（一） (AB班)",
    "credits": 2,
    "category": "必",
    "teacher": "温志樺 (151***)",
    "classroom": "E  813,T  211",
    "capacity": "72",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        2,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AB",
    "group_type": "QA",
    "time_info": "五 / 6,7 二 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1590",
    "code": "T0466",
    "name": "英文（一） (AC班)",
    "credits": 2,
    "category": "必",
    "teacher": "張秋鶯 (164***)",
    "classroom": "B  111,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        5,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AC",
    "group_type": "QA",
    "time_info": "五 / 6,7 五 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1591",
    "code": "T0466",
    "name": "英文（一） (AD班)",
    "credits": 2,
    "category": "必",
    "teacher": "項人慧 (087***)",
    "classroom": "B  615,L  104",
    "capacity": "72",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        5,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AD",
    "group_type": "QA",
    "time_info": "五 / 6,7 五 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1592",
    "code": "T0466",
    "name": "英文（一） (AE班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡郁瑄 (134***)",
    "classroom": "B  513,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        2,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AE",
    "group_type": "QA",
    "time_info": "五 / 6,7 二 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1593",
    "code": "T0466",
    "name": "英文（一） (AF班)",
    "credits": 2,
    "category": "必",
    "teacher": "林敘如 (139***)",
    "classroom": "B  601,L  104",
    "capacity": "72",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        2,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AF",
    "group_type": "QA",
    "time_info": "五 / 6,7 二 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1594",
    "code": "T0466",
    "name": "英文（一） (AG班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡文慈 (164***)",
    "classroom": "B  507,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        2,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AG",
    "group_type": "QA",
    "time_info": "五 / 6,7 二 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1595",
    "code": "T0466",
    "name": "英文（一） (AH班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳勁宏 (164***)",
    "classroom": "L  302,V  201",
    "capacity": "76",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        5,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AH",
    "group_type": "QA",
    "time_info": "五 / 6,7 五 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1596",
    "code": "T0466",
    "name": "英文（一） (AI班)",
    "credits": 2,
    "category": "必",
    "teacher": "簡伊佐 (153***)",
    "classroom": "B  120,L  310",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        5,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AI",
    "group_type": "QA",
    "time_info": "五 / 6,7 五 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1597",
    "code": "T0466",
    "name": "英文（一） (AJ班)",
    "credits": 2,
    "category": "必",
    "teacher": "戴淳文 (156***)",
    "classroom": "B  608,L  202",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        2,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AJ",
    "group_type": "QA",
    "time_info": "五 / 6,7 二 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1598",
    "code": "T0466",
    "name": "英文（一） (BA班)",
    "credits": 2,
    "category": "必",
    "teacher": "范美惠 (049***)",
    "classroom": "L  302,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BA",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1599",
    "code": "T0466",
    "name": "英文（一） (BB班)",
    "credits": 2,
    "category": "必",
    "teacher": "葉威廷 (161***)",
    "classroom": "E  509,L  202",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        1,
        1
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BB",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1600",
    "code": "T0466",
    "name": "英文（一） (BC班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳律明 (154***)",
    "classroom": "E  416,T  211",
    "capacity": "72",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        1,
        1,
        1
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BC",
    "group_type": "QA",
    "time_info": "五 / 1,2 一 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1601",
    "code": "T0466",
    "name": "英文（一） (BD班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳曼華 (154***)",
    "classroom": "E  515,L  202",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BD",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1602",
    "code": "T0466",
    "name": "英文（一） (BE班)",
    "credits": 2,
    "category": "必",
    "teacher": "王寶月 (126***)",
    "classroom": "B  501,L  310",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BE",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1603",
    "code": "T0466",
    "name": "英文（一） (BF班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡郁瑄 (134***)",
    "classroom": "B  513,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BF",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1604",
    "code": "T0466",
    "name": "英文（一） (BG班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃郁傑 (152***)",
    "classroom": "B  702,L  310",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        1,
        1
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BG",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1605",
    "code": "T0466",
    "name": "英文（一） (BH班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳韻如 (154***)",
    "classroom": "B  706,T  211",
    "capacity": "72",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        1,
        1
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BH",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1606",
    "code": "T0466",
    "name": "英文（一） (BI班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳家倩 (158***)",
    "classroom": "E  830,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        1,
        1
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BI",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1607",
    "code": "T0466",
    "name": "英文（一） (BJ班)",
    "credits": 2,
    "category": "必",
    "teacher": "高于晴 (166***)",
    "classroom": "B  429,V  102",
    "capacity": "64",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        1,
        1,
        1
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BJ",
    "group_type": "QA",
    "time_info": "五 / 1,2 一 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1608",
    "code": "T0466",
    "name": "英文（一） (BK班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳彥凱 (160***)",
    "classroom": "B  607,V  201",
    "capacity": "76",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        1,
        1,
        1
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BK",
    "group_type": "QA",
    "time_info": "五 / 1,2 一 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1609",
    "code": "T0466",
    "name": "英文（一） (BL班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄭秀彬 (164***)",
    "classroom": "E  409,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        1,
        1,
        1
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BL",
    "group_type": "QA",
    "time_info": "五 / 1,2 一 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1610",
    "code": "T0466",
    "name": "英文（一） (BM班)",
    "credits": 2,
    "category": "必",
    "teacher": "邱春煌 (161***)",
    "classroom": "B  507,V  201",
    "capacity": "76",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BM",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1611",
    "code": "T0466",
    "name": "英文（一） (BN班)",
    "credits": 2,
    "category": "必",
    "teacher": "戴淳文 (156***)",
    "classroom": "B  608,T  211",
    "capacity": "72",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BN",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1612",
    "code": "T0466",
    "name": "英文（一） (BO班)",
    "credits": 2,
    "category": "必",
    "teacher": "卓建宏 (120***)",
    "classroom": "E  405,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        1,
        1
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BO",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1613",
    "code": "T0466",
    "name": "英文（一） (BP班)",
    "credits": 2,
    "category": "必",
    "teacher": "簡伊佐 (153***)",
    "classroom": "B  602,L  104",
    "capacity": "72",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        1,
        1,
        1
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BP",
    "group_type": "QA",
    "time_info": "五 / 1,2 一 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1614",
    "code": "T0466",
    "name": "英文（一） (BQ班)",
    "credits": 2,
    "category": "必",
    "teacher": "蕭貴徽 (165***)",
    "classroom": "B  110,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        1,
        1,
        1
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BQ",
    "group_type": "QA",
    "time_info": "五 / 1,2 一 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1615",
    "code": "A0050",
    "name": "英文（二） (AA班)",
    "credits": 2,
    "category": "必",
    "teacher": "李金安 (134***)",
    "classroom": "SG 314",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AA",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1616",
    "code": "A0050",
    "name": "英文（二） (AB班)",
    "credits": 2,
    "category": "必",
    "teacher": "邱智銘 (125***)",
    "classroom": "L  306",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AB",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1617",
    "code": "A0050",
    "name": "英文（二） (AC班)",
    "credits": 2,
    "category": "必",
    "teacher": "邱紫穎 (075***)",
    "classroom": "L  412",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AC",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1618",
    "code": "A0050",
    "name": "英文（二） (AD班)",
    "credits": 2,
    "category": "必",
    "teacher": "李碧玉 (168***)",
    "classroom": "B  110",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AD",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1619",
    "code": "A0050",
    "name": "英文（二） (AE班)",
    "credits": 2,
    "category": "必",
    "teacher": "張秋鶯 (164***)",
    "classroom": "B  111",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AE",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1620",
    "code": "A0050",
    "name": "英文（二） (AF班)",
    "credits": 2,
    "category": "必",
    "teacher": "簡珮玲 (136***)",
    "classroom": "T  109",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AF",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1621",
    "code": "A0050",
    "name": "英文（二） (AG班)",
    "credits": 2,
    "category": "必",
    "teacher": "余佳紋 (134***)",
    "classroom": "B  502",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AG",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1622",
    "code": "A0050",
    "name": "英文（二） (AH班)",
    "credits": 2,
    "category": "必",
    "teacher": "江怡菁 (130***)",
    "classroom": "B  613",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AH",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1623",
    "code": "A0050",
    "name": "英文（二） (AI班)",
    "credits": 2,
    "category": "必",
    "teacher": "許筱翎 (164***)",
    "classroom": "B  516",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AI",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1624",
    "code": "A0050",
    "name": "英文（二） (AJ班)",
    "credits": 2,
    "category": "必",
    "teacher": "林怡嘉 (169***)",
    "classroom": "L  308",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AJ",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1625",
    "code": "A0050",
    "name": "英文（二） (AK班)",
    "credits": 2,
    "category": "必",
    "teacher": "郭家珍 (141***)",
    "classroom": "B  601",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "AK",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1626",
    "code": "A0050",
    "name": "英文（二） (BA班)",
    "credits": 2,
    "category": "必",
    "teacher": "李金安 (134***)",
    "classroom": "SG 314",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "BA",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1627",
    "code": "A0050",
    "name": "英文（二） (BB班)",
    "credits": 2,
    "category": "必",
    "teacher": "邱智銘 (125***)",
    "classroom": "L  306",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "BB",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1628",
    "code": "A0050",
    "name": "英文（二） (BC班)",
    "credits": 2,
    "category": "必",
    "teacher": "邱紫穎 (075***)",
    "classroom": "L  412",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "BC",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1629",
    "code": "A0050",
    "name": "英文（二） (BD班)",
    "credits": 2,
    "category": "必",
    "teacher": "曾郁景 (134***)",
    "classroom": "B  309",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "BD",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1630",
    "code": "A0050",
    "name": "英文（二） (BE班)",
    "credits": 2,
    "category": "必",
    "teacher": "張秋鶯 (164***)",
    "classroom": "B  111",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "BE",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1631",
    "code": "A0050",
    "name": "英文（二） (BF班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳秋月 (127***)",
    "classroom": "B  701",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "BF",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1632",
    "code": "A0050",
    "name": "英文（二） (BG班)",
    "credits": 2,
    "category": "必",
    "teacher": "羅得彰 (154***)",
    "classroom": "B  116",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "BG",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1633",
    "code": "A0050",
    "name": "英文（二） (BH班)",
    "credits": 2,
    "category": "必",
    "teacher": "許邏灣 (085***)",
    "classroom": "E  813",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "BH",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1634",
    "code": "A0050",
    "name": "英文（二） (BI班)",
    "credits": 2,
    "category": "必",
    "teacher": "簡珮玲 (136***)",
    "classroom": "T  109",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "BI",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1635",
    "code": "A0050",
    "name": "英文（二） (BJ班)",
    "credits": 2,
    "category": "必",
    "teacher": "余佳紋 (134***)",
    "classroom": "B  502",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "BJ",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1636",
    "code": "A0050",
    "name": "英文（二） (BK班)",
    "credits": 2,
    "category": "必",
    "teacher": "江怡菁 (130***)",
    "classroom": "B  613",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "BK",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1637",
    "code": "A0050",
    "name": "英文（二） (BL班)",
    "credits": 2,
    "category": "必",
    "teacher": "許筱翎 (164***)",
    "classroom": "B  516",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "BL",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1638",
    "code": "A0050",
    "name": "英文（二） (BM班)",
    "credits": 2,
    "category": "必",
    "teacher": "林偉力 (164***)",
    "classroom": "C  013",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "BM",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1639",
    "code": "A0050",
    "name": "英文（二） (BN班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊家蘭 (110***)",
    "classroom": "B  426",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "BN",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1640",
    "code": "A0050",
    "name": "英文（二） (BO班)",
    "credits": 2,
    "category": "必",
    "teacher": "林敘如 (139***)",
    "classroom": "B  512",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "BO",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1641",
    "code": "A0050",
    "name": "英文（二） (BP班)",
    "credits": 2,
    "category": "必",
    "teacher": "洪雨婷 (155***)",
    "classroom": "B  118",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "BP",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1642",
    "code": "A0050",
    "name": "英文（二） (BQ班)",
    "credits": 2,
    "category": "必",
    "teacher": "高興雲 (168***)",
    "classroom": "B  427",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "BQ",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1643",
    "code": "B1814",
    "name": "數位金融創新 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "李沃牆 (131***)",
    "classroom": "B  115",
    "capacity": "",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "二 / 6,7",
    "department": "TGLHB.榮譽進階專業－商",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1644",
    "code": "B1815",
    "name": "AI數據的經濟應用 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林朕陞 (165***)",
    "classroom": "E  232",
    "capacity": "",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "四 / 6,7",
    "department": "TGLHB.榮譽進階專業－商",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1645",
    "code": "B1816",
    "name": "永續治理與智慧創新 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "洪鳴丰, 張雍昇(120***,136***)",
    "classroom": "B  115",
    "capacity": "",
    "time_data": [
      [
        2,
        3,
        3
      ],
      [
        2,
        4,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "二 / 3 二 / 4",
    "department": "TGLHB.榮譽進階專業－商",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1646",
    "code": "M2593",
    "name": "永續設計與創新 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊志德 (122***)",
    "classroom": "B  115",
    "capacity": "",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "四 / 1,2",
    "department": "TGLHB.榮譽進階專業－商",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1647",
    "code": "B1474",
    "name": "經濟倫理 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "賴錦璋 (098***)",
    "classroom": "B  616",
    "capacity": "120",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 6,7",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1648",
    "code": "B1891",
    "name": "ＡＩ倫理準則與應用 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "毛筱艷 (169***)",
    "classroom": "B  501",
    "capacity": "80",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1649",
    "code": "B1893",
    "name": "科技品牌永續行銷及時尚趨勢 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "吳耀邦 (157***)",
    "classroom": "B  713",
    "capacity": "175",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 6,7",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1650",
    "code": "B1895",
    "name": "永續金融、碳定價與永續資訊揭露之ＡＩ應用 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "林呈欣 (164***)",
    "classroom": "B  712",
    "capacity": "175",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 6,7",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1651",
    "code": "B1896",
    "name": "數位經濟發展與資產配置 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "廖仁傑 (161***)",
    "classroom": "E  305",
    "capacity": "120",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 6,7",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1652",
    "code": "B1898",
    "name": "電商與商業證照輔導 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "王永才 (147***)",
    "classroom": "L  401",
    "capacity": "120",
    "time_data": [
      [
        4,
        2,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 2,3,4",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1654",
    "code": "B1904",
    "name": "智慧服務實務研討 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "范之維 (169***)",
    "classroom": "B  616",
    "capacity": "120",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1655",
    "code": "B1907",
    "name": "科技創新與創業實務 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "梁奮鵬 (167***)",
    "classroom": "Q  306",
    "capacity": "120",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1656",
    "code": "B1909",
    "name": "捷運智慧營運管理實務 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "張相胤 (169***)",
    "classroom": "B  509",
    "capacity": "120",
    "time_data": [
      [
        2,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 8,9",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1657",
    "code": "M1923",
    "name": "公共運輸 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "王憲梅 (168***)",
    "classroom": "B  309",
    "capacity": "120",
    "time_data": [
      [
        1,
        2,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 2,3,4",
    "department": "TGLXB.商管學院共同科日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1658",
    "code": "M2238",
    "name": "社會服務(一) (A班)",
    "credits": 1,
    "category": "選",
    "teacher": "顏信輝 (067***)",
    "classroom": "B  705",
    "capacity": "",
    "time_data": [
      [
        3,
        8,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 8",
    "department": "TGLXB.商管學院共同科日",
    "notes": "欲選修者，請洽會計系。"
  },
  {
    "serial": "1660",
    "code": "M2676",
    "name": "智慧金融 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "蔡永澄 (078***)",
    "classroom": "B  504",
    "capacity": "120",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1661",
    "code": "M2678",
    "name": "環境與經濟 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "洪景彬 (162***)",
    "classroom": "B  708",
    "capacity": "120",
    "time_data": [
      [
        5,
        8,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 8,9,10",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1662",
    "code": "M2771",
    "name": "統計學暨實習 (A班)",
    "credits": 4,
    "category": "選",
    "teacher": "陳怡妃, 鍾孟達(133***,157***)",
    "classroom": "B  120",
    "capacity": "30",
    "time_data": [
      [
        3,
        2,
        3
      ],
      [
        3,
        4,
        4
      ],
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 2,3 三 / 4 二 / 6,7",
    "department": "TGLXB.商管學院共同科日",
    "notes": "遠距收播【TAICA課程】請至https://taicatw.net/fall-114/ 查詢。協同教師:陳怡妃.鍾孟達、校外教師:李宗穎 ◇遠距收播外校課程◇全英語授課"
  },
  {
    "serial": "1663",
    "code": "T3154",
    "name": "社會議題探索暨實踐 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳小雀 (074***)",
    "classroom": "未定",
    "capacity": "10",
    "time_data": [
      [
        5,
        9,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 9",
    "department": "TGPNB.三全教育共同科",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1664",
    "code": "T3155",
    "name": "國際學習 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "莊琇惠 (158***)",
    "classroom": "T  212",
    "capacity": "175",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 6,7",
    "department": "TGPNB.三全教育共同科",
    "notes": "資工系全英班2年級、英文系全英班2年級優先選課。 ◇講座課程◇全英語授課"
  },
  {
    "serial": "1665",
    "code": "T3155",
    "name": "國際學習 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "施依萱 (154***)",
    "classroom": "E  305",
    "capacity": "175",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TGPNB.三全教育共同科",
    "notes": "觀光系、政經系全英班2年級優先選課。 ◇講座課程◇全英語授課"
  },
  {
    "serial": "1666",
    "code": "T3156",
    "name": "團隊發展 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "楊博宏 (168***)",
    "classroom": "未定",
    "capacity": "10",
    "time_data": [
      [
        1,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 2",
    "department": "TGPNB.三全教育共同科",
    "notes": "A班(資工系全英班)/4年級優先選課。 ◇全英語授課"
  },
  {
    "serial": "1667",
    "code": "T3156",
    "name": "團隊發展 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "阮聘茹 (134***)",
    "classroom": "未定",
    "capacity": "10",
    "time_data": [
      [
        1,
        3,
        3
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 3",
    "department": "TGPNB.三全教育共同科",
    "notes": "B班(觀光系)/4年級優先選課。 ◇全英語授課"
  },
  {
    "serial": "1668",
    "code": "T3156",
    "name": "團隊發展 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡瑞敏 (132***)",
    "classroom": "未定",
    "capacity": "10",
    "time_data": [
      [
        1,
        6,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "",
    "time_info": "一 / 6",
    "department": "TGPNB.三全教育共同科",
    "notes": "C班(英文系全英班、政經系)/4年級優先選課。 ◇全英語授課"
  },
  {
    "serial": "1669",
    "code": "I0621",
    "name": "多元平等涵納專題 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "梁家恩 (146***)",
    "classroom": "T  801",
    "capacity": "",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "五 / 7,8",
    "department": "TGRHB.榮譽進階專業－國",
    "notes": "榮譽學程進階專業課程，限符合資格者修習 ◇全英語授課"
  },
  {
    "serial": "1670",
    "code": "I0557",
    "name": "多元文化議題初探 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "李亞娜 (168***)",
    "classroom": "B  706",
    "capacity": "70",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 6,7",
    "department": "TGRXB.國際學院共同科日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1671",
    "code": "I0558",
    "name": "從動漫和電視劇看日本 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "蔡錫勲 (114***)",
    "classroom": "T  110",
    "capacity": "70",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGRXB.國際學院共同科日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1672",
    "code": "I0693",
    "name": "ＡＩ與簡報技巧 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "楊仲軒 (154***)",
    "classroom": "T  404",
    "capacity": "30",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 6,7",
    "department": "TGRXB.國際學院共同科日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1673",
    "code": "M2679",
    "name": "循環經濟與永續供應鏈 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳麗娟 (098***)",
    "classroom": "T  605",
    "capacity": "70",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGRXB.國際學院共同科日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1674",
    "code": "P0053",
    "name": "族群與文化 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "黃佳媛 (165***)",
    "classroom": "T  401",
    "capacity": "70",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TGRXB.國際學院共同科日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1675",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "羅得彰 (154***)",
    "classroom": "S  101,L  104",
    "capacity": "72",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        5,
        4,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "QA",
    "time_info": "五 / 6,7 五 / 4",
    "department": "TGSEB.理學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1676",
    "code": "T0466",
    "name": "英文（一） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳怡芬 (119***)",
    "classroom": "L  212,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        5,
        4,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "QA",
    "time_info": "五 / 6,7 五 / 4",
    "department": "TGSEB.理學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1677",
    "code": "T0466",
    "name": "英文（一） (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "簡珮玲 (136***)",
    "classroom": "B  504,V  201",
    "capacity": "76",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        5,
        4,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "QA",
    "time_info": "五 / 6,7 五 / 4",
    "department": "TGSEB.理學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1678",
    "code": "T0466",
    "name": "英文（一） (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "張淑貞 (153***)",
    "classroom": "B  606,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        5,
        4,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "D",
    "group_type": "QA",
    "time_info": "五 / 6,7 五 / 4",
    "department": "TGSEB.理學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1679",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "張玉英 (122***)",
    "classroom": "L  416",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "QG",
    "time_info": "五 / 8,9",
    "department": "TGSEB.理學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1680",
    "code": "A0050",
    "name": "英文（二） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃翊之 (161***)",
    "classroom": "B  429",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "QG",
    "time_info": "五 / 8,9",
    "department": "TGSEB.理學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。 ◇全英語授課"
  },
  {
    "serial": "1681",
    "code": "A0050",
    "name": "英文（二） (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "湯雅蘭 (141***)",
    "classroom": "E  830",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "QG",
    "time_info": "五 / 8,9",
    "department": "TGSEB.理學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1682",
    "code": "S0909",
    "name": "科學論文導讀 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "余成義 (100***)",
    "classroom": "C  012",
    "capacity": "",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "二 / 3,4",
    "department": "TGSHB.榮譽進階專業－理",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1683",
    "code": "A0452",
    "name": "初級日語 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "侯貴娥 (104***)",
    "classroom": "L  417",
    "capacity": "30",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 8,9",
    "department": "TGSXB.理學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1684",
    "code": "S1092",
    "name": "天文中的ＡＩ與數據科學 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "潘璽安 (159***)",
    "classroom": "B  218",
    "capacity": "70",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGSXB.理學院共同科－日",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "1884",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王蔚婷 (133***)",
    "classroom": "B  708",
    "capacity": "80",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 6,7",
    "department": "TLBAB.財金系財管英語班",
    "notes": "限全英語專班學生 ◇全英語授課"
  },
  {
    "serial": "1890",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王建文 (163***)",
    "classroom": "B  601",
    "capacity": "70",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "QG",
    "time_info": "四 / 9,10",
    "department": "TLBAB.財金系財管英語班",
    "notes": "限全英語專班學生。加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。 ◇全英語授課"
  },
  {
    "serial": "1994",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳威任 (166***)",
    "classroom": "B  428",
    "capacity": "80",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TLCAB.企管系英語班",
    "notes": "限全英語專班學生 ◇全英語授課"
  },
  {
    "serial": "2138",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "張慈珊 (125***)",
    "classroom": "B  312",
    "capacity": "80",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TLFBB.國企系國商英語組",
    "notes": "限全英語專班學生 ◇全英語授課"
  },
  {
    "serial": "2144",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "喬　治 (159***)",
    "classroom": "E  404",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TLFBB.國企系國商英語組",
    "notes": "限全英語專班學生。加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。 ◇全英語授課"
  },
  {
    "serial": "2533",
    "code": "T0800",
    "name": "社團服務學習 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳致源 (159***)",
    "classroom": "SG 316",
    "capacity": "60",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "K",
    "time_info": "五 / 6,7",
    "department": "TNUKB.核心課程Ｋ群－日",
    "notes": "本課程不得替代「社團學習與實作」必修學分，僅計為外系選修之畢業學分數。 ◇專業知能服務學習課程"
  },
  {
    "serial": "2534",
    "code": "T2637",
    "name": "社團學習與實作－入門課程 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃文智 (052***)",
    "classroom": "SG 316",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "K",
    "time_info": "五 / 8,9",
    "department": "TNUKB.核心課程Ｋ群－日",
    "notes": "補修班，限日間部重修生，上課6次，上課週次請詳教學計畫表。"
  },
  {
    "serial": "2535",
    "code": "A2928",
    "name": "文學名篇選讀：愛戀與生活 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林偉淑 (140***)",
    "classroom": "L  308",
    "capacity": "69",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "三 / 6,7",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2536",
    "code": "A2928",
    "name": "文學名篇選讀：愛戀與生活 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "謝旻琪 (125***)",
    "classroom": "SG 402",
    "capacity": "69",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "L",
    "time_info": "一 / 3,4",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2537",
    "code": "A2928",
    "name": "文學名篇選讀：愛戀與生活 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "謝旻琪 (125***)",
    "classroom": "L  205",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "L",
    "time_info": "三 / 3,4",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2538",
    "code": "A2928",
    "name": "文學名篇選讀：愛戀與生活 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "謝旻琪 (125***)",
    "classroom": "L  212",
    "capacity": "69",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "L",
    "time_info": "三 / 8,9",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2539",
    "code": "A2928",
    "name": "文學名篇選讀：愛戀與生活 (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "洪婕寧 (152***)",
    "classroom": "Q  306",
    "capacity": "90",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "L",
    "time_info": "三 / 1,2",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇遠距非同步課程"
  },
  {
    "serial": "2540",
    "code": "A2928",
    "name": "文學名篇選讀：愛戀與生活 (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳大道 (110***)",
    "classroom": "L  205",
    "capacity": "69",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "F",
    "group_type": "L",
    "time_info": "一 / 9,10",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2541",
    "code": "A2929",
    "name": "文學名篇選讀：群己與生命 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃文倩 (129***)",
    "classroom": "L  413",
    "capacity": "69",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "二 / 1,2",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2542",
    "code": "A2929",
    "name": "文學名篇選讀：群己與生命 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃文倩 (129***)",
    "classroom": "L  302",
    "capacity": "69",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "L",
    "time_info": "四 / 1,2",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2543",
    "code": "A2929",
    "name": "文學名篇選讀：群己與生命 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊湛維 (167***)",
    "classroom": "SG 402",
    "capacity": "69",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "L",
    "time_info": "五 / 1,2",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2544",
    "code": "A2929",
    "name": "文學名篇選讀：群己與生命 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "孟慶延 (152***)",
    "classroom": "SG 318",
    "capacity": "69",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "L",
    "time_info": "二 / 9,10",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2545",
    "code": "A2930",
    "name": "台灣文學選讀 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "侯如綺 (137***)",
    "classroom": "SG 320",
    "capacity": "69",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "一 / 6,7",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2546",
    "code": "A2931",
    "name": "科幻小說選讀 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林淑瑩 (143***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "五 / 3,4",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2547",
    "code": "A2932",
    "name": "當代英美文學經典 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "羅艾琳 (136***)",
    "classroom": "T  601",
    "capacity": "69",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "五 / 8,9",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2548",
    "code": "F0807",
    "name": "日本文學中譯賞析 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "廖育卿 (135***)",
    "classroom": "L  308",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "三 / 3,4",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2549",
    "code": "F0807",
    "name": "日本文學中譯賞析 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "葉　夌 (152***)",
    "classroom": "L  302",
    "capacity": "69",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "L",
    "time_info": "四 / 6,7",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2550",
    "code": "F1134",
    "name": "西班牙語文學經典賞析 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "李文進 (159***)",
    "classroom": "L  201",
    "capacity": "69",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "二 / 6,7",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": "◇以實整虛課程"
  },
  {
    "serial": "2551",
    "code": "F1135",
    "name": "德語文學名著選讀（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林郁嫺 (152***)",
    "classroom": "T  109",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "二 / 3,4",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": "◇以實整虛課程"
  },
  {
    "serial": "2552",
    "code": "F1136",
    "name": "俄國文學經典入門 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "龔信賢 (146***)",
    "classroom": "L  413",
    "capacity": "69",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "五 / 1,2",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2553",
    "code": "F1139",
    "name": "法國經典文學導讀 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "李建程 (145***)",
    "classroom": "SG 506",
    "capacity": "69",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "五 / 6,7",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2554",
    "code": "T0263",
    "name": "表演藝術－傳統戲曲賞析 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "翁瑋鴻 (163***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        5,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "五 / 9,10",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2555",
    "code": "T0336",
    "name": "數位藝術概論 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "謝朝鐘 (110***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        1,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "一 / 5,6",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": ""
  },
  {
    "serial": "2556",
    "code": "T1287",
    "name": "世界名曲賞析與詮釋 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "干詠穎 (124***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "三 / 3,4",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2557",
    "code": "T1287",
    "name": "世界名曲賞析與詮釋 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "干詠穎 (124***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        3,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "M",
    "time_info": "三 / 5,6",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2558",
    "code": "T2013",
    "name": "西洋歌劇欣賞入門 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林鄉雨 (155***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        5,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "五 / 5,6",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2559",
    "code": "T2013",
    "name": "西洋歌劇欣賞入門 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "林鄉雨 (155***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "M",
    "time_info": "五 / 7,8",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2560",
    "code": "T2014",
    "name": "書法藝術的應用 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "沈　禎 (114***)",
    "classroom": "L  303",
    "capacity": "35",
    "time_data": [
      [
        4,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "四 / 5,6",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": ""
  },
  {
    "serial": "2561",
    "code": "T2016",
    "name": "造型藝術中的基礎素描技法 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "戴佳茹 (131***)",
    "classroom": "H  103",
    "capacity": "25",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "二 / 7,8",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2562",
    "code": "T2016",
    "name": "造型藝術中的基礎素描技法 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊春森 (145***)",
    "classroom": "H  103",
    "capacity": "25",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "M",
    "time_info": "四 / 7,8",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2563",
    "code": "T2104",
    "name": "鋼琴藝術與生活 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "李珮瑜 (117***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        4,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "四 / 5,6",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2564",
    "code": "T2105",
    "name": "音樂與藝術的對話 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "李珮瑜 (117***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "一 / 3,4",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2565",
    "code": "T2105",
    "name": "音樂與藝術的對話 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "李珮瑜 (117***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "M",
    "time_info": "二 / 3,4",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2566",
    "code": "T2105",
    "name": "音樂與藝術的對話 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "李珮瑜 (117***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "M",
    "time_info": "四 / 7,8",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2567",
    "code": "T2916",
    "name": "身體語言與舞蹈藝術 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳文琪 (148***)",
    "classroom": "H  103",
    "capacity": "30",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "三 / 3,4",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2568",
    "code": "T2916",
    "name": "身體語言與舞蹈藝術 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳文琪 (148***)",
    "classroom": "H  103",
    "capacity": "30",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "M",
    "time_info": "四 / 3,4",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2569",
    "code": "T3050",
    "name": "從文本到舞台─讀劇概論 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳慧勻 (144***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "四 / 3,4",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2570",
    "code": "T3051",
    "name": "歐洲文化藝術行旅 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "戴佳茹 (131***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "一 / 7,8",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇遠距非同步課程"
  },
  {
    "serial": "2571",
    "code": "T3051",
    "name": "歐洲文化藝術行旅 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "戴佳茹 (131***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "M",
    "time_info": "一 / 9,10",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇遠距非同步課程"
  },
  {
    "serial": "2572",
    "code": "T3178",
    "name": "藝術陪伴 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "戴佳茹 (131***)",
    "classroom": "H  103",
    "capacity": "25",
    "time_data": [
      [
        2,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "二 / 5,6",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "◇專業知能服務學習課程"
  },
  {
    "serial": "2573",
    "code": "T3249",
    "name": "音樂概論與數位應用 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "干詠穎 (124***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        2,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "二 / 5,6",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2574",
    "code": "T3249",
    "name": "音樂概論與數位應用 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "干詠穎 (124***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "M",
    "time_info": "五 / 3,4",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2575",
    "code": "T3269",
    "name": "世界舞蹈概論與實作 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳文琪 (148***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "四 / 9,10",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": ""
  },
  {
    "serial": "2576",
    "code": "T3288",
    "name": "表演藝術－當代舞蹈賞析與體驗 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳文琪 (148***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "二 / 7,8",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": ""
  },
  {
    "serial": "2577",
    "code": "T3289",
    "name": "表演藝術與實作 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳慧勻 (144***)",
    "classroom": "V  101",
    "capacity": "90",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "三 / 7,8",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇遠距非同步課程"
  },
  {
    "serial": "2578",
    "code": "T3290",
    "name": "跨文化藝術與宗教 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡秀卿 (150***)",
    "classroom": "B  426",
    "capacity": "69",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "三 / 9,10",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2579",
    "code": "T0871",
    "name": "動機與壓力管理 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳玉樺 (167***)",
    "classroom": "L  212",
    "capacity": "75",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "N",
    "time_info": "二 / 6,7",
    "department": "TNUNB.核心課程Ｎ群－日",
    "notes": "轉學生及大二(含)以上凡未取得「大學學習」課程學分者，得以「學習與發展學門」課程替代。"
  },
  {
    "serial": "2580",
    "code": "T0951",
    "name": "學習適應與管理 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "許哲修 (166***)",
    "classroom": "E  310",
    "capacity": "75",
    "time_data": [
      [
        1,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "N",
    "time_info": "一 / 8,9",
    "department": "TNUNB.核心課程Ｎ群－日",
    "notes": "轉學生及大二(含)以上凡未取得「大學學習」課程學分者，得以「學習與發展學門」課程替代。"
  },
  {
    "serial": "2581",
    "code": "T0951",
    "name": "學習適應與管理 (B班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳玉樺 (167***)",
    "classroom": "L  413",
    "capacity": "75",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "N",
    "time_info": "二 / 3,4",
    "department": "TNUNB.核心課程Ｎ群－日",
    "notes": "轉學生及大二(含)以上凡未取得「大學學習」課程學分者，得以「學習與發展學門」課程替代。"
  },
  {
    "serial": "2582",
    "code": "T2921",
    "name": "大學生生涯發展 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "張瓊方 (167***)",
    "classroom": "E  302",
    "capacity": "75",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "N",
    "time_info": "三 / 3,4",
    "department": "TNUNB.核心課程Ｎ群－日",
    "notes": "轉學生及大二(含)以上凡未取得「大學學習」課程學分者，得以「學習與發展學門」課程替代。"
  },
  {
    "serial": "2583",
    "code": "T2921",
    "name": "大學生生涯發展 (B班)",
    "credits": 2,
    "category": "選",
    "teacher": "許哲修 (166***)",
    "classroom": "E  310",
    "capacity": "75",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "N",
    "time_info": "一 / 6,7",
    "department": "TNUNB.核心課程Ｎ群－日",
    "notes": "轉學生及大二(含)以上凡未取得「大學學習」課程學分者，得以「學習與發展學門」課程替代。"
  },
  {
    "serial": "2584",
    "code": "T2921",
    "name": "大學生生涯發展 (C班)",
    "credits": 2,
    "category": "選",
    "teacher": "邱惟真 (146***)",
    "classroom": "E  302",
    "capacity": "75",
    "time_data": [
      [
        4,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "N",
    "time_info": "四 / 5,6",
    "department": "TNUNB.核心課程Ｎ群－日",
    "notes": "轉學生及大二(含)以上凡未取得「大學學習」課程學分者，得以「學習與發展學門」課程替代。"
  },
  {
    "serial": "2585",
    "code": "E3528",
    "name": "網路與資訊科技 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "賴盛維 (154***)",
    "classroom": "B  216",
    "capacity": "70",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "O",
    "time_info": "二 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2586",
    "code": "E3528",
    "name": "網路與資訊科技 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "王元慶 (160***)",
    "classroom": "B  206",
    "capacity": "50",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "O",
    "time_info": "五 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2588",
    "code": "E3529",
    "name": "OFFICE證照實務 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳智揚 (130***)",
    "classroom": "B  113",
    "capacity": "120",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "O",
    "time_info": "三 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2589",
    "code": "E3529",
    "name": "OFFICE證照實務 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳智揚 (130***)",
    "classroom": "B  113",
    "capacity": "120",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "O",
    "time_info": "三 / 8,9",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2590",
    "code": "E3529",
    "name": "OFFICE證照實務 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉文琇 (145***)",
    "classroom": "B  113",
    "capacity": "115",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "O",
    "time_info": "四 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2591",
    "code": "E3531",
    "name": "多媒體實務與應用 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳德展 (146***)",
    "classroom": "B  218",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "O",
    "time_info": "五 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2592",
    "code": "E3861",
    "name": "Python程式語言 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃子嘉 (142***)",
    "classroom": "B  130",
    "capacity": "70",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "O",
    "time_info": "四 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2593",
    "code": "E3861",
    "name": "Python程式語言 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "曹乃龍 (131***)",
    "classroom": "B  216",
    "capacity": "70",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "O",
    "time_info": "三 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2594",
    "code": "E3861",
    "name": "Python程式語言 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "張漢琦 (156***)",
    "classroom": "B  217",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "O",
    "time_info": "五 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2595",
    "code": "E3861",
    "name": "Python程式語言 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "馮若梅 (168***)",
    "classroom": "B  216",
    "capacity": "70",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "O",
    "time_info": "四 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2596",
    "code": "E3862",
    "name": "電腦入門與程式思維 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "洪復一 (139***)",
    "classroom": "B  130",
    "capacity": "70",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "O",
    "time_info": "二 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2597",
    "code": "E3862",
    "name": "電腦入門與程式思維 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "歐陽崇榮 (071***)",
    "classroom": "B  218",
    "capacity": "70",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "O",
    "time_info": "三 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2598",
    "code": "E3862",
    "name": "電腦入門與程式思維 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳映濃 (168***)",
    "classroom": "B  218",
    "capacity": "70",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "O",
    "time_info": "四 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2599",
    "code": "E4296",
    "name": "資通安全管理概論 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃仁俊 (114***)",
    "classroom": "G  315",
    "capacity": "120",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "O",
    "time_info": "一 / 3,4",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2600",
    "code": "T0205",
    "name": "網頁程式設計 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃信貿 (166***)",
    "classroom": "B  217",
    "capacity": "70",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "O",
    "time_info": "四 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2601",
    "code": "A2020",
    "name": "中國歷史文物賞析 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "郭鎧銘 (150***)",
    "classroom": "SG 320",
    "capacity": "69",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "P",
    "time_info": "三 / 6,7",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": ""
  },
  {
    "serial": "2602",
    "code": "A2062",
    "name": "中國歷史與人物 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "戴月芳 (064***)",
    "classroom": "SG 319",
    "capacity": "69",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "P",
    "time_info": "四 / 8,9",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": ""
  },
  {
    "serial": "2603",
    "code": "A2062",
    "name": "中國歷史與人物 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "談士榮 (164***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "P",
    "time_info": "一 / 1,2",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": "◇以實整虛課程"
  },
  {
    "serial": "2604",
    "code": "A2062",
    "name": "中國歷史與人物 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "張志強 (143***)",
    "classroom": "L  308",
    "capacity": "69",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "P",
    "time_info": "三 / 8,9",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": ""
  },
  {
    "serial": "2605",
    "code": "A2062",
    "name": "中國歷史與人物 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡忠志 (157***)",
    "classroom": "SG 319",
    "capacity": "69",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "P",
    "time_info": "二 / 9,10",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": ""
  },
  {
    "serial": "2606",
    "code": "A2368",
    "name": "近代史事叢譚 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳景傑 (162***)",
    "classroom": "SG 320",
    "capacity": "69",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "P",
    "time_info": "五 / 6,7",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": ""
  },
  {
    "serial": "2607",
    "code": "A2368",
    "name": "近代史事叢譚 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "宮國威 (100***)",
    "classroom": "SG 506",
    "capacity": "69",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "P",
    "time_info": "三 / 8,9",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": ""
  },
  {
    "serial": "2608",
    "code": "A2505",
    "name": "西洋歷史與人物 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊仲軒 (154***)",
    "classroom": "T  404",
    "capacity": "69",
    "time_data": [
      [
        1,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "P",
    "time_info": "一 / 8,9",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2609",
    "code": "A2505",
    "name": "西洋歷史與人物 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡育潞 (155***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "P",
    "time_info": "五 / 1,2",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": "◇以實整虛課程◇雙語授課(中文/英文)"
  },
  {
    "serial": "2610",
    "code": "A3454",
    "name": "台灣歷史采風與踏查 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳世芳 (149***)",
    "classroom": "SG 319",
    "capacity": "69",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "P",
    "time_info": "四 / 6,7",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": ""
  },
  {
    "serial": "2611",
    "code": "A3454",
    "name": "台灣歷史采風與踏查 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "曾令毅 (145***)",
    "classroom": "SG 504",
    "capacity": "69",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "P",
    "time_info": "五 / 1,2",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": ""
  },
  {
    "serial": "2612",
    "code": "A3454",
    "name": "台灣歷史采風與踏查 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳省身 (164***)",
    "classroom": "SG 319",
    "capacity": "69",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "P",
    "time_info": "二 / 1,2",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": ""
  },
  {
    "serial": "2613",
    "code": "A3454",
    "name": "台灣歷史采風與踏查 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄭睦群 (150***)",
    "classroom": "SG 504",
    "capacity": "69",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "P",
    "time_info": "一 / 6,7",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": ""
  },
  {
    "serial": "2614",
    "code": "A3454",
    "name": "台灣歷史采風與踏查 (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "李月娥 (161***)",
    "classroom": "SG 316",
    "capacity": "69",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "P",
    "time_info": "二 / 6,7",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": ""
  },
  {
    "serial": "2615",
    "code": "A3454",
    "name": "台灣歷史采風與踏查 (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "翁意軒 (168***)",
    "classroom": "SG 319",
    "capacity": "69",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "F",
    "group_type": "P",
    "time_info": "五 / 8,9",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": ""
  },
  {
    "serial": "2616",
    "code": "A2505",
    "name": "西洋歷史與人物 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊仲軒 (154***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "P",
    "time_info": "一 / 3,4",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": ""
  },
  {
    "serial": "2617",
    "code": "T2972",
    "name": "台灣海洋歷史與文化 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃子嘉 (142***)",
    "classroom": "L  308",
    "capacity": "69",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "P",
    "time_info": "三 / 1,2",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": ""
  },
  {
    "serial": "2618",
    "code": "T3250",
    "name": "走進東南亞 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳琮淵 (155***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "P",
    "time_info": "三 / 3,4",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修。"
  },
  {
    "serial": "2619",
    "code": "T3250",
    "name": "走進東南亞 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "莊仁傑 (169***)",
    "classroom": "B  504",
    "capacity": "69",
    "time_data": [
      [
        5,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "P",
    "time_info": "五 / 9,10",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修。"
  },
  {
    "serial": "2620",
    "code": "T3251",
    "name": "走讀歷史與踏查 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "袁明道 (146***)",
    "classroom": "SG 321",
    "capacity": "90",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "P",
    "time_info": "二 / 3,4",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修。"
  },
  {
    "serial": "2621",
    "code": "T3251",
    "name": "走讀歷史與踏查 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "袁明道 (146***)",
    "classroom": "SG 321",
    "capacity": "69",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "P",
    "time_info": "二 / 1,2",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修。"
  },
  {
    "serial": "2622",
    "code": "T3252",
    "name": "從小說看歷史 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳景傑 (162***)",
    "classroom": "SG 320",
    "capacity": "69",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "P",
    "time_info": "五 / 3,4",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修。"
  },
  {
    "serial": "2623",
    "code": "T3255",
    "name": "從藝術看歷史 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡育潞 (155***)",
    "classroom": "SG 320",
    "capacity": "69",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "P",
    "time_info": "四 / 3,4",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修。"
  },
  {
    "serial": "2624",
    "code": "A0766",
    "name": "德文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "孫敏學 (148***)",
    "classroom": "T  605,L  104",
    "capacity": "55",
    "time_data": [
      [
        3,
        1,
        2
      ],
      [
        4,
        5,
        5
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "QE",
    "time_info": "三 / 1,2 四 / 5",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為德文者、德文系學生皆不得選修 ◇全英語授課"
  },
  {
    "serial": "2625",
    "code": "T0467",
    "name": "日文（一） (AA班)",
    "credits": 2,
    "category": "必",
    "teacher": "康翊軒 (158***)",
    "classroom": "E  413,T  211",
    "capacity": "55",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        3,
        9,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AA",
    "group_type": "QD",
    "time_info": "五 / 6,7 三 / 9",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為日文者、日文系學生皆不得選修；需繳語言實習費"
  },
  {
    "serial": "2626",
    "code": "T0467",
    "name": "日文（一） (AB班)",
    "credits": 2,
    "category": "必",
    "teacher": "康翊軒 (158***)",
    "classroom": "E  413,L  104",
    "capacity": "55",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        3,
        1,
        1
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AB",
    "group_type": "QD",
    "time_info": "五 / 6,7 三 / 1",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為日文者、日文系學生皆不得選修；需繳語言實習費"
  },
  {
    "serial": "2629",
    "code": "T0467",
    "name": "日文（一） (CA班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳宜真 (130***)",
    "classroom": "L  308,T  211",
    "capacity": "55",
    "time_data": [
      [
        2,
        8,
        9
      ],
      [
        4,
        7,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "CA",
    "group_type": "QD",
    "time_info": "二 / 8,9 四 / 7",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為日文者、日文系學生皆不得選修；需繳語言實習費。"
  },
  {
    "serial": "2631",
    "code": "T0467",
    "name": "日文（一） (DA班)",
    "credits": 2,
    "category": "必",
    "teacher": "張聖昌 (164***)",
    "classroom": "B  607,T  211",
    "capacity": "55",
    "time_data": [
      [
        4,
        8,
        9
      ],
      [
        2,
        9,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "DA",
    "group_type": "QD",
    "time_info": "四 / 8,9 二 / 9",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為日文者、日文系學生皆不得選修；需繳語言實習費。"
  },
  {
    "serial": "2633",
    "code": "T0467",
    "name": "日文（一） (EA班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃菲蓉 (141***)",
    "classroom": "SG 320,T  211",
    "capacity": "55",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        4,
        6,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "EA",
    "group_type": "QD",
    "time_info": "五 / 1,2 四 / 6",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為日文者、日文系學生皆不得選修；需繳語言實習費。"
  },
  {
    "serial": "2635",
    "code": "T0467",
    "name": "日文（一） (FA班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳淑圓 (139***)",
    "classroom": "L  212,T  211",
    "capacity": "55",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        2,
        6,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "FA",
    "group_type": "QD",
    "time_info": "五 / 1,2 二 / 6",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為日文者、日文系學生皆不得選修；需繳語言實習費。"
  },
  {
    "serial": "2637",
    "code": "T0467",
    "name": "日文（一） (GA班)",
    "credits": 2,
    "category": "必",
    "teacher": "廖兆陽 (096***)",
    "classroom": "T  704,L  104",
    "capacity": "55",
    "time_data": [
      [
        4,
        3,
        4
      ],
      [
        3,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "GA",
    "group_type": "QD",
    "time_info": "四 / 3,4 三 / 2",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為日文者、日文系學生皆不得選修；需繳語言實習費。"
  },
  {
    "serial": "2639",
    "code": "T0468",
    "name": "俄文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "律可娃柳博芙 (135***)",
    "classroom": "T  408,T  211",
    "capacity": "55",
    "time_data": [
      [
        3,
        6,
        7
      ],
      [
        1,
        6,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "QF",
    "time_info": "三 / 6,7 一 / 6",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為俄文者、俄文系學生皆不得選修；需繳語言實習費。以俄文、英文授課。 ◇全英語授課"
  },
  {
    "serial": "2641",
    "code": "T0470",
    "name": "西班牙文（一） (AB班)",
    "credits": 2,
    "category": "必",
    "teacher": "何萬儀 (122***)",
    "classroom": "H  116,V  201",
    "capacity": "55",
    "time_data": [
      [
        2,
        3,
        4
      ],
      [
        4,
        7,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AB",
    "group_type": "QC",
    "time_info": "二 / 3,4 四 / 7",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為西班牙文者、西班牙文系學生皆不得選修；需繳語言實習費。"
  },
  {
    "serial": "2643",
    "code": "T0470",
    "name": "西班牙文（一） (BB班)",
    "credits": 2,
    "category": "必",
    "teacher": "何萬儀 (122***)",
    "classroom": "B  309,V  201",
    "capacity": "55",
    "time_data": [
      [
        4,
        3,
        4
      ],
      [
        4,
        7,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BB",
    "group_type": "QC",
    "time_info": "四 / 3,4 四 / 7",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為西班牙文者、西班牙文系學生皆不得選修；需繳語言實習費。"
  },
  {
    "serial": "2645",
    "code": "T0479",
    "name": "法文（一） (AA班)",
    "credits": 2,
    "category": "必",
    "teacher": "徐琿輝 (104***)",
    "classroom": "L  306,L  202",
    "capacity": "55",
    "time_data": [
      [
        2,
        6,
        7
      ],
      [
        4,
        6,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "AA",
    "group_type": "QB",
    "time_info": "二 / 6,7 四 / 6",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為法文者、法文系學生皆不得選修；需繳語言實習費。"
  },
  {
    "serial": "2647",
    "code": "T0479",
    "name": "法文（一） (BA班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳鏡如 (117***)",
    "classroom": "L  306,L  202",
    "capacity": "55",
    "time_data": [
      [
        2,
        8,
        9
      ],
      [
        4,
        6,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "BA",
    "group_type": "QB",
    "time_info": "二 / 8,9 四 / 6",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為法文者、法文系學生皆不得選修；需繳語言實習費。"
  },
  {
    "serial": "2658",
    "code": "D0737",
    "name": "教育未來 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳錫珍 (116***)",
    "classroom": "SG 504",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "R",
    "time_info": "二 / 3,4",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": ""
  },
  {
    "serial": "2660",
    "code": "D0737",
    "name": "教育未來 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃佳媛 (165***)",
    "classroom": "ED 201",
    "capacity": "69",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "R",
    "time_info": "二 / 1,2",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": ""
  },
  {
    "serial": "2662",
    "code": "T0176",
    "name": "環境未來 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "簡義杰 (149***)",
    "classroom": "I  201",
    "capacity": "69",
    "time_data": [
      [
        4,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "R",
    "time_info": "四 / 5,6",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": ""
  },
  {
    "serial": "2666",
    "code": "T1178",
    "name": "經濟未來 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃富娟 (148***)",
    "classroom": "I  201",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "R",
    "time_info": "二 / 3,4",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2668",
    "code": "T1178",
    "name": "經濟未來 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄧玉英 (103***)",
    "classroom": "SG 506",
    "capacity": "69",
    "time_data": [
      [
        4,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "R",
    "time_info": "四 / 5,6",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2670",
    "code": "T1178",
    "name": "經濟未來 (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "林鈺惇 (170***)",
    "classroom": "SG 318",
    "capacity": "69",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "R",
    "time_info": "一 / 7,8",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2672",
    "code": "T1179",
    "name": "社會未來 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "彭莉惠 (141***)",
    "classroom": "E  304",
    "capacity": "69",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "R",
    "time_info": "三 / 7,8",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2674",
    "code": "T1179",
    "name": "社會未來 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉玉儀 (163***)",
    "classroom": "E  416",
    "capacity": "69",
    "time_data": [
      [
        3,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "R",
    "time_info": "三 / 5,6",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2676",
    "code": "T1179",
    "name": "社會未來 (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "林鈺惇 (170***)",
    "classroom": "E  304",
    "capacity": "69",
    "time_data": [
      [
        1,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "F",
    "group_type": "R",
    "time_info": "一 / 5,6",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2690",
    "code": "T0805",
    "name": "企業與法律 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林儹紘 (168***)",
    "classroom": "B  502",
    "capacity": "69",
    "time_data": [
      [
        4,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "S",
    "time_info": "四 / 5,6",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": ""
  },
  {
    "serial": "2692",
    "code": "T0806",
    "name": "生活與法律 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "涂予尹 (147***)",
    "classroom": "B  426",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "S",
    "time_info": "二 / 3,4",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": ""
  },
  {
    "serial": "2694",
    "code": "T0808",
    "name": "民主政治 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃琛瑜 (134***)",
    "classroom": "B  429",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "S",
    "time_info": "三 / 3,4",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修。"
  },
  {
    "serial": "2704",
    "code": "T2207",
    "name": "憲法與人權 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "林儹紘 (168***)",
    "classroom": "L  205",
    "capacity": "69",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "S",
    "time_info": "五 / 3,4",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": ""
  },
  {
    "serial": "2705",
    "code": "T2610",
    "name": "智慧財產權與法律 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "張浩倫 (165***)",
    "classroom": "SG 319",
    "capacity": "69",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "S",
    "time_info": "五 / 6,7",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": ""
  },
  {
    "serial": "2706",
    "code": "T2610",
    "name": "智慧財產權與法律 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "許昭元 (131***)",
    "classroom": "SG 504",
    "capacity": "69",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "S",
    "time_info": "一 / 1,2",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": ""
  },
  {
    "serial": "2707",
    "code": "T3181",
    "name": "社會創新 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "詹立煒 (151***)",
    "classroom": "B  118",
    "capacity": "69",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "S",
    "time_info": "三 / 1,2",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修。 ◇遠距非同步課程"
  },
  {
    "serial": "2708",
    "code": "T3181",
    "name": "社會創新 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "胡紹謙 (160***)",
    "classroom": "L  413",
    "capacity": "69",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "S",
    "time_info": "五 / 3,4",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修。"
  },
  {
    "serial": "2709",
    "code": "T3182",
    "name": "非營利組織與全球議題 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林岱緯 (148***)",
    "classroom": "SG 318",
    "capacity": "69",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "S",
    "time_info": "二 / 1,2",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2710",
    "code": "T0536",
    "name": "世界人權問題 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林　立 (105***)",
    "classroom": "B  712",
    "capacity": "69",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "五 / 3,4",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2711",
    "code": "T0831",
    "name": "國際現勢 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "馬準威 (159***)",
    "classroom": "SG 506",
    "capacity": "69",
    "time_data": [
      [
        1,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "一 / 8,9",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2712",
    "code": "T0831",
    "name": "國際現勢 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "馬準威 (159***)",
    "classroom": "SG 506",
    "capacity": "69",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "T",
    "time_info": "一 / 6,7",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2713",
    "code": "T0831",
    "name": "國際現勢 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "歐陽睿 (163***)",
    "classroom": "SG 320",
    "capacity": "69",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "T",
    "time_info": "四 / 6,7",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2714",
    "code": "T0831",
    "name": "國際現勢 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "歐陽睿 (163***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "T",
    "time_info": "三 / 6,7",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2715",
    "code": "T0831",
    "name": "國際現勢 (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "巫穎翰 (167***)",
    "classroom": "E  307",
    "capacity": "90",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "T",
    "time_info": "二 / 1,2",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2716",
    "code": "T0831",
    "name": "國際現勢 (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "唐裕安 (157***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "F",
    "group_type": "T",
    "time_info": "二 / 3,4",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2717",
    "code": "T0831",
    "name": "國際現勢 (G班)",
    "credits": 2,
    "category": "必",
    "teacher": "狄　馬 (169***)",
    "classroom": "SG 506",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "G",
    "group_type": "T",
    "time_info": "三 / 3,4",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2718",
    "code": "T0831",
    "name": "國際現勢 (H班)",
    "credits": 2,
    "category": "必",
    "teacher": "徐浤馨 (131***)",
    "classroom": "SG 506",
    "capacity": "69",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "H",
    "group_type": "T",
    "time_info": "一 / 3,4",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": "◇遠距非同步課程"
  },
  {
    "serial": "2719",
    "code": "T0831",
    "name": "國際現勢 (I班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄭家慶 (169***)",
    "classroom": "T  701",
    "capacity": "69",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "I",
    "group_type": "T",
    "time_info": "五 / 8,9",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2720",
    "code": "T0831",
    "name": "國際現勢 (J班)",
    "credits": 2,
    "category": "必",
    "teacher": "張昱謙 (169***)",
    "classroom": "SG 506",
    "capacity": "69",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "J",
    "group_type": "T",
    "time_info": "一 / 1,2",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2721",
    "code": "T0831",
    "name": "國際現勢 (K班)",
    "credits": 2,
    "category": "必",
    "teacher": "歐陽睿 (163***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "K",
    "group_type": "T",
    "time_info": "三 / 8,9",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2722",
    "code": "T0834",
    "name": "歐洲聯盟與歐洲統合 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "張福昌 (128***)",
    "classroom": "L  413",
    "capacity": "69",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "四 / 8,9",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2723",
    "code": "T0834",
    "name": "歐洲聯盟與歐洲統合 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "張福昌 (128***)",
    "classroom": "SG 318",
    "capacity": "69",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "T",
    "time_info": "五 / 7,8",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2724",
    "code": "T0834",
    "name": "歐洲聯盟與歐洲統合 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "卓忠宏 (114***)",
    "classroom": "SG 504",
    "capacity": "69",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "T",
    "time_info": "二 / 6,7",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2725",
    "code": "T0835",
    "name": "文化全球化 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林　立 (105***)",
    "classroom": "SG 402",
    "capacity": "69",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "二 / 1,2",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2726",
    "code": "T0837",
    "name": "東亞與世界 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "徐浤馨 (131***)",
    "classroom": "SG 319",
    "capacity": "69",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "二 / 7,8",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2727",
    "code": "T0838",
    "name": "全球體系與兩岸關係 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "張五岳 (092***)",
    "classroom": "T  404",
    "capacity": "69",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "四 / 3,4",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2728",
    "code": "T0838",
    "name": "全球體系與兩岸關係 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳建甫 (106***)",
    "classroom": "SG 319",
    "capacity": "69",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "T",
    "time_info": "四 / 3,4",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2729",
    "code": "T0838",
    "name": "全球體系與兩岸關係 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "胡慶山 (112***)",
    "classroom": "SG 320",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "T",
    "time_info": "二 / 3,4",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2730",
    "code": "T0839",
    "name": "經濟全球化 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "張昱謙 (169***)",
    "classroom": "T  109",
    "capacity": "69",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "一 / 6,7",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2731",
    "code": "T0839",
    "name": "經濟全球化 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "小山直則 (135***)",
    "classroom": "SG 504",
    "capacity": "69",
    "time_data": [
      [
        2,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "T",
    "time_info": "二 / 8,9",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2732",
    "code": "T0839",
    "name": "經濟全球化 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "小山直則 (135***)",
    "classroom": "E  413",
    "capacity": "69",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "T",
    "time_info": "三 / 6,7",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2733",
    "code": "T0839",
    "name": "經濟全球化 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "小山直則 (135***)",
    "classroom": "SG 504",
    "capacity": "69",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "T",
    "time_info": "四 / 6,7",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2734",
    "code": "T0840",
    "name": "美洲現勢 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "宮國威 (100***)",
    "classroom": "SG 506",
    "capacity": "69",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "三 / 6,7",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2735",
    "code": "T0840",
    "name": "美洲現勢 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "宮國威 (100***)",
    "classroom": "E  404",
    "capacity": "69",
    "time_data": [
      [
        2,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "T",
    "time_info": "二 / 8,9",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2736",
    "code": "T0840",
    "name": "美洲現勢 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃富娟 (148***)",
    "classroom": "SG 506",
    "capacity": "69",
    "time_data": [
      [
        2,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "T",
    "time_info": "二 / 8,9",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2737",
    "code": "T2943",
    "name": "台灣戰略地位 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林穎佑 (154***)",
    "classroom": "SG 506",
    "capacity": "69",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "二 / 6,7",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2738",
    "code": "T3292",
    "name": "歐盟治理與決策 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "卓忠宏 (114***)",
    "classroom": "SG 504",
    "capacity": "69",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "二 / 1,2",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2739",
    "code": "T3292",
    "name": "歐盟治理與決策 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "卓忠宏 (114***)",
    "classroom": "T  109",
    "capacity": "69",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "T",
    "time_info": "三 / 1,2",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2740",
    "code": "S0358",
    "name": "物理與生活 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "莊程豪 (142***)",
    "classroom": "S  104",
    "capacity": "69",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "一 / 3,4",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2741",
    "code": "S0358",
    "name": "物理與生活 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "李中傑 (101***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "U",
    "time_info": "四 / 1,2",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2742",
    "code": "S0362",
    "name": "宇宙的探索 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "秦一男 (114***)",
    "classroom": "S  104",
    "capacity": "69",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "四 / 9,10",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "為維持通識課程基本精神，物理系同學請勿選修本課程。"
  },
  {
    "serial": "2743",
    "code": "S0362",
    "name": "宇宙的探索 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "王尚勇 (125***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "U",
    "time_info": "三 / 3,4",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "2744",
    "code": "S0362",
    "name": "宇宙的探索 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "王尚勇 (125***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "U",
    "time_info": "四 / 3,4",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2745",
    "code": "S0362",
    "name": "宇宙的探索 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "曹慶堂 (090***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "U",
    "time_info": "二 / 3,4",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2746",
    "code": "S0362",
    "name": "宇宙的探索 (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "潘璽安 (159***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "U",
    "time_info": "一 / 7,8",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2747",
    "code": "S0368",
    "name": "化學與生活：化學、環境與社會 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "李世元 (062***)",
    "classroom": "SG 314",
    "capacity": "69",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "三 / 6,7",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2748",
    "code": "S0369",
    "name": "化學與生活：化學、醫藥與社會 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "施增廉 (073***)",
    "classroom": "C  011",
    "capacity": "69",
    "time_data": [
      [
        2,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "二 / 8,9",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2749",
    "code": "S0369",
    "name": "化學與生活：化學、醫藥與社會 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄭鈞霆 (158***)",
    "classroom": "C  001",
    "capacity": "69",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "U",
    "time_info": "二 / 6,7",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2750",
    "code": "S0377",
    "name": "生命科學：人體的奧秘 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳銘凱 (121***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "四 / 6,7",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2751",
    "code": "S0690",
    "name": "生命科學：基因科技與健康 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳曜鴻 (123***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "四 / 8,9",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2752",
    "code": "S0727",
    "name": "光、攝影和視覺 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊淑君 (116***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "一 / 3,4",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2753",
    "code": "S0738",
    "name": "生活中的化學 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王奕翔 (168***)",
    "classroom": "C  001",
    "capacity": "69",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "四 / 3,4",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "2754",
    "code": "S0738",
    "name": "生活中的化學 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "丁北辰 (107***)",
    "classroom": "C  013",
    "capacity": "90",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "U",
    "time_info": "五 / 6,7",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2755",
    "code": "S0747",
    "name": "數學漫遊 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "伍志祥 (086***)",
    "classroom": "H  111",
    "capacity": "61",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "二 / 3,4",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2756",
    "code": "S0747",
    "name": "數學漫遊 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "王千真 (142***)",
    "classroom": "H  112",
    "capacity": "61",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "U",
    "time_info": "二 / 3,4",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2757",
    "code": "S0747",
    "name": "數學漫遊 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "徐祥峻 (153***)",
    "classroom": "H  113",
    "capacity": "61",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "U",
    "time_info": "二 / 3,4",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2758",
    "code": "T0275",
    "name": "師法自然—自然中那些老師沒有教的 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "范義彬 (165***)",
    "classroom": "SG 319",
    "capacity": "69",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "一 / 6,7",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2759",
    "code": "T2166",
    "name": "科學之旅 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "秦一男 (114***)",
    "classroom": "S  104",
    "capacity": "69",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "三 / 9,10",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "為維持通識課程基本精神，物理系同學請勿選修本課程。"
  },
  {
    "serial": "2760",
    "code": "T2166",
    "name": "科學之旅 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳樫旭 (150***)",
    "classroom": "C  013",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "U",
    "time_info": "二 / 3,4",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2761",
    "code": "T2166",
    "name": "科學之旅 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃志喜 (169***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "U",
    "time_info": "三 / 6,7",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2762",
    "code": "T2167",
    "name": "化學與生活：化學、食品與社會 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王奕翔 (168***)",
    "classroom": "S  101",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "三 / 3,4",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2763",
    "code": "T2167",
    "name": "化學與生活：化學、食品與社會 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "謝忠宏 (144***)",
    "classroom": "SG 314",
    "capacity": "69",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "U",
    "time_info": "五 / 8,9",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2764",
    "code": "T2973",
    "name": "統計與生活 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "姜　杰 (159***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "一 / 9,10",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2765",
    "code": "T0099",
    "name": "倫理學 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林宸安 (158***)",
    "classroom": "E  412",
    "capacity": "69",
    "time_data": [
      [
        4,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "四 / 5,6",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2766",
    "code": "T0100",
    "name": "哲學概論 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王志銘 (100***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "一 / 9,10",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2767",
    "code": "T0100",
    "name": "哲學概論 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "王志銘 (100***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "V",
    "time_info": "二 / 7,8",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2768",
    "code": "T0100",
    "name": "哲學概論 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "李志成 (163***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "V",
    "time_info": "二 / 9,10",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2769",
    "code": "T0338",
    "name": "哲學經典導讀 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "蘇富芝 (136***)",
    "classroom": "SG 504",
    "capacity": "69",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "三 / 1,2",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "2770",
    "code": "T0338",
    "name": "哲學經典導讀 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "蘇富芝 (136***)",
    "classroom": "SG 504",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "V",
    "time_info": "三 / 3,4",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "2771",
    "code": "T0338",
    "name": "哲學經典導讀 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄭合修 (163***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "V",
    "time_info": "三 / 1,2",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "2772",
    "code": "T0339",
    "name": "宗教概論 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳杏枝 (101***)",
    "classroom": "SG 504",
    "capacity": "69",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "一 / 3,4",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2773",
    "code": "T0340",
    "name": "宗教經典導讀 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉韋廷 (163***)",
    "classroom": "SG 321",
    "capacity": "90",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "三 / 7,8",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "2774",
    "code": "T0348",
    "name": "生死學 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄭鈞瑋 (137***)",
    "classroom": "SG 504",
    "capacity": "69",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "五 / 3,4",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "2775",
    "code": "T0348",
    "name": "生死學 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄭鈞瑋 (137***)",
    "classroom": "SG 504",
    "capacity": "69",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "V",
    "time_info": "五 / 6,7",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "2776",
    "code": "T0348",
    "name": "生死學 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "洪雨婷 (155***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        5,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "V",
    "time_info": "五 / 5,6",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2777",
    "code": "T2917",
    "name": "邏輯與哲學 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊濟鶴 (152***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "二 / 1,2",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2778",
    "code": "T2917",
    "name": "邏輯與哲學 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "林怡仲 (163***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "V",
    "time_info": "五 / 7,8",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "2779",
    "code": "T2917",
    "name": "邏輯與哲學 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "林怡仲 (163***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        5,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "V",
    "time_info": "五 / 9,10",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "2780",
    "code": "T2919",
    "name": "美學－理論與實務 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王志銘 (100***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "一 / 7,8",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "2781",
    "code": "T2919",
    "name": "美學－理論與實務 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "王志銘 (100***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        2,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "V",
    "time_info": "二 / 5,6",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "2782",
    "code": "T2919",
    "name": "美學－理論與實務 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "洪雨婷 (155***)",
    "classroom": "O  504",
    "capacity": "69",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "V",
    "time_info": "五 / 7,8",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2783",
    "code": "T3054",
    "name": "性別理論與實踐 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉亞蘭 (119***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "四 / 9,10",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2784",
    "code": "T3253",
    "name": "宗教與療癒 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉韋廷 (163***)",
    "classroom": "SG 321",
    "capacity": "69",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "三 / 9,10",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2785",
    "code": "T3293",
    "name": "自然哲學與科學 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "李明憲, 徐佐銘(083***,101***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        4,
        3,
        3
      ],
      [
        4,
        4,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "四 / 3 四 / 4",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "2786",
    "code": "A1636",
    "name": "人際關係與溝通 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "胡延薇 (083***)",
    "classroom": "E  312",
    "capacity": "69",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "三 / 7,8",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2787",
    "code": "D0425",
    "name": "正向心理學 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "宋鴻燕 (110***)",
    "classroom": "E  412",
    "capacity": "69",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "四 / 7,8",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇遠距非同步課程"
  },
  {
    "serial": "2788",
    "code": "D0425",
    "name": "正向心理學 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "張菀珍 (170***)",
    "classroom": "SG 402",
    "capacity": "69",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "W",
    "time_info": "一 / 9,10",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2789",
    "code": "D0425",
    "name": "正向心理學 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "胡延薇, 徐佐銘(083***,101***)",
    "classroom": "E  312",
    "capacity": "69",
    "time_data": [
      [
        4,
        9,
        9
      ],
      [
        4,
        10,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "W",
    "time_info": "四 / 9 四 / 10",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2790",
    "code": "T0013",
    "name": "人格心理學 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "韓貴香 (129***)",
    "classroom": "B  501",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "二 / 3,4",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "◇以實整虛課程"
  },
  {
    "serial": "2791",
    "code": "T0066",
    "name": "社會心理學 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "韓貴香 (129***)",
    "classroom": "B  501",
    "capacity": "69",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "一 / 3,4",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": ""
  },
  {
    "serial": "2792",
    "code": "T0066",
    "name": "社會心理學 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "韓貴香 (129***)",
    "classroom": "B  501",
    "capacity": "69",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "W",
    "time_info": "一 / 7,8",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": ""
  },
  {
    "serial": "2793",
    "code": "T0169",
    "name": "人權與社會正義 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃奕琳 (090***)",
    "classroom": "E  515",
    "capacity": "69",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "一 / 9,10",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2794",
    "code": "T0169",
    "name": "人權與社會正義 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃奕琳 (090***)",
    "classroom": "E  412",
    "capacity": "69",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "W",
    "time_info": "四 / 9,10",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2795",
    "code": "T0169",
    "name": "人權與社會正義 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "林楚淇 (132***)",
    "classroom": "T  109",
    "capacity": "69",
    "time_data": [
      [
        5,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "W",
    "time_info": "五 / 9,10",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2796",
    "code": "T1822",
    "name": "心理學導論 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "韓貴香 (129***)",
    "classroom": "B  501",
    "capacity": "69",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "三 / 1,2",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇遠距非同步課程"
  },
  {
    "serial": "2797",
    "code": "T1822",
    "name": "心理學導論 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "胡延薇 (083***)",
    "classroom": "B  607",
    "capacity": "69",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "W",
    "time_info": "二 / 9,10",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2798",
    "code": "T1822",
    "name": "心理學導論 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "胡延薇 (083***)",
    "classroom": "E  312",
    "capacity": "69",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "W",
    "time_info": "四 / 7,8",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2799",
    "code": "T1822",
    "name": "心理學導論 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "胡延薇 (083***)",
    "classroom": "B  607",
    "capacity": "69",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "W",
    "time_info": "二 / 7,8",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2800",
    "code": "T1832",
    "name": "社會學導論 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉玉儀 (163***)",
    "classroom": "E  404",
    "capacity": "69",
    "time_data": [
      [
        1,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "一 / 5,6",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2801",
    "code": "T1832",
    "name": "社會學導論 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "宮國威 (100***)",
    "classroom": "SG 503",
    "capacity": "69",
    "time_data": [
      [
        1,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "W",
    "time_info": "一 / 5,6",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2802",
    "code": "T1891",
    "name": "政治學概論 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃奕琳 (090***)",
    "classroom": "SG 506",
    "capacity": "69",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "二 / 1,2",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "◇以實整虛課程"
  },
  {
    "serial": "2803",
    "code": "T1891",
    "name": "政治學概論 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃奕琳 (090***)",
    "classroom": "SG 506",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "W",
    "time_info": "二 / 3,4",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": ""
  },
  {
    "serial": "2804",
    "code": "T1891",
    "name": "政治學概論 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃奕琳 (090***)",
    "classroom": "E  312",
    "capacity": "69",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "W",
    "time_info": "三 / 9,10",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": ""
  },
  {
    "serial": "2805",
    "code": "T2882",
    "name": "生活與財經 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "曾威智 (146***)",
    "classroom": "E  513",
    "capacity": "69",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "五 / 3,4",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2806",
    "code": "T2882",
    "name": "生活與財經 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "曾威智 (146***)",
    "classroom": "SG 320",
    "capacity": "69",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "W",
    "time_info": "二 / 9,10",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2807",
    "code": "T2944",
    "name": "性別與社會 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳賢寶 (170***)",
    "classroom": "SG 321",
    "capacity": "90",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "四 / 1,2",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2808",
    "code": "T2944",
    "name": "性別與社會 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡政霖 (169***)",
    "classroom": "SG 314",
    "capacity": "69",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "W",
    "time_info": "四 / 1,2",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2809",
    "code": "T2944",
    "name": "性別與社會 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳賢寶 (170***)",
    "classroom": "SG 321",
    "capacity": "69",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "W",
    "time_info": "四 / 3,4",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2810",
    "code": "M2601",
    "name": "交通安全分析與事故預防 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳菀蕙 (134***)",
    "classroom": "B  713",
    "capacity": "175",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TNUXB.校共通課程－日",
    "notes": ""
  },
  {
    "serial": "2811",
    "code": "T0234",
    "name": "安全衛生教育 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "王儀雯 (156***)",
    "classroom": "B  515",
    "capacity": "160",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 8,9",
    "department": "TNUXB.校共通課程－日",
    "notes": "◇講座課程"
  },
  {
    "serial": "2812",
    "code": "T0645",
    "name": "森林生態與樹木保護 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "蕭文偉 (133***)",
    "classroom": "B  713",
    "capacity": "260",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 6,7",
    "department": "TNUXB.校共通課程－日",
    "notes": "◇專業知能服務學習課程"
  },
  {
    "serial": "2813",
    "code": "T1234",
    "name": "弱勢團體與社會福利 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳建甫 (106***)",
    "classroom": "B  713",
    "capacity": "175",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TNUXB.校共通課程－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇專業知能服務學習課程"
  },
  {
    "serial": "2814",
    "code": "T2984",
    "name": "運動與生活概論 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "郭馥滋 (143***)",
    "classroom": "SG 603",
    "capacity": "30",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TNUXB.校共通課程－日",
    "notes": ""
  },
  {
    "serial": "2815",
    "code": "T3295",
    "name": "水下文化資產概論 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "劉金源 (150***)",
    "classroom": "L  201",
    "capacity": "175",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TNUXB.校共通課程－日",
    "notes": ""
  },
  {
    "serial": "2816",
    "code": "T3296",
    "name": "來學「淡水學」 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "張建隆 (169***)",
    "classroom": "B  713",
    "capacity": "175",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TNUXB.校共通課程－日",
    "notes": ""
  },
  {
    "serial": "2817",
    "code": "T3297",
    "name": "探索領域－探索文創與智慧設計 (A班)",
    "credits": 1,
    "category": "選",
    "teacher": "蕭吉甫, 古怡青, 林逸農, 黃家琪(141***,144***,149***)",
    "classroom": "B  616",
    "capacity": "175",
    "time_data": [
      [
        1,
        11,
        11
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 11",
    "department": "TNUXB.校共通課程－日",
    "notes": "探索領域4門課至多承認2學分為畢業學分。限大一學生選修。本科目為通識教育跨領域微學程課程 ◇遠距非同步課程"
  },
  {
    "serial": "2818",
    "code": "T3298",
    "name": "探索領域－探索人工智慧與永續發展 (A班)",
    "credits": 1,
    "category": "選",
    "teacher": "崔　琳, 蔡志群, 黃大肯, 林仁祥(128***,141***,160***)",
    "classroom": "B  703",
    "capacity": "175",
    "time_data": [
      [
        2,
        11,
        11
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 11",
    "department": "TNUXB.校共通課程－日",
    "notes": "探索領域4門課至多承認2學分為畢業學分。限大一學生選修。本科目為通識教育跨領域微學程課程 ◇遠距非同步課程"
  },
  {
    "serial": "2819",
    "code": "T3299",
    "name": "探索領域－探索人文社會與智慧管理 (A班)",
    "credits": 1,
    "category": "選",
    "teacher": "陳維立, 陳思思, 劉佩勳, 朱政安(139***,157***,165***)",
    "classroom": "B  616",
    "capacity": "175",
    "time_data": [
      [
        4,
        11,
        11
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 11",
    "department": "TNUXB.校共通課程－日",
    "notes": "探索領域4門課至多承認2學分為畢業學分。限大一學生選修。 ◇遠距非同步課程◇全英語授課"
  },
  {
    "serial": "2820",
    "code": "T3300",
    "name": "探索領域－探索智慧人文商管與社會創新 (A班)",
    "credits": 1,
    "category": "選",
    "teacher": "蘇淑燕, 楊立人, 唐大崙, 張明弘(112***,123***,136***)",
    "classroom": "B  515",
    "capacity": "175",
    "time_data": [
      [
        3,
        11,
        11
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 11",
    "department": "TNUXB.校共通課程－日",
    "notes": "探索領域4門課至多承認2學分為畢業學分。限大一學生選修。本科目為通識教育跨領域微學程課程 ◇遠距非同步課程"
  },
  {
    "serial": "2821",
    "code": "U1003",
    "name": "全民國防教育軍事訓練（二）－國際情勢 (A班)",
    "credits": 1,
    "category": "選",
    "teacher": "許家豪 (167***)",
    "classroom": "H  116",
    "capacity": "70",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 6,7",
    "department": "TNUYB.全民國防（二）日",
    "notes": "全民國防教育軍事訓練(二)選修課程不列入畢業學分數。"
  },
  {
    "serial": "2822",
    "code": "U1004",
    "name": "全民國防教育軍事訓練（二）－防衛動員 (A班)",
    "credits": 1,
    "category": "選",
    "teacher": "翁明賢 (061***)",
    "classroom": "SG 314",
    "capacity": "70",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 6,7",
    "department": "TNUYB.全民國防（二）日",
    "notes": "限全英班，全民國防教育軍事訓練(二)選修課程不列入畢業學分數。 ◇全英語授課"
  },
  {
    "serial": "2823",
    "code": "U1004",
    "name": "全民國防教育軍事訓練（二）－防衛動員 (B班)",
    "credits": 1,
    "category": "選",
    "teacher": "賴淑秀 (167***)",
    "classroom": "H  115",
    "capacity": "70",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 6,7",
    "department": "TNUYB.全民國防（二）日",
    "notes": "全民國防教育軍事訓練(二)選修課程不列入畢業學分數。"
  },
  {
    "serial": "2824",
    "code": "U1004",
    "name": "全民國防教育軍事訓練（二）－防衛動員 (C班)",
    "credits": 1,
    "category": "選",
    "teacher": "鄭惠文 (099***)",
    "classroom": "C  011",
    "capacity": "70",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TNUYB.全民國防（二）日",
    "notes": "全民國防教育軍事訓練(二)選修課程不列入畢業學分數。"
  },
  {
    "serial": "2825",
    "code": "U1004",
    "name": "全民國防教育軍事訓練（二）－防衛動員 (D班)",
    "credits": 1,
    "category": "選",
    "teacher": "鄭惠文 (099***)",
    "classroom": "SG 319",
    "capacity": "70",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TNUYB.全民國防（二）日",
    "notes": "全民國防教育軍事訓練(二)選修課程不列入畢業學分數。"
  },
  {
    "serial": "2826",
    "code": "U1005",
    "name": "全民國防教育軍事訓練（二）－全民國防 (A班)",
    "credits": 1,
    "category": "選",
    "teacher": "蔡志遠 (167***)",
    "classroom": "C  001",
    "capacity": "70",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 8,9",
    "department": "TNUYB.全民國防（二）日",
    "notes": "全民國防教育軍事訓練(二)選修課程不列入畢業學分數。"
  },
  {
    "serial": "2827",
    "code": "U1008",
    "name": "全民國防教育軍事訓練（二）－國防政策 (A班)",
    "credits": 1,
    "category": "選",
    "teacher": "徐至杰 (167***)",
    "classroom": "H  116",
    "capacity": "70",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 1,2",
    "department": "TNUYB.全民國防（二）日",
    "notes": "全民國防教育軍事訓練(二)選修課程不列入畢業學分數。"
  },
  {
    "serial": "2828",
    "code": "E2523",
    "name": "生物科技 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "周子聰 (114***)",
    "classroom": "S  420",
    "capacity": "69",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "Z",
    "time_info": "二 / 9,10",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2829",
    "code": "E2523",
    "name": "生物科技 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "廖恩慈 (162***)",
    "classroom": "SG 504",
    "capacity": "69",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "Z",
    "time_info": "四 / 3,4",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2830",
    "code": "E2523",
    "name": "生物科技 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "王鈺詞 (157***)",
    "classroom": "SG 320",
    "capacity": "69",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "Z",
    "time_info": "二 / 7,8",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2831",
    "code": "E3628",
    "name": "機械簡史 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "強　度 (166***)",
    "classroom": "E  310",
    "capacity": "69",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "Z",
    "time_info": "四 / 3,4",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2832",
    "code": "E3628",
    "name": "機械簡史 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "王偉丞 (166***)",
    "classroom": "E  312",
    "capacity": "69",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "Z",
    "time_info": "四 / 1,2",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2833",
    "code": "S0920",
    "name": "地球生態環境 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "秦一男 (114***)",
    "classroom": "S  101",
    "capacity": "69",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "Z",
    "time_info": "四 / 6,7",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": "為維持通識課程基本精神，物理系請勿選修本課程。本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2834",
    "code": "S0920",
    "name": "地球生態環境 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "林琦峯 (164***)",
    "classroom": "SG 402",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "Z",
    "time_info": "二 / 3,4",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2835",
    "code": "S0920",
    "name": "地球生態環境 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "李英豪 (094***)",
    "classroom": "SG 314",
    "capacity": "69",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "Z",
    "time_info": "二 / 7,8",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2836",
    "code": "S0920",
    "name": "地球生態環境 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "范素玲 (132***)",
    "classroom": "SG 316",
    "capacity": "69",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "Z",
    "time_info": "五 / 3,4",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇遠距非同步課程◇全英語授課"
  },
  {
    "serial": "2837",
    "code": "S0920",
    "name": "地球生態環境 (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃富國 (112***)",
    "classroom": "E  231",
    "capacity": "69",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "Z",
    "time_info": "一 / 9,10",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2838",
    "code": "S0920",
    "name": "地球生態環境 (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃大肯 (160***)",
    "classroom": "E  508",
    "capacity": "69",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "F",
    "group_type": "Z",
    "time_info": "一 / 6,7",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "2839",
    "code": "S0922",
    "name": "能源與材料科技 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "余宣賦 (062***)",
    "classroom": "E  404",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "Z",
    "time_info": "三 / 3,4",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2840",
    "code": "S0922",
    "name": "能源與材料科技 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳逸航 (136***)",
    "classroom": "O  303",
    "capacity": "69",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "Z",
    "time_info": "五 / 6,7",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2841",
    "code": "E2523",
    "name": "生物科技 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉昭華 (072***)",
    "classroom": "SG 316",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "Z",
    "time_info": "二 / 3,4",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2842",
    "code": "S0923",
    "name": "電子與電腦科技 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "何金新 (138***)",
    "classroom": "SG 319",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "Z",
    "time_info": "二 / 3,4",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2843",
    "code": "S0923",
    "name": "電子與電腦科技 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "何金新 (138***)",
    "classroom": "SG 319",
    "capacity": "69",
    "time_data": [
      [
        2,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "Z",
    "time_info": "二 / 5,6",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2844",
    "code": "S0923",
    "name": "電子與電腦科技 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "何金新 (138***)",
    "classroom": "SG 319",
    "capacity": "69",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "Z",
    "time_info": "一 / 3,4",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2845",
    "code": "S0923",
    "name": "電子與電腦科技 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊維斌 (113***)",
    "classroom": "T  701",
    "capacity": "69",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "Z",
    "time_info": "一 / 3,4",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2846",
    "code": "S0923",
    "name": "電子與電腦科技 (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "李世鳴 (061***)",
    "classroom": "E  412",
    "capacity": "69",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "Z",
    "time_info": "三 / 9,10",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2847",
    "code": "S0925",
    "name": "科技永續 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃友麟 (166***)",
    "classroom": "E  515",
    "capacity": "69",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "Z",
    "time_info": "四 / 8,9",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2848",
    "code": "S0927",
    "name": "科技進化 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王奕翔 (168***)",
    "classroom": "C  013",
    "capacity": "90",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "Z",
    "time_info": "三 / 8,9",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2849",
    "code": "S0927",
    "name": "科技進化 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "朱　留 (128***)",
    "classroom": "E  404",
    "capacity": "69",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "Z",
    "time_info": "二 / 1,2",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2850",
    "code": "S0927",
    "name": "科技進化 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "朱　留 (128***)",
    "classroom": "E  304",
    "capacity": "69",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "Z",
    "time_info": "三 / 1,2",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2851",
    "code": "S0928",
    "name": "智慧機器人 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "蕭富元 (126***)",
    "classroom": "E  312",
    "capacity": "69",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "Z",
    "time_info": "一 / 6,7",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2857",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王慧娟 (119***)",
    "classroom": "T  404",
    "capacity": "70",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TRBXB.觀光系（日）",
    "notes": "限全英語專班學生 ◇全英語授課"
  },
  {
    "serial": "2863",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "張雅慧 (126***)",
    "classroom": "T  605",
    "capacity": "70",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "QG",
    "time_info": "四 / 9,10",
    "department": "TRBXB.觀光系（日）",
    "notes": "限全英語專班學生。加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。 ◇全英語授課"
  },
  {
    "serial": "2886",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "張慈珊 (125***)",
    "classroom": "T  401",
    "capacity": "80",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TRDXB.外交系（日）",
    "notes": "限全英語專班學生 ◇全英語授課"
  },
  {
    "serial": "2894",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "喬　治 (159***)",
    "classroom": "T  701",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TRDXB.外交系（日）",
    "notes": "限全英語專班學生。加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。 ◇全英語授課"
  },
  {
    "serial": "2925",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "馬天樂 (161***)",
    "classroom": "T  704",
    "capacity": "80",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TRJXB.政經系（日）",
    "notes": "限全英語專班學生 ◇全英語授課"
  },
  {
    "serial": "2931",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "雷　凱 (141***)",
    "classroom": "T  601",
    "capacity": "70",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "QG",
    "time_info": "三 / 6,7",
    "department": "TRJXB.政經系（日）",
    "notes": "限全英語專班學生。加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。 ◇全英語授課"
  },
  {
    "serial": "3156",
    "code": "D0330",
    "name": "性別與文化 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "王蔚婷 (133***)",
    "classroom": "E  515",
    "capacity": "70",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TFLAB.英文系英語班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "3161",
    "code": "T1832",
    "name": "社會學導論 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "張瓊方 (167***)",
    "classroom": "E  302",
    "capacity": "69",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "W",
    "time_info": "三 / 1,2",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "3163",
    "code": "T9835",
    "name": "男生體育－籃球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪敦賓 (065***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "3164",
    "code": "T9835",
    "name": "男生體育－籃球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪敦賓 (065***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "3165",
    "code": "T9835",
    "name": "男生體育－籃球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪敦賓 (065***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "3166",
    "code": "T9867",
    "name": "男、女生體育－高爾夫球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "蕭淑芬 (048***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "第1週SG245,第2週起改至佑昇高爾夫球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "3167",
    "code": "T9867",
    "name": "男、女生體育－高爾夫球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "蕭淑芬 (048***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "第1週SG245,第2週起改至佑昇高爾夫球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "3168",
    "code": "T9867",
    "name": "男、女生體育－高爾夫球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "王誼邦 (106***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        3,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 5,6",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "第1週SG245,第2週起改至佑昇高爾夫球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "3169",
    "code": "T9867",
    "name": "男、女生體育－高爾夫球興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "王誼邦 (106***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "D",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "第1週SG245,第2週起改至佑昇高爾夫球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "3170",
    "code": "T9867",
    "name": "男、女生體育－高爾夫球興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳逸政 (087***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "E",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "第1週SG245,第2週起改至佑昇高爾夫球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "3171",
    "code": "T9867",
    "name": "男、女生體育－高爾夫球興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "王誼邦 (106***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        2,
        5,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "F",
    "group_type": "",
    "time_info": "二 / 5,6",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "第1週游泳館N204,第2週起改至佑昇高爾夫球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "3172",
    "code": "T9871",
    "name": "男、女生體育－有氧舞蹈興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "郭馥滋 (143***)",
    "classroom": "N  204",
    "capacity": "30",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "游泳館N204,本課程配合75周年校慶活動進行課程設計與時間異動,請詳閱教學計畫表"
  },
  {
    "serial": "3173",
    "code": "T9871",
    "name": "男、女生體育－有氧舞蹈興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "郭馥滋 (143***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室,本課程配合75周年校慶活動進行課程設計與時間異動,請詳閱教學計畫表"
  },
  {
    "serial": "3175",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "潘定均 (136***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "五虎崗排球場(V2),雨備游泳館N201"
  },
  {
    "serial": "3176",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "雷小娟 (115***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "3177",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "雷小娟 (115***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "3178",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "劉宗德 (106***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "D",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "3179",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳逸政 (087***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "E",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "3180",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "劉宗德 (106***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "F",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "3181",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (G班)",
    "credits": 1,
    "category": "必",
    "teacher": "楊總成 (106***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "G",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "3182",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (H班)",
    "credits": 1,
    "category": "必",
    "teacher": "潘定均 (136***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "H",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "3183",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (I班)",
    "credits": 1,
    "category": "必",
    "teacher": "潘定均 (136***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "I",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "3184",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (J班)",
    "credits": 1,
    "category": "必",
    "teacher": "楊總成 (106***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "J",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "3185",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (K班)",
    "credits": 1,
    "category": "必",
    "teacher": "楊總成 (106***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "K",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "3186",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "覃素莉 (078***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "3187",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "覃素莉 (078***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "3188",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "覃素莉 (078***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "3189",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "張弓弘 (078***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "D",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "3190",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "覃素莉 (078***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "E",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "3191",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "覃素莉 (078***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "F",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "3192",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (G班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳建樺 (132***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "G",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "3193",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (H班)",
    "credits": 1,
    "category": "必",
    "teacher": "張弓弘 (078***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "H",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "3194",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (I班)",
    "credits": 1,
    "category": "必",
    "teacher": "吳承恩 (158***)",
    "classroom": "未定",
    "capacity": "70",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "I",
    "group_type": "",
    "time_info": "五 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場 ◇全英語授課"
  },
  {
    "serial": "3196",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "王元聖 (119***)",
    "classroom": "SG 322",
    "capacity": "60",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室"
  },
  {
    "serial": "3197",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "李欣靜 (136***)",
    "classroom": "SG 322",
    "capacity": "30",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "進階班體育館SG322桌球室"
  },
  {
    "serial": "3198",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "林素婷 (099***)",
    "classroom": "SG 322",
    "capacity": "60",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室"
  },
  {
    "serial": "3199",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "李欣靜 (136***)",
    "classroom": "SG 322",
    "capacity": "60",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "D",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室"
  },
  {
    "serial": "3200",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "王誼邦 (106***)",
    "classroom": "SG 322",
    "capacity": "60",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "E",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室"
  },
  {
    "serial": "3201",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳天文 (131***)",
    "classroom": "SG 322",
    "capacity": "60",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "F",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室"
  },
  {
    "serial": "3202",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (G班)",
    "credits": 1,
    "category": "必",
    "teacher": "梅書瑋 (170***)",
    "classroom": "SG 322",
    "capacity": "60",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "G",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室"
  },
  {
    "serial": "3203",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "李建宏 (163***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "活動中心羽球場"
  },
  {
    "serial": "3204",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳建樺 (132***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "活動中心羽球場"
  },
  {
    "serial": "3205",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳凱智 (136***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "活動中心羽球場"
  },
  {
    "serial": "3206",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃嘉笙 (158***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "D",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "活動中心羽球場 ◇全英語授課"
  },
  {
    "serial": "3207",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃谷臣 (091***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "E",
    "group_type": "",
    "time_info": "一 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "3208",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃貴樹 (138***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "F",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "3209",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (G班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡慧敏 (120***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "G",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "3210",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (H班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡慧敏 (120***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "H",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "進階班體育館4樓羽球場"
  },
  {
    "serial": "3211",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (I班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃貴樹 (138***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "I",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "3212",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (J班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳天文 (131***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "J",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "3213",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (K班)",
    "credits": 1,
    "category": "必",
    "teacher": "趙曉雯 (148***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "K",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "3214",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (L班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡慧敏 (120***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "L",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "3215",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (M班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳凱智 (136***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "M",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "活動中心羽球場 ◇全英語授課"
  },
  {
    "serial": "3216",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (N班)",
    "credits": 1,
    "category": "必",
    "teacher": "范姜逸敏 (120***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "N",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "3217",
    "code": "T9876",
    "name": "男、女生體育－壘球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃谷臣 (091***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "操場,雨備游泳館N201"
  },
  {
    "serial": "3218",
    "code": "T9876",
    "name": "男、女生體育－壘球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "謝豐宇 (124***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "操場,雨備游泳館N201"
  },
  {
    "serial": "3219",
    "code": "T9880",
    "name": "男、女生體育－柔道防身術 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳俊樺 (170***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓武術室"
  },
  {
    "serial": "3220",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "劉宗德 (106***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "3221",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳建樺 (132***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "3222",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃谷臣 (091***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "3223",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪建智 (083***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "D",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "3224",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "劉宗德 (106***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "E",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "3225",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪建智 (083***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "F",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "3226",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (G班)",
    "credits": 1,
    "category": "必",
    "teacher": "雷小娟 (115***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "G",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "3227",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (H班)",
    "credits": 1,
    "category": "必",
    "teacher": "王元聖 (119***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "H",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "3228",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (I班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪敦賓 (065***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "I",
    "group_type": "",
    "time_info": "五 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "3229",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (J班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪敦賓 (065***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        5,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "J",
    "group_type": "",
    "time_info": "五 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "3230",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (K班)",
    "credits": 1,
    "category": "必",
    "teacher": "王誼邦 (106***)",
    "classroom": "N  204",
    "capacity": "30",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "K",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "游泳館N204"
  },
  {
    "serial": "3231",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (L班)",
    "credits": 1,
    "category": "必",
    "teacher": "雷小娟 (115***)",
    "classroom": "N  204",
    "capacity": "30",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "L",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "游泳館N204"
  },
  {
    "serial": "3232",
    "code": "T9883",
    "name": "男、女生體育－網球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "張嘉雄 (128***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備SG245"
  },
  {
    "serial": "3233",
    "code": "T9883",
    "name": "男、女生體育－網球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "張嘉雄 (128***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備第1周體育館地下1樓武術室,其他周次SG245"
  },
  {
    "serial": "3234",
    "code": "T9883",
    "name": "男、女生體育－網球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "張嘉雄 (128***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備SG245"
  },
  {
    "serial": "3235",
    "code": "T9883",
    "name": "男、女生體育－網球興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪建智 (083***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "D",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備SG245"
  },
  {
    "serial": "3236",
    "code": "T9883",
    "name": "男、女生體育－網球興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "范姜逸敏 (120***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "E",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備SG245"
  },
  {
    "serial": "3237",
    "code": "T9883",
    "name": "男、女生體育－網球興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "范姜逸敏 (120***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "F",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備SG245"
  },
  {
    "serial": "3238",
    "code": "T9883",
    "name": "男、女生體育－網球興趣班 (G班)",
    "credits": 1,
    "category": "必",
    "teacher": "范姜逸敏 (120***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "G",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備SG245"
  },
  {
    "serial": "3239",
    "code": "T9883",
    "name": "男、女生體育－網球興趣班 (H班)",
    "credits": 1,
    "category": "必",
    "teacher": "鍾易瑋 (163***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "H",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備體育館地下1樓武術室 ◇全英語授課"
  },
  {
    "serial": "3240",
    "code": "T9886",
    "name": "男、女生體育－太極拳興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳文和 (137***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓武術室"
  },
  {
    "serial": "3241",
    "code": "T9886",
    "name": "男、女生體育－太極拳興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳文和 (137***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        5,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "五 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓武術室"
  },
  {
    "serial": "3242",
    "code": "T9886",
    "name": "男、女生體育－太極拳興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪建智 (083***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓劍道館"
  },
  {
    "serial": "3243",
    "code": "T9886",
    "name": "男、女生體育－太極拳興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪建智 (083***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "D",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓劍道館"
  },
  {
    "serial": "3244",
    "code": "T9890",
    "name": "男、女生體育－撞球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "林廣建 (163***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "強運撞球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "3245",
    "code": "T9890",
    "name": "男、女生體育－撞球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "謝豐宇 (124***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "強運撞球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "3246",
    "code": "T9890",
    "name": "男、女生體育－撞球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳天文 (131***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "強運撞球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "3247",
    "code": "T9890",
    "name": "男、女生體育－撞球興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳天文 (131***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "D",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "強運撞球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "3248",
    "code": "T9890",
    "name": "男、女生體育－撞球興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "謝豐宇 (124***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "E",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "強運撞球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "3249",
    "code": "T9891",
    "name": "男、女生體育－網球專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "張嘉雄 (128***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 13,14",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "3250",
    "code": "T9892",
    "name": "男、女生體育－羽球專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡慧敏 (120***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 11,12",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "3251",
    "code": "T9893",
    "name": "男、女生體育－桌球專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "李欣靜 (136***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 13,14",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "3252",
    "code": "T9894",
    "name": "男、女生體育－排球專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "楊總成 (106***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 11,12",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "3253",
    "code": "T9894",
    "name": "男、女生體育－排球專長班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "潘定均 (136***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "六 / 13,14",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "3254",
    "code": "T9895",
    "name": "男、女生體育－籃球專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳建樺 (132***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 11,12",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "3255",
    "code": "T9897",
    "name": "男、女生體育－跆拳道 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "王豐家 (158***)",
    "classroom": "未定",
    "capacity": "55",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓武術室 ◇全英語授課"
  },
  {
    "serial": "3256",
    "code": "T9897",
    "name": "男、女生體育－跆拳道 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "王元聖 (119***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓武術室"
  },
  {
    "serial": "3257",
    "code": "T9897",
    "name": "男、女生體育－跆拳道 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "王豐家 (158***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓武術室"
  },
  {
    "serial": "3258",
    "code": "T9900",
    "name": "男、女生體育－游泳專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳瑞辰 (138***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 13,14",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課 ◇全英語授課"
  },
  {
    "serial": "3259",
    "code": "T9938",
    "name": "女生體育－羽球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "林素婷 (099***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "3260",
    "code": "T9938",
    "name": "女生體育－羽球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "林素婷 (099***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "3261",
    "code": "T9938",
    "name": "女生體育－羽球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "林素婷 (099***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "3262",
    "code": "T9939",
    "name": "女生體育－網球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "林素婷 (099***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備第1周體育館地下1樓劍道館,其他周次SG245"
  },
  {
    "serial": "3263",
    "code": "T9949",
    "name": "女生體育－軟式排球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "楊總成 (106***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "3264",
    "code": "U5001",
    "name": "男、女生體育-重量訓練 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "劉宗德 (106***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "3265",
    "code": "U5001",
    "name": "男、女生體育-重量訓練 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "張弓弘 (078***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "3266",
    "code": "U5001",
    "name": "男、女生體育-重量訓練 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "張弓弘 (078***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "3267",
    "code": "U5002",
    "name": "男、女生體育-養生氣功興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳怡穎 (062***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "3268",
    "code": "U5002",
    "name": "男、女生體育-養生氣功興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳怡穎 (062***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "3269",
    "code": "U5008",
    "name": "男、女生體育－水上活動游泳初級 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳瑞辰 (138***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "游泳館S1"
  },
  {
    "serial": "3270",
    "code": "U5008",
    "name": "男、女生體育－水上活動游泳初級 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳瑞辰 (138***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "游泳館S1"
  },
  {
    "serial": "3271",
    "code": "U5008",
    "name": "男、女生體育－水上活動游泳初級 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳瑞辰 (138***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "游泳館S1"
  },
  {
    "serial": "3272",
    "code": "U5011",
    "name": "男、女生體育－瑜伽興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "郭馥滋 (143***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "3273",
    "code": "U5011",
    "name": "男、女生體育－瑜伽興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡忻林 (098***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "3274",
    "code": "U5011",
    "name": "男、女生體育－瑜伽興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡忻林 (098***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "3275",
    "code": "U5011",
    "name": "男、女生體育－瑜伽興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "雷小娟 (115***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "D",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "3276",
    "code": "U5011",
    "name": "男、女生體育－瑜伽興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡忻林 (098***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "E",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "3277",
    "code": "U5011",
    "name": "男、女生體育－瑜伽興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡忻林 (098***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "F",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "3278",
    "code": "U5011",
    "name": "男、女生體育－瑜伽興趣班 (G班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡忻林 (098***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "G",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "3279",
    "code": "U5026",
    "name": "男、女生體育－適應體育班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "李欣靜, 吳承恩(136***,158***)",
    "classroom": "SG 323",
    "capacity": "",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室,須提醫生證明"
  },
  {
    "serial": "3280",
    "code": "U5026",
    "name": "男、女生體育－適應體育班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "王豐家, 徐詩涵(158***,170***)",
    "classroom": "SG 323",
    "capacity": "",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室,須提醫生證明"
  },
  {
    "serial": "3281",
    "code": "U5026",
    "name": "男、女生體育－適應體育班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃嘉笙, 林子文(158***,167***)",
    "classroom": "SG 323",
    "capacity": "",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室,須提醫生證明 ◇全英語授課"
  },
  {
    "serial": "3282",
    "code": "U5028",
    "name": "男、女生體育專業知能服務－跆拳道 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "王元聖 (119***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 11,12",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "3283",
    "code": "U5034",
    "name": "男、女生體育－舞蹈興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "吳采陵 (169***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室,本課程配合75周年校慶活動進行課程設計與時間異動,請詳閱教學計畫表"
  },
  {
    "serial": "3284",
    "code": "U5034",
    "name": "男、女生體育－舞蹈興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "林子文 (167***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "五 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室,本課程配合75周年校慶活動進行課程設計與時間異動,請詳閱教學計畫表"
  },
  {
    "serial": "3285",
    "code": "U5034",
    "name": "男、女生體育－舞蹈興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "吳采陵 (169***)",
    "classroom": "SG 246",
    "capacity": "70",
    "time_data": [
      [
        5,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "五 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室,本課程配合75周年校慶活動進行課程設計與時間異動,請詳閱教學計畫表 ◇全英語授課"
  },
  {
    "serial": "3286",
    "code": "U5034",
    "name": "男、女生體育－舞蹈興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "林子文 (167***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "D",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓劍道館,本課程配合75周年校慶活動進行課程設計與時間異動,請詳閱教學計畫表"
  },
  {
    "serial": "3287",
    "code": "U5045",
    "name": "男、女生體育－軟式網球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "趙曉雯 (148***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備體育館地下1樓武術室 ◇全英語授課"
  },
  {
    "serial": "3288",
    "code": "U5045",
    "name": "男、女生體育－軟式網球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳凱智 (136***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "五 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備游泳館N201"
  },
  {
    "serial": "3289",
    "code": "U5045",
    "name": "男、女生體育－軟式網球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳凱智 (136***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "C",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備第1周游泳館N201,其他周次SG245 ◇全英語授課"
  },
  {
    "serial": "3291",
    "code": "U5047",
    "name": "男、女生體育－擊劍專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "王順民 (166***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 13,14",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課 ◇全英語授課"
  },
  {
    "serial": "3292",
    "code": "U5048",
    "name": "男、女生體育－撞球專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "張郁洵 (166***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 13,14",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "3293",
    "code": "U5049",
    "name": "男、女生體育－空手道專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "高程輝 (168***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 13,14",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "3294",
    "code": "U5050",
    "name": "男、女生體育－足球專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "李定隆 (168***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 13,14",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "3295",
    "code": "U5051",
    "name": "男、女生體育－棒、壘球專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "謝豐宇 (124***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 13,14",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "3296",
    "code": "U5052",
    "name": "男、女生體育－籃球裁判興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "張弓弘 (078***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場（A）"
  },
  {
    "serial": "3303",
    "code": "A2954",
    "name": "大數據概論與應用 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳瑞發 (084***)",
    "classroom": "E  813",
    "capacity": "90",
    "time_data": [
      [
        2,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 8,9",
    "department": "TGAXB.文學院共同科－日",
    "notes": "淡江大學智慧人文實務創新學分學程"
  },
  {
    "serial": "3306",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (L班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳　著 (155***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "L",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "五虎崗排球場(V2)；雨備：體育館地下一樓武術室。 ◇全英語授課"
  },
  {
    "serial": "3307",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (J班)",
    "credits": 1,
    "category": "必",
    "teacher": "柯明辰 (151***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "J",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "田徑場旁籃球場(B2)；雨備：游泳館N201 ◇全英語授課"
  },
  {
    "serial": "3308",
    "code": "T3208",
    "name": "棒球場上的物理學 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "李中傑 (998***)",
    "classroom": "未定",
    "capacity": "20",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGDLM.遠距教學課程－日",
    "notes": "遠距收播真理大學課程，教學計畫表請至遠距中心網頁查詢 ◇遠距收播外校課程"
  },
  {
    "serial": "3309",
    "code": "T3258",
    "name": "翻轉人生-新南向 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "宋玫怡 (998***)",
    "classroom": "未定",
    "capacity": "5",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TGDLM.遠距教學課程－日",
    "notes": "遠距收播實踐大學課程，教學計畫表請至遠距中心網頁查詢 ◇遠距收播外校課程"
  },
  {
    "serial": "3310",
    "code": "T3307",
    "name": "連結臺灣（四） (A班)",
    "credits": 1,
    "category": "選",
    "teacher": "包蒼龍, 李尚林(998***,998***)",
    "classroom": "未定",
    "capacity": "5",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TGDLM.遠距教學課程－日",
    "notes": "遠距收播大同大學課程，教學計畫表請至遠距中心網頁查詢 ◇遠距收播外校課程"
  },
  {
    "serial": "3332",
    "code": "X0001",
    "name": "英語能力檢定 (A班)",
    "credits": 0,
    "category": "選",
    "teacher": "(***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "/",
    "department": "TGFXB.外語學院共同科日",
    "notes": "限延修生已修足畢業學分，僅未通過外語檢定畢業門檻者修習(請至課務組辦理選課)。"
  },
  {
    "serial": "3370",
    "code": "T3224",
    "name": "磨課師課程（二） (B班)",
    "credits": 2,
    "category": "選",
    "teacher": "(***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "/",
    "department": "TGUXB.校共同科目－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "6005",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "瞿聖強 (124***)",
    "classroom": "D  412",
    "capacity": "40",
    "time_data": [
      [
        5,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 11,12",
    "department": "TEIXE.資工系（進學）",
    "notes": "台北校園上課"
  },
  {
    "serial": "6006",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "應漢斌 (099***)",
    "classroom": "E  414",
    "capacity": "70",
    "time_data": [
      [
        5,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 11,12",
    "department": "TEIXE.資工系（進學）",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "6034",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "白書綾 (153***)",
    "classroom": "D  316",
    "capacity": "70",
    "time_data": [
      [
        5,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 11,12",
    "department": "TFJXE.日文系（進學）",
    "notes": "台北校園上課"
  },
  {
    "serial": "6035",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "葉書吟 (143***)",
    "classroom": "B  504",
    "capacity": "70",
    "time_data": [
      [
        6,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 1,2",
    "department": "TFJXE.日文系（進學）",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "6058",
    "code": "A0515",
    "name": "英國文學（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "朱敏禎 (147***)",
    "classroom": "E  415",
    "capacity": "70",
    "time_data": [
      [
        4,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 11,12",
    "department": "TFLXE.英文系（進學）",
    "notes": "限本系生"
  },
  {
    "serial": "6059",
    "code": "A0532",
    "name": "英語演講 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "白書綾 (153***)",
    "classroom": "E  413",
    "capacity": "60",
    "time_data": [
      [
        3,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 13,14",
    "department": "TFLXE.英文系（進學）",
    "notes": "限本系生"
  },
  {
    "serial": "6060",
    "code": "A0685",
    "name": "新聞英文 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "羅吉旺 (049***)",
    "classroom": "B  701",
    "capacity": "80",
    "time_data": [
      [
        1,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 13,14",
    "department": "TFLXE.英文系（進學）",
    "notes": ""
  },
  {
    "serial": "6061",
    "code": "A1053",
    "name": "英作文（三） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳璽光 (154***)",
    "classroom": "E  413",
    "capacity": "60",
    "time_data": [
      [
        3,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 11,12",
    "department": "TFLXE.英文系（進學）",
    "notes": "限本系生"
  },
  {
    "serial": "6063",
    "code": "F0507",
    "name": "生態與電影 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "郭家珍 (141***)",
    "classroom": "B  701",
    "capacity": "80",
    "time_data": [
      [
        1,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 11,12",
    "department": "TFLXE.英文系（進學）",
    "notes": ""
  },
  {
    "serial": "6064",
    "code": "F0915",
    "name": "閱讀私探小說 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳映華 (151***)",
    "classroom": "E  405",
    "capacity": "80",
    "time_data": [
      [
        2,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 11,12",
    "department": "TFLXE.英文系（進學）",
    "notes": ""
  },
  {
    "serial": "6065",
    "code": "A0472",
    "name": "美國文學 (A班)",
    "credits": 3,
    "category": "必",
    "teacher": "林嘉鴻 (165***)",
    "classroom": "E  404",
    "capacity": "60",
    "time_data": [
      [
        2,
        11,
        13
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 11,12,13",
    "department": "TFLXE.英文系（進學）",
    "notes": "限本系生"
  },
  {
    "serial": "6066",
    "code": "A0484",
    "name": "英文翻譯 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "羅吉旺 (049***)",
    "classroom": "B  702",
    "capacity": "60",
    "time_data": [
      [
        1,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 11,12",
    "department": "TFLXE.英文系（進學）",
    "notes": "限本系生"
  },
  {
    "serial": "6067",
    "code": "B0395",
    "name": "商用英文 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "劉佩勳 (165***)",
    "classroom": "E  414",
    "capacity": "80",
    "time_data": [
      [
        3,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 11,12",
    "department": "TFLXE.英文系（進學）",
    "notes": ""
  },
  {
    "serial": "6068",
    "code": "F0788",
    "name": "英語教學導論 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "張玉英 (122***)",
    "classroom": "E  405",
    "capacity": "80",
    "time_data": [
      [
        1,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 13,14",
    "department": "TFLXE.英文系（進學）",
    "notes": ""
  },
  {
    "serial": "6076",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳瑜雲 (078***)",
    "classroom": "D  312",
    "capacity": "76",
    "time_data": [
      [
        5,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 11,12",
    "department": "TLBXE.財金系（進學）",
    "notes": "台北校園上課"
  },
  {
    "serial": "6077",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林恩如 (102***)",
    "classroom": "B  513",
    "capacity": "70",
    "time_data": [
      [
        5,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 11,12",
    "department": "TLBXE.財金系（進學）",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "6102",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳瑜雲 (078***)",
    "classroom": "D  312",
    "capacity": "70",
    "time_data": [
      [
        5,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 13,14",
    "department": "TLCXE.企管系（進學）",
    "notes": "台北校園上課"
  },
  {
    "serial": "6103",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "葉書吟 (143***)",
    "classroom": "B  513",
    "capacity": "70",
    "time_data": [
      [
        6,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 6,7",
    "department": "TLCXE.企管系（進學）",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "6136",
    "code": "T2013",
    "name": "西洋歌劇欣賞入門 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王淑堯 (117***)",
    "classroom": "B  312",
    "capacity": "80",
    "time_data": [
      [
        6,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "六 / 3,4",
    "department": "TNUME.核心課程Ｍ群－進",
    "notes": "淡水校園上課"
  },
  {
    "serial": "6137",
    "code": "E3862",
    "name": "電腦入門與程式思維 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "翁孟廷 (141***)",
    "classroom": "B  130",
    "capacity": "70",
    "time_data": [
      [
        6,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "O",
    "time_info": "六 / 1,2",
    "department": "TNUOE.核心課程Ｏ群－進",
    "notes": "淡水校園上課，本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "6138",
    "code": "A3454",
    "name": "台灣歷史采風與踏查 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳琮淵 (155***)",
    "classroom": "B  504",
    "capacity": "80",
    "time_data": [
      [
        2,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "P",
    "time_info": "二 / 11,12",
    "department": "TNUPE.核心課程Ｐ群－進",
    "notes": "淡水校園上課 ◇遠距非同步課程"
  },
  {
    "serial": "6139",
    "code": "T1208",
    "name": "政治未來 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "周湘華 (109***)",
    "classroom": "D  315",
    "capacity": "80",
    "time_data": [
      [
        1,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "R",
    "time_info": "一 / 13,14",
    "department": "TNURE.核心課程Ｒ群－進",
    "notes": "台北校園上課"
  },
  {
    "serial": "6140",
    "code": "T0840",
    "name": "美洲現勢 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "宮國威 (100***)",
    "classroom": "B  609",
    "capacity": "80",
    "time_data": [
      [
        1,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "一 / 11,12",
    "department": "TNUTE.核心課程Ｔ群－進",
    "notes": "淡水校園上課"
  },
  {
    "serial": "6141",
    "code": "S0747",
    "name": "數學漫遊 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "潘志實 (132***)",
    "classroom": "B  704",
    "capacity": "80",
    "time_data": [
      [
        2,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "二 / 11,12",
    "department": "TNUUE.核心課程Ｕ群－進",
    "notes": "淡水校園上課。"
  },
  {
    "serial": "6142",
    "code": "T0348",
    "name": "生死學 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "李志成 (163***)",
    "classroom": "B  509",
    "capacity": "80",
    "time_data": [
      [
        6,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "六 / 3,4",
    "department": "TNUVE.核心課程Ｖ群－進",
    "notes": "淡水校園上課"
  },
  {
    "serial": "6143",
    "code": "T0169",
    "name": "人權與社會正義 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林楚淇 (132***)",
    "classroom": "B  615",
    "capacity": "80",
    "time_data": [
      [
        5,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "五 / 11,12",
    "department": "TNUWE.核心課程Ｗ群－進",
    "notes": ""
  },
  {
    "serial": "6144",
    "code": "U1004",
    "name": "全民國防教育軍事訓練（二）－防衛動員 (A班)",
    "credits": 1,
    "category": "選",
    "teacher": "許家豪 (167***)",
    "classroom": "B  509",
    "capacity": "70",
    "time_data": [
      [
        1,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 11,12",
    "department": "TNUYE.全民國防（二）進",
    "notes": "全民國防教育軍事訓練(二)選修課程不列入畢業學分數。"
  },
  {
    "serial": "6145",
    "code": "S0927",
    "name": "科技進化 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "周厚文 (083***)",
    "classroom": "B  501",
    "capacity": "80",
    "time_data": [
      [
        5,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "Z",
    "time_info": "五 / 13,14",
    "department": "TNUZE.核心課程Ｚ群－進",
    "notes": ""
  },
  {
    "serial": "6146",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳昭璁 (163***)",
    "classroom": "未定",
    "capacity": "20",
    "time_data": [
      [
        1,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 13,14",
    "department": "TGUPE.體育興趣選項－進",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "6147",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃至論 (155***)",
    "classroom": "未定",
    "capacity": "20",
    "time_data": [
      [
        5,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 13,14",
    "department": "TGUPE.體育興趣選項－進",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "6148",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "羅琬竹 (163***)",
    "classroom": "未定",
    "capacity": "20",
    "time_data": [
      [
        5,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 11,12",
    "department": "TGUPE.體育興趣選項－進",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "6149",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "楊明堂 (163***)",
    "classroom": "未定",
    "capacity": "20",
    "time_data": [
      [
        5,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "五 / 13,14",
    "department": "TGUPE.體育興趣選項－進",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "6150",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "林坤男 (163***)",
    "classroom": "SG 323",
    "capacity": "20",
    "time_data": [
      [
        5,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 13,14",
    "department": "TGUPE.體育興趣選項－進",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "6151",
    "code": "U5001",
    "name": "男、女生體育-重量訓練 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃貴樹 (138***)",
    "classroom": "SG 323",
    "capacity": "20",
    "time_data": [
      [
        3,
        13,
        14
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 13,14",
    "department": "TGUPE.體育興趣選項－進",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "6152",
    "code": "U5026",
    "name": "男、女生體育－適應體育班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "王豐家, 徐詩涵(158***,170***)",
    "classroom": "SG 323",
    "capacity": "",
    "time_data": [
      [
        3,
        11,
        12
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 11,12",
    "department": "TGUPE.體育興趣選項－進",
    "notes": "體育館SG323重訓室,須提醫生證明"
  },
  {
    "serial": "8220",
    "code": "A2134",
    "name": "英文寫作（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "張雅慧 (126***)",
    "classroom": "T  501",
    "capacity": "",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TFLXM.英文學系碩士班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "8222",
    "code": "F1218",
    "name": "學術英文寫作入門 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "林銘輝 (144***)",
    "classroom": "T  603",
    "capacity": "",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 6,7",
    "department": "TFLXM.英文學系碩士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "8223",
    "code": "F1375",
    "name": "文學研究方法與寫作 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳佩筠 (130***)",
    "classroom": "T  402",
    "capacity": "",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TFLXM.英文學系碩士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "8224",
    "code": "F1376",
    "name": "教學研究方法與寫作 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "劉佩勳 (165***)",
    "classroom": "T  702",
    "capacity": "",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TFLXM.英文學系碩士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "8225",
    "code": "F1583",
    "name": "AI與翻譯研究（一） (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳家倩 (158***)",
    "classroom": "T  501",
    "capacity": "",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 8,9",
    "department": "TFLXM.英文學系碩士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "8226",
    "code": "F1687",
    "name": "記憶與文學 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "熊婷惠 (154***)",
    "classroom": "T  603",
    "capacity": "",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TFLXM.英文學系碩士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "8228",
    "code": "F1736",
    "name": "ＡＩ賦能翻譯學之新研究路徑 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "張介英 (159***)",
    "classroom": "T  608",
    "capacity": "",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TFLXM.英文學系碩士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "8229",
    "code": "T8000",
    "name": "論文 (A班)",
    "credits": 0,
    "category": "必",
    "teacher": "蔡瑞敏 (132***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [
      [
        7,
        1,
        1
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "日 / 1",
    "department": "TFLXM.英文學系碩士班",
    "notes": ""
  },
  {
    "serial": "8230",
    "code": "D0037",
    "name": "質化研究 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "張貴傑, 陳玉樺(154***,167***)",
    "classroom": "ED 601",
    "capacity": "",
    "time_data": [
      [
        1,
        8,
        9
      ],
      [
        1,
        10,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 8,9 一 / 10",
    "department": "TGDXM.教育學院共同－碩",
    "notes": ""
  },
  {
    "serial": "8232",
    "code": "E4457",
    "name": "資料探勘與應用 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "陳宜欣 (996***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        1,
        2,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 2,3,4",
    "department": "TGEXM.工學院共同科－碩",
    "notes": "遠距收播【TAICA課程】，請至https://taicatw.net/fall-114/網頁查詢上課方式。 ◇遠距收播外校課程◇全英語授課"
  },
  {
    "serial": "8233",
    "code": "E4458",
    "name": "智慧人機互動 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "韓秉軒 (996***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        4,
        6,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 6,7,8",
    "department": "TGEXM.工學院共同科－碩",
    "notes": "遠距收播【TAICA課程】，請至https://taicatw.net/fall-114/網頁查詢上課方式。 ◇遠距收播外校課程"
  },
  {
    "serial": "8234",
    "code": "E4459",
    "name": "電腦視覺實務與深度學習 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "朱政安, 鄭文皇(168***,996***)",
    "classroom": "E  812",
    "capacity": "30",
    "time_data": [
      [
        5,
        2,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 2,3,4",
    "department": "TGKXM.創智學院共同科碩",
    "notes": "遠距收播【TAICA課程】，請至https://taicatw.net/fall-114/網頁查詢上課方式。朱政安老師為本校協同教師。 ◇遠距收播外校課程"
  },
  {
    "serial": "8235",
    "code": "M0800",
    "name": "企業倫理 (A班)",
    "credits": 3,
    "category": "必",
    "teacher": "洪英正 (077***)",
    "classroom": "D  403",
    "capacity": "50",
    "time_data": [
      [
        6,
        2,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 2,3,4",
    "department": "TGLXJ.商管學院共同碩專",
    "notes": ""
  },
  {
    "serial": "8236",
    "code": "M0800",
    "name": "企業倫理 (B班)",
    "credits": 3,
    "category": "必",
    "teacher": "田峻吉 (131***)",
    "classroom": "D  319",
    "capacity": "50",
    "time_data": [
      [
        4,
        11,
        13
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 11,12,13",
    "department": "TGLXJ.商管學院共同碩專",
    "notes": ""
  },
  {
    "serial": "8237",
    "code": "M0800",
    "name": "企業倫理 (C班)",
    "credits": 3,
    "category": "必",
    "teacher": "張勝雄 (140***)",
    "classroom": "D  408",
    "capacity": "50",
    "time_data": [
      [
        1,
        11,
        13
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "",
    "time_info": "一 / 11,12,13",
    "department": "TGLXJ.商管學院共同碩專",
    "notes": ""
  },
  {
    "serial": "8238",
    "code": "M2074",
    "name": "領導與團隊 (A班)",
    "credits": 3,
    "category": "必",
    "teacher": "汪美伶 (134***)",
    "classroom": "D  404",
    "capacity": "50",
    "time_data": [
      [
        2,
        11,
        13
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 11,12,13",
    "department": "TGLXJ.商管學院共同碩專",
    "notes": ""
  },
  {
    "serial": "8239",
    "code": "M2074",
    "name": "領導與團隊 (B班)",
    "credits": 3,
    "category": "必",
    "teacher": "李孟修 (159***)",
    "classroom": "D  404",
    "capacity": "50",
    "time_data": [
      [
        5,
        11,
        13
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "五 / 11,12,13",
    "department": "TGLXJ.商管學院共同碩專",
    "notes": ""
  },
  {
    "serial": "8240",
    "code": "M2074",
    "name": "領導與團隊 (C班)",
    "credits": 3,
    "category": "必",
    "teacher": "林江峰 (106***)",
    "classroom": "D  408",
    "capacity": "50",
    "time_data": [
      [
        3,
        11,
        13
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 11,12,13",
    "department": "TGLXJ.商管學院共同碩專",
    "notes": ""
  },
  {
    "serial": "8241",
    "code": "M2499",
    "name": "運動與健康管理 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "陳文和 (137***)",
    "classroom": "D  317,D  117",
    "capacity": "10",
    "time_data": [
      [
        6,
        2,
        2
      ],
      [
        6,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 2 六 / 3,4",
    "department": "TGLXJ.商管學院共同碩專",
    "notes": ""
  },
  {
    "serial": "8242",
    "code": "T0081",
    "name": "研究方法 (A班)",
    "credits": 3,
    "category": "必",
    "teacher": "廖述賢 (121***)",
    "classroom": "D  404",
    "capacity": "50",
    "time_data": [
      [
        6,
        2,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 2,3,4",
    "department": "TGLXJ.商管學院共同碩專",
    "notes": ""
  },
  {
    "serial": "8243",
    "code": "B1776",
    "name": "退休規劃與理財 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "繆震宇 (119***)",
    "classroom": "L  206",
    "capacity": "",
    "time_data": [
      [
        5,
        2,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 2,3,4",
    "department": "TGLXM.商管學院共同科碩",
    "notes": ""
  },
  {
    "serial": "8244",
    "code": "B1801",
    "name": "綠色消費與經營 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "張雍昇 (136***)",
    "classroom": "B  115",
    "capacity": "",
    "time_data": [
      [
        3,
        2,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 2,3,4",
    "department": "TGLXM.商管學院共同科碩",
    "notes": ""
  },
  {
    "serial": "8245",
    "code": "E4394",
    "name": "生成式ＡＩ：文字與圖像生成的原理與實務 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "林仁祥, 蔡炎龍(167***,996***)",
    "classroom": "Q  305",
    "capacity": "30",
    "time_data": [
      [
        2,
        9,
        11
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 9,10,11",
    "department": "TGLXM.商管學院共同科碩",
    "notes": "遠距收播【TAICA課程】，請至https://taicatw.net/fall-114/網頁查詢上課方式。林仁祥老師為本校協同教師。 ◇遠距收播外校課程"
  },
  {
    "serial": "8246",
    "code": "M0800",
    "name": "企業倫理 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳威任 (166***)",
    "classroom": "Q  201",
    "capacity": "",
    "time_data": [
      [
        3,
        6,
        6
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 6",
    "department": "TGLXM.商管學院共同科碩",
    "notes": "◇全英語授課"
  },
  {
    "serial": "8247",
    "code": "M0800",
    "name": "企業倫理 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "汪美伶 (134***)",
    "classroom": "L  412",
    "capacity": "",
    "time_data": [
      [
        4,
        4,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 4",
    "department": "TGLXM.商管學院共同科碩",
    "notes": "◇遠距非同步課程"
  },
  {
    "serial": "8249",
    "code": "M2569",
    "name": "創意解決問題理論與應用 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "陳有科 (160***)",
    "classroom": "Q  408",
    "capacity": "",
    "time_data": [
      [
        1,
        7,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 7,8,9",
    "department": "TGLXM.商管學院共同科碩",
    "notes": "◇全英語授課"
  },
  {
    "serial": "8250",
    "code": "M2770",
    "name": "金融科技導論 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "張智星 (996***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        3,
        2,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 2,3,4",
    "department": "TGLXM.商管學院共同科碩",
    "notes": "TAICA遠距課程，https://taicatw.net/fall-114/查詢上課方式。通識教育跨領域微學程課程，大學部學可選修 ◇遠距收播外校課程"
  },
  {
    "serial": "8251",
    "code": "S1004",
    "name": "研究方法與學術倫理 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "蔡志群 (141***)",
    "classroom": "Q  203",
    "capacity": "",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGSXM.理學院共同科－碩",
    "notes": ""
  },
  {
    "serial": "9044",
    "code": "F1376",
    "name": "教學研究方法與寫作 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "林怡弟 (118***)",
    "classroom": "T  410",
    "capacity": "",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TFLXD.英文系博士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "9045",
    "code": "F1723",
    "name": "ＡＩ輔助語言教學 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "林銘輝 (144***)",
    "classroom": "T  213",
    "capacity": "",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TFLXD.英文系博士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "9046",
    "code": "F1728",
    "name": "醫療人文：馬拉布專題 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "蔡振興 (088***)",
    "classroom": "T  603",
    "capacity": "",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TFLXD.英文系博士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "9047",
    "code": "F1730",
    "name": "初階量化研究 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "林銘輝 (144***)",
    "classroom": "T  213",
    "capacity": "",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TFLXD.英文系博士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "9048",
    "code": "F1733",
    "name": "澳洲文學 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "羅艾琳 (136***)",
    "classroom": "T  407",
    "capacity": "",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TFLXD.英文系博士班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "9049",
    "code": "T8000",
    "name": "論文 (A班)",
    "credits": 0,
    "category": "必",
    "teacher": "蔡瑞敏 (132***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [
      [
        7,
        2,
        2
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "日 / 2",
    "department": "TFLXD.英文系博士班",
    "notes": ""
  },
  {
    "serial": "9050",
    "code": "M0800",
    "name": "企業倫理 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪英正 (077***)",
    "classroom": "L  206",
    "capacity": "",
    "time_data": [
      [
        2,
        5,
        5
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 5",
    "department": "TGLXD.商管學院共同科博",
    "notes": ""
  },
  {
    "serial": "0552",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王慧娟 (119***)",
    "classroom": "E  401",
    "capacity": "80",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TEIDB.資工系英語班",
    "notes": "限全英語專班學生 ◇全英語授課"
  },
  {
    "serial": "0555",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "馬天樂 (161***)",
    "classroom": "E  304",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TEIDB.資工系英語班",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。限全英語專班學生。 ◇全英語授課"
  },
  {
    "serial": "1028",
    "code": "A0159",
    "name": "文學作品讀法 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳凱書 (151***)",
    "classroom": "B  425",
    "capacity": "80",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 6,7",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1029",
    "code": "A0506",
    "name": "英作文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "莊晏甄 (138***)",
    "classroom": "L  305",
    "capacity": "25",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1030",
    "code": "A0506",
    "name": "英作文（一） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "張介英 (159***)",
    "classroom": "L  303",
    "capacity": "25",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1031",
    "code": "A0529",
    "name": "英語會話 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "小澤自然 (143***)",
    "classroom": "T  308",
    "capacity": "22",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 8,9",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1032",
    "code": "A0529",
    "name": "英語會話 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "張介英 (159***)",
    "classroom": "E  414",
    "capacity": "22",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 8,9",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1033",
    "code": "F0755",
    "name": "大一英文 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王蔚婷 (133***)",
    "classroom": "B  120",
    "capacity": "70",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1034",
    "code": "F1517",
    "name": "跨領域研究導論 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡振興 (088***)",
    "classroom": "T  404",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1035",
    "code": "T9607",
    "name": "校園與社區服務學習 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "賴淑秀 (167***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TFLAB.英文系英語班",
    "notes": "一年級限修本班，校外課程。 ◇全英語授課"
  },
  {
    "serial": "1036",
    "code": "T9703",
    "name": "全民國防教育軍事訓練（一）－國防科技 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "翁明賢 (061***)",
    "classroom": "B  425",
    "capacity": "120",
    "time_data": [
      [
        2,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 8,9",
    "department": "TFLAB.英文系英語班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1037",
    "code": "A0318",
    "name": "西洋文學概論 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "齊嵩齡 (128***)",
    "classroom": "T  404",
    "capacity": "80",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TFLAB.英文系英語班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1038",
    "code": "A0507",
    "name": "英作文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "齊嵩齡 (128***)",
    "classroom": "T  601",
    "capacity": "60",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1039",
    "code": "A0535",
    "name": "英語語言學概論 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉佩勳 (165***)",
    "classroom": "B  512",
    "capacity": "75",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1040",
    "code": "A1858",
    "name": "英國文學 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "包俊傑 (133***)",
    "classroom": "B  425",
    "capacity": "80",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1041",
    "code": "F0101",
    "name": "英語口語表達 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王蔚婷 (133***)",
    "classroom": "B  429",
    "capacity": "60",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1042",
    "code": "F0472",
    "name": "環境與文學 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "莊晏甄 (138***)",
    "classroom": "H  115",
    "capacity": "175",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TFLAB.英文系英語班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1043",
    "code": "A0685",
    "name": "新聞英文 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "王蔚婷 (133***)",
    "classroom": "E  416",
    "capacity": "80",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TFLAB.英文系英語班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1044",
    "code": "A1152",
    "name": "西洋文學批評導讀 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "莊晏甄 (138***)",
    "classroom": "T  704",
    "capacity": "70",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 6,7",
    "department": "TFLAB.英文系英語班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1045",
    "code": "A0472",
    "name": "美國文學 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "羅艾琳 (136***)",
    "classroom": "Q  202",
    "capacity": "70",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 6,7",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1046",
    "code": "A0484",
    "name": "英文翻譯 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "齊嵩齡 (128***)",
    "classroom": "T  808",
    "capacity": "25",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1047",
    "code": "A2676",
    "name": "畢業專題(二) (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "齊嵩齡 (128***)",
    "classroom": "T  808",
    "capacity": "60",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TFLAB.英文系英語班",
    "notes": "限本系本班生 ◇全英語授課"
  },
  {
    "serial": "1048",
    "code": "F0426",
    "name": "閱讀當代文化 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "齊嵩齡 (128***)",
    "classroom": "T  601",
    "capacity": "90",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 1,2",
    "department": "TFLAB.英文系英語班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1049",
    "code": "F0915",
    "name": "閱讀私探小說 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "包俊傑 (133***)",
    "classroom": "B  602",
    "capacity": "90",
    "time_data": [
      [
        1,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 8,9",
    "department": "TFLAB.英文系英語班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1050",
    "code": "F1674",
    "name": "求職英文 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "劉佩勳 (165***)",
    "classroom": "T  404",
    "capacity": "90",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TFLAB.英文系英語班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1051",
    "code": "A0159",
    "name": "文學作品讀法 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡振興 (088***)",
    "classroom": "T  311",
    "capacity": "80",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1052",
    "code": "A0159",
    "name": "文學作品讀法 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳怡芬 (119***)",
    "classroom": "L  306",
    "capacity": "80",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系生 ◇全英語授課"
  },
  {
    "serial": "1053",
    "code": "A0506",
    "name": "英作文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "雷　凱 (141***)",
    "classroom": "T  506",
    "capacity": "25",
    "time_data": [
      [
        2,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 8,9",
    "department": "TFLXB.英文系（日）",
    "notes": "A1,限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1054",
    "code": "A0506",
    "name": "英作文（一） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "薛玉政 (134***)",
    "classroom": "L  305",
    "capacity": "25",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "A2,限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1055",
    "code": "A0506",
    "name": "英作文（一） (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "林銘輝 (144***)",
    "classroom": "T  605",
    "capacity": "25",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TFLXB.英文系（日）",
    "notes": "B1,限本系生 ◇以實整虛課程◇雙語授課(中文/英文)"
  },
  {
    "serial": "1056",
    "code": "A0506",
    "name": "英作文（一） (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "熊婷惠 (154***)",
    "classroom": "T  506",
    "capacity": "25",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "B2,限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1057",
    "code": "A0506",
    "name": "英作文（一） (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳瑜雲 (078***)",
    "classroom": "T  601",
    "capacity": "25",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "E",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "A+B,限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1058",
    "code": "A0529",
    "name": "英語會話 (AA班)",
    "credits": 2,
    "category": "必",
    "teacher": "林嘉鴻 (165***)",
    "classroom": "E  415,T  211",
    "capacity": "22",
    "time_data": [
      [
        2,
        1,
        2
      ],
      [
        2,
        10,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AA",
    "group_type": "",
    "time_info": "二 / 1,2 二 / 10",
    "department": "TFLXB.英文系（日）",
    "notes": "A1,限本系生 ◇全英語授課"
  },
  {
    "serial": "1059",
    "code": "A0529",
    "name": "英語會話 (AB班)",
    "credits": 2,
    "category": "必",
    "teacher": "林嘉鴻 (165***)",
    "classroom": "E  415,V  201",
    "capacity": "22",
    "time_data": [
      [
        2,
        1,
        2
      ],
      [
        4,
        10,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AB",
    "group_type": "",
    "time_info": "二 / 1,2 四 / 10",
    "department": "TFLXB.英文系（日）",
    "notes": "A1,限本系生 ◇全英語授課"
  },
  {
    "serial": "1060",
    "code": "A0529",
    "name": "英語會話 (BA班)",
    "credits": 2,
    "category": "必",
    "teacher": "郭家珍 (141***)",
    "classroom": "T  308,T  211",
    "capacity": "22",
    "time_data": [
      [
        1,
        7,
        8
      ],
      [
        5,
        6,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "BA",
    "group_type": "",
    "time_info": "一 / 7,8 五 / 6",
    "department": "TFLXB.英文系（日）",
    "notes": "A2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1061",
    "code": "A0529",
    "name": "英語會話 (BB班)",
    "credits": 2,
    "category": "必",
    "teacher": "郭家珍 (141***)",
    "classroom": "T  308,T  211",
    "capacity": "22",
    "time_data": [
      [
        1,
        7,
        8
      ],
      [
        2,
        10,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "BB",
    "group_type": "",
    "time_info": "一 / 7,8 二 / 10",
    "department": "TFLXB.英文系（日）",
    "notes": "A2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1062",
    "code": "A0529",
    "name": "英語會話 (CA班)",
    "credits": 2,
    "category": "必",
    "teacher": "錢欽昭 (134***)",
    "classroom": "B  115,V  201",
    "capacity": "22",
    "time_data": [
      [
        3,
        7,
        8
      ],
      [
        4,
        10,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "CA",
    "group_type": "",
    "time_info": "三 / 7,8 四 / 10",
    "department": "TFLXB.英文系（日）",
    "notes": "A3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1063",
    "code": "A0529",
    "name": "英語會話 (CB班)",
    "credits": 2,
    "category": "必",
    "teacher": "錢欽昭 (134***)",
    "classroom": "B  115,T  211",
    "capacity": "22",
    "time_data": [
      [
        3,
        7,
        8
      ],
      [
        5,
        6,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "CB",
    "group_type": "",
    "time_info": "三 / 7,8 五 / 6",
    "department": "TFLXB.英文系（日）",
    "notes": "A3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1064",
    "code": "A0529",
    "name": "英語會話 (DA班)",
    "credits": 2,
    "category": "必",
    "teacher": "雷　凱 (141***)",
    "classroom": "L  304,V  201",
    "capacity": "22",
    "time_data": [
      [
        2,
        6,
        7
      ],
      [
        2,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "DA",
    "group_type": "",
    "time_info": "二 / 6,7 二 / 1",
    "department": "TFLXB.英文系（日）",
    "notes": "B1,限本系生 ◇全英語授課"
  },
  {
    "serial": "1065",
    "code": "A0529",
    "name": "英語會話 (DB班)",
    "credits": 2,
    "category": "必",
    "teacher": "雷　凱 (141***)",
    "classroom": "L  304,V  201",
    "capacity": "22",
    "time_data": [
      [
        2,
        6,
        7
      ],
      [
        2,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "DB",
    "group_type": "",
    "time_info": "二 / 6,7 二 / 2",
    "department": "TFLXB.英文系（日）",
    "notes": "B1,限本系生 ◇全英語授課"
  },
  {
    "serial": "1066",
    "code": "A0529",
    "name": "英語會話 (EA班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳凱書 (151***)",
    "classroom": "B  115,V  201",
    "capacity": "22",
    "time_data": [
      [
        4,
        3,
        4
      ],
      [
        3,
        8,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "EA",
    "group_type": "",
    "time_info": "四 / 3,4 三 / 8",
    "department": "TFLXB.英文系（日）",
    "notes": "B2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1067",
    "code": "A0529",
    "name": "英語會話 (EB班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳凱書 (151***)",
    "classroom": "B  115,V  201",
    "capacity": "22",
    "time_data": [
      [
        4,
        3,
        4
      ],
      [
        2,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "EB",
    "group_type": "",
    "time_info": "四 / 3,4 二 / 1",
    "department": "TFLXB.英文系（日）",
    "notes": "B2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1068",
    "code": "A0529",
    "name": "英語會話 (FA班)",
    "credits": 2,
    "category": "必",
    "teacher": "熊婷惠 (154***)",
    "classroom": "T  505,V  201",
    "capacity": "22",
    "time_data": [
      [
        4,
        3,
        4
      ],
      [
        2,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "FA",
    "group_type": "",
    "time_info": "四 / 3,4 二 / 2",
    "department": "TFLXB.英文系（日）",
    "notes": "B3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1069",
    "code": "A0529",
    "name": "英語會話 (FB班)",
    "credits": 2,
    "category": "必",
    "teacher": "熊婷惠 (154***)",
    "classroom": "T  505,V  201",
    "capacity": "22",
    "time_data": [
      [
        4,
        3,
        4
      ],
      [
        3,
        8,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "FB",
    "group_type": "",
    "time_info": "四 / 3,4 三 / 8",
    "department": "TFLXB.英文系（日）",
    "notes": "B3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1070",
    "code": "A1376",
    "name": "中國語文能力表達 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉依潔 (146***)",
    "classroom": "L  212",
    "capacity": "75",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": ""
  },
  {
    "serial": "1071",
    "code": "A1376",
    "name": "中國語文能力表達 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "許維萍 (128***)",
    "classroom": "B  309",
    "capacity": "75",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": ""
  },
  {
    "serial": "1072",
    "code": "F0755",
    "name": "大一英文 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "雷　凱 (141***)",
    "classroom": "T  404",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "A班 ◇全英語授課"
  },
  {
    "serial": "1073",
    "code": "F0755",
    "name": "大一英文 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "包俊傑 (133***)",
    "classroom": "E  404",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "五 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "B班 ◇全英語授課"
  },
  {
    "serial": "1074",
    "code": "T2637",
    "name": "社團學習與實作－入門課程 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃文智 (052***)",
    "classroom": "B  119",
    "capacity": "70",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "K",
    "time_info": "一 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "上課6次，實際上課週次請詳教學計畫表"
  },
  {
    "serial": "1075",
    "code": "T2637",
    "name": "社團學習與實作－入門課程 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃文智 (052***)",
    "classroom": "S  420",
    "capacity": "70",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "K",
    "time_info": "四 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "上課6次，實際上課週次請詳教學計畫表"
  },
  {
    "serial": "1076",
    "code": "T9607",
    "name": "校園與社區服務學習 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "賴淑秀 (167***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "一年級限修本班。"
  },
  {
    "serial": "1077",
    "code": "T9607",
    "name": "校園與社區服務學習 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳志亮 (170***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "一年級限修本班，校外課程。"
  },
  {
    "serial": "1078",
    "code": "A0318",
    "name": "西洋文學概論 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "郭家珍 (141***)",
    "classroom": "T  310",
    "capacity": "80",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "P",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "1079",
    "code": "A0507",
    "name": "英作文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳瑜雲 (078***)",
    "classroom": "T  703",
    "capacity": "25",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "A1,限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1080",
    "code": "A0507",
    "name": "英作文（二） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉佩勳 (165***)",
    "classroom": "B  512",
    "capacity": "25",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "A2,限本系生 ◇以實整虛課程◇雙語授課(中文/英文)"
  },
  {
    "serial": "1081",
    "code": "A0507",
    "name": "英作文（二） (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "王蔚婷 (133***)",
    "classroom": "T  401",
    "capacity": "25",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "A3,限本系生 ◇以實整虛課程◇雙語授課(中文/英文)"
  },
  {
    "serial": "1082",
    "code": "A0507",
    "name": "英作文（二） (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "張慈珊 (125***)",
    "classroom": "L  407",
    "capacity": "25",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "B1,限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1083",
    "code": "A0507",
    "name": "英作文（二） (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "張雅慧 (126***)",
    "classroom": "L  417",
    "capacity": "25",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "E",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "B2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1084",
    "code": "A0507",
    "name": "英作文（二） (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "錢欽昭 (134***)",
    "classroom": "Q  202",
    "capacity": "25",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "F",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "B3,限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1085",
    "code": "A0514",
    "name": "英國文學（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "熊婷惠 (154***)",
    "classroom": "L  205",
    "capacity": "80",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1086",
    "code": "A0514",
    "name": "英國文學（一） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡振興 (088***)",
    "classroom": "T  311",
    "capacity": "80",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1087",
    "code": "A0535",
    "name": "英語語言學概論 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "薛玉政 (134***)",
    "classroom": "L  205",
    "capacity": "75",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1088",
    "code": "A0535",
    "name": "英語語言學概論 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "曾郁景 (134***)",
    "classroom": "B  111",
    "capacity": "75",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系生 ◇以實整虛課程◇雙語授課(中文/英文)"
  },
  {
    "serial": "1089",
    "code": "A0537",
    "name": "英語語音學 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "張玉英 (122***)",
    "classroom": "T  212",
    "capacity": "175",
    "time_data": [
      [
        1,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "一 / 8,9",
    "department": "TFLXB.英文系（日）",
    "notes": ""
  },
  {
    "serial": "1090",
    "code": "A1617",
    "name": "英美散文選讀 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "錢欽昭 (134***)",
    "classroom": "B  602",
    "capacity": "80",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": ""
  },
  {
    "serial": "1091",
    "code": "F0101",
    "name": "英語口語表達 (AA班)",
    "credits": 2,
    "category": "必",
    "teacher": "涂銘宏 (124***)",
    "classroom": "L  310,V  102",
    "capacity": "22",
    "time_data": [
      [
        4,
        7,
        8
      ],
      [
        3,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AA",
    "group_type": "",
    "time_info": "四 / 7,8 三 / 2",
    "department": "TFLXB.英文系（日）",
    "notes": "A1,限本系生 ◇跨國遠距◇全英語授課"
  },
  {
    "serial": "1092",
    "code": "F0101",
    "name": "英語口語表達 (AB班)",
    "credits": 2,
    "category": "必",
    "teacher": "涂銘宏 (124***)",
    "classroom": "L  310,V  201",
    "capacity": "22",
    "time_data": [
      [
        4,
        7,
        8
      ],
      [
        4,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AB",
    "group_type": "",
    "time_info": "四 / 7,8 四 / 2",
    "department": "TFLXB.英文系（日）",
    "notes": "A1,限本系生 ◇跨國遠距◇全英語授課"
  },
  {
    "serial": "1093",
    "code": "F0101",
    "name": "英語口語表達 (BA班)",
    "credits": 2,
    "category": "必",
    "teacher": "林怡弟 (118***)",
    "classroom": "T  211,V  102",
    "capacity": "22",
    "time_data": [
      [
        5,
        2,
        3
      ],
      [
        5,
        4,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "BA",
    "group_type": "",
    "time_info": "五 / 2,3 五 / 4",
    "department": "TFLXB.英文系（日）",
    "notes": "A2,限本系生 ◇跨國遠距◇全英語授課"
  },
  {
    "serial": "1094",
    "code": "F0101",
    "name": "英語口語表達 (BB班)",
    "credits": 2,
    "category": "必",
    "teacher": "林怡弟 (118***)",
    "classroom": "T  211,V  102",
    "capacity": "22",
    "time_data": [
      [
        5,
        2,
        3
      ],
      [
        3,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "BB",
    "group_type": "",
    "time_info": "五 / 2,3 三 / 2",
    "department": "TFLXB.英文系（日）",
    "notes": "A2,限本系生 ◇跨國遠距◇全英語授課"
  },
  {
    "serial": "1095",
    "code": "F0101",
    "name": "英語口語表達 (CA班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄧秋蓉 (138***)",
    "classroom": "T  308,V  201",
    "capacity": "22",
    "time_data": [
      [
        1,
        3,
        4
      ],
      [
        4,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "CA",
    "group_type": "",
    "time_info": "一 / 3,4 四 / 2",
    "department": "TFLXB.英文系（日）",
    "notes": "A3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1096",
    "code": "F0101",
    "name": "英語口語表達 (CB班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄧秋蓉 (138***)",
    "classroom": "T  308,V  102",
    "capacity": "22",
    "time_data": [
      [
        1,
        3,
        4
      ],
      [
        5,
        4,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "CB",
    "group_type": "",
    "time_info": "一 / 3,4 五 / 4",
    "department": "TFLXB.英文系（日）",
    "notes": "A3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1097",
    "code": "F0101",
    "name": "英語口語表達 (DA班)",
    "credits": 2,
    "category": "必",
    "teacher": "薛玉政 (134***)",
    "classroom": "T  308,V  201",
    "capacity": "22",
    "time_data": [
      [
        3,
        6,
        7
      ],
      [
        3,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "DA",
    "group_type": "",
    "time_info": "三 / 6,7 三 / 9",
    "department": "TFLXB.英文系（日）",
    "notes": "B1,限本系生 ◇全英語授課"
  },
  {
    "serial": "1098",
    "code": "F0101",
    "name": "英語口語表達 (DB班)",
    "credits": 2,
    "category": "必",
    "teacher": "薛玉政 (134***)",
    "classroom": "T  308,V  102",
    "capacity": "22",
    "time_data": [
      [
        3,
        6,
        7
      ],
      [
        4,
        8,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "DB",
    "group_type": "",
    "time_info": "三 / 6,7 四 / 8",
    "department": "TFLXB.英文系（日）",
    "notes": "B1,限本系生 ◇全英語授課"
  },
  {
    "serial": "1099",
    "code": "F0101",
    "name": "英語口語表達 (EA班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳怡芬 (119***)",
    "classroom": "T  308,V  102",
    "capacity": "22",
    "time_data": [
      [
        2,
        7,
        8
      ],
      [
        5,
        3,
        3
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "EA",
    "group_type": "",
    "time_info": "二 / 7,8 五 / 3",
    "department": "TFLXB.英文系（日）",
    "notes": "B2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1100",
    "code": "F0101",
    "name": "英語口語表達 (EB班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳怡芬 (119***)",
    "classroom": "T  308,V  201",
    "capacity": "22",
    "time_data": [
      [
        2,
        7,
        8
      ],
      [
        3,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "EB",
    "group_type": "",
    "time_info": "二 / 7,8 三 / 9",
    "department": "TFLXB.英文系（日）",
    "notes": "B2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1101",
    "code": "F0101",
    "name": "英語口語表達 (FA班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡瑞敏 (132***)",
    "classroom": "T  606,V  102",
    "capacity": "22",
    "time_data": [
      [
        2,
        6,
        7
      ],
      [
        4,
        8,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "FA",
    "group_type": "",
    "time_info": "二 / 6,7 四 / 8",
    "department": "TFLXB.英文系（日）",
    "notes": "B3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1102",
    "code": "F0101",
    "name": "英語口語表達 (FB班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡瑞敏 (132***)",
    "classroom": "T  606,V  102",
    "capacity": "22",
    "time_data": [
      [
        2,
        6,
        7
      ],
      [
        5,
        3,
        3
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "FB",
    "group_type": "",
    "time_info": "二 / 6,7 五 / 3",
    "department": "TFLXB.英文系（日）",
    "notes": "B3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1103",
    "code": "A0515",
    "name": "英國文學（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "小澤自然 (143***)",
    "classroom": "T  109",
    "capacity": "75",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系生 ◇全英語授課"
  },
  {
    "serial": "1104",
    "code": "A0515",
    "name": "英國文學（二） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "涂銘宏 (124***)",
    "classroom": "L  212",
    "capacity": "75",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1105",
    "code": "A0532",
    "name": "英語演講 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉佩勳 (165***)",
    "classroom": "T  703",
    "capacity": "22",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "A1,限本系生 ◇全英語授課"
  },
  {
    "serial": "1106",
    "code": "A0532",
    "name": "英語演講 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "張雅慧 (126***)",
    "classroom": "T  309",
    "capacity": "22",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "A2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1107",
    "code": "A0532",
    "name": "英語演講 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "包俊傑 (133***)",
    "classroom": "E  415",
    "capacity": "22",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "A3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1108",
    "code": "A0532",
    "name": "英語演講 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "羅艾琳 (136***)",
    "classroom": "T  309",
    "capacity": "22",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "A+B,限本系生 ◇全英語授課"
  },
  {
    "serial": "1109",
    "code": "A0532",
    "name": "英語演講 (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "張雅慧 (126***)",
    "classroom": "T  506",
    "capacity": "22",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "E",
    "group_type": "",
    "time_info": "二 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "B1,限本系生 ◇全英語授課"
  },
  {
    "serial": "1110",
    "code": "A0532",
    "name": "英語演講 (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "林銘輝 (144***)",
    "classroom": "T  506",
    "capacity": "22",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "F",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "B2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1111",
    "code": "A0532",
    "name": "英語演講 (G班)",
    "credits": 2,
    "category": "必",
    "teacher": "張慈珊 (125***)",
    "classroom": "L  417",
    "capacity": "22",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "G",
    "group_type": "",
    "time_info": "一 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "B3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1112",
    "code": "A0685",
    "name": "新聞英文 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "黃永裕 (035***)",
    "classroom": "T  310",
    "capacity": "175",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "P",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": ""
  },
  {
    "serial": "1113",
    "code": "A0988",
    "name": "小說選讀 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "羅艾琳 (136***)",
    "classroom": "T  311",
    "capacity": "120",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "五 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1114",
    "code": "A1053",
    "name": "英作文（三） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林嘉鴻 (165***)",
    "classroom": "B  429",
    "capacity": "25",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 8,9",
    "department": "TFLXB.英文系（日）",
    "notes": "A1,限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1115",
    "code": "A1053",
    "name": "英作文（三） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "羅艾琳 (136***)",
    "classroom": "T  309",
    "capacity": "25",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 8,9",
    "department": "TFLXB.英文系（日）",
    "notes": "A2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1116",
    "code": "A1053",
    "name": "英作文（三） (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "包俊傑 (133***)",
    "classroom": "E  415",
    "capacity": "25",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "A3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1117",
    "code": "A1053",
    "name": "英作文（三） (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "涂銘宏 (124***)",
    "classroom": "T  309",
    "capacity": "25",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "B1,限本系生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1118",
    "code": "A1053",
    "name": "英作文（三） (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "小澤自然 (143***)",
    "classroom": "T  308",
    "capacity": "25",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "E",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "B2,限本系生 ◇全英語授課"
  },
  {
    "serial": "1119",
    "code": "A1053",
    "name": "英作文（三） (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "雷　凱 (141***)",
    "classroom": "T  604",
    "capacity": "25",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "F",
    "group_type": "",
    "time_info": "三 / 8,9",
    "department": "TFLXB.英文系（日）",
    "notes": "B3,限本系生 ◇全英語授課"
  },
  {
    "serial": "1120",
    "code": "F0788",
    "name": "英語教學導論 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "蔡瑞敏 (132***)",
    "classroom": "Q  202",
    "capacity": "175",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "P",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "1121",
    "code": "F1079",
    "name": "逐步口譯 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "王　潔 (145***)",
    "classroom": "E  414",
    "capacity": "30",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "P",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "未修習「逐步口譯」上學期課程的同學，不得修習下學期課程 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1122",
    "code": "F1081",
    "name": "戲劇與表演 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "林嘉鴻 (165***)",
    "classroom": "T  401",
    "capacity": "175",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "P",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "限英文系學生，且需參與戲劇公演。"
  },
  {
    "serial": "1123",
    "code": "F1082",
    "name": "英語華語教學 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "林怡嘉 (169***)",
    "classroom": "E  513",
    "capacity": "90",
    "time_data": [
      [
        5,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "五 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": ""
  },
  {
    "serial": "1124",
    "code": "F1677",
    "name": "二語教學法 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "張慈珊 (125***)",
    "classroom": "T  606",
    "capacity": "50",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "P",
    "group_type": "",
    "time_info": "三 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "1125",
    "code": "A0472",
    "name": "美國文學 (A班)",
    "credits": 3,
    "category": "必",
    "teacher": "錢欽昭 (134***)",
    "classroom": "Q  203,Q  202",
    "capacity": "70",
    "time_data": [
      [
        2,
        6,
        6
      ],
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 6 四 / 8,9",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系大四生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1126",
    "code": "A0472",
    "name": "美國文學 (B班)",
    "credits": 3,
    "category": "必",
    "teacher": "莊晏甄 (138***)",
    "classroom": "E  413,T  701",
    "capacity": "70",
    "time_data": [
      [
        4,
        5,
        5
      ],
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 5 四 / 8,9",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系大四生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1127",
    "code": "A0472",
    "name": "美國文學 (C班)",
    "credits": 3,
    "category": "必",
    "teacher": "鄧秋蓉 (138***)",
    "classroom": "T  311,L  212",
    "capacity": "70",
    "time_data": [
      [
        3,
        3,
        4
      ],
      [
        3,
        6,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 3,4 三 / 6",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系大四生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1128",
    "code": "A0484",
    "name": "英文翻譯 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄧秋蓉 (138***)",
    "classroom": "Q  203",
    "capacity": "25",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "A1,限本系大四生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1129",
    "code": "A0484",
    "name": "英文翻譯 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳佩筠 (130***)",
    "classroom": "T  704",
    "capacity": "25",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "A2,限本系大四生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1130",
    "code": "A0484",
    "name": "英文翻譯 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "郭家珍 (141***)",
    "classroom": "T  605",
    "capacity": "25",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "B1,限本系大四生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1131",
    "code": "A0484",
    "name": "英文翻譯 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳家倩 (158***)",
    "classroom": "T  307",
    "capacity": "25",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "B2,限本系大四生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1132",
    "code": "A0484",
    "name": "英文翻譯 (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳怡芬 (119***)",
    "classroom": "T  308",
    "capacity": "25",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "2",
    "class_name": "E",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "C1,限本系大四生 ◇專業知能服務學習課程◇雙語授課(中文/英文)"
  },
  {
    "serial": "1133",
    "code": "A0484",
    "name": "英文翻譯 (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "管雅凡 (167***)",
    "classroom": "E  415",
    "capacity": "25",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "2",
    "class_name": "F",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "C2,限本系大四生 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "1134",
    "code": "A1152",
    "name": "西洋文學批評導讀 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "蔡振興 (088***)",
    "classroom": "T  311",
    "capacity": "175",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "2",
    "class_name": "P",
    "group_type": "",
    "time_info": "五 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "1135",
    "code": "B0395",
    "name": "商用英文 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "張介英 (159***)",
    "classroom": "T  110",
    "capacity": "90",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "2",
    "class_name": "P",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "1136",
    "code": "F0371",
    "name": "高級英文 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "雷　凱 (141***)",
    "classroom": "T  605",
    "capacity": "",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "畢業門檻替代課程,需選課者請持相關證明至系辦選課。 ◇全英語授課"
  },
  {
    "serial": "1137",
    "code": "F0425",
    "name": "閱讀電影文化 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "錢欽昭 (134***)",
    "classroom": "Q  203",
    "capacity": "50",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TFLXB.英文系（日）",
    "notes": "限大四生"
  },
  {
    "serial": "1138",
    "code": "F1235",
    "name": "口譯理論與實作菁英班 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳曼華 (154***)",
    "classroom": "O  303",
    "capacity": "30",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "2",
    "class_name": "P",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "限本系生"
  },
  {
    "serial": "1139",
    "code": "F1237",
    "name": "企業實習 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "蔡瑞敏 (132***)",
    "classroom": "T  604",
    "capacity": "",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "2",
    "class_name": "P",
    "group_type": "",
    "time_info": "一 / 1,2",
    "department": "TFLXB.英文系（日）",
    "notes": "本課程為英文系產學合作課程，選課請洽英文系辦。 ◇非全時全職校外實習課程"
  },
  {
    "serial": "1140",
    "code": "F1635",
    "name": "AI與筆譯實務 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳家倩 (158***)",
    "classroom": "E  509",
    "capacity": "90",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TFLXB.英文系（日）",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "1141",
    "code": "F1676",
    "name": "ＡＩ輔助口譯入門 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "張介英 (159***)",
    "classroom": "T  605",
    "capacity": "50",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TFLXB.英文系（日）",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "1332",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "邱紫穎 (075***)",
    "classroom": "B  501,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        5,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "QA",
    "time_info": "五 / 8,9 五 / 1",
    "department": "TGAEB.文學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1333",
    "code": "T0466",
    "name": "英文（一） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "范美惠 (049***)",
    "classroom": "B  502,T  211",
    "capacity": "72",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        2,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "QA",
    "time_info": "五 / 8,9 二 / 1",
    "department": "TGAEB.文學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1334",
    "code": "T0466",
    "name": "英文（一） (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡文慈 (164***)",
    "classroom": "B  507,V  201",
    "capacity": "76",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        5,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "QA",
    "time_info": "五 / 8,9 五 / 1",
    "department": "TGAEB.文學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1335",
    "code": "T0466",
    "name": "英文（一） (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "項人慧 (087***)",
    "classroom": "B  615,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        5,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "QA",
    "time_info": "五 / 8,9 五 / 1",
    "department": "TGAEB.文學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1336",
    "code": "T0466",
    "name": "英文（一） (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "王寶月 (126***)",
    "classroom": "B  608,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        2,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "E",
    "group_type": "QA",
    "time_info": "五 / 8,9 二 / 1",
    "department": "TGAEB.文學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1337",
    "code": "T0466",
    "name": "英文（一） (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "林敘如 (139***)",
    "classroom": "B  601,L  104",
    "capacity": "72",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        2,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "F",
    "group_type": "QA",
    "time_info": "五 / 8,9 二 / 1",
    "department": "TGAEB.文學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1338",
    "code": "T0466",
    "name": "英文（一） (G班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳韻如 (154***)",
    "classroom": "B  425,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        2,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "G",
    "group_type": "QA",
    "time_info": "五 / 8,9 二 / 1",
    "department": "TGAEB.文學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1339",
    "code": "T0466",
    "name": "英文（一） (H班)",
    "credits": 2,
    "category": "必",
    "teacher": "卓建宏 (120***)",
    "classroom": "B  701,L  310",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        5,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "H",
    "group_type": "QA",
    "time_info": "五 / 8,9 五 / 1",
    "department": "TGAEB.文學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1340",
    "code": "T0466",
    "name": "英文（一） (I班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳勁宏 (164***)",
    "classroom": "L  302,L  202",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        2,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "I",
    "group_type": "QA",
    "time_info": "五 / 8,9 二 / 1",
    "department": "TGAEB.文學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1341",
    "code": "T0466",
    "name": "英文（一） (J班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉育全 (165***)",
    "classroom": "B  602,L  310",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        2,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "J",
    "group_type": "QA",
    "time_info": "五 / 8,9 二 / 1",
    "department": "TGAEB.文學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1342",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "蘇琬婷 (139***)",
    "classroom": "B  613",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "QG",
    "time_info": "五 / 8,9",
    "department": "TGAEB.文學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1343",
    "code": "A0050",
    "name": "英文（二） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳秋月 (127***)",
    "classroom": "B  516",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "QG",
    "time_info": "五 / 8,9",
    "department": "TGAEB.文學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1344",
    "code": "A0050",
    "name": "英文（二） (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "高淑婷 (134***)",
    "classroom": "B  426",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "QG",
    "time_info": "五 / 8,9",
    "department": "TGAEB.文學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1345",
    "code": "A0050",
    "name": "英文（二） (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "許邏灣 (085***)",
    "classroom": "E  405",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "QG",
    "time_info": "五 / 8,9",
    "department": "TGAEB.文學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1346",
    "code": "A0050",
    "name": "英文（二） (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "倪志昇 (136***)",
    "classroom": "B  508",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "E",
    "group_type": "QG",
    "time_info": "五 / 8,9",
    "department": "TGAEB.文學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1347",
    "code": "A0050",
    "name": "英文（二） (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "林楸燕 (143***)",
    "classroom": "B  110",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "F",
    "group_type": "QG",
    "time_info": "五 / 8,9",
    "department": "TGAEB.文學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1348",
    "code": "A0050",
    "name": "英文（二） (G班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳儀芬 (165***)",
    "classroom": "L  306",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "G",
    "group_type": "QG",
    "time_info": "五 / 8,9",
    "department": "TGAEB.文學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1349",
    "code": "A0050",
    "name": "英文（二） (H班)",
    "credits": 2,
    "category": "必",
    "teacher": "林嘉鴻 (165***)",
    "classroom": "L  308",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "H",
    "group_type": "QG",
    "time_info": "五 / 8,9",
    "department": "TGAEB.文學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1350",
    "code": "A0050",
    "name": "英文（二） (I班)",
    "credits": 2,
    "category": "必",
    "teacher": "高興雲 (168***)",
    "classroom": "B  116",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "I",
    "group_type": "QG",
    "time_info": "五 / 8,9",
    "department": "TGAEB.文學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1351",
    "code": "A0050",
    "name": "英文（二） (J班)",
    "credits": 2,
    "category": "必",
    "teacher": "周佳欣 (162***)",
    "classroom": "L  413",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "J",
    "group_type": "Q",
    "time_info": "五 / 8,9",
    "department": "TGAEB.文學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1352",
    "code": "A2867",
    "name": "閱讀與寫作 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林偉淑 (140***)",
    "classroom": "L  304",
    "capacity": "",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "三 / 6,7",
    "department": "TGAHB.榮譽進階專業－文",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1353",
    "code": "A2927",
    "name": "新媒體洞察 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林俊賢 (153***)",
    "classroom": "L  416",
    "capacity": "",
    "time_data": [
      [
        1,
        2,
        3
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "一 / 2,3",
    "department": "TGAHB.榮譽進階專業－文",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1354",
    "code": "A2353",
    "name": "創意數位基因 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "林俊賢 (153***)",
    "classroom": "O  205",
    "capacity": "50",
    "time_data": [
      [
        1,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 5,6",
    "department": "TGAXB.文學院共同科－日",
    "notes": "淡江大學智慧人文實務創新學分學程"
  },
  {
    "serial": "1355",
    "code": "A2447",
    "name": "設計思考工具與方法 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "林俊賢 (153***)",
    "classroom": "T  307",
    "capacity": "36",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGAXB.文學院共同科－日",
    "notes": "智慧創新關鍵人才躍升計畫微學程"
  },
  {
    "serial": "1356",
    "code": "A3201",
    "name": "社會影響力與價值溝通 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "楊淑芬 (130***)",
    "classroom": "O  306",
    "capacity": "150",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGAXB.文學院共同科－日",
    "notes": "淡江大學智慧人文實務創新學分學程;本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "1357",
    "code": "A3202",
    "name": "行動媒體影像創作 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "文楷誠 (166***)",
    "classroom": "L  301",
    "capacity": "150",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGAXB.文學院共同科－日",
    "notes": "淡江大學智慧人文實務創新學分學程"
  },
  {
    "serial": "1358",
    "code": "A3212",
    "name": "文資創生與數位策展 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳琮淵 (155***)",
    "classroom": "O  306",
    "capacity": "150",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 6,7",
    "department": "TGAXB.文學院共同科－日",
    "notes": "淡江大學智慧人文實務創新學分學程;本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "1359",
    "code": "A3246",
    "name": "ＡＩ輔助多媒體製作與應用 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "張玄菩 (126***)",
    "classroom": "L  507",
    "capacity": "50",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGAXB.文學院共同科－日",
    "notes": "智慧人文實務創新學分學程"
  },
  {
    "serial": "1360",
    "code": "A3252",
    "name": "智慧人文講堂 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳姞淨 (165***)",
    "classroom": "L  401",
    "capacity": "120",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 6,7",
    "department": "TGAXB.文學院共同科－日",
    "notes": "淡江大學智慧人文實務創新學分學程 ◇講座課程"
  },
  {
    "serial": "1361",
    "code": "A3271",
    "name": "職場敘事新智能 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "李建興 (162***)",
    "classroom": "B  309",
    "capacity": "60",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TGAXB.文學院共同科－日",
    "notes": "淡江大學智慧人文實務創新學分學程"
  },
  {
    "serial": "1362",
    "code": "A3272",
    "name": "ＡＩ與博物館應用 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "高上雯 (114***)",
    "classroom": "L  401",
    "capacity": "60",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGAXB.文學院共同科－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "1363",
    "code": "A3522",
    "name": "Unity遊戲程式設計 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "施建州, 詹鎮邦(093***,167***)",
    "classroom": "O  205",
    "capacity": "60",
    "time_data": [
      [
        4,
        7,
        8
      ],
      [
        4,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 7,8 四 / 9",
    "department": "TGAXB.文學院共同科－日",
    "notes": "智慧創新關鍵人才躍升計畫微學程"
  },
  {
    "serial": "1364",
    "code": "M2397",
    "name": "Python程式設計與應用 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "游國忠, 陳啓禎(133***,165***)",
    "classroom": "O  205",
    "capacity": "60",
    "time_data": [
      [
        2,
        2,
        3
      ],
      [
        2,
        4,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 2,3 二 / 4",
    "department": "TGAXB.文學院共同科－日",
    "notes": "智慧創新關鍵人才躍升計畫微學程"
  },
  {
    "serial": "1365",
    "code": "T2632",
    "name": "團隊領導與服務 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "武士戎 (119***)",
    "classroom": "B  116",
    "capacity": "",
    "time_data": [
      [
        1,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "C",
    "time_info": "一 / 8,9",
    "department": "TGCHB.榮譽學程",
    "notes": "榮譽學程「課外活動課程」,限符合資格學生修習,隔週上課(3/2開始) ◇講座課程"
  },
  {
    "serial": "1366",
    "code": "T2632",
    "name": "團隊領導與服務 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "武士戎 (119***)",
    "classroom": "B  425",
    "capacity": "",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "C",
    "time_info": "四 / 8,9",
    "department": "TGCHB.榮譽學程",
    "notes": "榮譽學程「課外活動課程」,限符合資格學生修習,隔週上課(3/5開始) ◇講座課程"
  },
  {
    "serial": "1367",
    "code": "T2633",
    "name": "改變世界的大事 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "張福昌 (128***)",
    "classroom": "T  506",
    "capacity": "30",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "BT",
    "time_info": "五 / 7,8",
    "department": "TGCHB.榮譽學程",
    "notes": "榮譽學程「通識教育課程」,限符合資格學生修習"
  },
  {
    "serial": "1368",
    "code": "T2635",
    "name": "臺灣近現代史專題 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳琮淵 (155***)",
    "classroom": "L  303",
    "capacity": "30",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "BP",
    "time_info": "三 / 8,9",
    "department": "TGCHB.榮譽學程",
    "notes": "榮譽學程「通識教育課程」,限符合資格學生修習"
  },
  {
    "serial": "1369",
    "code": "T2755",
    "name": "史觀科技 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "姚忠達 (110***)",
    "classroom": "T  501",
    "capacity": "30",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "BZ",
    "time_info": "五 / 3,4",
    "department": "TGCHB.榮譽學程",
    "notes": "榮譽學程「通識教育課程」,限符合資格學生修習 ◇全英語授課"
  },
  {
    "serial": "1370",
    "code": "T2758",
    "name": "社會變遷與社會正義 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林楚淇 (132***)",
    "classroom": "B  511",
    "capacity": "30",
    "time_data": [
      [
        5,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "BW",
    "time_info": "五 / 9,10",
    "department": "TGCHB.榮譽學程",
    "notes": "榮譽學程「通識教育課程」,限符合資格學生修習"
  },
  {
    "serial": "1371",
    "code": "T2881",
    "name": "思考訓練與溝通藝術 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "葉斯偉 (150***)",
    "classroom": "L  417",
    "capacity": "30",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "B",
    "time_info": "二 / 6,7",
    "department": "TGCHB.榮譽學程",
    "notes": "榮譽學程「通識教育課程」,限符合資格學生修習 ◇全英語授課"
  },
  {
    "serial": "1372",
    "code": "T2902",
    "name": "資訊科技發展趨勢與影響 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳建彰 (138***)",
    "classroom": "T  604",
    "capacity": "30",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "BO",
    "time_info": "四 / 3,4",
    "department": "TGCHB.榮譽學程",
    "notes": "榮譽學程「通識教育課程」,限符合資格學生修習"
  },
  {
    "serial": "1373",
    "code": "T3148",
    "name": "社團領導才能 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "朱　留 (128***)",
    "classroom": "E  302",
    "capacity": "",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "C",
    "time_info": "四 / 3,4",
    "department": "TGCHB.榮譽學程",
    "notes": "榮譽學程「課外活動課程」,限符合資格學生修習 ◇全英語授課"
  },
  {
    "serial": "1374",
    "code": "D0864",
    "name": "ＸＲ創客科技在生活上的應用 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林逸農 (149***)",
    "classroom": "L  203",
    "capacity": "",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "三 / 3,4",
    "department": "TGDHB.榮譽進階專業－教",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1375",
    "code": "D0865",
    "name": "跨領域人本機器學習 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳思思 (157***)",
    "classroom": "ED 501",
    "capacity": "",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "二 / 3,4",
    "department": "TGDHB.榮譽進階專業－教",
    "notes": "榮譽學程進階專業課程，限符合資格者修習 ◇全英語授課"
  },
  {
    "serial": "1376",
    "code": "E3683",
    "name": "創意思解 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "廖慶榮 (998***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "/",
    "department": "TGDLM.遠距教學課程－日",
    "notes": "遠距收播中原大學課程，教學計畫表請至遠距中心網頁查詢 ◇遠距收播外校課程"
  },
  {
    "serial": "1377",
    "code": "T2895",
    "name": "愛情關係管理 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "曾陽晴 (998***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "/",
    "department": "TGDLM.遠距教學課程－日",
    "notes": "遠距收播中原大學課程，教學計畫表請至遠距中心網頁查詢 ◇遠距收播外校課程"
  },
  {
    "serial": "1378",
    "code": "T3107",
    "name": "飲食與生醫保健 (A班)",
    "credits": 1,
    "category": "選",
    "teacher": "蘇正元 (998***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "/",
    "department": "TGDLM.遠距教學課程－日",
    "notes": "遠距收播中原大學課程，教學計畫表請至遠距中心網頁查詢 ◇遠距收播外校課程"
  },
  {
    "serial": "1382",
    "code": "T0466",
    "name": "英文（一） (AA班)",
    "credits": 2,
    "category": "必",
    "teacher": "温志樺 (151***)",
    "classroom": "E  304,T  211",
    "capacity": "72",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        4,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AA",
    "group_type": "QA",
    "time_info": "五 / 3,4 四 / 1",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1383",
    "code": "T0466",
    "name": "英文（一） (AB班)",
    "credits": 2,
    "category": "必",
    "teacher": "范美惠 (049***)",
    "classroom": "L  302,V  102",
    "capacity": "64",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        2,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AB",
    "group_type": "QA",
    "time_info": "五 / 3,4 二 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1384",
    "code": "T0466",
    "name": "英文（一） (AC班)",
    "credits": 2,
    "category": "必",
    "teacher": "羅得彰 (154***)",
    "classroom": "B  116,T  211",
    "capacity": "72",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        1,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AC",
    "group_type": "QA",
    "time_info": "五 / 3,4 一 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1385",
    "code": "T0466",
    "name": "英文（一） (AD班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃志永 (124***)",
    "classroom": "E  508,V  201",
    "capacity": "76",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        4,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AD",
    "group_type": "QA",
    "time_info": "五 / 3,4 四 / 1",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1386",
    "code": "T0466",
    "name": "英文（一） (AE班)",
    "credits": 2,
    "category": "必",
    "teacher": "高于晴 (166***)",
    "classroom": "B  429,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        4,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AE",
    "group_type": "QA",
    "time_info": "五 / 3,4 四 / 1",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1387",
    "code": "T0466",
    "name": "英文（一） (AF班)",
    "credits": 2,
    "category": "必",
    "teacher": "王寶月 (126***)",
    "classroom": "B  501,L  104",
    "capacity": "72",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        4,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AF",
    "group_type": "QA",
    "time_info": "五 / 3,4 四 / 1",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1388",
    "code": "T0466",
    "name": "英文（一） (AG班)",
    "credits": 2,
    "category": "必",
    "teacher": "卓建宏 (120***)",
    "classroom": "E  405,V  201",
    "capacity": "76",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        2,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AG",
    "group_type": "QA",
    "time_info": "五 / 3,4 二 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1389",
    "code": "T0466",
    "name": "英文（一） (AH班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃郁傑 (152***)",
    "classroom": "B  702,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        2,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AH",
    "group_type": "QA",
    "time_info": "五 / 3,4 二 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1390",
    "code": "T0466",
    "name": "英文（一） (AI班)",
    "credits": 2,
    "category": "必",
    "teacher": "高淑婷 (134***)",
    "classroom": "E  512,L  104",
    "capacity": "72",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        2,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AI",
    "group_type": "QA",
    "time_info": "五 / 3,4 二 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1391",
    "code": "T0466",
    "name": "英文（一） (AJ班)",
    "credits": 2,
    "category": "必",
    "teacher": "葉威廷 (161***)",
    "classroom": "E  509,V  102",
    "capacity": "64",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        1,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AJ",
    "group_type": "QA",
    "time_info": "五 / 3,4 一 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1392",
    "code": "T0466",
    "name": "英文（一） (AK班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳家倩 (158***)",
    "classroom": "E  830,V  201",
    "capacity": "76",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        1,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AK",
    "group_type": "QA",
    "time_info": "五 / 3,4 一 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1393",
    "code": "T0466",
    "name": "英文（一） (AL班)",
    "credits": 2,
    "category": "必",
    "teacher": "周佳欣 (162***)",
    "classroom": "E  412,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        1,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AL",
    "group_type": "QA",
    "time_info": "五 / 3,4 一 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1394",
    "code": "T0466",
    "name": "英文（一） (AM班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳律明 (154***)",
    "classroom": "E  416,L  104",
    "capacity": "72",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        1,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AM",
    "group_type": "QA",
    "time_info": "五 / 3,4 一 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1395",
    "code": "T0466",
    "name": "英文（一） (AN班)",
    "credits": 2,
    "category": "必",
    "teacher": "張淑貞 (153***)",
    "classroom": "E  413,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        4,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AN",
    "group_type": "QA",
    "time_info": "五 / 3,4 四 / 1",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1396",
    "code": "T0466",
    "name": "英文（一） (AO班)",
    "credits": 2,
    "category": "必",
    "teacher": "戴淳文 (156***)",
    "classroom": "B  608,L  310",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        4,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AO",
    "group_type": "QA",
    "time_info": "五 / 3,4 四 / 1",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1397",
    "code": "T0466",
    "name": "英文（一） (AP班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳璽光 (154***)",
    "classroom": "E  310,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        2,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AP",
    "group_type": "QA",
    "time_info": "五 / 3,4 二 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1398",
    "code": "T0466",
    "name": "英文（一） (AQ班)",
    "credits": 2,
    "category": "必",
    "teacher": "邱春煌 (161***)",
    "classroom": "B  507,L  202",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        2,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AQ",
    "group_type": "QA",
    "time_info": "五 / 3,4 二 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1399",
    "code": "T0466",
    "name": "英文（一） (AR班)",
    "credits": 2,
    "category": "必",
    "teacher": "簡伊佐 (153***)",
    "classroom": "B  602,L  310",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        2,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AR",
    "group_type": "QA",
    "time_info": "五 / 3,4 二 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1400",
    "code": "T0466",
    "name": "英文（一） (AS班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄭秀彬 (164***)",
    "classroom": "E  409,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        1,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AS",
    "group_type": "QA",
    "time_info": "五 / 3,4 一 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1401",
    "code": "T0466",
    "name": "英文（一） (AT班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳彥凱 (160***)",
    "classroom": "B  607,L  202",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        1,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AT",
    "group_type": "QA",
    "time_info": "五 / 3,4 一 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1402",
    "code": "T0466",
    "name": "英文（一） (AU班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉育全 (165***)",
    "classroom": "E  415,L  310",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ],
      [
        1,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AU",
    "group_type": "QA",
    "time_info": "五 / 3,4 一 / 9",
    "department": "TGEEB.工學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1403",
    "code": "A0050",
    "name": "英文（二） (AA班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳瑜雲 (078***)",
    "classroom": "T  701",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AA",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1404",
    "code": "A0050",
    "name": "英文（二） (AB班)",
    "credits": 2,
    "category": "必",
    "teacher": "李金安 (134***)",
    "classroom": "Q  409",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AB",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1405",
    "code": "A0050",
    "name": "英文（二） (AC班)",
    "credits": 2,
    "category": "必",
    "teacher": "薛玉政 (134***)",
    "classroom": "E  415",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AC",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。 ◇全英語授課"
  },
  {
    "serial": "1406",
    "code": "A0050",
    "name": "英文（二） (AD班)",
    "credits": 2,
    "category": "必",
    "teacher": "蘇琬婷 (139***)",
    "classroom": "B  613",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AD",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1407",
    "code": "A0050",
    "name": "英文（二） (AE班)",
    "credits": 2,
    "category": "必",
    "teacher": "高淑婷 (134***)",
    "classroom": "B  426",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AE",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1408",
    "code": "A0050",
    "name": "英文（二） (AF班)",
    "credits": 2,
    "category": "必",
    "teacher": "許邏灣 (085***)",
    "classroom": "E  405",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AF",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1409",
    "code": "A0050",
    "name": "英文（二） (AG班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳韻如 (154***)",
    "classroom": "B  425",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AG",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1410",
    "code": "A0050",
    "name": "英文（二） (AH班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳秋月 (127***)",
    "classroom": "B  516",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AH",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1411",
    "code": "A0050",
    "name": "英文（二） (AI班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃翊之 (161***)",
    "classroom": "B  429",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AI",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。 ◇全英語授課"
  },
  {
    "serial": "1412",
    "code": "A0050",
    "name": "英文（二） (AJ班)",
    "credits": 2,
    "category": "必",
    "teacher": "倪志昇 (136***)",
    "classroom": "B  508",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AJ",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1413",
    "code": "A0050",
    "name": "英文（二） (AK班)",
    "credits": 2,
    "category": "必",
    "teacher": "林楸燕 (143***)",
    "classroom": "B  110",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AK",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1414",
    "code": "A0050",
    "name": "英文（二） (AL班)",
    "credits": 2,
    "category": "必",
    "teacher": "湯雅蘭 (141***)",
    "classroom": "E  830",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AL",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1415",
    "code": "A0050",
    "name": "英文（二） (AM班)",
    "credits": 2,
    "category": "必",
    "teacher": "邱春煌 (161***)",
    "classroom": "B  701",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AM",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1416",
    "code": "A0050",
    "name": "英文（二） (AN班)",
    "credits": 2,
    "category": "必",
    "teacher": "余佳紋 (134***)",
    "classroom": "E  509",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AN",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1417",
    "code": "A0050",
    "name": "英文（二） (AO班)",
    "credits": 2,
    "category": "必",
    "teacher": "周佳欣 (162***)",
    "classroom": "L  413",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AO",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1418",
    "code": "A0050",
    "name": "英文（二） (AP班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃志永 (124***)",
    "classroom": "E  508",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AP",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1419",
    "code": "A0050",
    "name": "英文（二） (AQ班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳潔晞 (159***)",
    "classroom": "E  416",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AQ",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1420",
    "code": "A0050",
    "name": "英文（二） (AR班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳璽光 (154***)",
    "classroom": "E  310",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AR",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1421",
    "code": "A0050",
    "name": "英文（二） (AS班)",
    "credits": 2,
    "category": "必",
    "teacher": "高興雲 (168***)",
    "classroom": "B  116",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AS",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1422",
    "code": "A0050",
    "name": "英文（二） (AT班)",
    "credits": 2,
    "category": "必",
    "teacher": "林怡嘉 (169***)",
    "classroom": "E  412",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AT",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1423",
    "code": "A0050",
    "name": "英文（二） (AU班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉育全 (165***)",
    "classroom": "B  602",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AU",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TGEEB.工學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1424",
    "code": "E3416",
    "name": "綠能科技新知 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "許世杰 (137***)",
    "classroom": "E  829",
    "capacity": "",
    "time_data": [
      [
        1,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "一 / 8,9",
    "department": "TGEHB.榮譽進階專業－工",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1425",
    "code": "E3688",
    "name": "數據科學與應用 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "嚴建和 (167***)",
    "classroom": "E  101a",
    "capacity": "",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "二 / 3,4",
    "department": "TGEHB.榮譽進階專業－工",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1426",
    "code": "E1679",
    "name": "類神經網路概論 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "李世安 (126***)",
    "classroom": "E  787",
    "capacity": "140",
    "time_data": [
      [
        2,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 8,9",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1427",
    "code": "E2267",
    "name": "可靠度與風險分析 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "黃富國 (112***)",
    "classroom": "E  214",
    "capacity": "70",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1428",
    "code": "E3274",
    "name": "綠色化學 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "彭晴玉 (148***)",
    "classroom": "E  787",
    "capacity": "140",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGEXB.工學院共同科－日",
    "notes": "◇以實整虛課程"
  },
  {
    "serial": "1429",
    "code": "E3580",
    "name": "創新與創業 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "江正雄 (090***)",
    "classroom": "E  787",
    "capacity": "140",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 6,7",
    "department": "TGEXB.工學院共同科－日",
    "notes": "◇講座課程"
  },
  {
    "serial": "1430",
    "code": "E3700",
    "name": "物聯網安全 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "楊博宏 (168***)",
    "classroom": "E  787",
    "capacity": "140",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1431",
    "code": "E3901",
    "name": "工程與生命的對話 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "蔡明修 (132***)",
    "classroom": "E  787",
    "capacity": "140",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 8,9",
    "department": "TGEXB.工學院共同科－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "1432",
    "code": "E3903",
    "name": "風水科學 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "黃大肯 (160***)",
    "classroom": "E  787",
    "capacity": "140",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 8,9",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1433",
    "code": "E3904",
    "name": "化工技術與材料市場分析 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "何啟東 (067***)",
    "classroom": "E  312",
    "capacity": "80",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1434",
    "code": "E3906",
    "name": "物聯網概論與應用 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳映濃 (168***)",
    "classroom": "E  231",
    "capacity": "72",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1435",
    "code": "E4012",
    "name": "資機電產業趨勢 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "王鈺詞 (157***)",
    "classroom": "E  787",
    "capacity": "140",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TGEXB.工學院共同科－日",
    "notes": "◇講座課程"
  },
  {
    "serial": "1436",
    "code": "E4136",
    "name": "人工智慧產業趨勢 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "葛孟堯 (157***)",
    "classroom": "E  787",
    "capacity": "140",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 6,7",
    "department": "TGEXB.工學院共同科－日",
    "notes": "◇講座課程"
  },
  {
    "serial": "1437",
    "code": "E4244",
    "name": "智慧製造系統與智慧工廠 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳昱均 (160***)",
    "classroom": "E  787",
    "capacity": "140",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1438",
    "code": "E4298",
    "name": "生物奈米科技 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "廖淑娟 (166***)",
    "classroom": "E  414",
    "capacity": "60",
    "time_data": [
      [
        1,
        5,
        5
      ],
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 5 二 / 3,4",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1439",
    "code": "E4323",
    "name": "ＡＩ產業應用 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "張大明 (167***)",
    "classroom": "E  314",
    "capacity": "63",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 6,7",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1440",
    "code": "E4328",
    "name": "生成式ＡＩ (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "邱普運 (169***)",
    "classroom": "E  314",
    "capacity": "63",
    "time_data": [
      [
        1,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 8,9",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1441",
    "code": "E4337",
    "name": "數位製造技術 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "李彥霆 (167***)",
    "classroom": "E  101a",
    "capacity": "35",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1442",
    "code": "M0286",
    "name": "專案管理 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "許長煒 (158***)",
    "classroom": "E  201",
    "capacity": "66",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 6,7",
    "department": "TGEXB.工學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1443",
    "code": "M0475",
    "name": "機率與統計 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "葉丙成 (996***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        7,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 7,8,9",
    "department": "TGEXB.工學院共同科－日",
    "notes": "遠距收播【TAICA課程】，請至https://taicatw.net/spring-114/網頁查詢上課方式。週四晚另安排7次講題。 ◇遠距收播外校課程"
  },
  {
    "serial": "1444",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "喬　治 (159***)",
    "classroom": "E  404,T  211",
    "capacity": "72",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        3,
        10,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "QA",
    "time_info": "五 / 8,9 三 / 10",
    "department": "TGFEB.外語學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。 ◇全英語授課"
  },
  {
    "serial": "1445",
    "code": "T0466",
    "name": "英文（一） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄧秋蓉 (138***)",
    "classroom": "T  110,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        5,
        7,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "QA",
    "time_info": "五 / 8,9 五 / 7",
    "department": "TGFEB.外語學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1446",
    "code": "T0466",
    "name": "英文（一） (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉俊興 (154***)",
    "classroom": "E  509,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        3,
        10,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "QA",
    "time_info": "五 / 8,9 三 / 10",
    "department": "TGFEB.外語學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1447",
    "code": "T0466",
    "name": "英文（一） (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡郁瑄 (134***)",
    "classroom": "B  513,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        5,
        7,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "QA",
    "time_info": "五 / 8,9 五 / 7",
    "department": "TGFEB.外語學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1448",
    "code": "T0466",
    "name": "英文（一） (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "喻沐英 (159***)",
    "classroom": "E  410,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        3,
        10,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "E",
    "group_type": "QA",
    "time_info": "五 / 8,9 三 / 10",
    "department": "TGFEB.外語學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1449",
    "code": "T0466",
    "name": "英文（一） (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "張淑貞 (153***)",
    "classroom": "B  606,L  202",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ],
      [
        5,
        7,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "F",
    "group_type": "QA",
    "time_info": "五 / 8,9 五 / 7",
    "department": "TGFEB.外語學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1450",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "薛玉政 (134***)",
    "classroom": "E  414",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGFEB.外語學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。 ◇全英語授課"
  },
  {
    "serial": "1451",
    "code": "A0050",
    "name": "英文（二） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "蘇琬婷 (139***)",
    "classroom": "E  512",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGFEB.外語學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1452",
    "code": "A0050",
    "name": "英文（二） (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃翊之 (161***)",
    "classroom": "B  709",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGFEB.外語學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。 ◇全英語授課"
  },
  {
    "serial": "1453",
    "code": "A0050",
    "name": "英文（二） (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "熊婷惠 (154***)",
    "classroom": "T  605",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGFEB.外語學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1454",
    "code": "A0050",
    "name": "英文（二） (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳勁宏 (164***)",
    "classroom": "T  704",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "E",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGFEB.外語學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1455",
    "code": "A0050",
    "name": "英文（二） (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "湯雅蘭 (141***)",
    "classroom": "T  401",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "F",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGFEB.外語學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1456",
    "code": "A0050",
    "name": "英文（二） (G班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃志永 (124***)",
    "classroom": "E  508",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "G",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGFEB.外語學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1457",
    "code": "F1755",
    "name": "當代東亞文學短篇小說選讀 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "小澤自然 (143***)",
    "classroom": "T  308",
    "capacity": "",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "二 / 9,10",
    "department": "TGFHB.榮譽進階專業－外",
    "notes": "榮譽學程進階專業課程，限符合資格者修習 ◇全英語授課"
  },
  {
    "serial": "1458",
    "code": "F1756",
    "name": "從文明與自然的角度探究日本文學與動畫 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林寄雯 (096***)",
    "classroom": "T  607",
    "capacity": "",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "二 / 6,7",
    "department": "TGFHB.榮譽進階專業－外",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1459",
    "code": "A0751",
    "name": "漢語語言學 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "楊素梅 (161***)",
    "classroom": "B  119",
    "capacity": "160",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 6,7",
    "department": "TGFXB.外語學院共同科日",
    "notes": ""
  },
  {
    "serial": "1460",
    "code": "F0781",
    "name": "口譯入門 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "王　潔 (145***)",
    "classroom": "B  116",
    "capacity": "160",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGFXB.外語學院共同科日",
    "notes": "外語學院及外語翻譯學程學生優先選課，須額外繳語言實習費"
  },
  {
    "serial": "1461",
    "code": "F0784",
    "name": "實務翻譯概論 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "黃永裕 (035***)",
    "classroom": "T  401",
    "capacity": "50",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TGFXB.外語學院共同科日",
    "notes": "外語學院及外語翻譯學程學生優先選課"
  },
  {
    "serial": "1462",
    "code": "F0866",
    "name": "翻譯理論導論 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳佩筠 (130***)",
    "classroom": "T  501",
    "capacity": "50",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TGFXB.外語學院共同科日",
    "notes": ""
  },
  {
    "serial": "1463",
    "code": "F1104",
    "name": "韓文（二） (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "李相美 (139***)",
    "classroom": "B  615",
    "capacity": "90",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 1,2",
    "department": "TGFXB.外語學院共同科日",
    "notes": ""
  },
  {
    "serial": "1464",
    "code": "F1435",
    "name": "華語口語與表達 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "袁寧均 (148***)",
    "classroom": "Q  409",
    "capacity": "160",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TGFXB.外語學院共同科日",
    "notes": ""
  },
  {
    "serial": "1465",
    "code": "F1533",
    "name": "印尼文與文化（二） (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "何景榮 (157***)",
    "classroom": "L  412",
    "capacity": "160",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TGFXB.外語學院共同科日",
    "notes": ""
  },
  {
    "serial": "1466",
    "code": "F1537",
    "name": "越南文與文化（二） (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "何金蘭 (029***)",
    "classroom": "L  412",
    "capacity": "160",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TGFXB.外語學院共同科日",
    "notes": ""
  },
  {
    "serial": "1467",
    "code": "F1557",
    "name": "烏克蘭文與文化 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "裴方嵐 (161***)",
    "classroom": "T  311",
    "capacity": "160",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGFXB.外語學院共同科日",
    "notes": ""
  },
  {
    "serial": "1468",
    "code": "X0002",
    "name": "進修英文 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "曾郁景 (134***)",
    "classroom": "未定",
    "capacity": "175",
    "time_data": [
      [
        1,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 11,12",
    "department": "TGFXB.外語學院共同科日",
    "notes": "不列入畢業學分數及當學期成績總修學分與平均計算。 ◇遠距非同步課程"
  },
  {
    "serial": "1469",
    "code": "X0002",
    "name": "進修英文 (B班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳佩筠 (130***)",
    "classroom": "未定",
    "capacity": "175",
    "time_data": [
      [
        1,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 11,12",
    "department": "TGFXB.外語學院共同科日",
    "notes": "不列入畢業學分數及當學期成績總修學分與平均計算。 ◇遠距非同步課程"
  },
  {
    "serial": "1470",
    "code": "X0002",
    "name": "進修英文 (C班)",
    "credits": 2,
    "category": "選",
    "teacher": "王慧娟 (119***)",
    "classroom": "未定",
    "capacity": "175",
    "time_data": [
      [
        3,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 11,12",
    "department": "TGFXB.外語學院共同科日",
    "notes": "不列入畢業學分數及當學期成績總修學分與平均計算。 ◇遠距非同步課程"
  },
  {
    "serial": "1471",
    "code": "X0002",
    "name": "進修英文 (D班)",
    "credits": 2,
    "category": "選",
    "teacher": "王慧娟 (119***)",
    "classroom": "未定",
    "capacity": "175",
    "time_data": [
      [
        2,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "",
    "time_info": "二 / 11,12",
    "department": "TGFXB.外語學院共同科日",
    "notes": "不列入畢業學分數及當學期成績總修學分與平均計算。 ◇遠距非同步課程"
  },
  {
    "serial": "1472",
    "code": "X0002",
    "name": "進修英文 (E班)",
    "credits": 2,
    "category": "選",
    "teacher": "郭家珍 (141***)",
    "classroom": "未定",
    "capacity": "175",
    "time_data": [
      [
        2,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "",
    "time_info": "二 / 11,12",
    "department": "TGFXB.外語學院共同科日",
    "notes": "不列入畢業學分數及當學期成績總修學分與平均計算。 ◇遠距非同步課程"
  },
  {
    "serial": "1474",
    "code": "T0466",
    "name": "英文（一） (AA班)",
    "credits": 2,
    "category": "必",
    "teacher": "涂銘宏 (124***)",
    "classroom": "B  309,L  101",
    "capacity": "64",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        5,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AA",
    "group_type": "QA",
    "time_info": "五 / 6,7 五 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1475",
    "code": "T0466",
    "name": "英文（一） (AB班)",
    "credits": 2,
    "category": "必",
    "teacher": "温志樺 (151***)",
    "classroom": "E  813,T  211",
    "capacity": "72",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        2,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AB",
    "group_type": "QA",
    "time_info": "五 / 6,7 二 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1476",
    "code": "T0466",
    "name": "英文（一） (AC班)",
    "credits": 2,
    "category": "必",
    "teacher": "張秋鶯 (164***)",
    "classroom": "B  111,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        5,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AC",
    "group_type": "QA",
    "time_info": "五 / 6,7 五 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1477",
    "code": "T0466",
    "name": "英文（一） (AD班)",
    "credits": 2,
    "category": "必",
    "teacher": "項人慧 (087***)",
    "classroom": "B  615,L  104",
    "capacity": "72",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        5,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AD",
    "group_type": "QA",
    "time_info": "五 / 6,7 五 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1478",
    "code": "T0466",
    "name": "英文（一） (AE班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡郁瑄 (134***)",
    "classroom": "B  513,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        2,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AE",
    "group_type": "QA",
    "time_info": "五 / 6,7 二 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1479",
    "code": "T0466",
    "name": "英文（一） (AF班)",
    "credits": 2,
    "category": "必",
    "teacher": "林敘如 (139***)",
    "classroom": "B  601,L  104",
    "capacity": "72",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        2,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AF",
    "group_type": "QA",
    "time_info": "五 / 6,7 二 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1480",
    "code": "T0466",
    "name": "英文（一） (AG班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡文慈 (164***)",
    "classroom": "B  507,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        2,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AG",
    "group_type": "QA",
    "time_info": "五 / 6,7 二 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1481",
    "code": "T0466",
    "name": "英文（一） (AH班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳勁宏 (164***)",
    "classroom": "L  302,V  201",
    "capacity": "76",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        5,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AH",
    "group_type": "QA",
    "time_info": "五 / 6,7 五 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1482",
    "code": "T0466",
    "name": "英文（一） (AI班)",
    "credits": 2,
    "category": "必",
    "teacher": "簡伊佐 (153***)",
    "classroom": "B  120,L  310",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        5,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AI",
    "group_type": "QA",
    "time_info": "五 / 6,7 五 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1483",
    "code": "T0466",
    "name": "英文（一） (AJ班)",
    "credits": 2,
    "category": "必",
    "teacher": "戴淳文 (156***)",
    "classroom": "B  608,L  202",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        2,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AJ",
    "group_type": "QA",
    "time_info": "五 / 6,7 二 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費"
  },
  {
    "serial": "1484",
    "code": "T0466",
    "name": "英文（一） (BA班)",
    "credits": 2,
    "category": "必",
    "teacher": "范美惠 (049***)",
    "classroom": "L  302,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "BA",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1485",
    "code": "T0466",
    "name": "英文（一） (BB班)",
    "credits": 2,
    "category": "必",
    "teacher": "葉威廷 (161***)",
    "classroom": "E  509,L  202",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "BB",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1486",
    "code": "T0466",
    "name": "英文（一） (BC班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳律明 (154***)",
    "classroom": "E  416,T  211",
    "capacity": "72",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        1,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "BC",
    "group_type": "QA",
    "time_info": "五 / 1,2 一 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1487",
    "code": "T0466",
    "name": "英文（一） (BD班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳曼華 (154***)",
    "classroom": "E  515,L  202",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "BD",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1488",
    "code": "T0466",
    "name": "英文（一） (BE班)",
    "credits": 2,
    "category": "必",
    "teacher": "王寶月 (126***)",
    "classroom": "B  501,L  310",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "BE",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1489",
    "code": "T0466",
    "name": "英文（一） (BF班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡郁瑄 (134***)",
    "classroom": "B  513,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "BF",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1490",
    "code": "T0466",
    "name": "英文（一） (BG班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃郁傑 (152***)",
    "classroom": "B  702,L  310",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "BG",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1491",
    "code": "T0466",
    "name": "英文（一） (BH班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳韻如 (154***)",
    "classroom": "B  617,T  211",
    "capacity": "72",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "BH",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1492",
    "code": "T0466",
    "name": "英文（一） (BI班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳家倩 (158***)",
    "classroom": "E  830,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "BI",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1493",
    "code": "T0466",
    "name": "英文（一） (BJ班)",
    "credits": 2,
    "category": "必",
    "teacher": "高于晴 (166***)",
    "classroom": "B  429,V  102",
    "capacity": "64",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        1,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "BJ",
    "group_type": "QA",
    "time_info": "五 / 1,2 一 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1494",
    "code": "T0466",
    "name": "英文（一） (BK班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳彥凱 (160***)",
    "classroom": "B  607,V  201",
    "capacity": "76",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        1,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "BK",
    "group_type": "QA",
    "time_info": "五 / 1,2 一 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1495",
    "code": "T0466",
    "name": "英文（一） (BL班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄭秀彬 (164***)",
    "classroom": "E  409,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        1,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "BL",
    "group_type": "QA",
    "time_info": "五 / 1,2 一 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1496",
    "code": "T0466",
    "name": "英文（一） (BM班)",
    "credits": 2,
    "category": "必",
    "teacher": "邱春煌 (161***)",
    "classroom": "B  507,V  201",
    "capacity": "76",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "BM",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1497",
    "code": "T0466",
    "name": "英文（一） (BN班)",
    "credits": 2,
    "category": "必",
    "teacher": "戴淳文 (156***)",
    "classroom": "B  608,T  211",
    "capacity": "72",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "BN",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 2",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1498",
    "code": "T0466",
    "name": "英文（一） (BO班)",
    "credits": 2,
    "category": "必",
    "teacher": "卓建宏 (120***)",
    "classroom": "E  405,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        3,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "BO",
    "group_type": "QA",
    "time_info": "五 / 1,2 三 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1499",
    "code": "T0466",
    "name": "英文（一） (BP班)",
    "credits": 2,
    "category": "必",
    "teacher": "簡伊佐 (153***)",
    "classroom": "B  602,L  104",
    "capacity": "72",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        1,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "BP",
    "group_type": "QA",
    "time_info": "五 / 1,2 一 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1500",
    "code": "T0466",
    "name": "英文（一） (BQ班)",
    "credits": 2,
    "category": "必",
    "teacher": "蕭貴徽 (165***)",
    "classroom": "B  110,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        1,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "BQ",
    "group_type": "QA",
    "time_info": "五 / 1,2 一 / 1",
    "department": "TGLEB.商管學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1501",
    "code": "A0050",
    "name": "英文（二） (AA班)",
    "credits": 2,
    "category": "必",
    "teacher": "李金安 (134***)",
    "classroom": "Q  409",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AA",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1502",
    "code": "A0050",
    "name": "英文（二） (AB班)",
    "credits": 2,
    "category": "必",
    "teacher": "邱智銘 (125***)",
    "classroom": "L  306",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AB",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1503",
    "code": "A0050",
    "name": "英文（二） (AC班)",
    "credits": 2,
    "category": "必",
    "teacher": "邱紫穎 (075***)",
    "classroom": "L  412",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AC",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1504",
    "code": "A0050",
    "name": "英文（二） (AD班)",
    "credits": 2,
    "category": "必",
    "teacher": "李碧玉 (168***)",
    "classroom": "B  110",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AD",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1505",
    "code": "A0050",
    "name": "英文（二） (AE班)",
    "credits": 2,
    "category": "必",
    "teacher": "張秋鶯 (164***)",
    "classroom": "B  111",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AE",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1506",
    "code": "A0050",
    "name": "英文（二） (AF班)",
    "credits": 2,
    "category": "必",
    "teacher": "簡珮玲 (136***)",
    "classroom": "T  109",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AF",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1507",
    "code": "A0050",
    "name": "英文（二） (AG班)",
    "credits": 2,
    "category": "必",
    "teacher": "余佳紋 (134***)",
    "classroom": "B  502",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AG",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1508",
    "code": "A0050",
    "name": "英文（二） (AH班)",
    "credits": 2,
    "category": "必",
    "teacher": "江怡菁 (130***)",
    "classroom": "B  120",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AH",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1509",
    "code": "A0050",
    "name": "英文（二） (AI班)",
    "credits": 2,
    "category": "必",
    "teacher": "許筱翎 (164***)",
    "classroom": "B  516",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AI",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1510",
    "code": "A0050",
    "name": "英文（二） (AJ班)",
    "credits": 2,
    "category": "必",
    "teacher": "林怡嘉 (169***)",
    "classroom": "L  308",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AJ",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1511",
    "code": "A0050",
    "name": "英文（二） (AK班)",
    "credits": 2,
    "category": "必",
    "teacher": "郭家珍 (141***)",
    "classroom": "B  601",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "AK",
    "group_type": "QG",
    "time_info": "五 / 3,4",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1512",
    "code": "A0050",
    "name": "英文（二） (BA班)",
    "credits": 2,
    "category": "必",
    "teacher": "李金安 (134***)",
    "classroom": "Q  409",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "BA",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1513",
    "code": "A0050",
    "name": "英文（二） (BB班)",
    "credits": 2,
    "category": "必",
    "teacher": "邱智銘 (125***)",
    "classroom": "L  306",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "BB",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1514",
    "code": "A0050",
    "name": "英文（二） (BC班)",
    "credits": 2,
    "category": "必",
    "teacher": "邱紫穎 (075***)",
    "classroom": "L  412",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "BC",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1515",
    "code": "A0050",
    "name": "英文（二） (BD班)",
    "credits": 2,
    "category": "必",
    "teacher": "曾郁景 (134***)",
    "classroom": "B  309",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "BD",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1516",
    "code": "A0050",
    "name": "英文（二） (BE班)",
    "credits": 2,
    "category": "必",
    "teacher": "張秋鶯 (164***)",
    "classroom": "B  111",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "BE",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1517",
    "code": "A0050",
    "name": "英文（二） (BF班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳秋月 (127***)",
    "classroom": "B  701",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "BF",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1518",
    "code": "A0050",
    "name": "英文（二） (BG班)",
    "credits": 2,
    "category": "必",
    "teacher": "羅得彰 (154***)",
    "classroom": "B  116",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "BG",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1519",
    "code": "A0050",
    "name": "英文（二） (BH班)",
    "credits": 2,
    "category": "必",
    "teacher": "許邏灣 (085***)",
    "classroom": "E  813",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "BH",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1520",
    "code": "A0050",
    "name": "英文（二） (BI班)",
    "credits": 2,
    "category": "必",
    "teacher": "簡珮玲 (136***)",
    "classroom": "T  109",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "BI",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1521",
    "code": "A0050",
    "name": "英文（二） (BJ班)",
    "credits": 2,
    "category": "必",
    "teacher": "余佳紋 (134***)",
    "classroom": "B  502",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "BJ",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1522",
    "code": "A0050",
    "name": "英文（二） (BK班)",
    "credits": 2,
    "category": "必",
    "teacher": "江怡菁 (130***)",
    "classroom": "B  120",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "BK",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1523",
    "code": "A0050",
    "name": "英文（二） (BL班)",
    "credits": 2,
    "category": "必",
    "teacher": "許筱翎 (164***)",
    "classroom": "B  516",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "BL",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1524",
    "code": "A0050",
    "name": "英文（二） (BM班)",
    "credits": 2,
    "category": "必",
    "teacher": "林偉力 (164***)",
    "classroom": "C  013",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "BM",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1525",
    "code": "A0050",
    "name": "英文（二） (BN班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊家蘭 (110***)",
    "classroom": "B  426",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "BN",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1526",
    "code": "A0050",
    "name": "英文（二） (BO班)",
    "credits": 2,
    "category": "必",
    "teacher": "林敘如 (139***)",
    "classroom": "B  512",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "BO",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1527",
    "code": "A0050",
    "name": "英文（二） (BP班)",
    "credits": 2,
    "category": "必",
    "teacher": "洪雨婷 (155***)",
    "classroom": "B  118",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "BP",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1528",
    "code": "A0050",
    "name": "英文（二） (BQ班)",
    "credits": 2,
    "category": "必",
    "teacher": "高興雲 (168***)",
    "classroom": "B  427",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "BQ",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TGLEB.商管學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1529",
    "code": "B1814",
    "name": "數位金融創新 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "張瑄凌 (157***)",
    "classroom": "B  512",
    "capacity": "",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "四 / 7,8",
    "department": "TGLHB.榮譽進階專業－商",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1530",
    "code": "B1815",
    "name": "AI數據的經濟應用 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林朕陞 (165***)",
    "classroom": "B  206",
    "capacity": "",
    "time_data": [
      [
        3,
        4,
        5
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "三 / 4,5",
    "department": "TGLHB.榮譽進階專業－商",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1531",
    "code": "B1816",
    "name": "永續治理與智慧創新 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "郝充仁, 張雍昇(103***,136***)",
    "classroom": "B  115",
    "capacity": "",
    "time_data": [
      [
        2,
        8,
        8
      ],
      [
        2,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "二 / 8 二 / 9",
    "department": "TGLHB.榮譽進階專業－商",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1532",
    "code": "M2593",
    "name": "永續設計與創新 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "涂敏芬 (140***)",
    "classroom": "B  115",
    "capacity": "",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "二 / 6,7",
    "department": "TGLHB.榮譽進階專業－商",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1533",
    "code": "B0408",
    "name": "經濟未來學 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "何怡芳 (133***)",
    "classroom": "B  712",
    "capacity": "140",
    "time_data": [
      [
        2,
        6,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 6,7,8",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1534",
    "code": "B1186",
    "name": "企業經營講座 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "李孟修 (159***)",
    "classroom": "B  713",
    "capacity": "250",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGLXB.商管學院共同科日",
    "notes": "◇講座課程"
  },
  {
    "serial": "1535",
    "code": "B1771",
    "name": "趣味學資料科學與影像應用 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "蔡宗儒, 鄭哲斌(078***,102***)",
    "classroom": "B  426",
    "capacity": "120",
    "time_data": [
      [
        1,
        8,
        8
      ],
      [
        1,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 8 一 / 9",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1536",
    "code": "B1824",
    "name": "環境永續及淨零排碳專題研討 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "曹銳勤 (134***)",
    "classroom": "B  602",
    "capacity": "175",
    "time_data": [
      [
        3,
        6,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 6,7,8",
    "department": "TGLXB.商管學院共同科日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "1537",
    "code": "B1890",
    "name": "生成式ＡＩ應用服務實作 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "林仁祥 (167***)",
    "classroom": "B  206",
    "capacity": "54",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1538",
    "code": "B1892",
    "name": "ＡＩ商業管理應用 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "毛筱艷 (169***)",
    "classroom": "B  706",
    "capacity": "80",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1539",
    "code": "B1894",
    "name": "科技商品多元行銷與永續經營 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "吳耀邦 (157***)",
    "classroom": "B  713",
    "capacity": "175",
    "time_data": [
      [
        4,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 5,6",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1540",
    "code": "B1899",
    "name": "數位金融與財富管理 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "王永才 (147***)",
    "classroom": "B  712",
    "capacity": "120",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1541",
    "code": "B1900",
    "name": "企業社會責任與數位經濟研討 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "郭坤峰 (158***)",
    "classroom": "B  504",
    "capacity": "120",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1542",
    "code": "B1901",
    "name": "ＡＩ與永續碳管理 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "羅惠瓊, 林聖豪(121***,152***)",
    "classroom": "B  515",
    "capacity": "120",
    "time_data": [
      [
        4,
        6,
        7
      ],
      [
        4,
        8,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 6,7 四 / 8",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1543",
    "code": "B1905",
    "name": "智慧減碳實務研討 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "范之維 (169***)",
    "classroom": "B  504",
    "capacity": "120",
    "time_data": [
      [
        1,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 8,9",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1544",
    "code": "B1906",
    "name": "科技創新與變革專題研討 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "陳健華 (160***)",
    "classroom": "B  704",
    "capacity": "120",
    "time_data": [
      [
        5,
        2,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 2,3,4",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1545",
    "code": "B1908",
    "name": "ＡＩ服務應用專題 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "梁奮鵬 (167***)",
    "classroom": "B  616",
    "capacity": "120",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1546",
    "code": "B1910",
    "name": "ＡＩ行銷數據分析實務 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "陳水蓮 (135***)",
    "classroom": "B  708",
    "capacity": "120",
    "time_data": [
      [
        1,
        7,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 7,8,9",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1547",
    "code": "B1930",
    "name": "綠色金融發展與實務 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "洪世昌 (162***)",
    "classroom": "L  307",
    "capacity": "120",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1548",
    "code": "E3459",
    "name": "數位學習導論 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "蕭貴徽 (165***)",
    "classroom": "B  119",
    "capacity": "175",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1549",
    "code": "M2239",
    "name": "社會服務(二) (A班)",
    "credits": 1,
    "category": "選",
    "teacher": "顏信輝 (067***)",
    "classroom": "B  705",
    "capacity": "",
    "time_data": [
      [
        3,
        8,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 8",
    "department": "TGLXB.商管學院共同科日",
    "notes": "欲選修者，請洽會計系。"
  },
  {
    "serial": "1550",
    "code": "M2397",
    "name": "Python程式設計與應用 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "鄧文舜 (121***)",
    "classroom": "B  206",
    "capacity": "54",
    "time_data": [
      [
        2,
        9,
        9
      ],
      [
        3,
        2,
        3
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 9 三 / 2,3",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1551",
    "code": "M2471",
    "name": "商業數據分析 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "黃天偉 (166***)",
    "classroom": "B  206",
    "capacity": "70",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TGLXB.商管學院共同科日",
    "notes": "◇以實整虛課程◇全英語授課"
  },
  {
    "serial": "1552",
    "code": "M2581",
    "name": "企業永續發展與風險管理 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "郝充仁 (103***)",
    "classroom": "B  712",
    "capacity": "175",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 6,7",
    "department": "TGLXB.商管學院共同科日",
    "notes": "通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "1553",
    "code": "M2584",
    "name": "永續財經 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "曾永慶 (147***)",
    "classroom": "B  119",
    "capacity": "175",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1554",
    "code": "M2617",
    "name": "永續觀光運輸 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "張翔筌 (149***)",
    "classroom": "B  119",
    "capacity": "120",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1555",
    "code": "M2672",
    "name": "企業轉型與永續經營 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "阮恆江英 (170***)",
    "classroom": "B  704",
    "capacity": "175",
    "time_data": [
      [
        3,
        8,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 8,9,10",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1556",
    "code": "M2677",
    "name": "資料處理與金融稽核實務 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "蔡永澄 (078***)",
    "classroom": "L  412",
    "capacity": "120",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1557",
    "code": "M2785",
    "name": "企業數位轉型關鍵引擎RPA商業應用實務 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "林耕賢 (170***)",
    "classroom": "B  113",
    "capacity": "120",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 8,9",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1558",
    "code": "M2808",
    "name": "AI企業倫理應用 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳威任 (166***)",
    "classroom": "B  713",
    "capacity": "120",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 6,7",
    "department": "TGLXB.商管學院共同科日",
    "notes": ""
  },
  {
    "serial": "1559",
    "code": "T3154",
    "name": "社會議題探索暨實踐 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳小雀 (074***)",
    "classroom": "未定",
    "capacity": "250",
    "time_data": [
      [
        5,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 9",
    "department": "TGPNB.三全教育共同科",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1560",
    "code": "I0622",
    "name": "專題計畫寫作 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "包正豪 (129***)",
    "classroom": "T  607",
    "capacity": "",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "二 / 1,2",
    "department": "TGRHB.榮譽進階專業－國",
    "notes": "榮譽學程進階專業課程，限符合資格者修習 ◇全英語授課"
  },
  {
    "serial": "1561",
    "code": "M2680",
    "name": "環境公民行動實作 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳維立 (139***)",
    "classroom": "E  415",
    "capacity": "30",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGRXB.國際學院共同科日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "1562",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "羅得彰 (154***)",
    "classroom": "S  101,L  104",
    "capacity": "72",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        5,
        4,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "QA",
    "time_info": "五 / 6,7 五 / 4",
    "department": "TGSEB.理學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1563",
    "code": "T0466",
    "name": "英文（一） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳怡芬 (119***)",
    "classroom": "L  308,L  106",
    "capacity": "74",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        5,
        4,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "QA",
    "time_info": "五 / 6,7 五 / 4",
    "department": "TGSEB.理學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1564",
    "code": "T0466",
    "name": "英文（一） (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "簡珮玲 (136***)",
    "classroom": "B  504,V  201",
    "capacity": "76",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        5,
        4,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "QA",
    "time_info": "五 / 6,7 五 / 4",
    "department": "TGSEB.理學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1565",
    "code": "T0466",
    "name": "英文（一） (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "張淑貞 (153***)",
    "classroom": "B  606,L  101",
    "capacity": "80",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        5,
        4,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "QA",
    "time_info": "五 / 6,7 五 / 4",
    "department": "TGSEB.理學院英文",
    "notes": "大一不可換班，需繳語言實習費。各班分級對照表請見英文系網頁＞最新消息＞通識外語學門公告。"
  },
  {
    "serial": "1566",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "張玉英 (122***)",
    "classroom": "L  416",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "QG",
    "time_info": "五 / 8,9",
    "department": "TGSEB.理學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1567",
    "code": "A0050",
    "name": "英文（二） (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃翊之 (161***)",
    "classroom": "B  429",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "QG",
    "time_info": "五 / 8,9",
    "department": "TGSEB.理學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。 ◇全英語授課"
  },
  {
    "serial": "1568",
    "code": "A0050",
    "name": "英文（二） (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "湯雅蘭 (141***)",
    "classroom": "E  830",
    "capacity": "70",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "QG",
    "time_info": "五 / 8,9",
    "department": "TGSEB.理學院英文",
    "notes": "加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。"
  },
  {
    "serial": "1569",
    "code": "S0898",
    "name": "科學專題（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "彭維鋒 (080***)",
    "classroom": "S  314",
    "capacity": "",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "三 / 3,4",
    "department": "TGSHB.榮譽進階專業－理",
    "notes": "榮譽學程進階專業課程，限符合資格者修習"
  },
  {
    "serial": "1570",
    "code": "M2679",
    "name": "循環經濟與永續供應鏈 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳麗娟 (098***)",
    "classroom": "C  010",
    "capacity": "70",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGSXB.理學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1571",
    "code": "S1036",
    "name": "人工智慧應用與實作 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "楊定揮 (123***)",
    "classroom": "B  218",
    "capacity": "70",
    "time_data": [
      [
        4,
        6,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 6,7,8",
    "department": "TGSXB.理學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1572",
    "code": "S1093",
    "name": "量子電腦上的計算與ＡＩ (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "吳俊毅 (158***)",
    "classroom": "B  206",
    "capacity": "50",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TGSXB.理學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1573",
    "code": "S1112",
    "name": "量子科技與應用探索 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "莊程豪 (142***)",
    "classroom": "S  420",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TGSXB.理學院共同科－日",
    "notes": ""
  },
  {
    "serial": "1574",
    "code": "T9867",
    "name": "男、女生體育－高爾夫球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "王誼邦 (106***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "第1週SG245,第2週起改至佑昇高爾夫球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "1575",
    "code": "T9871",
    "name": "男、女生體育－有氧舞蹈興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "李惠婷 (146***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓武術室"
  },
  {
    "serial": "1576",
    "code": "T9871",
    "name": "男、女生體育－有氧舞蹈興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "林子文 (167***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        5,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "五 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓劍道館 ◇全英語授課"
  },
  {
    "serial": "1577",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "王元聖 (119***)",
    "classroom": "未定",
    "capacity": "56",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "1578",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "廖偉智 (163***)",
    "classroom": "未定",
    "capacity": "56",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "五虎崗排球場(V2)雨天體育館地下1樓劍道館"
  },
  {
    "serial": "1579",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "劉宗德 (106***)",
    "classroom": "未定",
    "capacity": "56",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "1580",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "潘定均 (136***)",
    "classroom": "未定",
    "capacity": "56",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "五虎崗排球場(V2)雨天游泳館N202"
  },
  {
    "serial": "1581",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳　著 (155***)",
    "classroom": "未定",
    "capacity": "56",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "五虎崗排球場(V2)雨天游泳館N201 ◇全英語授課"
  },
  {
    "serial": "1582",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳逸政 (087***)",
    "classroom": "未定",
    "capacity": "56",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "F",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "1583",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (G班)",
    "credits": 1,
    "category": "必",
    "teacher": "楊總成 (106***)",
    "classroom": "未定",
    "capacity": "56",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "G",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "1584",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (H班)",
    "credits": 1,
    "category": "必",
    "teacher": "潘定均 (136***)",
    "classroom": "未定",
    "capacity": "56",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "H",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "五虎崗排球場(V2)雨天游泳館N202"
  },
  {
    "serial": "1585",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (I班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳凱智 (136***)",
    "classroom": "未定",
    "capacity": "56",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "I",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "五虎崗排球場(V2)雨天游泳館N202"
  },
  {
    "serial": "1586",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (J班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳志成 (129***)",
    "classroom": "未定",
    "capacity": "46",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "J",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "五虎崗排球場(V3)雨天游泳館N201"
  },
  {
    "serial": "1587",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (K班)",
    "credits": 1,
    "category": "必",
    "teacher": "涂慶忠 (163***)",
    "classroom": "未定",
    "capacity": "56",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "K",
    "group_type": "",
    "time_info": "五 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "1588",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (L班)",
    "credits": 1,
    "category": "必",
    "teacher": "曾丸晏 (163***)",
    "classroom": "未定",
    "capacity": "56",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "L",
    "group_type": "",
    "time_info": "五 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "1589",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "覃素莉 (078***)",
    "classroom": "未定",
    "capacity": "83",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "1590",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "祝煒欽 (163***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "田徑場旁籃球場(B2)雨天游泳館N202"
  },
  {
    "serial": "1591",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃志成 (083***)",
    "classroom": "未定",
    "capacity": "83",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "1592",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "林正裕 (163***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "五虎崗籃球場(B3)雨天游泳館N202"
  },
  {
    "serial": "1593",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳佩欣 (163***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "田徑場旁籃球場(B2)雨天游泳館N201"
  },
  {
    "serial": "1594",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "吳承恩 (158***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "F",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "田徑場旁籃球場(B2)雨天游泳館N204 ◇全英語授課"
  },
  {
    "serial": "1595",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (G班)",
    "credits": 1,
    "category": "必",
    "teacher": "吳茂昌 (129***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "G",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "田徑場旁籃球場(B2)雨天游泳館N201"
  },
  {
    "serial": "1596",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (H班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳天賜 (114***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "H",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "田徑場旁籃球場(B2)雨天游泳館N201"
  },
  {
    "serial": "1597",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (I班)",
    "credits": 1,
    "category": "必",
    "teacher": "朱瓊苓 (166***)",
    "classroom": "未定",
    "capacity": "83",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "I",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "1598",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (J班)",
    "credits": 1,
    "category": "必",
    "teacher": "張弓弘 (078***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "J",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "田徑場旁籃球場(B2)雨天游泳館N202"
  },
  {
    "serial": "1599",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (K班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳香吟 (163***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "K",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "田徑場旁籃球場(B2)雨天游泳館N204"
  },
  {
    "serial": "1600",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (L班)",
    "credits": 1,
    "category": "必",
    "teacher": "鄭伊秀 (163***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "L",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "田徑場旁籃球場(B2)雨天游泳館N204"
  },
  {
    "serial": "1601",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (M班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃俊華 (163***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "M",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "田徑場旁籃球場(B2)雨天游泳館N204"
  },
  {
    "serial": "1602",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (N班)",
    "credits": 1,
    "category": "必",
    "teacher": "許智強 (163***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "N",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "五虎崗籃球場(B3+B4)雨天游泳館N201"
  },
  {
    "serial": "1603",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (O班)",
    "credits": 1,
    "category": "必",
    "teacher": "吳竹貴 (170***)",
    "classroom": "未定",
    "capacity": "83",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "O",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "1604",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (P班)",
    "credits": 1,
    "category": "必",
    "teacher": "柯明辰 (151***)",
    "classroom": "未定",
    "capacity": "83",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "五 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場 ◇全英語授課"
  },
  {
    "serial": "1605",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (Q班)",
    "credits": 1,
    "category": "必",
    "teacher": "林郁偉 (163***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "Q",
    "group_type": "",
    "time_info": "五 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "田徑場旁籃球場(B2)雨天游泳館N204 ◇全英語授課"
  },
  {
    "serial": "1606",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "高文璽 (145***)",
    "classroom": "SG 322",
    "capacity": "83",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室"
  },
  {
    "serial": "1607",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "李欣靜 (136***)",
    "classroom": "SG 322",
    "capacity": "83",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室"
  },
  {
    "serial": "1608",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "王双龍 (163***)",
    "classroom": "SG 322",
    "capacity": "83",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室"
  },
  {
    "serial": "1609",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "李欣靜 (136***)",
    "classroom": "SG 322",
    "capacity": "83",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室"
  },
  {
    "serial": "1610",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "張嘉雄 (128***)",
    "classroom": "SG 322",
    "capacity": "83",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室"
  },
  {
    "serial": "1611",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃嘉笙 (158***)",
    "classroom": "SG 322",
    "capacity": "83",
    "time_data": [
      [
        5,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "F",
    "group_type": "",
    "time_info": "五 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室 ◇全英語授課"
  },
  {
    "serial": "1612",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (G班)",
    "credits": 1,
    "category": "必",
    "teacher": "蕭淑芬 (048***)",
    "classroom": "SG 322",
    "capacity": "83",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "G",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室"
  },
  {
    "serial": "1613",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (H班)",
    "credits": 1,
    "category": "必",
    "teacher": "林裕量 (163***)",
    "classroom": "SG 322",
    "capacity": "83",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "H",
    "group_type": "",
    "time_info": "五 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室"
  },
  {
    "serial": "1614",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡慧敏 (120***)",
    "classroom": "未定",
    "capacity": "55",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "1615",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡慧敏 (120***)",
    "classroom": "未定",
    "capacity": "55",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "1616",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "范姜逸敏 (120***)",
    "classroom": "未定",
    "capacity": "55",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "1617",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "胡浩陽 (163***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "活動中心羽球場"
  },
  {
    "serial": "1618",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "林素婷 (099***)",
    "classroom": "未定",
    "capacity": "55",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "1619",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳瑞辰 (138***)",
    "classroom": "未定",
    "capacity": "55",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "F",
    "group_type": "",
    "time_info": "五 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "1620",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (G班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃嘉笙 (158***)",
    "classroom": "未定",
    "capacity": "55",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "G",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場 ◇全英語授課"
  },
  {
    "serial": "1621",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (H班)",
    "credits": 1,
    "category": "必",
    "teacher": "柯易智 (163***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "H",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "活動中心羽球場"
  },
  {
    "serial": "1622",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (I班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃嘉笙 (158***)",
    "classroom": "未定",
    "capacity": "55",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "I",
    "group_type": "",
    "time_info": "五 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "1623",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (J班)",
    "credits": 1,
    "category": "必",
    "teacher": "林郁偉 (163***)",
    "classroom": "未定",
    "capacity": "55",
    "time_data": [
      [
        5,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "J",
    "group_type": "",
    "time_info": "五 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場 ◇全英語授課"
  },
  {
    "serial": "1624",
    "code": "T9876",
    "name": "男、女生體育－壘球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "王重引 (163***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "操場雨天游泳館N201"
  },
  {
    "serial": "1625",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "李欣靜 (136***)",
    "classroom": "N  204",
    "capacity": "35",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "游泳館N204"
  },
  {
    "serial": "1626",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪建智 (083***)",
    "classroom": "SG 323",
    "capacity": "55",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "1627",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "王元聖 (119***)",
    "classroom": "SG 323",
    "capacity": "55",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "",
    "time_info": "五 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "1628",
    "code": "T9882",
    "name": "男、女生體育－體重控制興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳建樺 (132***)",
    "classroom": "N  204",
    "capacity": "35",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "游泳館N204"
  },
  {
    "serial": "1629",
    "code": "T9883",
    "name": "男、女生體育－網球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "張嘉雄 (128***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場雨天SG245"
  },
  {
    "serial": "1630",
    "code": "T9883",
    "name": "男、女生體育－網球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "范姜逸敏 (120***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "五 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場雨天SG245"
  },
  {
    "serial": "1631",
    "code": "T9886",
    "name": "男、女生體育－太極拳興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "劉俊昌 (153***)",
    "classroom": "未定",
    "capacity": "55",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓武術室"
  },
  {
    "serial": "1632",
    "code": "T9890",
    "name": "男、女生體育－撞球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "謝豐宇 (124***)",
    "classroom": "未定",
    "capacity": "55",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "強運撞球場校外場地上課需另付球資，未完成繳費予以退選"
  },
  {
    "serial": "1633",
    "code": "T9890",
    "name": "男、女生體育－撞球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳天文 (131***)",
    "classroom": "未定",
    "capacity": "55",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "強運撞球場校外場地上課需另付球資，未完成繳費予以退選"
  },
  {
    "serial": "1634",
    "code": "T9890",
    "name": "男、女生體育－撞球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳天文 (131***)",
    "classroom": "未定",
    "capacity": "55",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "強運撞球場校外場地上課需另付球資，未完成繳費予以退選"
  },
  {
    "serial": "1635",
    "code": "T9897",
    "name": "男、女生體育－跆拳道 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪詩涵 (163***)",
    "classroom": "未定",
    "capacity": "55",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓武術室"
  },
  {
    "serial": "1636",
    "code": "U5002",
    "name": "男、女生體育-養生氣功興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳文和 (137***)",
    "classroom": "未定",
    "capacity": "55",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓武術室"
  },
  {
    "serial": "1637",
    "code": "U5008",
    "name": "男、女生體育－水上活動游泳初級 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "謝豐宇 (124***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "游泳館S1"
  },
  {
    "serial": "1638",
    "code": "U5008",
    "name": "男、女生體育－水上活動游泳初級 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳建樺 (132***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "游泳館S1"
  },
  {
    "serial": "1639",
    "code": "U5008",
    "name": "男、女生體育－水上活動游泳初級 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳瑞辰 (138***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "游泳館S1 ◇全英語授課"
  },
  {
    "serial": "1640",
    "code": "U5011",
    "name": "男、女生體育－瑜伽興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "郭馥滋 (143***)",
    "classroom": "N  201",
    "capacity": "35",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "游泳館N201"
  },
  {
    "serial": "1641",
    "code": "U5011",
    "name": "男、女生體育－瑜伽興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "雷小娟 (115***)",
    "classroom": "SG 246",
    "capacity": "83",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "1642",
    "code": "U5011",
    "name": "男、女生體育－瑜伽興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "郭馥滋 (143***)",
    "classroom": "N  201",
    "capacity": "35",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "游泳館N201"
  },
  {
    "serial": "1643",
    "code": "U5011",
    "name": "男、女生體育－瑜伽興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡忻林 (098***)",
    "classroom": "SG 246",
    "capacity": "83",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "1644",
    "code": "U5030",
    "name": "男、女生體育－足球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "郭奕廷 (170***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "操場雨天體育館地下1樓劍道館"
  },
  {
    "serial": "1645",
    "code": "U5032",
    "name": "男、女生體育－木球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "王豐家 (158***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "操場雨天游泳館N204 ◇全英語授課"
  },
  {
    "serial": "1646",
    "code": "U5034",
    "name": "男、女生體育－舞蹈興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "吳采陵 (169***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓武術室"
  },
  {
    "serial": "1647",
    "code": "U5034",
    "name": "男、女生體育－舞蹈興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "吳采陵 (169***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓劍道館 ◇全英語授課"
  },
  {
    "serial": "1648",
    "code": "U5045",
    "name": "男、女生體育－軟式網球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳凱智 (136***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        5,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場雨天游泳館N201"
  },
  {
    "serial": "1649",
    "code": "U5053",
    "name": "男、女生體育－匹克球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "趙曉雯 (148***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "活動中心羽球場"
  },
  {
    "serial": "1650",
    "code": "U5053",
    "name": "男、女生體育－匹克球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "鄭俊傑 (125***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "活動中心羽球場"
  },
  {
    "serial": "1651",
    "code": "T9835",
    "name": "男生體育－籃球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪敦賓 (065***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "1652",
    "code": "T9835",
    "name": "男生體育－籃球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪敦賓 (065***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "1653",
    "code": "T9835",
    "name": "男生體育－籃球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪敦賓 (065***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "1654",
    "code": "T9867",
    "name": "男、女生體育－高爾夫球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "蕭淑芬 (048***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "第1週SG245,第2週起改至佑昇高爾夫球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "1655",
    "code": "T9867",
    "name": "男、女生體育－高爾夫球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "蕭淑芬 (048***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "第1週SG245,第2週起改至佑昇高爾夫球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "1656",
    "code": "T9867",
    "name": "男、女生體育－高爾夫球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "王誼邦 (106***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        3,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 5,6",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "第1週游泳館N202,第2週起改至佑昇高爾夫球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "1657",
    "code": "T9867",
    "name": "男、女生體育－高爾夫球興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "王誼邦 (106***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "第1週游泳館N202,第2週起改至佑昇高爾夫球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "1658",
    "code": "T9867",
    "name": "男、女生體育－高爾夫球興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳逸政 (087***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "E",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "第1週SG245,第2週起改至佑昇高爾夫球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "1659",
    "code": "T9867",
    "name": "男、女生體育－高爾夫球興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "王誼邦 (106***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        2,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "F",
    "group_type": "",
    "time_info": "二 / 5,6",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "第1週游泳館N204,第2週起改至佑昇高爾夫球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "1660",
    "code": "T9867",
    "name": "男、女生體育－高爾夫球興趣班 (G班)",
    "credits": 1,
    "category": "必",
    "teacher": "蕭淑芬 (048***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        4,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "G",
    "group_type": "",
    "time_info": "四 / 5,6",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "第1週SG245，第2週起改至佑昇高爾夫球場校外場地上課需另付球資，未完成繳費予以退選"
  },
  {
    "serial": "1661",
    "code": "T9871",
    "name": "男、女生體育－有氧舞蹈興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "郭馥滋 (143***)",
    "classroom": "N  204",
    "capacity": "30",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "游泳館N204,"
  },
  {
    "serial": "1662",
    "code": "T9871",
    "name": "男、女生體育－有氧舞蹈興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "郭馥滋 (143***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "1663",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "潘定均 (136***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "五虎崗排球場(V2),雨備游泳館N201"
  },
  {
    "serial": "1664",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "雷小娟 (115***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "1665",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "雷小娟 (115***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "1666",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "劉宗德 (106***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "1667",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳逸政 (087***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "E",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "1668",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "劉宗德 (106***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "F",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "1669",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (G班)",
    "credits": 1,
    "category": "必",
    "teacher": "楊總成 (106***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "G",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "1670",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (H班)",
    "credits": 1,
    "category": "必",
    "teacher": "潘定均 (136***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "H",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "1671",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (I班)",
    "credits": 1,
    "category": "必",
    "teacher": "潘定均 (136***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "I",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "1672",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (J班)",
    "credits": 1,
    "category": "必",
    "teacher": "楊總成 (106***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "J",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "1673",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (K班)",
    "credits": 1,
    "category": "必",
    "teacher": "楊總成 (106***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "K",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "1674",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (L班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳　著 (155***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "L",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "五虎崗排球場(V2)；雨備：體育館地下一樓武術室。 ◇全英語授課"
  },
  {
    "serial": "1675",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "覃素莉 (078***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "1676",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "覃素莉 (078***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "1677",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "覃素莉 (078***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "1678",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "張弓弘 (078***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "1679",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "覃素莉 (078***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "E",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "1680",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "覃素莉 (078***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "F",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "1681",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (G班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳建樺 (132***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "G",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "1682",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (H班)",
    "credits": 1,
    "category": "必",
    "teacher": "張弓弘 (078***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "H",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "1683",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (I班)",
    "credits": 1,
    "category": "必",
    "teacher": "吳承恩 (158***)",
    "classroom": "未定",
    "capacity": "70",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "I",
    "group_type": "",
    "time_info": "五 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場 ◇全英語授課"
  },
  {
    "serial": "1684",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (J班)",
    "credits": 1,
    "category": "必",
    "teacher": "柯明辰 (151***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "J",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "田徑場旁籃球場(B2)；雨備：游泳館N201 ◇全英語授課"
  },
  {
    "serial": "1685",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "王元聖 (119***)",
    "classroom": "SG 322",
    "capacity": "60",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室"
  },
  {
    "serial": "1686",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "李欣靜 (136***)",
    "classroom": "SG 322",
    "capacity": "30",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "進階班體育館SG322桌球室"
  },
  {
    "serial": "1687",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "林素婷 (099***)",
    "classroom": "SG 322",
    "capacity": "60",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室"
  },
  {
    "serial": "1688",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "李欣靜 (136***)",
    "classroom": "SG 322",
    "capacity": "60",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室"
  },
  {
    "serial": "1689",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "王誼邦 (106***)",
    "classroom": "SG 322",
    "capacity": "60",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "E",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室"
  },
  {
    "serial": "1690",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳天文 (131***)",
    "classroom": "SG 322",
    "capacity": "60",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "F",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室"
  },
  {
    "serial": "1691",
    "code": "T9874",
    "name": "男、女生體育－桌球興趣班 (G班)",
    "credits": 1,
    "category": "必",
    "teacher": "梅書瑋 (170***)",
    "classroom": "SG 322",
    "capacity": "60",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "G",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG322桌球室"
  },
  {
    "serial": "1692",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "李建宏 (163***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "活動中心羽球場"
  },
  {
    "serial": "1693",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳建樺 (132***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "活動中心羽球場"
  },
  {
    "serial": "1694",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳凱智 (136***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "活動中心羽球場"
  },
  {
    "serial": "1695",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃嘉笙 (158***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "活動中心羽球場 ◇全英語授課"
  },
  {
    "serial": "1696",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃谷臣 (091***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "E",
    "group_type": "",
    "time_info": "一 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "1697",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃貴樹 (138***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "F",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "1698",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (G班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡慧敏 (120***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "G",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "1699",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (H班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡慧敏 (120***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "H",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "進階班體育館4樓羽球場"
  },
  {
    "serial": "1700",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (I班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃貴樹 (138***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "I",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "1701",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (J班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳天文 (131***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "J",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "1702",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (K班)",
    "credits": 1,
    "category": "必",
    "teacher": "趙曉雯 (148***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "K",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "1703",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (L班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡慧敏 (120***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "L",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "1704",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (M班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳凱智 (136***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "M",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "活動中心羽球場 ◇全英語授課"
  },
  {
    "serial": "1705",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (N班)",
    "credits": 1,
    "category": "必",
    "teacher": "范姜逸敏 (120***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "N",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "1706",
    "code": "T9876",
    "name": "男、女生體育－壘球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃谷臣 (091***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "操場,雨備游泳館N201"
  },
  {
    "serial": "1707",
    "code": "T9876",
    "name": "男、女生體育－壘球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "謝豐宇 (124***)",
    "classroom": "未定",
    "capacity": "60",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "操場,雨備游泳館N201"
  },
  {
    "serial": "1708",
    "code": "T9880",
    "name": "男、女生體育－柔道防身術 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳俊樺 (170***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓武術室"
  },
  {
    "serial": "1709",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "劉宗德 (106***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "1710",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳建樺 (132***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "1711",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃谷臣 (091***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "1712",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪建智 (083***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "1713",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "劉宗德 (106***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "E",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "1714",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪建智 (083***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "F",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "1715",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (G班)",
    "credits": 1,
    "category": "必",
    "teacher": "雷小娟 (115***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "G",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "1716",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (H班)",
    "credits": 1,
    "category": "必",
    "teacher": "王元聖 (119***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "H",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "1717",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (I班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪敦賓 (065***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "I",
    "group_type": "",
    "time_info": "五 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "1718",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (J班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪敦賓 (065***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        5,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "J",
    "group_type": "",
    "time_info": "五 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "1719",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (K班)",
    "credits": 1,
    "category": "必",
    "teacher": "王誼邦 (106***)",
    "classroom": "N  204",
    "capacity": "30",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "K",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "游泳館N204"
  },
  {
    "serial": "1720",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (L班)",
    "credits": 1,
    "category": "必",
    "teacher": "雷小娟 (115***)",
    "classroom": "N  204",
    "capacity": "30",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "L",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "游泳館N204"
  },
  {
    "serial": "1721",
    "code": "T9883",
    "name": "男、女生體育－網球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "張嘉雄 (128***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備SG245"
  },
  {
    "serial": "1722",
    "code": "T9883",
    "name": "男、女生體育－網球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "張嘉雄 (128***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備第1周體育館地下1樓武術室,其他周次SG245"
  },
  {
    "serial": "1723",
    "code": "T9883",
    "name": "男、女生體育－網球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "張嘉雄 (128***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備SG245"
  },
  {
    "serial": "1724",
    "code": "T9883",
    "name": "男、女生體育－網球興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪建智 (083***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備SG245"
  },
  {
    "serial": "1725",
    "code": "T9883",
    "name": "男、女生體育－網球興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "范姜逸敏 (120***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "E",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備SG245"
  },
  {
    "serial": "1726",
    "code": "T9883",
    "name": "男、女生體育－網球興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "范姜逸敏 (120***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "F",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備SG245"
  },
  {
    "serial": "1727",
    "code": "T9883",
    "name": "男、女生體育－網球興趣班 (G班)",
    "credits": 1,
    "category": "必",
    "teacher": "范姜逸敏 (120***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "G",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備SG245"
  },
  {
    "serial": "1728",
    "code": "T9883",
    "name": "男、女生體育－網球興趣班 (H班)",
    "credits": 1,
    "category": "必",
    "teacher": "趙曉雯 (148***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "H",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備體育館地下1樓武術室 ◇全英語授課"
  },
  {
    "serial": "1729",
    "code": "T9886",
    "name": "男、女生體育－太極拳興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳文和 (137***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓武術室"
  },
  {
    "serial": "1730",
    "code": "T9886",
    "name": "男、女生體育－太極拳興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳文和 (137***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        5,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "五 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓武術室"
  },
  {
    "serial": "1731",
    "code": "T9886",
    "name": "男、女生體育－太極拳興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪建智 (083***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓劍道館"
  },
  {
    "serial": "1732",
    "code": "T9886",
    "name": "男、女生體育－太極拳興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪建智 (083***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓劍道館"
  },
  {
    "serial": "1733",
    "code": "T9890",
    "name": "男、女生體育－撞球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "林廣建 (163***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "強運撞球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "1734",
    "code": "T9890",
    "name": "男、女生體育－撞球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "謝豐宇 (124***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "強運撞球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "1735",
    "code": "T9890",
    "name": "男、女生體育－撞球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳天文 (131***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "強運撞球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "1736",
    "code": "T9890",
    "name": "男、女生體育－撞球興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳天文 (131***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "強運撞球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "1737",
    "code": "T9890",
    "name": "男、女生體育－撞球興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "謝豐宇 (124***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "E",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "強運撞球場,校外場地上課需另付球資,未完成繳費予以退選"
  },
  {
    "serial": "1738",
    "code": "T9891",
    "name": "男、女生體育－網球專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "張嘉雄 (128***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 13,14",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "1739",
    "code": "T9892",
    "name": "男、女生體育－羽球專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡慧敏 (120***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 11,12",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "1740",
    "code": "T9893",
    "name": "男、女生體育－桌球專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "藍鉦淯 (170***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 13,14",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "1741",
    "code": "T9894",
    "name": "男、女生體育－排球專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "楊總成 (106***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 11,12",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "1742",
    "code": "T9894",
    "name": "男、女生體育－排球專長班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "潘定均 (136***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "六 / 13,14",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "1743",
    "code": "T9895",
    "name": "男、女生體育－籃球專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳建樺 (132***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 11,12",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "1744",
    "code": "T9895",
    "name": "男、女生體育－籃球專長班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "吳承恩 (158***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "六 / 13,14",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項。限校隊選課"
  },
  {
    "serial": "1745",
    "code": "T9897",
    "name": "男、女生體育－跆拳道 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "王豐家 (158***)",
    "classroom": "未定",
    "capacity": "55",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓武術室 ◇全英語授課"
  },
  {
    "serial": "1746",
    "code": "T9897",
    "name": "男、女生體育－跆拳道 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "王元聖 (119***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓武術室"
  },
  {
    "serial": "1747",
    "code": "T9897",
    "name": "男、女生體育－跆拳道 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "王豐家 (158***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓武術室"
  },
  {
    "serial": "1748",
    "code": "T9900",
    "name": "男、女生體育－游泳專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳瑞辰 (138***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 13,14",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課 ◇全英語授課"
  },
  {
    "serial": "1749",
    "code": "T9938",
    "name": "女生體育－羽球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "林素婷 (099***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "1750",
    "code": "T9938",
    "name": "女生體育－羽球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "林素婷 (099***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "1751",
    "code": "T9938",
    "name": "女生體育－羽球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "林素婷 (099***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "1752",
    "code": "T9939",
    "name": "女生體育－網球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "林素婷 (099***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備第1周體育館地下1樓劍道館,其他周次SG245"
  },
  {
    "serial": "1753",
    "code": "T9949",
    "name": "女生體育－軟式排球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "楊總成 (106***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "1754",
    "code": "U5001",
    "name": "男、女生體育-重量訓練 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "劉宗德 (106***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "1755",
    "code": "U5001",
    "name": "男、女生體育-重量訓練 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "張弓弘 (078***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "1756",
    "code": "U5001",
    "name": "男、女生體育-重量訓練 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "張弓弘 (078***)",
    "classroom": "SG 323",
    "capacity": "50",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "1757",
    "code": "U5002",
    "name": "男、女生體育-養生氣功興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳怡穎 (062***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "1758",
    "code": "U5002",
    "name": "男、女生體育-養生氣功興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳怡穎 (062***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "1759",
    "code": "U5008",
    "name": "男、女生體育－水上活動游泳初級 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳瑞辰 (138***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "游泳館S1"
  },
  {
    "serial": "1760",
    "code": "U5008",
    "name": "男、女生體育－水上活動游泳初級 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳瑞辰 (138***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "游泳館S1"
  },
  {
    "serial": "1761",
    "code": "U5008",
    "name": "男、女生體育－水上活動游泳初級 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳瑞辰 (138***)",
    "classroom": "未定",
    "capacity": "40",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "游泳館S1"
  },
  {
    "serial": "1762",
    "code": "U5011",
    "name": "男、女生體育－瑜伽興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "郭馥滋 (143***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "1763",
    "code": "U5011",
    "name": "男、女生體育－瑜伽興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡忻林 (098***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "1764",
    "code": "U5011",
    "name": "男、女生體育－瑜伽興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡忻林 (098***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "1765",
    "code": "U5011",
    "name": "男、女生體育－瑜伽興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "雷小娟 (115***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "1766",
    "code": "U5011",
    "name": "男、女生體育－瑜伽興趣班 (E班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡忻林 (098***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "E",
    "group_type": "",
    "time_info": "三 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "1767",
    "code": "U5011",
    "name": "男、女生體育－瑜伽興趣班 (F班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡忻林 (098***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "F",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "1768",
    "code": "U5011",
    "name": "男、女生體育－瑜伽興趣班 (G班)",
    "credits": 1,
    "category": "必",
    "teacher": "蔡忻林 (098***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "G",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "1769",
    "code": "U5026",
    "name": "男、女生體育－適應體育班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "李欣靜, 吳承恩(136***,158***)",
    "classroom": "SG 323",
    "capacity": "",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室,須提醫生證明"
  },
  {
    "serial": "1770",
    "code": "U5026",
    "name": "男、女生體育－適應體育班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "王豐家, 徐詩涵(158***,170***)",
    "classroom": "SG 323",
    "capacity": "",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室,須提醫生證明"
  },
  {
    "serial": "1771",
    "code": "U5026",
    "name": "男、女生體育－適應體育班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃嘉笙, 林子文(158***,167***)",
    "classroom": "SG 323",
    "capacity": "",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "四 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG323重訓室,須提醫生證明 ◇全英語授課"
  },
  {
    "serial": "1772",
    "code": "U5028",
    "name": "男、女生體育專業知能服務－跆拳道 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "王元聖 (119***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 11,12",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課 ◇專業知能服務學習課程"
  },
  {
    "serial": "1773",
    "code": "U5034",
    "name": "男、女生體育－舞蹈興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "吳采陵 (169***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "1774",
    "code": "U5034",
    "name": "男、女生體育－舞蹈興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "林子文 (167***)",
    "classroom": "SG 246",
    "capacity": "60",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "五 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室"
  },
  {
    "serial": "1775",
    "code": "U5034",
    "name": "男、女生體育－舞蹈興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "吳采陵 (169***)",
    "classroom": "SG 246",
    "capacity": "70",
    "time_data": [
      [
        5,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "五 / 9,10",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室 ◇全英語授課"
  },
  {
    "serial": "1776",
    "code": "U5034",
    "name": "男、女生體育－舞蹈興趣班 (D班)",
    "credits": 1,
    "category": "必",
    "teacher": "林子文 (167***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "D",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館地下1樓劍道館"
  },
  {
    "serial": "1777",
    "code": "U5045",
    "name": "男、女生體育－軟式網球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "趙曉雯 (148***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備體育館地下1樓武術室 ◇全英語授課"
  },
  {
    "serial": "1778",
    "code": "U5045",
    "name": "男、女生體育－軟式網球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳凱智 (136***)",
    "classroom": "未定",
    "capacity": "45",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "五 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備游泳館N201"
  },
  {
    "serial": "1779",
    "code": "U5045",
    "name": "男、女生體育－軟式網球興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳凱智 (136***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "網球場,雨備第1周游泳館N201,其他周次SG245 ◇全英語授課"
  },
  {
    "serial": "1780",
    "code": "U5047",
    "name": "男、女生體育－擊劍專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "王順民 (166***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 13,14",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課 ◇全英語授課"
  },
  {
    "serial": "1781",
    "code": "U5048",
    "name": "男、女生體育－撞球專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "張郁洵 (166***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 13,14",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "1782",
    "code": "U5049",
    "name": "男、女生體育－空手道專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "高程輝 (168***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 13,14",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "1783",
    "code": "U5050",
    "name": "男、女生體育－足球專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "李定隆 (168***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 13,14",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "1784",
    "code": "U5051",
    "name": "男、女生體育－棒、壘球專長班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "謝豐宇 (124***)",
    "classroom": "未定",
    "capacity": "30",
    "time_data": [
      [
        6,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 13,14",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "依體育處另行公告之運動代表隊練習注意事項,限校隊選課"
  },
  {
    "serial": "1785",
    "code": "U5052",
    "name": "男、女生體育－籃球裁判興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "張弓弘 (078***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "1970",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王蔚婷 (133***)",
    "classroom": "B  706",
    "capacity": "80",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 6,7",
    "department": "TLBAB.財金系財管英語班",
    "notes": "限全英語專班學生 ◇全英語授課"
  },
  {
    "serial": "1974",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王建文 (163***)",
    "classroom": "B  601",
    "capacity": "70",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "QG",
    "time_info": "四 / 9,10",
    "department": "TLBAB.財金系財管英語班",
    "notes": "限全英語專班學生，加選請依英文系網頁>最新消息>通識外語學門公告辦理。 ◇全英語授課"
  },
  {
    "serial": "2071",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳威任 (166***)",
    "classroom": "B  428",
    "capacity": "80",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TLCAB.企管系英語班",
    "notes": "限全英語專班學生 ◇全英語授課"
  },
  {
    "serial": "2195",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "張慈珊 (125***)",
    "classroom": "B  312",
    "capacity": "80",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TLFBB.國企系國商英語組",
    "notes": "限全英語專班學生 ◇全英語授課"
  },
  {
    "serial": "2200",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "喬　治 (159***)",
    "classroom": "E  404",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "QG",
    "time_info": "五 / 6,7",
    "department": "TLFBB.國企系國商英語組",
    "notes": "限全英語專班學生；加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。 ◇全英語授課"
  },
  {
    "serial": "2567",
    "code": "T2794",
    "name": "社團學習與實作－自主團隊 (A班)",
    "credits": 0,
    "category": "必",
    "teacher": "黃文智 (052***)",
    "classroom": "S  103",
    "capacity": "60",
    "time_data": [
      [
        5,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "K",
    "time_info": "五 / 9,10",
    "department": "TNUKB.核心課程Ｋ群－日",
    "notes": "限大四未完成活動參與/執行學生修習，上課6次，上課週次請詳教學計畫表。"
  },
  {
    "serial": "2568",
    "code": "T2794",
    "name": "社團學習與實作－自主團隊 (B班)",
    "credits": 0,
    "category": "必",
    "teacher": "黃文智 (052***)",
    "classroom": "H  116",
    "capacity": "60",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "K",
    "time_info": "四 / 3,4",
    "department": "TNUKB.核心課程Ｋ群－日",
    "notes": "限大四未完成活動參與/執行學生修習，上課6次，上課週次請詳教學計畫表。"
  },
  {
    "serial": "2569",
    "code": "T2794",
    "name": "社團學習與實作－自主團隊 (C班)",
    "credits": 0,
    "category": "必",
    "teacher": "黃文智 (052***)",
    "classroom": "C  001",
    "capacity": "60",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "K",
    "time_info": "二 / 6,7",
    "department": "TNUKB.核心課程Ｋ群－日",
    "notes": "限大四未完成活動參與/執行學生修習，上課6次，上課週次請詳教學計畫表。 ◇全英語授課"
  },
  {
    "serial": "2570",
    "code": "T2637",
    "name": "社團學習與實作－入門課程 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃文智 (052***)",
    "classroom": "C  011",
    "capacity": "",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "K",
    "time_info": "四 / 9,10",
    "department": "TNUKB.核心課程Ｋ群－日",
    "notes": "本課程採人工選課，選課請洽課外活動輔導組。"
  },
  {
    "serial": "2571",
    "code": "A2928",
    "name": "文學名篇選讀：愛戀與生活 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林偉淑 (140***)",
    "classroom": "L  401",
    "capacity": "69",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "四 / 9,10",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2572",
    "code": "A2928",
    "name": "文學名篇選讀：愛戀與生活 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "謝旻琪 (125***)",
    "classroom": "L  413",
    "capacity": "69",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "L",
    "time_info": "三 / 8,9",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2573",
    "code": "A2928",
    "name": "文學名篇選讀：愛戀與生活 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "謝旻琪 (125***)",
    "classroom": "L  413",
    "capacity": "69",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "L",
    "time_info": "三 / 6,7",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2574",
    "code": "A2928",
    "name": "文學名篇選讀：愛戀與生活 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳大道 (110***)",
    "classroom": "L  205",
    "capacity": "69",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "L",
    "time_info": "一 / 9,10",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2575",
    "code": "A2928",
    "name": "文學名篇選讀：愛戀與生活 (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "洪婕寧 (152***)",
    "classroom": "Q  306",
    "capacity": "90",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "L",
    "time_info": "三 / 1,2",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇遠距非同步課程"
  },
  {
    "serial": "2576",
    "code": "A2929",
    "name": "文學名篇選讀：群己與生命 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "謝旻琪 (125***)",
    "classroom": "L  413",
    "capacity": "69",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "一 / 3,4",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2577",
    "code": "A2929",
    "name": "文學名篇選讀：群己與生命 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "孟慶延 (152***)",
    "classroom": "L  205",
    "capacity": "69",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "L",
    "time_info": "一 / 6,7",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2578",
    "code": "A2929",
    "name": "文學名篇選讀：群己與生命 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃文倩 (129***)",
    "classroom": "L  205",
    "capacity": "69",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "L",
    "time_info": "二 / 1,2",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2579",
    "code": "A2929",
    "name": "文學名篇選讀：群己與生命 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃文倩 (129***)",
    "classroom": "L  412",
    "capacity": "69",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "L",
    "time_info": "四 / 1,2",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2580",
    "code": "A2929",
    "name": "文學名篇選讀：群己與生命 (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "孟慶延 (152***)",
    "classroom": "L  205",
    "capacity": "69",
    "time_data": [
      [
        2,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "L",
    "time_info": "二 / 8,9",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2581",
    "code": "A2930",
    "name": "台灣文學選讀 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "侯如綺 (137***)",
    "classroom": "C  004",
    "capacity": "69",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "四 / 3,4",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2582",
    "code": "A2931",
    "name": "科幻小說選讀 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林淑瑩 (143***)",
    "classroom": "L  307",
    "capacity": "69",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "五 / 3,4",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2583",
    "code": "A2932",
    "name": "當代英美文學經典 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳怡芬 (119***)",
    "classroom": "T  701",
    "capacity": "69",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "五 / 3,4",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2584",
    "code": "A2932",
    "name": "當代英美文學經典 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "羅艾琳 (136***)",
    "classroom": "T  404",
    "capacity": "69",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "L",
    "time_info": "五 / 8,9",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2585",
    "code": "F1136",
    "name": "俄國文學經典入門 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "龔信賢 (146***)",
    "classroom": "L  413",
    "capacity": "69",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "五 / 1,2",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2586",
    "code": "F1137",
    "name": "法國文學、生活與文化 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "李建程 (145***)",
    "classroom": "T  110",
    "capacity": "69",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "五 / 6,7",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2587",
    "code": "F1138",
    "name": "德語文學名著選讀（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林郁嫺 (152***)",
    "classroom": "T  109",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "二 / 3,4",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": "◇以實整虛課程"
  },
  {
    "serial": "2588",
    "code": "F1139",
    "name": "法國經典文學導讀 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "廖潤珮 (135***)",
    "classroom": "L  413",
    "capacity": "69",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "四 / 6,7",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2589",
    "code": "F1140",
    "name": "西班牙語國家文學名著賞析 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "李文進 (159***)",
    "classroom": "B  516",
    "capacity": "69",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "二 / 6,7",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": "◇以實整虛課程"
  },
  {
    "serial": "2590",
    "code": "F1147",
    "name": "村上春樹講座 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "葉　夌 (152***)",
    "classroom": "T  109",
    "capacity": "69",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "四 / 6,7",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": "◇講座課程"
  },
  {
    "serial": "2591",
    "code": "T3198",
    "name": "日本近現代小說與電影 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "廖育卿 (135***)",
    "classroom": "L  308",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "三 / 3,4",
    "department": "TNULB.核心課程Ｌ群－日",
    "notes": ""
  },
  {
    "serial": "2592",
    "code": "A2938",
    "name": "臺灣劇場講座 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳慧勻 (144***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "三 / 7,8",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選 ◇講座課程"
  },
  {
    "serial": "2593",
    "code": "T0263",
    "name": "表演藝術－傳統戲曲賞析 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "翁瑋鴻 (163***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "一 / 7,8",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2594",
    "code": "T1287",
    "name": "世界名曲賞析與詮釋 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "干詠穎 (124***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "三 / 3,4",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2595",
    "code": "T1287",
    "name": "世界名曲賞析與詮釋 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "干詠穎 (124***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        3,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "M",
    "time_info": "三 / 5,6",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2596",
    "code": "T1287",
    "name": "世界名曲賞析與詮釋 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "林鄉雨 (155***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        5,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "M",
    "time_info": "五 / 5,6",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2597",
    "code": "T2016",
    "name": "造型藝術中的基礎素描技法 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "戴佳茹 (131***)",
    "classroom": "H  103",
    "capacity": "25",
    "time_data": [
      [
        2,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "二 / 5,6",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2598",
    "code": "T2016",
    "name": "造型藝術中的基礎素描技法 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "戴佳茹 (131***)",
    "classroom": "H  103",
    "capacity": "25",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "M",
    "time_info": "一 / 7,8",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2599",
    "code": "T2016",
    "name": "造型藝術中的基礎素描技法 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊春森 (145***)",
    "classroom": "H  103",
    "capacity": "25",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "M",
    "time_info": "三 / 7,8",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2600",
    "code": "T2104",
    "name": "鋼琴藝術與生活 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "李珮瑜 (117***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        4,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "四 / 5,6",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2601",
    "code": "T2105",
    "name": "音樂與藝術的對話 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "李珮瑜 (117***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "一 / 3,4",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2602",
    "code": "T2105",
    "name": "音樂與藝術的對話 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "李珮瑜 (117***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "M",
    "time_info": "二 / 3,4",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2603",
    "code": "T2105",
    "name": "音樂與藝術的對話 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "李珮瑜 (117***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "M",
    "time_info": "四 / 3,4",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2604",
    "code": "T2657",
    "name": "藝術與人生－與大師對話 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "戴佳茹 (131***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "二 / 7,8",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇講座課程"
  },
  {
    "serial": "2605",
    "code": "T2916",
    "name": "身體語言與舞蹈藝術 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳文琪 (148***)",
    "classroom": "H  103",
    "capacity": "30",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "二 / 7,8",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修。上課教室請詳教學計畫表"
  },
  {
    "serial": "2606",
    "code": "T2916",
    "name": "身體語言與舞蹈藝術 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳文琪 (148***)",
    "classroom": "H  103",
    "capacity": "30",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "M",
    "time_info": "三 / 3,4",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修。上課教室請詳教學計畫表"
  },
  {
    "serial": "2607",
    "code": "T3051",
    "name": "歐洲文化藝術行旅 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "戴佳茹 (131***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "一 / 9,10",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇遠距非同步課程"
  },
  {
    "serial": "2608",
    "code": "T3051",
    "name": "歐洲文化藝術行旅 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "戴佳茹 (131***)",
    "classroom": "B  602",
    "capacity": "69",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "M",
    "time_info": "四 / 7,8",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇遠距非同步課程"
  },
  {
    "serial": "2609",
    "code": "T3051",
    "name": "歐洲文化藝術行旅 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡秀卿 (150***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "M",
    "time_info": "五 / 7,8",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2610",
    "code": "T3052",
    "name": "新媒體藝術概論 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林俊賢 (153***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "四 / 9,10",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2611",
    "code": "T3249",
    "name": "音樂概論與數位應用 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "干詠穎 (124***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        2,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "二 / 5,6",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2612",
    "code": "T3249",
    "name": "音樂概論與數位應用 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "干詠穎 (124***)",
    "classroom": "V  101",
    "capacity": "75",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "M",
    "time_info": "五 / 3,4",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2613",
    "code": "T3269",
    "name": "世界舞蹈概論與實作 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳文琪 (148***)",
    "classroom": "H  103",
    "capacity": "30",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "四 / 7,8",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": ""
  },
  {
    "serial": "2614",
    "code": "T3288",
    "name": "表演藝術－當代舞蹈賞析與體驗 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳文琪 (148***)",
    "classroom": "H  103",
    "capacity": "30",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "四 / 3,4",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2615",
    "code": "T3289",
    "name": "表演藝術與實作 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳慧勻 (144***)",
    "classroom": "V  101",
    "capacity": "90",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "三 / 9,10",
    "department": "TNUMB.核心課程Ｍ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇遠距非同步課程"
  },
  {
    "serial": "2616",
    "code": "T0871",
    "name": "動機與壓力管理 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳玉樺 (167***)",
    "classroom": "E  304",
    "capacity": "75",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "N",
    "time_info": "一 / 6,7",
    "department": "TNUNB.核心課程Ｎ群－日",
    "notes": "轉學生及大二(含)以上凡未取得「大學學習」課程學分者，得以「學習與發展學門」課程替代。"
  },
  {
    "serial": "2617",
    "code": "T0871",
    "name": "動機與壓力管理 (B班)",
    "credits": 2,
    "category": "選",
    "teacher": "邱惟真 (146***)",
    "classroom": "E  404",
    "capacity": "75",
    "time_data": [
      [
        4,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "N",
    "time_info": "四 / 5,6",
    "department": "TNUNB.核心課程Ｎ群－日",
    "notes": "轉學生及大二(含)以上凡未取得「大學學習」課程學分者，得以「學習與發展學門」課程替代。"
  },
  {
    "serial": "2618",
    "code": "T0951",
    "name": "學習適應與管理 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "許哲修 (166***)",
    "classroom": "E  310",
    "capacity": "75",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "N",
    "time_info": "四 / 3,4",
    "department": "TNUNB.核心課程Ｎ群－日",
    "notes": "轉學生及大二(含)以上凡未取得「大學學習」課程學分者，得以「學習與發展學門」課程替代。"
  },
  {
    "serial": "2619",
    "code": "T0863",
    "name": "大學學習 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "張瓊方 (167***)",
    "classroom": "未定",
    "capacity": "175",
    "time_data": [
      [
        2,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "N",
    "time_info": "二 / 1",
    "department": "TNUNB.核心課程Ｎ群－日",
    "notes": "限轉學生及大二(含)以上。 ◇遠距非同步課程"
  },
  {
    "serial": "2620",
    "code": "E3528",
    "name": "網路與資訊科技 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "賴盛維 (154***)",
    "classroom": "B  204",
    "capacity": "70",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "O",
    "time_info": "二 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2621",
    "code": "E3528",
    "name": "網路與資訊科技 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "王元慶 (160***)",
    "classroom": "B  218",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "O",
    "time_info": "五 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2622",
    "code": "E3529",
    "name": "OFFICE證照實務 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳智揚 (130***)",
    "classroom": "B  113",
    "capacity": "120",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "O",
    "time_info": "三 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2623",
    "code": "E3529",
    "name": "OFFICE證照實務 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳智揚 (130***)",
    "classroom": "B  113",
    "capacity": "120",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "O",
    "time_info": "三 / 8,9",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2624",
    "code": "E3529",
    "name": "OFFICE證照實務 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉文琇 (145***)",
    "classroom": "B  113",
    "capacity": "115",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "O",
    "time_info": "四 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2629",
    "code": "E3861",
    "name": "Python程式語言 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "曹乃龍 (131***)",
    "classroom": "B  216",
    "capacity": "70",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "O",
    "time_info": "三 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2631",
    "code": "E3861",
    "name": "Python程式語言 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "邱普運 (169***)",
    "classroom": "B  218",
    "capacity": "70",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "O",
    "time_info": "三 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2633",
    "code": "E3861",
    "name": "Python程式語言 (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "張緒芝 (162***)",
    "classroom": "B  130",
    "capacity": "70",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "F",
    "group_type": "O",
    "time_info": "五 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2635",
    "code": "E3862",
    "name": "電腦入門與程式思維 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳映濃 (168***)",
    "classroom": "B  216",
    "capacity": "70",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "O",
    "time_info": "四 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2637",
    "code": "E3862",
    "name": "電腦入門與程式思維 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "何金新 (138***)",
    "classroom": "B  218",
    "capacity": "70",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "O",
    "time_info": "二 / 6,7",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2639",
    "code": "E4160",
    "name": "AI 與運算思維 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃仁俊 (114***)",
    "classroom": "E  309",
    "capacity": "130",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "O",
    "time_info": "一 / 3,4",
    "department": "TNUOB.核心課程Ｏ群－日",
    "notes": ""
  },
  {
    "serial": "2641",
    "code": "A2020",
    "name": "中國歷史文物賞析 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "郭鎧銘 (150***)",
    "classroom": "C  013",
    "capacity": "69",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "P",
    "time_info": "三 / 6,7",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": ""
  },
  {
    "serial": "2643",
    "code": "A2062",
    "name": "中國歷史與人物 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "談士榮 (164***)",
    "classroom": "L  205",
    "capacity": "69",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "P",
    "time_info": "一 / 1,2",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": "◇以實整虛課程"
  },
  {
    "serial": "2645",
    "code": "A2062",
    "name": "中國歷史與人物 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡忠志 (157***)",
    "classroom": "L  302",
    "capacity": "69",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "P",
    "time_info": "二 / 9,10",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": ""
  },
  {
    "serial": "2647",
    "code": "A2505",
    "name": "西洋歷史與人物 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊仲軒 (154***)",
    "classroom": "B  601",
    "capacity": "69",
    "time_data": [
      [
        1,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "P",
    "time_info": "一 / 8,9",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2658",
    "code": "T3252",
    "name": "從小說看歷史 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳景傑 (162***)",
    "classroom": "L  212",
    "capacity": "69",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "P",
    "time_info": "五 / 3,4",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修。"
  },
  {
    "serial": "2660",
    "code": "T3255",
    "name": "從藝術看歷史 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "高上雯 (114***)",
    "classroom": "S  102",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "P",
    "time_info": "三 / 3,4",
    "department": "TNUPB.核心課程Ｐ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修。"
  },
  {
    "serial": "2662",
    "code": "T0467",
    "name": "日文（一） (AA班)",
    "credits": 2,
    "category": "必",
    "teacher": "康翊軒 (158***)",
    "classroom": "E  413,T  211",
    "capacity": "55",
    "time_data": [
      [
        5,
        6,
        7
      ],
      [
        3,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "AA",
    "group_type": "QD",
    "time_info": "五 / 6,7 三 / 9",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為日文者、日文系學生皆不得選修；需繳語言實習費。"
  },
  {
    "serial": "2666",
    "code": "T0467",
    "name": "日文（一） (CA班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳宜真 (130***)",
    "classroom": "L  308,T  211",
    "capacity": "55",
    "time_data": [
      [
        2,
        8,
        9
      ],
      [
        4,
        7,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "CA",
    "group_type": "QD",
    "time_info": "二 / 8,9 四 / 7",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為日文者、日文系學生皆不得選修；需繳語言實習費。"
  },
  {
    "serial": "2668",
    "code": "T0467",
    "name": "日文（一） (DA班)",
    "credits": 2,
    "category": "必",
    "teacher": "張聖昌 (164***)",
    "classroom": "B  607,T  211",
    "capacity": "55",
    "time_data": [
      [
        4,
        8,
        9
      ],
      [
        2,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "DA",
    "group_type": "QD",
    "time_info": "四 / 8,9 二 / 9",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為日文者、日文系學生皆不得選修；需繳語言實習費。"
  },
  {
    "serial": "2670",
    "code": "T0467",
    "name": "日文（一） (EA班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃菲蓉 (141***)",
    "classroom": "L  304,T  211",
    "capacity": "55",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        4,
        6,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "EA",
    "group_type": "QD",
    "time_info": "五 / 1,2 四 / 6",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為日文者、日文系學生皆不得選修；需繳語言實習費。"
  },
  {
    "serial": "2672",
    "code": "T0467",
    "name": "日文（一） (FA班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳淑圓 (139***)",
    "classroom": "L  212,T  211",
    "capacity": "55",
    "time_data": [
      [
        5,
        1,
        2
      ],
      [
        2,
        6,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "FA",
    "group_type": "QD",
    "time_info": "五 / 1,2 二 / 6",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為日文者、日文系學生皆不得選修；需繳語言實習費。"
  },
  {
    "serial": "2674",
    "code": "T0467",
    "name": "日文（一） (GA班)",
    "credits": 2,
    "category": "必",
    "teacher": "廖兆陽 (096***)",
    "classroom": "T  704,L  104",
    "capacity": "55",
    "time_data": [
      [
        4,
        3,
        4
      ],
      [
        3,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "GA",
    "group_type": "QD",
    "time_info": "四 / 3,4 三 / 2",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為日文者、日文系學生皆不得選修；需繳語言實習費。"
  },
  {
    "serial": "2676",
    "code": "T0468",
    "name": "俄文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "律可娃柳博芙 (135***)",
    "classroom": "T  408,T  211",
    "capacity": "55",
    "time_data": [
      [
        3,
        6,
        7
      ],
      [
        1,
        6,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "QF",
    "time_info": "三 / 6,7 一 / 6",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為俄文者、俄文系學生皆不得選修；需繳語言實習費。以俄文、英文授課。 ◇全英語授課"
  },
  {
    "serial": "2690",
    "code": "A0767",
    "name": "德文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "唐岱霞 (052***)",
    "classroom": "L  413",
    "capacity": "60",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "QE",
    "time_info": "四 / 1,2",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為德文者、德文系學生皆不得選修"
  },
  {
    "serial": "2692",
    "code": "A1329",
    "name": "法文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "徐琿輝 (104***)",
    "classroom": "L  416",
    "capacity": "60",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "QE",
    "time_info": "二 / 1,2",
    "department": "TNUQB.核心課程Ｑ群－日",
    "notes": "母語為法文者、法文系學生皆不得選修 ◇雙語授課(中文/法文)"
  },
  {
    "serial": "2694",
    "code": "D0737",
    "name": "教育未來 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳思思 (157***)",
    "classroom": "I  201",
    "capacity": "69",
    "time_data": [
      [
        1,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "R",
    "time_info": "一 / 5,6",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2704",
    "code": "T1178",
    "name": "經濟未來 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "張勝雄 (140***)",
    "classroom": "B  426",
    "capacity": "69",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "R",
    "time_info": "四 / 9,10",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2705",
    "code": "T1178",
    "name": "經濟未來 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳安琪 (157***)",
    "classroom": "B  502",
    "capacity": "69",
    "time_data": [
      [
        4,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "R",
    "time_info": "四 / 5,6",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2706",
    "code": "T1178",
    "name": "經濟未來 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄧玉英 (103***)",
    "classroom": "I  201",
    "capacity": "69",
    "time_data": [
      [
        2,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "R",
    "time_info": "二 / 5,6",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2707",
    "code": "T1178",
    "name": "經濟未來 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳思思 (157***)",
    "classroom": "I  201",
    "capacity": "69",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "R",
    "time_info": "一 / 3,4",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2708",
    "code": "T1179",
    "name": "社會未來 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "彭莉惠 (141***)",
    "classroom": "B  501",
    "capacity": "69",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "R",
    "time_info": "四 / 3,4",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2709",
    "code": "T1179",
    "name": "社會未來 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "彭莉惠 (141***)",
    "classroom": "E  310",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "R",
    "time_info": "三 / 3,4",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2710",
    "code": "T1179",
    "name": "社會未來 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "彭莉惠 (141***)",
    "classroom": "E  304",
    "capacity": "69",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "R",
    "time_info": "三 / 6,7",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2711",
    "code": "T1179",
    "name": "社會未來 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉玉儀 (163***)",
    "classroom": "E  509",
    "capacity": "69",
    "time_data": [
      [
        1,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "R",
    "time_info": "一 / 8,9",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2712",
    "code": "T1179",
    "name": "社會未來 (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉玉儀 (163***)",
    "classroom": "E  304",
    "capacity": "69",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "R",
    "time_info": "三 / 8,9",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2713",
    "code": "T1179",
    "name": "社會未來 (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "林鈺惇 (170***)",
    "classroom": "E  312",
    "capacity": "69",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "F",
    "group_type": "R",
    "time_info": "五 / 3,4",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2714",
    "code": "T1179",
    "name": "社會未來 (G班)",
    "credits": 2,
    "category": "必",
    "teacher": "史城均 (161***)",
    "classroom": "I  201",
    "capacity": "69",
    "time_data": [
      [
        5,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "G",
    "group_type": "R",
    "time_info": "五 / 5,6",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2715",
    "code": "T1180",
    "name": "科技未來 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王伯昌 (077***)",
    "classroom": "C  001",
    "capacity": "69",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "R",
    "time_info": "五 / 1,2",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": ""
  },
  {
    "serial": "2716",
    "code": "T1180",
    "name": "科技未來 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳建彰 (138***)",
    "classroom": "E  307",
    "capacity": "69",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "R",
    "time_info": "一 / 6,7",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": ""
  },
  {
    "serial": "2717",
    "code": "T1180",
    "name": "科技未來 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "張朝欽 (123***)",
    "classroom": "E  405",
    "capacity": "69",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "R",
    "time_info": "二 / 9,10",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": ""
  },
  {
    "serial": "2718",
    "code": "T1180",
    "name": "科技未來 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "范素玲 (132***)",
    "classroom": "E  514",
    "capacity": "90",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "R",
    "time_info": "五 / 1,2",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "◇遠距非同步課程"
  },
  {
    "serial": "2719",
    "code": "T1208",
    "name": "政治未來 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "紀舜傑 (120***)",
    "classroom": "I  201",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "R",
    "time_info": "二 / 3,4",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": ""
  },
  {
    "serial": "2720",
    "code": "T1208",
    "name": "政治未來 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "江素慧 (129***)",
    "classroom": "I  201",
    "capacity": "69",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "R",
    "time_info": "五 / 1,2",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": ""
  },
  {
    "serial": "2721",
    "code": "T1208",
    "name": "政治未來 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "江素慧 (129***)",
    "classroom": "I  201",
    "capacity": "69",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "R",
    "time_info": "五 / 3,4",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": ""
  },
  {
    "serial": "2722",
    "code": "T2941",
    "name": "社會未來-城市未來 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "邱俊達 (160***)",
    "classroom": "ED 303",
    "capacity": "69",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "R",
    "time_info": "四 / 7,8",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇講座課程◇以實整虛課程◇雙語授課(中文/英文)"
  },
  {
    "serial": "2723",
    "code": "T3024",
    "name": "經濟未來—長壽趨勢與高齡經濟 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄧玉英 (103***)",
    "classroom": "I  201",
    "capacity": "69",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "R",
    "time_info": "四 / 7,8",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2724",
    "code": "T3254",
    "name": "社會未來－永續發展趨勢 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "涂敏芬 (140***)",
    "classroom": "B  502",
    "capacity": "69",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "R",
    "time_info": "三 / 9,10",
    "department": "TNURB.核心課程Ｒ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇講座課程◇以實整虛課程"
  },
  {
    "serial": "2725",
    "code": "M1884",
    "name": "科技社會與公民參與 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "戴政龍 (147***)",
    "classroom": "B  512",
    "capacity": "59",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "S",
    "time_info": "三 / 7,8",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2726",
    "code": "M1884",
    "name": "科技社會與公民參與 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄭光倫 (168***)",
    "classroom": "B  701",
    "capacity": "69",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "S",
    "time_info": "一 / 9,10",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "通識教育跨領域微學程課程，大學部學生均可選修 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "2727",
    "code": "M1884",
    "name": "科技社會與公民參與 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄭光倫 (168***)",
    "classroom": "B  429",
    "capacity": "69",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "S",
    "time_info": "二 / 7,8",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2728",
    "code": "T0805",
    "name": "企業與法律 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林儹紘 (168***)",
    "classroom": "B  110",
    "capacity": "69",
    "time_data": [
      [
        4,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "S",
    "time_info": "四 / 5,6",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": ""
  },
  {
    "serial": "2729",
    "code": "T0805",
    "name": "企業與法律 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "林儹紘 (168***)",
    "classroom": "B  110",
    "capacity": "90",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "S",
    "time_info": "四 / 8,9",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": ""
  },
  {
    "serial": "2730",
    "code": "T0806",
    "name": "生活與法律 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "涂予尹 (147***)",
    "classroom": "B  426",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "S",
    "time_info": "二 / 3,4",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": ""
  },
  {
    "serial": "2731",
    "code": "T0806",
    "name": "生活與法律 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃薇儒 (170***)",
    "classroom": "B  429",
    "capacity": "69",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "S",
    "time_info": "三 / 9,10",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": ""
  },
  {
    "serial": "2732",
    "code": "T0808",
    "name": "民主政治 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃琛瑜 (134***)",
    "classroom": "B  429",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "S",
    "time_info": "三 / 3,4",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2733",
    "code": "T0808",
    "name": "民主政治 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃琛瑜 (134***)",
    "classroom": "B  429",
    "capacity": "69",
    "time_data": [
      [
        3,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "S",
    "time_info": "三 / 5,6",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2734",
    "code": "T0808",
    "name": "民主政治 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "林聰吉 (092***)",
    "classroom": "B  912",
    "capacity": "69",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "S",
    "time_info": "一 / 3,4",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2735",
    "code": "T0808",
    "name": "民主政治 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "林聰吉 (092***)",
    "classroom": "B  912",
    "capacity": "69",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "S",
    "time_info": "一 / 7,8",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2736",
    "code": "T0809",
    "name": "公民社會 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "李　蓁 (169***)",
    "classroom": "B  426",
    "capacity": "69",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "S",
    "time_info": "四 / 3,4",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2737",
    "code": "T0809",
    "name": "公民社會 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "李培元 (103***)",
    "classroom": "B  508",
    "capacity": "69",
    "time_data": [
      [
        2,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "S",
    "time_info": "二 / 5,6",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2738",
    "code": "T0809",
    "name": "公民社會 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "李培元 (103***)",
    "classroom": "B  111",
    "capacity": "69",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "S",
    "time_info": "二 / 9,10",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2739",
    "code": "T0813",
    "name": "公民文化 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "安　娜 (142***)",
    "classroom": "T  110",
    "capacity": "69",
    "time_data": [
      [
        1,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "S",
    "time_info": "一 / 5,6",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2740",
    "code": "T2207",
    "name": "憲法與人權 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃奕琳 (090***)",
    "classroom": "E  412",
    "capacity": "69",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "S",
    "time_info": "四 / 1,2",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": ""
  },
  {
    "serial": "2741",
    "code": "T2207",
    "name": "憲法與人權 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "林儹紘 (168***)",
    "classroom": "B  426",
    "capacity": "69",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "S",
    "time_info": "五 / 3,4",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": ""
  },
  {
    "serial": "2742",
    "code": "T2211",
    "name": "資訊生活與法律 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "辛昀浩 (168***)",
    "classroom": "B  502",
    "capacity": "69",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "S",
    "time_info": "四 / 7,8",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "通識教育跨領域微學程課程，大學部學生均可選修 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "2743",
    "code": "T2211",
    "name": "資訊生活與法律 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "辛昀浩 (168***)",
    "classroom": "B  502",
    "capacity": "69",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "S",
    "time_info": "四 / 9,10",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2744",
    "code": "T2610",
    "name": "智慧財產權與法律 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "張浩倫 (165***)",
    "classroom": "S  104",
    "capacity": "69",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "S",
    "time_info": "五 / 6,7",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": ""
  },
  {
    "serial": "2745",
    "code": "T3181",
    "name": "社會創新 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "詹立煒 (151***)",
    "classroom": "B  429",
    "capacity": "69",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "S",
    "time_info": "三 / 1,2",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "通識教育跨領域微學程課程，大學部學生均可選修 ◇遠距非同步課程"
  },
  {
    "serial": "2746",
    "code": "T3181",
    "name": "社會創新 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "胡紹謙 (160***)",
    "classroom": "L  413",
    "capacity": "69",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "S",
    "time_info": "五 / 3,4",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2747",
    "code": "T3182",
    "name": "非營利組織與全球議題 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林岱緯 (148***)",
    "classroom": "B  426",
    "capacity": "69",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "S",
    "time_info": "二 / 1,2",
    "department": "TNUSB.核心課程Ｓ群－日",
    "notes": "通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2748",
    "code": "T0536",
    "name": "世界人權問題 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林　立 (105***)",
    "classroom": "L  201",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "二 / 3,4",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2749",
    "code": "T0831",
    "name": "國際現勢 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "崔　琳 (128***)",
    "classroom": "E  413",
    "capacity": "69",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "三 / 8,9",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2750",
    "code": "T0831",
    "name": "國際現勢 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "林筱甄 (167***)",
    "classroom": "E  413",
    "capacity": "69",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "T",
    "time_info": "四 / 8,9",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2751",
    "code": "T0831",
    "name": "國際現勢 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "林筱甄 (167***)",
    "classroom": "L  308",
    "capacity": "69",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "T",
    "time_info": "二 / 1,2",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2752",
    "code": "T0831",
    "name": "國際現勢 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "林筱甄 (167***)",
    "classroom": "Q  409",
    "capacity": "69",
    "time_data": [
      [
        2,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "T",
    "time_info": "二 / 8,9",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2753",
    "code": "T0831",
    "name": "國際現勢 (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "徐浤馨 (131***)",
    "classroom": "B  429",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "T",
    "time_info": "二 / 3,4",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2754",
    "code": "T0831",
    "name": "國際現勢 (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "徐浤馨 (131***)",
    "classroom": "T  310",
    "capacity": "69",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "F",
    "group_type": "T",
    "time_info": "一 / 3,4",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": "◇遠距非同步課程"
  },
  {
    "serial": "2755",
    "code": "T0831",
    "name": "國際現勢 (G班)",
    "credits": 2,
    "category": "必",
    "teacher": "崔　琳 (128***)",
    "classroom": "E  413",
    "capacity": "69",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "G",
    "group_type": "T",
    "time_info": "三 / 6,7",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2756",
    "code": "T0834",
    "name": "歐洲聯盟與歐洲統合 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "張福昌 (128***)",
    "classroom": "T  109",
    "capacity": "69",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "四 / 3,4",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2757",
    "code": "T0835",
    "name": "文化全球化 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林　立 (105***)",
    "classroom": "L  201",
    "capacity": "69",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "二 / 1,2",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2758",
    "code": "T0837",
    "name": "東亞與世界 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "徐浤馨 (131***)",
    "classroom": "B  617",
    "capacity": "69",
    "time_data": [
      [
        1,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "一 / 8,9",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2759",
    "code": "T0838",
    "name": "全球體系與兩岸關係 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "馬準威 (159***)",
    "classroom": "T  701",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "三 / 3,4",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2760",
    "code": "T0838",
    "name": "全球體系與兩岸關係 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "胡慶山 (112***)",
    "classroom": "T  605",
    "capacity": "69",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "T",
    "time_info": "五 / 6,7",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2761",
    "code": "T0838",
    "name": "全球體系與兩岸關係 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "胡慶山 (112***)",
    "classroom": "T  601",
    "capacity": "69",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "T",
    "time_info": "五 / 8,9",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2762",
    "code": "T0838",
    "name": "全球體系與兩岸關係 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "洪耀南 (158***)",
    "classroom": "B  501",
    "capacity": "69",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "T",
    "time_info": "二 / 6,7",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2763",
    "code": "T0839",
    "name": "經濟全球化 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "宮國威 (100***)",
    "classroom": "E  409",
    "capacity": "69",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "三 / 9,10",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2764",
    "code": "T0839",
    "name": "經濟全球化 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳逸青 (157***)",
    "classroom": "T  311",
    "capacity": "69",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "T",
    "time_info": "一 / 3,4",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2765",
    "code": "T0839",
    "name": "經濟全球化 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳逸青 (157***)",
    "classroom": "L  307",
    "capacity": "69",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "T",
    "time_info": "一 / 6,7",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2766",
    "code": "T0839",
    "name": "經濟全球化 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡錫勲 (114***)",
    "classroom": "B  508",
    "capacity": "69",
    "time_data": [
      [
        1,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "T",
    "time_info": "一 / 8,9",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2767",
    "code": "T0839",
    "name": "經濟全球化 (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "小山直則 (135***)",
    "classroom": "E  508",
    "capacity": "69",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "T",
    "time_info": "三 / 6,7",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2768",
    "code": "T0839",
    "name": "經濟全球化 (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "小山直則 (135***)",
    "classroom": "E  411",
    "capacity": "69",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "F",
    "group_type": "T",
    "time_info": "四 / 6,7",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2769",
    "code": "T0840",
    "name": "美洲現勢 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "宮國威 (100***)",
    "classroom": "C  013",
    "capacity": "69",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "二 / 7,8",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2770",
    "code": "T0840",
    "name": "美洲現勢 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "宮國威 (100***)",
    "classroom": "T  701",
    "capacity": "69",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "T",
    "time_info": "一 / 9,10",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2771",
    "code": "T0840",
    "name": "美洲現勢 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃富娟 (148***)",
    "classroom": "T  212",
    "capacity": "69",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "T",
    "time_info": "一 / 6,7",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2772",
    "code": "T0840",
    "name": "美洲現勢 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃富娟 (148***)",
    "classroom": "T  404",
    "capacity": "90",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "T",
    "time_info": "四 / 3,4",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2773",
    "code": "T3292",
    "name": "歐盟治理與決策 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "卓忠宏 (114***)",
    "classroom": "T  310",
    "capacity": "69",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "T",
    "time_info": "三 / 8,9",
    "department": "TNUTB.核心課程Ｔ群－日",
    "notes": ""
  },
  {
    "serial": "2774",
    "code": "S0358",
    "name": "物理與生活 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "莊程豪 (142***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "五 / 1,2",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2775",
    "code": "S0358",
    "name": "物理與生活 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "李中傑 (101***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "U",
    "time_info": "四 / 1,2",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2776",
    "code": "S0362",
    "name": "宇宙的探索 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "秦一男 (114***)",
    "classroom": "S  104",
    "capacity": "69",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "四 / 9,10",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "為維持通識課程基本精神，物理系同學請勿選修本課程。"
  },
  {
    "serial": "2777",
    "code": "S0362",
    "name": "宇宙的探索 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "王尚勇 (125***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "U",
    "time_info": "三 / 3,4",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "2778",
    "code": "S0362",
    "name": "宇宙的探索 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "王尚勇 (125***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "U",
    "time_info": "四 / 3,4",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2779",
    "code": "S0362",
    "name": "宇宙的探索 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "曹慶堂 (090***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "U",
    "time_info": "二 / 3,4",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2780",
    "code": "S0368",
    "name": "化學與生活：化學、環境與社會 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "李世元 (062***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "三 / 6,7",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2781",
    "code": "S0368",
    "name": "化學與生活：化學、環境與社會 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "丁北辰 (107***)",
    "classroom": "C  013",
    "capacity": "90",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "U",
    "time_info": "五 / 6,7",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2782",
    "code": "S0369",
    "name": "化學與生活：化學、醫藥與社會 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "謝仁傑 (138***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "二 / 9,10",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2783",
    "code": "S0377",
    "name": "生命科學：人體的奧秘 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳銘凱 (121***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "二 / 1,2",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2784",
    "code": "S0738",
    "name": "生活中的化學 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王奕翔 (168***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "三 / 8,9",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "2785",
    "code": "S0738",
    "name": "生活中的化學 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "高憲章 (158***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        1,
        4,
        5
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "U",
    "time_info": "一 / 4,5",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2786",
    "code": "S0738",
    "name": "生活中的化學 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄧金培 (130***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "U",
    "time_info": "五 / 6,7",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2787",
    "code": "S0747",
    "name": "數學漫遊 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "潘志實 (132***)",
    "classroom": "H  111",
    "capacity": "61",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "二 / 3,4",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2788",
    "code": "S0747",
    "name": "數學漫遊 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "王千真 (142***)",
    "classroom": "H  112",
    "capacity": "61",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "U",
    "time_info": "二 / 3,4",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2789",
    "code": "S0747",
    "name": "數學漫遊 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "徐祥峻 (153***)",
    "classroom": "H  113",
    "capacity": "61",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "U",
    "time_info": "二 / 3,4",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2790",
    "code": "T0275",
    "name": "師法自然—自然中那些老師沒有教的 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "范義彬 (165***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "一 / 6,7",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2791",
    "code": "T2166",
    "name": "科學之旅 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "秦一男 (114***)",
    "classroom": "S  104",
    "capacity": "69",
    "time_data": [
      [
        2,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "二 / 8,9",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "為維持通識課程基本精神，物理系同學請勿選修本課程。"
  },
  {
    "serial": "2792",
    "code": "T2166",
    "name": "科學之旅 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳樫旭 (150***)",
    "classroom": "C  004",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "U",
    "time_info": "二 / 3,4",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2793",
    "code": "T2166",
    "name": "科學之旅 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "王孝祖 (162***)",
    "classroom": "C  001",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "U",
    "time_info": "三 / 3,4",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2794",
    "code": "T2167",
    "name": "化學與生活：化學、食品與社會 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃家琪 (158***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "四 / 6,7",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2795",
    "code": "T2167",
    "name": "化學與生活：化學、食品與社會 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "謝忠宏 (144***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "U",
    "time_info": "五 / 8,9",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2796",
    "code": "T2167",
    "name": "化學與生活：化學、食品與社會 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "王三郎 (121***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        1,
        2,
        3
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "U",
    "time_info": "一 / 2,3",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2797",
    "code": "T2973",
    "name": "統計與生活 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "姜　杰 (159***)",
    "classroom": "S  215",
    "capacity": "69",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "一 / 9,10",
    "department": "TNUUB.核心課程Ｕ群－日",
    "notes": ""
  },
  {
    "serial": "2798",
    "code": "T0100",
    "name": "哲學概論 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王志銘 (100***)",
    "classroom": "O  306",
    "capacity": "69",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "一 / 9,10",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2799",
    "code": "T0100",
    "name": "哲學概論 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "王志銘 (100***)",
    "classroom": "L  201",
    "capacity": "69",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "V",
    "time_info": "二 / 7,8",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2800",
    "code": "T0100",
    "name": "哲學概論 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "林　立 (105***)",
    "classroom": "T  110",
    "capacity": "69",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "V",
    "time_info": "五 / 1,2",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2801",
    "code": "T0100",
    "name": "哲學概論 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "李志成 (163***)",
    "classroom": "B  508",
    "capacity": "69",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "V",
    "time_info": "二 / 9,10",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2802",
    "code": "T0338",
    "name": "哲學經典導讀 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "蘇富芝 (136***)",
    "classroom": "L  413",
    "capacity": "69",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "三 / 1,2",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "2803",
    "code": "T0338",
    "name": "哲學經典導讀 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "蘇富芝 (136***)",
    "classroom": "L  413",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "V",
    "time_info": "三 / 3,4",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "2804",
    "code": "T0338",
    "name": "哲學經典導讀 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄭合修 (163***)",
    "classroom": "L  201",
    "capacity": "90",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "V",
    "time_info": "三 / 1,2",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "2805",
    "code": "T0339",
    "name": "宗教概論 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉韋廷 (163***)",
    "classroom": "B  502",
    "capacity": "59",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "三 / 7,8",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2806",
    "code": "T0348",
    "name": "生死學 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄭鈞瑋 (137***)",
    "classroom": "B  609",
    "capacity": "69",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "五 / 3,4",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "2807",
    "code": "T0348",
    "name": "生死學 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "鄭鈞瑋 (137***)",
    "classroom": "C  002",
    "capacity": "69",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "V",
    "time_info": "五 / 6,7",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "2808",
    "code": "T1238",
    "name": "環境倫理 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "徐佐銘 (101***)",
    "classroom": "B  429",
    "capacity": "69",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "四 / 3,4",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "◇遠距非同步課程"
  },
  {
    "serial": "2809",
    "code": "T1810",
    "name": "職業倫理 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林宸安 (158***)",
    "classroom": "B  608",
    "capacity": "69",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "四 / 9,10",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2810",
    "code": "T2917",
    "name": "邏輯與哲學 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊濟鶴 (152***)",
    "classroom": "L  413",
    "capacity": "69",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "二 / 1,2",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2811",
    "code": "T2917",
    "name": "邏輯與哲學 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "林怡仲 (163***)",
    "classroom": "B  708",
    "capacity": "69",
    "time_data": [
      [
        1,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "V",
    "time_info": "一 / 5,6",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2812",
    "code": "T2919",
    "name": "美學－理論與實務 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王志銘 (100***)",
    "classroom": "O  306",
    "capacity": "69",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "一 / 7,8",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "2813",
    "code": "T2919",
    "name": "美學－理論與實務 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "王志銘 (100***)",
    "classroom": "L  201",
    "capacity": "69",
    "time_data": [
      [
        2,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "V",
    "time_info": "二 / 5,6",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "2814",
    "code": "T2919",
    "name": "美學－理論與實務 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "洪雨婷 (155***)",
    "classroom": "L  401",
    "capacity": "69",
    "time_data": [
      [
        5,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "V",
    "time_info": "五 / 5,6",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2815",
    "code": "T2971",
    "name": "台灣宗教 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉韋廷 (163***)",
    "classroom": "B  602",
    "capacity": "69",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "三 / 9,10",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇專業知能服務學習課程"
  },
  {
    "serial": "2816",
    "code": "T3184",
    "name": "哲學與人工智慧 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林宸安 (158***)",
    "classroom": "B  426",
    "capacity": "69",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "四 / 7,8",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2817",
    "code": "T3184",
    "name": "哲學與人工智慧 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "林宸安 (158***)",
    "classroom": "E  513",
    "capacity": "69",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "V",
    "time_info": "五 / 7,8",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2818",
    "code": "A1636",
    "name": "人際關係與溝通 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "胡延薇 (083***)",
    "classroom": "E  307",
    "capacity": "69",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "二 / 9,10",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2819",
    "code": "D0425",
    "name": "正向心理學 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "宋鴻燕 (110***)",
    "classroom": "E  412",
    "capacity": "69",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "四 / 7,8",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程,大學部學生均可選修 ◇遠距非同步課程"
  },
  {
    "serial": "2820",
    "code": "D0425",
    "name": "正向心理學 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "胡延薇, 徐佐銘(083***,101***)",
    "classroom": "E  404",
    "capacity": "69",
    "time_data": [
      [
        4,
        9,
        9
      ],
      [
        4,
        10,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "W",
    "time_info": "四 / 9 四 / 10",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程,大學部學生均可選修"
  },
  {
    "serial": "2821",
    "code": "D0425",
    "name": "正向心理學 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "張菀珍 (170***)",
    "classroom": "B  516",
    "capacity": "69",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "W",
    "time_info": "二 / 9,10",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2822",
    "code": "T0013",
    "name": "人格心理學 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "韓貴香 (129***)",
    "classroom": "B  501",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "二 / 3,4",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "◇以實整虛課程"
  },
  {
    "serial": "2823",
    "code": "T0066",
    "name": "社會心理學 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "韓貴香 (129***)",
    "classroom": "B  501",
    "capacity": "69",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "一 / 3,4",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": ""
  },
  {
    "serial": "2824",
    "code": "T0066",
    "name": "社會心理學 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "韓貴香 (129***)",
    "classroom": "B  501",
    "capacity": "69",
    "time_data": [
      [
        1,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "W",
    "time_info": "一 / 7,8",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": ""
  },
  {
    "serial": "2825",
    "code": "T0169",
    "name": "人權與社會正義 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃奕琳 (090***)",
    "classroom": "E  412",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "三 / 3,4",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2826",
    "code": "T0169",
    "name": "人權與社會正義 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃奕琳 (090***)",
    "classroom": "E  310",
    "capacity": "69",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "W",
    "time_info": "四 / 9,10",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2827",
    "code": "T1822",
    "name": "心理學導論 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "韓貴香 (129***)",
    "classroom": "B  506",
    "capacity": "90",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "三 / 1,2",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程,大學部學生均可選修 ◇遠距非同步課程"
  },
  {
    "serial": "2828",
    "code": "T1822",
    "name": "心理學導論 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "胡延薇 (083***)",
    "classroom": "E  412",
    "capacity": "69",
    "time_data": [
      [
        3,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "W",
    "time_info": "三 / 5,6",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程,大學部學生均可選修"
  },
  {
    "serial": "2829",
    "code": "T1822",
    "name": "心理學導論 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "胡延薇 (083***)",
    "classroom": "E  304",
    "capacity": "69",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "W",
    "time_info": "四 / 3,4",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程,大學部學生均可選修"
  },
  {
    "serial": "2830",
    "code": "T1822",
    "name": "心理學導論 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "胡延薇 (083***)",
    "classroom": "E  412",
    "capacity": "69",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "W",
    "time_info": "三 / 7,8",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程,大學部學生均可選修"
  },
  {
    "serial": "2831",
    "code": "T1832",
    "name": "社會學導論 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "宮國威 (100***)",
    "classroom": "T  404",
    "capacity": "69",
    "time_data": [
      [
        1,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "一 / 5,6",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2832",
    "code": "T1832",
    "name": "社會學導論 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉玉儀 (163***)",
    "classroom": "E  310",
    "capacity": "69",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "W",
    "time_info": "一 / 3,4",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2833",
    "code": "T1832",
    "name": "社會學導論 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "史城均 (161***)",
    "classroom": "T  401",
    "capacity": "69",
    "time_data": [
      [
        5,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "W",
    "time_info": "五 / 7,8",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2834",
    "code": "T1832",
    "name": "社會學導論 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃佳媛 (165***)",
    "classroom": "L  302",
    "capacity": "69",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "W",
    "time_info": "三 / 1,2",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2835",
    "code": "T1891",
    "name": "政治學概論 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃奕琳 (090***)",
    "classroom": "E  304",
    "capacity": "69",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "二 / 1,2",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "◇以實整虛課程"
  },
  {
    "serial": "2836",
    "code": "T1891",
    "name": "政治學概論 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃奕琳 (090***)",
    "classroom": "E  304",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "W",
    "time_info": "二 / 3,4",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": ""
  },
  {
    "serial": "2837",
    "code": "T1891",
    "name": "政治學概論 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃奕琳 (090***)",
    "classroom": "E  412",
    "capacity": "69",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "W",
    "time_info": "三 / 9,10",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": ""
  },
  {
    "serial": "2838",
    "code": "T2882",
    "name": "生活與財經 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "曾威智 (146***)",
    "classroom": "B  614",
    "capacity": "69",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "五 / 3,4",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2839",
    "code": "T2944",
    "name": "性別與社會 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "蔡政霖 (169***)",
    "classroom": "B  429",
    "capacity": "69",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "一 / 9,10",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程,大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2840",
    "code": "T2944",
    "name": "性別與社會 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳賢寶 (170***)",
    "classroom": "E  312",
    "capacity": "69",
    "time_data": [
      [
        3,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "W",
    "time_info": "三 / 1,2",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程,大學部學生均可選修"
  },
  {
    "serial": "2841",
    "code": "T3047",
    "name": "幸福的理性與感性 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "胡延薇, 曾威智(083***,146***)",
    "classroom": "L  302",
    "capacity": "69",
    "time_data": [
      [
        2,
        5,
        5
      ],
      [
        2,
        6,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "二 / 5 二 / 6",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程,大學部學生均可選修"
  },
  {
    "serial": "2842",
    "code": "T3047",
    "name": "幸福的理性與感性 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "胡延薇, 曾威智(083***,146***)",
    "classroom": "L  302",
    "capacity": "69",
    "time_data": [
      [
        2,
        7,
        7
      ],
      [
        2,
        8,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "W",
    "time_info": "二 / 7 二 / 8",
    "department": "TNUWB.核心課程Ｗ群－日",
    "notes": "本科目為通識教育跨領域微學程課程,大學部學生均可選修"
  },
  {
    "serial": "2843",
    "code": "A1376",
    "name": "中國語文能力表達 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "孔令宜 (140***)",
    "classroom": "L  212",
    "capacity": "",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TNUXB.校共通課程－日",
    "notes": "限本校外籍生、僑生選修。不開放選課，選課請至國際處(T1001)辦理。 ◇全英語授課"
  },
  {
    "serial": "2844",
    "code": "T0645",
    "name": "森林生態與樹木保護 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "蕭文偉 (133***)",
    "classroom": "B  713",
    "capacity": "260",
    "time_data": [
      [
        1,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 5,6",
    "department": "TNUXB.校共通課程－日",
    "notes": "◇專業知能服務學習課程"
  },
  {
    "serial": "2845",
    "code": "T1923",
    "name": "志工精神與社會服務 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳建甫 (106***)",
    "classroom": "B  604",
    "capacity": "175",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 6,7",
    "department": "TNUXB.校共通課程－日",
    "notes": "◇專業知能服務學習課程"
  },
  {
    "serial": "2846",
    "code": "T2903",
    "name": "運動志工精神與服務 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "黃貴樹 (138***)",
    "classroom": "B  713",
    "capacity": "220",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 9,10",
    "department": "TNUXB.校共通課程－日",
    "notes": "◇專業知能服務學習課程"
  },
  {
    "serial": "2847",
    "code": "T2988",
    "name": "山野活動與環境探索 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "黃谷臣 (091***)",
    "classroom": "H  101",
    "capacity": "30",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TNUXB.校共通課程－日",
    "notes": ""
  },
  {
    "serial": "2849",
    "code": "T3268",
    "name": "ＡＩ素養與數位民主 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "黃子嘉, 王千文(142***,157***)",
    "classroom": "B  120",
    "capacity": "70",
    "time_data": [
      [
        1,
        7,
        7
      ],
      [
        1,
        8,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 7 一 / 8",
    "department": "TNUXB.校共通課程－日",
    "notes": "◇遠距非同步課程"
  },
  {
    "serial": "2850",
    "code": "T3294",
    "name": "永續人生：無限大的旅程 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "林健祥 (169***)",
    "classroom": "Q  409",
    "capacity": "175",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TNUXB.校共通課程－日",
    "notes": ""
  },
  {
    "serial": "2852",
    "code": "U1003",
    "name": "全民國防教育軍事訓練（二）－國際情勢 (A班)",
    "credits": 1,
    "category": "選",
    "teacher": "虢恕仁 (168***)",
    "classroom": "B  616",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TNUYB.全民國防（二）日",
    "notes": "全民國防教育軍事訓練(二)選修課程不列入畢業學分數。"
  },
  {
    "serial": "2853",
    "code": "U1004",
    "name": "全民國防教育軍事訓練（二）－防衛動員 (A班)",
    "credits": 1,
    "category": "選",
    "teacher": "林穎佑 (154***)",
    "classroom": "E  304",
    "capacity": "70",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TNUYB.全民國防（二）日",
    "notes": "全民國防教育軍事訓練(二)選修課程不列入畢業學分數。 ◇全英語授課"
  },
  {
    "serial": "2854",
    "code": "U1004",
    "name": "全民國防教育軍事訓練（二）－防衛動員 (B班)",
    "credits": 1,
    "category": "選",
    "teacher": "邱松嵐 (155***)",
    "classroom": "B  312",
    "capacity": "70",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TNUYB.全民國防（二）日",
    "notes": "全民國防教育軍事訓練(二)選修課程不列入畢業學分數。"
  },
  {
    "serial": "2855",
    "code": "U1004",
    "name": "全民國防教育軍事訓練（二）－防衛動員 (C班)",
    "credits": 1,
    "category": "選",
    "teacher": "鄭惠文 (099***)",
    "classroom": "C  002",
    "capacity": "70",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TNUYB.全民國防（二）日",
    "notes": "全民國防教育軍事訓練(二)選修課程不列入畢業學分數。"
  },
  {
    "serial": "2856",
    "code": "U1004",
    "name": "全民國防教育軍事訓練（二）－防衛動員 (D班)",
    "credits": 1,
    "category": "選",
    "teacher": "鄭惠文 (099***)",
    "classroom": "B  515",
    "capacity": "70",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "",
    "time_info": "三 / 3,4",
    "department": "TNUYB.全民國防（二）日",
    "notes": "全民國防教育軍事訓練(二)選修課程不列入畢業學分數。"
  },
  {
    "serial": "2857",
    "code": "U1005",
    "name": "全民國防教育軍事訓練（二）－全民國防 (A班)",
    "credits": 1,
    "category": "選",
    "teacher": "蔡志遠 (167***)",
    "classroom": "B  111",
    "capacity": "70",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TNUYB.全民國防（二）日",
    "notes": "全民國防教育軍事訓練(二)選修課程不列入畢業學分數。"
  },
  {
    "serial": "2858",
    "code": "U1008",
    "name": "全民國防教育軍事訓練（二）－國防政策 (A班)",
    "credits": 1,
    "category": "選",
    "teacher": "林靖棠 (167***)",
    "classroom": "C  001",
    "capacity": "70",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TNUYB.全民國防（二）日",
    "notes": "全民國防教育軍事訓練(二)選修課程不列入畢業學分數。"
  },
  {
    "serial": "2859",
    "code": "S0920",
    "name": "地球生態環境 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "秦一男 (114***)",
    "classroom": "S  104",
    "capacity": "69",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "Z",
    "time_info": "四 / 6,7",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": "為維持通識課程基本精神,物理系同學請勿選修本課程。本科目為通識教育跨領域微學程課程,大學部學生均可選修"
  },
  {
    "serial": "2860",
    "code": "S0920",
    "name": "地球生態環境 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "林大欽 (110***)",
    "classroom": "C  001",
    "capacity": "69",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "Z",
    "time_info": "四 / 8,9",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2861",
    "code": "S0920",
    "name": "地球生態環境 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "李英豪 (094***)",
    "classroom": "E  509",
    "capacity": "69",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "Z",
    "time_info": "三 / 6,7",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2862",
    "code": "S0920",
    "name": "地球生態環境 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "范素玲 (132***)",
    "classroom": "E  514",
    "capacity": "69",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "Z",
    "time_info": "五 / 3,4",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇遠距非同步課程◇全英語授課"
  },
  {
    "serial": "2863",
    "code": "S0920",
    "name": "地球生態環境 (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃大肯 (160***)",
    "classroom": "E  515",
    "capacity": "69",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "Z",
    "time_info": "五 / 3,4",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇雙語授課(中文/英文)"
  },
  {
    "serial": "2864",
    "code": "S0922",
    "name": "能源與材料科技 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王奕翔 (168***)",
    "classroom": "C  004",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "Z",
    "time_info": "三 / 3,4",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2865",
    "code": "S0922",
    "name": "能源與材料科技 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "顏子評 (170***)",
    "classroom": "B  312",
    "capacity": "69",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "Z",
    "time_info": "一 / 3,4",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2866",
    "code": "S0922",
    "name": "能源與材料科技 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "余宣賦 (062***)",
    "classroom": "B  608",
    "capacity": "69",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "Z",
    "time_info": "四 / 3,4",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2867",
    "code": "S0922",
    "name": "能源與材料科技 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "黃招財 (148***)",
    "classroom": "B  501",
    "capacity": "69",
    "time_data": [
      [
        2,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "Z",
    "time_info": "二 / 8,9",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2868",
    "code": "S0922",
    "name": "能源與材料科技 (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "牛仰堯 (142***)",
    "classroom": "E  508",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "Z",
    "time_info": "三 / 3,4",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2869",
    "code": "S0922",
    "name": "能源與材料科技 (F班)",
    "credits": 2,
    "category": "必",
    "teacher": "歐陽寬 (157***)",
    "classroom": "E  509",
    "capacity": "69",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "F",
    "group_type": "Z",
    "time_info": "三 / 8,9",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2870",
    "code": "S0923",
    "name": "電子與電腦科技 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊智旭 (096***)",
    "classroom": "E  416",
    "capacity": "69",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "Z",
    "time_info": "三 / 8,9",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2871",
    "code": "S0923",
    "name": "電子與電腦科技 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "衛信文 (141***)",
    "classroom": "E  515",
    "capacity": "69",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "Z",
    "time_info": "三 / 6,7",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2872",
    "code": "S0923",
    "name": "電子與電腦科技 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "饒建奇 (116***)",
    "classroom": "E  409",
    "capacity": "69",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "Z",
    "time_info": "二 / 6,7",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2873",
    "code": "S0924",
    "name": "海洋科技 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊龍杰 (096***)",
    "classroom": "E  307",
    "capacity": "69",
    "time_data": [
      [
        5,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "Z",
    "time_info": "五 / 9,10",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": "◇遠距非同步課程"
  },
  {
    "serial": "2874",
    "code": "S0925",
    "name": "科技永續 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "馬述聖 (160***)",
    "classroom": "E  405",
    "capacity": "69",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "Z",
    "time_info": "二 / 1,2",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "2875",
    "code": "S0926",
    "name": "智慧綠生活 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "姚忠達 (110***)",
    "classroom": "E  508",
    "capacity": "90",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "Z",
    "time_info": "四 / 1,2",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2876",
    "code": "S0926",
    "name": "智慧綠生活 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "姚忠達 (110***)",
    "classroom": "E  508",
    "capacity": "69",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "Z",
    "time_info": "四 / 8,9",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修 ◇全英語授課"
  },
  {
    "serial": "2877",
    "code": "S0927",
    "name": "科技進化 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "李明憲 (083***)",
    "classroom": "S  103",
    "capacity": "69",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "Z",
    "time_info": "一 / 6,7",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2878",
    "code": "S0927",
    "name": "科技進化 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "李明憲 (083***)",
    "classroom": "S  420",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "Z",
    "time_info": "二 / 3,4",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2879",
    "code": "S0927",
    "name": "科技進化 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "周厚文 (083***)",
    "classroom": "S  420",
    "capacity": "69",
    "time_data": [
      [
        5,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "Z",
    "time_info": "五 / 9,10",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2880",
    "code": "S0927",
    "name": "科技進化 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "王奕翔 (168***)",
    "classroom": "S  420",
    "capacity": "69",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "Z",
    "time_info": "四 / 3,4",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2881",
    "code": "S0927",
    "name": "科技進化 (E班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳惇凱 (134***)",
    "classroom": "E  813",
    "capacity": "69",
    "time_data": [
      [
        5,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "E",
    "group_type": "Z",
    "time_info": "五 / 8,9",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": "◇全英語授課"
  },
  {
    "serial": "2882",
    "code": "S0928",
    "name": "智慧機器人 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "李彥霆 (167***)",
    "classroom": "E  236",
    "capacity": "65",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "Z",
    "time_info": "四 / 3,4",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2883",
    "code": "S0928",
    "name": "智慧機器人 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "何政昌 (157***)",
    "classroom": "B  507",
    "capacity": "69",
    "time_data": [
      [
        2,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "Z",
    "time_info": "二 / 8,9",
    "department": "TNUZB.核心課程Ｚ群－日",
    "notes": ""
  },
  {
    "serial": "2888",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王慧娟 (119***)",
    "classroom": "T  404",
    "capacity": "70",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TRBXB.觀光系（日）",
    "notes": "限全英語專班學生 ◇全英語授課"
  },
  {
    "serial": "2891",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "張雅慧 (126***)",
    "classroom": "T  605",
    "capacity": "70",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "QG",
    "time_info": "四 / 9,10",
    "department": "TRBXB.觀光系（日）",
    "notes": "限全英語專班。學生加選請依英文系網頁＞最新消息＞通識外語學門公告辦理。 ◇全英語授課"
  },
  {
    "serial": "2915",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "張慈珊 (125***)",
    "classroom": "T  401",
    "capacity": "80",
    "time_data": [
      [
        1,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 3,4",
    "department": "TRDXB.外交系（日）",
    "notes": "限全英語專班學生 ◇全英語授課"
  },
  {
    "serial": "2918",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "喬　治 (159***)",
    "classroom": "T  701",
    "capacity": "70",
    "time_data": [
      [
        5,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "QG",
    "time_info": "五 / 1,2",
    "department": "TRDXB.外交系（日）",
    "notes": "限全英語專班學生 ◇全英語授課"
  },
  {
    "serial": "2950",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "馬天樂 (161***)",
    "classroom": "T  704",
    "capacity": "80",
    "time_data": [
      [
        2,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 1,2",
    "department": "TRJXB.政經系（日）",
    "notes": "限全英語專班學生 ◇全英語授課"
  },
  {
    "serial": "2953",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "雷　凱 (141***)",
    "classroom": "T  601",
    "capacity": "70",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "QG",
    "time_info": "三 / 6,7",
    "department": "TRJXB.政經系（日）",
    "notes": "◇全英語授課"
  },
  {
    "serial": "3167",
    "code": "T9871",
    "name": "男、女生體育－有氧舞蹈興趣班 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "郭馥滋 (143***)",
    "classroom": "SG 246",
    "capacity": "30",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TGUPB.體育興趣選項－日",
    "notes": "體育館SG246舞蹈室，本學期課程將進行青銀共學，邀請社區長輩進班共同上課，歡迎有興趣者於第一週到課了解"
  },
  {
    "serial": "3169",
    "code": "E4392",
    "name": "人工智慧倫理 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "甘偵蓉 (996***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        2,
        8,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 8,9,10",
    "department": "TGAXB.文學院共同科－日",
    "notes": "遠距收播【TAICA課程】，請至https://taicatw.net/spring-114/網頁查詢上課方式。 ◇遠距收播外校課程"
  },
  {
    "serial": "3176",
    "code": "A0888",
    "name": "女性文學 (P班)",
    "credits": 2,
    "category": "選",
    "teacher": "熊婷惠 (154***)",
    "classroom": "E  308",
    "capacity": "80",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "P",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TFLXB.英文系（日）",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "3177",
    "code": "T0339",
    "name": "宗教概論 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉韋廷 (163***)",
    "classroom": "E  405",
    "capacity": "69",
    "time_data": [
      [
        2,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "V",
    "time_info": "二 / 5,6",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "3178",
    "code": "T0348",
    "name": "生死學 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊濟鶴 (152***)",
    "classroom": "B  607",
    "capacity": "69",
    "time_data": [
      [
        3,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "V",
    "time_info": "三 / 5,6",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "3179",
    "code": "T0348",
    "name": "生死學 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊濟鶴 (152***)",
    "classroom": "B  601",
    "capacity": "69",
    "time_data": [
      [
        1,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "V",
    "time_info": "一 / 1,2",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "3180",
    "code": "T2917",
    "name": "邏輯與哲學 (C班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊濟鶴 (152***)",
    "classroom": "L  307",
    "capacity": "69",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "V",
    "time_info": "二 / 3,4",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "3181",
    "code": "T2917",
    "name": "邏輯與哲學 (D班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊濟鶴 (152***)",
    "classroom": "B  516",
    "capacity": "69",
    "time_data": [
      [
        3,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "V",
    "time_info": "三 / 3,4",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": ""
  },
  {
    "serial": "3182",
    "code": "T2971",
    "name": "台灣宗教 (B班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉韋廷 (163***)",
    "classroom": "E  515",
    "capacity": "69",
    "time_data": [
      [
        4,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "V",
    "time_info": "四 / 9,10",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "3183",
    "code": "T3253",
    "name": "宗教與療癒 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "劉韋廷 (163***)",
    "classroom": "B  608",
    "capacity": "69",
    "time_data": [
      [
        1,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "V",
    "time_info": "一 / 9,10",
    "department": "TNUVB.核心課程Ｖ群－日",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "3232",
    "code": "X0001",
    "name": "英語能力檢定 (A班)",
    "credits": 0,
    "category": "選",
    "teacher": "(***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "/",
    "department": "TGFXB.外語學院共同科日",
    "notes": "限延修生已修足畢業學分，僅未通過外語檢定畢業門檻者修習(請至註課中心辦理選課)。"
  },
  {
    "serial": "6006",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "瞿聖強 (124***)",
    "classroom": "D  311",
    "capacity": "40",
    "time_data": [
      [
        5,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 11,12",
    "department": "TEIXE.資工系（進學）",
    "notes": "台北校園上課"
  },
  {
    "serial": "6007",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "應漢斌 (099***)",
    "classroom": "E  414",
    "capacity": "70",
    "time_data": [
      [
        5,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 11,12",
    "department": "TEIXE.資工系（進學）",
    "notes": ""
  },
  {
    "serial": "6033",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "白書綾 (153***)",
    "classroom": "D  316",
    "capacity": "70",
    "time_data": [
      [
        5,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 11,12",
    "department": "TFJXE.日文系（進學）",
    "notes": "台北校園上課"
  },
  {
    "serial": "6034",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "葉書吟 (143***)",
    "classroom": "B  504",
    "capacity": "70",
    "time_data": [
      [
        6,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 1,2",
    "department": "TFJXE.日文系（進學）",
    "notes": ""
  },
  {
    "serial": "6054",
    "code": "A0515",
    "name": "英國文學（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "朱敏禎 (147***)",
    "classroom": "E  415",
    "capacity": "70",
    "time_data": [
      [
        4,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 11,12",
    "department": "TFLXE.英文系（進學）",
    "notes": "限本系生"
  },
  {
    "serial": "6055",
    "code": "A0532",
    "name": "英語演講 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "白書綾 (153***)",
    "classroom": "E  413",
    "capacity": "60",
    "time_data": [
      [
        3,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 13,14",
    "department": "TFLXE.英文系（進學）",
    "notes": "限本系生"
  },
  {
    "serial": "6056",
    "code": "A0685",
    "name": "新聞英文 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "羅吉旺 (049***)",
    "classroom": "B  701",
    "capacity": "80",
    "time_data": [
      [
        1,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 13,14",
    "department": "TFLXE.英文系（進學）",
    "notes": ""
  },
  {
    "serial": "6057",
    "code": "A1053",
    "name": "英作文（三） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳璽光 (154***)",
    "classroom": "E  413",
    "capacity": "60",
    "time_data": [
      [
        3,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 11,12",
    "department": "TFLXE.英文系（進學）",
    "notes": "限本系生"
  },
  {
    "serial": "6058",
    "code": "F0507",
    "name": "生態與電影 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "郭家珍 (141***)",
    "classroom": "B  701",
    "capacity": "80",
    "time_data": [
      [
        1,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 11,12",
    "department": "TFLXE.英文系（進學）",
    "notes": ""
  },
  {
    "serial": "6060",
    "code": "F0915",
    "name": "閱讀私探小說 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳映華 (151***)",
    "classroom": "E  405",
    "capacity": "80",
    "time_data": [
      [
        2,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "3",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 11,12",
    "department": "TFLXE.英文系（進學）",
    "notes": ""
  },
  {
    "serial": "6061",
    "code": "A0472",
    "name": "美國文學 (A班)",
    "credits": 3,
    "category": "必",
    "teacher": "林嘉鴻 (165***)",
    "classroom": "E  404",
    "capacity": "60",
    "time_data": [
      [
        2,
        11,
        13
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 11,12,13",
    "department": "TFLXE.英文系（進學）",
    "notes": "限本系大四生"
  },
  {
    "serial": "6062",
    "code": "A0484",
    "name": "英文翻譯 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "羅吉旺 (049***)",
    "classroom": "B  702",
    "capacity": "60",
    "time_data": [
      [
        1,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 11,12",
    "department": "TFLXE.英文系（進學）",
    "notes": "限本系大四生"
  },
  {
    "serial": "6063",
    "code": "B0395",
    "name": "商用英文 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "劉佩勳 (165***)",
    "classroom": "B  516",
    "capacity": "80",
    "time_data": [
      [
        3,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 11,12",
    "department": "TFLXE.英文系（進學）",
    "notes": ""
  },
  {
    "serial": "6064",
    "code": "F0788",
    "name": "英語教學導論 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "張玉英 (122***)",
    "classroom": "E  405",
    "capacity": "80",
    "time_data": [
      [
        1,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 13,14",
    "department": "TFLXE.英文系（進學）",
    "notes": ""
  },
  {
    "serial": "6065",
    "code": "F1675",
    "name": "ＡＩ文學與實務 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "林嘉鴻 (165***)",
    "classroom": "B  513",
    "capacity": "80",
    "time_data": [
      [
        3,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "4",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 13,14",
    "department": "TFLXE.英文系（進學）",
    "notes": ""
  },
  {
    "serial": "6066",
    "code": "T9872",
    "name": "男、女生體育－排球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳昭璁 (163***)",
    "classroom": "未定",
    "capacity": "25",
    "time_data": [
      [
        1,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 13,14",
    "department": "TGUPE.體育興趣選項－進",
    "notes": "體育館4樓排球場"
  },
  {
    "serial": "6067",
    "code": "T9873",
    "name": "男、女生體育－籃球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃至論 (155***)",
    "classroom": "未定",
    "capacity": "25",
    "time_data": [
      [
        5,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 13,14",
    "department": "TGUPE.體育興趣選項－進",
    "notes": "體育館7樓籃球場"
  },
  {
    "serial": "6068",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "羅琬竹 (163***)",
    "classroom": "未定",
    "capacity": "25",
    "time_data": [
      [
        5,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 11,12",
    "department": "TGUPE.體育興趣選項－進",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "6069",
    "code": "T9875",
    "name": "男、女生體育－羽球興趣班 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "楊明堂 (163***)",
    "classroom": "未定",
    "capacity": "25",
    "time_data": [
      [
        5,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "B",
    "group_type": "",
    "time_info": "五 / 13,14",
    "department": "TGUPE.體育興趣選項－進",
    "notes": "體育館4樓羽球場"
  },
  {
    "serial": "6070",
    "code": "T9881",
    "name": "男、女生體育－體適能興趣班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "林坤男 (163***)",
    "classroom": "SG 323",
    "capacity": "25",
    "time_data": [
      [
        5,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 13,14",
    "department": "TGUPE.體育興趣選項－進",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "6071",
    "code": "U5001",
    "name": "男、女生體育-重量訓練 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "葉錦樹 (170***)",
    "classroom": "SG 323",
    "capacity": "25",
    "time_data": [
      [
        3,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 13,14",
    "department": "TGUPE.體育興趣選項－進",
    "notes": "體育館SG323重訓室"
  },
  {
    "serial": "6072",
    "code": "U5026",
    "name": "男、女生體育－適應體育班 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "王豐家, 徐詩涵(158***,170***)",
    "classroom": "SG 323",
    "capacity": "",
    "time_data": [
      [
        3,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 11,12",
    "department": "TGUPE.體育興趣選項－進",
    "notes": "體育館SG323重訓室,須提醫生證明"
  },
  {
    "serial": "6078",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳瑜雲 (078***)",
    "classroom": "D  312",
    "capacity": "30",
    "time_data": [
      [
        5,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 11,12",
    "department": "TLBXE.財金系（進學）",
    "notes": "台北校園上課"
  },
  {
    "serial": "6079",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林恩如 (102***)",
    "classroom": "B  513",
    "capacity": "70",
    "time_data": [
      [
        5,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 11,12",
    "department": "TLBXE.財金系（進學）",
    "notes": ""
  },
  {
    "serial": "6097",
    "code": "T0466",
    "name": "英文（一） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "吳瑜雲 (078***)",
    "classroom": "D  312",
    "capacity": "35",
    "time_data": [
      [
        5,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 13,14",
    "department": "TLCXE.企管系（進學）",
    "notes": "台北校園上課"
  },
  {
    "serial": "6098",
    "code": "A0050",
    "name": "英文（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "葉書吟 (143***)",
    "classroom": "B  513",
    "capacity": "70",
    "time_data": [
      [
        6,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "2",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 6,7",
    "department": "TLCXE.企管系（進學）",
    "notes": ""
  },
  {
    "serial": "6124",
    "code": "A2928",
    "name": "文學名篇選讀：愛戀與生活 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳忠滄 (169***)",
    "classroom": "B  513",
    "capacity": "80",
    "time_data": [
      [
        3,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "L",
    "time_info": "三 / 11,12",
    "department": "TNULE.核心課程Ｌ群－進",
    "notes": "淡水校園上課"
  },
  {
    "serial": "6125",
    "code": "T2013",
    "name": "西洋歌劇欣賞入門 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王淑堯 (117***)",
    "classroom": "D  316",
    "capacity": "80",
    "time_data": [
      [
        2,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "M",
    "time_info": "二 / 13,14",
    "department": "TNUME.核心課程Ｍ群－進",
    "notes": "台北校園上課"
  },
  {
    "serial": "6126",
    "code": "T0205",
    "name": "網頁程式設計 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "翁孟廷 (141***)",
    "classroom": "B  130",
    "capacity": "70",
    "time_data": [
      [
        6,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "O",
    "time_info": "六 / 1,2",
    "department": "TNUOE.核心課程Ｏ群－進",
    "notes": "淡水校園上課"
  },
  {
    "serial": "6127",
    "code": "A3454",
    "name": "台灣歷史采風與踏查 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "陳琮淵 (155***)",
    "classroom": "B  513",
    "capacity": "80",
    "time_data": [
      [
        2,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "P",
    "time_info": "二 / 11,12",
    "department": "TNUPE.核心課程Ｐ群－進",
    "notes": "淡水校園上課 ◇遠距非同步課程"
  },
  {
    "serial": "6128",
    "code": "T1208",
    "name": "政治未來 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "周湘華 (109***)",
    "classroom": "B  513",
    "capacity": "80",
    "time_data": [
      [
        1,
        13,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "R",
    "time_info": "一 / 13,14",
    "department": "TNURE.核心課程Ｒ群－進",
    "notes": "淡水校園上課"
  },
  {
    "serial": "6129",
    "code": "T0806",
    "name": "生活與法律 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "許昭元 (131***)",
    "classroom": "B  514",
    "capacity": "80",
    "time_data": [
      [
        6,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "S",
    "time_info": "六 / 3,4",
    "department": "TNUSE.核心課程Ｓ群－進",
    "notes": "淡水校園上課"
  },
  {
    "serial": "6130",
    "code": "S0690",
    "name": "生命科學：基因科技與健康 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "王芸馨 (129***)",
    "classroom": "B  501",
    "capacity": "80",
    "time_data": [
      [
        6,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "U",
    "time_info": "六 / 1,2",
    "department": "TNUUE.核心課程Ｕ群－進",
    "notes": "本科目為通識教育跨領域微學程課程，大學部學生均可選修"
  },
  {
    "serial": "6132",
    "code": "T0169",
    "name": "人權與社會正義 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "林楚淇 (132***)",
    "classroom": "B  514",
    "capacity": "80",
    "time_data": [
      [
        5,
        11,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "W",
    "time_info": "五 / 11,12",
    "department": "TNUWE.核心課程Ｗ群－進",
    "notes": ""
  },
  {
    "serial": "6133",
    "code": "E1836",
    "name": "人工智慧導論 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃子嘉 (142***)",
    "classroom": "未定",
    "capacity": "175",
    "time_data": [
      [
        7,
        4,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "日 / 4",
    "department": "TNUXE.校共通課程－進",
    "notes": "111學年度前入學者認列為自由選修學分。補修班，限進學班重、補修生。 ◇遠距非同步課程"
  },
  {
    "serial": "6134",
    "code": "T0863",
    "name": "大學學習 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "張瓊方 (167***)",
    "classroom": "未定",
    "capacity": "175",
    "time_data": [
      [
        7,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "N",
    "time_info": "日 / 2",
    "department": "TNUXE.校共通課程－進",
    "notes": "補修班，限進學班重、補修生。 ◇遠距非同步課程"
  },
  {
    "serial": "6135",
    "code": "T2637",
    "name": "社團學習與實作－入門課程 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃文智 (052***)",
    "classroom": "未定",
    "capacity": "175",
    "time_data": [
      [
        6,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "K",
    "time_info": "六 / 6,7",
    "department": "TNUXE.校共通課程－進",
    "notes": "隔週上課。補修班，限進學班重、補修生。 ◇遠距非同步課程"
  },
  {
    "serial": "6136",
    "code": "T3174",
    "name": "探索永續 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "曾秋桂 (095***)",
    "classroom": "未定",
    "capacity": "175",
    "time_data": [
      [
        7,
        3,
        3
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "日 / 3",
    "department": "TNUXE.校共通課程－進",
    "notes": "111學年度前入學者認列為自由選修學分。補修班，限進學班重、補修生。 ◇遠距非同步課程"
  },
  {
    "serial": "6137",
    "code": "T9607",
    "name": "校園與社區服務學習 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "徐佐銘 (101***)",
    "classroom": "未定",
    "capacity": "175",
    "time_data": [
      [
        7,
        8,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "1",
    "class_name": "A",
    "group_type": "",
    "time_info": "日 / 8",
    "department": "TNUXE.校共通課程－進",
    "notes": "補修班，限進學班重、補修生。 ◇遠距非同步課程"
  },
  {
    "serial": "6138",
    "code": "T9607",
    "name": "校園與社區服務學習 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "陳建甫 (106***)",
    "classroom": "未定",
    "capacity": "175",
    "time_data": [
      [
        6,
        12,
        12
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "1",
    "class_name": "B",
    "group_type": "",
    "time_info": "六 / 12",
    "department": "TNUXE.校共通課程－進",
    "notes": "補修班，限進學班重、補修生。 ◇遠距非同步課程"
  },
  {
    "serial": "6139",
    "code": "T9703",
    "name": "全民國防教育軍事訓練（一）－國防科技 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "黃偉誠 (170***)",
    "classroom": "未定",
    "capacity": "175",
    "time_data": [
      [
        7,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "日 / 6,7",
    "department": "TNUXE.校共通課程－進",
    "notes": "補修班，限進學班重、補修生。 ◇遠距非同步課程"
  },
  {
    "serial": "6140",
    "code": "S0922",
    "name": "能源與材料科技 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "潘俊宏 (158***)",
    "classroom": "B  506",
    "capacity": "80",
    "time_data": [
      [
        6,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "Z",
    "time_info": "六 / 3,4",
    "department": "TNUZE.核心課程Ｚ群－進",
    "notes": ""
  },
  {
    "serial": "8216",
    "code": "A1793",
    "name": "第二語言習得與教法 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "張雅慧 (126***)",
    "classroom": "T  309",
    "capacity": "",
    "time_data": [
      [
        3,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 5,6",
    "department": "TFLXM.英文學系碩士班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "8217",
    "code": "A2055",
    "name": "文學理論 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳佩筠 (130***)",
    "classroom": "T  501",
    "capacity": "",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TFLXM.英文學系碩士班",
    "notes": ""
  },
  {
    "serial": "8218",
    "code": "A2135",
    "name": "英文寫作（二） (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "張雅慧 (126***)",
    "classroom": "T  309",
    "capacity": "",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TFLXM.英文學系碩士班",
    "notes": "◇全英語授課"
  },
  {
    "serial": "8219",
    "code": "F1584",
    "name": "AI與翻譯研究（二） (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳家倩 (158***)",
    "classroom": "E  827",
    "capacity": "",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 8,9",
    "department": "TFLXM.英文學系碩士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "8220",
    "code": "F1735",
    "name": "數位媒體與語言概念的敘述創作 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "曾郁景 (134***)",
    "classroom": "T  314",
    "capacity": "",
    "time_data": [
      [
        4,
        1,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 1,2",
    "department": "TFLXM.英文學系碩士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "8221",
    "code": "F1737",
    "name": "ＡＩ輔助口筆譯學跨域工作坊 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "張介英 (159***)",
    "classroom": "T  410",
    "capacity": "",
    "time_data": [
      [
        3,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 7,8",
    "department": "TFLXM.英文學系碩士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "8222",
    "code": "F1738",
    "name": "進階學術英文寫作 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "林銘輝 (144***)",
    "classroom": "T  607",
    "capacity": "",
    "time_data": [
      [
        1,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 5,6",
    "department": "TFLXM.英文學系碩士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "8223",
    "code": "F1765",
    "name": "性別與美食文學 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳儀芬 (165***)",
    "classroom": "T  314",
    "capacity": "",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 8,9",
    "department": "TFLXM.英文學系碩士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "8224",
    "code": "T8000",
    "name": "論文 (A班)",
    "credits": 0,
    "category": "必",
    "teacher": "蔡瑞敏 (132***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [
      [
        7,
        1,
        1
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "日 / 1",
    "department": "TFLXM.英文學系碩士班",
    "notes": ""
  },
  {
    "serial": "8226",
    "code": "E4393",
    "name": "生成式ＡＩ的人文導論 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "謝舒凱 (996***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        5,
        3,
        5
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 3,4,5",
    "department": "TGAXM.文學院共同科－碩",
    "notes": "【TAICA課程】，請至https://taicatw.net/spring-114/網頁查詢。非同步上課，當週課程內容將於隔日上傳。 ◇遠距收播外校課程"
  },
  {
    "serial": "8227",
    "code": "D0210",
    "name": "統計方法與應用 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "張瓊方 (167***)",
    "classroom": "ED 101",
    "capacity": "",
    "time_data": [
      [
        1,
        5,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 5,6,7",
    "department": "TGDXM.教育學院共同－碩",
    "notes": "◇以實整虛課程"
  },
  {
    "serial": "8228",
    "code": "E3670",
    "name": "深度學習 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "彭文孝, 陳永昇, 謝秉均(996***,996***,996***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        4,
        5,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 5,6,7",
    "department": "TGEXM.工學院共同科－碩",
    "notes": "遠距收播【TAICA課程】，大四以上可選修，請至https://taicatw.net/spring-114/網頁查詢上課方式。 ◇遠距收播外校課程◇全英語授課"
  },
  {
    "serial": "8229",
    "code": "E4395",
    "name": "機器導航與探索 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "何政昌, 胡敏君(157***,996***)",
    "classroom": "B  512",
    "capacity": "50",
    "time_data": [
      [
        1,
        11,
        13
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 11,12,13",
    "department": "TGEXM.工學院共同科－碩",
    "notes": "遠距收播【TAICA衛星課程】，電機系何政昌任協同教師，請至https://taicatw.net/spring-114/查詢上課方式。 ◇遠距收播外校課程"
  },
  {
    "serial": "8230",
    "code": "M0800",
    "name": "企業倫理 (A班)",
    "credits": 3,
    "category": "必",
    "teacher": "聶建中 (107***)",
    "classroom": "D  311",
    "capacity": "50",
    "time_data": [
      [
        6,
        2,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 2,3,4",
    "department": "TGLXJ.商管學院共同碩專",
    "notes": ""
  },
  {
    "serial": "8231",
    "code": "M2074",
    "name": "領導與團隊 (A班)",
    "credits": 3,
    "category": "必",
    "teacher": "林志鴻 (077***)",
    "classroom": "D  404",
    "capacity": "50",
    "time_data": [
      [
        1,
        11,
        13
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 11,12,13",
    "department": "TGLXJ.商管學院共同碩專",
    "notes": ""
  },
  {
    "serial": "8232",
    "code": "M2521",
    "name": "樂活經濟與健康管理 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "陳文和 (137***)",
    "classroom": "D  323,D  117",
    "capacity": "10",
    "time_data": [
      [
        6,
        2,
        2
      ],
      [
        6,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "六 / 2 六 / 3,4",
    "department": "TGLXJ.商管學院共同碩專",
    "notes": ""
  },
  {
    "serial": "8233",
    "code": "T0081",
    "name": "研究方法 (A班)",
    "credits": 3,
    "category": "必",
    "teacher": "李命志 (076***)",
    "classroom": "D  404",
    "capacity": "50",
    "time_data": [
      [
        3,
        12,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 12,13,14",
    "department": "TGLXJ.商管學院共同碩專",
    "notes": ""
  },
  {
    "serial": "8234",
    "code": "T0081",
    "name": "研究方法 (B班)",
    "credits": 3,
    "category": "必",
    "teacher": "楊立人 (123***)",
    "classroom": "D  319",
    "capacity": "50",
    "time_data": [
      [
        2,
        11,
        13
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "二 / 11,12,13",
    "department": "TGLXJ.商管學院共同碩專",
    "notes": ""
  },
  {
    "serial": "8235",
    "code": "T0081",
    "name": "研究方法 (C班)",
    "credits": 3,
    "category": "必",
    "teacher": "吳錦波 (039***)",
    "classroom": "D  303",
    "capacity": "50",
    "time_data": [
      [
        6,
        2,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "",
    "time_info": "六 / 2,3,4",
    "department": "TGLXJ.商管學院共同碩專",
    "notes": ""
  },
  {
    "serial": "8236",
    "code": "T0081",
    "name": "研究方法 (D班)",
    "credits": 3,
    "category": "必",
    "teacher": "蔡政言 (115***)",
    "classroom": "D  209",
    "capacity": "50",
    "time_data": [
      [
        4,
        12,
        14
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "D",
    "group_type": "",
    "time_info": "四 / 12,13,14",
    "department": "TGLXJ.商管學院共同碩專",
    "notes": ""
  },
  {
    "serial": "8237",
    "code": "B1822",
    "name": "金融科技與數位轉型實務 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "趙慕芬, 游佳萍(090***,120***)",
    "classroom": "B  116",
    "capacity": "",
    "time_data": [
      [
        2,
        7,
        7
      ],
      [
        2,
        8,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 7 二 / 8,9",
    "department": "TGLXM.商管學院共同科碩",
    "notes": ""
  },
  {
    "serial": "8238",
    "code": "M0800",
    "name": "企業倫理 (A班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪英正 (077***)",
    "classroom": "B  505",
    "capacity": "",
    "time_data": [
      [
        4,
        8,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 8",
    "department": "TGLXM.商管學院共同科碩",
    "notes": ""
  },
  {
    "serial": "8239",
    "code": "M0800",
    "name": "企業倫理 (B班)",
    "credits": 1,
    "category": "必",
    "teacher": "洪英正 (077***)",
    "classroom": "B  505",
    "capacity": "",
    "time_data": [
      [
        4,
        9,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "B",
    "group_type": "",
    "time_info": "四 / 9",
    "department": "TGLXM.商管學院共同科碩",
    "notes": ""
  },
  {
    "serial": "8240",
    "code": "M0800",
    "name": "企業倫理 (C班)",
    "credits": 1,
    "category": "必",
    "teacher": "李雅婷 (090***)",
    "classroom": "T  506",
    "capacity": "",
    "time_data": [
      [
        3,
        7,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "C",
    "group_type": "",
    "time_info": "三 / 7",
    "department": "TGLXM.商管學院共同科碩",
    "notes": "◇遠距非同步課程"
  },
  {
    "serial": "8241",
    "code": "M2811",
    "name": "大型語言模型與資訊安全系統 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "林俊叡 (996***)",
    "classroom": "未定",
    "capacity": "100",
    "time_data": [
      [
        1,
        2,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 2,3,4",
    "department": "TGLXM.商管學院共同科碩",
    "notes": "遠距收播【TAICA課程】，請至https://taicatw.net/spring-114/網頁查詢上課方式。 ◇遠距收播外校課程◇全英語授課"
  },
  {
    "serial": "8520",
    "code": "E4504",
    "name": "智慧製造執行系統 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "陳裕民 (996***)",
    "classroom": "未定",
    "capacity": "100",
    "time_data": [
      [
        1,
        7,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 7,8,9",
    "department": "TGEXM.工學院共同科－碩",
    "notes": "遠距收播【TAICA鏡像課程】，開放大三大四選修，請至https://taicatw.net/spring-114/網頁查詢上課方式。 ◇遠距收播外校課程"
  },
  {
    "serial": "8529",
    "code": "E4505",
    "name": "生成式AI應用系統與工程 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "莊坤達 (996***)",
    "classroom": "未定",
    "capacity": "100",
    "time_data": [
      [
        3,
        7,
        9
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 7,8,9",
    "department": "TGKXM.創智學院共同科碩",
    "notes": "遠距收播【TAICA課程】，開放大學部選修，請至https://taicatw.net/spring-114/網頁查詢上課方式。 ◇遠距收播外校課程"
  },
  {
    "serial": "9048",
    "code": "F1724",
    "name": "ＡＩ輔助語言學習 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "林銘輝 (144***)",
    "classroom": "T  511",
    "capacity": "",
    "time_data": [
      [
        2,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 9,10",
    "department": "TFLXD.英文系博士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "9049",
    "code": "F1725",
    "name": "當代印度女作家 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "鄧秋蓉 (138***)",
    "classroom": "T  314",
    "capacity": "",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 6,7",
    "department": "TFLXD.英文系博士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "9050",
    "code": "F1727",
    "name": "文學、ＡＩ、跨媒介研究 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "涂銘宏 (124***)",
    "classroom": "T  314",
    "capacity": "",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TFLXD.英文系博士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "9051",
    "code": "F1729",
    "name": "全球英文文學 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "吳凱書 (151***)",
    "classroom": "T  402",
    "capacity": "",
    "time_data": [
      [
        3,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 6,7",
    "department": "TFLXD.英文系博士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "9052",
    "code": "F1731",
    "name": "進階量化研究 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "林銘輝 (144***)",
    "classroom": "T  511",
    "capacity": "",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TFLXD.英文系博士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "9053",
    "code": "F1732",
    "name": "ＡＩ應用與英語教學研究 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "林怡弟 (118***)",
    "classroom": "T  410",
    "capacity": "",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TFLXD.英文系博士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "9054",
    "code": "F1767",
    "name": "文藝復興專題研究 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "王慧娟 (119***)",
    "classroom": "Q  408",
    "capacity": "",
    "time_data": [
      [
        2,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "1",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 7,8",
    "department": "TFLXD.英文系博士班",
    "notes": "◇雙語授課(中文/英文)"
  },
  {
    "serial": "9055",
    "code": "T8000",
    "name": "論文 (A班)",
    "credits": 0,
    "category": "必",
    "teacher": "蔡瑞敏 (132***)",
    "classroom": "未定",
    "capacity": "",
    "time_data": [
      [
        7,
        2,
        2
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "2",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "日 / 2",
    "department": "TFLXD.英文系博士班",
    "notes": ""
  },
  {
    "serial": "9056",
    "code": "I0693",
    "name": "ＡＩ與簡報技巧 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "巫穎翰 (167***)",
    "classroom": "T  903",
    "capacity": "",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TGRXD.國際共同科－博",
    "notes": ""
  },
  {
    "serial": "1466",
    "code": "A3244",
    "name": "視覺藝術與生活 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "楊明昊 (100***)",
    "classroom": "O  504",
    "capacity": "",
    "time_data": [
      [
        1,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "A",
    "time_info": "一 / 6,7",
    "department": "TGAHB.榮譽進階專業－文",
    "notes": "榮譽學程進階專業課程，限符合資格者修習",
    "raw_json": {
      "serial": "1466",
      "code": "A3244",
      "name": "視覺藝術與生活 (A班)",
      "credits": 2,
      "category": "必",
      "teacher": "楊明昊 (100***)",
      "classroom": "O  504",
      "capacity": "",
      "time_data": [
        [
          1,
          6,
          7
        ]
      ],
      "semester_source": "1141CLASS",
      "grade": "0",
      "major": "",
      "sem_seq": "0",
      "class_name": "A",
      "group_type": "A",
      "time_info": "一 / 6,7",
      "department": "TGAHB.榮譽進階專業－文",
      "notes": "榮譽學程進階專業課程，限符合資格者修習"
    }
  },
  {
    "serial": "1468",
    "code": "A2530",
    "name": "數位藝術與AI機器學習 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "廖翊邦 (167***)",
    "classroom": "B  206",
    "capacity": "54",
    "time_data": [
      [
        2,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 6,7",
    "department": "TGAXB.文學院共同科－日",
    "notes": "淡江大學智慧人文事務創新學分學程",
    "raw_json": {
      "serial": "1468",
      "code": "A2530",
      "name": "數位藝術與AI機器學習 (A班)",
      "credits": 2,
      "category": "選",
      "teacher": "廖翊邦 (167***)",
      "classroom": "B  206",
      "capacity": "54",
      "time_data": [
        [
          2,
          6,
          7
        ]
      ],
      "semester_source": "1141CLASS",
      "grade": "0",
      "major": "",
      "sem_seq": "0",
      "class_name": "A",
      "group_type": "",
      "time_info": "二 / 6,7",
      "department": "TGAXB.文學院共同科－日",
      "notes": "淡江大學智慧人文事務創新學分學程"
    }
  },
  {
    "serial": "1470",
    "code": "A2590",
    "name": "創意文案與實務 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "林君潔 (142***)",
    "classroom": "O  303",
    "capacity": "50",
    "time_data": [
      [
        4,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 3,4",
    "department": "TGAXB.文學院共同科－日",
    "notes": "淡江大學智慧人文事務創新學分學程",
    "raw_json": {
      "serial": "1470",
      "code": "A2590",
      "name": "創意文案與實務 (A班)",
      "credits": 2,
      "category": "選",
      "teacher": "林君潔 (142***)",
      "classroom": "O  303",
      "capacity": "50",
      "time_data": [
        [
          4,
          3,
          4
        ]
      ],
      "semester_source": "1141CLASS",
      "grade": "0",
      "major": "",
      "sem_seq": "0",
      "class_name": "A",
      "group_type": "",
      "time_info": "四 / 3,4",
      "department": "TGAXB.文學院共同科－日",
      "notes": "淡江大學智慧人文事務創新學分學程"
    }
  },
  {
    "serial": "1471",
    "code": "A3131",
    "name": "資訊視覺化 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "張嘉玲 (157***)",
    "classroom": "L  507",
    "capacity": "70",
    "time_data": [
      [
        2,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "二 / 3,4",
    "department": "TGAXB.文學院共同科－日",
    "notes": "以實整虛課程",
    "raw_json": {
      "serial": "1471",
      "code": "A3131",
      "name": "資訊視覺化 (A班)",
      "credits": 2,
      "category": "選",
      "teacher": "張嘉玲 (157***)",
      "classroom": "L  507",
      "capacity": "70",
      "time_data": [
        [
          2,
          3,
          4
        ]
      ],
      "semester_source": "1141CLASS",
      "grade": "0",
      "major": "",
      "sem_seq": "0",
      "class_name": "A",
      "group_type": "",
      "time_info": "二 / 3,4",
      "department": "TGAXB.文學院共同科－日",
      "notes": "以實整虛課程"
    }
  },
  {
    "serial": "1472",
    "code": "A3199",
    "name": "Podcast節目製作主持 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "蔡宜真 (156***)",
    "classroom": "O  303",
    "capacity": "40",
    "time_data": [
      [
        4,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 8,9",
    "department": "TGAXB.文學院共同科－日",
    "notes": "淡江大學智慧人文事務創新學分學程",
    "raw_json": {
      "serial": "1472",
      "code": "A3199",
      "name": "Podcast節目製作主持 (A班)",
      "credits": 2,
      "category": "選",
      "teacher": "蔡宜真 (156***)",
      "classroom": "O  303",
      "capacity": "40",
      "time_data": [
        [
          4,
          8,
          9
        ]
      ],
      "semester_source": "1141CLASS",
      "grade": "0",
      "major": "",
      "sem_seq": "0",
      "class_name": "A",
      "group_type": "",
      "time_info": "四 / 8,9",
      "department": "TGAXB.文學院共同科－日",
      "notes": "淡江大學智慧人文事務創新學分學程"
    }
  },
  {
    "serial": "1473",
    "code": "A3322",
    "name": "AI與人文創意敘事協作 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "莊文偉 (129***)",
    "classroom": "L  305",
    "capacity": "150",
    "time_data": [
      [
        3,
        8,
        9
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 8,9",
    "department": "TGAXB.文學院共同科－日",
    "notes": "淡江大學智慧人文事務創新學分學程",
    "raw_json": {
      "serial": "1473",
      "code": "A3322",
      "name": "AI與人文創意敘事協作 (A班)",
      "credits": 2,
      "category": "選",
      "teacher": "莊文偉 (129***)",
      "classroom": "L  305",
      "capacity": "150",
      "time_data": [
        [
          3,
          8,
          9
        ]
      ],
      "semester_source": "1141CLASS",
      "grade": "0",
      "major": "",
      "sem_seq": "0",
      "class_name": "A",
      "group_type": "",
      "time_info": "三 / 8,9",
      "department": "TGAXB.文學院共同科－日",
      "notes": "淡江大學智慧人文事務創新學分學程"
    }
  },
  {
    "serial": "1474",
    "code": "A3323",
    "name": "動漫產業AI跨域應用 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "陳淑洲 (147***)",
    "classroom": "L  412",
    "capacity": "150",
    "time_data": [
      [
        4,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 6,7",
    "department": "TGAXB.文學院共同科－日",
    "notes": "淡江大學智慧人文事務創新學分學程",
    "raw_json": {
      "serial": "1474",
      "code": "A3323",
      "name": "動漫產業AI跨域應用 (A班)",
      "credits": 2,
      "category": "選",
      "teacher": "陳淑洲 (147***)",
      "classroom": "L  412",
      "capacity": "150",
      "time_data": [
        [
          4,
          6,
          7
        ]
      ],
      "semester_source": "1141CLASS",
      "grade": "0",
      "major": "",
      "sem_seq": "0",
      "class_name": "A",
      "group_type": "",
      "time_info": "四 / 6,7",
      "department": "TGAXB.文學院共同科－日",
      "notes": "淡江大學智慧人文事務創新學分學程"
    }
  },
  {
    "serial": "1475",
    "code": "A3324",
    "name": "AI時代品牌傳播 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "吳姿嫻 (165***)",
    "classroom": "SG 402",
    "capacity": "150",
    "time_data": [
      [
        5,
        6,
        7
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 6,7",
    "department": "TGAXB.文學院共同科－日",
    "notes": "淡江大學智慧人文事務創新學分學程",
    "raw_json": {
      "serial": "1475",
      "code": "A3324",
      "name": "AI時代品牌傳播 (A班)",
      "credits": 2,
      "category": "選",
      "teacher": "吳姿嫻 (165***)",
      "classroom": "SG 402",
      "capacity": "150",
      "time_data": [
        [
          5,
          6,
          7
        ]
      ],
      "semester_source": "1141CLASS",
      "grade": "0",
      "major": "",
      "sem_seq": "0",
      "class_name": "A",
      "group_type": "",
      "time_info": "五 / 6,7",
      "department": "TGAXB.文學院共同科－日",
      "notes": "淡江大學智慧人文事務創新學分學程"
    }
  },
  {
    "serial": "1476",
    "code": "A3325",
    "name": "ESG行銷策略 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "張依萍 (165***)",
    "classroom": "L  212",
    "capacity": "150",
    "time_data": [
      [
        5,
        3,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 3,4",
    "department": "TGAXB.文學院共同科－日",
    "notes": "淡江大學智慧人文事務創新學分學程",
    "raw_json": {
      "serial": "1476",
      "code": "A3325",
      "name": "ESG行銷策略 (A班)",
      "credits": 2,
      "category": "選",
      "teacher": "張依萍 (165***)",
      "classroom": "L  212",
      "capacity": "150",
      "time_data": [
        [
          5,
          3,
          4
        ]
      ],
      "semester_source": "1141CLASS",
      "grade": "0",
      "major": "",
      "sem_seq": "0",
      "class_name": "A",
      "group_type": "",
      "time_info": "五 / 3,4",
      "department": "TGAXB.文學院共同科－日",
      "notes": "淡江大學智慧人文事務創新學分學程"
    }
  },
  {
    "serial": "1477",
    "code": "A3327",
    "name": "多媒體與電腦視覺應用 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "游國忠, 陳啟培 (133***,138***)",
    "classroom": "T  005a",
    "capacity": "60",
    "time_data": [
      [
        1,
        2,
        2
      ],
      [
        1,
        3,
        4
      ],
      [
        1,
        4,
        4
      ]
    ],
    "semester_source": "1141CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 2 一 / 3,4 一 / 4",
    "department": "TGAXB.文學院共同科－日",
    "notes": "",
    "raw_json": {
      "serial": "1477",
      "code": "A3327",
      "name": "多媒體與電腦視覺應用 (A班)",
      "credits": 3,
      "category": "選",
      "teacher": "游國忠, 陳啟培 (133***,138***)",
      "classroom": "T  005a",
      "capacity": "60",
      "time_data": [
        [
          1,
          2,
          2
        ],
        [
          1,
          3,
          4
        ],
        [
          1,
          4,
          4
        ]
      ],
      "semester_source": "1141CLASS",
      "grade": "0",
      "major": "",
      "sem_seq": "0",
      "class_name": "A",
      "group_type": "",
      "time_info": "一 / 2 一 / 3,4 一 / 4",
      "department": "TGAXB.文學院共同科－日",
      "notes": ""
    }
  },
  {
    "serial": "8226",
    "code": "E4393",
    "name": "生成式AI的中文寫作 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "謝舒凱 (996***)",
    "classroom": "未定",
    "capacity": "50",
    "time_data": [
      [
        5,
        3,
        5
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 3,4,5",
    "department": "TGAXM.文學院共同科－碩",
    "notes": "【TAICA課程】，非同步上課，當週課程內容將於隔日上傳。 ◇遠距收播外校課程",
    "raw_json": {
      "serial": "8226",
      "code": "E4393",
      "name": "生成式AI的中文寫作 (A班)",
      "credits": 3,
      "category": "選",
      "teacher": "謝舒凱 (996***)",
      "classroom": "未定",
      "capacity": "50",
      "time_data": [
        [
          5,
          3,
          5
        ]
      ],
      "semester_source": "1142CLASS",
      "grade": "0",
      "major": "",
      "sem_seq": "0",
      "class_name": "A",
      "group_type": "",
      "time_info": "五 / 3,4,5",
      "department": "TGAXM.文學院共同科－碩",
      "notes": "【TAICA課程】，非同步上課，當週課程內容將於隔日上傳。 ◇遠距收播外校課程"
    }
  },
  {
    "serial": "8241",
    "code": "M2811",
    "name": "大型語言模型與商業社會系統 (A班)",
    "credits": 3,
    "category": "選",
    "teacher": "林俊毅 (996***)",
    "classroom": "未定",
    "capacity": "100",
    "time_data": [
      [
        1,
        2,
        4
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 2,3,4",
    "department": "TGLXM.商管學院共同科碩",
    "notes": "遠距收播【TAICA課程】，全英語授課",
    "raw_json": {
      "serial": "8241",
      "code": "M2811",
      "name": "大型語言模型與商業社會系統 (A班)",
      "credits": 3,
      "category": "選",
      "teacher": "林俊毅 (996***)",
      "classroom": "未定",
      "capacity": "100",
      "time_data": [
        [
          1,
          2,
          4
        ]
      ],
      "semester_source": "1142CLASS",
      "grade": "0",
      "major": "",
      "sem_seq": "0",
      "class_name": "A",
      "group_type": "",
      "time_info": "一 / 2,3,4",
      "department": "TGLXM.商管學院共同科碩",
      "notes": "遠距收播【TAICA課程】，全英語授課"
    }
  },
  {
    "serial": "2842",
    "code": "A1376",
    "name": "中國語文能力表達 (A班)",
    "credits": 2,
    "category": "必",
    "teacher": "孔令雪 (140***)",
    "classroom": "L  212",
    "capacity": "",
    "time_data": [
      [
        3,
        9,
        10
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "三 / 9,10",
    "department": "TNUXB.校共同課程－日",
    "notes": "限本校外籍生、僑生選修",
    "raw_json": {
      "serial": "2842",
      "code": "A1376",
      "name": "中國語文能力表達 (A班)",
      "credits": 2,
      "category": "必",
      "teacher": "孔令雪 (140***)",
      "classroom": "L  212",
      "capacity": "",
      "time_data": [
        [
          3,
          9,
          10
        ]
      ],
      "semester_source": "1142CLASS",
      "grade": "0",
      "major": "",
      "sem_seq": "0",
      "class_name": "A",
      "group_type": "",
      "time_info": "三 / 9,10",
      "department": "TNUXB.校共同課程－日",
      "notes": "限本校外籍生、僑生選修"
    }
  },
  {
    "serial": "2844",
    "code": "T0645",
    "name": "森林生態與生水保護 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "蕭文偉 (133***)",
    "classroom": "B  713",
    "capacity": "260",
    "time_data": [
      [
        5,
        5,
        6
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "五 / 5,6",
    "department": "TNUXB.校共同課程－日",
    "notes": "專業知能服務學習課程",
    "raw_json": {
      "serial": "2844",
      "code": "T0645",
      "name": "森林生態與生水保護 (A班)",
      "credits": 2,
      "category": "選",
      "teacher": "蕭文偉 (133***)",
      "classroom": "B  713",
      "capacity": "260",
      "time_data": [
        [
          5,
          5,
          6
        ]
      ],
      "semester_source": "1142CLASS",
      "grade": "0",
      "major": "",
      "sem_seq": "0",
      "class_name": "A",
      "group_type": "",
      "time_info": "五 / 5,6",
      "department": "TNUXB.校共同課程－日",
      "notes": "專業知能服務學習課程"
    }
  },
  {
    "serial": "2849",
    "code": "T3268",
    "name": "AI素養與數位民主 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "黃子嘉, 王于文 (142***,157***)",
    "classroom": "B  120",
    "capacity": "70",
    "time_data": [
      [
        1,
        7,
        7
      ],
      [
        1,
        8,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "一 / 7 一 / 8",
    "department": "TNUXB.校共同課程－日",
    "notes": "遠距非同步課程",
    "raw_json": {
      "serial": "2849",
      "code": "T3268",
      "name": "AI素養與數位民主 (A班)",
      "credits": 2,
      "category": "選",
      "teacher": "黃子嘉, 王于文 (142***,157***)",
      "classroom": "B  120",
      "capacity": "70",
      "time_data": [
        [
          1,
          7,
          7
        ],
        [
          1,
          8,
          8
        ]
      ],
      "semester_source": "1142CLASS",
      "grade": "0",
      "major": "",
      "sem_seq": "0",
      "class_name": "A",
      "group_type": "",
      "time_info": "一 / 7 一 / 8",
      "department": "TNUXB.校共同課程－日",
      "notes": "遠距非同步課程"
    }
  },
  {
    "serial": "2850",
    "code": "T3294",
    "name": "旅遊人生：無限大的旅程 (A班)",
    "credits": 2,
    "category": "選",
    "teacher": "林維祥 (169***)",
    "classroom": "Q  409",
    "capacity": "175",
    "time_data": [
      [
        4,
        7,
        8
      ]
    ],
    "semester_source": "1142CLASS",
    "grade": "0",
    "major": "",
    "sem_seq": "0",
    "class_name": "A",
    "group_type": "",
    "time_info": "四 / 7,8",
    "department": "TNUXB.校共同課程－日",
    "notes": "",
    "raw_json": {
      "serial": "2850",
      "code": "T3294",
      "name": "旅遊人生：無限大的旅程 (A班)",
      "credits": 2,
      "category": "選",
      "teacher": "林維祥 (169***)",
      "classroom": "Q  409",
      "capacity": "175",
      "time_data": [
        [
          4,
          7,
          8
        ]
      ],
      "semester_source": "1142CLASS",
      "grade": "0",
      "major": "",
      "sem_seq": "0",
      "class_name": "A",
      "group_type": "",
      "time_info": "四 / 7,8",
      "department": "TNUXB.校共同課程－日",
      "notes": ""
    }
  }
]

function normalizePatchedCourse(course) {
  return mapCourseRow({ id: patchedCourseKey(course), raw_json: course, ...course })
}

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: jsonHeaders })
}

function error(message, status = 400, extra = {}) {
  return json({ ok: false, error: message, ...extra }, status)
}

function normalizeStudentId(value) {
  return String(value || '').trim()
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

async function readBody(request) {
  const text = await request.text()
  if (!text) return {}
  try { return JSON.parse(text) } catch { return {} }
}

function base64UrlEncode(input) {
  const bytes = input instanceof Uint8Array ? input : new TextEncoder().encode(String(input))
  let binary = ''
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlDecode(input) {
  const normalized = String(input || '').replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4)
  const binary = atob(padded)
  return new Uint8Array([...binary].map((ch) => ch.charCodeAt(0)))
}

async function hmacSha256(secret, data) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return new Uint8Array(signature)
}

async function signToken(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const body = { ...payload, iat: now, exp: now + TOKEN_TTL_SECONDS }
  const unsigned = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(body))}`
  const signature = await hmacSha256(secret, unsigned)
  return `${unsigned}.${base64UrlEncode(signature)}`
}

async function verifyToken(token, secret) {
  const [encodedHeader, encodedPayload, encodedSignature] = String(token || '').split('.')
  if (!encodedHeader || !encodedPayload || !encodedSignature) return null
  const unsigned = `${encodedHeader}.${encodedPayload}`
  const expected = base64UrlEncode(await hmacSha256(secret, unsigned))
  if (expected !== encodedSignature) return null
  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(encodedPayload)))
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null
  return payload
}

async function hashPassword(password, salt) {
  const raw = `${salt}:${String(password || '')}`
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))
  return base64UrlEncode(new Uint8Array(digest))
}

function randomSalt() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return base64UrlEncode(bytes)
}

function randomResetCode() {
  const bytes = new Uint8Array(4)
  crypto.getRandomValues(bytes)
  const value = ((bytes[0] << 24) >>> 0) + (bytes[1] << 16) + (bytes[2] << 8) + bytes[3]
  return String(value % 1000000).padStart(6, '0')
}

async function sendResetEmail(env, to, code) {
  if (!env.RESEND_API_KEY || !env.RESET_FROM_EMAIL) {
    throw new Error('尚未設定寄信服務，請在 Cloudflare 新增 RESEND_API_KEY 與 RESET_FROM_EMAIL')
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESET_FROM_EMAIL,
      to,
      subject: 'UniPlan 密碼重設驗證碼',
      html: `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.7;color:#10233f"><h2>UniPlan 密碼重設</h2><p>你的驗證碼是：</p><p style="font-size:28px;font-weight:800;letter-spacing:6px">${code}</p><p>此驗證碼 10 分鐘內有效。若不是你本人操作，請忽略這封信。</p></div>`,
    }),
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`寄信失敗：${text || response.status}`)
  }
}


async function sendVerificationEmail(env, to, code) {
  if (!env.RESEND_API_KEY || !env.RESET_FROM_EMAIL) {
    throw new Error('尚未設定寄信服務，請在 Cloudflare 新增 RESEND_API_KEY 與 RESET_FROM_EMAIL')
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESET_FROM_EMAIL,
      to,
      subject: 'UniPlan Email 驗證碼',
      html: `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.7;color:#10233f"><h2>UniPlan Email 驗證</h2><p>你的驗證碼是：</p><p style="font-size:28px;font-weight:800;letter-spacing:6px">${code}</p><p>此驗證碼 10 分鐘內有效。完成驗證後才能登入 UniPlan。</p></div>`,
    }),
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`寄信失敗：${text || response.status}`)
  }
}

function getSql(env) {
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL 未設定')
  return neon(env.DATABASE_URL)
}


async function ensureCourseSchema(sql) {
  await sql`create extension if not exists pgcrypto`
  await sql`
    create table if not exists courses (
      id uuid primary key default gen_random_uuid(),
      semester_source text not null,
      serial text,
      code text,
      name text not null,
      credits numeric,
      category text,
      teacher text,
      classroom text,
      capacity text,
      time_data jsonb,
      time_info text,
      department text,
      grade text,
      major text,
      sem_seq text,
      class_name text,
      group_type text,
      notes text,
      raw_json jsonb not null default '{}'::jsonb,
      created_at timestamp default now(),
      updated_at timestamp default now(),
      unique (semester_source, serial, code, class_name, name)
    )
  `
  await sql`create index if not exists idx_courses_semester_source on courses (semester_source)`
  await sql`create index if not exists idx_courses_department on courses (department)`
  await sql`create index if not exists idx_courses_grade on courses (grade)`
  await sql`create index if not exists idx_courses_code on courses (code)`
  await sql`create index if not exists idx_courses_serial on courses (serial)`
  await sql`create index if not exists idx_courses_name on courses (name)`
}

function parseCourseTimeData(value) {
  if (Array.isArray(value)) return value
  if (!value) return []
  try { return JSON.parse(String(value)) } catch { return [] }
}

function normalizeImportCourse(course = {}, fallbackSemester = '') {
  return {
    semester_source: normalizeCourseCatalogTerm(course.semester_source || course.semester || course.term || fallbackSemester),
    serial: String(course.serial || course.開課序號 || course['開課序號'] || '').trim(),
    code: String(course.code || course.course_code || course.course_id || course.課號 || course['課號'] || '').trim(),
    name: String(course.name || course.course_name || course.課程名稱 || course['課程名稱'] || course.科目名稱 || course['科目名稱'] || '').trim(),
    credits: Number.isFinite(Number(course.credits ?? course.credit ?? course.學分 ?? course['學分'])) ? Number(course.credits ?? course.credit ?? course.學分 ?? course['學分']) : null,
    category: String(course.category || course.required_type || course.必選修 || course['必選修'] || '').trim(),
    teacher: String(course.teacher || course.instructor || course.教師 || course['教師'] || '').trim(),
    classroom: String(course.classroom || course.room || course.教室 || course['教室'] || '').trim(),
    capacity: String(course.capacity || course.人數 || course['人數'] || '').trim(),
    time_data: parseCourseTimeData(course.time_data),
    time_info: String(course.time_info || course.time || course.時間 || course['時間'] || '').trim(),
    department: String(course.department || course.開課系所 || course['開課系所'] || course.系所 || course['系所'] || '').trim(),
    grade: String(course.grade || course.年級 || course['年級'] || '').trim(),
    major: String(course.major || course.class_group || course.班別 || course['班別'] || '').trim(),
    sem_seq: String(course.sem_seq || course.學期序 || course['學期序'] || '').trim(),
    class_name: String(course.class_name || course.className || course.班級 || course['班級'] || '').trim(),
    group_type: String(course.group_type || course.組別 || course['組別'] || '').trim(),
    notes: String(course.notes || course.note || course.備註 || course['備註'] || '').trim(),
    raw_json: course,
  }
}

async function upsertCourseRow(sql, c) {
  await sql`
    insert into courses (
      semester_source, serial, code, name, credits, category, teacher, classroom, capacity,
      time_data, time_info, department, grade, major, sem_seq, class_name, group_type, notes, raw_json, updated_at
    ) values (
      ${c.semester_source}, ${c.serial}, ${c.code}, ${c.name}, ${c.credits}, ${c.category}, ${c.teacher}, ${c.classroom}, ${c.capacity},
      ${JSON.stringify(c.time_data)}::jsonb, ${c.time_info}, ${c.department}, ${c.grade}, ${c.major}, ${c.sem_seq}, ${c.class_name}, ${c.group_type}, ${c.notes}, ${JSON.stringify(c.raw_json)}::jsonb, now()
    )
    on conflict (semester_source, serial, code, class_name, name)
    do update set
      credits = excluded.credits,
      category = excluded.category,
      teacher = excluded.teacher,
      classroom = excluded.classroom,
      capacity = excluded.capacity,
      time_data = excluded.time_data,
      time_info = excluded.time_info,
      department = excluded.department,
      grade = excluded.grade,
      major = excluded.major,
      sem_seq = excluded.sem_seq,
      group_type = excluded.group_type,
      notes = excluded.notes,
      raw_json = excluded.raw_json,
      updated_at = now()
  `
}

async function ensureSchema(sql) {
  await sql`create extension if not exists pgcrypto`
  await sql`
    create table if not exists users (
      id uuid primary key default gen_random_uuid(),
      student_id varchar(20) unique not null,
      email varchar(255) unique,
      password_hash text not null,
      created_at timestamp default now(),
      last_login timestamp
    )
  `
  await sql`alter table users add column if not exists display_name varchar(100)`
  await sql`alter table users add column if not exists password_salt text`
  await sql`alter table users add column if not exists role text not null default 'student'`
  await sql`alter table users add column if not exists profile jsonb not null default '{}'::jsonb`
  await sql`alter table users add column if not exists google_id text`
  await sql`alter table users add column if not exists email_verified boolean default false`
  await sql`alter table users add column if not exists updated_at timestamp default now()`
  await sql`alter table users add column if not exists verification_code_hash text`
  await sql`alter table users add column if not exists verification_code_salt text`
  await sql`alter table users add column if not exists verification_expires_at timestamp`
  await sql`alter table users add column if not exists verification_attempts integer not null default 0`
  await sql`alter table users add column if not exists reset_code_hash text`
  await sql`alter table users add column if not exists reset_code_salt text`
  await sql`alter table users add column if not exists reset_expires_at timestamp`
  await sql`alter table users add column if not exists reset_attempts integer not null default 0`

  await sql`
    create table if not exists user_settings (
      id uuid primary key default gen_random_uuid(),
      user_id uuid references users(id) on delete cascade,
      theme text,
      accent_color text,
      settings_json jsonb,
      updated_at timestamp default now()
    )
  `
  await sql`
    create table if not exists user_favorites (
      id uuid primary key default gen_random_uuid(),
      user_id uuid references users(id) on delete cascade,
      course_key text not null,
      created_at timestamp default now()
    )
  `
  await sql`
    create table if not exists user_timetables (
      id uuid primary key default gen_random_uuid(),
      user_id uuid references users(id) on delete cascade,
      semester text not null,
      timetable_json jsonb not null,
      updated_at timestamp default now(),
      unique(user_id, semester)
    )
  `
  await sql`
    create table if not exists public_feedback (
      id text primary key,
      type text not null,
      title text,
      detail text,
      status text not null default '待處理',
      payload jsonb not null default '{}'::jsonb,
      created_at timestamp default now()
    )
  `
}

function publicUser(row) {
  const studentId = row.student_id
  const role = ADMIN_STUDENT_IDS.has(studentId) ? 'super_admin' : (row.role || 'student')
  return {
    id: row.id,
    studentId,
    student_id: studentId,
    role,
    offline: false,
    localAccount: false,
    cloudAccount: true,
    emailVerified: Boolean(row.email_verified),
    email: row.email || row.profile?.email || '',
    profile: row.profile || {},
  }
}

function profileFromBody(body = {}) {
  return {
    displayName: body.display_name || body.displayName || '',
    email: normalizeEmail(body.email),
    department: body.department || '',
    grade: body.grade || '',
    admissionYear: String(body.admission_year || body.admissionYear || ''),
    studentStatus: body.student_status || body.studentStatus || '在學',
    boundEmail: Boolean(body.email_bound ?? body.boundEmail ?? body.email),
    boundGoogle: Boolean(body.google_bound ?? body.boundGoogle),
    syncEnabled: Boolean(body.sync_enabled ?? body.syncEnabled ?? true),
  }
}

async function authUser(request, env, sql) {
  const header = request.headers.get('authorization') || ''
  const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : ''
  const payload = await verifyToken(token, env.JWT_SECRET || 'uniplan-dev-secret')
  if (!payload?.uid) return null
  const rows = await sql`select * from users where id = ${payload.uid} limit 1`
  return rows[0] || null
}

async function loadUserBundle(sql, userId) {
  const timetableRows = await sql`select semester, timetable_json, updated_at from user_timetables where user_id = ${userId} order by updated_at desc`
  const favoriteRows = await sql`select course_key from user_favorites where user_id = ${userId} order by created_at desc`
  const settingRows = await sql`select theme, accent_color, settings_json, updated_at from user_settings where user_id = ${userId} order by updated_at desc limit 1`
  const latestPlan = timetableRows[0]?.timetable_json || null
  const settings = settingRows[0]?.settings_json || null
  const favoriteKeys = favoriteRows.map((row) => row.course_key)
  const storedFavorites = Array.isArray(latestPlan?.favorites) && latestPlan.favorites.length ? latestPlan.favorites : favoriteKeys
  return {
    ...(latestPlan || {}),
    plan: latestPlan?.plan || latestPlan || null,
    candidates: latestPlan?.candidates || [],
    favorites: storedFavorites,
    favoriteKeys,
    snapshots: latestPlan?.snapshots || [],
    localReviews: latestPlan?.localReviews || {},
    tagVotes: latestPlan?.tagVotes || {},
    settings,
    theme: settingRows[0]?.theme || settings?.theme || '',
    accentColor: settingRows[0]?.accent_color || settings?.accentColor || '',
    timetables: timetableRows,
  }
}

function cloudCourseKey(item) {
  if (typeof item === 'string') return item
  const c = item?.course || item || {}
  const term = String(c.semester_source || c.semester || c.term || '').trim()
  const base = String(c.serial || c.code || c.course_id || c.id || `${c.name || ''}-${c.teacher || ''}-${c.time_info || c.time || ''}`).trim()
  return term && base ? `${term}:${base}` : base
}

async function saveUserBundle(sql, userId, bundle = {}) {
  const semester = String(bundle.semester || bundle.plan?.semester || bundle.currentSemester || 'default')

  // 既有 Neon 表可能沒有 unique(user_id, semester) constraint。
  // 不使用 ON CONFLICT，改成明確 delete + insert，避免 /api/user/data 500 導致課表與收藏完全無法寫入。
  await sql`delete from user_timetables where user_id = ${userId} and semester = ${semester}`
  await sql`
    insert into user_timetables (user_id, semester, timetable_json, updated_at)
    values (${userId}, ${semester}, ${JSON.stringify(bundle)}, now())
  `

  if (Array.isArray(bundle.favorites)) {
    await sql`delete from user_favorites where user_id = ${userId}`
    for (const item of bundle.favorites) {
      const key = cloudCourseKey(item)
      if (key) await sql`insert into user_favorites (user_id, course_key) values (${userId}, ${String(key)})`
    }
  }

  const settings = bundle.settings || bundle.appearanceSettings || {}
  if (settings && Object.keys(settings).length) {
    await sql`delete from user_settings where user_id = ${userId}`
    await sql`
      insert into user_settings (user_id, theme, accent_color, settings_json, updated_at)
      values (${userId}, ${settings.theme || bundle.theme || null}, ${settings.accentColor || bundle.accentColor || null}, ${JSON.stringify(settings)}, now())
    `
  }
}

async function handleRegister(request, env, sql) {
  const body = await readBody(request)
  const studentId = normalizeStudentId(body.student_id || body.studentId)
  const password = String(body.password || '')
  const email = normalizeEmail(body.email)
  if (!/^\d{9}$/.test(studentId)) return error('學號必須為 9 碼數字')
  if (!email) return error('請輸入 Email')
  if (password.length < 6) return error('密碼至少需要 6 碼')
  const exists = await sql`select id from users where student_id = ${studentId} or lower(email) = ${email} limit 1`
  if (exists.length) return error('此學號或 Email 已註冊雲端帳號', 409)
  const salt = randomSalt()
  const passwordHash = await hashPassword(password, salt)
  const role = ADMIN_STUDENT_IDS.has(studentId) ? 'super_admin' : 'student'
  const profile = profileFromBody({ ...body, displayName: body.displayName || body.display_name || studentId, email })
  const code = randomResetCode()
  const verificationSalt = randomSalt()
  const verificationHash = await hashPassword(code, verificationSalt)
  await sendVerificationEmail(env, email, code)
  const rows = await sql`
    insert into users (student_id, email, display_name, password_hash, password_salt, role, profile, email_verified, verification_code_hash, verification_code_salt, verification_expires_at, verification_attempts, updated_at)
    values (${studentId}, ${email}, ${profile.displayName || studentId}, ${passwordHash}, ${salt}, ${role}, ${JSON.stringify(profile)}, false, ${verificationHash}, ${verificationSalt}, now() + interval '10 minutes', 0, now())
    returning *
  `
  return json({
    ok: true,
    requiresVerification: true,
    user: { studentId, student_id: studentId, email, emailVerified: false },
    profile,
    message: '帳號已建立，Email 驗證碼已寄出；完成驗證後才能登入',
  })
}

async function handleLogin(request, env, sql) {
  const body = await readBody(request)
  const identifier = normalizeStudentId(body.identifier || body.student_id || body.studentId)
  const password = String(body.password || '')
  const email = normalizeEmail(identifier)
  const rows = identifier.includes('@')
    ? await sql`select * from users where lower(email) = ${email} limit 1`
    : await sql`select * from users where student_id = ${identifier} limit 1`
  if (!rows.length) return error('找不到此雲端帳號', 404)
  const row = rows[0]
  if (!row.password_salt) return error('此帳號缺少密碼鹽值，請重新註冊或重設密碼', 409)
  const passwordHash = await hashPassword(password, row.password_salt)
  if (passwordHash !== row.password_hash) return error('密碼錯誤', 401)
  if (!row.email_verified) return error('此帳號尚未完成 Email 驗證，請先輸入驗證碼或重新寄送驗證信', 403, { code: 'EMAIL_NOT_VERIFIED', studentId: row.student_id, email: row.email })
  await sql`update users set last_login = now(), updated_at = now() where id = ${row.id}`
  const user = publicUser(row)
  const token = await signToken({ uid: user.id, sid: user.studentId }, env.JWT_SECRET || 'uniplan-dev-secret')
  const data = await loadUserBundle(sql, row.id)
  return json({ ok: true, token, user, profile: row.profile || {}, data })
}



async function handleVerifyEmail(request, env, sql) {
  const body = await readBody(request)
  const studentId = normalizeStudentId(body.student_id || body.studentId)
  const email = normalizeEmail(body.email)
  const code = String(body.code || body.verificationCode || '').trim()
  if (!/^\d{9}$/.test(studentId)) return error('學號必須為 9 碼數字')
  if (!email) return error('請輸入註冊 Email')
  if (!/^\d{6}$/.test(code)) return error('驗證碼必須為 6 碼數字')
  const rows = await sql`select * from users where student_id = ${studentId} and lower(email) = ${email} limit 1`
  if (!rows.length) return error('找不到符合的帳號與 Email', 404)
  const row = rows[0]
  if (row.email_verified) {
    const user = publicUser(row)
    const token = await signToken({ uid: user.id, sid: user.studentId }, env.JWT_SECRET || 'uniplan-dev-secret')
    const data = await loadUserBundle(sql, row.id)
    return json({ ok: true, token, user, profile: row.profile || {}, data, message: 'Email 已完成驗證' })
  }
  if (!row.verification_code_hash || !row.verification_code_salt || !row.verification_expires_at) return error('尚未申請 Email 驗證碼', 400)
  if (new Date(row.verification_expires_at).getTime() < Date.now()) return error('驗證碼已過期，請重新寄送', 400)
  if ((row.verification_attempts || 0) >= 5) return error('驗證碼錯誤次數過多，請重新寄送', 429)
  const codeHash = await hashPassword(code, row.verification_code_salt)
  if (codeHash !== row.verification_code_hash) {
    await sql`update users set verification_attempts = coalesce(verification_attempts, 0) + 1 where id = ${row.id}`
    return error('驗證碼錯誤', 401)
  }
  const verifiedRows = await sql`
    update users
    set email_verified = true, verification_code_hash = null, verification_code_salt = null, verification_expires_at = null, verification_attempts = 0, last_login = now(), updated_at = now()
    where id = ${row.id}
    returning *
  `
  const user = publicUser(verifiedRows[0])
  const token = await signToken({ uid: user.id, sid: user.studentId }, env.JWT_SECRET || 'uniplan-dev-secret')
  const data = await loadUserBundle(sql, row.id)
  return json({ ok: true, token, user, profile: verifiedRows[0].profile || {}, data, message: 'Email 驗證完成，已登入 UniPlan' })
}

async function handleResendVerification(request, env, sql) {
  const body = await readBody(request)
  const studentId = normalizeStudentId(body.student_id || body.studentId)
  const email = normalizeEmail(body.email)
  if (!/^\d{9}$/.test(studentId)) return error('學號必須為 9 碼數字')
  if (!email) return error('請輸入註冊 Email')
  const rows = await sql`select * from users where student_id = ${studentId} and lower(email) = ${email} limit 1`
  if (!rows.length) return error('找不到符合的帳號與 Email', 404)
  const row = rows[0]
  if (row.email_verified) return json({ ok: true, message: '此 Email 已完成驗證' })
  const code = randomResetCode()
  const salt = randomSalt()
  const codeHash = await hashPassword(code, salt)
  await sendVerificationEmail(env, email, code)
  await sql`
    update users
    set verification_code_hash = ${codeHash}, verification_code_salt = ${salt}, verification_expires_at = now() + interval '10 minutes', verification_attempts = 0, updated_at = now()
    where id = ${row.id}
  `
  return json({ ok: true, message: 'Email 驗證碼已重新寄出，請在 10 分鐘內完成驗證' })
}

async function handlePasswordRequest(request, env, sql) {
  const body = await readBody(request)
  const studentId = normalizeStudentId(body.student_id || body.studentId)
  const email = normalizeEmail(body.email)
  if (!/^\d{9}$/.test(studentId)) return error('學號必須為 9 碼數字')
  if (!email) return error('請輸入註冊 Email')
  const rows = await sql`select * from users where student_id = ${studentId} and lower(email) = ${email} limit 1`
  if (!rows.length) return error('找不到符合的帳號與 Email', 404)
  if (!rows[0].email_verified) return error('此帳號尚未完成 Email 驗證，請先完成驗證再重設密碼', 403, { code: 'EMAIL_NOT_VERIFIED' })
  const code = randomResetCode()
  const salt = randomSalt()
  const codeHash = await hashPassword(code, salt)
  await sendResetEmail(env, email, code)
  await sql`
    update users
    set reset_code_hash = ${codeHash}, reset_code_salt = ${salt}, reset_expires_at = now() + interval '10 minutes', reset_attempts = 0, updated_at = now()
    where id = ${rows[0].id}
  `
  return json({ ok: true, message: '驗證碼已寄出，請在 10 分鐘內完成重設' })
}

async function handlePasswordReset(request, env, sql) {
  const body = await readBody(request)
  const studentId = normalizeStudentId(body.student_id || body.studentId)
  const email = normalizeEmail(body.email)
  const code = String(body.code || '').trim()
  const newPassword = String(body.new_password || body.newPassword || '')
  if (!/^\d{9}$/.test(studentId)) return error('學號必須為 9 碼數字')
  if (!email) return error('請輸入註冊 Email')
  if (!/^\d{6}$/.test(code)) return error('驗證碼必須為 6 碼數字')
  if (newPassword.length < 6) return error('新密碼至少需要 6 碼')
  const rows = await sql`select * from users where student_id = ${studentId} and lower(email) = ${email} limit 1`
  if (!rows.length) return error('找不到符合的帳號與 Email', 404)
  const row = rows[0]
  if (!row.reset_code_hash || !row.reset_code_salt || !row.reset_expires_at) return error('尚未申請重設驗證碼', 400)
  if (new Date(row.reset_expires_at).getTime() < Date.now()) return error('驗證碼已過期，請重新申請', 400)
  if ((row.reset_attempts || 0) >= 5) return error('驗證碼錯誤次數過多，請重新申請', 429)
  const codeHash = await hashPassword(code, row.reset_code_salt)
  if (codeHash !== row.reset_code_hash) {
    await sql`update users set reset_attempts = coalesce(reset_attempts, 0) + 1 where id = ${row.id}`
    return error('驗證碼錯誤', 401)
  }
  const salt = randomSalt()
  const passwordHash = await hashPassword(newPassword, salt)
  await sql`
    update users
    set password_hash = ${passwordHash}, password_salt = ${salt}, reset_code_hash = null, reset_code_salt = null, reset_expires_at = null, reset_attempts = 0, updated_at = now()
    where id = ${row.id}
  `
  return json({ ok: true, message: '密碼已重設，請重新登入' })
}

async function handleMe(request, env, sql) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  return json({ ok: true, user: publicUser(row), profile: row.profile || {} })
}

async function handleProfile(request, env, sql) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  const body = await readBody(request)
  const profile = profileFromBody(body)
  const rows = await sql`
    update users
    set email = ${profile.email || null}, display_name = ${profile.displayName || row.student_id}, profile = ${JSON.stringify(profile)}, updated_at = now()
    where id = ${row.id}
    returning *
  `
  return json({ ok: true, user: publicUser(rows[0]), profile })
}

async function handleGetUserData(request, env, sql) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  return json({ ok: true, data: await loadUserBundle(sql, row.id) })
}

async function handlePutUserData(request, env, sql) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  const body = await readBody(request)
  const bundle = body.data || body.bundle || body
  await saveUserBundle(sql, row.id, bundle)
  return json({ ok: true, updated_at: new Date().toISOString() })
}

async function handleSchedule(request, env, sql, method) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  if (method === 'GET') {
    const data = await loadUserBundle(sql, row.id)
    return json({ ok: true, data: data.plan || data })
  }
  const body = await readBody(request)
  const plan = body.schedule_data || body.plan || body
  await saveUserBundle(sql, row.id, { plan })
  return json({ ok: true })
}

async function handleFavorites(request, env, sql, method) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  if (method === 'GET') {
    const rows = await sql`select course_key from user_favorites where user_id = ${row.id} order by created_at desc`
    return json({ ok: true, favorites: rows.map((item) => item.course_key) })
  }
  const body = await readBody(request)
  const favorites = Array.isArray(body.favorites) ? body.favorites : []
  await sql`delete from user_favorites where user_id = ${row.id}`
  for (const key of favorites) if (key) await sql`insert into user_favorites (user_id, course_key) values (${row.id}, ${String(key)})`
  return json({ ok: true })
}

async function handleSettings(request, env, sql, method) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  if (method === 'GET') {
    const rows = await sql`select * from user_settings where user_id = ${row.id} order by updated_at desc limit 1`
    return json({ ok: true, settings: rows[0]?.settings_json || null })
  }
  const body = await readBody(request)
  const incoming = body.settings || body
  const rows = await sql`select theme, accent_color, settings_json from user_settings where user_id = ${row.id} order by updated_at desc limit 1`
  const current = rows[0]?.settings_json || {}
  const settings = { ...current, ...incoming, appearance: { ...(current.appearance || {}), ...(incoming.appearance || {}) } }
  await sql`delete from user_settings where user_id = ${row.id}`
  await sql`
    insert into user_settings (user_id, theme, accent_color, settings_json, updated_at)
    values (${row.id}, ${settings.theme || settings.uiTheme || rows[0]?.theme || null}, ${settings.accentColor || settings.accent || rows[0]?.accent_color || null}, ${JSON.stringify(settings)}, now())
  `
  return json({ ok: true, settings })
}


async function handleGetWelcome(request, env, sql) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  const rows = await sql`select settings_json from user_settings where user_id = ${row.id} order by updated_at desc limit 1`
  const settings = rows[0]?.settings_json || {}
  return json({ ok: true, hasSeenWelcome: Boolean(settings.hasSeenWelcome), settings })
}

async function handlePutWelcome(request, env, sql) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  const rows = await sql`select theme, accent_color, settings_json from user_settings where user_id = ${row.id} order by updated_at desc limit 1`
  const current = rows[0]?.settings_json || {}
  const nextSettings = { ...current, hasSeenWelcome: true, welcomeSeenAt: new Date().toISOString() }
  await sql`delete from user_settings where user_id = ${row.id}`
  await sql`
    insert into user_settings (user_id, theme, accent_color, settings_json, updated_at)
    values (${row.id}, ${rows[0]?.theme || nextSettings.theme || null}, ${rows[0]?.accent_color || nextSettings.accentColor || null}, ${JSON.stringify(nextSettings)}, now())
  `
  return json({ ok: true, hasSeenWelcome: true, settings: nextSettings })
}

async function handleAdminCourseImport(request, env, sql) {
  const row = await authUser(request, env, sql)
  if (!row) return error('尚未登入', 401)
  const publicRow = publicUser(row)
  if (publicRow.role !== 'super_admin') return error('沒有管理員權限', 403)

  const body = await readBody(request)
  const fallbackSemester = normalizeCourseCatalogTerm(body.semester || body.semester_source || '')
  const rawCourses = Array.isArray(body.courses) ? body.courses : Array.isArray(body.data) ? body.data : []
  const clearSemester = Boolean(body.clearSemester || body.clear_semester)
  if (!rawCourses.length) return error('沒有可匯入的課程資料')

  await ensureCourseSchema(sql)
  if (clearSemester && fallbackSemester) {
    await sql`delete from courses where semester_source = ${fallbackSemester}`
  }

  let imported = 0
  const errors = []
  const bySemester = {}
  for (let index = 0; index < rawCourses.length; index += 1) {
    const course = normalizeImportCourse(rawCourses[index], fallbackSemester)
    if (!course.semester_source || !course.name) {
      errors.push({ row: index + 1, message: '缺少學期或課程名稱' })
      continue
    }
    try {
      await upsertCourseRow(sql, course)
      imported += 1
      bySemester[course.semester_source] = (bySemester[course.semester_source] || 0) + 1
    } catch (err) {
      errors.push({ row: index + 1, message: err?.message || '匯入失敗' })
      if (errors.length >= 20) break
    }
  }

  return json({ ok: true, imported, failed: errors.length, errors, bySemester })
}


function getOAuthBaseUrl(request) {
  const url = new URL(request.url)
  return `${url.protocol}//${url.host}`
}

function getGoogleRedirectUri(request, env) {
  return env.GOOGLE_REDIRECT_URI || `${getOAuthBaseUrl(request)}/api/auth/google/callback`
}

function redirectToApp(request, params = {}) {
  const url = new URL(request.url)
  const target = new URL('/', `${url.protocol}//${url.host}`)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') target.searchParams.set(key, String(value))
  })
  return Response.redirect(target.toString(), 302)
}

async function handleGoogleStart(request, env) {
  if (!env.GOOGLE_CLIENT_ID) return redirectToApp(request, { google_error: '尚未設定 GOOGLE_CLIENT_ID' })
  const redirectUri = getGoogleRedirectUri(request, env)
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', env.GOOGLE_CLIENT_ID)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid email profile')
  authUrl.searchParams.set('prompt', 'select_account')
  authUrl.searchParams.set('state', base64UrlEncode(redirectUri))
  return Response.redirect(authUrl.toString(), 302)
}

async function exchangeGoogleCode(request, env, code) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) throw new Error('尚未設定 Google OAuth 環境變數')
  const redirectUri = getGoogleRedirectUri(request, env)
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data?.error_description || data?.error || 'Google token exchange failed')
  return data
}

async function fetchGoogleProfile(accessToken) {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { authorization: `Bearer ${accessToken}` },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data?.error_description || data?.error || 'Google profile fetch failed')
  return data
}

async function handleGoogleCallback(request, env, sql) {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const oauthError = url.searchParams.get('error')
    if (oauthError) return redirectToApp(request, { google_error: `Google 登入取消或失敗：${oauthError}` })
    if (!code) return redirectToApp(request, { google_error: 'Google 未回傳授權碼' })

    const tokenData = await exchangeGoogleCode(request, env, code)
    const googleProfile = await fetchGoogleProfile(tokenData.access_token)
    const googleId = String(googleProfile.sub || '')
    const email = normalizeEmail(googleProfile.email)
    if (!googleId || !email) return redirectToApp(request, { google_error: 'Google 帳號缺少必要資料' })
    if (googleProfile.email_verified === false) return redirectToApp(request, { google_error: 'Google Email 尚未驗證，無法登入' })

    let rows = await sql`select * from users where google_id = ${googleId} limit 1`
    if (!rows.length) {
      rows = await sql`select * from users where lower(email) = ${email} limit 1`
      if (!rows.length) {
        const setupToken = await signToken({
          kind: 'google_setup',
          googleId,
          email,
          googleName: googleProfile.name || '',
          googlePicture: googleProfile.picture || '',
        }, env.JWT_SECRET || 'uniplan-dev-secret')
        return redirectToApp(request, { google_setup: setupToken })
      }
      const existing = rows[0]
      if (existing.google_id && existing.google_id !== googleId) {
        return redirectToApp(request, { google_error: '此 Email 已綁定其他 Google 帳號' })
      }
      const updated = await sql`
        update users
        set google_id = ${googleId}, email_verified = true, updated_at = now(), profile = coalesce(profile, '{}'::jsonb) || ${JSON.stringify({ googleName: googleProfile.name || '', googlePicture: googleProfile.picture || '', boundGoogle: true })}::jsonb
        where id = ${existing.id}
        returning *
      `
      rows = updated
    }

    const row = rows[0]
    if (!row.email_verified) {
      await sql`update users set email_verified = true, updated_at = now() where id = ${row.id}`
      row.email_verified = true
    }
    await sql`update users set last_login = now(), updated_at = now() where id = ${row.id}`
    const user = publicUser(row)
    const token = await signToken({ uid: user.id, sid: user.studentId }, env.JWT_SECRET || 'uniplan-dev-secret')
    return redirectToApp(request, { google_token: token })
  } catch (err) {
    return redirectToApp(request, { google_error: err?.message || 'Google 登入失敗' })
  }
}

async function handleGoogleComplete(request, env, sql) {
  const body = await readBody(request)
  const setupToken = String(body.setup_token || body.setupToken || '')
  const payload = await verifyToken(setupToken, env.JWT_SECRET || 'uniplan-dev-secret')
  if (!payload || payload.kind !== 'google_setup' || !payload.googleId || !payload.email) return error('Google 首次設定憑證已失效，請重新使用 Google 登入', 401)

  const studentId = normalizeStudentId(body.student_id || body.studentId)
  const email = normalizeEmail(payload.email)
  if (!/^\d{9}$/.test(studentId)) return error('請輸入 9 碼學號')
  const exists = await sql`select id, student_id, email from users where student_id = ${studentId} or lower(email) = ${email} or google_id = ${payload.googleId} limit 1`
  if (exists.length) return error('此學號、Email 或 Google 帳號已被註冊', 409)

  const parsed = parseStudentIdLocal(studentId)
  const profile = profileFromBody({
    ...body,
    displayName: body.displayName || body.display_name || payload.googleName || studentId,
    email,
    department: body.department || parsed.department_name || '',
    grade: body.grade || parsed.start_grade || (parsed.program_code === '4' ? '大一' : ''),
    admissionYear: body.admissionYear || body.admission_year || parsed.admission_year || '',
    google_bound: true,
    email_bound: true,
  })
  const role = ADMIN_STUDENT_IDS.has(studentId) ? 'super_admin' : 'student'
  const salt = randomSalt()
  const passwordHash = await hashPassword(randomSalt(), salt)
  const rows = await sql`
    insert into users (student_id, email, display_name, password_hash, password_salt, role, profile, google_id, email_verified, created_at, updated_at, last_login)
    values (${studentId}, ${email}, ${profile.displayName || studentId}, ${passwordHash}, ${salt}, ${role}, ${JSON.stringify({ ...profile, googleName: payload.googleName || '', googlePicture: payload.googlePicture || '', boundGoogle: true, boundEmail: true })}, ${payload.googleId}, true, now(), now(), now())
    returning *
  `
  const user = publicUser(rows[0])
  const token = await signToken({ uid: user.id, sid: user.studentId }, env.JWT_SECRET || 'uniplan-dev-secret')
  return json({ ok: true, token, user, profile: rows[0].profile || {}, data: await loadUserBundle(sql, user.id), message: 'Google 帳號已完成首次設定' })
}

const TKU_PROGRAMS = { '2': '進學班', '3': '未知學制', '4': '學士生', '6': '碩士生', '7': '碩士在職專班 / 轉入大二', '8': '博士生 / 轉入大三' }
const TKU_IDENTITIES = { '0': '本地生', '1': '本地生', '2': '本地生', '3': '本地生', '4': '陸生', '5': '境外生', '6': '僑、港、澳生 / 身障生', '7': '轉學生（大二轉入）', '8': '轉學生（大三轉入）' }
const TKU_DEPARTMENTS = { '73': ['教育科技學系', '教育學院'], '71': ['教育與未來設計學系', '教育學院'], '77': ['人工智慧學系', 'AI創智學院'] }
function calcCheckDigit(first8) {
  const weights = [1, 2, 1, 2, 1, 2, 1, 2]
  const sum = first8.split('').reduce((total, ch, index) => {
    const product = Number(ch) * weights[index]
    return total + (product >= 10 ? product - 9 : product)
  }, 0)
  return 9 - (sum % 10)
}
function parseStudentIdLocal(studentId) {
  const sid = normalizeStudentId(studentId)
  if (!/^\d{9}$/.test(sid)) return { valid: false, reason: '學號必須為 9 碼數字' }
  const expected = calcCheckDigit(sid.slice(0, 8))
  if (expected !== Number(sid[8])) return { valid: false, reason: `學號檢查碼錯誤，應為 ${expected}` }
  const dept = TKU_DEPARTMENTS[sid.slice(3, 5)] || ['待確認系所', '']
  const yearCode = Number(sid.slice(1, 3))
  const admissionYear = yearCode <= 14 ? yearCode + 100 : yearCode
  return { valid: true, student_id: sid, program_code: sid[0], program_name: TKU_PROGRAMS[sid[0]] || '未知學制', admission_year: admissionYear, admission_ad_year: admissionYear + 1911, department_code: sid.slice(3, 5), department_name: dept[0], college: dept[1], identity_code: sid[5], identity_name: TKU_IDENTITIES[sid[5]] || '未知身分' }
}


function normalizeCourseCatalogTerm(value) {
  const raw = String(value || '').trim()
  if (!raw || raw === '全部') return ''
  if (/1142CLASS/i.test(raw) || /114\s*[_-]?\s*2/.test(raw) || /114\s*下/.test(raw) || /1142/.test(raw) || /114學年度下/.test(raw) || /下學期/.test(raw) || /2CLASS/i.test(raw)) return '1142CLASS'
  if (/1141CLASS/i.test(raw) || /114\s*[_-]?\s*1/.test(raw) || /114\s*上/.test(raw) || /1141/.test(raw) || /114學年度上/.test(raw) || /上學期/.test(raw) || /1CLASS/i.test(raw)) return '1141CLASS'
  return raw
}

function courseHaystack(course) {
  return [
    course.name,
    course.course_name,
    course.teacher,
    course.instructor,
    course.serial,
    course.code,
    course.course_id,
    course.department,
    course.major,
    course.category,
    course.class_name,
    course.notes,
  ].filter(Boolean).join(' ').toLowerCase()
}

function courseMatchesQuery(course, searchParams) {
  const keyword = String(searchParams.get('keyword') || '').trim().toLowerCase()
  const semester = normalizeCourseCatalogTerm(searchParams.get('semester') || searchParams.get('term') || searchParams.get('catalogTerm'))
  const department = String(searchParams.get('department') || '').trim()
  const grade = String(searchParams.get('grade') || '').trim()
  const weekday = String(searchParams.get('weekday') || '').trim()
  const period = String(searchParams.get('period') || '').trim()
  if (keyword && !courseHaystack(course).includes(keyword)) return false
  const courseTerm = normalizeCourseCatalogTerm(course.semester_source || course.semester || course.term || course.source_term || course.catalog_term)
  if (semester && courseTerm !== semester) return false
  if (department && department !== '全部' && String(course.department || '') !== department) return false
  if (grade && grade !== '全部' && String(course.grade || '') !== grade) return false
  const timeText = String(course.time_info || course.time_data || '')
  if (weekday && weekday !== '全部' && !timeText.includes(weekday)) return false
  if (period && period !== '全部' && !timeText.includes(String(period))) return false
  return true
}

function mapCourseRow(row) {
  return {
    id: row.id,
    semester_source: row.semester_source || '',
    semester: row.semester_source || '',
    serial: row.serial || '',
    code: row.code || '',
    course_code: row.code || '',
    course_id: row.code || row.serial || '',
    name: row.name || '',
    course_name: row.name || '',
    credits: row.credits === null || row.credits === undefined ? null : Number(row.credits),
    category: row.category || '',
    teacher: row.teacher || '',
    instructor: row.teacher || '',
    classroom: row.classroom || '',
    room: row.classroom || '',
    capacity: row.capacity || '',
    time_data: Array.isArray(row.time_data) ? row.time_data : [],
    time_info: row.time_info || '',
    department: row.department || '',
    grade: row.grade || '',
    major: row.major || '',
    sem_seq: row.sem_seq || '',
    class_name: row.class_name || '',
    group_type: row.group_type || '',
    notes: row.notes || '',
    raw_json: row.raw_json || {},
  }
}

async function handleCourses(request, env) {
  const url = new URL(request.url)
  const sql = getSql(env)
  const keyword = String(url.searchParams.get('keyword') || '').trim()
  const semester = normalizeCourseCatalogTerm(url.searchParams.get('semester') || url.searchParams.get('term') || url.searchParams.get('catalogTerm'))
  const department = String(url.searchParams.get('department') || '').trim()
  const grade = String(url.searchParams.get('grade') || '').trim()
  const weekday = String(url.searchParams.get('weekday') || '').trim()
  const period = String(url.searchParams.get('period') || '').trim()

  let rows = []
  let neonError = null
  try {
    rows = await sql`
      SELECT
        id,
        semester_source,
        serial,
        code,
        name,
        credits,
        category,
        teacher,
        classroom,
        capacity,
        time_data,
        time_info,
        department,
        grade,
        major,
        sem_seq,
        class_name,
        group_type,
        notes,
        raw_json
      FROM courses
      WHERE (${semester} = '' OR semester_source = ${semester})
        AND (${department} = '' OR ${department} = '全部' OR department = ${department})
        AND (${grade} = '' OR ${grade} = '全部' OR grade = ${grade})
      ORDER BY semester_source, department NULLS LAST, serial NULLS LAST, code NULLS LAST, name
      LIMIT 5000
    `
  } catch (err) {
    // Neon / D1 資料庫暫時失敗時，仍回傳本地補丁課程，避免課程搜尋整個 500。
    neonError = err?.message || 'course database unavailable'
    rows = []
  }

  const searchParams = new URLSearchParams()
  if (keyword) searchParams.set('keyword', keyword)
  if (semester) searchParams.set('semester', semester)
  if (department) searchParams.set('department', department)
  if (grade) searchParams.set('grade', grade)
  if (weekday) searchParams.set('weekday', weekday)
  if (period) searchParams.set('period', period)

  const neonCourses = rows.map(mapCourseRow)
  const existing = new Set(neonCourses.map(patchedCourseKey))
  const patchedCourses = PATCHED_COMMON_COURSES
    .map(normalizePatchedCourse)
    .filter((course) => !existing.has(patchedCourseKey(course)))

  const data = [...neonCourses, ...patchedCourses]
    .filter((course) => courseMatchesQuery(course, searchParams))
    .slice(0, 500)

  return json({ ok: true, data, total: data.length, source: neonError ? 'local-patches-fallback' : 'neon-courses-with-local-patches', warning: neonError || undefined })
}


async function handlePublicFeedback(request, env, sql, method) {
  if (method === 'GET') {
    const url = new URL(request.url)
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') || 20)))
    const rows = await sql`
      SELECT id, type, title, detail, status, payload, created_at
      FROM public_feedback
      ORDER BY created_at DESC
      LIMIT ${limit}
    `
    return json({ ok: true, data: rows.map((row) => ({
      id: row.id,
      type: row.type,
      title: row.title,
      detail: row.detail,
      status: row.status,
      attachments: row.payload?.attachments || [],
      courseMeta: row.payload?.courseMeta || {},
      created_at: row.created_at,
    })) })
  }
  const body = await readBody(request)
  const id = String(body.id || `fb-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`)
  const type = String(body.type || '功能問題').slice(0, 80)
  const title = String(body.title || type).slice(0, 200)
  const detail = String(body.detail || '').slice(0, 5000)
  const attachments = Array.isArray(body.attachments) ? body.attachments.slice(0, 3) : []
  const payload = { ...body, attachments }
  await sql`
    INSERT INTO public_feedback (id, type, title, detail, status, payload)
    VALUES (${id}, ${type}, ${title}, ${detail}, '待處理', ${JSON.stringify(payload)})
    ON CONFLICT (id) DO UPDATE SET
      type = EXCLUDED.type,
      title = EXCLUDED.title,
      detail = EXCLUDED.detail,
      payload = EXCLUDED.payload
  `
  return json({ ok: true, data: { id, type, title, detail, status: '待處理', attachments, createdAt: new Date().toISOString() } })
}

async function handleCourseMetadata(request, env) {
  const sql = getSql(env)
  let departments = []
  let majors = []
  let grades = []
  let categories = []
  let semesters = []
  let neonError = null
  try {
    ;[departments, majors, grades, categories, semesters] = await Promise.all([
      sql`SELECT DISTINCT department AS value FROM courses WHERE department IS NOT NULL AND department <> '' ORDER BY department LIMIT 500`,
      sql`SELECT DISTINCT major AS value FROM courses WHERE major IS NOT NULL AND major <> '' ORDER BY major LIMIT 500`,
      sql`SELECT DISTINCT grade AS value FROM courses WHERE grade IS NOT NULL AND grade <> '' ORDER BY grade LIMIT 200`,
      sql`SELECT DISTINCT category AS value FROM courses WHERE category IS NOT NULL AND category <> '' ORDER BY category LIMIT 300`,
      sql`SELECT DISTINCT semester_source AS value FROM courses WHERE semester_source IS NOT NULL AND semester_source <> '' ORDER BY semester_source LIMIT 100`,
    ])
  } catch (err) {
    neonError = err?.message || 'course metadata database unavailable'
  }
  const notClass = (item) => !/^[A-ZＡ-Ｚ]班?$|^[甲乙丙丁戊己庚辛壬癸]班?$|^[A-Z]$/i.test(String(item || '').trim())
  const values = (rows) => rows.map((row) => row.value).filter(Boolean)
  const unique = (items) => [...new Set(items.filter(Boolean))]
  return json({
    ok: true,
    data: {
      departments: unique([...values(departments), ...PATCHED_COMMON_COURSES.map((c) => c.department)]).filter(notClass).sort(),
      majors: values(majors).filter(notClass),
      grades: unique([...values(grades), ...PATCHED_COMMON_COURSES.map((c) => c.grade)]),
      categories: unique([...values(categories), ...PATCHED_COMMON_COURSES.map((c) => c.category)]),
      semesters: unique([...values(semesters).map(normalizeCourseCatalogTerm), ...PATCHED_COMMON_COURSES.map((c) => normalizeCourseCatalogTerm(c.semester_source))]).filter(Boolean).sort(),
    },
    source: neonError ? 'local-patches-fallback' : 'neon-courses-with-local-patches',
    warning: neonError || undefined,
  })
}

export async function onRequest(context) {
  const { request, env, params } = context
  if (request.method === 'OPTIONS') return new Response(null, { headers: jsonHeaders })
  try {
    const path = `/${(params.path || []).join('/')}`.replace(/\/+/g, '/')
    const method = request.method.toUpperCase()

    if (method === 'GET' && path === '/courses') return handleCourses(request, env)
    if (method === 'GET' && path === '/courses/metadata') return handleCourseMetadata(request, env)

    const sql = getSql(env)
    await ensureSchema(sql)

    if (method === 'GET' && path === '/auth/google/start') return handleGoogleStart(request, env)
    if (method === 'GET' && path === '/auth/google/callback') return handleGoogleCallback(request, env, sql)
    if (method === 'POST' && path === '/auth/google/complete') return handleGoogleComplete(request, env, sql)
    if (method === 'POST' && path === '/auth/register') return handleRegister(request, env, sql)
    if (method === 'POST' && path === '/auth/login') return handleLogin(request, env, sql)
    if (method === 'POST' && path === '/auth/logout') return json({ ok: true })
    if (method === 'POST' && path === '/auth/verify-email') return handleVerifyEmail(request, env, sql)
    if (method === 'POST' && path === '/auth/verification/resend') return handleResendVerification(request, env, sql)
    if (method === 'POST' && path === '/auth/password/request') return handlePasswordRequest(request, env, sql)
    if (method === 'POST' && path === '/auth/password/reset') return handlePasswordReset(request, env, sql)
    if (method === 'GET' && path === '/auth/me') return handleMe(request, env, sql)
    if (method === 'PUT' && path === '/auth/profile') return handleProfile(request, env, sql)
    if (method === 'GET' && path === '/user/data') return handleGetUserData(request, env, sql)
    if (['PUT', 'POST'].includes(method) && path === '/user/data') return handlePutUserData(request, env, sql)
    if (method === 'GET' && path === '/user/welcome') return handleGetWelcome(request, env, sql)
    if (['PUT', 'POST'].includes(method) && path === '/user/welcome') return handlePutWelcome(request, env, sql)
    if (path === '/user/favorites' && ['GET', 'PUT'].includes(method)) return handleFavorites(request, env, sql, method)
    if (path === '/user/settings' && ['GET', 'PUT', 'POST'].includes(method)) return handleSettings(request, env, sql, method === 'POST' ? 'PUT' : method)
    if (path === '/feedback' && ['GET', 'POST'].includes(method)) return handlePublicFeedback(request, env, sql, method)
    if (method === 'POST' && path === '/admin/courses/import') return handleAdminCourseImport(request, env, sql)
    if (method === 'POST' && path === '/schedule') return handleSchedule(request, env, sql, method)
    if (method === 'GET' && path.startsWith('/schedule/')) return handleSchedule(request, env, sql, method)
    if (method === 'GET' && path.startsWith('/student-id/parse/')) return json({ ok: true, data: parseStudentIdLocal(decodeURIComponent(path.slice('/student-id/parse/'.length))) })

    return error(`API route not found: ${method} ${path}`, 404)
  } catch (err) {
    return error(err?.message || 'API 執行失敗', 500)
  }
}
