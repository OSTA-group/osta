import { IDBPDatabase, openDB } from 'idb'
import { Landmark } from '../types'

const dbname = 'OSTA_idb'
const landmarkStore = 'landmarks'
const areaStore = 'areas'
const extensionStore = 'extensions'

let database: IDBPDatabase<Landmark>

async function initialiseLandmarkStorage(): Promise<void> {
  database = await openDB(dbname, 1, {
    upgrade(db) {
      db.createObjectStore(landmarkStore, {
        keyPath: 'id',
        autoIncrement: false,
      }).createIndex('area', 'area')

      db.createObjectStore(areaStore, {
        keyPath: 'id',
        autoIncrement: true,
      })

      db.createObjectStore(extensionStore, {
        keyPath: 'id',
        autoIncrement: true,
      })
    },
  })
}

function getDatabase(): IDBPDatabase<Landmark> {
  return database
}

export default {
  dbname,
  landmarkStore,
  areaStore,
  extensionStore,
  getDatabase,
  initialiseLandmarkStorage,
}
