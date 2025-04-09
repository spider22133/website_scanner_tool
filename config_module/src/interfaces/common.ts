export interface CustomTabProps {
  tabType: string
  tabIcon?: React.ReactElement
  tabLabel: string
  tabContent: React.ReactElement
}

export enum ListViewType {
  ListView = 'ListView',
  TableView = 'TableView',
}
