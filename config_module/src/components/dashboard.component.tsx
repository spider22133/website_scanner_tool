import React, { useEffect, useState } from 'react'
import { retrieveWebsites } from '../slices/software.slice'
import { RootState, useAppDispatch } from '../store'
import { useSelector } from 'react-redux'
import { Box, Container, Paper, Grid } from '@mui/material'
import SoftwareList from './software/software-list-container'
import AppSearchBar from './elements/app-search-bar.component'
import socketIOClient from 'socket.io-client'
import TabsComponent from './software/tabs.component'
import { SoftwareEntry } from '../../../types/common'
import { CustomTabProps } from '../interfaces/common'
import SoftwareWidgetsLayout from './software/tabs/software-widgets-layout.'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import FlipOutlinedIcon from '@mui/icons-material/FlipOutlined'
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'
import { retrieveUsers } from '../slices/user.slice'
import SoftwareUpdateStepper from './software/tabs/software-update-steps-layout'

const DashboardComponent: React.FC = () => {
  const ENDPOINT = 'http://localhost:3001/'
  const itemsPerPage = 20
  const dispatch = useAppDispatch()

  const { software, softwareFilteredList } = useSelector((state: RootState) => state.software)

  const [displayedSoftware, setDisplayedSoftware] = useState<SoftwareEntry[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    dispatch(retrieveWebsites())
    dispatch(retrieveUsers())

    const socket = socketIOClient(ENDPOINT)
    socket.on('updateSoftware', (data: any) => {
      if (data === 'changed') dispatch(retrieveWebsites())
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    const firstWebsiteId = software[0]?.winget_id
  }, [dispatch, software])

  useEffect(() => {
    onPageChange()
  }, [software])

  const setActiveWebsite = (website: SoftwareEntry, index: number) => {
    setCurrentIndex(index)
  }

  const onPageChange = (page = 1) => {
    const startItem = (page - 1) * itemsPerPage
    const endItem = page * itemsPerPage
    setDisplayedSoftware(software.slice(startItem, endItem))
  }

  const tabs: CustomTabProps[] = [
    {
      tabType: 'MAIN',
      tabIcon: <ArticleOutlinedIcon />,
      tabLabel: 'Softwareprofil',
      tabContent: <SoftwareWidgetsLayout software={softwareFilteredList[currentIndex]} />,
    },
    {
      tabType: 'CREATE_BDS',
      tabIcon: <FlipOutlinedIcon />,
      tabLabel: 'Software paketieren',
      tabContent: <SoftwareUpdateStepper />,
    },
    {
      tabType: 'STATUS_REPORTS',
      tabIcon: <AssessmentOutlinedIcon />,
      tabLabel: 'Status Berichte',
      tabContent: <div />,
    },
  ]

  return (
    <Container maxWidth={false} className="dashboard-container" sx={{ pt: 2 }}>
      <Grid container spacing={2}>
        <Grid className="left-column" size={{ xs: 12, lg: 7, xl: 5 }}>
          <Paper className="search-bar-container">
            <AppSearchBar />
          </Paper>
          <Paper className="websites-list-container">
            <SoftwareList software={displayedSoftware} currentIndex={currentIndex} setActiveWebsite={setActiveWebsite} />
          </Paper>
        </Grid>
        <Grid className="tabs-container" size={{ xs: 12, lg: 5, xl: 7 }}>
          <TabsComponent tabs={tabs} />
        </Grid>
      </Grid>
    </Container>
  )
}

export default DashboardComponent
