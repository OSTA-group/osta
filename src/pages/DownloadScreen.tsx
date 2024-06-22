import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonModal, IonText, IonToolbar } from '@ionic/react'
import { OfflineMapContainer } from '../components/OfflineMapContainer'
import { Marker, Popup } from 'react-leaflet'
import React, { useState } from 'react'
import MarkerHelper from '../helpers/MarkerHelper'
import { useLocation } from '../hooks/useLocation'
import { LoadingIndicator } from '../components/LoadingIndicator'
import { AppScreen } from '../components/AppScreen'
import { useLandmarks } from '../hooks/useLandmarks'
import { WarningPopup } from '../components/WarningPopup'
import { useMap } from '../contexts/MapContext'
import { GeoSearchField } from '../components/GeoSearchField'

import '../components/css/DownloadScreen.css'

const pageName = 'Download area'

export function DownloadScreen() {
  const currentPosition = useLocation()
  const map = useMap()

  const { downloadNewLandmarks, isDownloadSuccess, isErrorDownloadingLandmark, isDownloadingLandmark, sourceName } = useLandmarks('', '')

  const [areaName, setAreaName] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const locationEnabled = !(currentPosition.lat === 0 && currentPosition.lng === 0)

  function handleDownload() {
    if (areaName && map && map.current) {
      const bounds = map.current.getBounds()
      const northWest = bounds.getNorthWest()
      const southEast = bounds.getSouthEast()

      const areaHeight = northWest.lat - southEast.lat
      const areaWidth = northWest.lng - southEast.lng

      const halfAdjustedHeight = (areaHeight * 0.65) / 2
      const halfAdjustedWidth = (areaWidth * 0.75) / 2

      const center = bounds.getCenter()

      const newNorthWest = {
        lat: center.lat + halfAdjustedHeight,
        lng: center.lng + halfAdjustedWidth,
      }

      const newSouthEast = {
        lat: center.lat - halfAdjustedHeight,
        lng: center.lng - halfAdjustedWidth,
      }

      downloadNewLandmarks({
        areaName: areaName,
        boundingBox: { topLeft: newNorthWest, bottomRight: newSouthEast },
      })

      setIsModalOpen(false)
      setAreaName('')
    }
  }

  function toggleModal() {
    setIsModalOpen(!isModalOpen)
  }

  if (!locationEnabled) {
    return (
      <AppScreen name={pageName} contentPadding={false}>
        <LoadingIndicator text="Loading map..." />
      </AppScreen>
    )
  }

  return (
    <AppScreen name={pageName} contentPadding={false}>
      {locationEnabled && (
        <>
          <OfflineMapContainer center={currentPosition} zoom={16} className="leaflet-container" scrollWheelZoom={true} showLayout={true}>
            <div className="download-screen">
              <IonText>What is your next destination?</IonText>
            </div>
            <GeoSearchField />

            <Marker position={[currentPosition.lat, currentPosition.lng]} icon={MarkerHelper.getPersonMarker()}>
              <Popup>You are here</Popup>
            </Marker>
          </OfflineMapContainer>
        </>
      )}

      <IonButton className="btn__home btn__download" onClick={toggleModal}>
        Download area
      </IonButton>

      {/* Modal for entering area name */}
      <IonModal isOpen={isModalOpen} onWillDismiss={() => setIsModalOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={toggleModal}>Cancel</IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton strong={true} onClick={handleDownload} routerLink="/map" disabled={areaName.length < 3 || areaName.length > 30}>
                Save area
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem>
            <IonInput
              labelPlacement="stacked"
              label="Area name (3-30 characters) "
              onIonChange={(e) => setAreaName(String(e.target.value))}
              placeholder="Enter a custom area name"
            ></IonInput>
          </IonItem>
        </IonContent>
      </IonModal>

      {isDownloadingLandmark && (
        <WarningPopup title="Collecting information" message={`Downloading landmarks from ${sourceName}`} isOpen={true} />
      )}

      {isDownloadSuccess && <WarningPopup title="Congratulations!" message="Succesfully downloaded landmarks." isOpen={true} />}

      {isErrorDownloadingLandmark && (
        <WarningPopup title="Error" message="Something went wrong while downloading the landmarks." isOpen={true} />
      )}
    </AppScreen>
  )
}
