import React from 'react'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { IconButton, Tooltip, Stack, Box } from '@mui/material'
import Visibility from '@mui/icons-material/VisibilityOutlined'
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import DeviceHubOutlinedIcon from '@mui/icons-material/DeviceHubOutlined'
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined'

import { useSelector } from 'react-redux'
import { SoftwareEntry } from '../../../../types/common'
import { RootState, useAppDispatch } from '../../store/store'
import { checkSoftware, deleteSoftware, updateSoftware } from '../../store/thunks/software.thunk'
import TimeAgo from 'javascript-time-ago'

interface SoftwareTableProps {
  timeAgo: TimeAgo
  softwareFilteredList: SoftwareEntry[]
  createSoftwareLoading: boolean
  setActiveWebsite: (software: SoftwareEntry, index: number) => void
}

const SoftwareTableView: React.FC<SoftwareTableProps> = ({ timeAgo, softwareFilteredList, createSoftwareLoading, setActiveWebsite }) => {
  const dispatch = useAppDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const isAdmin = user?.roles?.some(role => role.name === 'admin')

  const handleCheck = async (id: string) => {
    await dispatch(checkSoftware(id))
  }

  const handleToggleVisibility = (software: SoftwareEntry) => {
    const { id, updatedAt, createdAt, details, ...rest } = software
    dispatch(updateSoftware({ ...rest, is_hidden: !software.is_hidden }))
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Element löschen möchten?')) {
      dispatch(deleteSoftware({ id }))
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      renderCell: (params: GridRenderCellParams<SoftwareEntry>) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          {params.row?.bara_version !== null && params.row?.bara_version !== undefined ? (
            <>
              {params.row?.is_current ? (
                <CheckCircleOutlineOutlinedIcon color="success" fontSize="small" />
              ) : (
                <CheckCircleOutlineOutlinedIcon color="warning" fontSize="small" />
              )}
            </>
          ) : (
            <ErrorOutlineOutlinedIcon color="error" fontSize="small" />
          )}
          <Box>{params.value}</Box>
        </Stack>
      ),
    },
    {
      field: 'publisher',
      headerName: 'Publisher',
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams<SoftwareEntry>) => params.row.details?.publisher || '',
    },
    {
      field: 'version',
      headerName: 'Neue Version',
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams<SoftwareEntry>) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <CloudDownloadOutlinedIcon fontSize="small" />
          <span>{params.row.version || ''}</span>
        </Stack>
      ),
    },
    {
      field: 'bara_version',
      headerName: 'Version',
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams<SoftwareEntry>) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box>
            <DeviceHubOutlinedIcon fontSize="small" />
          </Box>
          <span>{params.row.bara_version || ''}</span>
        </Stack>
      ),
    },
    {
      field: 'updatedAt',
      headerName: 'Kontrolliert',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (params.value ? timeAgo.format(new Date(params.value)) : null),
    },
    {
      field: 'actions',
      headerName: '',
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" alignItems="center">
          <Box>
            <Tooltip title="Prüfen">
              <IconButton size="small" onClick={() => handleCheck(params.row.winget_id)}>
                <CachedOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            <Tooltip title={params.row.is_hidden ? 'Anzeigen' : 'Ausblenden'}>
              <IconButton size="small" onClick={() => handleToggleVisibility(params.row)}>
                {params.row.is_hidden ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Tooltip>
          </Box>

          {isAdmin && (
            <Box>
              <Tooltip title="Löschen">
                <IconButton size="small" color="error" onClick={() => handleDelete(params.row.winget_id)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Stack>
      ),
    },
  ]

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <DataGrid<SoftwareEntry>
        rows={softwareFilteredList}
        columns={columns}
        loading={createSoftwareLoading}
        getRowId={row => row.winget_id}
        onRowClick={params => {
          const index = softwareFilteredList.findIndex(s => s.winget_id === params.row.winget_id)
          setActiveWebsite(params.row, index)
        }}
        sx={{ border: 'none' }}
        slotProps={{ toolbar: { showQuickFilter: false } }}
        checkboxSelection
        disableRowSelectionOnClick
        autoPageSize
      />
    </div>
  )
}

export default SoftwareTableView
