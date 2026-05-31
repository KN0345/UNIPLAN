import { useEffect, useState } from 'react'
import { safeBackgroundImageValue } from '../utils/coursePlanning'

export function useAppearanceSettings() {
  const [theme] = useState(() => localStorage.getItem('uniplan:theme') || 'light')
  const [uiTheme, setUiTheme] = useState(() => localStorage.getItem('uniplan:uiTheme') || 'clean')
  const [accent, setAccent] = useState(() => localStorage.getItem('uniplan:accent') || '#2563eb')
  const [buttonAccent, setButtonAccent] = useState(() => localStorage.getItem('uniplan:buttonAccent') || '#2563eb')
  const [timetableTint, setTimetableTint] = useState(() => {
    const saved = localStorage.getItem('uniplan:timetableTint')
    return saved && saved.toLowerCase() !== '#ffffff' && saved.toLowerCase() !== '#fff' ? saved : '#101f3a'
  })
  const [timetableOpacity, setTimetableOpacity] = useState(() => {
    const saved = localStorage.getItem('uniplan:timetableOpacity')
    return saved && Number(saved) <= 1 ? saved : '0'
  })
  const [timetableBg, setTimetableBg] = useState(() => safeBackgroundImageValue(localStorage.getItem('uniplan:timetableBg') || ''))
  const [courseCardOpacity, setCourseCardOpacity] = useState(() => localStorage.getItem('uniplan:courseCardOpacity') || '0.72')

  useEffect(() => {
    delete document.body.dataset.theme
    document.body.dataset.uiTheme = uiTheme
    document.documentElement.style.setProperty('--accent', accent)
    document.documentElement.style.setProperty('--button-accent', buttonAccent)
    document.documentElement.style.setProperty('--timetable-tint', timetableTint)
    document.documentElement.style.setProperty('--timetable-opacity', timetableOpacity)
    document.documentElement.style.setProperty('--timetable-bg-image', timetableBg ? `url(${timetableBg})` : 'none')
    document.documentElement.style.setProperty('--course-card-alpha', courseCardOpacity)
    localStorage.removeItem('uniplan:theme')
    localStorage.setItem('uniplan:uiTheme', uiTheme)
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
