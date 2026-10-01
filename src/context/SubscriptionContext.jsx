import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as api from '../services/subscriptionService'
import { useRates } from '../hooks/useRates'
import { monthlyFactor } from '../lib/utils'

const Ctx = createContext(null)
export const useSubscriptions = () => useContext(Ctx)

export function SubscriptionProvider({ children }) {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currency, setCurrency] = useState('USD')
  const { rates, live } = useRates()

  const run = useCallback(async (fn) => {
    setError('')
    try { await fn(); setSubs(await api.getSubscriptions()) }
    catch (e) { setError('Something went wrong. Please try again.'); console.error(e) }
  }, [])

  useEffect(() => {
    api.getSubscriptions()
      .then(setSubs)
      .catch(() => setError('Could not load your subscriptions.'))
      .finally(() => setLoading(false))
  }, [])

  const convert = useCallback(
    (amount, from) => (amount / (rates[from] || 1)) * (rates[currency] || 1),
    [rates, currency]
  )
  const monthlyCost = useCallback(
    (s) => convert(Number(s.cost) * monthlyFactor[s.cycle], s.currency),
    [convert]
  )

  const value = useMemo(() => ({
    subs, loading, error, currency, setCurrency, liveRates: live, convert, monthlyCost,
    add: (d) => run(() => api.addSubscription(d)),
    update: (id, d) => run(() => api.updateSubscription(id, d)),
    remove: (id) => run(() => api.deleteSubscription(id)),
  }), [subs, loading, error, currency, live, convert, monthlyCost, run])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
