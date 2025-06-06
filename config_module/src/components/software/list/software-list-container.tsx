import { SoftwareEntry } from '../../../../../types/common'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import AppFilterBar from '../../elements/app-filter-bar.component'
import SoftwareTableView from './software-ltable-view'
import de from 'javascript-time-ago/locale/de.json'
import TimeAgo from 'javascript-time-ago'

type Props = {
  software: SoftwareEntry[]
  currentIndex: number
  setActiveWebsite: (software: SoftwareEntry, index: number) => void
}

TimeAgo.addDefaultLocale(de)
const timeAgo = new TimeAgo('de-DE')

const SoftwareList: React.FC<Props> = ({ setActiveWebsite }) => {
  const { createSoftwareLoading, softwareFilteredList } = useSelector((state: RootState) => state.software)

  return (
    <>
      <AppFilterBar />
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
