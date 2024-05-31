import {
  IonButton,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonReorder,
  IonReorderGroup,
  IonText,
  ItemReorderEventDetail,
} from '@ionic/react'
import { useTrip } from '../../hooks/useTrip'
import { LoadingIndicator } from '../../components/LoadingIndicator'
import { WarningPopup } from '../../components/WarningPopup'
import React, { useState } from 'react'
import { Landmark } from '../../types'
import { AppScreen } from '../../components/AppScreen'
import LocationService from '../../services/LocationService'
import LocationHelper from '../../helpers/LocationHelper'

const pageName = 'Create route'

export function OrganiseTripScreen() {
  const [showAlert, setShowAlert] = useState(false)
  const { trip, isGettingTrip, isErrorGettingTrip, isErrorChangingTrip, changeTripOrder, startTrip, changeTrip } = useTrip()
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

  const removeLandmarkFromTrip = (landmarkId: string, add: boolean) => {
    if (trip && trip.landmarks.length > 1) {
      const landmark = trip?.landmarks.find((landmark) => landmark.id === landmarkId)
      if (landmark) {
        changeTrip({ landmark, addToTrip: add })
      }
    } else {
      setShowAlert(true)
    }
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

  const userLocation = LocationService.getUserLocation()

  const landmarksWithDistances = trip.landmarks.map((landmark: Landmark, index: number) => {
    const distanceFromUser = LocationHelper.calculateDistanceKm(userLocation, landmark.location)
    const distanceToNext =
      index < trip.landmarks.length - 1 ? LocationHelper.calculateDistanceKm(landmark.location, trip.landmarks[index + 1].location) : null
    return { ...landmark, distanceFromUser, distanceToNext }
  })

  return (
    <AppScreen name={pageName}>
      <h1>Planning a new trip</h1>
      <IonReorderGroup disabled={false} onIonItemReorder={reorderTrip}>
        {landmarksWithDistances.map((landmark) => (
          <IonItemSliding key={landmark.id}>
            <IonItem>
              <IonLabel>
                <strong>{landmark.sources[0].name}</strong> <br />
                <small>
                  Distance: {landmark.distanceFromUser.toFixed(2)} km
                  {landmark.distanceToNext !== null && <> | Next stop: {landmark.distanceToNext.toFixed(2)} km</>}
                </small>
              </IonLabel>
              <IonReorder slot="end"></IonReorder>
            </IonItem>
            <IonItemOptions side="end">
              <IonItemOption color="danger" onClick={() => removeLandmarkFromTrip(landmark.id, false)}>
                <IonText>Delete</IonText>
              </IonItemOption>
            </IonItemOptions>
          </IonItemSliding>
        ))}
      </IonReorderGroup>
      <IonButton className="btn__home btn__download btn__color" routerLink={'/map'} onClick={saveTrip}>
        Confirm trip
      </IonButton>
      <WarningPopup title="Can't do that right now." message="Where would you be going without a landmark?" isOpen={showAlert} />
    </AppScreen>
  )
}
