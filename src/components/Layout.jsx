import { NavLink, Outlet } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

const links = [
  { to: '/', label: 'Dashboard', icon: 'M3 12l9-9 9 9M5 10v10h14V10' },
  { to: '/subscriptions', label: 'Subscriptions', icon: 'M4 6h16M4 12h16M4 18h10' },
]

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
)

export default function Layout() {
  const { dark, toggle } = useTheme()
  const desk = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white'}`
  const mob = ({ isActive }) =>
    `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium ${isActive ? 'text-pine dark:text-saffron' : 'text-pine/60 dark:text-white/60'}`

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 bg-pine text-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <span className="font-display text-xl font-bold">Subtrack</span>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {links.map((l) => <NavLink key={l.to} to={l.to} end className={desk}>{l.label}</NavLink>)}
          </nav>
          <button onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-lg p-2 text-white/80 hover:bg-white/10">
            <Icon d={dark ? 'M12 3v2m0 14v2M5 12H3m18 0h-2m-2.6-6.4l-1.4 1.4M7 17l-1.4 1.4m0-12.8L7 7m10 10l1.4 1.4M12 8a4 4 0 100 8 4 4 0 000-8z' : 'M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z'} />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 md:pb-8"><Outlet /></main>

      <footer className="border-t border-pine/10 bg-white/50 pb-20 dark:border-white/10 dark:bg-white/5 md:pb-0">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-pine/70 dark:text-white/60 md:flex-row md:justify-between">
          <div>
            <p className="font-display text-base font-bold text-pine dark:text-white">Subtrack</p>
            <p>Know what you pay for, and when.</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-pine dark:text-white">Explore</p>
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/subscriptions">Subscriptions</NavLink>
          </div>
          <p className="md:self-end">COMP50075 Web Development</p>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-pine/10 bg-paper dark:border-white/10 dark:bg-[#0e1a17] md:hidden" aria-label="Mobile">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end className={mob}><Icon d={l.icon} />{l.label}</NavLink>
        ))}
      </nav>
    </div>
  )
}
