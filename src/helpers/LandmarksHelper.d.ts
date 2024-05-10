/**
 * @packageDocumentation
 * Provides helper functions for working with landmarks and landmark arrays.
 */

import { Landmark } from '../types'

/**
 * Calculates a unique identifier for a landmark based on its location rounded to 3 digits.
 * @param {Landmark} landmark The landmark object containing the location.
 * @returns {string} The unique identifier for the landmark.
 */
declare function getLandmarkId(landmark: Landmark): string

/**
 * Orders an array of landmarks based on their distances from the user's location.
 * @param {Landmark[]} landmarks An array of landmarks to be ordered.
 * @returns {Landmark[]} An array of landmarks ordered by distance from the user's location.
 */
declare function orderByDistanceFromUser(landmarks: Landmark[]): Landmark[]
