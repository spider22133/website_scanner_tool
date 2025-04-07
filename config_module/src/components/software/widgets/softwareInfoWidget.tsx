import React from 'react'
import { SoftwareEntry } from '../../../../../types/common'
import { Typography, Divider, Link, Grid, Chip, Stack, Tooltip, Accordion, AccordionDetails, AccordionSummary, IconButton } from '@mui/material'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { CopyToClipboard } from '../../utilities/CopyToClipboard'
import { setMessage } from '../../../slices/message.slice'
import { useDispatch } from 'react-redux'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'

interface SoftwareInfoWidgetProps {
  software: SoftwareEntry
}

const SoftwareInfoWidget: React.FC<SoftwareInfoWidgetProps> = ({ software }) => {
  const dispatch = useDispatch()

  const { version, bara_version, details, is_current } = software
  const { publisher, publisherUrl, publisherSupportUrl, installer, homepage, license, licenseUrl, copyright, description } = details || {}

  return (
    <Accordion defaultExpanded sx={{ p: 2 }}>
      <AccordionSummary
        expandIcon={
          <IconButton sx={{ mx: 2 }}>
            <ExpandMoreIcon />
          </IconButton>
        }
      >
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ width: '100%' }}>
          <Typography variant="h5" fontWeight={600}>
            Information
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <CopyToClipboard
              textToCopy={version}
              onCopySuccess={() => dispatch(setMessage({ message: 'WinGet version copied successfully', variant: 'success' }))}
            >
              <Chip label={`Winget: ${version}`} color="success" size="small" sx={{ px: 1 }} icon={<ContentCopyOutlinedIcon />} />
            </CopyToClipboard>
            <CopyToClipboard
              textToCopy={bara_version || ''}
              onCopySuccess={() => dispatch(setMessage({ message: 'Baramundi version copied successfully', variant: 'success' }))}
            >
              <Chip
                label={`Baramundi: ${bara_version}`}
                color={is_current ? (software.bara_version !== null ? 'primary' : 'error') : 'warning'}
                size="small"
                sx={{ px: 1 }}
                icon={<ContentCopyOutlinedIcon />}
              />
            </CopyToClipboard>
          </Stack>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Divider sx={{ mb: 2 }} />

        {description && (
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography className="fw-bold" color="text.secondary">
                Beschreibung
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {description}
              </Typography>
            </Grid>
          </Grid>
        )}

        {/* Publisher Information */}
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography className="fw-bold" color="text.secondary" sx={{ mt: 2 }}>
              Herausgeber
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {publisher || 'Unbekannter Herausgeber'}
            </Typography>
            {publisherUrl && (
              <Typography variant="body2">
                Webseite:{' '}
                <Link href={publisherUrl} target="_blank" rel="noopener">
                  {publisherUrl}
                </Link>
              </Typography>
            )}
            {publisherSupportUrl && (
              <Typography variant="body2">
                Support:{' '}
                <Link href={publisherSupportUrl} sx={{ wordBreak: 'break-word' }} target="_blank" rel="noopener">
                  {publisherSupportUrl}
                </Link>
              </Typography>
            )}
          </Grid>

          {/* Installer Information */}
          {installer && (
            <Grid size={12}>
              <Typography className="fw-bold" color="text.secondary" sx={{ mt: 2 }}>
                Installer
              </Typography>
              {installer.url && (
                <Typography variant="body2">
                  Download:{' '}
                  <Link href={installer.url} target="_blank" rel="noopener">
                    {installer.url}
                  </Link>
                </Typography>
              )}
              {installer.sha256 && (
                <Tooltip title="SHA256-Prüfsumme" arrow>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word', fontSize: '0.9rem' }}>
                    SHA256: {installer.sha256}
                  </Typography>
                </Tooltip>
              )}
              {installer.releaseDate && <Typography variant="body2">Veröffentlicht: {installer.releaseDate}</Typography>}
            </Grid>
          )}

          {/* License Information */}
          <Grid size={12}>
            <Typography className="fw-bold" color="text.secondary" sx={{ mt: 2 }}>
              Lizenz
            </Typography>
            {license && (
              <Typography variant="body2">
                {license}{' '}
                {licenseUrl && (
                  <Link href={licenseUrl} target="_blank" rel="noopener">
                    (Details)
                  </Link>
                )}
              </Typography>
            )}
            {copyright && <Typography variant="body2">{copyright}</Typography>}
            {homepage && (
              <Typography variant="body2">
                Startseite:{' '}
                <Link href={homepage} target="_blank" rel="noopener">
                  {homepage}
                </Link>
              </Typography>
            )}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}

export default SoftwareInfoWidget
