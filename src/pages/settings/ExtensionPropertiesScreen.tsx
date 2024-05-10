import React, { useState } from 'react'
import { ExtensionConfigurationVariable } from '../../types'
import { IonButton, IonItem, IonList, IonText } from '@ionic/react'
import { RouteComponentProps } from 'react-router'
import { useExtension } from '../../hooks/useExtension'
import { AppScreen } from '../../components/AppScreen'
import { WarningPopup } from '../../components/WarningPopup'
import { ExtensionConfigurationVariableInput } from '../../components/ExtensionConfigurationVariableInput'

const pageName = 'Extension properties'

interface ExtensionPropertiesScreenProperties
  extends RouteComponentProps<{
    extensionName: string
  }> {
}

export function ExtensionPropertiesScreen({ match }: ExtensionPropertiesScreenProperties) {
  const {
    extension,
    isGettingExtension,
    isErrorGettingExtension,
    putConfiguration,
  } = useExtension(match.params.extensionName)
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({})

  const handleInputChange = (name: string, value: string) => {
    setInputValues((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const saveChanges = () => {
    if (extension) {
      putConfiguration({ extension: extension, configuration: inputValues })
    }
  }

  return (
    <AppScreen name={pageName}>
      <h3>Properties</h3>
      {isGettingExtension && <IonText>Loading properties...</IonText>}

      {extension && !extension.configurationVariables && <IonText>Nothing to see here! You are all set.</IonText>}

      <IonList>
        {extension &&
          extension.configurationVariables &&
          extension.configurationVariables.map((configurationVariable: ExtensionConfigurationVariable) => (
            <IonItem key={configurationVariable.name}>
              <ExtensionConfigurationVariableInput
                key={configurationVariable.name}
                configurationVariable={configurationVariable}
                value={inputValues[configurationVariable.name]}
                onInputChange={(value: string) => handleInputChange(configurationVariable.name, value)}
              />
            </IonItem>
          ))}

        {extension && extension.configurationVariables && (
          <IonButton onClick={saveChanges} routerLink={'/map'}>
            Save properties
          </IonButton>
        )}

        {isErrorGettingExtension && (
          <WarningPopup title="Warning" message="Something went wrong while getting the properties." isOpen={true} />
        )}
      </IonList>
    </AppScreen>
  )
}
