import L from 'leaflet'
import React, { useEffect } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet.offline'
import { Location } from '../types'
import { IonFabButton, IonIcon } from '@ionic/react'
import { navigateOutline } from 'ionicons/icons'
import { useMap } from '../contexts/MapContext'

import 'leaflet/dist/leaflet.css'
import './css/LeafletMap.css'

interface OfflineMapContainerProperties {
  center: Location
  zoom: number
  scrollWheelZoom: boolean
  children?: React.ReactNode
  className?: string
  showLayout: boolean
}

export function OfflineMapContainer({ center, zoom, scrollWheelZoom, children, className, showLayout }: OfflineMapContainerProperties) {
  const map = useMap()

  useEffect(() => {
    if (map && map.current) {
      // @ts-expect-error: leaflet.offline is a js only library, thus js cannot find the function even though it exists
      const tileOfflineLayer = L.tileLayer.offline('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      tileOfflineLayer.addTo(map.current)

      map.current.invalidateSize()
    }
  }, [map, map?.current])

  function handleCenterClick() {
    if (map && map.current) {
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
        <>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {children}
        </>
      </MapContainer>
      {showLayout && (
        <IonFabButton color="light" onClick={handleCenterClick} className="btn__home btn__center">
          <IonIcon icon={navigateOutline}></IonIcon>
        </IonFabButton>
      )}
    </>
  )
}
