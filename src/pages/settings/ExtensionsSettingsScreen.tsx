import { IonAlert, IonButton, IonIcon, IonItem, IonLabel, IonList, IonRouterLink, IonText } from '@ionic/react'
import React, { useState } from 'react'
import { checkmarkCircleOutline, trashOutline } from 'ionicons/icons'
import { Extension } from '../../types'
import { useExtensions } from '../../hooks/useExtensions'
import { AppScreen } from '../../components/AppScreen'
import { LoadingIndicator } from '../../components/LoadingIndicator'
import { WarningPopup } from '../../components/WarningPopup'

const pageName = 'Manage extensions'

export function ExtensionsSettingsScreen() {
  const [showAlert, setShowAlert] = useState(false)
  const [selectedExtension, setSelectedExtension] = useState<Extension | undefined>()

  const { installedExtensions, isGettingInstalledExtensions, isErrorGettingInstalledExtensions, deleteExtension } = useExtensions()

  function handleDeleteClick(extension: Extension) {
    setSelectedExtension(extension)
    setShowAlert(true)
  }

  function handleAlertConfirm() {
    setShowAlert(false)
    if (selectedExtension !== undefined) {
      deleteExtension(selectedExtension.name)
      setSelectedExtension(undefined)
    }
  }

  function handleAlertCancel() {
    setShowAlert(false)
  }

  if (isGettingInstalledExtensions) {
    return (
      <AppScreen name={pageName}>
        <LoadingIndicator text="Loading installed extensions..." />
      </AppScreen>
    )
  }

  if (isErrorGettingInstalledExtensions || !installedExtensions) {
    return <WarningPopup title="Warning" message="Something went wrong." isOpen={true} />
  }

  return (
    <AppScreen name={pageName}>
      <IonList inset={true}>
        {installedExtensions.length === 0 && (
          <IonItem>
            <IonText>No extensions available.</IonText>
          </IonItem>
        )}

        {installedExtensions.map((extension: Extension) => (
          <IonItem key={extension.name}>
            <IonLabel>
              <IonRouterLink routerLink={'/extensions/' + extension.name}>
                <IonText color={'dark'}>{extension.name}</IonText>
              </IonRouterLink>
              {extension.verified && <IonIcon className="ion-margin-start" color="primary" icon={checkmarkCircleOutline} />}
            </IonLabel>
            <IonIcon
              className="icon-hover"
              color="danger"
              icon={trashOutline}
              onClick={() => {
                handleDeleteClick(extension)
              }}
            />
          </IonItem>
        ))}
      </IonList>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={handleAlertCancel}
        message={`Are you sure you want to delete ${selectedExtension?.name}?`}
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
      <IonButton className={'btn__color'} routerLink={'/marketplace'}>
        Install new extensions
      </IonButton>
    </AppScreen>
  )
}
