import LocationHelper from '../../src/helpers/LocationHelper'
import { BoundingBox } from '../../src/types'

describe('Function calculate distance should run with success', () => {
  it('calculates distance between two known locations', () => {
    const location1 = { lat: 52.52, lng: 13.405 }
    const location2 = { lat: 48.8566, lng: 2.3522 }

    const expectedDistanceKm = 877.46
    const actualDistanceKm = LocationHelper.calculateDistanceKm(location1, location2)

    expect(actualDistanceKm).toBeCloseTo(expectedDistanceKm, 1)
  })

  it('calculates distance between two known locations', () => {
    const location1 = { lat: 50.819818, lng: 4.381943 }
    const location2 = { lat: 44.59829, lng: 4.107404 }

    const expectedDistanceKm = 692.11
    const actualDistanceKm = LocationHelper.calculateDistanceKm(location1, location2)

    expect(actualDistanceKm).toBeCloseTo(expectedDistanceKm, 1)
  })
})

describe('Function calculate angle in degrees', () => {
  it('calculates angle between two known locations', () => {
    const location1 = { lat: 51.5074, lng: -0.1278 }
    const location2 = { lat: 40.7128, lng: -74.006 }

    const expectedAngleDegrees = 288.33
    const actualAngleDegrees = LocationHelper.calculateAngleInDegrees(location1, location2)

    expect(actualAngleDegrees).toBeCloseTo(expectedAngleDegrees, 1)
  })
})

describe('Function calculate radius for bounding box', () => {
  it('calculates radius for a given bounding box', () => {
    const boundingBox: BoundingBox = {
      topLeft: { lat: 52.52, lng: 13.405 },
      bottomRight: { lat: 48.8566, lng: 2.3522 },
    }

    const expectedRadiusKm = 647.38
    const boundingCircle = LocationHelper.calculateRadiusByBoundingBox(boundingBox)

    expect(boundingCircle.radius).toBeCloseTo(expectedRadiusKm, 1)
  })
})
