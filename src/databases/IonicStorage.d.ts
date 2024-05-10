/**
 * @packageDocumentation
 * Provides functions for interacting with Ionic Storage
 */

/**
 * Creates a new storage with the specified name.
 * @param {string} name The name of the storage.
 * @returns {Promise<void>} A promise that resolves when the storage is successfully created.
 */
declare function createStore(name: string): void

/**
 * Checks if a key exists in the storage.
 * @param {string} key The key to check.
 * @returns {Promise<boolean>} A promise that resolves to true if the key exists, false otherwise.
 */
declare async function exists(key: string): Promise<boolean>

/**
 * Retrieves the value associated with the specified key from the storage.
 * @param {string} key The key to retrieve the value for.
 * @returns {Promise<unknown>} A promise that resolves to the value associated with the key.
 * @throws {Error} If the key does not exist in the storage.
 */
declare async function get(key: string): Promise<unknown>

/**
 * Sets a value for the specified key in the storage.
 * @param {string} key The key to set the value for.
 * @param {unknown} val The value to set.
 * @returns {Promise<void>} A promise that resolves when the value is successfully set.
 */
declare async function set(key: string, val: unknown): Promise<void>

/**
 * Removes the value associated with the specified key from the storage.
 * @param {string} key The key to remove the value for.
 * @returns {Promise<void>} A promise that resolves when the value is successfully removed.
 */
declare async function remove(key: string): Promise<void>

/**
 * Clears all data from the storage.
 * @returns {Promise<void>} A promise that resolves when the storage is successfully cleared.
 */
declare async function clear(): Promise<void>