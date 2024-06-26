import TypeAdapter from '../adapter/TypeAdapter'
import ExtensionApi from '../api/ExtensionApi'
import AdapterHelper from '../helpers/AdapterHelper'
import ExtensionRepository from '../repository/ExtensionRepository'
import { Extension, MarketplaceExtension } from '../types'

async function downloadNewExtension(extension: MarketplaceExtension): Promise<void> {
  const installedExtension = await ExtensionRepository.getExtensionByName(extension.name)

  if (!installedExtension || installedExtension.version < extension.version) {
    if (installedExtension) {
      await TypeAdapter.uninstallExtension(installedExtension.type, installedExtension)
      await ExtensionRepository.removeExtensionById(installedExtension.id)
    }

    const newExtension = await TypeAdapter.installExtension(extension.type, extension)
    newExtension.configured = true
    newExtension.variables = []

    if (extension.configurationUrl) {
      newExtension.configurationVariables = await ExtensionApi.downloadExtensionConfiguration(extension)
      newExtension.configured = false
    }

    await ExtensionRepository.addExtension(newExtension)
  }
}

async function deleteExtension(extensionName: string): Promise<void> {
  const installedExtension = await ExtensionRepository.getExtensionByName(extensionName)

  if (!installedExtension) {
    throw new Error(`Extension ${extensionName} not found, aborting deletion`)
  }

  // Remove variables
  for (const index in installedExtension.variables) {
    await AdapterHelper.removeValueForVariable(installedExtension, installedExtension.variables[index])
  }

  if (installedExtension) {
    await TypeAdapter.uninstallExtension(installedExtension.type, installedExtension)
    await ExtensionRepository.removeExtensionById(installedExtension.id)
  }
}

async function getExtensionConfigurationVariables(extension: Extension): Promise<Record<string, unknown>> {
  const variables: Record<string, unknown> = {}

  for (const variableName of extension.variables) {
    variables[variableName] = await AdapterHelper.getValueForVariable(extension, variableName)
  }

  return variables
}

async function changeConfigurationForExtension(extension: Extension, configuration: { [key: string]: unknown }): Promise<void> {
  for (const key of Object.keys(configuration)) {
    await AdapterHelper.setValueForVariable(extension, key, configuration[key])
  }

  extension.configured = true
  await ExtensionRepository.addExtension(extension)
}

export default {
  downloadNewExtension,
  deleteExtension,
  getExtensionConfigurationVariables,
  changeConfigurationForExtension,
}
