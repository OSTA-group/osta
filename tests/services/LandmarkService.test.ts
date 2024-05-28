import { afterEach, describe, expect, it, vi } from 'vitest'
import TypeAdapter from '../../src/adapter/TypeAdapter'
import AreaRepository from '../../src/repository/AreaRepository'
import ExtensionRepository from '../../src/repository/ExtensionRepository'
import LandmarkRepository from '../../src/repository/LandmarkRepository'
import LandmarkService from '../../src/services/LandmarkService'
import { BoundingBox, SourceLandmark } from '../../src/types'

vi.mock('../../src/adapter/TypeAdapter', () => ({
  default: {
    executeAdapter: vi.fn(),
  },
}))

vi.mock('../../src/repository/AreaRepository', () => ({
  default: {
    getAreaById: vi.fn(),
    addArea: vi.fn(),
    removeAreaById: vi.fn(),
  },
}))

vi.mock('../../src/repository/ExtensionRepository', () => ({
  default: {
    getExtensions: vi.fn(),
    removeAreaAndLandmarks: vi.fn(),
  },
}))

vi.mock('../../src/repository/LandmarkRepository', () => ({
  default: {
    getLandmarkById: vi.fn(),
    addLandmark: vi.fn(),
    removeAll: vi.fn(),
  },
}))

const areaName = 'New Area'
const mockBounds = { topLeft: { lat: 1, lng: 1 }, bottomRight: { lat: 2, lng: 2 } } as BoundingBox
const mockExtensions = [{ name: 'Extension 1', configured: true }]

describe('downloadLandmarksForNewArea', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should handle no usable extensions', async () => {
    const setSourceName = vi.fn()

    ExtensionRepository.getExtensions.mockResolvedValue([])

    const areaName = 'New Area'
    await LandmarkService.downloadLandmarksForNewArea(areaName, mockBounds, setSourceName)

    expect(setSourceName).not.toHaveBeenCalled()
  })

  it('should handle errors during landmark download', async () => {
    const setSourceName = vi.fn()

    ExtensionRepository.getExtensions.mockResolvedValue(mockExtensions)

    TypeAdapter.executeAdapter.mockRejectedValue('Some error occurred')

    await LandmarkService.downloadLandmarksForNewArea(areaName, mockBounds, setSourceName)

    expect(setSourceName).toHaveBeenCalledWith('Extension 1')
  })

  it('should handle parsing errors', async () => {
    const setSourceName = vi.fn()

    ExtensionRepository.getExtensions.mockResolvedValue(mockExtensions)

    TypeAdapter.executeAdapter.mockResolvedValue([{ invalidProperty: 'Invalid' }])

    await LandmarkService.downloadLandmarksForNewArea(areaName, mockBounds, setSourceName)

    expect(setSourceName).toHaveBeenCalledWith('Extension 1')
  })

  it('should save new area if landmarks are downloaded', async () => {
    const setSourceName = vi.fn()

    ExtensionRepository.getExtensions.mockResolvedValue(mockExtensions)

    TypeAdapter.executeAdapter.mockResolvedValue([
      { name: 'Landmark 1', lat: 1.5, lng: 1.5, description: 'Test landamrk', types: [] } as SourceLandmark,
    ])

    await LandmarkService.downloadLandmarksForNewArea(areaName, mockBounds, setSourceName)

    expect(AreaRepository.addArea).toHaveBeenCalledWith({ name: areaName, countOfLandmarks: 1 })
  })

  it('should not save new area if no landmarks are downloaded', async () => {
    const setSourceName = vi.fn()

    ExtensionRepository.getExtensions.mockResolvedValue(mockExtensions)

    TypeAdapter.executeAdapter.mockResolvedValue([])

    await LandmarkService.downloadLandmarksForNewArea(areaName, mockBounds, setSourceName)

    expect(AreaRepository.addArea).not.toHaveBeenCalled()
  })
})

describe('removeAreaAndLandmarks', () => {
  it('should handle non-existing area', async () => {
    const areaId = 1
    AreaRepository.getAreaById.mockResolvedValue(null)

    await ExtensionRepository.removeAreaAndLandmarks(areaId)

    expect(LandmarkRepository.removeAll).not.toHaveBeenCalled()
    expect(AreaRepository.removeAreaById).not.toHaveBeenCalled()
  })
})
