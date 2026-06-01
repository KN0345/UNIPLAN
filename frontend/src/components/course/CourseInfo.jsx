import { useState } from 'react'
import { PROGRAMS } from '../../data/programs/programData'
import { COURSE_TAGS, countCourseTagVotes, hasUserVotedCourseTag } from '../../data/courses/courseTags'
import { STATUS, courseCatalogTermValue, courseTermLabel, courseStatus, credits, getCourse, reviewKey, requiredTypeLabel } from '../../utils/coursePlanning'

function stripClassSuffix(value) {
  return String(value || '')
    .replace(/\s*[（(][A-ZＰPＯO0-9一二三四五六七八九十甲乙丙丁戊己庚辛壬癸]*班[）)]\s*$/i, '')
    .replace(/\s*[（(][^）)]*班[）)]\s*$/i, '')
    .trim()
}
function normalizeProgramCourseName(value) {
  return String(stripClassSuffix(value) || '').replace(/[（）()\s:：／/\-—_]/g, '').toLowerCase()
}
const COURSE_NAME_ALIASES = {
  [normalizeProgramCourseName('人工智慧')]: ['人工智慧', '人工智慧導論', '人工智慧概論', '人工智慧實務'],
}
function programNameMatchesCourse(programCourseName, actualCourseName) {
  const programName = normalizeProgramCourseName(programCourseName)
  const actualName = normalizeProgramCourseName(actualCourseName)
  if (!programName || !actualName) return false
  if (programName === actualName) return true
  const aliases = COURSE_NAME_ALIASES[programName] || []
  return aliases.map(normalizeProgramCourseName).includes(actualName)
}
function stripSchoolPrefix(value) {
  return String(value || '').replace(/^淡江大學/, '')
}
function flattenProgramGroups(groups = []) {
  return (groups || []).flatMap((group) => [group, ...flattenProgramGroups(group.children || [])])
}
function courseProgramMembership(course) {
  const name = normalizeProgramCourseName(course?.name || course?.course_name)
  if (!name) return []
  const results = []
  PROGRAMS.forEach((program) => {
    flattenProgramGroups(program.groups || []).forEach((group) => {
      const found = (group.courses || []).some((pc) => programNameMatchesCourse(pc.name, course?.name || course?.course_name))
      if (found) results.push({ program: stripSchoolPrefix(program.name), group: group.name })
    })
  })
  const seen = new Set()
  return results.filter((item) => {
    const key = `${item.program}:${item.group}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).slice(0, 12)
}

function CourseInfo({ course, reviews = [], tagVotes = {}, onTagVote, userId = '', onAddReview, onUpdateReview, onDeleteReview }) {
  const c = getCourse(course || {})
  const tags = COURSE_TAGS
  const reviewItems = Array.isArray(reviews) ? reviews : []
  const [reviewDraft, setReviewDraft] = useState({ rating: '5', content: '', tags: [] })
  const [editingReviewId, setEditingReviewId] = useState('')
  const [editingText, setEditingText] = useState('')
  if (!course || !c || Object.keys(c).length === 0) {
    return <section className="courseInfoSafe"><h3>尚未選擇課程</h3></section>
  }
  const room = c.classroom || c.room || c.location || '未列教室'
  const time = c.time_info || c.time || '未列時間'
  const code = c.code || c.serial || reviewKey(c)
  const programMemberships = courseProgramMembership(c)
  const toggleDraftTag = (tag) => {
    setReviewDraft((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((item) => item !== tag) : [...prev.tags, tag],
    }))
  }
  const submitReview = (event) => {
    event.preventDefault()
    const content = reviewDraft.content.trim()
    if (!content) return
    const rating = Math.max(1, Math.min(5, Number(reviewDraft.rating) || 5))
    onAddReview?.({
      courseKey: reviewKey(c),
      code,
      user_id: userId || 'local-user',
      userId: userId || 'local-user',
      content,
      text: content,
      rating,
      score: rating,
      tags: reviewDraft.tags.join(','),
      createdAt: new Date().toISOString(),
    })
    setReviewDraft({ rating: '5', content: '', tags: [] })
  }
  return (
    <section className="courseInfoSafe">
      <header className="courseInfoHero">
        <div>
          <span className={`courseTermBadgeInline ${courseCatalogTermValue(c) === '1142CLASS' ? 'termDown' : 'termUp'}`}>{courseTermLabel(c)}</span>
          <h2>{c.name || '未命名課程'}</h2>
          <p>{credits(c)} 學分</p>
        </div>
        <b className={`statusBadge ${STATUS[courseStatus(c)]?.tone || 'blue'}`} title={STATUS[courseStatus(c)]?.label || '正常排程'} />
      </header>
      <div className="courseInfoGrid">
        <article><span>教師</span><strong>{c.teacher || c.instructor || '尚無資料'}</strong></article>
        <article><span>時間</span><strong>{time}</strong></article>
        <article><span>教室</span><strong>{room}</strong></article>
        <article><span>開課序號</span><strong>{code || '尚無資料'}</strong></article>
        <article><span>開課單位</span><strong>{c.department || c.category || '未列'}</strong></article>
        <article><span>必/選修</span><strong>{requiredTypeLabel(c)}</strong></article>
      </div>
      <div className="courseInfoBlock courseProgramBlock">
        <h3>對應學程</h3>
        {programMemberships.length ? <div className="courseProgramTags">{programMemberships.map((item) => <span key={`${item.program}-${item.group}`}><b>{item.program}</b><small>{item.group}</small></span>)}</div> : <p className="muted">未對應學程</p>}
      </div>
      <div className="courseInfoBlock"><h3>課程簡介</h3><p>{c.description || c.note || '尚無資料'}</p></div>
      <div className="courseInfoBlock courseTagVoteBlock">
        <h3>課程標籤投票</h3>
        <div className="teacherTagGrid courseTagGrid">
          {tags.map((tag) => {
            const key = reviewKey(c)
            const active = hasUserVotedCourseTag(tagVotes, key, tag, userId || 'local-user')
            const count = countCourseTagVotes(tagVotes, key, tag)
            return <button key={tag} type="button" className={active ? 'active' : ''} onClick={() => onTagVote?.(c, tag)}><span>{tag}</span><b>{count}</b></button>
          })}
        </div>
      </div>
      <div className="courseInfoBlock">
        <h3>撰寫課程評論</h3>
        <form className="reviewForm reviewComposer" onSubmit={submitReview}>
          <label>評分
            <select value={reviewDraft.rating} onChange={(e) => setReviewDraft((prev) => ({ ...prev, rating: e.target.value }))}>
              <option value="5">5 分｜非常推薦</option>
              <option value="4">4 分｜推薦</option>
              <option value="3">3 分｜普通</option>
              <option value="2">2 分｜不太推薦</option>
              <option value="1">1 分｜不推薦</option>
            </select>
          </label>
          <div className="reviewTagPicker" aria-label="評論標籤">
            {tags.map((tag) => <button key={tag} type="button" className={reviewDraft.tags.includes(tag) ? 'active' : ''} onClick={() => toggleDraftTag(tag)}>{tag}</button>)}
          </div>
          <textarea value={reviewDraft.content} onChange={(e) => setReviewDraft((prev) => ({ ...prev, content: e.target.value }))} placeholder="課程心得，最多100字。" />
          <button type="submit" disabled={!reviewDraft.content.trim()}>送出評論</button>
        </form>
      </div>
      <div className="courseInfoBlock">
        <h3>課程心得</h3>
        {reviewItems.length ? reviewItems.map((item, index) => {
          const id = item.id || `${item.createdAt || item.timestamp || 'review'}-${index}`
          const rating = item.score || item.rating || 5
          const content = item.text || item.content || '未填寫內容'
          const tagText = Array.isArray(item.tags) ? item.tags.join('、') : String(item.tags || '').split(',').filter(Boolean).join('、')
          const isLocalOwner = Boolean(item.id)
          return (
            <article className="reviewMini" key={id}>
              <div className="reviewMiniHead"><strong>{rating} 分</strong><small>{item.user_id || item.userId || '匿名'}{item.createdAt || item.timestamp ? `｜${new Date(item.createdAt || item.timestamp).toLocaleDateString()}` : ''}</small></div>
              {tagText ? <span className="reviewMiniTags">{tagText}</span> : null}
              {editingReviewId === id ? <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} /> : <p>{content}</p>}
              {isLocalOwner ? <div className="reviewActions">
                {editingReviewId === id ? <>
                  <button type="button" onClick={() => { onUpdateReview?.(id, { content: editingText, text: editingText }); setEditingReviewId(''); setEditingText('') }}>儲存</button>
                  <button type="button" onClick={() => { setEditingReviewId(''); setEditingText('') }}>取消</button>
                </> : <>
                  <button type="button" onClick={() => { setEditingReviewId(id); setEditingText(content) }}>編輯</button>
                  <button type="button" onClick={() => onDeleteReview?.(id)}>刪除</button>
                </>}
              </div> : null}
            </article>
          )
        }) : <p className="muted">尚無心得</p>}
      </div>
    </section>
  )
}

export default CourseInfo
