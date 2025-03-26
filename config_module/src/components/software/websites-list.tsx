import { SoftwareEntry } from '../../../../types/common'
import WebsitesListItem from './webseites-list-item.component'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Box, List, Typography, Tooltip, IconButton } from '@mui/material'
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined'
import Visibility from '@mui/icons-material/VisibilityOutlined'
import AppFilterBar from '../elements/app-filter-bar.component'

type Props = {
  currentIndex: number
  showHidden: boolean
  handleClickToggle?: () => void
  setActiveWebsite: (software: SoftwareEntry, index: number) => void
}

const WebsitesList: React.FC<Props> = ({ setActiveWebsite, handleClickToggle, currentIndex, showHidden }) => {
  const { software } = useSelector((state: RootState) => state.software)

  const countByVisibility = (isHidden: boolean) => {
    return software.filter(software => software.is_hidden === isHidden).length
  }

  return (
    <>
      <AppFilterBar value={showHidden} handleClickToggle={handleClickToggle} />
      <Box sx={{ width: '100%', textAlign: 'right', mt: 2 }}>
        <Typography variant="body2">
          Hidden: {countByVisibility(true)} / Visible: {countByVisibility(false)} / Total: {software.length}
        </Typography>
      </Box>
      <List>
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
    </>
  )
}

export default WebsitesList
