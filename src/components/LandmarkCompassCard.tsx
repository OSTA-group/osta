import React from 'react'
import { Landmark } from '../types'
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonImg } from '@ionic/react'
import LocationHelper from '../helpers/LocationHelper'
import { useCompassDirection } from '../hooks/useCompassDirection'
import { useLocation } from '../hooks/useLocation'

import './css/LandmarkCompassCard.css'

interface LandmarkCompassCardProperties {
  landmark: Landmark
  currentLandmarkNumber: number
  totalLandmarks: number
}

export function LandmarkCompassCard({ landmark, currentLandmarkNumber, totalLandmarks }: LandmarkCompassCardProperties) {
  const location = useLocation()
  const userDirection = useCompassDirection()

  const distanceToNextPoint = LocationHelper.getDisplayStringForDistanceInKm(landmark.location, location)
  const rotationToNextPoint = (-(LocationHelper.calculateAngleInDegrees(landmark.location, location) + userDirection) % 360) + 180

  const title = landmark.sources[0].name

  return (
    <IonCard className="compassCard">
      <div className="compassCard__text">
        <IonCardHeader>
          <IonCardTitle>
            {title.length > 20 ? (
              <>
                Next stop: {title.substring(0, 20)}... ({currentLandmarkNumber}/{totalLandmarks})
              </>
            ) : (
              <>
                Next stop: {title}... ({currentLandmarkNumber}/{totalLandmarks})
              </>
            )}
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>Remaining distance: {distanceToNextPoint}</IonCardContent>
      </div>
      <div className="compassCard__image image__light">
        <IonImg
          style={{
            transformOrigin: '50% 50%',
            transform: `rotate(${rotationToNextPoint}deg)`,
          }}
          src="/images/compass/compass.svg"
        />
      </div>
      <div className="compassCard__image ion-palette-dark image__dark">
        <IonImg
          style={{
            transformOrigin: '50% 50%',
            transform: `rotate(${rotationToNextPoint}deg)`,
          }}
          src="/images/compass/compass-dark.svg"
        />
      </div>
    </IonCard>
  )
}
