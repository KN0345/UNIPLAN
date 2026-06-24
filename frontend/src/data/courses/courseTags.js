export const COURSE_TAGS = [
  '作業少',
  '作業多',
  '給分高',
  '給分低',
  '點名多',
  '點名少',
  '考試多',
  '考試少',
  '報告多',
  '報告少',
  '分組多',
  '分組少',
]

export function normalizeTagVotes(tagVotes = {}) {
  return tagVotes && typeof tagVotes === 'object' ? tagVotes : {}
}

export function courseTagVoteKey(courseKey, tag, userId = 'local-user') {
  return `course:${courseKey}:${tag}:${userId}`
}

export function courseTagPrefix(courseKey, tag) {
  return `course:${courseKey}:${tag}:`
}

export function countCourseTagVotes(tagVotes = {}, courseKey, tag) {
  const prefix = courseTagPrefix(courseKey, tag)
  return Object.keys(normalizeTagVotes(tagVotes)).filter((key) => key.startsWith(prefix) && tagVotes[key]).length
}

export function hasUserVotedCourseTag(tagVotes = {}, courseKey, tag, userId = 'local-user') {
  return Boolean(normalizeTagVotes(tagVotes)[courseTagVoteKey(courseKey, tag, userId)])
}
