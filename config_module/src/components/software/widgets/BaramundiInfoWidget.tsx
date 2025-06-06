import React from 'react'
import { SoftwareEntry } from '../../../../../types/common'
import {
  Typography,
  Divider,
  Tooltip,
  Grid,
  Stack,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  styled,
  tooltipClasses,
  TooltipProps,
} from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface BaramundiInfoProps {
  software: SoftwareEntry
}

const BaramundiInfoWidget: React.FC<BaramundiInfoProps> = ({ software }) => {
  const { is_central_managed } = software

  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))

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
            <Stack direction="row" justifyContent="space-between">
              <Typography>
                UKD zentrale Applikationen:
                <Typography component={'span'} variant="body2" fontWeight={700} paddingLeft={1}>
                  {is_central_managed ? 'Ja' : 'Nein'}
                </Typography>
              </Typography>
              <HtmlTooltip
                title={
                  <React.Fragment>
                    <Typography color="inherit" component="div">
                      Betreung durch EPM-Team
                    </Typography>
                    <em>{'Die Software befindet sich innerhalb des UKD/APPS-Ordners.'}</em>
                  </React.Fragment>
                }
              >
                <InfoOutlinedIcon />
              </HtmlTooltip>
            </Stack>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}

export default BaramundiInfoWidget
