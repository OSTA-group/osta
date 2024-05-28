/**
 * @packageDocumentation
 * Provides helper functions for working with distance and angles between locations.
 */

import { BoundingBox, BoundingCircle, Location } from '../types'

/**
 * Calculates the distance in kilometers between two locations using the Haversine formula.
 * @param {Location} location1 The first location.
 * @param {Location} location2 The second location.
 * @returns {number} The distance between the two locations in kilometers.
 */
declare function calculateDistanceKm(location1: Location, location2: Location): number

/**
 * Generates a display string for the distance between two locations in kilometers or meters.
 * @param {Location} location1 The first location.
 * @param {Location} location2 The second location.
 * @returns {string} A string representing the distance between the two locations, with appropriate units (km or m).
 */
declare function getDisplayStringForDistanceInKm(location1: Location, location2: Location): string

/**
 * Calculates the angle in degrees between two locations.
 * The order of the 2 locations matters, the first location is the origin and the second location is the destination.
 * @param {Location} location1 The first locations (origin location).
 * @param {Location} location2 The second location (destination location).
 * @returns {number} The angle in degrees between the two locations.
 */
declare function calculateAngleInDegrees(location1: Location, location2: Location): number

/**
 * Calculates the radius of a bounding circle given a bounding box.
 * @param {BoundingBox} area The bounding box defined by its top-left and bottom-right coordinates.
 * @returns {BoundingCircle} The bounding circle with radius in kilometers and center coordinates.
 */
declare function calculateRadiusByBoundingBox(area: BoundingBox): BoundingCircle
