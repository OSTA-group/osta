import { IonButton, IonCheckbox, IonItem, IonList, IonSearchbar, IonSelect, IonSelectOption, IonText } from '@ionic/react'
import { Area } from '../../types'
import React from 'react'
import { useLandmarks } from '../../hooks/useLandmarks'
import { WarningPopup } from '../../components/WarningPopup'
import { useTrip } from '../../hooks/useTrip'
import { AppScreen } from '../../components/AppScreen'
import { useAreas } from '../../hooks/useAreas'
import LandmarksHelper from '../../helpers/LandmarksHelper'

const pageName = 'Create trip'

export function CreateTripScreen() {
  const [selectedCity, setSelectedCity] = React.useState<string>('')
  const [searchName, setSearchName] = React.useState<string>('')

  const { trip, isGettingTrip, isErrorGettingTrip, changeTrip, isErrorChangingTrip } = useTrip()
  const { landmarks, isGettingLandmarks, isErrorGettingLandmarks } = useLandmarks(selectedCity, searchName)
  const { areas, isGettingAreas, isErrorGettingAreas } = useAreas()

  const displayLandmarks = LandmarksHelper.orderByDistanceFromUser(landmarks ?? [])
  const filterVisitedLandmarks = displayLandmarks.filter((landmark) => !landmark.visited)

  const isLoadingData = isGettingLandmarks || isGettingTrip || isGettingAreas
  const errorLoadingData = isErrorGettingLandmarks || isErrorGettingTrip || isErrorGettingAreas || isErrorChangingTrip || !areas || !trip

  const checkLandmark = (landmarkId: string, selected: boolean) => {
    if (landmarks) {
      const landmark = landmarks.find((landmark) => landmark.id === landmarkId)
      if (landmark) {
        changeTrip({ landmark, addToTrip: selected })
      }
    }
  }

  return (
    <AppScreen name={pageName}>
      <h3>Filter landmarks</h3>
      <IonSearchbar
        placeholder="Which landmark are you looking for?"
        value={searchName}
        onIonChange={(e) => {
          setSearchName(String(e.target.value))
        }}
      />
      <IonItem>
        <IonSelect
          label="Destination:"
          aria-label="Select a destination city for filtering landmarks"
          placeholder="Select a destination"
          value={selectedCity}
          onIonChange={(e) => setSelectedCity(e.target.value)}
        >
          <IonSelectOption value="">No city</IonSelectOption>
          {areas &&
            areas.map((area: Area) => (
              <IonSelectOption key={area.id} value={area.name}>
                {area.name}
              </IonSelectOption>
            ))}
        </IonSelect>
      </IonItem>

      <h2>Landmarks ({filterVisitedLandmarks.length})</h2>
      <IonList className="list__fixed">
        <>
          {isLoadingData && <IonText>Loading data ... </IonText>}
          {filterVisitedLandmarks.map((landmark) => (
            <IonItem key={landmark.id}>
              <IonCheckbox
                value={landmark.id}
                checked={landmark.inTrip}
                onIonChange={(e) => {
                  checkLandmark(e.target.value, e.target.checked)
                }}
              >
                {landmark.sources[0].name} - {landmark.distance?.toFixed(2)} km
              </IonCheckbox>
            </IonItem>
          ))}

          {landmarks && landmarks.length === 0 && (
            <IonItem>
              <IonText>Could not find any landmarks.</IonText>
            </IonItem>
          )}

          {errorLoadingData && <WarningPopup title="Warning" message="Something went wrong." isOpen={true} />}
        </>
      </IonList>

      <IonButton className="btn__home btn__download btn__color" routerLink="/trip/plan" disabled={trip && trip.landmarks.length === 0}>
        Plan route
      </IonButton>
    </AppScreen>
  )
}
