/**
 * @packageDocumentation
 * Provides functionality to manage extensions. It includes operations for downloading, deleting, and configuring extensions.
 */

import { Extension, MarketplaceExtension } from '../types'
import AdapterHelper from '../helpers/AdapterHelper'

/**
 * Downloads a new extension from the marketplace.
 * @param {MarketplaceExtension} extension The new extension to download.
 * @returns {Promise<void>} A Promise that resolves when the download is complete.
 * @throws Error Will throw an error if the extension fails to be downloaded.
 */
declare async function downloadNewExtension(extension: MarketplaceExtension): Promise<void>

/**
 * Deletes an installed extension by its name.
 * @param {string} extensionName The name of the extension to be deleted.
 * @returns {Promise<void>} A promise that resolves when the extension has been deleted.
 * @throws Error Will throw an error if the extension cannot be found or there is an issue with the uninstallation or removal process.
 */
declare async function deleteExtension(extensionName: string): Promise<void>

/**
 * Asynchronously retrieves configuration variables for a given extension.
 * @param {Extension} extension The extension object containing variables to be fetched.
 * @returns {Promise<Record<string, unknown>>} A promise that resolves to a record containing the configuration variables.
 */
declare async function getExtensionConfigurationVariables(extension: Extension): Promise<Record<string, unknown>>

/**
 * Changes the configuration for a given extension.
 * @param {Extension} extension The extension to change the configuration for.
 * @param {[key: string]: unknown} configuration The new configuration key-value pairs.
 * @returns {Promise<void>} A promise that resolves when the configuration has been updated.
 * @throws Error Will throw an error if there is an issue setting the configuration values or updating the extension repository.
 */
declare async function changeConfigurationForExtension(extension: Extension, configuration: { [key: string]: unknown }): Promise<void>
