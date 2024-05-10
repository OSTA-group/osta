import { AdapterMethodParameters, MarketplaceExtension, Extension, SourceLandmark } from '../types'
import { jsPython } from 'jspython-interpreter'
import axios from 'axios'
import IonicStorage from '../databases/IonicStorage'
import CryptoJS from 'crypto-js'
import AdapterHelper from '../helpers/AdapterHelper'

const PACKAGES = {
  axios: axios,
}

async function installExtension(newExtension: MarketplaceExtension): Promise<Extension> {
  // Get code for file
  const response = await axios.get<string>(newExtension.url, { responseType: 'stream' })

  // Check if file is the same file as the file that was verified
  if (CryptoJS.MD5(response.data).toString() !== newExtension.fileHash) {
    throw new Error('Code hash differs from expected file hash')
  }

  const codeUrl = `${newExtension.name}-extension-v${newExtension.version}-code`
  await IonicStorage.set(codeUrl, response.data)

  return {
    name: newExtension.name,
    type: newExtension.type,
    version: newExtension.version,
    url: codeUrl,
    verified: true,
  } as Extension
}

async function uninstallExtension(extension: Extension): Promise<void> {
  await IonicStorage.remove(extension.url)
}

export async function getLandmarks({ extension, boundingBox, boundingCircle }: AdapterMethodParameters): Promise<SourceLandmark[]> {
  const interpreter = jsPython()
  interpreter.registerPackagesLoader((packageName) => {
    // @ts-expect-error package has any type, Typescript cannot cast string to package type
    return PACKAGES[packageName]
  })

  interpreter.addFunction('getVariableFromStorage', async (variable) => {
    return await AdapterHelper.getValueForVariable(extension, variable)
  })

  const code = (await IonicStorage.get(extension.url)) as string

  return (await interpreter
    .evaluate(code, { boundingBox: boundingBox, boundingCircle: boundingCircle })
    .catch((e) => console.error(e))) as SourceLandmark[]
}

export default { installExtension, uninstallExtension, getLandmarks }
