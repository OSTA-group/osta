/**
 * @packageDocumentation
 * Repository that interfaces with the areas saved in IDB storage.
 */

import { Area } from '../types'

/**
 * Adds a new area to the database.
 * @param {Area} area The area that will be added.
 * @returns {Promise<void>} A promise that resolves when the area has been added.
 */
declare async function addArea(area: Area): Promise<void>

/**
 * Retrieves an area from the database based on its ID.
 * @param {number} id The ID of the area to retrieve.
 * @returns {Promise<Area>} A Promise that resolves with the retrieved area.
 */
declare async function getAreaById(id: number): Promise<Area>

/**
 * Retrieves all areas from the database.
 * @returns {Promise<Area[]>} A Promise that resolves with an array of areas.
 */
declare async function getAreas(): Promise<Area[]>

/**
 * Removes an area from the database based on its ID.
 *
 * @param {number} id The ID of the area to remove.
 * @returns {Promise<void>} A Promise that resolves when the removal is complete.
 */
declare async function removeAreaById(id: number): Promise<void>
