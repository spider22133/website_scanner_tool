import { useEffect, useState } from 'react';
import IWebsite from '../../interfaces/website.interface';
import IState from '../../interfaces/website-state.interface';
import PaginationContainer from './../elements/pagination-container.component';
import WebsitesListItem from './webseites-list-item.component';
import StatesDataService from '../../services/states.service';
import StatesTable from './states-table.component';
import ErrorTable from './error-table.component';
import ErrorsDataService from '../../services/errors.service';
import IWebsiteError from '../../interfaces/error.interface';
import fetchData from '../../helpers/fetch-data.helper';
import Chart from '../elements/chart.component';
import { IoAdd } from 'react-icons/io5';
import AddWebsite from './add-website.component';
import { motion } from 'framer-motion';

import { queryWebsites, retrieveWebsites } from '../../slices/websites.slice';
import { RootState, useAppDispatch } from '../../store';
import { useSelector } from 'react-redux';
import { getStatesByWebsiteId, selectAllStates } from '../../slices/states.slice';
import { Stack, IconButton, InputAdornment, TextField, Typography, Box, Container, useTheme, Paper, Grid, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

const variants = {
  open: { height: '100%', opacity: 1 },
  closed: { height: '0px', opacity: 0 },
};

export default function WebsitesList() {
  const itemsPerPage = 15;
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const { websites } = useSelector((state: RootState) => state.websites);
  const { user } = useSelector((state: RootState) => state.auth);
  const states = useSelector(selectAllStates);

  const [displayedStates, setDisplayedStates] = useState<IState[]>([]);
  const [aggrStates, setAggrStates] = useState<{ avg: number; min: number; max: number }>();
  const [errors, setWebsiteErrors] = useState<IWebsiteError[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  const [value, setValue] = useState({
    toggleVisible: false,
  });

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
    console.log(states);
    setDisplayedStates(states.slice(startItem, endItem));
  };

  const handleClickToggle = () => {
    setValue({ toggleVisible: !value.toggleVisible });
  };

  return (
    <Box sx={{ bgcolor: 'grey.A100' }}>
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={5}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <TextField
                  variant="outlined"
                  label="Search"
                  onChange={e => dispatch(queryWebsites(e.target.value))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  fullWidth
                />
                <Typography variant="body2" sx={{ width: 135 }}>
                  Show hidden:
                </Typography>
                <Box sx={{ ml: '0 !important' }}>
                  <IconButton aria-label="toggle visibility" onClick={handleClickToggle} edge="end" sx={{ mr: 1 }}>
                    {value.toggleVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Box>
              </Stack>
            </Paper>
            <Paper sx={{ p: 3, mb: 2 }}>
              <ul className="list-group list-group-numbered">
                {websites &&
                  websites.map((website: IWebsite, index) => (
                    <WebsitesListItem key={index} index={index} currentIndex={currentIndex} website={website} setActiveWebsite={setActiveWebsite} />
                  ))}
              </ul>
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
}
