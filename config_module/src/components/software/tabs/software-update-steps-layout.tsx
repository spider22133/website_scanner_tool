import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import { StepIconProps } from '@mui/material/StepIcon'
import EditDocumentIcon from '@mui/icons-material/EditDocument'
import DownloadIcon from '@mui/icons-material/Download'
import ViewInArIcon from '@mui/icons-material/ViewInAr'
import PostAddIcon from '@mui/icons-material/PostAdd'
import { Paper } from '@mui/material'

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 24,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#1976d2',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#1976d2',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#e5e5e5',
    borderRadius: 1,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[700],
    }),
  },
}))

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean }
}>(({ theme }) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[800],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundColor: '#1976d2',
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundColor: '#1976d2',
      },
    },
  ],
}))

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props

  const icons: { [index: string]: React.ReactElement<unknown> } = {
    1: <EditDocumentIcon />,
    2: <DownloadIcon />,
    3: <ViewInArIcon />,
    4: <PostAddIcon />,
  }

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  )
}

const steps = ['BDS estellen', 'Paket herunterladen', 'Baramundi Software anlegen', 'Jobs & Gruppen anpassen']

export default function SoftwareUpdateStepper() {
  const [activeStep, setActiveStep] = React.useState(0)

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <Stack sx={{ width: '100%', px: 4, py: 2 }} spacing={4}>
      <Stepper activeStep={activeStep} connector={<ColorlibConnector />} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {}

          return (
            <Step key={label} {...stepProps}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Paper sx={{ p: 2, mt: 2, mb: 1 }}>Alle Schritte abgeschlossen - Sie sind fertig</Paper>

          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Zurücksetzen</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Paper sx={{ p: 2, mt: 2, mb: 1 }}>Step {activeStep + 1}</Paper>

          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Zurück
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext}>{activeStep === steps.length - 1 ? 'Finish' : 'Next'}</Button>
          </Box>
        </React.Fragment>
      )}
    </Stack>
  )
}
