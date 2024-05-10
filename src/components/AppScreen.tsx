import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import React, { ReactNode } from 'react'

interface PageProperties {
  name: string
  contentPadding?: boolean
  children?: ReactNode
}

export function AppScreen({ name, contentPadding = true, children }: PageProperties) {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className={contentPadding ? 'ion-padding' : ''}>{children}</IonContent>
    </IonPage>
  )
}
