/**
 * @packageDocumentation
 * Service to track and and request the devices compass' location.
 */

import { Location } from '../types'

/**
 * Function that starts tracking the device location.
 * @returns {Promise<void>} A promise that resolves once the user's location is tracked.
 */
declare async function trackUserLocation(): Promise<void>

/**
 * Retrieves the user's current location.
 * @returns {Location} The user's current location.
 */
declare function getUserLocation(): Location

/**
 * Checks if location tracking is enabled.
 * @returns {boolean} A boolean indicating whether location tracking is enabled or not.
 */
declare function getLocationEnabled(): boolean