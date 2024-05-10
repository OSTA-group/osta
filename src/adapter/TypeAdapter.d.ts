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
 * @param type {string} The type of the adapter.
 * @param extensionDownload {(params: MarketplaceExtension) => Promise<Extension>} A function that downloads an extension from a marketplace.
 * @param extensionUninstall {(params: Extension) => Promise<void>} A function that uninstalls an extension.
 * @param landmarkDownload  {(params: AdapterMethodParameters) => Promise<SourceLandmark[]>} A function that downloads landmarks associated with a source.
 */
declare function registerAdapter(type: string, extensionDownload: (params: MarketplaceExtension) => Promise<Extension>, extensionUninstall: (params: Extension) => Promise<void>, landmarkDownload: (params: AdapterMethodParameters) => Promise<SourceLandmark[]>): void

/**
 * Installs an extension of the specified type.
 * @param type {string} The type of the extension to install.
 * @param params {MarketplaceExtension} Parameters required for installing the adapter.
 * @returns {Promise<Extension>} A Promise resolving to the extension object to be installed.
 * @throws Error if the adapter for the specified type is not found.
 */
declare async function installExtension(type: string, params: MarketplaceExtension): Promise<Extension>

/**
 * Uninstalls an extension of the specified type.
 * @param type {string} The type of the extension to uninstall.
 * @param params {Extension} The extension to be uninstalled.
 * @returns {Promise<void>} A Promise that resolves when the adapter specific information for the extension is deleted.
 * @throws Error if the adapter for the specified type is not found.
 */
declare async function uninstallExtension(type: string, params: Extension): Promise<void>

/**
 * Executes the extension type adapter for the specifed adapter type and extension.
 * @param type {string} The type of the adapter to execute.
 * @param params {Extension} The extension to be executed.
 * @returns {Promise<SourceLandmark[]>} A Promise resolving to an array of landmarks associated with the source.
 * @throws Error if the adapter for the specified type is not found.
 */
declare async function executeAdapter(type: string, params: AdapterMethodParameters): Promise<SourceLandmark[]>