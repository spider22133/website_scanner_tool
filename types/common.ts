import { SoftwareVersion } from "../scanner_module/src/interfaces/software_version.interface";
import { SoftwareUser } from "../config_module/src/interfaces/common";

interface InstallerSwitch {
  silent?: string;
  silentWithProgress?: string;
  custom?: string;
}

export interface InstallerDetails {
  architecture: string;
  type: string;
  url: string;
  sha256: string;
  scope?: string;
  locale?: string;
  minimumOSVersion?: string;
  installModes?: string[];
  switches?: InstallerSwitch;
}

export interface WingetPackageDetails {
  id: string;
  version: string;
  publisher: string;
  publisherUrl?: string;
  publisherSupportUrl?: string;
  author?: string;
  name: string;
  moniker?: string;
  description?: string;
  homepage?: string;
  license?: string;
  licenseUrl?: string;
  privacyUrl?: string;
  copyright?: string;
  releaseNotes?: string;
  releaseNotesUrl?: string;
  documentations?: { DocumentLabel: string; DocumentUrl: string }[];
  tags?: string[];
  installers: InstallerDetails[];
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
  details?: WingetPackageDetails | string;
  is_central_managed?: boolean;
  is_hidden?: boolean;
  is_current?: boolean;
  subscribeCreateIssue?: boolean;
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
