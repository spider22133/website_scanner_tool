import React from 'react'
import { SoftwareEntry } from '../../../../types/common'
import SoftwareInfoWidget from './widgets/softwareInfoWidget'
import { Alert, AlertTitle, Box, Grid, Paper, Typography } from '@mui/material'
import SoftwareSettingsWidget from './widgets/softwareSettingsWidget'
import Masonry from '@mui/lab/Masonry'

interface PackageDetailsProps {
  software: SoftwareEntry
}

const SoftwareDetails: React.FC<PackageDetailsProps> = ({ software }) => {
  const heights = [520, 330]

  return (
    <Grid container spacing={2} alignItems="stretch">
      <Grid size={12}>
        {software && (software?.bara_version === null || software?.bara_version === undefined) && (
          <Alert severity="warning">
            <AlertTitle>
              <b>Fehlerbehandlung bei der Baramundi App-Ermittlung</b>
            </AlertTitle>
            <Typography variant="body2">
              1) Softwarename stimmt nicht überein: Überprüfung: Stellen Sie sicher, dass der Name der Software im Versionskontroll-Dashboard exakt
              dem Namen entspricht, der in Baramundi verwendet wird.
            </Typography>
            <Typography variant="body2">
              2) Versionsformat stimmt nicht überein: Überprüfung: In vielen Fällen verwendet Baramundi ein anderes Versionsmuster als WinGet (z.B.
              1.0.0.0 statt 1.0).
            </Typography>
            <Typography variant="body2">
              3) Software nicht gefunden (Zugriffsprobleme): Überprüfung: Fehlende Zugriffsberechtigungen auf den Installationsordner können
              verhindern, dass Baramundi die Software erkennt.
            </Typography>
          </Alert>
        )}
      </Grid>
      <Grid size={12}>
        <Box width={'100%'}>
          <Masonry component={'div'} columns={2} spacing={2} defaultHeight={450} defaultColumns={2} defaultSpacing={2} sequential>
            <Paper>{software && <SoftwareInfoWidget software={software} />}</Paper>
            <Paper> {software && <SoftwareSettingsWidget software={software} />}</Paper>
          </Masonry>
        </Box>
      </Grid>
    </Grid>
  )
}

export default SoftwareDetails
