// Placeholder data layer. Same async shape we'll use for Firestore,
// so only this file changes when Firebase is added.
const KEY = 'subtrack.subscriptions'
const read = () => JSON.parse(localStorage.getItem(KEY) || '[]')
const write = (list) => localStorage.setItem(KEY, JSON.stringify(list))

export async function getSubscriptions() {
  await new Promise((r) => setTimeout(r, 400)) // simulate network so skeletons show
  return read()
}
export async function addSubscription(data) {
  const item = { ...data, id: crypto.randomUUID(), createdAt: Date.now() }
  write([item, ...read()])
  return item
}
export async function updateSubscription(id, data) {
  write(read().map((s) => (s.id === id ? { ...s, ...data } : s)))
}
export async function deleteSubscription(id) {
  write(read().filter((s) => s.id !== id))
}
