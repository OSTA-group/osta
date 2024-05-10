import React from 'react';
import { IonAlert } from '@ionic/react';

interface ErrorWarningProps {
  title: string
  message: string
  isOpen: boolean
}

export function WarningPopup({ title, message, isOpen}: ErrorWarningProps) {
  return (
      <IonAlert
        isOpen={isOpen}
        header={title}
        message={message}
        buttons={['OK']}
      />
  )
}
