import { ReactElement, JSXElementConstructor } from 'react'

export interface CustomTabProps {
  tabType: string
  tabIcon?: React.ReactElement
  tabLabel: string
  tabContent: () => JSX.Element
}

export enum ListViewType {
  ListView = 'ListView',
  TableView = 'TableView',
}
