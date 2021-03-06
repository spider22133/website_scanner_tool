import React from 'react';
import { useEffect, useState } from 'react';
import IWebsite from '../interfaces/website.interface';
import IState from '../interfaces/website-state.interface';
import PaginationContainer from './elements/pagination-container.component';
import WebsitesListItem from './websites/webseites-list-item.component';
import StatesDataService from '../services/states.service';
import StatesTable from './websites/states-table.component';
import ErrorTable from './websites/error-table.component';
import ErrorsDataService from '../services/errors.service';
import IWebsiteError from '../interfaces/error.interface';
import fetchData from '../helpers/fetch-data.helper';
import Chart from './elements/chart.component';
import AddWebsite from './websites/add-website.component';
import { motion } from 'framer-motion';

import { queryWebsites, retrieveWebsites } from '../slices/websites.slice';
import { RootState, useAppDispatch } from '../store';
import { useSelector } from 'react-redux';
import { getStatesByWebsiteId, selectAllStates } from '../slices/states.slice';
import { Stack, IconButton, InputAdornment, TextField, Typography, Box, Container, useTheme, Paper, Grid, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import WebsitesList from './websites/websites-list';
import SearchFilterBar from './elements/search-filter-bar.component';

const variants = {
  open: { height: '100%', opacity: 1 },
  closed: { height: '0px', opacity: 0 },
};

const DashboardComponent: React.FC = () => {
  const itemsPerPage = 15;
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const states = useSelector(selectAllStates);

  const [displayedStates, setDisplayedStates] = useState<IState[]>([]);
  const [aggrStates, setAggrStates] = useState<{ avg: number; min: number; max: number }>();
  const [errors, setWebsiteErrors] = useState<IWebsiteError[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    dispatch(retrieveWebsites());
    dispatch(getStatesByWebsiteId('1'));
    getAggrStates('1');
  }, [dispatch]);

  useEffect(() => {
    onPageChange();
  }, [states]);

  const setActiveWebsite = (website: IWebsite, index: number) => {
    setCurrentIndex(index);
    setCurrentPage(1);
    getErrorsByWebsiteId(website.id);
    getAggrStates(website.id);

    dispatch(getStatesByWebsiteId(website.id));
  };

  const getAggrStates = (id: string) => {
    fetchData(StatesDataService.getAggregatedDataByWebsiteId(id), setAggrStates);
  };

  const getErrorsByWebsiteId = (id: string) => {
    fetchData(ErrorsDataService.getErrorsByWebsiteId(id), setWebsiteErrors);
  };

  const onPageChange = (page = 1) => {
    const startItem = (page - 1) * itemsPerPage;
    const endItem = page * itemsPerPage;
    setDisplayedStates(states.slice(startItem, endItem));
  };

  return (
    <Box sx={{ bgcolor: 'grey.A100' }} className="vh-100-c">
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={5}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <SearchFilterBar />
            </Paper>
            <Paper sx={{ p: 3, mb: 2 }}>
              <WebsitesList currentIndex={currentIndex} setActiveWebsite={setActiveWebsite} />
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
          </Grid>
          <Grid item xs={12} lg={7} className="scrollable">
            {errors.length > 0 ? (
              <div className="border border-danger border-2 rounded-2 p-4 mb-3">
                <h2 className="">Error list</h2>
                <ErrorTable errors={errors} />
              </div>
            ) : (
              ''
            )}
            <Paper sx={{ p: 4, mb: 2 }}>{<Chart states={states} aggrStates={aggrStates} />}</Paper>
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
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardComponent;
