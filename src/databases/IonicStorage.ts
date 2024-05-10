import { Drivers, Storage } from '@ionic/storage'

let storage: Storage

function createStore(name: string): void {
  storage = new Storage({
    name,
    driverOrder: [Drivers.SecureStorage, Drivers.IndexedDB, Drivers.LocalStorage],
  })

  storage.create().then()
}

async function exists(key: string): Promise<boolean> {
  return (await storage.get(key)) !== null
}

async function get(key: string): Promise<unknown> {
  const data = await storage.get(key)

  if (!data) throw new Error(`Could not find key ${key}`)

  return data
}

async function set(key: string, val: unknown): Promise<void> {
  await storage.set(key, val)
}

async function remove(key: string): Promise<void> {
  await storage.remove(key)
}

async function clear(): Promise<void> {
  await storage.clear()
}

export default { createStore, exists, get, set, remove, clear }
