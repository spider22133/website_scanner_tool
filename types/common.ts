import { SoftwareVersion } from "../scanner_module/src/interfaces/software_version.interface";
import { SoftwareUser } from "../config_module/src/interfaces/common";

export interface InstallerDetails {
  type?: string;
  locale?: string;
  url?: string;
  sha256?: string;
  releaseDate?: string;
  offlineSupported?: boolean;
}

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
  releaseNotesUrl?: string;
  installer?: InstallerDetails;
}

export interface SoftwareEntry {
  id: string;
  name: string;
  winget_id?: string;
  user_id?: number;
  users?: IRepresentative[];
  version: string;
  versions?: SoftwareVersion[];
  bara_version?: string;
  icon?: string;
  source?: string;
  details?: WingetPackageDetails;
  is_central_managed?: boolean;
  is_hidden?: boolean;
  is_current?: boolean;
  subscribeCreateIssue: boolean;
  updatedAt?: string;
  createdAt?: string;
}

export interface ISoftwareRepresentative {
  user_id: number;
  software_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface IRepresentative {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  userSettings: SoftwareUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface IssueAttributes {
  id: number;
  priority: string;
  user_id: number;
  software_id: number;
  software_version: string;
  jira_id?: string;
  jira_key?: string;
  statusName?: string;
  statusDesc?: string;
  resolutionName?: string;
  resolutionDesc?: string;
}
