import { MarketplaceExtension, ExtensionConfigurationVariable } from '../types'
import axios from 'axios'

async function downloadExtensionConfiguration(extension: MarketplaceExtension): Promise<ExtensionConfigurationVariable[]> {
  const result = await axios.get<ExtensionConfigurationVariable[]>(extension.configurationUrl)
  return result.data
}

export default { downloadExtensionConfiguration }
