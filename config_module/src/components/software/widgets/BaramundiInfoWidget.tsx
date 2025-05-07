import React from 'react'
import { SoftwareEntry } from '../../../../../types/common'
import { Typography, Divider, Link, Grid, Chip, Stack, Tooltip, Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { CopyToClipboard } from '../../utilities/CopyToClipboard'
import { setMessage } from '../../../store/slices/message.slice'
import { useDispatch } from 'react-redux'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'

interface BaramundiInfoProps {
  software: SoftwareEntry
}

const BaramundiInfoWidget: React.FC<BaramundiInfoProps> = ({ software }) => {
  const dispatch = useDispatch()

  const { is_central_managed, name } = software

  return (
    <Accordion defaultExpanded sx={{ p: 2 }} elevation={0}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5" fontWeight={600}>
          Baramundi Paket Information
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography>
              UKD zentrale Applikationen:
              <Typography component={'span'} variant="body2" fontWeight={700} paddingLeft={1}>
                {is_central_managed ? 'Ja' : 'Nein'}
              </Typography>
            </Typography>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}

export default BaramundiInfoWidget
