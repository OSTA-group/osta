import { IonButton, IonItem, IonLabel, IonReorder, IonReorderGroup, ItemReorderEventDetail } from '@ionic/react'
import { useTrip } from '../../hooks/useTrip'
import { LoadingIndicator } from '../../components/LoadingIndicator'
import { WarningPopup } from '../../components/WarningPopup'
import React from 'react'
import { Landmark } from '../../types'
import { AppScreen } from '../../components/AppScreen'

const pageName = 'Create route'

export function OrganiseTripScreen() {
  const { trip, isGettingTrip, isErrorGettingTrip, isErrorChangingTrip, changeTripOrder, startTrip } = useTrip()

  const isErrorInTrip = isErrorGettingTrip || isErrorChangingTrip || !trip

  const reorderTrip = (event: CustomEvent<ItemReorderEventDetail>) => {
    changeTripOrder({
      landmarkIndex1: event.detail.from,
      landmarkIndex2: event.detail.to,
    })

    event.detail.complete()
  }

  function saveTrip() {
    startTrip()
  }

  if (isGettingTrip) {
    return (
      <AppScreen name={pageName}>
        <LoadingIndicator text="Loading..." />
      </AppScreen>
    )
  }

  if (isErrorInTrip) {
    return <WarningPopup title="Warning" message="Something went wrong while getting the landmarks." isOpen={true} />
  }

  return (
    <AppScreen name={pageName}>
      <h1>Planning a new trip</h1>
      <IonReorderGroup disabled={false} onIonItemReorder={reorderTrip}>
        {trip.landmarks.map((landmark: Landmark) => (
          <IonItem key={landmark.id}>
            <IonLabel>{landmark.sources[0].name}</IonLabel>
            <IonReorder slot="end"></IonReorder>
          </IonItem>
        ))}
      </IonReorderGroup>
      <IonButton routerLink={'/map'} onClick={saveTrip}>
        Confirm trip
      </IonButton>
    </AppScreen>
  )
}
