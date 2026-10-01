import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui'

const messages = {
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Use a password with at least 6 characters.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled.',
  'auth/network-request-failed': 'You appear to be offline. Check your connection.',
}
const field = 'mt-1 w-full rounded-lg border border-pine/20 bg-white px-3 py-2 text-base dark:border-white/20 dark:bg-white/5'

export default function Login() {
  const { user, ready, login, register, google } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (ready && user) return <Navigate to="/" replace />

  const attempt = async (fn) => {
    setError(''); setBusy(true)
    try { await fn() } catch (e) { console.error(e.code); setError(messages[e.code] || 'Something went wrong. Please try again.') }
    setBusy(false)
  }
  const submit = (e) => {
    e.preventDefault()
    if (!email || !pw) return setError('Enter your email and password.')
    attempt(() => (mode === 'login' ? login(email, pw) : register(email, pw)))
  }

  return (
    <div className="grid min-h-dvh place-items-center px-4">
      <form onSubmit={submit} noValidate className="w-full max-w-sm space-y-4 rounded-2xl border border-pine/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h1 className="font-display text-2xl font-bold">{mode === 'login' ? 'Sign in to Subtrack' : 'Create your account'}</h1>
        <label className="block text-sm font-medium">Email
          <input className={field} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block text-sm font-medium">Password
          <input className={field} type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={pw} onChange={(e) => setPw(e.target.value)} />
        </label>
        {error && <p role="alert" className="text-sm text-clay dark:text-saffron">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>{mode === 'login' ? 'Sign in' : 'Create account'}</Button>
        <Button type="button" variant="ghost" className="w-full" disabled={busy} onClick={() => attempt(google)}>Continue with Google</Button>
        <p className="text-center text-sm opacity-80">
          {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
          <button type="button" className="font-semibold underline" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </form>
    </div>
  )
}
