/**
 * @packageDocumentation
 * Repository that interfaces with the Extensions saved in IDB storage.
 */

import { Extension } from '../types'

/**
 * Retrieves all extensions from the IndexedDB storage.
 * @returns {Promise<Extension[]>} A Promise that resolves with an array of Extension objects.
 */
declare async function getExtensions(): Promise<Extension[]>

/**
 * Adds an extension to the database.
 * @param {Extension} extension The extension object to be added.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
declare async function addExtension(extension: Extension): Promise<void>

/**
 * Retrieves an extension by its name.
 * @param {string} extensionName The name of the extension to retrieve.
 * @returns {Promise<Extension | undefined>} A promise that resolves to the retrieved extension or `undefined`.
 */
declare async function getExtensionByName(extensionName: string): Promise<Extension | undefined>

/**
 * Deletes the entry corresponding to the given ID from the extension store.
 * @param {number} id The unique identifier of the extension to be removed.
 * @returns {Promise<void>} A promise that resolves when the extension is successfully removed.
 */
declare async function removeExtensionById(id: number): Promise<void>
