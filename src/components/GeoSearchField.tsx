import { useEffect } from 'react'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'
import { useMap } from '../contexts/MapContext'
import 'leaflet-geosearch/dist/geosearch.css'

export function GeoSearchField() {
  const map = useMap()
  const provider = new OpenStreetMapProvider()

  // @ts-expect-error no TS .d provided for this library, all types will be identified as any
  const searchControl = new GeoSearchControl({
    provider: provider,
    style: 'bar',
    autoComplete: true,
    autoCompleteDelay: 1000,
    animateZoom: true,
    notFoundMessage: 'Sorry, that address could not be found.',
    showMarker: false,
  })

  useEffect(() => {
    if (map && map.current) {
      map.current.addControl(searchControl)
    }

    return () => {
      if (map && map.current) map.current.removeControl(searchControl)
    }
  }, [map, map?.current])

  return null
}
