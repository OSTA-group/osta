import React, { useEffect } from 'react'
import LocationService from '../services/LocationService'
import { Location } from '../types'

export function useLocation() {
  const [currentLocation, setCurrentLocation] = React.useState<Location>({
    lat: 0,
    lng: 0,
  })

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newDirection = LocationService.getUserLocation()
      if (newDirection !== currentLocation) {
        setCurrentLocation(newDirection)
      }
    }, 100)

    return () => clearInterval(intervalId)
  }, [currentLocation])

  return currentLocation
}
