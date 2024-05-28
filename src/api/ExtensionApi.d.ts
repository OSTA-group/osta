/**
 * @packageDocumentation
 * Provides functionallity to retrieve extension data from an api.
 */

import { MarketplaceExtension, ExtensionConfigurationVariable } from '../types'

/**
 * Downloads the configuration for a given marketplace extension.
 * @param {MarketplaceExtension} extension The extension from the marketplace for which the configuration needs to be downloaded.
 * @returns {Promise<ExtensionConfigurationVariable[]>} A promise that resolves to an array of extension configuration variables.
 */
declare async function downloadExtensionConfiguration(extension: MarketplaceExtension): Promise<ExtensionConfigurationVariable[]>
