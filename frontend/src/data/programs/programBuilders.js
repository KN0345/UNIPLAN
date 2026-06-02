import { PROGRAM_RULE_TYPES } from './programTypes'

export function c(name, credits = null, opts = {}) {
  return { name, credits, ...opts }
}

export function group(id, name, rules = [], courses = [], children = [], notes = []) {
  return { id, name, rules, courses, children, notes }
}

export function minCredit(credits) {
  return { type: PROGRAM_RULE_TYPES.MIN_CREDIT, credits }
}

export function minCourse(count) {
  return { type: PROGRAM_RULE_TYPES.MIN_COURSE, count }
}

export function select(count, total = null) {
  return { type: PROGRAM_RULE_TYPES.SELECT_N_OF_M, count, total }
}

export function maxCourse(count = 1) {
  return { type: PROGRAM_RULE_TYPES.MAX_COURSE, count }
}

export function maxCredit(credits) {
  return { type: PROGRAM_RULE_TYPES.MAX_CREDIT, credits }
}

export function outsideMajor(credits = 9) {
  return { type: PROGRAM_RULE_TYPES.MIN_OUTSIDE_MAJOR_CREDIT, credits }
}

export function note(text) {
  return { type: PROGRAM_RULE_TYPES.NOTE, text }
}
