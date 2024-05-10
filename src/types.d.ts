/**
 * Represents a landmark.
 * @property {string} id The unique identifier of the landmark, composed of rounding and then combining the latitude and longitude.
 * @property {Location} location The geographical location of the landmark.
 * @property {string[]} types The types of the landmark.
 * @property {string} area The download area where the landmark is located.
 * @property {SourceInformation[]} sources Information about the sources of the landmark.
 * @property {boolean} visited Indicates if the landmark has been visited.
 * @property {boolean} inTrip Indicates if the landmark is part of the current trip.
 */
export type Landmark = {
  id: string
  location: Location
  types: string[]
  area: string
  sources: SourceInformation[]
  visited: boolean
  inTrip: boolean
}

/**
 * Represents a trip.
 * @property {number} nextLandmarkId The identifier of the next landmark in the trip.
 * @property {boolean} started Indicates if the trip has started.
 * @property {Landmark[]} landmarks The landmarks included in the trip.
 * @property {boolean} isLastVisited Indicates if the last landmark has been visited.
 */
export type Trip = {
  nextLandmarkId: number
  started: boolean
  landmarks: Landmark[]
  isLastVisited: boolean
}

/**
 * Represents information about a landmark from a specific source.
 * @property {string} name The name of the source.
 * @property {string} description A description of the source.
 * @property {string} source The source itself.
 */
export type SourceInformation = {
  name: string
  description: string
  source: string
}

/**
 * Represents a geographical location.
 * @property {number} lat The latitude of the location.
 * @property {number} lng The longitude of the location.
 */
export type Location = {
  lat: number
  lng: number
}

/**
 * Represents a geographical landmark with associated metadata. This type is used as the return type for adapters.
 * @property {number} lat Latitude coordinate of the landmark.
 * @property {number} lng Longitude coordinate of the landmark.
 * @property {string} name Name of the landmark.
 * @property {string} description Description or additional information about the landmark.
 * @property {string[]} types Types or categories associated with the landmark (e.g., historical, natural, cultural).
 */
export type SourceLandmark = {
  lat: number
  lng: number
  name: string
  description: string
  types: string[]
}

/**
 * Represents a downloaded area.
 * @property {number} id The unique identifier of the area.
 * @property {string} name The name of the area given to it by the user.
 * @property {number} countOfLandmarks The number of landmarks in the area.
 */
export type Area = {
  id: number
  name: string
  countOfLandmarks: number
}

/**
 * Represents an extension.
 * @property {number} id The unique identifier of the extension.
 * @property {string} name The name of the extension.
 * @property {boolean} verified Indicates if the extension is verified.
 * @property {string} url The link were LandmarkInformation can be found
 * @property {string} type The type of extension
 * @property {number} version The extension version
 * @property {string[]} variables The variables that this extension stores
 * @property {boolean} configured If the extension has been fully configured, and thus is ready for use
 * @property {ExtensionConfigurationVariable[]} configurationVariables The configuration variables associated with the extension
 */
export type Extension = {
  id: number
  name: string
  verified: boolean
  url: string
  type: string
  version: number
  variables: string[]
  configured: boolean
  configurationVariables: ExtensionConfigurationVariable[] | undefined
}

/**
 * Represents an extension as downloaded from the marketplace.
 * @property {string} id The unique identifier for the extension.
 * @property {string} name The name of the extension.
 * @property {string} type The type of the extension, this specifies what adapter to use.
 * @property {string} area The area where the extension is applicable.
 * @property {string} languages The languages supported by the extension.
 * @property {string} url The URL where the extension can be downloaded.
 * @property {string} configurationUrl The URL for the extension's configuration settings.
 * @property {string} fileHash The MD5 hash of the file, used for checking download errors and different versions.
 * @property {number} version The version number of the extension.
 * @property {Record<string, string>} properties Additional properties and metadata of the extension.
 */
export type MarketplaceExtension = {
  id: string
  name: string
  type: string
  area: string
  languages: string
  url: string
  configurationUrl: string
  fileHash: string
  version: number
  properties: Record<string, string>
}

/**
 * Represents a marketplace extension configuration variable.
 * @property {string} name The name of the configuration variable.
 * @property {string} title The title or label of the configuration variable.
 * @property {string} type The type of the configuration variable. Should be one of 'text' or 'select'.
 * @property {boolean} required Indicates whether the configuration variable is required or optional.
 * @property {{ name: string, value: string }[]} options An array of objects representing the options for the configuration variable.
 */
export type ExtensionConfigurationVariable = {
  name: string
  title: string
  type: string
  required: boolean
  options?: { name: string; value: string }[]
}

/**
 * Represents a downloaded area.
 * @property {Location} location The geographical location of the center.
 * @property {number} radius The radius of the circle in kilometers.
 */
export type BoundingCircle = {
  center: Location
  radius: number
}

/**
 * Represents a bounding box with top-left and bottom-right coordinates.
 * @property {Location} topLeft - The top-left corner of the bounding box.
 * @property {Location} bottomRight - The bottom-right corner of the bounding box.
 */
export type BoundingBox = {
  topLeft: Location
  bottomRight: Location
}

/**
 * Represents the parameters used in adapter methods, defining either a bounding box or a bounding circle.
 * @Property {Extension} extension Defines the extension that should be used.
 * @property {BoundingBox} boundingBox Defines a bounding box with two locations: topLeft and bottomRight.
 * @property {BoundingCircle} boundingCircle Defines a bounding circle with a center location and a radius.
 */
export type AdapterMethodParameters = {
  extension: Extension
  boundingBox: BoundingBox
  boundingCircle: BoundingCircle
}

/**
 * Represents a web extension.
 * @extends {Extension}
 * @property {boolean} urlFilterable Indicates whether the extension is filterable by URL.
 */
export interface WebExtension extends Extension {
  urlFilterable: boolean
}
