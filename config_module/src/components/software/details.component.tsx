import React from 'react'
import { SoftwareEntry } from '../../../../types/common'
import SoftwareInfoWidget from './widgets/softwareInfoWidget'
import { Grid } from '@mui/material'
import SoftwareSettingsWidget from './widgets/softwareSettingsWidget'

interface PackageDetailsProps {
  software: SoftwareEntry
}

const SoftwareDetails: React.FC<PackageDetailsProps> = ({ software }) => {
  return (
    <Grid item container spacing={2} alignItems="stretch">
      <Grid item xs={12} lg={7}>
        {software && <SoftwareInfoWidget software={software} />}
      </Grid>
      <Grid item xs={12} lg={5}>
        {software && <SoftwareSettingsWidget software={software} />}
      </Grid>
    </Grid>
  )
}

export default SoftwareDetails
