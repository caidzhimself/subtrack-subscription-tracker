import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as api from '../services/subscriptionService'
import { useAuth } from './AuthContext'
import { useRates } from '../hooks/useRates'
import { monthlyFactor } from '../lib/utils'

const Ctx = createContext(null)
export const useSubscriptions = () => useContext(Ctx)

export function SubscriptionProvider({ children }) {
  const { user } = useAuth()
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currency, setCurrency] = useState('USD')
  const { rates, live } = useRates()

  // Firestore -> state. The listener re-runs the UI whenever data changes (real-time).
  useEffect(() => {
    if (!user) { setSubs([]); return }
    setLoading(true)
    return api.subscribe(
      user.uid,
      (list) => { setSubs(list); setError(''); setLoading(false) },
      () => { setError('Could not load your subscriptions.'); setLoading(false) }
    )
  }, [user])

  const run = useCallback(async (fn) => {
    setError('')
    try { await fn() } catch (e) { setError('Could not save that change. Please try again.'); console.error(e) }
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
    add: (d) => run(() => api.addSubscription(user.uid, d)),
    update: (id, d) => run(() => api.updateSubscription(user.uid, id, d)),
    remove: (id) => run(() => api.deleteSubscription(user.uid, id)),
  }), [subs, loading, error, currency, live, convert, monthlyCost, run, user])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}