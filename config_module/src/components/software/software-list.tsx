import { SoftwareEntry } from '../../../../types/common'
import WebsitesListItem from './webseites-list-item.component'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Box, List, Typography, Skeleton, Stack } from '@mui/material'
import AppFilterBar from '../elements/app-filter-bar.component'

type Props = {
  software: SoftwareEntry[]
  currentIndex: number
  setActiveWebsite: (software: SoftwareEntry, index: number) => void
}

const SoftwareList: React.FC<Props> = ({ setActiveWebsite, currentIndex, software }) => {
  const { createSoftwareLoading, softwareFilteredList } = useSelector((state: RootState) => state.software)
  const countByVisibility = (isHidden: boolean) => {
    return software.filter(software => software.is_hidden === isHidden).length
  }

  const countByCurrentStatus = (isCurrent: boolean) => {
    return software.filter(software => software.is_current === isCurrent).length
  }

  return (
    <Box sx={{ height: '97%', display: 'flex', flexDirection: 'column' }}>
      <AppFilterBar />
      <Stack direction={'row'} justifyContent={'space-between'} sx={{ mt: 2 }}>
        <Box>
          <Typography variant="body2">
            Aktuell: {countByCurrentStatus(true)} / Ungültig: {countByCurrentStatus(false)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2">
            Ausgeblendet: {countByVisibility(true)} / Sichtbar: {countByVisibility(false)} / Gesamt: {software.length}
          </Typography>
        </Box>
      </Stack>
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List>
          {createSoftwareLoading && <Skeleton variant="rectangular" width="100%" height={84} />}
          {softwareFilteredList &&
            softwareFilteredList.map((software: SoftwareEntry, index) => (
              <WebsitesListItem key={index} index={index} currentIndex={currentIndex} software={software} setActiveWebsite={setActiveWebsite} />
            ))}
        </List>
      </Box>
    </Box>
  )
}

export default SoftwareList
