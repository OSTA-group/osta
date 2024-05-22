import { Area, BoundingBox, BoundingCircle, Landmark, Location, Extension, SourceInformation, SourceLandmark } from '../types'
import LocationHelper from '../helpers/LocationHelper'
import ExtensionRepository from '../repository/ExtensionRepository'
import TypeAdapter from '../adapter/TypeAdapter'
import LandmarksHelper from '../helpers/LandmarksHelper'
import LandmarkRepository from '../repository/LandmarkRepository'
import AreaRepository from '../repository/AreaRepository'

async function downloadLandmarksForNewArea(
  areaName: string,
  boundingBox: BoundingBox,
  setSourceName: (sourceName: string) => void
): Promise<void> {
  // Calculate bounding circle
  const boundingCircle = LocationHelper.calculateRadiusByBoundingBox(boundingBox)

  // Get information from landmarks
  const extensions = await ExtensionRepository.getExtensions()
  const usableExtensions = extensions.filter((extension) => extension.configured)

  let landmarkCount = 0

  for (const extension of usableExtensions) {
    setSourceName(extension.name)

    let newSourceLandmarks = await TypeAdapter.executeAdapter(extension.type, {
      extension,
      boundingBox,
      boundingCircle,
    }).catch((error) => {
      console.error(`Something went wrong downloading from ${extension.name}: ${error}`)
      return []
    })

    if (!isSourceLandmarkArray(newSourceLandmarks)) {
      console.error(`Failed to parse data from ${extension.name}`)
      continue
    }

    // Filter landmarks only inside the bounding circle (bounding circle will always fully contain the bounding box)
    newSourceLandmarks = filterSourceLandmarkInCircle(newSourceLandmarks, boundingCircle)

    // Get or save landmark
    for (const landmark of newSourceLandmarks) {
      // Exist already?
      const isNewLandmark = await addNewLandmark(extension, areaName, landmark)

      if (isNewLandmark) {
        landmarkCount++
      }
    }
  }

  // Save new area
  if (landmarkCount > 0) {
    await AreaRepository.addArea({ name: areaName, countOfLandmarks: landmarkCount } as Area)
  }
}

function isSourceLandmarkArray(landmarks: unknown): landmarks is SourceLandmark[] {
  return (landmarks as SourceLandmark[]).length !== undefined
}

function filterSourceLandmarkInCircle(landmarks: SourceLandmark[], boundingCircle: BoundingCircle): SourceLandmark[] {
  return landmarks.filter(
    (landmark) =>
      LocationHelper.calculateDistanceKm(
        {
          lat: landmark.lat,
          lng: landmark.lng,
        },
        boundingCircle.center
      ) < boundingCircle.radius
  )
}

async function addNewLandmark(extension: Extension, areaName: string, sourceLandmark: SourceLandmark): Promise<boolean> {
  if (!sourceLandmark.lat || !sourceLandmark.lng || !sourceLandmark.name || !sourceLandmark.description || !sourceLandmark.types) {
    return false
  }

  const sourceInformation: SourceInformation = {
    name: sourceLandmark.name,
    description: sourceLandmark.description,
    source: extension.name,
  }

  const landmarkLocation: Location = { lat: sourceLandmark.lat, lng: sourceLandmark.lng }
  const landmarkId = LandmarksHelper.getLandmarkId(landmarkLocation)
  const existingLandmark = await LandmarkRepository.getLandmarkById(landmarkId)

  const landmark: Landmark = existingLandmark ?? {
    id: landmarkId,
    location: landmarkLocation,
    types: sourceLandmark.types,
    area: areaName,
    sources: [] as SourceInformation[],
    visited: false,
    inTrip: false,
  }

  // Remove the old data from this extension
  landmark.sources = landmark.sources.filter((existingInformation: SourceInformation) => sourceInformation.source !== existingInformation.source || sourceInformation.name !== existingInformation.name)

  // Add new data to landmark
  landmark.sources.push(sourceInformation)

  await LandmarkRepository.addLandmark(landmark)

  return !existingLandmark
}

async function removeAreaAndLandmarks(areaId: number): Promise<void> {
  const areaToRemove = await AreaRepository.getAreaById(areaId)
  const landmarksToRemove = await LandmarkRepository.getLandmarksByArea(areaToRemove.name)
  await LandmarkRepository.removeAll(landmarksToRemove)

  await AreaRepository.removeAreaById(areaToRemove.id)
}

export default { downloadLandmarksForNewArea, removeAreaAndLandmarks }
