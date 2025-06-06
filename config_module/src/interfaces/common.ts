import { ReactElement, JSXElementConstructor, type JSX } from 'react';

export interface CustomTabProps {
  tabType: string
  tabIcon?: React.ReactElement<any>
  tabLabel: string
  tabContent: () => JSX.Element
}

export enum ListViewType {
  ListView = 'ListView',
  TableView = 'TableView',
}

export type SoftwareUserEntries = {
  id?: number
  userSettings: SoftwareUser
}

export interface SoftwareUser {
  userId?: number
  softwareId?: number
  isPrimaryResponsible?: boolean
  isRepresentative?: boolean
  subscribeIssueCreate?: boolean
}
