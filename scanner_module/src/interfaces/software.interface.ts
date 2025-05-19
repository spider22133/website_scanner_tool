import { WingetPackageDetails } from '../../../types/common'

export interface Software {
  id: number
  name: string
  winget_id: string
  version: string
  bara_version: string
  icon: string
  source: string
  details: string
  subscribeCreateIssue: boolean
  is_central_managed: boolean
  is_hidden: boolean
  is_current: boolean
}
