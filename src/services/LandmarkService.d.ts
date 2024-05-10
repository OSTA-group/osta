/**
 * @packageDocumentation
 * Provides functionality for managing landmarks within specified geographical areas. It includes methods to download landmarks for a new area and to remove an area along with its associated landmarks from the database.
 */

import { BoundingBox } from '../types'

/**
 * Downloads landmarks for a new area by calling all extensions that have been configured.
 * @param {string} areaName The name of the area.
 * @param {BoundingBox} boundingBox The bounding box for the area.
 * @param {(sourceName: string) => void} setSourceName A callback method for keeping track of the extension that is currently being executed.
 * @returns {Promise<void>} A promise that resolves when the landmarks are downloaded and saved.
 */
declare async function downloadLandmarksForNewArea(areaName: string, boundingBox: BoundingBox, setSourceName: (sourceName: string) => void): Promise<void>

/**
 * Removes an area and its associated landmarks from the database.
 * @param {number} areaId The ID of the area to remove.
 * @returns {Promise<void>} A Promise that resolves when the removal is complete.
 */
declare async function removeAreaAndLandmarks(areaId: number): Promise<void>
