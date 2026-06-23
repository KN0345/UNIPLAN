import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { fetchCourses, fetchMetadata } from '../api'
import { COURSE_CATALOG_TERMS, catalogTermForSemester, courseCatalogTermValue, courseSmartScore,  extractCourseList, findConflict, getCourse, credits, courseKey, reviewKey, requiredTypeLabel } from '../utils/coursePlanning'
import { COURSE_TAGS, countCourseTagVotes } from '../data/courses/courseTags'

function normalizeSearchText(value = '') {
  return String(value || '').replace(/[（）()\s:：／/\-—_\.．。]/g, '').toLowerCase()
}

const PHONETIC_GROUPS = [
  '郭國過鍋果', '繼際紀季計記技濟劑績', '管館冠觀關官', '理裡裏禮李里', '學薛雪', '程城成承呈', '設社射涉', '資知之支職', '料聊寮', '結節捷傑潔', '構購溝夠', '經京精菁晶', '濟季際計技記', '統同通童', '計技記季際濟', '管館冠', '企起啟', '商傷尚', '工公攻宮', '文聞蚊', '教交焦郊', '育玉遇域', '科顆柯', '院願苑', '榮容融', '譽玉育遇', '智知製置治', '慧惠會繪', '數術樹', '位味未衛', '金今津', '融容榮', '創窗闖', '新心薪', '英應鷹', '日入', '法發髮', '德得', '西希吸', '班般斑', '國郭', '際記季計技繼', '政正症', '治製志智'
]
const PHONETIC_MAP = PHONETIC_GROUPS.reduce((map, group) => {
  const chars = [...group]
  chars.forEach((char) => { map[char] = chars.filter((x) => x !== char) })
  return map
}, {})

const PHONETIC_CANONICAL_MAP = PHONETIC_GROUPS.reduce((map, group) => {
  const chars = [...group]
  const canonical = chars[0]
  chars.forEach((char) => { map[char] = canonical })
  return map
}, {})

function toPhoneticKey(value = '') {
  return [...String(value || '')]
    .map((char) => {
      if (/^[A-Za-z0-9]$/.test(char)) return char.toLowerCase()
      return PHONETIC_CANONICAL_MAP[char] || char
    })
    .join('')
    .replace(/[（）()\s:：／/\-—_\.．。，,、;；]/g, '')
    .toLowerCase()
}

function buildQueryParts(value = '') {
  const tokens = tokenizeCourseText(value).concat(String(value || '').split(/\s+/).map(normalizeSearchText)).filter(Boolean)
  return [...new Set(tokens)]
}

function expandNearSoundText(value = '') {
  const raw = String(value || '')
  const variants = new Set([raw])
  const chars = [...raw]
  chars.forEach((char, index) => {
    ;(PHONETIC_MAP[char] || []).slice(0, 8).forEach((alt) => {
      const next = [...chars]
      next[index] = alt
      variants.add(next.join(''))
    })
  })
  return [...variants].join(' ')
}

function levenshteinWithin(a = '', b = '', limit = 1) {
  a = String(a || '')
  b = String(b || '')
  if (!a || !b) return false
  if (Math.abs(a.length - b.length) > limit) return false
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i += 1) {
    let rowMin = i
    let last = prev[0]
    prev[0] = i
    for (let j = 1; j <= b.length; j += 1) {
      const temp = prev[j]
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      const next = Math.min(prev[j] + 1, prev[j - 1] + 1, last + cost)
      prev[j] = next
      last = temp
      if (next < rowMin) rowMin = next
    }
    if (rowMin > limit) return false
  }
  return prev[b.length] <= limit
}

function fuzzyTokenMatch(text = '', piece = '') {
  const target = normalizeSearchText(piece)
  if (!target || target.length < 2) return true
  if (text.includes(target)) return true
  const variants = tokenizeCourseText(expandNearSoundText(piece))
  if (variants.some((item) => item && text.includes(item))) return true
  if (target.length >= 2 && /[\u4e00-\u9fff]/.test(piece)) {
    const cjkTokens = (text.match(/[\u4e00-\u9fff]{2,8}/g) || []).flatMap((run) => {
      const out = []
      for (let size = Math.max(2, target.length - 1); size <= Math.min(run.length, target.length + 1); size += 1) {
        for (let i = 0; i <= run.length - size; i += 1) out.push(run.slice(i, i + size))
      }
      return out
    })
    if (cjkTokens.some((token) => levenshteinWithin(normalizeSearchText(token), target, 1))) return true
  }
  return false
}

const SMART_SEARCH_ALIASES = [
  ['管理學', 'guanlixue glx 管理'],
  ['教育科技', 'jiaoyukeji jykj 教科 教科系 教育科技系 教育科技學系 教育科系學系'],
  ['教育科系學系', '教育科技 教科 教科系 教育科技系 教育科技學系 jiaoyukeji jykj'],
  ['教育科技概論', 'jiaoyukejigailun jykjgl 教科概論'],
  ['人工智慧', 'rengongzhihui rgzh ai'],
  ['程式設計', 'chengshisheji chengshe cssj 程設'],
  ['資料結構', 'ziliejiegou zljg 資結'],
  ['微積分', 'weijifen wjf'],
  ['統計學', 'tongjixue tjx 統計'],
  ['經濟學', 'jingjixue jjx 經濟'],
  ['會計學', 'kuaijixue kjx 會計'],
  ['心理學', 'xinlixue xlx 心理'],
  ['英文', 'yingwen yw english'],
  ['日本', 'riben rb'],
  ['法文', 'fawen fw'],
  ['德文', 'dewen dw'],
  ['西班牙', 'xibanya xby'],
  ['永續', 'yongxu yx esg'],
  ['生成式', 'shengchengshi scs generative'],
  ['數位', 'shuwei sw digital'],
  ['商管', 'shangguan sg'],
  ['文學院', 'wenxueyuan wxy'],
  ['工學院', 'gongxueyuan gxy'],
  ['理學院', 'lixueyuan lxy'],
  ['教育學院', 'jiaoyuxueyuan jyxy'],
  ['國際', 'guoji gj'],
  ['共同科', 'gongtongke gtk'],
  ['榮譽學程', 'rongyuxuecheng ryxc'],
]



const KNOWN_DEPARTMENT_CODE_ALIASES = {
  TGAXM: ['文學院共同科碩', '文學院共同科－碩', '文學院共同科-碩', '文學院共同科', '文學院碩士共同科'],
  TGDXM: ['教育學院共同科碩', '教育學院共同－碩', '教育學院共同科-碩', '教育學院共同科', '教育學院碩士共同科'],
  TGEXM: ['工學院共同科碩', '工學院共同－碩', '工學院共同科-碩', '工學院共同科', '工學院碩士共同科'],
  TGKXM: ['創智學院共同科碩', '創智學院共同科-碩', '創智學院共同－碩', '創智學院共同科', 'AI學院共同科碩'],
  TGLXM: ['商管學院共同科碩', '商管學院共同－碩', '商管學院共同科-碩', '商管學院共同科', '商管學院碩士共同科'],
  TGSXM: ['理學院共同科碩', '理學院共同－碩', '理學院共同科-碩', '理學院共同科', '理學院碩士共同科'],
  TGAXB: ['文學院共同科日', '文學院共同科', '文學院共同科學士', '文學院共同科－日'],
  TGDXB: ['教育學院共同科日', '教育學院共同科', '教育學院共同科學士', '教育學院共同科－日'],
  TGEXB: ['工學院共同科日', '工學院共同科', '工學院共同科學士', '工學院共同科－日'],
  TGKXB: ['創智學院共同科日', '創智學院共同科', '創智學院共同科學士', 'AI學院共同科'],
  TGLXB: ['商管學院共同科日', '商管學院共同科', '商管學院共同科學士', '商管學院共同科－日'],
  TGRXB: ['國際學院共同科日', '國際學院共同科', '國際學院共同科學士', '國際學院共同科－日'],
  TGSXB: ['理學院共同科日', '理學院共同科', '理學院共同科學士', '理學院共同科－日'],
  TGAHB: ['文學院榮譽學程', '文學榮譽學程'],
  TGDHB: ['教育榮譽學程', '教育學院榮譽學程'],
  TGEHB: ['工學院榮譽學程', '工程榮譽學程'],
  TGKHB: ['AI榮譽學程', '創智榮譽學程', '創智學院榮譽學程'],
  TGLBH: ['商管榮譽學程', '商管學院榮譽學程'],
  TGRHB: ['國際榮譽學程', '國際學院榮譽學程'],
  TGSHB: ['理學院榮譽學程', '理學榮譽學程'],
  TGFHB: ['外語榮譽學程', '外語學院榮譽學程'],
}

function departmentCodeAliases(value = '') {
  const raw = String(value || '').trim()
  const normalized = raw.toUpperCase()
  const prefix = raw.match(/^([A-Za-z]{2,6}[A-Za-z0-9]{0,4})/)?.[1]?.toUpperCase()
  const aliases = new Set()
  ;[normalized, prefix].filter(Boolean).forEach((code) => {
    ;(KNOWN_DEPARTMENT_CODE_ALIASES[code] || []).forEach((item) => aliases.add(item))
  })
  Object.entries(KNOWN_DEPARTMENT_CODE_ALIASES).forEach(([code, names]) => {
    if (raw.toUpperCase().includes(code)) aliases.add(code)
    names.forEach((name) => {
      if (raw.includes(name) || normalizeSearchText(raw).includes(normalizeSearchText(name))) aliases.add(code)
    })
  })
  return [...aliases]
}

function expandSmartText(value = '') {
  const raw = String(value || '')
  const normalized = normalizeSearchText(raw)
  const chunks = [raw, normalized, expandNearSoundText(raw)]
  SMART_SEARCH_ALIASES.forEach(([word, aliases]) => {
    if (raw.includes(word) || normalized.includes(normalizeSearchText(word))) chunks.push(aliases)
  })
  departmentCodeAliases(raw).forEach((alias) => chunks.push(alias))
  return normalizeSearchText(chunks.join(' '))
}

function tokenizeCourseText(value = '') {
  const raw = String(value || '')
  const cleaned = raw.replace(/[（）()\s:：／/\-—_\.．。，,、;；]+/g, ' ').trim()
  const tokens = cleaned.split(/\s+/).filter(Boolean)
  const cjkRuns = raw.match(/[\u4e00-\u9fff]{2,}/g) || []
  cjkRuns.forEach((run) => {
    for (let size = 2; size <= Math.min(4, run.length); size += 1) {
      for (let i = 0; i <= run.length - size; i += 1) tokens.push(run.slice(i, i + size))
    }
  })
  return [...new Set(tokens.map(normalizeSearchText).filter(Boolean))]
}

function buildSearchText(course) {
  const f = fieldText(course)
  const deptAliases = extractDepartmentCandidates(course).flatMap(departmentAliases)
  const source = [f.name, f.baseName, f.code, f.teacher, f.unit, ...deptAliases].join(' ')
  return `${expandSmartText(source)} ${tokenizeCourseText(source).join(' ')}`
}

function stripClassSuffix(value = '') {
  return String(value || '')
    .replace(/\s*[（(][^）)]*班[）)]\s*$/i, '')
    .trim()
}

function fieldText(course) {
  const c = getCourse(course)
  return {
    name: String(c.name || c.course_name || ''),
    baseName: stripClassSuffix(c.name || c.course_name || ''),
    code: String(c.serial || c.code || c.course_id || ''),
    teacher: String(c.teacher || c.instructor || ''),
    unit: String(c.department || c.major || c.unit || c.category || ''),
  }
}


function extractDepartmentCandidates(course) {
  const c = getCourse(course)
  return [
    c.department,
    c.dept,
    c.major,
    c.unit,
    c.opening_unit,
    c.openingUnit,
    c.category,
    c.raw_json?.department,
    c.raw_json?.major,
    c.raw_json?.unit,
    c.raw_json?.opening_unit,
  ].map((value) => String(value || '').trim()).filter(Boolean)
}

function normalizeDepartmentOption(value = '') {
  return String(value || '').trim()
    .replace(/^系別[:：]\s*/, '')
    .replace(/^Department\s*[:：]?\s*/i, '')
    .replace(/\s+/g, ' ')
}

function departmentAliases(value = '') {
  const text = String(value || '').trim()
  const aliases = new Set([text])
  aliases.add(text.replace(/系$/, ''))

  // 共同科／榮譽學程的 department 常見格式：TGAXM.文學院共同科－碩。
  // 使用者通常會直接搜尋 TGAXM、TGDXM、TGEXB 這類代碼，所以要把代碼前綴也當成科系別名。
  const codePrefix = text.match(/^([A-Za-z]{2,6}[A-Za-z0-9]{0,4})[.．。\s_-]/)?.[1]
  if (codePrefix) aliases.add(codePrefix.toUpperCase())
  const normalizedCodePrefix = text.match(/^([A-Za-z]{2,6}[A-Za-z0-9]{0,4})/)?.[1]
  if (normalizedCodePrefix && /^TG[A-Z0-9]+$/i.test(normalizedCodePrefix)) aliases.add(normalizedCodePrefix.toUpperCase())
  departmentCodeAliases(text).forEach((item) => aliases.add(item))

  if (/共同科/.test(text)) aliases.add(text.replace(/^([A-Za-z0-9]+)[.．。]?/, ''))
  if (/企管|企業管理/.test(text)) ['企管', '企業管理', '企管系', '企業管理系'].forEach((x) => aliases.add(x))
  if (/教科|教育科技|教育科系/.test(text)) ['教科', '教育科技', '教科系', '教育科技系', '教育科技學系', '教育科系學系'].forEach((x) => aliases.add(x))
  if (/觀光/.test(text)) ['觀光', '觀光系'].forEach((x) => aliases.add(x))
  if (/資管|資訊管理/.test(text)) ['資管', '資訊管理', '資管系', '資訊管理系'].forEach((x) => aliases.add(x))
  if (/中文|中國文學/.test(text)) ['中文', '中文系', '中國文學'].forEach((x) => aliases.add(x))
  return [...aliases].map((x) => String(x || '').trim()).filter(Boolean)
}

function parseSmartQuery(rawQuery, departments = []) {
  let raw = String(rawQuery || '').trim()
  const compact = expandSmartText(raw)
  const hits = []
  ;(departments || []).forEach((dept) => {
    departmentAliases(dept).forEach((alias) => {
      const normalized = normalizeSearchText(alias)
      if (normalized && compact.includes(normalized)) hits.push({ dept, alias, normalized, length: normalized.length })
    })
  })
  hits.sort((a, b) => b.length - a.length)
  const departmentHit = hits[0] || null
  let courseQuery = raw
  if (departmentHit) {
    departmentAliases(departmentHit.dept).sort((a, b) => String(b).length - String(a).length).forEach((alias) => {
      if (!alias) return
      courseQuery = courseQuery.replaceAll(alias, ' ')
      courseQuery = courseQuery.replaceAll(alias.replace(/系$/, ''), ' ')
    })
    courseQuery = courseQuery.replace(/\s+/g, ' ').trim()
    // 如果剩下的字只是 department label 的一部分，例如「TGAXM 文學」或「TGDXM 教育」，
    // 視為純科系代碼搜尋，不再拿殘字去比對課名，避免把正確結果過濾掉。
    const leftover = normalizeSearchText(courseQuery)
    const deptText = normalizeSearchText(departmentHit.dept)
    if (leftover && deptText.includes(leftover)) courseQuery = ''
  }
  return { raw, compact, department: departmentHit?.dept || '', courseQuery: courseQuery || raw }
}

function courseMatchesQuery(course, query, departments = []) {
  const parsed = parseSmartQuery(query, departments)
  const q = expandSmartText(parsed.courseQuery)
  if (!q) return true
  const f = fieldText(course)
  const text = buildSearchText(course)
  if (text.includes(q)) return true
  const pieces = tokenizeCourseText(parsed.courseQuery || query).concat(String(parsed.courseQuery || query).split(/\s+/).map(normalizeSearchText)).filter(Boolean)
  return pieces.length > 1 && pieces.every((piece) => fuzzyTokenMatch(text, piece))
}


function courseMatchesParsed(course, parsed) {
  const q = expandSmartText(parsed?.courseQuery || '')
  if (!q) return true
  const f = fieldText(course)
  const text = buildSearchText(course)
  if (text.includes(q)) return true
  const pieces = tokenizeCourseText(parsed?.courseQuery || '').concat(String(parsed?.courseQuery || '').split(/\s+/).map(normalizeSearchText)).filter(Boolean)
  return pieces.length > 1 && pieces.every((piece) => fuzzyTokenMatch(text, piece))
}

function relevanceScoreParsed(course, parsed) {
  const c = getCourse(course)
  const q = expandSmartText(parsed?.courseQuery || '')
  if (!q && !parsed?.department) return 0
  const f = fieldText(c)
  const name = normalizeSearchText(f.name)
  const baseName = normalizeSearchText(f.baseName)
  const code = normalizeSearchText(f.code)
  const teacher = normalizeSearchText(f.teacher)
  const unit = normalizeSearchText(f.unit)
  const dept = normalizeSearchText(parsed?.department || '')
  let score = 0
  if (dept && unit.includes(dept)) score += 900
  if (baseName === q) score += 1000
  if (name === q) score += 900
  if (baseName.startsWith(q)) score += 650
  if (name.startsWith(q)) score += 600
  if (name.includes(q)) score += 420
  const phoneticQuery = toPhoneticKey(parsed?.courseQuery || '')
  if (phoneticQuery.length >= 2 && toPhoneticKey([name, teacher, unit].join(' ')).includes(phoneticQuery)) score += 360
  if (code === q) score += 500
  if (code.includes(q)) score += 180
  if (teacher.includes(q)) score += 130
  if (unit.includes(q)) score += 80
  if (dept && !unit.includes(dept)) score -= 260
  score += Math.max(0, 80 - Math.abs(name.length - q.length) * 4)
  return score
}

function relevanceScore(course, query, departments = []) {
  const c = getCourse(course)
  const parsed = parseSmartQuery(query, departments)
  const q = expandSmartText(parsed.courseQuery)
  if (!q && !parsed.department) return 0
  const f = fieldText(c)
  const name = normalizeSearchText(f.name)
  const baseName = normalizeSearchText(f.baseName)
  const code = normalizeSearchText(f.code)
  const teacher = normalizeSearchText(f.teacher)
  const unit = normalizeSearchText(f.unit)
  let score = 0
  if (parsed.department && unit.includes(normalizeSearchText(parsed.department))) score += 900
  if (baseName === q) score += 1000
  if (name === q) score += 900
  if (baseName.startsWith(q)) score += 650
  if (name.startsWith(q)) score += 600
  if (name.includes(q)) score += 420
  const phoneticQuery = toPhoneticKey(parsed?.courseQuery || '')
  if (phoneticQuery.length >= 2 && toPhoneticKey([name, teacher, unit].join(' ')).includes(phoneticQuery)) score += 360
  if (code === q) score += 500
  if (code.includes(q)) score += 180
  if (teacher.includes(q)) score += 130
  if (unit.includes(q)) score += 80
  if (parsed.department && !unit.includes(normalizeSearchText(parsed.department))) score -= 260
  score += Math.max(0, 80 - Math.abs(name.length - q.length) * 4)
  return score
}

function sameDepartmentSortKey(course) {
  const c = getCourse(course)
  return String(c.department || c.major || c.unit || c.category || '')
}

const COURSE_RESULT_RENDER_LIMIT = 120
const COURSE_RESULT_QUERY_LIMIT = 180

const DEFAULT_SEARCH_FILTERS = { department: '全部', requirement: '全部', grade: '全部', weekday: '全部', period: '全部', tag: '全部' }
const COURSE_STATE_CACHE = new Map()
const INDEXED_COURSE_CACHE = new Map()
const DEPARTMENT_OPTIONS_CACHE = new Map()
const MAJOR_OPTIONS_CACHE = new Map()
const GRADE_OPTIONS_CACHE = new Map()
let METADATA_STATE_CACHE = null

function courseStateCacheKey(term, filters = DEFAULT_SEARCH_FILTERS) {
  return JSON.stringify({
    semester: term || '全部',
    grade: filters.grade || '全部',
    weekday: filters.weekday || '全部',
    period: filters.period || '全部',
  })
}

function courseListSignature(courses = [], term = '') {
  const first = courses[0]
  const last = courses[courses.length - 1]
  return [
    term || '',
    courses.length,
    courseKey(first || {}),
    courseKey(last || {}),
    String(getCourse(first || {}).serial || getCourse(first || {}).code || ''),
    String(getCourse(last || {}).serial || getCourse(last || {}).code || ''),
  ].join('|')
}

function visibleCourseLimit(query) {
  return String(query || '').trim() ? COURSE_RESULT_QUERY_LIMIT : COURSE_RESULT_RENDER_LIMIT
}


function buildCourseSearchRecord(course) {
  const c = getCourse(course)
  const departmentCandidates = extractDepartmentCandidates(course)
  const departmentAliasText = departmentCandidates.flatMap(departmentAliases).join(' ')
  const searchText = `${buildSearchText(course)} ${expandSmartText(departmentAliasText)} ${toPhoneticKey(departmentAliasText)}`
  const f = fieldText(c)
  return {
    course,
    c,
    searchText,
    phoneticText: toPhoneticKey(searchText),
    departmentKeys: departmentCandidates.flatMap((item) => [item, ...departmentAliases(item)]).map(normalizeSearchText).filter(Boolean),
    departmentPhoneticKeys: departmentCandidates.flatMap((item) => [item, ...departmentAliases(item)]).map(toPhoneticKey).filter(Boolean),
    sortDepartment: sameDepartmentSortKey(course),
    nameSort: String(c.name || ''),
    reviewKey: reviewKey(c),
    courseKey: courseKey(course),
    smartBaseScore: courseSmartScore(course, { isFavorite: false, hasConflict: false }),
    nameText: normalizeSearchText(f.name),
    baseNameText: normalizeSearchText(f.baseName),
    codeText: normalizeSearchText(f.code),
    teacherText: normalizeSearchText(f.teacher),
    unitText: normalizeSearchText(f.unit),
  }
}

function courseRecordMatchesParsed(record, parsed) {
  const rawQuery = parsed?.courseQuery || ''
  const q = expandSmartText(rawQuery)
  if (!q) return true
  if (record.searchText.includes(q)) return true

  // 中文輸入法近音：例如「郭繼」與「國際」會轉成同一組近音鍵。
  const phoneticQuery = toPhoneticKey(rawQuery)
  if (phoneticQuery.length >= 2 && record.phoneticText.includes(phoneticQuery)) return true

  const pieces = buildQueryParts(rawQuery)
  if (pieces.length > 1 && pieces.every((piece) => {
    if (record.searchText.includes(piece)) return true
    const phoneticPiece = toPhoneticKey(piece)
    return phoneticPiece.length >= 2 && record.phoneticText.includes(phoneticPiece)
  })) return true

  // 最後才進入較重的 fuzzy 比對；只在查詢字數足夠時啟用，避免單字輸入掃完整資料集造成卡頓。
  return rawQuery.length >= 2 && pieces.length > 1 && pieces.every((piece) => fuzzyTokenMatch(record.searchText, piece))
}

function relevanceScoreRecord(record, parsed) {
  const q = expandSmartText(parsed?.courseQuery || '')
  const dept = normalizeSearchText(parsed?.department || '')
  if (!q && !dept) return 0
  const name = record.nameText
  const baseName = record.baseNameText
  const code = record.codeText
  const teacher = record.teacherText
  const unit = record.unitText
  let score = 0
  if (dept && unit.includes(dept)) score += 900
  if (baseName === q) score += 1000
  if (name === q) score += 900
  if (baseName.startsWith(q)) score += 650
  if (name.startsWith(q)) score += 600
  if (name.includes(q)) score += 420
  const phoneticQuery = toPhoneticKey(parsed?.courseQuery || '')
  if (phoneticQuery.length >= 2 && record.phoneticText.includes(phoneticQuery)) score += 360
  if (code === q) score += 500
  if (code.includes(q)) score += 180
  if (teacher.includes(q)) score += 130
  if (unit.includes(q)) score += 80
  if (dept && !unit.includes(dept)) score -= 260
  score += Math.max(0, 80 - Math.abs(name.length - q.length) * 4)
  return score
}

function requirementMatches(course, requirement) {
  if (!requirement || requirement === '全部') return true
  const label = requiredTypeLabel(course)
  if (requirement === '必修') return /必/.test(label) && !/選/.test(label)
  if (requirement === '選修') return /選/.test(label)
  return true
}

export function useCourseSearchState({ activeSemester, favorites = [], candidates = [], plan = [], tagVotes = {} }) {
  const initialCatalogTerm = localStorage.getItem('uniplan:courseCatalogTerm') ?? catalogTermForSemester('大一上')
  const initialCourseCacheKey = courseStateCacheKey(initialCatalogTerm, DEFAULT_SEARCH_FILTERS)
  const [courses, setCourses] = useState(() => COURSE_STATE_CACHE.get(initialCourseCacheKey) || [])
  const [query, setQuery] = useState('')
  const [metadata, setMetadata] = useState(() => METADATA_STATE_CACHE || { departments: [], categories: [], grades: [], majors: [], semesters: [] })
  const [searchFilters, setSearchFilters] = useState(DEFAULT_SEARCH_FILTERS)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [courseCatalogTerm, setCourseCatalogTerm] = useState(initialCatalogTerm)
  const [searchTab, setSearchTab] = useState('results')
  const [searchSort, setSearchSort] = useState('smart')
  const [searchOnlyAvailable, setSearchOnlyAvailable] = useState(false)

  async function runCourseSearch(overrides = {}) {
    const nextQuery = Object.prototype.hasOwnProperty.call(overrides, 'query') ? overrides.query : query
    const nextFilters = overrides.searchFilters || searchFilters
    const nextCatalogTerm = Object.prototype.hasOwnProperty.call(overrides, 'courseCatalogTerm') ? overrides.courseCatalogTerm : courseCatalogTerm
    setSearchLoading(true)
    setSearchError('')
    const backendKeyword = Object.prototype.hasOwnProperty.call(overrides, 'backendKeyword')
      ? overrides.backendKeyword
      : ''
    const params = {
      // 搜尋字詞只做前端即時篩選，避免每次按搜尋或切換條件時讓後端先縮掉資料池。
      // 需要後端精準查詢時可由 overrides.backendKeyword 顯式指定。
      keyword: String(backendKeyword || '').trim(),
      semester: nextCatalogTerm || '全部',
      // 科系／共同科篩選改由前端做模糊比對。
      // 不送 department 給後端，避免後端精準查詢把 TGEXB/TGLXM 等共同科整批排除。
      department: '全部',
      grade: nextFilters.grade,
      weekday: nextFilters.weekday,
      period: nextFilters.period,
    }
    const cacheKey = courseStateCacheKey(nextCatalogTerm, nextFilters)
    if (!overrides.forceRefresh && COURSE_STATE_CACHE.has(cacheKey)) {
      const cachedCourses = COURSE_STATE_CACHE.get(cacheKey)
      setCourses(cachedCourses)
      setSearchLoading(false)
      return cachedCourses
    }
    try {
      const data = await fetchCourses(params)
      const nextCourses = extractCourseList(data)
      COURSE_STATE_CACHE.set(cacheKey, nextCourses)
      setCourses(nextCourses)
      return nextCourses
    } catch (error) {
      console.error(error)
      setSearchError('課程搜尋失敗。請確認後端是否已啟動，或稍後再試。')
      return []
    } finally {
      setSearchLoading(false)
    }
  }

  useEffect(() => {
    if (METADATA_STATE_CACHE) {
      setMetadata(METADATA_STATE_CACHE)
    } else {
      fetchMetadata()
        .then((payload) => {
          const nextMetadata = payload?.data || payload || { departments: [], categories: [], grades: [], majors: [], semesters: [] }
          METADATA_STATE_CACHE = nextMetadata
          setMetadata(nextMetadata)
        })
        .catch(() => null)
    }
    if (!courses.length) runCourseSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    localStorage.setItem('uniplan:courseCatalogTerm', courseCatalogTerm)
    runCourseSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseCatalogTerm])

  const departmentPool = useMemo(() => Array.from(new Set([...(metadata.departments || []), ...(metadata.units || []), ...(metadata.majors || []), ...(courses || []).flatMap(extractDepartmentCandidates)])), [metadata, courses])
  const indexedCourses = useMemo(() => {
    const signature = courseListSignature(courses, courseCatalogTerm)
    if (INDEXED_COURSE_CACHE.has(signature)) return INDEXED_COURSE_CACHE.get(signature)
    const records = (courses || []).map(buildCourseSearchRecord)
    INDEXED_COURSE_CACHE.set(signature, records)
    return records
  }, [courses, courseCatalogTerm])
  const favoriteKeys = useMemo(() => new Set(favorites.map(courseKey)), [favorites])
  const candidateKeys = useMemo(() => new Set(candidates.map(courseKey)), [candidates])

  // 讓輸入框、注音組字、下拉篩選先完成 UI 更新，再於較低優先序計算重搜尋。
  // 這裡不改畫面結構，只把昂貴的 filter/sort 從 input/change 事件的同步路徑移開。
  const deferredQuery = useDeferredValue(query)
  const deferredSearchFilters = useDeferredValue(searchFilters)
  const deferredSearchSort = useDeferredValue(searchSort)
  const deferredSearchOnlyAvailable = useDeferredValue(searchOnlyAvailable)

  const sortedFilteredCourses = useMemo(() => {
    // Course source (114上/114下) is controlled by courseCatalogTerm and already
    // filtered by /api/courses. Do not filter again by the target timetable semester
    // here; otherwise selecting 114下 while the active timetable is 大一上 will
    // incorrectly hide every 1142CLASS course.
    const parsedQuery = parseSmartQuery(deferredQuery, departmentPool)
    const selectedDepartment = normalizeSearchText(deferredSearchFilters.department)
    const parsedDepartment = normalizeSearchText(parsedQuery.department)
    const activePlan = plan[activeSemester] || []
    const list = indexedCourses.filter((record) => {
      const c = record.c
      if (deferredSearchOnlyAvailable && findConflict(record.course, activePlan)) return false
      // 當搜尋框本身輸入 TGAXM/TGDXM/TGEXB 這類科系代碼時，搜尋意圖比舊的下拉篩選更明確。
      // 因此有 parsedQuery.department 時，暫時不讓下拉篩選互相卡住，避免選單停在 TGAXM 時搜 TGDXM 變成 0 筆。
      if (!parsedQuery.department && deferredSearchFilters.department && deferredSearchFilters.department !== '全部') {
        const selectedDepartmentPhonetic = toPhoneticKey(deferredSearchFilters.department)
        const deptMatched = record.departmentKeys.some((deptText) => deptText.includes(selectedDepartment) || selectedDepartment.includes(deptText))
          || record.departmentPhoneticKeys.some((deptText) => selectedDepartmentPhonetic && (deptText.includes(selectedDepartmentPhonetic) || selectedDepartmentPhonetic.includes(deptText)))
        if (!deptMatched) return false
      }
      if (!requirementMatches(record.course, deferredSearchFilters.requirement)) return false
      if (deferredSearchFilters.grade && deferredSearchFilters.grade !== '全部' && String(c.grade || '') !== String(deferredSearchFilters.grade)) return false
      if (parsedQuery.department) {
        const parsedDepartmentPhonetic = toPhoneticKey(parsedQuery.department)
        const deptOk = record.departmentKeys.some((item) => item.includes(parsedDepartment))
          || record.departmentPhoneticKeys.some((item) => parsedDepartmentPhonetic && item.includes(parsedDepartmentPhonetic))
        if (!deptOk) return false
      }
      if (deferredQuery && !courseRecordMatchesParsed(record, parsedQuery)) return false
      return true
    })
    const tagFilter = deferredSearchFilters.tag || '全部'
    const limit = visibleCourseLimit(deferredQuery)
    const limitedCourses = (records) => records.slice(0, limit).map((record) => record.course)
    if (tagFilter !== '全部') {
      return limitedCourses(list.sort((a, b) => {
        const scoreB = countCourseTagVotes(tagVotes, b.reviewKey, tagFilter)
        const scoreA = countCourseTagVotes(tagVotes, a.reviewKey, tagFilter)
        if (scoreB !== scoreA) return scoreB - scoreA
        return a.nameSort.localeCompare(b.nameSort, 'zh-Hant')
      }))
    }
    const queryText = String(deferredQuery || '').trim()
    if (queryText && (deferredSearchSort === 'smart' || deferredSearchSort === 'default')) {
      const scored = list.map((record) => ({ record, score: relevanceScoreRecord(record, parsedQuery) }))
      return limitedCourses(scored.sort((a, b) => {
        const diff = b.score - a.score
        if (diff) return diff
        const deptDiff = a.record.sortDepartment.localeCompare(b.record.sortDepartment, 'zh-Hant')
        if (deptDiff) return deptDiff
        return a.record.nameSort.localeCompare(b.record.nameSort, 'zh-Hant')
      }).map((item) => item.record))
    }
    if (deferredSearchSort === 'credits' || deferredSearchSort === 'creditsDesc') return limitedCourses(list.sort((a, b) => credits(b.course) - credits(a.course)))
    if (deferredSearchSort === 'name') return limitedCourses(list.sort((a, b) => a.nameSort.localeCompare(b.nameSort, 'zh-Hant')))
    if (deferredSearchSort === 'favorite') return limitedCourses(list.sort((a, b) => Number(favoriteKeys.has(b.courseKey)) - Number(favoriteKeys.has(a.courseKey))))
    if (deferredSearchSort === 'candidate') return limitedCourses(list.sort((a, b) => Number(candidateKeys.has(b.courseKey)) - Number(candidateKeys.has(a.courseKey))))
    const smartScored = list.map((record) => {
      let score = record.smartBaseScore
      if (favoriteKeys.has(record.courseKey)) score += 35
      if (candidateKeys.has(record.courseKey)) score += 25
      return { record, score }
    })
    return limitedCourses(smartScored.sort((a, b) => b.score - a.score).map((item) => item.record))
  }, [indexedCourses, activeSemester, deferredSearchOnlyAvailable, deferredSearchSort, favoriteKeys, candidateKeys, plan, deferredSearchFilters.tag, deferredSearchFilters.department, deferredSearchFilters.requirement, deferredSearchFilters.grade, tagVotes, deferredQuery, departmentPool])

  const majorOptions = useMemo(() => {
    const signature = courseListSignature(courses, courseCatalogTerm)
    const cacheKey = `major:${signature}:${(metadata.majors || []).length}`
    if (MAJOR_OPTIONS_CACHE.has(cacheKey)) return MAJOR_OPTIONS_CACHE.get(cacheKey)
    const options = Array.from(new Set([...(metadata.majors || []), ...courses.map((course) => getCourse(course).major).filter(Boolean)])).filter(Boolean).slice(0, 300)
    MAJOR_OPTIONS_CACHE.set(cacheKey, options)
    return options
  }, [metadata, courses, courseCatalogTerm])
  const departmentOptions = useMemo(() => {
    const signature = courseListSignature(courses, courseCatalogTerm)
    const cacheKey = `department:${signature}:${(metadata.departments || []).length}:${(metadata.units || []).length}:${(metadata.majors || []).length}`
    if (DEPARTMENT_OPTIONS_CACHE.has(cacheKey)) return DEPARTMENT_OPTIONS_CACHE.get(cacheKey)
    const isRealDepartment = (value) => {
      const text = normalizeDepartmentOption(value)
      if (!text) return false
      if (/^[A-ZＡ-Ｚ]班?$/.test(text)) return false
      if (/^[甲乙丙丁戊己庚辛壬癸]班?$/.test(text)) return false
      if (/^[ABCD]$/.test(text)) return false
      if (/^\d+$/.test(text)) return false
      if (/^(必|選|必修|選修|學分|年級|群別|班別)$/.test(text)) return false
      return true
    }
    const fromMetadata = [
      ...(metadata.departments || []),
      ...(metadata.departmentOptions || []),
      ...(metadata.units || []),
      ...(metadata.openingUnits || []),
      ...(metadata.majors || []),
    ]
    const fromCourses = courses.flatMap(extractDepartmentCandidates)
    const options = Array.from(new Set([...fromMetadata, ...fromCourses].map(normalizeDepartmentOption)))
      .filter(isRealDepartment)
      .sort((a, b) => String(a).localeCompare(String(b), 'zh-Hant'))
      .slice(0, 800)
    const result = ['全部', ...options]
    DEPARTMENT_OPTIONS_CACHE.set(cacheKey, result)
    return result
  }, [metadata, courses, courseCatalogTerm])
  const gradeOptions = useMemo(() => {
    const signature = courseListSignature(courses, courseCatalogTerm)
    const cacheKey = `grade:${signature}:${(metadata.grades || []).length}`
    if (GRADE_OPTIONS_CACHE.has(cacheKey)) return GRADE_OPTIONS_CACHE.get(cacheKey)
    const options = Array.from(new Set([...(metadata.grades || []), ...courses.map((course) => getCourse(course).grade).filter(Boolean)])).filter(Boolean).slice(0, 120)
    GRADE_OPTIONS_CACHE.set(cacheKey, options)
    return options
  }, [metadata, courses, courseCatalogTerm])

  return {
    courses,
    setCourses,
    query,
    setQuery,
    metadata,
    searchFilters,
    setSearchFilters,
    searchLoading,
    searchError,
    courseCatalogTerm,
    setCourseCatalogTerm,
    searchTab,
    setSearchTab,
    searchSort,
    setSearchSort,
    searchOnlyAvailable,
    setSearchOnlyAvailable,
    sortedFilteredCourses,
    majorOptions,
    departmentOptions,
    gradeOptions,
    courseTagOptions: COURSE_TAGS,
    runCourseSearch,
    COURSE_CATALOG_TERMS,
    courseCatalogTermValue,
  }
}
