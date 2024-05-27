import React from 'react'
import { Landmark } from '../types'
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonImg } from '@ionic/react'
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
  const rotationToNextPoint = LocationHelper.calculateAngleInDegrees(location, landmark.location) - userDirection

  const title = landmark.sources[0].name

  return (
    <IonCard className="compass-card">
      <div className="compass-card__text">
        <IonCardHeader>
          <IonCardSubtitle>
            {title.length > 50 ? (
              <>
                Next stop: {title.substring(0, 50)}... ({currentLandmarkNumber}/{totalLandmarks})
              </>
            ) : (
              <>
                Next stop: {title} ({currentLandmarkNumber}/{totalLandmarks})
              </>
            )}
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>{distanceToNextPoint}</IonCardContent>
      </div>
      <div className="compass-card__image image__light">
        <IonImg
          style={{
            transformOrigin: '50% 50%',
            transform: `rotate(${rotationToNextPoint}deg)`,
          }}
          src="/images/compass/compass.svg"
        />
      </div>
      <div className="compass-card__image ion-palette-dark image__dark">
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
