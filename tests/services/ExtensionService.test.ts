import { afterEach, describe, expect, it, vi } from 'vitest'
import TypeAdapter from '../../src/adapter/TypeAdapter'
import ExtensionApi from '../../src/api/ExtensionApi'
import AdapterHelper from '../../src/helpers/AdapterHelper'
import ExtensionRepository from '../../src/repository/ExtensionRepository'
import ExtensionService from '../../src/services/ExtensionService'
import { Extension, MarketplaceExtension } from '../../src/types'

vi.mock('../../src/repository/ExtensionRepository', () => ({
  default: {
    getExtensionByName: vi.fn(),
    removeExtensionById: vi.fn(),
    addExtension: vi.fn(),
  },
}))

vi.mock('../../src/adapter/TypeAdapter', () => ({
  default: {
    uninstallExtension: vi.fn(),
    installExtension: vi.fn(),
  },
}))

vi.mock('../../src/api/ExtensionApi', () => ({
  default: {
    downloadExtensionConfiguration: vi.fn(),
  },
}))

vi.mock('../../src/helpers/AdapterHelper', () => ({
  default: {
    setValueForVariable: vi.fn(),
    getValueForVariable: vi.fn(),
    removeValueForVariable: vi.fn(),
  },
}))

const mockInstalledExtension = {
  id: 1,
  name: 'TestExtension',
  version: 2,
  type: 'TestType',
  configured: true,
  variables: ['variable1', 'variable2'],
} as Extension

describe('downloadNewExtension', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should install the new extension if no extension is installed', async () => {
    const extension = { name: 'Test Extension', version: 2, type: 'TestType', configurationUrl: '' } as MarketplaceExtension
    ExtensionRepository.getExtensionByName.mockResolvedValue(null)
    TypeAdapter.installExtension.mockResolvedValue({ ...extension, configured: true, variables: [] })

    await ExtensionService.downloadNewExtension(extension)

    expect(TypeAdapter.installExtension).toHaveBeenCalledWith(extension.type, extension)
    expect(ExtensionRepository.addExtension).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Extension',
        version: 2,
        configured: true,
      })
    )
  })

  it('should uninstall the old extension and install the new one if the installed version is lower', async () => {
    const newExtension = { name: 'Test Extension', version: 3, type: 'TestType', configurationUrl: '' } as MarketplaceExtension

    ExtensionRepository.getExtensionByName.mockResolvedValue(mockInstalledExtension)
    TypeAdapter.installExtension.mockResolvedValue({ ...newExtension, configured: true, variables: [] })

    await ExtensionService.downloadNewExtension(newExtension)

    expect(TypeAdapter.uninstallExtension).toHaveBeenCalledWith(mockInstalledExtension.type, mockInstalledExtension)
    expect(ExtensionRepository.removeExtensionById).toHaveBeenCalledWith(mockInstalledExtension.id)
    expect(TypeAdapter.installExtension).toHaveBeenCalledWith(newExtension.type, newExtension)
    expect(ExtensionRepository.addExtension).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Extension',
        version: 3,
        configured: true,
      })
    )
  })

  it('should do nothing if the installed version is higher', async () => {
    const extension = { name: 'Test Extension', version: 1, type: 'TestType', configurationUrl: '' } as MarketplaceExtension

    ExtensionRepository.getExtensionByName.mockResolvedValue(mockInstalledExtension)

    await ExtensionService.downloadNewExtension(extension)

    expect(TypeAdapter.uninstallExtension).not.toHaveBeenCalled()
    expect(ExtensionRepository.removeExtensionById).not.toHaveBeenCalled()
    expect(TypeAdapter.installExtension).not.toHaveBeenCalled()
    expect(ExtensionRepository.addExtension).not.toHaveBeenCalled()
  })

  it('should fetch configuration variables if the extension has a configuration URL', async () => {
    const extension = {
      name: 'Test Extension',
      version: 2,
      type: 'test type',
      configurationUrl: 'https://test.com',
    } as MarketplaceExtension
    const configVariables = [{ key: 'key1', value: 'value1' }]
    ExtensionRepository.getExtensionByName.mockResolvedValue(null)
    TypeAdapter.installExtension.mockResolvedValue({ ...extension, configured: false, variables: [] })
    ExtensionApi.downloadExtensionConfiguration.mockResolvedValue(configVariables)

    await ExtensionService.downloadNewExtension(extension)

    expect(ExtensionApi.downloadExtensionConfiguration).toHaveBeenCalledWith(extension)
    expect(ExtensionRepository.addExtension).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Extension',
        version: 2,
        configured: false,
        configurationVariables: configVariables,
      })
    )
  })
})

describe('deleteExtension', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should delete extension if found', async () => {
    ExtensionRepository.getExtensionByName.mockResolvedValue(mockInstalledExtension)

    await ExtensionService.deleteExtension('TestExtension')

    expect(TypeAdapter.uninstallExtension).toHaveBeenCalledWith(mockInstalledExtension.type, mockInstalledExtension)
    expect(ExtensionRepository.removeExtensionById).toHaveBeenCalledWith(mockInstalledExtension.id)
  })

  it('should throw error if extension is not found', async () => {
    ExtensionRepository.getExtensionByName.mockResolvedValue(undefined)

    await expect(ExtensionService.deleteExtension('NonExistentExtension')).rejects.toThrowError(
      'Extension NonExistentExtension not found, aborting deletion'
    )
    expect(TypeAdapter.uninstallExtension).not.toHaveBeenCalled()
    expect(ExtensionRepository.removeExtensionById).not.toHaveBeenCalled()
  })
})

describe('getExtensionConfigurationVariables', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return configuration variables for an extension', async () => {
    const mockVariables = { variable1: 'value1', variable2: 'value2' }
    AdapterHelper.getValueForVariable.mockImplementation((extension: unknown, variableName: string) =>
      Promise.resolve(mockVariables[variableName])
    )

    const result = await ExtensionService.getExtensionConfigurationVariables(mockInstalledExtension)

    expect(result).toEqual(mockVariables)
  })
})

describe('changeConfigurationForExtension', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })
  it('should change configuration variables for an extension', async () => {
    const mockConfiguration = { variable1: 'newValue1', variable2: 'newValue2' }
    AdapterHelper.setValueForVariable.mockResolvedValue(undefined)

    await ExtensionService.changeConfigurationForExtension(mockInstalledExtension, mockConfiguration)

    expect(AdapterHelper.setValueForVariable).toHaveBeenCalledWith(mockInstalledExtension, 'variable1', 'newValue1')
    expect(AdapterHelper.setValueForVariable).toHaveBeenCalledWith(mockInstalledExtension, 'variable2', 'newValue2')
    expect(ExtensionRepository.addExtension).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockInstalledExtension,
        configured: true,
      })
    )
  })
})
