import { Area } from '../types'
import IdbStorage from '../databases/IdbStorage'

async function addArea(area: Area): Promise<void> {
  await IdbStorage.getDatabase().put(IdbStorage.areaStore, area)
}

async function getAreaById(id: number): Promise<Area> {
  const tx = IdbStorage.getDatabase().transaction(IdbStorage.areaStore, 'readonly')
  const store = tx.objectStore(IdbStorage.areaStore)
  return await store.get(id)
}

async function getAreas(): Promise<Area[]> {
  return await IdbStorage.getDatabase().getAll(IdbStorage.areaStore)
}

async function removeAreaById(id: number): Promise<void> {
  await IdbStorage.getDatabase().delete(IdbStorage.areaStore, id)
}

export default { addArea, getAreaById, getAreas, removeAreaById }
