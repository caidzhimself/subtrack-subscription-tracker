import { Link } from 'react-router-dom'
import config from '../data/config.json'
import { useSubscriptions } from '../context/SubscriptionContext'
import { daysUntil, fmtDate, money, nextRenewal } from '../lib/utils'
import { EmptyState, Skeleton } from '../components/ui'

export default function Dashboard() {
  const { subs, loading, error, currency, setCurrency, monthlyCost, liveRates } = useSubscriptions()

  if (loading) return <div className="space-y-4"><Skeleton className="h-40" /><Skeleton className="h-48" /></div>

  const monthly = subs.reduce((t, s) => t + monthlyCost(s), 0)
  const upcoming = subs.map((s) => ({ s, d: nextRenewal(s) })).sort((a, b) => a.d - b.d).slice(0, 5)
  const byCat = Object.entries(
    subs.reduce((m, s) => ({ ...m, [s.category]: (m[s.category] || 0) + monthlyCost(s) }), {})
  ).sort((a, b) => b[1] - a[1])
  const card = 'rounded-2xl border border-pine/10 bg-white p-5 dark:border-white/10 dark:bg-white/5'

  return (
    <div className="space-y-6">
      {error && <p role="alert" className="rounded-lg bg-clay/10 p-3 text-sm text-clay dark:text-saffron">{error}</p>}

      <section className="rounded-2xl bg-pine p-6 text-white md:p-8">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm text-white/70">You spend each month on {subs.length} subscription{subs.length === 1 ? '' : 's'}</p>
          <select aria-label="Display currency" value={currency} onChange={(e) => setCurrency(e.target.value)}
            className="rounded-lg border border-white/20 bg-pine-soft px-2 py-1 text-sm">
            {config.currencies.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <p className="mt-2 font-display text-5xl font-bold md:text-6xl">{money(monthly, currency)}</p>
        <p className="mt-2 text-sm text-white/70">{money(monthly * 12, currency)} a year · {liveRates ? 'live exchange rates' : 'offline rates'}</p>
      </section>

      {subs.length === 0 ? (
        <EmptyState title="No subscriptions yet" text="Add Netflix, your gym or anything that renews, and see what it really costs."
          action={<Link to="/subscriptions" className="inline-block rounded-lg bg-pine px-4 py-2 text-sm font-semibold text-white dark:bg-saffron dark:text-pine">Add your first</Link>} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <section className={card}>
            <h2 className="font-display text-lg font-bold">Renewing next</h2>
            <ul className="mt-3 divide-y divide-pine/10 dark:divide-white/10">
              {upcoming.map(({ s, d }) => (
                <li key={s.id} className="flex items-center justify-between py-2.5">
                  <div><p className="font-medium">{s.name}</p><p className="text-xs opacity-60">{fmtDate(d)}</p></div>
                  <span className={`text-sm ${daysUntil(d) <= 7 ? 'font-semibold text-clay dark:text-saffron' : 'opacity-70'}`}>
                    {daysUntil(d) === 0 ? 'Today' : `${daysUntil(d)}d`}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className={card}>
            <h2 className="font-display text-lg font-bold">Where it goes</h2>
            <ul className="mt-3 space-y-3">
              {byCat.map(([cat, amt]) => (
                <li key={cat}>
                  <div className="flex justify-between text-sm"><span>{cat}</span><span>{money(amt, currency)}</span></div>
                  <div className="mt-1 h-2 rounded-full bg-pine/10 dark:bg-white/10">
                    <div className="h-2 rounded-full bg-saffron" style={{ width: `${(amt / monthly) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  )
}
