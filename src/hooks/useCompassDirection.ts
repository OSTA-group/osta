import React, { useEffect } from 'react'
import CompassService from '../services/CompassService'

export function useCompassDirection() {
  const [compassDirection, setCompassDirection] = React.useState<number>(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newDirection = CompassService.getCompassRotation()
      if (newDirection !== compassDirection) {
        setCompassDirection(newDirection)
      }
    }, 100)

    return () => clearInterval(intervalId)
  }, [compassDirection])

  return compassDirection
}
