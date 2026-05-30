import { COURSE_TAGS, countCourseTagVotes } from '../data/courses/courseTags'
import { credits, getCourse, reviewKey, slotsOf } from './coursePlanning'

export const POSITIVE_COMPARE_TAGS = new Set(['作業少', '給分高', '點名少', '考試少', '報告少', '分組少'])
export const NEGATIVE_COMPARE_TAGS = new Set(['作業多', '給分低', '點名多', '考試多', '報告多', '分組多'])

export function tagTone(tag = '') {
  if (POSITIVE_COMPARE_TAGS.has(tag)) return 'positive'
  if (NEGATIVE_COMPARE_TAGS.has(tag)) return 'negative'
  return 'neutral'
}

export function topCourseTag(course, tagVotes = {}) {
  const key = reviewKey(getCourse(course))
  const ranked = COURSE_TAGS.map((tag) => ({ tag, count: countCourseTagVotes(tagVotes, key, tag), tone: tagTone(tag) }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-Hant'))
  return ranked[0] || null
}

export function allTopTags(course, tagVotes = {}) {
  const key = reviewKey(getCourse(course))
  return COURSE_TAGS.map((tag) => ({ tag, count: countCourseTagVotes(tagVotes, key, tag), tone: tagTone(tag) }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-Hant'))
    .slice(0, 3)
}

function cleanTeacherName(value) {
  return String(value || '')
    .replace(/（[^）]*\*{2,}[^）]*）/g, '')
    .replace(/\([^)]*\*{2,}[^)]*\)/g, '')
    .replace(/\s*,\s*/g, '、')
    .replace(/\s+/g, ' ')
    .trim()
}

function compactTime(course) {
  const c = getCourse(course)
  return c.time_info || c.time || '未列時間'
}

function coursesConflict(a, b) {
  const aSlots = slotsOf(a.raw)
  const bSlots = slotsOf(b.raw)
  return aSlots.some((x) => bSlots.some((y) => x.day === y.day && Math.max(x.start, y.start) <= Math.min(x.end, y.end)))
}

function applyCompareFlags(rows) {
  const maxCredits = Math.max(...rows.map((r) => r.creditValue), 0)
  return rows.map((row, index) => {
    const hasTimeConflict = rows.some((other, otherIndex) => otherIndex !== index && coursesConflict(row, other))
    return {
      ...row,
      hasTimeConflict,
      hasLowerCredits: maxCredits > 0 && row.creditValue < maxCredits,
    }
  })
}

export function compareCourseRows(courses = [], tagVotes = {}) {
  const rows = (courses || []).map((course) => {
    const c = getCourse(course)
    const topTag = topCourseTag(c, tagVotes)
    const tags = allTopTags(c, tagVotes)
    const creditValue = credits(c)
    return {
      id: c.id || c.course_id || c.serial || c.code || c.name,
      name: c.name || '未命名課程',
      teacher: cleanTeacherName(c.teacher || c.instructor) || '尚無資料',
      time: compactTime(c),
      room: c.classroom || c.room || c.location || '未列',
      credits: `${creditValue} 學分`,
      creditValue,
      requirement: c.required_type || c.requiredType || c.type || c.category || '未列',
      department: c.department || c.major || c.category || '未列',
      code: c.serial || c.code || c.course_id || '未列',
      topTag: topTag ? `${topTag.tag} ${topTag.count}` : '0票',
      topTagRaw: topTag,
      tags,
      tagList: tags.length ? tags.map((t) => `${t.tag} ${t.count}`).join('、') : '尚無標籤票數',
      raw: c,
    }
  })
  return applyCompareFlags(rows)
}
