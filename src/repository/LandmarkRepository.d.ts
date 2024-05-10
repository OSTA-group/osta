/**
 * @packageDocumentation
 * Repository that interfaces with the landmarks saved in IDB storage.
 */

import { Landmark } from '../types'

/**
 * Adds a landmark to the database. Before adding the landmark it will calculate and set its ID.
 * @param {Landmark} landmark The landmark object to be added.
 * @returns {Promise<void>} A Promise that resolves when the operation is completed.
 */
declare async function saveLandmark(landmark: Landmark): Promise<void>

/**
 * Retrieves a landmark from the database by its ID.
 * @param {number} id The ID of the landmark to retrieve.
 * @returns {Promise<void>} A Promise that resolves with the retrieved landmark.
 */
declare async function getLandmarkById(id: number): Promise<Landmark>

/**
 * Retrieves landmarks from the database by their area.
 * @param {string} area The area to filter landmarks by.
 * @returns {Promise<Landmark[]>} A Promise that resolves with an array of landmarks matching the specified area.
 */
declare async function getLandmarksByArea(area: string): Promise<Landmark[]>

/**
 * Retrieves landmarks based on the provided area and/or name.
 * @param {string} area The area to filter landmarks by.
 * @param {string} name The name or partial name of the landmark to filter by.
 * @returns {Promise<Landmark[]>} A Promise that resolves to an array of Landmark objects matching the specified criteria.
 */
declare function getLandmarksByAreaAndName(area: string, name: string): Promise<Landmark[]>

/**
 * Updates the 'visited' status of a landmark in the database.
 * @param {number} landmarkId The ID of the landmark to update.
 * @param {boolean} visited The new 'visited' status for the landmark.
 * @returns {Promise<void>} A Promise that resolves when the operation is completed.
 */
declare async function putIsVisitedLandmark(landmarkId: number, visited: boolean): Promise<void>

/**
 * Updates the 'inTrip' status of a landmark in the database.
 * @param {Landmark} landmark The landmark object to update.
 * @param {boolean} inTrip The new 'inTrip' status for the landmark.
 * @returns {Promise<void>} A Promise that resolves when the operation is completed.
 */
declare async function putIsInTrip(landmark: Landmark, inTrip: boolean): Promise<void>

/**
 * Removes the specified landmarks from the database.
 * @param {Landmark[]} landmarksToRemove An array of `Landmark` objects to remove.
 * @returns {Promise<void>} A Promise that resolves when the removal is complete.
 */
declare async function removeAll(landmarksToRemove: Landmark[]): Promise<void>
