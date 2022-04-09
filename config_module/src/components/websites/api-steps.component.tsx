import React from 'react';
import { Divider, Stack } from '@mui/material';
import IWebsiteControlStep from '../../interfaces/website_control_step.interface';
import ApiStepComponent from './api-step.component';

type Props = {
  steps: IWebsiteControlStep[];
  title: string;
  type: string;
};

const ApiStepsComponent: React.FC<Props> = ({ steps, title, type }) => {
  const filteredSteps = steps.filter(step => step.type === type);
  return (
    <>
      {filteredSteps.length !== 0 && (
        <>
          <h5>{title}</h5>
          <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
            {filteredSteps.map((step, index) => (
              <ApiStepComponent key={index} step={step} />
            ))}
          </Stack>
        </>
      )}
    </>
  );
};

export default ApiStepsComponent;
