import { Paper, Typography, TextField, Button, Step, StepContent, StepLabel, Stepper } from '@mui/material'
import { Box, Stack } from '@mui/system'
import * as React from 'react'
import { Util, XmlEditor } from 'react-xml-editor'
import { DocSpec } from 'react-xml-editor/lib/src/types'

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
    label: 'Select campaign settings',
    description: `For each ad campaign that you create, you can control how much
                you're willing to spend on clicks and conversions, which networks
                and geographical locations you want your ads to show on, and more.`,
  },
  {
    label: 'Create an ad group',
    description: 'An ad group contains one or more ads which target a shared set of keywords.',
  },
  {
    label: 'Create an ad',
    description: `Try out different ad text to see what brings in the most customers,
                and learn how to enhance your ads using features like ad extensions.
                If you run into any problems with your ads, find out how to tell if
                they're running and how to resolve approval issues.`,
  },
]

const xml = '<DATA><VARNAME>VersionAktuell</VARNAME><VALUE>4.4.0</VALUE><OPTIONS>0</OPTIONS></DATA>'

// Step content components
const StepCreateBds: React.FC = () => {
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
          value="\Blender Foundation\Blender\4.4.0\Installation_Blender.bds"
        />
      </Stack>
      <Box sx={{ maxWidth: 400 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel optional={index === steps.length - 1 ? <Typography variant="caption">Last step</Typography> : null}>{step.label}</StepLabel>
              <StepContent>
                <Typography>{step.description}</Typography>
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
