import { SoftwareEntry } from '../../../../types/common'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { Box, Typography, Stack } from '@mui/material'
import AppFilterBar from '../elements/app-filter-bar.component'
import { CustomTabProps, ListViewType } from '../../interfaces/common'
import ViewSelectorTabs from '../layout/list-table-view-selector'
import TabPanel from '../layout/tab-panel.component'
import SoftwareListView from './software-list-view.component'
import SoftwareTableView from './software-ltable-view.component'
import de from 'javascript-time-ago/locale/de.json'
import TimeAgo from 'javascript-time-ago'

type Props = {
  software: SoftwareEntry[]
  currentIndex: number
  setActiveWebsite: (software: SoftwareEntry, index: number) => void
}

TimeAgo.addDefaultLocale(de)
const timeAgo = new TimeAgo('de-DE')

const SoftwareList: React.FC<Props> = ({ setActiveWebsite, currentIndex, software }) => {
  const currentViewPreference = (localStorage.getItem('lotListViewPreference') as ListViewType) || ListViewType.ListView
  const { createSoftwareLoading, softwareFilteredList } = useSelector((state: RootState) => state.software)
  const [activeTab, setActiveTab] = React.useState<ListViewType>(currentViewPreference)

  const countByVisibility = (isHidden: boolean) => {
    return software.filter(software => software.is_hidden === isHidden).length
  }

  const countByCurrentStatus = (isCurrent: boolean) => {
    return software.filter(software => software.is_current === isCurrent).length
  }

  const renderTabContent = useCallback((): CustomTabProps[] => {
    return [
      {
        tabType: ListViewType.ListView,
        tabLabel: 'List view',
        tabContent: () => (
          <SoftwareListView
            timeAgo={timeAgo}
            createSoftwareLoading={createSoftwareLoading}
            softwareFilteredList={softwareFilteredList}
            currentIndex={currentIndex}
            setActiveWebsite={setActiveWebsite}
          />
        ),
      },
      {
        tabType: ListViewType.TableView,
        tabLabel: 'Table view',
        tabContent: () => (
          <SoftwareTableView
            timeAgo={timeAgo}
            softwareFilteredList={softwareFilteredList}
            createSoftwareLoading={createSoftwareLoading}
            setActiveWebsite={setActiveWebsite}
          />
        ),
      },
    ]
  }, [softwareFilteredList, createSoftwareLoading, currentIndex])

  const handleActiveTab = (newValue: ListViewType) => {
    setActiveTab(newValue)
  }

  return (
    <>
      <AppFilterBar />
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ mt: 3, mb: 1 }}>
        <Stack direction={'row'} alignItems={'center'} spacing={3}>
          <ViewSelectorTabs handleActiveTab={handleActiveTab} currentViewPreference={currentViewPreference} />
          <Typography variant="body2">
            Aktuell: {countByCurrentStatus(true)} / Nicht Aktuell: {countByCurrentStatus(false)}
          </Typography>
        </Stack>
        <Box>
          <Typography variant="body2">
            Ausgeblendet: {countByVisibility(true)} / Sichtbar: {countByVisibility(false)} / Gesamt: {software.length}
          </Typography>
        </Box>
      </Stack>
      {renderTabContent().map(item => (
        <TabPanel key={item.tabType} value={activeTab} index={item.tabType}>
          {item.tabContent()}
        </TabPanel>
      ))}
    </>
  )
}

export default SoftwareList
