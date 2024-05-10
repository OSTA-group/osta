import L from 'leaflet'

function getPersonMarker(): L.Icon {
  return L.icon({
    iconUrl: '/images/current-location.svg',
    iconSize: [75, 75],
    iconAnchor: [37.5, 37.5],
  })
}

function getUnvisitedMarker(): L.Icon {
  return L.icon({
    iconUrl: '/images/markers/unvisited.png',
    iconSize: [32, 45],
    iconAnchor: [16, 45],
    popupAnchor: [0, -45],
  })
}

function getUnvisitedInTripMarker(): L.Icon {
  return L.icon({
    iconUrl: '/images/markers/unvisited-trip.png',
    iconSize: [45, 60],
    iconAnchor: [22.5, 60],
    popupAnchor: [0, -60],
  })
}

function getVisitedMarker(): L.Icon {
  return L.icon({
    iconUrl: '/images/markers/visited.png',
    iconSize: [32, 45],
    iconAnchor: [16, 45],
    popupAnchor: [0, -45],
  })
}

function getVisitedInTripMarker(): L.Icon {
  return L.icon({
    iconUrl: '/images/markers/visited-trip.png',
    iconSize: [45, 60],
    iconAnchor: [22.5, 60],
    popupAnchor: [0, -60],
  })
}

export default {
  getPersonMarker,
  getUnvisitedMarker,
  getUnvisitedInTripMarker,
  getVisitedMarker,
  getVisitedInTripMarker,
}
