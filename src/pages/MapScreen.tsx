import {
  IonButton,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonModal,
  IonPage,
  IonRow,
} from '@ionic/react'
import React from 'react'
import { Marker, Popup } from 'react-leaflet'
import { useLandmarks } from '../hooks/useLandmarks'
import { Landmark } from '../types'
import { LoadingIndicator } from '../components/LoadingIndicator'
import MarkerHelper from '../helpers/MarkerHelper'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { useLocation } from '../hooks/useLocation'
import { OfflineMapContainer } from '../components/OfflineMapContainer'
import { useTrip } from '../hooks/useTrip'
import { LandmarkMarker } from '../components/LandmarkMarker'
import { businessOutline, folderOpenOutline, mapOutline, settingsOutline, squareOutline } from 'ionicons/icons'
import { LandmarkCompassCard } from '../components/LandmarkCompassCard'
import { WarningPopup } from '../components/WarningPopup'
import 'leaflet-rotatedmarker'
import { useCompassDirection } from '../hooks/useCompassDirection'

export function MapScreen() {
  const { landmarks, isGettingLandmarks, isErrorGettingLandmarks } = useLandmarks('', '')
  const { trip, isGettingTrip, isErrorGettingTrip, endTrip } = useTrip()

  const currentPosition = useLocation()
  const userDirection = useCompassDirection()

  const mapDataLoaded = !isGettingLandmarks && !isErrorGettingLandmarks && !isGettingTrip && !isErrorGettingTrip && landmarks && trip
  const errorLoadingData = isErrorGettingLandmarks || isErrorGettingTrip
  const locationNotEnabled = currentPosition.lat === 0 && currentPosition.lng === 0

  const cancelTrip = () => {
    endTrip()
  }

  if (errorLoadingData) {
    return <WarningPopup title="Warning" message="Something went wrong while getting landmarks." isOpen={true} />
  }

  if (locationNotEnabled) {
    return (
      <IonPage>
          <LoadingIndicator text="Loading map..." />
      </IonPage>
    )
  }

  return (
    <IonPage>
      <IonContent>
        {isGettingLandmarks || (isGettingTrip && <LoadingIndicator text="Loading landmarks..." />)}
        <OfflineMapContainer center={currentPosition} zoom={18} className="leaflet-container" scrollWheelZoom={true} showLayout={true}>
          <Marker
            key={userDirection}
            position={[currentPosition.lat, currentPosition.lng]}
            icon={MarkerHelper.getPersonMarker()}
            rotationAngle={userDirection}
          >
            <Popup>You are here</Popup>
          </Marker>

          {/* CLUSTER FOR NO TRIP */}
          {mapDataLoaded && (
            <>
              {!trip.started && (
                <MarkerClusterGroup chunkedLoading disableClusteringAtZoom={18}>
                  {landmarks.map((landmark: Landmark) => (
                    <LandmarkMarker
                      key={landmark.id}
                      landmark={landmark}
                      markerIcon={MarkerHelper.getUnvisitedMarker()}
                      markerIconVisited={MarkerHelper.getVisitedMarker()}
                      showPopup={true}
                    />
                  ))}
                </MarkerClusterGroup>
              )}

              {/* TRIP EXISTS*/}
              {trip.started && (
                <>
                  {/* SHOW MARKERS FOR LANDMARKS IN A TRIP */}
                  {landmarks.map(
                    (landmark: Landmark) =>
                      landmark.inTrip && (
                        <LandmarkMarker
                          key={landmark.id}
                          landmark={landmark}
                          markerIcon={MarkerHelper.getUnvisitedInTripMarker()}
                          markerIconVisited={MarkerHelper.getVisitedInTripMarker()}
                          showPopup={true}
                        />
                      )
                  )}

                  {/* CLUSTER FOR LANDMARK NOT IN A TRIP */}
                  <MarkerClusterGroup chunkedLoading disableClusteringAtZoom={18}>
                    {landmarks.map(
                      (landmark: Landmark) =>
                        !landmark.inTrip && (
                          <LandmarkMarker
                            key={landmark.id}
                            landmark={landmark}
                            markerIcon={MarkerHelper.getUnvisitedMarker()}
                            markerIconVisited={MarkerHelper.getVisitedMarker()}
                            showPopup={true}
                          />
                        )
                    )}
                  </MarkerClusterGroup>
                </>
              )}
            </>
          )}
        </OfflineMapContainer>

        {/* TRIP NOT STARTED */}
        {trip && (
          <>
            {!trip.started && (
              <>
                <IonFabButton className="btn__home btn__planTrip btn__color" routerLink={'/trip/create'}>
                  <IonIcon icon={mapOutline}></IonIcon>
                </IonFabButton>

                <IonFab slot="fixed" color="" vertical="top" horizontal="end">
                  <IonFabButton color="light">
                    <IonIcon icon={settingsOutline}></IonIcon>
                  </IonFabButton>
                  <IonFabList side="bottom">
                    <IonFabButton routerLink="/settings/extensions">
                      <IonIcon icon={folderOpenOutline}></IonIcon>
                    </IonFabButton>
                    <IonFabButton routerLink="/settings/areas">
                      <IonIcon icon={businessOutline}></IonIcon>
                    </IonFabButton>
                  </IonFabList>
                </IonFab>
              </>
            )}

            {/* TRIP STARTED AND NOT THE LAST LANDMARK */}
            {trip.started && (
              <>
                {!trip.isLastVisited && (
                  <LandmarkCompassCard
                    landmark={trip.landmarks[trip.nextLandmarkId]}
                    currentLandmarkNumber={trip.nextLandmarkId + 1}
                    totalLandmarks={trip.landmarks.length}
                  />
                )}

                <IonFabButton className="btn__home btn__endTrip" color="danger" onClick={cancelTrip}>
                  <IonIcon icon={squareOutline}></IonIcon>
                </IonFabButton>
              </>
            )}

            {/* LAST LANDMARK VISITED */}
            {trip.isLastVisited && mapDataLoaded && (
              <IonModal isOpen={true}>
                <IonContent>
                  <div className={'modal__body'}>
                    <IonCardTitle className="modal__title">You explored {trip.landmarks[0].area}</IonCardTitle>
                    <IonCardSubtitle className="modal__subtitle">Visited {trip.landmarks.length} Landmark(s)!</IonCardSubtitle>
                    <div className="modal__map-container">
                      <OfflineMapContainer
                        center={{ lat: trip.landmarks[0].location.lat, lng: trip.landmarks[0].location.lng }}
                        zoom={14}
                        className="leaflet-container"
                        scrollWheelZoom={false}
                        showLayout={false}
                      >
                        {landmarks.map(
                          (landmark: Landmark) =>
                            landmark.inTrip && (
                              <LandmarkMarker
                                key={landmark.id}
                                landmark={landmark}
                                markerIcon={MarkerHelper.getUnvisitedInTripMarker()}
                                markerIconVisited={MarkerHelper.getVisitedInTripMarker()}
                                showPopup={false}
                              />
                            )
                        )}
                      </OfflineMapContainer>
                    </div>
                    <IonRow className={'modal__buttons'}>
                      <IonButton className={'modal__button'} color="danger" onClick={cancelTrip}>
                        End Trip
                      </IonButton>
                    </IonRow>
                  </div>
                </IonContent>
              </IonModal>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  )
}
