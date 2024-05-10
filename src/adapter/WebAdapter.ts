import { AdapterMethodParameters, MarketplaceExtension, Extension, SourceLandmark, WebExtension } from '../types'
import axios from 'axios'
import AdapterHelper from '../helpers/AdapterHelper'

async function installExtension(newExtension: MarketplaceExtension): Promise<Extension> {
  return {
    name: newExtension.name,
    type: newExtension.type,
    version: newExtension.version,
    url: newExtension.url,
    verified: true,
    urlFilterable: newExtension.properties['urlFilterable'] === 'true',
  } as WebExtension
}

async function uninstallExtension(extension: Extension): Promise<void> {}

async function getLandmarks({ extension, boundingBox, boundingCircle }: AdapterMethodParameters): Promise<SourceLandmark[]> {
  // Parse all variables
  const params = Object.fromEntries(
    await Promise.all(
      extension.variables.map(async (variable) => {
        return [variable, await AdapterHelper.getValueForVariable(extension, variable)]
      })
    )
  )

  // If web extension allows filtering on area filter
  if ((extension as WebExtension).urlFilterable) {
    params['north-west'] = [boundingBox.topLeft.lat, boundingBox.topLeft.lng]
    params['south-east'] = [boundingBox.bottomRight.lat, boundingBox.bottomRight.lng]
    params['center'] = [boundingCircle.center.lat, boundingCircle.center.lng]
    params['radius'] = boundingCircle.radius
  }

  const response = await axios.get<SourceLandmark[]>(extension.url, { params })

  if (response.status !== 200) {
    console.error(`Failed to get Landmarks from ${extension.url}`)
    return []
  }

  return response.data as SourceLandmark[]
}

export default { installExtension, uninstallExtension, getLandmarks }
