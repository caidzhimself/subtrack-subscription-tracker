import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword,
  signInWithPopup, signOut,
} from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false) // false until Firebase restores the session

  useEffect(() => onAuthStateChanged(auth, (u) => { setUser(u); setReady(true) }), [])

  const value = {
    user, ready,
    login: (email, pw) => signInWithEmailAndPassword(auth, email, pw),
    register: (email, pw) => createUserWithEmailAndPassword(auth, email, pw),
    google: () => signInWithPopup(auth, googleProvider),
    logout: () => signOut(auth),
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
