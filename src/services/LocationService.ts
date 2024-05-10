import { Location } from '../types'
import { Geolocation } from '@capacitor/geolocation'
import { isPlatform } from '@ionic/react'

let locationEnabled: boolean = false
let currentLocation: Location = { lat: 0, lng: 0 }

async function checkPermissions(): Promise<void> {
  if (!isPlatform('desktop')) {
    await Geolocation.requestPermissions()
  }

  await Geolocation.checkPermissions()
}

async function trackUserLocation(): Promise<void> {
  await checkPermissions()

  await Geolocation.watchPosition({}, async (position) => {
    if (position) {
      currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    }
  })

  const location = await Geolocation.getCurrentPosition()
  currentLocation = {
    lat: location.coords.latitude,
    lng: location.coords.longitude,
  }

  locationEnabled = true
}

function getUserLocation(): Location {
  return currentLocation
}

function getLocationEnabled(): boolean {
  return locationEnabled
}

export default { trackUserLocation, getUserLocation, getLocationEnabled }
