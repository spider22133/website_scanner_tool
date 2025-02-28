import { WingetPackageDetails } from '@/types/common'

export interface Software {
  id: number
  name: string
  winget_id: string
  version: string
  source: string
  details: string
  is_hidden: boolean
  is_current: boolean
}
