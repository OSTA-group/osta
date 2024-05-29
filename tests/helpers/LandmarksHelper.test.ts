import { afterEach, describe, expect, it, vi } from 'vitest'
import LocationService from '../../src/services/LocationService'
import LandmarkHelper from '../../src/helpers/LandmarksHelper'
import { Landmark } from '../../src/types'

vi.mock('../../src/services/LocationService', () => ({
  default: {
    getUserLocation: vi.fn(),
  },
}))

describe('getLandmarkId', () => {
  it('should return a string combining latitude and longitude without decimal points', () => {
    const location = { lat: 40.7128, lng: 74.006 }
    const result = LandmarkHelper.getLandmarkId(location)
    expect(result).toBe('4071374006')
  })

  it('should return a unique string for negative coordinates', () => {
    const location = { lat: -40.7128, lng: -74.006 }
    const result = LandmarkHelper.getLandmarkId(location)
    expect(result).toBe('-40713-74006')
  })
})

describe('orderByDistanceFromUser', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return landmarks sorted by distance from user location', () => {
    // Mock user location
    LocationService.getUserLocation.mockReturnValue({ lat: 40.7128, lng: -74.006 })

    const landmarks = [
      { id: '1', location: { lat: 40.7128, lng: -74.006 } },
      { id: '2', location: { lat: 51.5074, lng: -0.1278 } },
      { id: '3', location: { lat: 34.0522, lng: -118.2437 } },
    ] as Landmark[]

    const sortedLandmarks = LandmarkHelper.orderByDistanceFromUser(landmarks)

    // Expectation: landmarks should be sorted by distance from user location
    expect(sortedLandmarks).toEqual([
      { distance: 0, id: '1', location: { lat: 40.7128, lng: -74.006 } },
      { distance: 3935.746254609722, id: '3', location: { lat: 34.0522, lng: -118.2437 } },
      { distance: 5570.222179737958, id: '2', location: { lat: 51.5074, lng: -0.1278 } },
    ])
  })
})
