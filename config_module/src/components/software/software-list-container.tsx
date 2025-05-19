import { SoftwareEntry } from '../../../../types/common'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { Box, Typography, Stack } from '@mui/material'
import AppFilterBar from '../elements/app-filter-bar.component'
import { ListViewType } from '../../interfaces/common'
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

  const countByVisibility = (isHidden: boolean) => {
    return software.filter(software => software.is_hidden === isHidden).length
  }

  const countByCurrentStatus = (isCurrent: boolean) => {
    return software.filter(software => software.is_current === isCurrent).length
  }

  return (
    <>
      <AppFilterBar />
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ mt: 3, mb: 1 }}>
        <Stack direction={'row'} alignItems={'center'} spacing={3} flex={1}>
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
      <SoftwareTableView
        timeAgo={timeAgo}
        softwareFilteredList={softwareFilteredList}
        createSoftwareLoading={createSoftwareLoading}
        setActiveWebsite={setActiveWebsite}
      />
    </>
  )
}

export default SoftwareList
