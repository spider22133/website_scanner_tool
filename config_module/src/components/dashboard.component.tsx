import React, { useEffect, useState } from 'react'
import PaginationContainer from './elements/pagination-container.component'
import { retrieveWebsites } from '../slices/software.slice'
import { RootState, useAppDispatch } from '../store'
import { useSelector } from 'react-redux'
import { Box, Container, Paper, Grid } from '@mui/material'
import WebsitesList from './software/websites-list'
import AppSearchBar from './elements/app-search-bar.component'
import socketIOClient from 'socket.io-client'
import TabsComponent from './software/tabs.component'
import { SoftwareEntry } from '../../../types/common'
import { CustomTabProps } from '../interfaces/common'
import PackageDetails from './software/package-details.component'

const DashboardComponent: React.FC = () => {
  const ENDPOINT = 'http://localhost:3001/'
  const itemsPerPage = 20
  const dispatch = useAppDispatch()

  const { software } = useSelector((state: RootState) => state.software)

  const [displayedSoftware, setDisplayedSoftware] = useState<SoftwareEntry[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [value, setValue] = useState({
    toggleVisible: false,
  })

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

  const handleClickToggle = () => {
    setValue({ toggleVisible: !value.toggleVisible })
  }

  const tabs: CustomTabProps[] = [
    {
      tabType: 'MAIN',
      tabLabel: 'Softwareprofil',
      tabContent: !!software && !!software.length ? <PackageDetails software={software[currentIndex]} /> : <div />,
    },
    {
      tabType: 'CREATE_BDS',
      tabLabel: 'BDS erstellen',
      tabContent: <div />,
    },
    {
      tabType: 'API_CALL',
      tabLabel: 'API-Anfragen',
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
              <WebsitesList
                software={displayedSoftware}
                currentIndex={currentIndex}
                showHidden={value.toggleVisible}
                setActiveWebsite={setActiveWebsite}
                handleClickToggle={handleClickToggle}
              />
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
