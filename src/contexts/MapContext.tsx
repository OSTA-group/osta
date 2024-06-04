import React, { createContext, ReactElement, RefObject, useContext, useRef } from 'react'
import { Map } from 'leaflet'

const MapContext = createContext<React.RefObject<Map> | null>(null)

interface MapContextParams {
  children: ReactElement | ReactElement[]
}

export function MapProvider({ children }: MapContextParams) {
  const mapRef = useRef<Map | null>(null)

  return (
    <MapContext.Provider value={mapRef}>
      {children}
    </MapContext.Provider>
  )
}

export const useMap = (): RefObject<Map> | null => {
  const context = useContext(MapContext)

  if (!context) {
    throw new Error('useMap must be used within a MapProvider')
  }

  return context
}