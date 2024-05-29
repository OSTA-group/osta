import {Landmark, Location} from '../types'
import LocationHelper from './LocationHelper'
import LocationService from '../services/LocationService'

function getLandmarkId(location: Location): string {
  const latStr = location.lat.toFixed(3).toString().replace('.', '')
  const lngStr = location.lng.toFixed(3).toString().replace('.', '')
  return latStr + lngStr
}

function orderByDistanceFromUser(landmarks: Landmark[]): Landmark[] {
  const userLocation = LocationService.getUserLocation();

  return landmarks.map((landmark) => ({
    ...landmark,
    distance: LocationHelper.calculateDistanceKm(landmark.location, userLocation),
  })).sort((landmark1, landmark2) => landmark1.distance - landmark2.distance);
}

export default {getLandmarkId, orderByDistanceFromUser}
