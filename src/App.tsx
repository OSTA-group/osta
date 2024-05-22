import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
import './components/css/IconHelper.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import '@ionic/react/css/palettes/dark.system.css'
import './theme/variables.css'

/* App imports */
import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { IonReactRouter } from '@ionic/react-router'
import { useEffect } from 'react'
import IonicStorage from './databases/IonicStorage'
import LocationService from './services/LocationService'
import { Dialog } from '@capacitor/dialog'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AreasSettingsScreen } from './pages/settings/AreasSettingsScreen'
import { ExtensionsSettingsScreen } from './pages/settings/ExtensionsSettingsScreen'
import { LandmarkDetailScreen } from './pages/LandmarkDetailScreen'
import { CreateTripScreen } from './pages/trip/CreateTripScreen'
import { OrganiseTripScreen } from './pages/trip/OrganiseTripScreen'
import CompassService from './services/CompassService'
import { MapScreen } from './pages/MapScreen'
import { DownloadScreen } from './pages/DownloadScreen'
import IdbStorage from './databases/IdbStorage'
import TypeAdapter from './adapter/TypeAdapter'
import WebAdapter from './adapter/WebAdapter'
import PythonAdapter from './adapter/PythonAdapter'
import axios from 'axios'
import { MarketplaceScreen } from './pages/MarketplaceScreen'
import './components/css/fonts/index.css'
import { ExtensionPropertiesScreen } from './pages/settings/ExtensionPropertiesScreen'

setupIonicReact()

export default function App() {
  // Setup LocalStore database
  useEffect(() => {
    const setupStore = async () => {
      IonicStorage.createStore('OstaDB')
    }

    setupStore()
  }, [])

  // Setup landmark storage
  useEffect(() => {
    const setupLandmarkStorage = async () => {
      await IdbStorage.initialiseLandmarkStorage()
    }

    setupLandmarkStorage()
  }, [])

  // Require location services to be enabled (will be moved to pages that need it later)
  useEffect(() => {
    const enableLocation = async () => {
      while (!LocationService.getLocationEnabled()) {
        try {
          await LocationService.trackUserLocation()
          await CompassService.trackUserRotation()
        } catch (error) {
          await Dialog.alert({
            title: 'Enable Location',
            message: 'Location needs to be turned on in order to use this app.',
          })
        }
      }
    }
    enableLocation()
  }, [])

  // Register extension type adapters
  useEffect(() => {
    TypeAdapter.registerAdapter('web', WebAdapter.installExtension, WebAdapter.uninstallExtension, WebAdapter.getLandmarks)
    TypeAdapter.registerAdapter('python', PythonAdapter.installExtension, PythonAdapter.uninstallExtension, PythonAdapter.getLandmarks)
  })

  const queryClient = new QueryClient({
    queryCache: new QueryCache(),
    mutationCache: new MutationCache(),
  })

  axios.defaults.baseURL = 'https://osta.bauwendr.com'

  return (
    <IonApp>
      <QueryClientProvider client={queryClient}>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path={'/settings/areas'} component={AreasSettingsScreen} />
            <Route path={'/settings/extensions'} component={ExtensionsSettingsScreen} />
            <Route path={'/marketplace'} component={MarketplaceScreen} />
            <Route path={'/extensions/:extensionName'} component={ExtensionPropertiesScreen} />
            <Route path={'/landmark/:landmarkId'} component={LandmarkDetailScreen} />
            <Route path={'/trip/create'} component={CreateTripScreen} />
            <Route path={'/trip/plan'} component={OrganiseTripScreen} />
            <Route path={'/map'} component={MapScreen} />
            <Route path={'/download'} component={DownloadScreen} />
            <Redirect exact from="/" to="/map" />
          </IonRouterOutlet>
        </IonReactRouter>
      </QueryClientProvider>
    </IonApp>
  )
}
