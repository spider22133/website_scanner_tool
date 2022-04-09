import React from 'react';
import { Box, Divider, IconButton, Stack } from '@mui/material';
import IWebsiteControlStep from '../../interfaces/website_control_step.interface';
import ApiStepComponent from './api-step.component';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

type Props = {
  steps: IWebsiteControlStep[];
  title: string;
  type: string;
};

const ApiStepsComponent: React.FC<Props> = ({ steps, title, type }) => {
  const filteredSteps = steps.filter(step => step.type === type);
  return (
    <>
      <h5>{title}</h5>
      <Stack direction="row" spacing={2} sx={{ mb: 2.5 }} alignItems="center">
        {filteredSteps.length !== 0 ? (
          <>
            {filteredSteps.map((step, index) => (
              <ApiStepComponent key={index} step={step} />
            ))}
          </>
        ) : (
          <Box>No requests added</Box>
        )}
        <Box>
          <IconButton color="primary" size="large">
            <AddCircleOutlineOutlinedIcon />
          </IconButton>
        </Box>
      </Stack>
    </>
  );
};

export default ApiStepsComponent;
