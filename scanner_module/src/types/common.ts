export interface SoftwareEntry {
  url: string
  pattern: string
  mainSelector: string
}

export interface WingetSoftwareEntry {
  name: string
  id: string
  version: string
  source: string
}
