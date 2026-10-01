export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl bg-pine/10 dark:bg-white/10 ${className}`} />
)

export const EmptyState = ({ title, text, action }) => (
  <div className="rounded-2xl border border-dashed border-pine/25 p-8 text-center dark:border-white/20">
    <h3 className="font-display text-lg font-bold">{title}</h3>
    <p className="mx-auto mt-1 max-w-sm text-sm opacity-70">{text}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
)

export const Button = ({ variant = 'primary', className = '', ...p }) => {
  const v = {
    primary: 'bg-pine text-white hover:bg-pine-soft dark:bg-saffron dark:text-pine dark:hover:bg-saffron/90',
    ghost: 'border border-pine/20 hover:bg-pine/5 dark:border-white/20 dark:hover:bg-white/10',
    danger: 'bg-clay text-white hover:bg-clay/90',
  }[variant]
  return <button className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${v} ${className}`} {...p} />
}
