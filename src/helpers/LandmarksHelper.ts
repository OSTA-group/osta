import { Landmark, Location } from '../types'
import LocationHelper from './LocationHelper'
import LocationService from '../services/LocationService'

function getLandmarkId(location: Location): string {
  const latStr = location.lat.toFixed(3).toString().replace('.', '')
  const lngStr = location.lng.toFixed(3).toString().replace('.', '')
  return latStr + lngStr
}

function orderByDistanceFromUser(landmarks: Landmark[]): Landmark[] {
  return landmarks.sort(
    (landmark1, landmark2) =>
      LocationHelper.calculateDistanceKm(landmark1.location, LocationService.getUserLocation()) -
      LocationHelper.calculateDistanceKm(landmark2.location, LocationService.getUserLocation())
  )
}

export default { getLandmarkId, orderByDistanceFromUser }
