import React from 'react'
import { IonInput, IonSelect, IonSelectOption } from '@ionic/react'
import { ExtensionConfigurationVariable } from '../types'
import { TextFieldTypes } from '@ionic/core'

interface ExtensionConfigurationVariableInputProperties {
  configurationVariable: ExtensionConfigurationVariable
  value?: string
  onInputChange: (value: string) => void
}

export function ExtensionConfigurationVariableInput({
  configurationVariable,
  value,
  onInputChange,
}: ExtensionConfigurationVariableInputProperties) {
  const { title, type, options, required } = configurationVariable

  if (type === 'select' && options && options.length > 0) {
    return (
      <IonSelect label={'Pick a ' + title} value={value} onIonChange={(event) => onInputChange(event.target.value)}>
        {options.map((option, index) => (
          <IonSelectOption key={index} value={option.value}>
            {option.name}
          </IonSelectOption>
        ))}
      </IonSelect>
    )
  } else {
    return (
      <IonInput
        required={required}
        type={type as TextFieldTypes}
        label={title}
        value={value}
        labelPlacement={'floating'}
        onIonChange={(event) => onInputChange(String(event.target.value))}
      />
    )
  }
}
