import L, { Map } from 'leaflet'
import React, { useEffect, useRef } from 'react'
import { MapContainer } from 'react-leaflet'
import 'leaflet.offline'
import { Location } from '../types'
import { IonFabButton, IonIcon } from '@ionic/react'
import { navigateOutline } from 'ionicons/icons'

import 'leaflet/dist/leaflet.css'
import './css/LeafletMap.css'
import 'leaflet-draw/dist/leaflet.draw.css'

interface OfflineMapContainerProperties {
  center: Location
  zoom: number
  scrollWheelZoom: boolean
  children?: React.ReactNode
  className?: string
}

export function OfflineMapContainer({ center, zoom, scrollWheelZoom, children, className }: OfflineMapContainerProperties) {
  const map = useRef<Map | null>(null)

  useEffect(() => {
    if (map.current) {
      // @ts-expect-error: leaflet.offline is a js only library, thus js cannot find the function even though it exists
      const tileOfflineLayer = L.tileLayer.offline('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      })
      tileOfflineLayer.addTo(map.current)

      map.current.on('load', () => {
        map.current?.invalidateSize()
      })
    }
  }, [map])

  function handleCenterClick() {
    if (map.current) {
      map.current.flyTo(center, zoom)
    }
  }

  return (
    <>
      <MapContainer
        ref={map}
        center={[center.lat, center.lng]}
        zoom={zoom}
        maxZoom={18}
        minZoom={4}
        scrollWheelZoom={scrollWheelZoom}
        className={className}
        worldCopyJump={true}
      >
        {children}
      </MapContainer>
      <IonFabButton color="light" onClick={handleCenterClick} className="btn__home btn__center">
        <IonIcon icon={navigateOutline}></IonIcon>
      </IonFabButton>
    </>
  )
}
