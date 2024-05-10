import { IonAlert, IonButton, IonIcon, IonItem, IonLabel, IonList, IonText } from '@ionic/react'
import React, { useState } from 'react'
import { trashOutline } from 'ionicons/icons'
import { Area } from '../../types'
import { useAreas } from '../../hooks/useAreas'
import { AppScreen } from '../../components/AppScreen'
import { LoadingIndicator } from '../../components/LoadingIndicator'
import { WarningPopup } from '../../components/WarningPopup'

const pageName = 'Manage areas'

export function AreasSettingsScreen() {
  const [showAlert, setShowAlert] = useState(false)
  const [selectedArea, setSelectedArea] = useState<Area | undefined>()

  const { areas, isGettingAreas, isErrorGettingAreas, removeArea } = useAreas()

  function handleDeleteClick(area: Area) {
    setSelectedArea(area)
    setShowAlert(true)
  }

  function handleAlertConfirm() {
    setShowAlert(false)
    if (selectedArea !== undefined) {
      removeArea(selectedArea.id)
      setSelectedArea(undefined)
    }
  }

  function handleAlertCancel() {
    setShowAlert(false)
  }

  if (isGettingAreas) {
    return (
      <AppScreen name={pageName}>
        <LoadingIndicator text="Loading installed areas..." />
      </AppScreen>
    )
  }

  if (isErrorGettingAreas || !areas) {
    return <WarningPopup title="Warning" message="Something went wrong." isOpen={true} />
  }

  return (
    <AppScreen name={pageName}>
      <IonList inset={true}>
        {areas.map((area: Area) => {
          return (
            <IonItem key={area.id}>
              <IonLabel>
                {area.name} - {area.countOfLandmarks} landmarks
              </IonLabel>
              <IonIcon
                className="icon-hover"
                color="danger"
                icon={trashOutline}
                onClick={() => {
                  handleDeleteClick(area)
                }}
              />
            </IonItem>
          )
        })}

        {areas.length === 0 && (
          <IonItem>
            <IonText>No areas downloaded.</IonText>
          </IonItem>
        )}
      </IonList>
      <IonButton className={'btn__color'} routerLink={'/download'}>
        Add a new area
      </IonButton>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={handleAlertCancel}
        message={`Are you sure you want to delete ${selectedArea?.name}?`}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: handleAlertCancel,
          },
          {
            text: 'Yes, delete',
            role: 'confirm',
            handler: handleAlertConfirm,
          },
        ]}
      />
    </AppScreen>
  )
}
