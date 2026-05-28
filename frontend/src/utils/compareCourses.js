import { COURSE_TAGS, countCourseTagVotes } from '../data/courses/courseTags'
import { credits, getCourse, reviewKey, slotsOf } from './coursePlanning'

export function topCourseTag(course, tagVotes = {}) {
  const key = reviewKey(getCourse(course))
  const ranked = COURSE_TAGS.map((tag) => ({ tag, count: countCourseTagVotes(tagVotes, key, tag) }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-Hant'))
  return ranked[0] || null
}

export function allTopTags(course, tagVotes = {}) {
  const key = reviewKey(getCourse(course))
  return COURSE_TAGS.map((tag) => ({ tag, count: countCourseTagVotes(tagVotes, key, tag) }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-Hant'))
    .slice(0, 4)
}

function compactTime(course) {
  const c = getCourse(course)
  return c.time_info || c.time || '未列時間'
}

function compareHints(rows) {
  const hints = []
  const withTime = rows.filter((r) => r.time !== '未列時間')
  const withoutTime = rows.filter((r) => r.time === '未列時間')
  if (withoutTime.length) hints.push(`未列時間：${withoutTime.map((r) => r.name).join('、')}`)
  const creditValues = [...new Set(rows.map((r) => r.creditValue))]
  if (creditValues.length > 1) hints.push(`學分不同：${rows.map((r) => `${r.name} ${r.creditValue}學分`).join('｜')}`)
  const tagRich = rows.filter((r) => r.topTagRaw)
  const easy = tagRich.filter((r) => /作業少|給分高|考試少|報告少|點名少|分組少/.test(r.topTagRaw.tag))
  const heavy = tagRich.filter((r) => /作業多|給分低|考試多|報告多|點名多|分組多/.test(r.topTagRaw.tag))
  if (easy.length) hints.push(`低負擔標籤：${easy.map((r) => `${r.name}（${r.topTagRaw.tag}）`).join('、')}`)
  if (heavy.length) hints.push(`高負擔標籤：${heavy.map((r) => `${r.name}（${r.topTagRaw.tag}）`).join('、')}`)
  if (withTime.length >= 2) {
    const sameTime = []
    for (let i = 0; i < withTime.length; i += 1) {
      for (let j = i + 1; j < withTime.length; j += 1) {
        const a = slotsOf(withTime[i].raw)
        const b = slotsOf(withTime[j].raw)
        if (a.some((x) => b.some((y) => x.day === y.day && Math.max(x.start, y.start) <= Math.min(x.end, y.end)))) sameTime.push(`${withTime[i].name} / ${withTime[j].name}`)
      }
    }
    if (sameTime.length) hints.push(`時間重疊：${sameTime.join('、')}`)
  }
  return hints.slice(0, 4)
}

export function compareCourseRows(courses = [], tagVotes = {}) {
  return (courses || []).map((course) => {
    const c = getCourse(course)
    const topTag = topCourseTag(c, tagVotes)
    const tags = allTopTags(c, tagVotes)
    const creditValue = credits(c)
    return {
      id: c.id || c.course_id || c.serial || c.code || c.name,
      name: c.name || '未命名課程',
      teacher: c.teacher || c.instructor || '尚無資料',
      time: compactTime(c),
      credits: `${creditValue} 學分`,
      creditValue,
      requirement: c.required_type || c.requiredType || c.type || c.category || '未列',
      department: c.department || c.major || c.category || '未列',
      code: c.serial || c.code || c.course_id || '未列',
      topTag: topTag ? `${topTag.tag} ${topTag.count}` : '0票',
      topTagRaw: topTag,
      tagList: tags.length ? tags.map((t) => `${t.tag} ${t.count}`).join('、') : '0票',
      raw: c,
    }
  })
}

export function compareCourseHints(courses = [], tagVotes = {}) {
  return compareHints(compareCourseRows(courses, tagVotes))
}
