import { useSubscriptions } from '../context/SubscriptionContext'
import { cycleLabel, daysUntil, fmtDate, money, nextRenewal } from '../lib/utils'
import { Button } from './ui'

export default function SubscriptionCard({ sub, onEdit, onDelete }) {
  const { monthlyCost, currency } = useSubscriptions()
  const next = nextRenewal(sub)
  const days = daysUntil(next)

  return (
    <article className="flex flex-col rounded-2xl border border-pine/10 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-bold leading-tight">{sub.name}</h3>
          <p className="text-sm opacity-60">{sub.category}</p>
        </div>
        <p className="text-right font-semibold">{money(sub.cost, sub.currency)}
          <span className="block text-xs font-normal opacity-60">per {cycleLabel[sub.cycle]}</span>
        </p>
      </div>
      <p className={`mt-3 text-sm ${days <= 7 ? 'font-semibold text-clay dark:text-saffron' : 'opacity-80'}`}>
        {days === 0 ? 'Renews today' : days === 1 ? 'Renews tomorrow' : `Renews in ${days} days`} · {fmtDate(next)}
      </p>
      <p className="text-xs opacity-60">≈ {money(monthlyCost(sub), currency)} / month</p>
      <div className="mt-4 flex gap-2">
        <Button variant="ghost" className="flex-1" onClick={() => onEdit(sub)}>Edit</Button>
        <Button variant="ghost" className="flex-1" onClick={() => onDelete(sub)}>Delete</Button>
      </div>
    </article>
  )
}
