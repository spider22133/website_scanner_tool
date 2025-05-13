import { Paper, Typography, TextField, Button, Step, StepContent, StepLabel, Stepper } from '@mui/material'
import { Box, Stack } from '@mui/system'
import * as React from 'react'
import { Util, XmlEditor } from 'react-xml-editor'
import { DocSpec } from 'react-xml-editor/lib/src/types'
import { RootState } from '../../../store/store'
import { PackageDetailsProps } from '../../dashboard.component'
import _ from 'lodash'

const docSpec: DocSpec = {
  elements: {
    data: {
      attributes: {
        label: {
          asker: Util.askString,
          menu: [
            {
              action: Util.deleteAttribute,
              caption: 'Delete attribute',
            },
          ],
        },
        type: {
          asker: Util.askPicklist([
            {
              value: 'short',
              caption: 'short',
            },
            {
              value: 'medium',
              caption: 'medium',
            },
            'long',
          ]),
        },
      },
      menu: [
        {
          action: Util.newElementChild('<child />'),
          caption: 'Append child <child />',
        },
        {
          action: Util.newAttribute({
            name: 'label',
            value: 'default value',
          }),
          caption: 'Add attribute @label',
          hideIf: (xml, id) => {
            const element = Util.getXmlNode(xml, id)
            return element && element.$ && typeof element.$.label !== 'undefined'
          },
        },
        {
          action: Util.deleteElement,
          caption: 'Delete this <item />',
          icon: 'exclamation.png',
        },
        {
          action: Util.newElementBefore('<item />'),
          caption: 'New <item /> before this',
        },
        {
          action: Util.newElementAfter('<item />'),
          caption: 'New <item /> after this',
        },
        {
          action: Util.duplicateElement,
          caption: 'Copy <item />',
        },
        {
          action: Util.moveElementUp,
          caption: 'Move <item /> up',
          hideIf: (xml, id) => !Util.canMoveElementUp(xml, id),
        },
        {
          action: Util.moveElementDown,
          caption: 'Move <item /> down',
          hideIf: (xml, id) => !Util.canMoveElementDown(xml, id),
        },
      ],
    },
  },
}

const steps = [
  {
    label: 'Paket herunterladen',
    description: <React.Fragment />,
  },
  {
    label: 'BDS-Dateipfad auswählen',
    description: <React.Fragment />,
  },
  {
    label: 'BDS anpassen',
    description: <React.Fragment />,
  },
  {
    label: 'BDS erstellen',
    description: <React.Fragment />,
  },
]

const xml = '<DATA><VARNAME>VersionAktuell</VARNAME><VALUE>4.4.0</VALUE><OPTIONS>0</OPTIONS></DATA>'

// Step content components
const StepCreateBds: React.FC<PackageDetailsProps> = ({ software }) => {
  const ref = React.useRef<XmlEditor | null>(null)
  const dip = '\\\\med.tu-dresden.de\\app\\bara\\rep\\BaraProd\\APPS'

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
    <Paper sx={{ p: 4 }}>
      <Typography variant="body2">Pfad zu BDS File anpassen:</Typography>
      <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ pb: 3 }}>
        <Typography color="textDisabled" sx={{ fontFamily: 'monospace', pb: 0.5, flexShrink: 0 }}>
          {dip}
        </Typography>
        <TextField
          variant="standard"
          sx={{
            flexGrow: 1,
            input: { fontFamily: 'monospace' },
          }}
          value={`\\#Generated\\${software?.winget_id}\\${software?.version}\\Installation_${software?.name.replace(' ', '_')}.bds`}
        />
      </Stack>
      <Box sx={{ maxWidth: 400 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel optional={index === steps.length - 1 ? <Typography variant="caption">Last step</Typography> : null}>{step.label}</StepLabel>
              <StepContent>
                <Box>{step.description}</Box>
                <Box sx={{ mb: 2 }}>
                  <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        )}
      </Box>
      {/* <XmlEditor ref={ref} docSpec={{}} xml={xml} /> */}
    </Paper>
  )
}

export default StepCreateBds
