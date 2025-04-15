export type BaramundiSearch = {
  Id: string
  Name: string
  AdditionalInfo?: string
  Type?: Number
}

type SoftwareOptions = {
  AllowReinstall?: boolean
  UsebBT?: boolean
  VisibleExecution: 'Silent' | 'Interactive' | 'Hidden'
  RebootBehaviour: 'NoReboot' | 'RebootIfNeeded' | 'AlwaysReboot'
  RemoveUnknownSoftware?: boolean
}

type DeploymentEngine = {
  Engine: string
  EngineFile: string
  Options: SoftwareOptions
  UserSettings: Record<string, unknown>
}

type SoftwareFile = {
  Source: string
  Type: 'File' | 'Directory'
}

export type SoftwareType = {
  Id: string
  Name: string
  Vendor: string
  Category: string
  ParentId: string
  Version: string
  ValidForOS: string[]
  Installation: DeploymentEngine
  Uninstallation: DeploymentEngine
  Files: SoftwareFile[]
  SecurityContext: string
}

export type OrgUnitType = {
  Id: string
  ParentId: string
  Name: string
  GuidParent: string
  Comment: string
  HierarchyPath: string
}
