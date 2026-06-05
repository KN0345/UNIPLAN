import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const STORAGE_KEY = 'uniplan:uiSoundEnabled'

function safeReadEnabled() {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(STORAGE_KEY) !== '0'
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function useUISound() {
  const [enabled, setEnabled] = useState(safeReadEnabled)
  const audioCtxRef = useRef(null)
  const lastPlayedRef = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0')
    document.body.dataset.sound = enabled ? 'on' : 'off'
  }, [enabled])

  const getContext = useCallback(() => {
    if (typeof window === 'undefined') return null
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return null
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContextClass()
    return audioCtxRef.current
  }, [])

  const playTone = useCallback((steps, gainLevel = 0.035) => {
    if (!enabled) return
    const nowMs = Date.now()
    if (nowMs - lastPlayedRef.current < 45) return
    lastPlayedRef.current = nowMs

    const ctx = getContext()
    if (!ctx) return
    if (ctx.state === 'suspended') ctx.resume().catch(() => null)

    const startAt = ctx.currentTime + 0.005
    const master = ctx.createGain()
    master.gain.setValueAtTime(0.0001, startAt)
    master.gain.exponentialRampToValueAtTime(clamp(gainLevel, 0.001, 0.08), startAt + 0.015)
    master.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.22)
    master.connect(ctx.destination)

    steps.forEach((step, index) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = startAt + index * 0.055
      osc.type = step.type || 'sine'
      osc.frequency.setValueAtTime(step.freq, t)
      if (step.to) osc.frequency.exponentialRampToValueAtTime(step.to, t + (step.duration || 0.11))
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(step.gain || 0.7, t + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + (step.duration || 0.12))
      osc.connect(gain)
      gain.connect(master)
      osc.start(t)
      osc.stop(t + (step.duration || 0.12) + 0.03)
    })
  }, [enabled, getContext])

  const play = useCallback((name = 'tap') => {
    const presets = {
      tap: [{ freq: 640, to: 760, duration: 0.07, type: 'triangle', gain: 0.55 }],
      nav: [{ freq: 520, to: 700, duration: 0.09, type: 'triangle', gain: 0.55 }],
      add: [{ freq: 620, duration: 0.07, type: 'sine' }, { freq: 880, duration: 0.11, type: 'sine' }],
      drop: [{ freq: 420, to: 320, duration: 0.1, type: 'triangle', gain: 0.65 }],
      success: [{ freq: 660, duration: 0.06, type: 'sine' }, { freq: 920, duration: 0.12, type: 'sine' }],
      error: [{ freq: 220, to: 180, duration: 0.16, type: 'sawtooth', gain: 0.28 }],
    }
    playTone(presets[name] || presets.tap, name === 'error' ? 0.025 : 0.035)
  }, [playTone])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const onPointerUp = (event) => {
      const target = event.target?.closest?.('button, a, [role="button"], summary')
      if (!target || target.disabled || target.getAttribute('aria-disabled') === 'true') return
      play(target.closest('.sideNav') ? 'nav' : 'tap')
    }
    const onChange = (event) => {
      const tag = event.target?.tagName
      if (tag === 'SELECT' || event.target?.type === 'range' || event.target?.type === 'checkbox') play('tap')
    }
    const onDrop = () => play('drop')
    window.addEventListener('pointerup', onPointerUp, true)
    window.addEventListener('change', onChange, true)
    window.addEventListener('drop', onDrop, true)
    return () => {
      window.removeEventListener('pointerup', onPointerUp, true)
      window.removeEventListener('change', onChange, true)
      window.removeEventListener('drop', onDrop, true)
    }
  }, [play])

  const toggle = useCallback(() => setEnabled((current) => !current), [])

  return useMemo(() => ({ enabled, setEnabled, toggle, play }), [enabled, toggle, play])
}
