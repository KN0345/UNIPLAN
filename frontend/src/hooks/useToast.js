import { useCallback, useState } from 'react'

export function useToast(timeout = 1800) {
  const [toast, setToast] = useState('')

  const notify = useCallback((message) => {
    setToast(message)
    window.setTimeout(() => {
      setToast((current) => current === message ? '' : current)
    }, timeout)
  }, [timeout])

  return { toast, notify }
}
