import React, { useCallback, useRef } from 'react'
import { List, Skeleton } from '@mui/material'
import WebsitesListItem from './software-list-item.component'
import { SoftwareEntry } from '../../../../types/common'
import TimeAgo from 'javascript-time-ago'

interface SoftwareListProps {
  timeAgo: TimeAgo
  createSoftwareLoading: boolean
  softwareFilteredList: SoftwareEntry[]
  currentIndex: number
  setActiveWebsite: (software: SoftwareEntry, index: number) => void
}

const SoftwareListView: React.FC<SoftwareListProps> = ({ timeAgo, createSoftwareLoading, softwareFilteredList, currentIndex, setActiveWebsite }) => {
  const listRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!softwareFilteredList.length) return

      let newIndex = currentIndex

      if (e.key === 'ArrowDown') {
        newIndex = Math.min(currentIndex + 1, softwareFilteredList.length - 1)
        e.preventDefault()
      } else if (e.key === 'ArrowUp') {
        newIndex = Math.max(currentIndex - 1, 0)
        e.preventDefault()
      }

      if (newIndex !== currentIndex) {
        setActiveWebsite(softwareFilteredList[newIndex], newIndex)

        const listItem = listRef.current?.querySelectorAll('li')[newIndex]
        listItem?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    },
    [currentIndex, softwareFilteredList, setActiveWebsite],
  )

  return (
    <div ref={listRef} tabIndex={0} onKeyDown={handleKeyDown} style={{ outline: 'none', maxHeight: '100%', overflowY: 'auto' }}>
      <List>
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
    </div>
  )
}

export default SoftwareListView
