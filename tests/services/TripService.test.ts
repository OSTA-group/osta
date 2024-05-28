import { afterEach, describe, expect, it, vi } from 'vitest'
import IonicStorage from '../../src/databases/IonicStorage'
import LandmarkRepository from '../../src/repository/LandmarkRepository'
import TripService from '../../src/services/TripService'
import { Landmark, Trip } from '../../src/types'

vi.mock('../../src/databases/IonicStorage', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
  },
}))

vi.mock('../../src/repository/LandmarkRepository', () => ({
  default: {
    putIsInTrip: vi.fn(),
  },
}))

describe('Trip functions', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('addLandmarkToTrip should add landmark to trip and update storage', async () => {
    const mockTrip = { landmarks: [] }
    const mockLandmark = { id: '1' } as Landmark

    IonicStorage.get.mockResolvedValue(mockTrip)

    await TripService.addLandmarkToTrip(mockLandmark)

    expect(IonicStorage.set).toHaveBeenCalledWith('trip', expect.any(Object))
    expect(mockTrip.landmarks).toContain(mockLandmark)
    expect(LandmarkRepository.putIsInTrip).toHaveBeenCalledWith(mockLandmark.id, true)
  })

  it('removeLandmarkFromTrip should remove landmark from trip and update storage', async () => {
    const mockLandmark = { id: '1' } as Landmark
    const mockTrip = { landmarks: [mockLandmark] }

    IonicStorage.get.mockResolvedValue(mockTrip)

    await TripService.removeLandmarkFromTrip(mockLandmark)

    expect(IonicStorage.set).toHaveBeenCalledWith('trip', expect.any(Object))
    expect(mockTrip.landmarks).not.toContain(mockLandmark)
    expect(LandmarkRepository.putIsInTrip).toHaveBeenCalledWith(mockLandmark.id, false)
  })

  it('startTrip should update trip status and update storage', async () => {
    const mockTrip = { started: true, landmarks: [], nextLandmarkId: -1, isLastVisited: true } as Trip

    IonicStorage.get.mockResolvedValue(mockTrip)

    await TripService.startTrip()

    expect(IonicStorage.set).toHaveBeenCalledWith('trip', expect.any(Object))
    expect(mockTrip.started).toBe(true)
    expect(mockTrip.nextLandmarkId).toBe(0)
  })

  it('endTrip should update trip status and clear trip data', async () => {
    const mockLandmark1 = { id: '1' } as Landmark
    const mockLandmark2 = { id: '2' } as Landmark
    const mockTrip = { started: true, landmarks: [mockLandmark1, mockLandmark2], nextLandmarkId: 1, isLastVisited: true } as Trip

    IonicStorage.get.mockResolvedValue(mockTrip)

    await TripService.endTrip()

    expect(IonicStorage.set).toHaveBeenCalledWith('trip', expect.any(Object))
    expect(mockTrip.started).toBe(false)
    expect(mockTrip.landmarks).toEqual([])
    expect(mockTrip.nextLandmarkId).toBe(0)
    expect(mockTrip.isLastVisited).toBe(false)
    expect(LandmarkRepository.putIsInTrip).toHaveBeenCalledTimes(2)
  })

  it('flipOrder should flip the order of landmarks and update storage', async () => {
    const mockLandmark1 = { id: '1' } as Landmark
    const mockLandmark2 = { id: '2' } as Landmark
    const mockTrip = { started: false, landmarks: [mockLandmark1, mockLandmark2], nextLandmarkId: 0, isLastVisited: false } as Trip

    IonicStorage.get.mockResolvedValue(mockTrip)

    await TripService.flipOrder(0, 1)

    expect(IonicStorage.set).toHaveBeenCalledWith('trip', expect.any(Object))
    expect(mockTrip.landmarks).toEqual([mockLandmark2, mockLandmark1])
  })

  it('setNextLandmarkInTrip should increment nextLandmarkId and update storage', async () => {
    const mockLandmark1 = { id: '1' } as Landmark
    const mockLandmark2 = { id: '2' } as Landmark
    const mockTrip = { started: false, landmarks: [mockLandmark1, mockLandmark2], nextLandmarkId: 0, isLastVisited: false } as Trip

    IonicStorage.get.mockResolvedValue(mockTrip)

    await TripService.setNextLandmarkInTrip()

    expect(IonicStorage.set).toHaveBeenCalledWith('trip', expect.any(Object))
    expect(mockTrip.nextLandmarkId).toBe(1)
  })
})
