/**
 * @packageDocumentation
 * Provides functions to manage adapters that interact with various marketplace extensions. It allows registering adapters, installing and uninstalling extensions, and executing adapter methods to retrieve landmarks from sources.
 */

import {
  AdapterMethodParameters,
  Extension,
  MarketplaceExtension,
  SourceLandmark
} from '../types'

/**
 * Registers an adapter with the specified methods.
 * @param {string} type The type of the adapter.
 * @param {(params: MarketplaceExtension) => Promise<Extension>} extensionDownload A function that downloads an extension from a marketplace.
 * @param {(params: Extension) => Promise<void>} extensionUninstall A function that uninstalls an extension.
 * @param {(params: AdapterMethodParameters) => Promise<SourceLandmark[]>} landmarkDownload A function that downloads landmarks associated with a source.
 */
declare function registerAdapter(type: string, extensionDownload: (params: MarketplaceExtension) => Promise<Extension>, extensionUninstall: (params: Extension) => Promise<void>, landmarkDownload: (params: AdapterMethodParameters) => Promise<SourceLandmark[]>): void

/**
 * Installs an extension of the specified type.
 * @param {string} type The type of the extension to install.
 * @param {MarketplaceExtension} params Parameters required for installing the adapter.
 * @returns {Promise<Extension>} A Promise resolving to the extension object to be installed.
 * @throws Error if the adapter for the specified type is not found.
 */
declare async function installExtension(type: string, params: MarketplaceExtension): Promise<Extension>

/**
 * Uninstalls an extension of the specified type.
 * @param {string} type The type of the extension to uninstall.
 * @param {Extension} params The extension to be uninstalled.
 * @returns {Promise<void>} A Promise that resolves when the adapter specific information for the extension is deleted.
 * @throws Error if the adapter for the specified type is not found.
 */
declare async function uninstallExtension(type: string, params: Extension): Promise<void>

/**
 * Executes the extension type adapter for the specifed adapter type and extension.
 * @param {string} type The type of the adapter to execute.
 * @param {Extension} params The extension to be executed.
 * @returns {Promise<SourceLandmark[]>} A Promise resolving to an array of landmarks associated with the source.
 * @throws Error if the adapter for the specified type is not found.
 */
declare async function executeAdapter(type: string, params: AdapterMethodParameters): Promise<SourceLandmark[]>
