import { useState } from 'react'
import config from '../data/config.json'
import { Button } from './ui'

const blank = { name: '', cost: '', currency: 'USD', cycle: 'monthly', category: 'Streaming', renewalDate: '', notes: '' }
const field = 'mt-1 w-full rounded-lg border border-pine/20 bg-white px-3 py-2 text-base dark:border-white/20 dark:bg-white/5'

export default function SubscriptionForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial || blank)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const err = {}
    if (!f.name.trim()) err.name = 'Enter a name.'
    if (!(Number(f.cost) > 0)) err.cost = 'Enter a cost above 0.'
    if (!f.renewalDate) err.renewalDate = 'Pick a renewal date.'
    setErrors(err)
    if (Object.keys(err).length) return
    setSaving(true)
    await onSave({ ...f, name: f.name.trim(), cost: Number(f.cost) })
    setSaving(false)
    onClose()
  }

  const Err = ({ k }) => errors[k] ? <p className="mt-1 text-sm text-clay dark:text-saffron" role="alert">{errors[k]}</p> : null

  return (
    <div className="fixed inset-0 z-30 flex items-end bg-black/50 sm:items-center sm:justify-center" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} noValidate
        className="max-h-[92dvh] w-full space-y-3 overflow-y-auto rounded-t-2xl bg-paper p-5 dark:bg-[#14231f] sm:max-w-lg sm:rounded-2xl">
        <h2 className="font-display text-xl font-bold">{initial ? 'Edit subscription' : 'Add subscription'}</h2>
        <label className="block text-sm font-medium">Name
          <input className={field} value={f.name} onChange={set('name')} placeholder="Netflix" />
          <Err k="name" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium">Cost
            <input className={field} type="number" step="0.01" inputMode="decimal" value={f.cost} onChange={set('cost')} />
            <Err k="cost" />
          </label>
          <label className="block text-sm font-medium">Currency
            <select className={field} value={f.currency} onChange={set('currency')}>
              {config.currencies.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">Billing cycle
            <select className={field} value={f.cycle} onChange={set('cycle')}>
              {config.cycles.map((c) => <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">Category
            <select className={field} value={f.category} onChange={set('category')}>
              {config.categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium">Next renewal date
          <input className={field} type="date" value={f.renewalDate} onChange={set('renewalDate')} />
          <Err k="renewalDate" />
        </label>
        <label className="block text-sm font-medium">Notes (optional)
          <textarea className={field} rows="2" value={f.notes} onChange={set('notes')} />
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        </div>
      </form>
    </div>
  )
}
