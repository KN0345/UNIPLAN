import { useEffect, useState } from 'react'
import { safeBackgroundImageValue } from '../utils/coursePlanning'

const VALID_UI_THEMES = new Set(['clean', 'night', 'mist', 'forest', 'amber', 'graphite'])
const UI_THEME_ALIASES = {
  lavender: 'amber',
  sakura: 'mist',
  pink: 'mist',
  white: 'clean',
  dark: 'night',
  '清透白': 'clean',
  '粉霧櫻': 'mist',
  '櫻霧粉': 'mist',
  '琥珀墨': 'amber',
}

function normalizeUiTheme(value) {
  const raw = String(value || '').trim()
  const mapped = UI_THEME_ALIASES[raw] || raw
  return VALID_UI_THEMES.has(mapped) ? mapped : 'clean'
}

function normalizeUnit(value, fallback) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return String(Math.max(0, Math.min(1, n)))
}

export function useAppearanceSettings() {
  const [theme] = useState(() => localStorage.getItem('uniplan:theme') || 'light')
  const [uiTheme, setUiThemeRaw] = useState(() => normalizeUiTheme(localStorage.getItem('uniplan:uiTheme') || 'clean'))
  const [accent, setAccent] = useState(() => localStorage.getItem('uniplan:accent') || '#2563eb')
  const [buttonAccent, setButtonAccent] = useState(() => localStorage.getItem('uniplan:buttonAccent') || '#2563eb')
  const [timetableTint, setTimetableTint] = useState(() => {
    const saved = localStorage.getItem('uniplan:timetableTint')
    return saved && saved.toLowerCase() !== '#ffffff' && saved.toLowerCase() !== '#fff' ? saved : '#101f3a'
  })
  const [timetableOpacity, setTimetableOpacityRaw] = useState(() => normalizeUnit(localStorage.getItem('uniplan:timetableOpacity'), '0'))
  const [timetableBg, setTimetableBg] = useState(() => safeBackgroundImageValue(localStorage.getItem('uniplan:timetableBg') || ''))
  const [courseCardOpacity, setCourseCardOpacityRaw] = useState(() => normalizeUnit(localStorage.getItem('uniplan:courseCardOpacity'), '0.72'))

  const setUiTheme = (value) => setUiThemeRaw(normalizeUiTheme(value))
  const setTimetableOpacity = (value) => setTimetableOpacityRaw(normalizeUnit(value, '0'))
  const setCourseCardOpacity = (value) => setCourseCardOpacityRaw(normalizeUnit(value, '0.72'))

  useEffect(() => {
    delete document.body.dataset.theme
    document.body.dataset.uiTheme = normalizeUiTheme(uiTheme)
    document.documentElement.style.setProperty('--accent', accent)
    document.documentElement.style.setProperty('--button-accent', buttonAccent)
    document.documentElement.style.setProperty('--timetable-tint', timetableTint)
    document.documentElement.style.setProperty('--timetable-opacity', timetableOpacity)
    document.documentElement.style.setProperty('--timetable-bg-image', timetableBg ? `url(${timetableBg})` : 'none')
    document.documentElement.style.setProperty('--course-card-alpha', courseCardOpacity)
    localStorage.removeItem('uniplan:theme')
    localStorage.setItem('uniplan:uiTheme', normalizeUiTheme(uiTheme))
    localStorage.setItem('uniplan:accent', accent)
    localStorage.setItem('uniplan:buttonAccent', buttonAccent)
    localStorage.setItem('uniplan:timetableTint', timetableTint)
    localStorage.setItem('uniplan:timetableOpacity', timetableOpacity)
    if (timetableBg) localStorage.setItem('uniplan:timetableBg', timetableBg)
    else localStorage.removeItem('uniplan:timetableBg')
    localStorage.setItem('uniplan:courseCardOpacity', courseCardOpacity)
  }, [uiTheme, accent, buttonAccent, timetableTint, timetableOpacity, timetableBg, courseCardOpacity])

  return {
    theme,
    uiTheme,
    setUiTheme,
    accent,
    setAccent,
    buttonAccent,
    setButtonAccent,
    timetableTint,
    setTimetableTint,
    timetableOpacity,
    setTimetableOpacity,
    timetableBg,
    setTimetableBg,
    courseCardOpacity,
    setCourseCardOpacity,
  }
}
