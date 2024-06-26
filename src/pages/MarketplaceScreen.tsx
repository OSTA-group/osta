import React, { useEffect } from 'react'
import { AppScreen } from '../components/AppScreen'
import { useMarketplace } from '../hooks/useMarketplace'
import { WarningPopup } from '../components/WarningPopup'
import { IonButton, IonIcon, IonItem, IonList, IonSearchbar, IonSpinner, IonText } from '@ionic/react'
import { checkmarkOutline, downloadOutline } from 'ionicons/icons'
import { useExtensions } from '../hooks/useExtensions'
import { Extension, MarketplaceExtension } from '../types'

import '../components/css/MarketplaceScreen.css'
import { useHistory } from 'react-router'

const pageName = 'Marketplace'

export function MarketplaceScreen() {
  const history = useHistory()

  const [searchName, setSearchName] = React.useState<string>('')
  const { extensions, isGettingExtensions, isErrorGettingExtensions } = useMarketplace(searchName)
  const {
    installedExtensions,
    isGettingInstalledExtensions,
    isErrorGettingInstalledExtensions,
    downloadNewExtension,
    isSuccessDownloadingExtension,
    isErrorDownloadingExtension,
    errorDownloadingExtension,
  } = useExtensions()

  const gettingExtensions = isGettingExtensions || isGettingInstalledExtensions
  const errorGettingExtensions = isErrorGettingExtensions || isErrorGettingInstalledExtensions
  const [downloadingExtension, setDownloadingExtension] = React.useState<MarketplaceExtension | undefined>()

  const startExtensionDownload = (extension: MarketplaceExtension) => {
    setDownloadingExtension(extension)
    downloadNewExtension(extension)
  }

  useEffect(() => {
    if (isSuccessDownloadingExtension && downloadingExtension) {
      if (downloadingExtension.configurationUrl) {
        history.push(`/extensions/${downloadingExtension.name}`)
      }
      setDownloadingExtension(undefined)
    }
  }, [isSuccessDownloadingExtension, downloadingExtension])

  useEffect(() => {
    if (isErrorDownloadingExtension) {
      setDownloadingExtension(undefined)
    }
  }, [isErrorDownloadingExtension])

  return (
    <AppScreen name={pageName}>
      <h3>Filter extensions</h3>
      <IonSearchbar
        placeholder="Which extension are you looking for?"
        value={searchName}
        onIonChange={(e) => {
          setSearchName(String(e.target.value))
        }}
      />
      <IonList inset={true}>
        {gettingExtensions && <IonText>Loading extensions...</IonText>}

        {extensions && !gettingExtensions && extensions.length === 0 && (
          <IonItem>
            <IonText>No extensions available.</IonText>
          </IonItem>
        )}

        {extensions &&
          installedExtensions &&
          extensions.map((extension: MarketplaceExtension) => (
            <IonItem key={extension.name} className="ion-item__flex">
              <IonText className="flex__left">
                <h3 className="ion-text__h3">{extension.name}</h3>
                <small>
                  {extension.type} Extension - Version: {extension.version}
                </small>
              </IonText>
              <InstallExtensionButton
                extension={extension}
                installedExtensions={installedExtensions}
                isBeingInstalled={downloadingExtension?.id === extension.id}
                downloadExtension={() => startExtensionDownload(extension)}
                className="flex__right ion-button__download"
              />
            </IonItem>
          ))}

        {errorGettingExtensions && (
          <WarningPopup title="Warning" message="Something went wrong while getting the extensions." isOpen={true} />
        )}

        {errorDownloadingExtension && <WarningPopup title="Failed to download" message={errorDownloadingExtension.message} isOpen={true} />}
      </IonList>
    </AppScreen>
  )
}

function InstallExtensionButton({
  extension,
  installedExtensions,
  isBeingInstalled,
  downloadExtension,
  className,
}: {
  extension: MarketplaceExtension
  installedExtensions: Extension[]
  isBeingInstalled: boolean
  downloadExtension: () => void
  className?: string
}) {
  const extensionInstalled = installedExtensions.filter((installedExtension) => installedExtension.name === extension.name).length > 0

  if (extensionInstalled) {
    return (
      <IonButton disabled={true} className={className} size={'default'}>
        <IonIcon className="icon-hover" icon={checkmarkOutline} />
      </IonButton>
    )
  }

  if (isBeingInstalled) {
    return (
      <IonButton disabled={true} className={className} size={'default'}>
        <IonSpinner className="ion-spinner__download" />
      </IonButton>
    )
  }

  return (
    <IonButton onClick={downloadExtension} className={className} size={'default'}>
      <IonIcon className="icon-hover" icon={downloadOutline} />
    </IonButton>
  )
}
