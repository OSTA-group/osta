import { Extension } from '../types'
import IonicStorage from '../databases/IonicStorage'
import ExtensionRepository from '../repository/ExtensionRepository'

async function getValueForVariable(extension: Extension, variableName: unknown): Promise<unknown> {
  const variable = extension.variables.find((variable) => variable === variableName)

  if (!variable) {
    console.error(`Variable ${variableName} not found for extension ${extension.name}`)
    return ''
  }

  return await IonicStorage.get(`${extension.name}-extension-v${extension.version}-variable-${variableName}`).catch((error) => {
    console.error(`Error while getting value for variable ${extension.name}: ${error}`)
    return ''
  })
}

async function setValueForVariable(extension: Extension, variableName: string, variable: unknown): Promise<void> {
  extension.variables.push(variableName)

  await IonicStorage.set(`${extension.name}-extension-v${extension.version}-variable-${variableName}`, variable)
  await ExtensionRepository.addExtension(extension)
}

async function removeValueForVariable(extension: Extension, variableName: unknown): Promise<void> {
  await IonicStorage.remove(`${extension.name}-extension-v${extension.version}-variable-${variableName}`)
}

export default { getValueForVariable, setValueForVariable, removeValueForVariable }
