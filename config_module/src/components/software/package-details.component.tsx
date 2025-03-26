import React from 'react'
import { Card, CardContent, Typography, Box, Divider, Link, Grid, Chip, Stack, Tooltip } from '@mui/material'
import { SoftwareEntry } from '../../../../types/common'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

interface PackageDetailsProps {
  software: SoftwareEntry
}

const PackageDetails: React.FC<PackageDetailsProps> = ({ software }) => {
  const { name, version, bara_version, details, is_current } = software
  const { publisher, publisherUrl, publisherSupportUrl, installer, homepage, license, licenseUrl, copyright, description } = details || {}

  return (
    <Card sx={{ my: 2, p: 2 }}>
      <CardContent>
        {/* Header Section */}
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight={600}>
            {name}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={`Winget: ${version}`} color="success" size="small" sx={{ px: 1 }} />
            <Chip
              label={`Baramundi: ${bara_version}`}
              color={is_current ? 'primary' : 'error'}
              size="small"
              sx={{ px: 1 }}
              icon={is_current ? <TaskAltIcon /> : <ErrorOutlineIcon />}
            />
          </Stack>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {description && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography className="fw-bold" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {description}
              </Typography>
            </Grid>
          </Grid>
        )}

        {/* Publisher Information */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography className="fw-bold" color="text.secondary" sx={{ mt: 2 }}>
              Publisher
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {publisher || 'Unknown Publisher'}
            </Typography>
            {publisherUrl && (
              <Typography variant="body2">
                Website:{' '}
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
            <Grid item xs={12}>
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
                <Tooltip title="SHA256 Checksum" arrow>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word', fontSize: '0.9rem' }}>
                    SHA256: {installer.sha256}
                  </Typography>
                </Tooltip>
              )}
              {installer.releaseDate && <Typography variant="body2">Released: {installer.releaseDate}</Typography>}
            </Grid>
          )}

          {/* License Information */}
          <Grid item xs={12}>
            <Typography className="fw-bold" color="text.secondary" sx={{ mt: 2 }}>
              License
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
                Homepage:{' '}
                <Link href={homepage} target="_blank" rel="noopener">
                  {homepage}
                </Link>
              </Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PackageDetails
