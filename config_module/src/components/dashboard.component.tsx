import React, { useEffect, useState } from 'react'
import PaginationContainer from './elements/pagination-container.component'
import { retrieveWebsites } from '../slices/software.slice'
import { RootState, useAppDispatch } from '../store'
import { useSelector } from 'react-redux'
import { Box, Container, Paper, Grid } from '@mui/material'
import SoftwareList from './software/software-list'
import AppSearchBar from './elements/app-search-bar.component'
import socketIOClient from 'socket.io-client'
import TabsComponent from './software/tabs.component'
import { SoftwareEntry } from '../../../types/common'
import { CustomTabProps } from '../interfaces/common'
import PackageDetails from './software/package-details.component'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import FlipOutlinedIcon from '@mui/icons-material/FlipOutlined'
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'

const DashboardComponent: React.FC = () => {
  const ENDPOINT = 'http://localhost:3001/'
  const itemsPerPage = 20
  const dispatch = useAppDispatch()

  const { software } = useSelector((state: RootState) => state.software)

  const [displayedSoftware, setDisplayedSoftware] = useState<SoftwareEntry[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    dispatch(retrieveWebsites())

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

    if (firstWebsiteId) {
      //dispatch(getStatesByWebsiteId(firstWebsiteId))
      //dispatch(getStepsByWebsiteId(firstWebsiteId))
      // getAggrStates(firstWebsiteId)
      // getWebsiteMainStepStates(firstWebsiteId)
    }
  }, [dispatch, software])

  useEffect(() => {
    onPageChange()
  }, [software])

  const setActiveWebsite = (website: SoftwareEntry, index: number) => {
    setCurrentIndex(index)
    setCurrentPage(1)
    // getAggrStates(website.winget_id)
    // getWebsiteMainStepStates(website.winget_id)
    // dispatch(getStepsByWebsiteId(website.winget_id))
    // dispatch(getStatesByWebsiteId(website.winget_id))
  }

  const onPageChange = (page = 1) => {
    const startItem = (page - 1) * itemsPerPage
    const endItem = page * itemsPerPage
    setDisplayedSoftware(software.slice(startItem, endItem))
  }

  const onFilterChange = (filteredSoftware: SoftwareEntry[]) => {
    console.log(filteredSoftware)
  }

  const tabs: CustomTabProps[] = [
    {
      tabType: 'MAIN',
      tabIcon: <ArticleOutlinedIcon />,
      tabLabel: 'Softwareprofil',
      tabContent: !!software && !!software.length ? <PackageDetails software={software[currentIndex]} /> : <div />,
    },
    {
      tabType: 'CREATE_BDS',
      tabIcon: <FlipOutlinedIcon />,
      tabLabel: 'BDS erstellen',
      tabContent: <div />,
    },
    {
      tabType: 'STATUS_REPORTS',
      tabIcon: <AssessmentOutlinedIcon />,
      tabLabel: 'Status Berichte',
      tabContent: <div />,
    },
  ]

  return (
    <Box className="dashboard-container">
      <Container maxWidth={false} sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={5} className="left-column">
            <Paper className="search-bar-container">
              <AppSearchBar />
            </Paper>
            <Paper className="websites-list-container">
              <SoftwareList software={displayedSoftware} currentIndex={currentIndex} setActiveWebsite={setActiveWebsite} />
              {/* <Box className="pagination" sx={{ mt: 'auto', pt: 2 }}>
                {software.length > 0 && (
                  <PaginationContainer
                    totalItems={software.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    pageChange={onPageChange}
                    setCurrentPage={setCurrentPage}
                  />
                )}
              </Box> */}
            </Paper>
          </Grid>
          <Grid item xs={12} lg={4} className="tabs-container">
            <Box>
              <TabsComponent tabs={tabs} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default DashboardComponent
