import React from 'react'
import { SoftwareEntry } from '../../../../../types/common'
import { Typography, Divider, Link, Grid, Chip, Stack, Tooltip, Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { CopyToClipboard } from '../../utilities/CopyToClipboard'
import { setMessage } from '../../../store/slices/message.slice'
import { useDispatch } from 'react-redux'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import AddIcon from '@mui/icons-material/Add'

interface SoftwareInfoWidgetProps {
  software: SoftwareEntry
}

const SoftwareInfoWidget: React.FC<SoftwareInfoWidgetProps> = ({ software }) => {
  const dispatch = useDispatch()

  const { version, bara_version, details, is_current, name } = software
  const { publisher, publisherUrl, publisherSupportUrl, installers, homepage, license, licenseUrl, copyright, description, releaseNotesUrl } =
    details || {}
  console.log(installers)

  return (
    <Accordion defaultExpanded sx={{ p: 2 }} elevation={0}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5" fontWeight={600}>
          Paket Information
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Divider sx={{ mb: 2 }} />

        {/* Publisher Information */}
        <Grid container spacing={2}>
          <Stack spacing={1}>
            <Typography variant="h2">{name}</Typography>
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
                  color={software.bara_version !== null && software.bara_version !== undefined ? (is_current ? 'primary' : 'warning') : 'error'}
                  size="small"
                  sx={{ px: 1 }}
                  icon={<ContentCopyOutlinedIcon />}
                />
              </CopyToClipboard>
            </Stack>
          </Stack>

          {description && (
            <Grid size={12}>
              <Typography className="fw-bold" color="text.secondary">
                Beschreibung
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {description}
              </Typography>
            </Grid>
          )}

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
          <Grid size={12}>
            <Accordion
              defaultExpanded
              disableGutters
              square
              sx={{
                padding: 0,
                boxShadow: 'none',
                borderTop: '1px solid #f2f2f2',
                borderBottom: '1px solid #f2f2f2',
              }}
            >
              <AccordionSummary sx={{ p: 0, m: 0 }} expandIcon={<AddIcon />}>
                <Typography className="fw-bold" color="text.secondary">
                  Installer
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                {installers?.map((installer, index) => (
                  <Box key={index} sx={{ pb: 2 }}>
                    {installer.scope && <Typography variant="body2">Geltungsbereich: {installer.scope}</Typography>}
                    {installer.architecture && <Typography variant="body2">Architektur: {installer.architecture}</Typography>}
                    {installer.url && (
                      <Typography variant="body2">
                        Download:{' '}
                        <Link href={installer.url} target="_blank" rel="noopener">
                          {installer.url}
                        </Link>
                      </Typography>
                    )}
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          </Grid>

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

          {releaseNotesUrl && (
            <Grid size={12}>
              <Typography className="fw-bold" color="text.secondary">
                Versionshinweise
              </Typography>
              <Link href={releaseNotesUrl} target="_blank" rel="noopener">
                {releaseNotesUrl}
              </Link>
            </Grid>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}

export default SoftwareInfoWidget
