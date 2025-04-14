import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Chip, IconButton, ListItem, Stack, Tooltip, Typography, useTheme, CircularProgress, Avatar, Badge } from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import DeviceHubOutlinedIcon from '@mui/icons-material/DeviceHubOutlined'
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import TimeAgo from 'javascript-time-ago'
import { SoftwareEntry } from '../../../../types/common'
import { RootState, AppDispatch } from '../../store'
import { checkSoftware, deleteSoftware, updateSoftware } from '../../slices/software.slice'
import { Role } from '../../../../scanner_module/dist/scanner_module/src/interfaces/role.interface'
import { API_URL } from '../../http-connection'

interface WebsitesListItemProps {
  index: number
  timeAgo: TimeAgo
  software: SoftwareEntry
  currentIndex: number
  setActiveWebsite: (software: SoftwareEntry, index: number) => void
}

const isAdminUser = (roles?: Role[]): boolean => roles?.some(role => role.name === 'admin') ?? false

const WebsitesListItem: React.FC<WebsitesListItemProps> = ({ timeAgo, software, index, currentIndex, setActiveWebsite }) => {
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const [isChecking, setIsChecking] = useState(false)

  const isAdmin = isAdminUser(user?.roles)

  const handleCheckStatus = useCallback(
    async (id: string) => {
      setIsChecking(true)
      try {
        await dispatch(checkSoftware(id)).unwrap()
      } finally {
        setIsChecking(false)
      }
    },
    [dispatch],
  )

  const handleToggleVisibility = useCallback(() => {
    const { id, updatedAt, createdAt, details, ...rest } = software
    dispatch(updateSoftware({ ...rest, is_hidden: !software.is_hidden }))
  }, [dispatch, software])

  const handleDelete = useCallback(
    (id: string) => {
      if (window.confirm('Sind Sie sicher, dass Sie dieses Element löschen möchten?')) {
        dispatch(deleteSoftware({ id }))
      }
    },
    [dispatch],
  )

  const handleClick = useCallback(() => {
    setActiveWebsite(software, index)
  }, [setActiveWebsite, software, index])

  const renderBadgeContent = () => {
    if (!software.is_current) {
      return <CheckCircleOutlineOutlinedIcon fontSize="small" />
    }
    return software.bara_version !== null ? <CheckCircleOutlineOutlinedIcon fontSize="small" /> : <ErrorOutlineOutlinedIcon fontSize="small" />
  }

  const renderIcon = () => (
    <Badge
      color={software.bara_version !== null && software.bara_version !== undefined ? (software.is_current ? 'primary' : 'warning') : 'error'}
      overlap="circular"
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      badgeContent={renderBadgeContent()}
      sx={{ '.MuiBadge-badge': { padding: 0 } }}
    >
      {software.icon ? (
        <Avatar src={`${API_URL}${software.icon}`} sx={{ width: 36, height: 36 }} />
      ) : (
        <Inventory2OutlinedIcon sx={{ width: 36, height: 36 }} />
      )}
    </Badge>
  )

  return (
    <ListItem
      sx={{
        my: 0.5,
        border: `1px solid ${index === currentIndex ? theme.palette.grey.A700 : theme.palette.grey.A200}`,
        borderRadius: 1,
        flexDirection: 'column',
      }}
      onClick={handleClick}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%" spacing={4}>
        <Stack direction="row" alignItems="center" spacing={2} marginRight={'auto !important'}>
          {renderIcon()}
          <div>
            <Typography fontWeight="bold">{software.name}</Typography>
            <Typography variant="body2">{software.details?.publisher}</Typography>
          </div>
        </Stack>
        <Stack direction="column" spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CloudDownloadOutlinedIcon fontSize="small" />
            <span>{software.version || ''}</span>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <DeviceHubOutlinedIcon fontSize="small" />
            <span>{software.bara_version || ''}</span>
          </Stack>
        </Stack>
        <Stack direction="column" alignItems="flex-end">
          <Stack direction="row" alignItems="center">
            <Tooltip title="Prüfen" arrow>
              {isChecking ? (
                <CircularProgress color="inherit" size={16} sx={{ m: '12px' }} />
              ) : (
                <IconButton
                  aria-label="prüfen"
                  onClick={e => {
                    e.stopPropagation()
                    handleCheckStatus(software.winget_id)
                  }}
                >
                  <CachedOutlinedIcon />
                </IconButton>
              )}
            </Tooltip>
            <Tooltip title={software.is_hidden ? 'Anzeigen' : 'Ausblenden'} arrow>
              <IconButton
                aria-label="Sichtbarkeit umschalten"
                onClick={e => {
                  e.stopPropagation()
                  handleToggleVisibility()
                }}
              >
                {software.is_hidden ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
              </IconButton>
            </Tooltip>
            {isAdmin && (
              <Tooltip title="Löschen" arrow>
                <IconButton
                  aria-label="löschen"
                  color="error"
                  onClick={e => {
                    e.stopPropagation()
                    handleDelete(software.winget_id)
                  }}
                >
                  <DeleteOutlinedIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
          {software.updatedAt && (
            <Chip
              icon={<DoneAllOutlinedIcon />}
              variant="outlined"
              size="small"
              label={timeAgo.format(new Date(software.updatedAt))}
              sx={{ '& .MuiChip-iconSmall': { ml: '5px' } }}
            />
          )}
        </Stack>
      </Stack>
    </ListItem>
  )
}

export default WebsitesListItem
