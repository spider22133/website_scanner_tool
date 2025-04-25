import React from 'react'
import { SoftwareEntry } from '../../../../../types/common'
import { Typography, Divider, Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useDispatch } from 'react-redux'

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
