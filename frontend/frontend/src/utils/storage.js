export function safeJsonParse(value, fallback = null) {
  try {
    if (value === null || value === undefined || value === '') return fallback
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export function readStorageJson(key, fallback = null) {
  try {
    return safeJsonParse(localStorage.getItem(key), fallback)
  } catch {
    return fallback
  }
}
