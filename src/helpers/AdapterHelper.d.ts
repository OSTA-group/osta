/**
 * @packageDocumentation
 * Provides functionality for retrieving and setting variables within a specified extension. It includes methods to get the value of a variable and to set the value of a variable in a specified data source.
 */

import { Extension } from '../types'
import IonicStorage from '../databases/IonicStorage'

/**
 * Retrieves the value for a variable for a specified extension.
 * @param {Extension} extension The extension for which to retrieve the variable.
 * @param {unknown} variableName The name of the variable to retrieve.
 * @returns {Promise<unknown>} A Promise that resolves to the value of the variable.
 * @throws Error the variable is not found for the specified source.
 */
declare async function getValueForVariable(extension: Extension, variableName: unknown): Promise<unknown>

/**
 * Sets the value for a variable for a specifiec extension.
 * @param {Extension} extension The extension for which to set the variable.
 * @param {string} variableName The name of the variable to set.
 * @param {unknown} variable The value to set for the variable.
 * @returns {Promise<void>} A Promise that resolves when the variable value is set.
 */
declare async function setValueForVariable(extension: Extension, variableName: string, variable: unknown): Promise<void>

/**
 * Removes the value of a variable for a specifiec extension.
 * @param {Extension} extension The extension for which to remove the variable.
 * @param {string} variableName The name of the variable to remove
 * @returns {Promise<void>} A Promise that resolves when the variable value is removed.
 */
declare async function removeValueForVariable(extension: Extension, variableName: unknown): Promise<void>
