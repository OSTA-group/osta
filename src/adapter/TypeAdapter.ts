import { AdapterMethodParameters, MarketplaceExtension, Extension, SourceLandmark } from '../types'

type Adapter = {
  extensionDownloadAdapter: (params: MarketplaceExtension) => Promise<Extension>
  extensionUninstallAdapter: (params: Extension) => Promise<void>
  landmarksDownloadAdapter: (params: AdapterMethodParameters) => Promise<SourceLandmark[]>
}

const adapters: Record<string, Adapter> = {}

function registerAdapter(
  type: string,
  extensionDownload: (params: MarketplaceExtension) => Promise<Extension>,
  extensionUninstall: (params: Extension) => Promise<void>,
  landmarkDownload: (params: AdapterMethodParameters) => Promise<SourceLandmark[]>
): void {
  adapters[type] = {
    extensionDownloadAdapter: extensionDownload,
    extensionUninstallAdapter: extensionUninstall,
    landmarksDownloadAdapter: landmarkDownload,
  }
}

async function installExtension(type: string, params: MarketplaceExtension): Promise<Extension> {
  const method = adapters[type]?.extensionDownloadAdapter

  if (method) {
    return await method(params)
  } else {
    throw Error(`Adapter not found for type ${type}`)
  }
}

async function uninstallExtension(type: string, params: Extension): Promise<void> {
  const method = adapters[type]?.extensionUninstallAdapter

  if (method) {
    return await method(params)
  } else {
    throw Error(`Adapter not found for type ${type}`)
  }
}

async function executeAdapter(type: string, params: AdapterMethodParameters): Promise<SourceLandmark[]> {
  const method = adapters[type]?.landmarksDownloadAdapter

  if (method) {
    return await method(params)
  } else {
    throw Error(`Adapter not found for type ${type}`)
  }
}

export default { registerAdapter, installExtension, uninstallExtension, executeAdapter }
