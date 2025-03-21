import React from 'react'
import { useEffect, useState } from 'react'
import IState from '../interfaces/website-state.interface'
import PaginationContainer from './elements/pagination-container.component'
import StatesDataService from '../services/states.service'
import WebsiteService from '../services/website.service'
import StatesTable from './software/states-table.component'
import fetchData from '../helpers/fetch-data.helper'
import Chart from './elements/chart.component'
import AddWebsite from './software/add-website.component'
import { motion } from 'framer-motion'

import { retrieveWebsites } from '../slices/software.slice'
import { RootState, useAppDispatch } from '../store'
import { useSelector } from 'react-redux'
import { Box, Container, Paper, Grid, Button, Alert, CircularProgress } from '@mui/material'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import WebsitesList from './software/websites-list'
import SearchFilterBar from './elements/search-filter-bar.component'
import socketIOClient from 'socket.io-client'
import TabsComponent from './software/tabs.component'
import { WinGetSoftwareEntry } from '../../../types/common'
import { CustomTabProps } from '../interfaces/common'
import PackageDetails from './software/package-details.component'

const variants = {
  open: { height: '100%', opacity: 1 },
  closed: { height: '0px', opacity: 0 },
}

const DashboardComponent: React.FC = () => {
  const ENDPOINT = 'http://localhost:3001/'
  const itemsPerPage = 15
  const dispatch = useAppDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { steps, loading } = useSelector((state: RootState) => state.steps)
  const { software } = useSelector((state: RootState) => state.software)

  const [states, setStates] = useState<IState[]>([])
  const [displayedStates, setDisplayedStates] = useState<IState[]>([])
  const [aggrStates, setAggrStates] = useState<{ avg: number; min: number; max: number }>()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAddForm, setShowAddForm] = useState(false)
  const [value, setValue] = useState({
    toggleVisible: false,
  })

  useEffect(() => {
    dispatch(retrieveWebsites())

    const socket = socketIOClient(ENDPOINT)
    socket.on('updateWebsites', (data: any) => {
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
  }, [states])

  const setActiveWebsite = (website: WinGetSoftwareEntry, index: number) => {
    setCurrentIndex(index)
    setCurrentPage(1)
    // getAggrStates(website.winget_id)
    // getWebsiteMainStepStates(website.winget_id)

    // dispatch(getStepsByWebsiteId(website.winget_id))
    // dispatch(getStatesByWebsiteId(website.winget_id))
  }

  const getAggrStates = (id: string) => {
    fetchData(StatesDataService.getAggregatedDataByWebsiteId(id), setAggrStates)
  }

  const getWebsiteMainStepStates = (id: string) => {
    fetchData(WebsiteService.getWebsiteMainStepStates(id), setStates)
  }

  const onPageChange = (page = 1) => {
    const startItem = (page - 1) * itemsPerPage
    const endItem = page * itemsPerPage
    setDisplayedStates(states.slice(startItem, endItem))
  }

  const handleClickToggle = () => {
    setValue({ toggleVisible: !value.toggleVisible })
  }

  const tabs: CustomTabProps[] = [
    {
      tabType: 'MAIN',
      tabLabel: 'Software Profile',
      tabContent: software && <PackageDetails software={software[currentIndex]} />,
    },
    {
      tabType: 'CREATE_BDS',
      tabLabel: 'Create BDS',
      tabContent: <div />,
    },
    {
      tabType: 'API_CALL',
      tabLabel: 'API Requests',
      tabContent: <div />,
    },
  ]

  return (
    <Box sx={{ bgcolor: 'grey.A100', minHeight: '100vh', pb: 6 }}>
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper sx={{ py: 3, px: 3 }}>
              <SearchFilterBar value={value.toggleVisible} handleClickToggle={handleClickToggle} />
            </Paper>
          </Grid>
          <Grid item xs={12} lg={5}>
            <Box sx={{ position: { lg: 'sticky' }, top: { lg: 16 } }}>
              <Paper sx={{ p: 3, mb: 2 }}>
                <WebsitesList currentIndex={currentIndex} showHidden={value.toggleVisible} setActiveWebsite={setActiveWebsite} />
              </Paper>
              <motion.div
                animate={showAddForm ? 'open' : 'closed'}
                variants={variants}
                initial="closed"
                transition={{ ease: 'easeOut', duration: '0.5' }}
              >
                <AddWebsite showAddForm={showAddForm} setShowAddForm={setShowAddForm} />
              </motion.div>

              {user.roles &&
                (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_MODERATOR')) &&
                (!showAddForm ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setShowAddForm(showAddForm => !showAddForm)}
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                  >
                    Add new
                  </Button>
                ) : null)}
            </Box>
          </Grid>
          <Grid item xs={12} lg={7}>
            {loading ? (
              <Box justifyContent="center" alignItems="center" sx={{ display: 'flex', width: '100%', height: '100px' }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TabsComponent tabs={tabs} />

                {/* <Paper sx={{ p: 4, mb: 2 }}>
                  {states.length > 0 ? <Chart states={states} aggrStates={aggrStates} /> : <Alert severity="warning">No data!</Alert>}
                </Paper> */}
                {/* {states.length > 0 && (
                  <Paper sx={{ p: 4, mb: 2 }}>
                    <h2>Check list</h2>
                    <StatesTable states={displayedStates} />
                    <div className="pagination">
                      {states.length > 0 ? (
                        <PaginationContainer
                          totalItems={states.length}
                          itemsPerPage={itemsPerPage}
                          currentPage={currentPage}
                          pageChange={onPageChange}
                          setCurrentPage={setCurrentPage}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                  </Paper>
                )} */}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default DashboardComponent
