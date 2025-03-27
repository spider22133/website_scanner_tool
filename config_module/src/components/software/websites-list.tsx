import { SoftwareEntry } from '../../../../types/common'
import WebsitesListItem from './webseites-list-item.component'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Box, List, Typography, Skeleton } from '@mui/material'
import AppFilterBar from '../elements/app-filter-bar.component'

type Props = {
  software: SoftwareEntry[]
  currentIndex: number
  showHidden: boolean
  handleClickToggle?: () => void
  setActiveWebsite: (software: SoftwareEntry, index: number) => void
}

const WebsitesList: React.FC<Props> = ({ setActiveWebsite, handleClickToggle, currentIndex, showHidden, software }) => {
  const { createSoftwareLoading } = useSelector((state: RootState) => state.software)
  const countByVisibility = (isHidden: boolean) => {
    return software.filter(software => software.is_hidden === isHidden).length
  }

  return (
    <Box sx={{ height: '92%', display: 'flex', flexDirection: 'column' }}>
      <AppFilterBar value={showHidden} handleClickToggle={handleClickToggle} />
      <Box sx={{ width: '100%', textAlign: 'right', mt: 2 }}>
        <Typography variant="body2">
          Ausgeblendet: {countByVisibility(true)} / Sichtbar: {countByVisibility(false)} / Gesamt: {software.length}
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List>
          {createSoftwareLoading && <Skeleton variant="rectangular" width="100%" height={84} />}
          {software &&
            software.map((software: SoftwareEntry, index) => (
              <WebsitesListItem
                key={index}
                index={index}
                currentIndex={currentIndex}
                software={software}
                showHidden={showHidden}
                setActiveWebsite={setActiveWebsite}
              />
            ))}
        </List>
      </Box>
    </Box>
  )
}

export default WebsitesList
