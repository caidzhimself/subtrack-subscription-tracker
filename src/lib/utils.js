export const monthlyFactor = { weekly: 52 / 12, monthly: 1, yearly: 1 / 12 }
export const cycleLabel = { weekly: 'week', monthly: 'month', yearly: 'year' }

export function nextRenewal(sub, today = new Date()) {
  const d = new Date(sub.renewalDate + 'T00:00:00')
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  let guard = 0
  while (d < start && guard++ < 1000) {
    if (sub.cycle === 'weekly') d.setDate(d.getDate() + 7)
    else if (sub.cycle === 'yearly') d.setFullYear(d.getFullYear() + 1)
    else d.setMonth(d.getMonth() + 1)
  }
  return d
}

export function daysUntil(date, today = new Date()) {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return Math.round((date - start) / 86400000)
}

export const money = (n, currency) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 2 }).format(n)

export const fmtDate = (d) =>
  d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
