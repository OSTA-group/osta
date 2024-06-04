import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonModal, IonToolbar } from '@ionic/react'
import { OfflineMapContainer } from '../components/OfflineMapContainer'
import { Circle, Marker, Popup, Rectangle, TileLayer, FeatureGroup } from 'react-leaflet'
import MarkerHelper from '../helpers/MarkerHelper'
import React, { useEffect, useState } from 'react'
import { useLocation } from '../hooks/useLocation'
import { EditControl } from 'react-leaflet-draw'
import L, { LatLngBounds } from 'leaflet'
import { LoadingIndicator } from '../components/LoadingIndicator'
import { AppScreen } from '../components/AppScreen'
import { useLandmarks } from '../hooks/useLandmarks'
import { WarningPopup } from '../components/WarningPopup'

const pageName = 'Download landmarks'

export function DownloadScreen() {
  const currentPosition = useLocation()

  const { downloadNewLandmarks, isDownloadSuccess, isErrorDownloadingLandmark, isDownloadingLandmark, sourceName } = useLandmarks('', '')

  const [rectangleBounds, setRectangleBounds] = useState<LatLngBounds>()
  const [areaName, setAreaName] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const locationNotEnabled = currentPosition.lat === 0 && currentPosition.lng === 0

  useEffect(() => {
    if (!rectangleBounds && currentPosition.lng !== 0 && currentPosition.lat !== 0) {
      setRectangleBounds(
        new L.LatLngBounds(
          [currentPosition.lat - 0.005, currentPosition.lng - 0.005],
          [currentPosition.lat + 0.005, currentPosition.lng + 0.005]
        )
      )
    }
  }, [currentPosition])

  function handleDownload() {
    if (rectangleBounds && areaName) {
      downloadNewLandmarks({
        areaName: areaName,
        boundingBox: { topLeft: rectangleBounds.getNorthWest(), bottomRight: rectangleBounds.getSouthEast() },
      })
      setIsModalOpen(false)
      setAreaName('')
    }
  }

  function toggleModal() {
    setIsModalOpen(!isModalOpen)
  }

  function handleRectangleChange(bounds: LatLngBounds) {
    if (bounds) {
      setRectangleBounds(bounds)
    }
  }

  if (locationNotEnabled) {
    return (
      <AppScreen name={pageName}>
        <LoadingIndicator text="Loading map..." />
      </AppScreen>
    )
  }

  return (
    <AppScreen name={pageName} contentPadding={false}>
      {!locationNotEnabled && (
        <OfflineMapContainer center={currentPosition} zoom={16} className="leaflet-container" scrollWheelZoom={true} showLayout={true}>
          {/* Display the selected rectangle */}
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Circle center={currentPosition} radius={20} color="blue">
            <Marker position={[currentPosition.lat, currentPosition.lng]} icon={MarkerHelper.getPersonMarker()}>
              <Popup>You are here</Popup>
            </Marker>
          </Circle>

          {/* EditControl for drawing and editing rectangles */}
          <FeatureGroup>
            <EditControl
              position="topright"
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
                polygon: false,
              }}
              edit={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
                polygon: false,
              }}
              onEditResize={(e) => handleRectangleChange(e.layer.getBounds())}
              onEditMove={(e) => handleRectangleChange(e.layer.getBounds())}
            />
          </FeatureGroup>

          {rectangleBounds && (
            // @ts-expect-error - type not recognised by ts
            <Rectangle bounds={rectangleBounds} pathOptions={{ color: 'blue', weight: 2 }} editable={true} onEdit={handleRectangleChange} />
          )}
        </OfflineMapContainer>
      )}

      <IonButton className="btn__home btn__download btn__color" onClick={toggleModal}>
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
