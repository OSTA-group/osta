/**
 * @packageDocumentation
 * Service to track and request the devices compass' rotation.
 */

/**
 * Function that starts tracking the devices absolute rortation.
 * @returns {Promise<void>} A promise that resolves when the devices rotation is getting tracked.
 */
declare async function trackUserRotation(): Promise<void>

/**
 * Gets the current rotation in degrees of the users compass.
 * @returns {number} Current rotation, or 0 if not tracked.
 */
declare function getCompassRotation(): number
