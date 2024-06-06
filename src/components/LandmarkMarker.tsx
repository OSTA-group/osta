import React from 'react'
import { Marker, Popup } from 'react-leaflet'
import { IonRow, IonText, IonButton, IonIcon } from '@ionic/react'
import { informationCircleOutline } from 'ionicons/icons'
import { Landmark } from '../types'
import L from 'leaflet'

interface LandmarkMarkerProps {
  landmark: Landmark
  markerIcon: L.Icon
  markerIconVisited: L.Icon
  showPopup: boolean
}

export function LandmarkMarker({ landmark, markerIcon, markerIconVisited, showPopup }: LandmarkMarkerProps) {
  return (
    <Marker position={[landmark.location.lat, landmark.location.lng]} icon={landmark.visited ? markerIconVisited : markerIcon}>
      {showPopup && (
        <Popup>
          <IonRow>
            <IonText className={'popup__text__center'}>
              <IonButton className={'btn__color'} routerLink={`/landmark/${landmark.id}`}>
                <IonIcon icon={informationCircleOutline} />
              </IonButton>
              <IonText>{landmark.sources[0].name}</IonText>
            </IonText>
          </IonRow>
        </Popup>
      )}
    </Marker>
  )
}
