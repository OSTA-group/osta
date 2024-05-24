import React from 'react'
import { IonInput, IonItem, IonSelect, IonSelectOption, IonText } from '@ionic/react'
import { ExtensionConfigurationVariable } from '../types'
import { TextFieldTypes } from '@ionic/core'
import { useFormContext } from 'react-hook-form'

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
  const {
    register,
    formState: { errors },
  } = useFormContext()

  if (type === 'select' && options && options.length > 0) {
    return (
      <>
        <IonItem>
          <IonSelect
            label={'Pick a ' + title + (required ? ' *' : '')}
            value={value}
            onIonChange={(event) => onInputChange(event.target.value)}
            {...register(configurationVariable.name, { required })}
          >
            {options.map((option, index) => (
              <IonSelectOption key={index} value={option.value}>
                {option.name}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        {errors[configurationVariable.name] && <IonText color="danger">{title} is required</IonText>}
      </>
    )
  } else {
    return (
      <>
        <IonItem>
          <IonInput
            required={required}
            type={type as TextFieldTypes}
            label={title + (required ? ' *' : '')}
            value={value}
            labelPlacement={'floating'}
            {...register(configurationVariable.name, { required })}
            onIonChange={(event) => onInputChange(String(event.target.value))}
          />
        </IonItem>
        {errors[configurationVariable.name] && <IonText color="danger">{title} is required</IonText>}
      </>
    )
  }
}
