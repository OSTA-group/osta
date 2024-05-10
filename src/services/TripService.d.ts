/**
 * @packageDocumentation
 * Service that interfaces with the Sources saved in Ionic Local Storage.
 */

import { Landmark } from "../types"

/**
 * Retrieves the trip from IonicStorage.
 * @returns {Promise<Trip>} A promise that resolves with the trip object.
 */
declare async function getTrip(): Promise<Trip>

/**
 * Adds a landmark to the trip, updates storage, and sets the landmark's status to in trip.
 * @param {Landmark} landmark The landmark to add to the trip.
 * @returns {Promise<void>} A promise that resolves when the landmark is added to the trip.
 */
declare async function addLandmarkToTrip(landmark: Landmark): Promise<void>

/**
 * Removes a landmark from the trip, updates storage, and sets the landmark's status to not in trip.
 * @param {Landmark} landmark The landmark to remove from the trip.
 * @returns {Promise<void>} A promise that resolves when the landmark is removed from the trip.
 */
declare async function removeLandmarkFromTrip(landmark: Landmark): Promise<void>

/**
 * Marks the trip as started and updates storage.
 * @returns {Promise<void>} A promise that resolves when the trip is marked as started.
 */
declare async function startTrip(): Promise<void>

/**
 * Marks the trip as ended, updates storage, and sets all landmarks' status to not in trip.
 * @returns {Promise<void>} A promise that resolves when the trip is marked as ended.
 */
declare async function endTrip(): Promise<void>

/**
 * Reorders landmarks in the trip by swapping the positions of two landmarks.
 * @param {number} landmarkIndex1 The index of the first landmark to swap.
 * @param {number} landmarkIndex2 The index of the second landmark to swap.
 * @returns {Promise<void>} A promise that resolves when the landmarks are reordered.
 */
declare async function flipOrder(landmarkIndex1: number, landmarkIndex2: number): Promise<void>

/**
 * Moves to the next landmark in the trip and updates the trip information in storage.
 * If the next landmark exists in the trip, it updates the trip with the next landmark.
 * If the next landmark does not exist, it marks the trip as completed.
 * @returns {Promise<void>} A promise that resolves when the next landmark is shown or the trip is completed.
 */
declare async function setNextLandmarkInTrip(): Promise<void>