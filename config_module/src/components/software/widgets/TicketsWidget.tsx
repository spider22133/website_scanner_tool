import React from 'react'
import { SoftwareEntry } from '../../../../../types/common'
import { Typography, Divider, Link, Grid, Chip, Stack, Tooltip, Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { CopyToClipboard } from '../../utilities/CopyToClipboard'
import { setMessage } from '../../../slices/message.slice'
import { useDispatch } from 'react-redux'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'

interface TicketsWidgetProps {
  software: SoftwareEntry
}

const TicketsWidget: React.FC<TicketsWidgetProps> = ({ software }) => {
  const dispatch = useDispatch()

  const { version, bara_version, details, is_current, name } = software
  const { publisher, publisherUrl, publisherSupportUrl, installer, homepage, license, licenseUrl, copyright, description, releaseNotesUrl } =
    details || {}

  return (
    <Accordion defaultExpanded sx={{ p: 2 }} elevation={0}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5" fontWeight={600}>
          Tickets im Überblick
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Divider sx={{ mb: 2 }} />
      </AccordionDetails>
    </Accordion>
  )
}

export default TicketsWidget
