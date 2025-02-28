import { WinGetSoftwareEntry } from '../../interfaces/website.interface'
import WebsitesListItem from './webseites-list-item.component'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Box, List, Typography } from '@mui/material'

type Props = {
  currentIndex: number
  showHidden: boolean
  setActiveWebsite: (software: WinGetSoftwareEntry, index: number) => void
}

const WebsitesList: React.FC<Props> = ({ setActiveWebsite, currentIndex, showHidden }) => {
  const { software } = useSelector((state: RootState) => state.software)

  const countByVisibility = (isHidden: boolean) => {
    return software.filter(software => software.is_hidden === isHidden).length
  }

  console.log('software', software)

  return (
    <>
      <Box sx={{ width: '100%', textAlign: 'right' }}>
        <Typography variant="body2">
          Hidden: {countByVisibility(true)} / Visible: {countByVisibility(false)} / Total: {software.length}
        </Typography>
      </Box>
      <List>
        {software &&
          software.map((software: WinGetSoftwareEntry, index) => (
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
