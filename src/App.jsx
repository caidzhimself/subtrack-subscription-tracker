import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Subscriptions from './pages/Subscriptions'
import Login from './pages/Login'
import { useAuth } from './context/AuthContext'

function Protected({ children }) {
  const { user, ready } = useAuth()
  if (!ready) return <p className="p-10 text-center">Loading…</p>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route index element={<Dashboard />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="*" element={<p className="py-10 text-center">Page not found.</p>} />
      </Route>
    </Routes>
  )
}
