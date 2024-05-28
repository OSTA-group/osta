/**
 * @packageDocumentation
 * Provides functionallity to retrieve all extensions from the marketplace.
 */

import { MarketplaceExtension } from '../types'

/**
 * Retrieves marketplace extensions from the server.
 * @returns {Promise<MarketplaceExtension[]>} A promise that resolves with an array of marketplace extensions.
 */
declare async function getExtensions(): Promise<MarketplaceExtension[]>