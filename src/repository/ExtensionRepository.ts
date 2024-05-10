import IdbStorage from '../databases/IdbStorage'
import { Extension } from '../types'

async function addExtension(extension: Extension): Promise<void> {
  await IdbStorage.getDatabase().put(IdbStorage.extensionStore, extension)
}

async function getExtensions(): Promise<Extension[]> {
  return await IdbStorage.getDatabase().getAll(IdbStorage.extensionStore)
}

async function getExtensionByName(extensionName: string): Promise<Extension | undefined> {
  const extensions = await getExtensions()

  return extensions.find((extension) => extension.name === extensionName)
}

async function removeExtensionById(id: number): Promise<void> {
  await IdbStorage.getDatabase().delete(IdbStorage.extensionStore, id)
}

export default { getExtensions, addExtension, getExtensionByName, removeExtensionById }
