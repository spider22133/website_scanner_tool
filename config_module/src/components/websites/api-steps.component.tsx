import React from 'react';
import { Box, Divider, Grid, IconButton, Stack, Tab } from '@mui/material';
import IWebsiteControlStep from '../../interfaces/website_control_step.interface';
import ApiStepComponent from './api-step.component';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { TabContext, TabList, TabPanel } from '@mui/lab';

type Props = {
  steps: IWebsiteControlStep[];
};

const typeTitle = [
  { type: 'MAIN', title: 'Standard Page Requests' },
  { type: 'LOGIN_CALL', title: 'Login Requests' },
  { type: 'API_CALL', title: 'API Requests' },
];

const ApiStepsComponent: React.FC<Props> = ({ steps }) => {
  const [value, setValue] = React.useState('MAIN');
  return (
    <>
      <TabContext value={value}>
        <Box>
          <TabList onChange={(e, newValue) => setValue(newValue)} variant="scrollable">
            {typeTitle.map(({ type, title }) => (
              <Tab label={title} value={type} sx={{ textTransform: 'none', fontWeight: 'bold' }} />
            ))}
          </TabList>
        </Box>
        {typeTitle.map(({ type, title }) => (
          <TabPanel value={type} sx={{ px: 0, pt: 3, pb: 0 }}>
            <Grid item container spacing={2} xs={12} sx={{ mb: 2.5 }}>
              {steps.filter(step => step.type === type).length !== 0 ? (
                <>
                  {steps
                    .filter(step => step.type === type)
                    .map((step, index) => (
                      <Grid item xs={12} md={5}>
                        <ApiStepComponent key={index} step={step} />{' '}
                      </Grid>
                    ))}
                </>
              ) : (
                <Grid item xs={12} md={3}>
                  <Box alignItems="center" sx={{ display: 'flex', height: '100%', pl: 2 }}>
                    Add new request
                  </Box>
                </Grid>
              )}
              <Grid item xs={12} md={1}>
                <Box alignItems="center" justifyContent="center" sx={{ display: 'flex', height: '100%' }}>
                  <IconButton color="primary" size="large">
                    <AddCircleOutlineOutlinedIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
        ))}
      </TabContext>
    </>
  );
};

export default ApiStepsComponent;
