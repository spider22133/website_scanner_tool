import React from 'react'
import { List, Skeleton } from '@mui/material'
import WebsitesListItem from './software-list-item.component'
import { SoftwareEntry } from '../../../../types/common'
import TimeAgo from 'javascript-time-ago'
import { Box } from '@mui/system'

interface SoftwareListProps {
  timeAgo: TimeAgo
  createSoftwareLoading: boolean
  softwareFilteredList: SoftwareEntry[]
  currentIndex: number
  setActiveWebsite: (software: SoftwareEntry, index: number) => void
}

const SoftwareListView: React.FC<SoftwareListProps> = ({ timeAgo, createSoftwareLoading, softwareFilteredList, currentIndex, setActiveWebsite }) => {
  return (
    <List sx={{ overflowY: 'auto' }}>
      {createSoftwareLoading && <Skeleton variant="rectangular" width="100%" height={84} />}

      {softwareFilteredList?.map((software, index) => (
        <WebsitesListItem
          key={index}
          index={index}
          currentIndex={currentIndex}
          software={software}
          timeAgo={timeAgo}
          setActiveWebsite={setActiveWebsite}
        />
      ))}
    </List>
  )
}

export default SoftwareListView
