import { useState } from 'react'
import config from '../data/config.json'
import { useSubscriptions } from '../context/SubscriptionContext'
import SubscriptionCard from '../components/SubscriptionCard'
import SubscriptionForm from '../components/SubscriptionForm'
import { Button, EmptyState, Skeleton } from '../components/ui'

const input = 'rounded-lg border border-pine/20 bg-white px-3 py-2 dark:border-white/20 dark:bg-white/5'

export default function Subscriptions() {
  const { subs, loading, error, add, update, remove } = useSubscriptions()
  const [editing, setEditing] = useState(null) // null | 'new' | sub
  const [deleting, setDeleting] = useState(null)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')

  const shown = subs.filter((s) =>
    s.name.toLowerCase().includes(q.toLowerCase()) && (cat === 'All' || s.category === cat))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Subscriptions</h1>
        <Button onClick={() => setEditing('new')}>Add subscription</Button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input aria-label="Search subscriptions" placeholder="Search by name" value={q}
          onChange={(e) => setQ(e.target.value)} className={`w-full ${input}`} />
        <select aria-label="Filter by category" value={cat} onChange={(e) => setCat(e.target.value)} className={input}>
          <option>All</option>{config.categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {error && <p role="alert" className="rounded-lg bg-clay/10 p-3 text-sm text-clay dark:text-saffron">{error}</p>}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-44" />)}</div>
      ) : shown.length === 0 ? (
        <EmptyState title={subs.length ? 'Nothing matches' : 'No subscriptions yet'}
          text={subs.length ? 'Try a different search or category.' : 'Add your first subscription to start tracking renewals.'} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((s) => <SubscriptionCard key={s.id} sub={s} onEdit={setEditing} onDelete={setDeleting} />)}
        </div>
      )}

      {editing && (
        <SubscriptionForm initial={editing === 'new' ? null : editing} onClose={() => setEditing(null)}
          onSave={(d) => (editing === 'new' ? add(d) : update(editing.id, d))} />
      )}

      {deleting && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleting(null)}>
          <div role="alertdialog" onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-paper p-5 dark:bg-[#14231f]">
            <h2 className="font-display text-lg font-bold">Delete {deleting.name}?</h2>
            <p className="mt-1 text-sm opacity-70">This removes it from your tracker. You can't undo this.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
              <Button variant="danger" onClick={async () => { await remove(deleting.id); setDeleting(null) }}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
