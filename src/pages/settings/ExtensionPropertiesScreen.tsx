import React, { useEffect, useState } from 'react'
import { ExtensionConfigurationVariable } from '../../types'
import { IonButton, IonText } from '@ionic/react'
import { RouteComponentProps, useHistory } from 'react-router'
import { useExtension } from '../../hooks/useExtension'
import { AppScreen } from '../../components/AppScreen'
import { WarningPopup } from '../../components/WarningPopup'
import { ExtensionConfigurationVariableInput } from '../../components/ExtensionConfigurationVariableInput'
import ExtensionService from '../../services/ExtensionService'
import { FormProvider, useForm } from 'react-hook-form'

const pageName = 'Extension properties'

interface ExtensionPropertiesScreenProperties
  extends RouteComponentProps<{
    extensionName: string
  }> {}

export function ExtensionPropertiesScreen({ match }: ExtensionPropertiesScreenProperties) {
  const { extension, isGettingExtension, isErrorGettingExtension, putConfiguration } = useExtension(match.params.extensionName)
  const [inputValues, setInputValues] = useState<Record<string, unknown>>({})
  const methods = useForm()
  const history = useHistory()

  useEffect(() => {
    // Load values of extension variables if they are already present in local storage
    if (extension) {
      ExtensionService.getExtensionConfigurationVariables(extension).then((variables) => setInputValues(variables))
    }
  }, [extension])

  const handleInputChange = (name: string, value: string) => {
    setInputValues((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const saveChanges = () => {
    if (extension) {
      putConfiguration({ extension: extension, configuration: inputValues })
      history.push('/map')
    }
  }

  return (
    <AppScreen name={pageName}>
      <h3>Properties</h3>
      {isGettingExtension && <IonText>Loading properties...</IonText>}

      {extension && !extension.configurationVariables && <IonText>Nothing to see here! You are all set.</IonText>}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(saveChanges)}>
          {extension &&
            extension.configurationVariables &&
            extension.configurationVariables.map((configurationVariable: ExtensionConfigurationVariable) => (
              <ExtensionConfigurationVariableInput
                key={configurationVariable.name}
                configurationVariable={configurationVariable}
                value={inputValues[configurationVariable.name] as string}
                onInputChange={(value: string) => handleInputChange(configurationVariable.name, value)}
              />
            ))}

          {extension && extension.configurationVariables && (
            <IonButton className={'ion-margin-top'} type={'submit'}>
              Save properties
            </IonButton>
          )}

          {isErrorGettingExtension && (
            <WarningPopup title="Warning" message="Something went wrong while getting the properties." isOpen={true} />
          )}
        </form>
      </FormProvider>
    </AppScreen>
  )
}
