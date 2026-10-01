import { useEffect, useState } from 'react'
import config from '../data/config.json'

// Dynamic data from an external JSON API; falls back to local config offline.
export function useRates() {
  const [rates, setRates] = useState(config.fallbackRates)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch('https://open.er-api.com/v6/latest/USD', { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => {
        if (d.rates) { setRates(d.rates); setLive(true) }
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [])

  return { rates, live }
}
