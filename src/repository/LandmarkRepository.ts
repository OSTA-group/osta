import { Landmark } from '../types'
import LandmarksHelper from '../helpers/LandmarksHelper'
import IdbStorage from '../databases/IdbStorage'

async function saveLandmark(landmark: Landmark): Promise<void> {
  landmark.id = LandmarksHelper.getLandmarkId(landmark.location)
  await IdbStorage.getDatabase().put(IdbStorage.landmarkStore, landmark)
}

async function getLandmarkById(id: string): Promise<Landmark> {
  const tx = IdbStorage.getDatabase().transaction(IdbStorage.landmarkStore, 'readonly')
  const store = tx.objectStore(IdbStorage.landmarkStore)
  return await store.get(id)
}

async function getLandmarksByArea(area: string): Promise<Landmark[]> {
  if (area.length === 0) {
    return await IdbStorage.getDatabase().getAll(IdbStorage.landmarkStore)
  }

  const tx = IdbStorage.getDatabase().transaction(IdbStorage.landmarkStore, 'readonly')
  const store = tx.objectStore(IdbStorage.landmarkStore)
  const index = store.index('area')

  return await index.getAll(area)
}

async function getLandmarksByAreaAndName(area: string, name: string): Promise<Landmark[]> {
  const tx = IdbStorage.getDatabase().transaction(IdbStorage.landmarkStore, 'readonly')
  const store = tx.objectStore(IdbStorage.landmarkStore)
  const index = store.index('area')

  // When name is present: getAll and filter on name
  if (name.length > 0 && area.length === 0) {
    const allLandmarks: Landmark[] = await IdbStorage.getDatabase().getAll(IdbStorage.landmarkStore)

    return allLandmarks.filter((landmark) => {
      return landmark.sources[0].name.toLowerCase().includes(name.toLowerCase())
    })
  }

  // When area is present: getAll(area)
  if (area.length > 0 && name.length === 0) {
    return await index.getAll(area)
  }

  // When both name and area are present: getAll(area) and filter on name
  if (area.length > 0 && name.length > 0) {
    let landmarksByArea: Landmark[] = await index.getAll(area)

    landmarksByArea = landmarksByArea.filter((landmark) => {
      return landmark.sources[0].name.toLowerCase().includes(name.toLowerCase())
    })

    return landmarksByArea
  }

  // If neither area nor name is present, return all landmarks
  return await IdbStorage.getDatabase().getAll(IdbStorage.landmarkStore)
}

async function putIsVisitedLandmark(landmarkId: string, visited: boolean): Promise<void> {
  const landmark = await getLandmarkById(landmarkId)
  landmark.visited = visited
  await IdbStorage.getDatabase().put(IdbStorage.landmarkStore, landmark)
}

async function putIsInTrip(landmarkId: string, inTrip: boolean): Promise<void> {
  const landmark = await getLandmarkById(landmarkId)
  landmark.inTrip = inTrip
  await IdbStorage.getDatabase().put(IdbStorage.landmarkStore, landmark)
}

async function removeAll(landmarksToRemove: Landmark[]): Promise<void> {
  const ids = landmarksToRemove.map((landmark: Landmark) => landmark.id)

  const tx = IdbStorage.getDatabase().transaction(IdbStorage.landmarkStore, 'readwrite')
  const store = tx.objectStore(IdbStorage.landmarkStore)

  ids.forEach((id) => store.delete(id))

  tx.commit()
}

export default {
  addLandmark: saveLandmark,
  getLandmarkById,
  getLandmarksByArea,
  getLandmarksByAreaAndName,
  putIsVisitedLandmark,
  putIsInTrip,
  removeAll,
}
