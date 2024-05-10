/**
 * @packageDocumentation
 * Provides functionality for managing landmarks, areas, and sources in an IndexedDB database.
 */

import { IDBPDatabase } from 'idb'
import { Landmark } from '../types'

/**
 * Database name constant.
 * @type {string}
 */
declare const dbname: string

/**
 * Constant for landmark object store name.
 * @type {string}
 */
declare const landmarkStore: string

/**
 * Constant for area object store name.
 * @type {string}
 */
declare const areaStore: string

/**
 * Constant for extension object store name.
 * @type {string}
 */
declare const extensionStore: string

/**
 * Asynchronously initializes the landmark storage by opening the IndexedDB database. If needed this function will also run database migrations.
 * @returns {Promise<void>} A Promise that resolves when the database is successfully initialized.
 */
declare async function initialiseLandmarkStorage(): Promise<void>

/**
 * Retrieves the IDB database instance.
 * @returns {IDBPDatabase<Landmark>} The IDB database instance.
 */
declare function getDatabase(): IDBPDatabase<Landmark>
