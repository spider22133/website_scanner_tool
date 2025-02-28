export interface SoftwareEntry {
  url: string
  pattern: string
  mainSelector: string
}

export interface WingetPackageDetails {
  publisher?: string
  publisherUrl?: string
  publisherSupportUrl?: string
  author?: string
  moniker?: string
  description?: string
  homepage?: string
  license?: string
  licenseUrl?: string
  privacyUrl?: string
  copyright?: string
  copyrightUrl?: string
  installer?: {
    type?: string
    locale?: string
    url?: string
    sha256?: string
    releaseDate?: string
    offlineSupported?: boolean
  }
}

export interface WinGetSoftwareEntry {
  name: string
  winget_id: string
  version: string
  source: string
  details?: WingetPackageDetails
}
