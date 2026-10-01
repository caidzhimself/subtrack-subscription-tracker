import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

// Each user's data lives at users/{uid}/subscriptions/{id}
const col = (uid) => collection(db, 'users', uid, 'subscriptions')
const ref = (uid, id) => doc(db, 'users', uid, 'subscriptions', id)

// Real-time listener: onData fires now and again on every change. Returns unsubscribe.
export const subscribe = (uid, onData, onError) =>
  onSnapshot(
    query(col(uid), orderBy('createdAt', 'desc')),
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  )

export const addSubscription = (uid, data) => addDoc(col(uid), { ...data, createdAt: Date.now() })

export const updateSubscription = (uid, id, data) => {
  const { id: _id, ...rest } = data // never write the id into the document body
  return updateDoc(ref(uid, id), rest)
}

export const deleteSubscription = (uid, id) => deleteDoc(ref(uid, id))
