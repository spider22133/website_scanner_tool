export interface Software {
  id: number
  name: string
  winget_id: string
  version: string
  source: string
  description: string
  author: string
  is_hidden: boolean
  is_current: boolean
}
