import IonicStorage from '../databases/IonicStorage'
import { Landmark, Trip } from '../types'
import LandmarkRepository from '../repository/LandmarkRepository'

async function getTrip(): Promise<Trip> {
  return (await IonicStorage.get('trip')) as Trip
}

async function addLandmarkToTrip(landmark: Landmark): Promise<void> {
  const trip = (await IonicStorage.get('trip')) as Trip
  trip.landmarks.push(landmark)
  await LandmarkRepository.putIsInTrip(landmark.id, true)
  await IonicStorage.set('trip', trip)
}

async function removeLandmarkFromTrip(landmark: Landmark): Promise<void> {
  const trip: Trip = (await IonicStorage.get('trip')) as Trip
  trip.landmarks = trip.landmarks.filter((tripLandmark) => tripLandmark.id !== landmark.id)
  await LandmarkRepository.putIsInTrip(landmark.id, false)
  await IonicStorage.set('trip', trip)
}

async function startTrip(): Promise<void> {
  const trip = (await IonicStorage.get('trip')) as Trip
  trip.started = true
  await IonicStorage.set('trip', trip)
}

async function endTrip(): Promise<void> {
  const trip = (await IonicStorage.get('trip')) as Trip
  trip.started = false
  trip.landmarks.map(async (landmark) => await LandmarkRepository.putIsInTrip(landmark.id, false))
  trip.landmarks = []
  trip.nextLandmarkId = 0
  trip.isLastVisited = false
  await IonicStorage.set('trip', trip)
}

async function flipOrder(landmarkIndex1: number, landmarkIndex2: number): Promise<void> {
  const trip = (await IonicStorage.get('trip')) as Trip

  const temp = trip.landmarks[landmarkIndex1]
  trip.landmarks[landmarkIndex1] = trip.landmarks[landmarkIndex2]
  trip.landmarks[landmarkIndex2] = temp

  await IonicStorage.set('trip', trip)
}

async function setNextLandmarkInTrip(): Promise<void> {
  const trip = (await IonicStorage.get('trip')) as Trip
  trip.nextLandmarkId++

  // Check if exist in trip
  if (trip.landmarks[trip.nextLandmarkId]) {
    await IonicStorage.set('trip', trip)
  } else {
    trip.isLastVisited = true
    await IonicStorage.set('trip', trip)
  }
}

export default {
  getTrip,
  addLandmarkToTrip,
  removeLandmarkFromTrip,
  startTrip,
  endTrip,
  flipOrder,
  setNextLandmarkInTrip,
}
