import { describe, expect, it, vi } from 'vitest'
import TypeAdapter from '../../src/adapter/TypeAdapter'
import ExtensionApi from '../../src/api/ExtensionApi'
import ExtensionRepository from '../../src/repository/ExtensionRepository'
import ExtensionService from '../../src/services/ExtensionService'
import { Extension, MarketplaceExtension } from '../../src/types'

// Mocking dependencies
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

describe('downloadNewExtension', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should install the new extension if no extension is installed', async () => {
    const extension = { name: 'Test Extension', version: 2, type: 'test type', configurationUrl: '' } as MarketplaceExtension
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
    const oldExtension = { id: 1, name: 'Test Extension', version: 1, type: 'test type' } as Extension
    const newExtension = { name: 'Test Extension', version: 2, type: 'test type', configurationUrl: '' } as MarketplaceExtension

    ExtensionRepository.getExtensionByName.mockResolvedValue(oldExtension)
    TypeAdapter.installExtension.mockResolvedValue({ ...newExtension, configured: true, variables: [] })

    await ExtensionService.downloadNewExtension(newExtension)

    expect(TypeAdapter.uninstallExtension).toHaveBeenCalledWith(oldExtension.type, oldExtension)
    expect(ExtensionRepository.removeExtensionById).toHaveBeenCalledWith(oldExtension.id)
    expect(TypeAdapter.installExtension).toHaveBeenCalledWith(newExtension.type, newExtension)
    expect(ExtensionRepository.addExtension).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Extension',
        version: 2,
        configured: true,
      })
    )
  })

  it('should do nothing if the installed version is higher', async () => {
    const installedExtension = { name: 'Test Extension', version: 2, type: 'test type' } as MarketplaceExtension
    const extension = { name: 'Test Extension', version: 1, type: 'test type', configurationUrl: '' } as MarketplaceExtension

    ExtensionRepository.getExtensionByName.mockResolvedValue(installedExtension)

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
