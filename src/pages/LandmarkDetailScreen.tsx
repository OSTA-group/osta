import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCheckbox,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from '@ionic/react'
import { useLandmark } from '../hooks/useLandmark'
import { RouteComponentProps } from 'react-router'
import React, { useState } from 'react'
import { SourceInformation } from '../types'
import { compassOutline, locationOutline } from 'ionicons/icons'
import { LoadingIndicator } from '../components/LoadingIndicator'
import { WarningPopup } from '../components/WarningPopup'
import { AppScreen } from '../components/AppScreen'
import { useTrip } from '../hooks/useTrip'

import '../components/css/LandmarkDetailScreen.css'

const pageName = 'Landmark details'

interface UserDetailPageProps
  extends RouteComponentProps<{
    landmarkId: string
  }> {}

export function LandmarkDetailScreen({ match }: UserDetailPageProps) {
  const { isGettingLandmarkDetails, isErrorGettingDetails, landmarkDetails, putIsVisited } = useLandmark(match.params.landmarkId)
  const { trip, isGettingTrip, isErrorGettingTrip, changeToNextLandmark } = useTrip()

  const isErrorGettingLandmarkDetails = isErrorGettingDetails || !landmarkDetails

  const [checkboxClicked, setCheckboxClicked] = useState(false)

  function handleCheckBoxChange(checked: boolean, inTrip: boolean) {
    if (!checkboxClicked) {
      putIsVisited(checked)
      setCheckboxClicked(true)
      if (trip?.started && inTrip) {
        changeToNextLandmark()
      }
    }
  }

  if (isGettingLandmarkDetails) {
    return (
      <AppScreen name={pageName}>
        <LoadingIndicator text="Loading information for landmark..."></LoadingIndicator>
      </AppScreen>
    )
  }

  if (isErrorGettingLandmarkDetails) {
    return <WarningPopup title="Warning" message="Something went wrong while getting the details." isOpen={true} />
  }

  const isNextInTripOrNotInTripAndNotVisited =
    !isGettingTrip &&
    !isErrorGettingTrip &&
    ((trip?.landmarks[trip.nextLandmarkId]?.id === landmarkDetails.id && landmarkDetails.inTrip) ||
      (!landmarkDetails.inTrip && !landmarkDetails.visited))

  return (
    <AppScreen name={pageName}>
      <IonGrid>
        <IonRow>
          {landmarkDetails.types.map((name: string) => (
            <IonBadge key={name} color="primary" className={'ion-margin-end ion-margin-bottom'}>
              {name}
            </IonBadge>
          ))}
        </IonRow>

        <IonRow>
          <IonText>
            <IonIcon icon={locationOutline}></IonIcon>
            {landmarkDetails.area}
          </IonText>
        </IonRow>

        <IonRow>
          <IonText>
            <IonIcon icon={compassOutline} /> {landmarkDetails.location.lat.toFixed(2)}, {landmarkDetails.location.lng.toFixed(2)}
          </IonText>
        </IonRow>

        <IonRow>
          <h1>Sources at this location</h1>
        </IonRow>

        <IonRow>
          {landmarkDetails.sources.map((source: SourceInformation, it: number) => (
            <IonCard className="source-card__w-100" key={it}>
              <IonCardHeader>
                <IonCardTitle>{source.name}</IonCardTitle>
                <IonCardSubtitle>{source.source}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>{source.description}</IonCardContent>
            </IonCard>
          ))}
        </IonRow>

        {isNextInTripOrNotInTripAndNotVisited && (
          <IonRow>
            <IonCheckbox
              value={landmarkDetails.visited}
              checked={landmarkDetails.visited}
              onIonChange={(e) => handleCheckBoxChange(e.target.checked, landmarkDetails?.inTrip)}
            >
              Mark this landmark as seen
            </IonCheckbox>
          </IonRow>
        )}
      </IonGrid>
    </AppScreen>
  )
}
