export interface WingetPackageDetails {
  version?: string;
  publisher?: string;
  publisherUrl?: string;
  publisherSupportUrl?: string;
  author?: string;
  description?: string;
  homepage?: string;
  license?: string;
  licenseUrl?: string;
  privacyUrl?: string;
  copyright?: string;
  copyrightUrl?: string;
  releaseNotes?: string;
  installer?: {
    type?: string;
    locale?: string;
    url?: string;
    sha256?: string;
    releaseDate?: string;
    offlineSupported?: boolean;
  };
}

export interface SoftwareEntry {
  name: string;
  winget_id: string;
  version: string;
  bara_version?: string;
  source: string;
  details?: WingetPackageDetails;
  is_hidden?: boolean;
  is_current?: boolean;
  updatedAt?: string;
}
