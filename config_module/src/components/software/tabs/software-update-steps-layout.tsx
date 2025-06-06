import * as React from 'react'
import { Box, Button, Stepper, Step, StepLabel, Stack, Paper, StepConnector, stepConnectorClasses, Typography, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { StepIconProps } from '@mui/material/StepIcon'
import EditDocumentIcon from '@mui/icons-material/EditDocument'
import DownloadIcon from '@mui/icons-material/Download'
import ViewInArIcon from '@mui/icons-material/ViewInAr'
import PostAddIcon from '@mui/icons-material/PostAdd'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

// import 'react-xml-editor/css/xonomy.css'
import StepCreateBds from '../steps/createBds'
import { SoftwareEntry } from '../../../../../types/common'
import { PackageDetailsProps } from '../../dashboard.component'

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 24,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    borderRadius: 1,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#e5e5e5',
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    backgroundColor: theme.palette.primary.main,
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    backgroundColor: theme.palette.primary.main,
  },
}))

const StepIconWrapper = styled('div', {
  shouldForwardProp: prop => prop !== 'active' && prop !== 'completed',
})<{ active: boolean; completed: boolean }>(({ theme, active, completed }) => ({
  backgroundColor: completed || active ? theme.palette.primary.main : theme.palette.grey[400],
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '15%',
  zIndex: 1,
}))

function CustomStepIcon({ icon, active, completed, className }: StepIconProps) {
  const icons: Record<string, React.ReactElement<any>> = {
    1: <EditDocumentIcon />,
    2: <DownloadIcon />,
    3: <ViewInArIcon />,
    4: <PostAddIcon />,
  }

  return (
    <StepIconWrapper active={!!active} completed={!!completed} className={className}>
      {icons[String(icon)]}
    </StepIconWrapper>
  )
}

const stepLabels = ['BDS erstellen', 'Paket herunterladen', 'Baramundi Software anlegen', 'Jobs & Gruppen anpassen']

function StepPaketHerunterladen() {
  return <Paper sx={{ p: 2 }}>Paket herunterladen Inhalt</Paper>
}

function StepSoftwareAnlegen() {
  return <Paper sx={{ p: 2 }}>Baramundi Software anlegen Inhalt</Paper>
}

function StepJobsAnpassen() {
  return <Paper sx={{ p: 2 }}>Jobs & Gruppen anpassen Inhalt</Paper>
}

const renderStepContent = (step: number, software?: SoftwareEntry) => {
  switch (step) {
    case 0:
      return <StepCreateBds software={software} />
    case 1:
      return <StepPaketHerunterladen />
    case 2:
      return <StepSoftwareAnlegen />
    case 3:
      return <StepJobsAnpassen />
    default:
      return null
  }
}

const SoftwareUpdateStepper: React.FC<PackageDetailsProps> = ({ software }) => {
  const [activeStep, setActiveStep] = React.useState(0)

  const handleNext = () => setActiveStep(prev => prev + 1)
  const handleBack = () => setActiveStep(prev => prev - 1)
  const handleReset = () => setActiveStep(0)

  return (
    <Stack spacing={4} sx={{ width: '100%', px: 4, py: 2 }}>
      <Stepper activeStep={activeStep} connector={<CustomConnector />} alternativeLabel>
        {stepLabels.map(label => (
          <Step key={label}>
            <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === stepLabels.length ? (
        <>
          <Paper sx={{ p: 2, mt: 2, mb: 1 }}>Alle Schritte abgeschlossen - Sie sind fertig</Paper>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleReset} endIcon={<RestartAltIcon />}>
              Zurücksetzen
            </Button>
          </Box>
        </>
      ) : (
        <>
          {renderStepContent(activeStep, software)}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleBack} startIcon={<ArrowBackIcon />} disabled={activeStep === 0}>
              Zurück
            </Button>

            <Button onClick={handleNext} endIcon={activeStep === stepLabels.length - 1 ? <CheckCircleIcon /> : <ArrowForwardIcon />}>
              {activeStep === stepLabels.length - 1 ? 'Fertigstellen' : 'Weiter'}
            </Button>
          </Box>
        </>
      )}
    </Stack>
  )
}

export default SoftwareUpdateStepper
