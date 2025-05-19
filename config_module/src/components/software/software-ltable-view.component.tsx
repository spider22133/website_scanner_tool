import React from 'react'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridSlotProps,
  ToolbarButton,
  Toolbar,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowModel,
  GridActionsCellItem,
  GridRowId,
} from '@mui/x-data-grid'
import { IconButton, Tooltip, Stack, Box, Avatar } from '@mui/material'
import Visibility from '@mui/icons-material/VisibilityOutlined'
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import DeviceHubOutlinedIcon from '@mui/icons-material/DeviceHubOutlined'
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'

import { useSelector } from 'react-redux'
import { SoftwareEntry } from '../../../../types/common'
import { RootState, useAppDispatch } from '../../store/store'
import { checkSoftware, deleteSoftware, updateSoftware } from '../../store/thunks/software.thunk'
import TimeAgo from 'javascript-time-ago'
import { isAdminUser } from '../utilities/isAdminUser'
import { getJiraIssues } from '../../store/thunks/issues.thunk'
import { API_URL } from '../../http-connection'

interface SoftwareTableProps {
  timeAgo: TimeAgo
  softwareFilteredList: SoftwareEntry[]
  createSoftwareLoading: boolean
  setActiveWebsite: (software: SoftwareEntry, index: number) => void
}

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
    setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void
  }
}

type SoftwareRow = SoftwareEntry & { isNew?: boolean }

const SoftwareTableView: React.FC<SoftwareTableProps> = ({ timeAgo, softwareFilteredList, createSoftwareLoading, setActiveWebsite }) => {
  const dispatch = useAppDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const isAdmin = isAdminUser(user?.roles)

  const [rows, setRows] = React.useState<SoftwareRow[]>(softwareFilteredList)
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({})

  React.useEffect(() => {
    setRows(softwareFilteredList)
  }, [softwareFilteredList])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      editable: true,
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
          <>
            {params.row?.icon ? (
              <Avatar src={`${API_URL}${params.row.icon}`} sx={{ width: 25, height: 25 }} />
            ) : (
              <Inventory2OutlinedIcon sx={{ width: 25, height: 25 }} />
            )}
          </>
          <Box>{params.value}</Box>
        </Stack>
      ),
    },
    {
      field: 'publisher',
      headerName: 'Publisher',
      flex: 1,
      sortable: false,
      editable: true,
      renderCell: (params: GridRenderCellParams<SoftwareEntry>) => params.row.details?.publisher || '',
    },
    {
      field: 'version',
      headerName: 'Neue Version',
      flex: 1,
      sortable: false,
      editable: true,
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
      editable: true,
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
      field: 'adminActions',
      type: 'actions',
      headerName: 'Actions',
      flex: 1,
      getActions: params => {
        const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit
        const isHidden = params.row.is_hidden

        const actions = [
          // Visible to everyone
          <GridActionsCellItem icon={<CachedOutlinedIcon />} label="Prüfen" onClick={() => handleCheck(params.row.winget_id)} showInMenu={false} />,
          <GridActionsCellItem
            icon={isHidden ? <VisibilityOff /> : <Visibility />}
            label={isHidden ? 'Anzeigen' : 'Ausblenden'}
            onClick={() => handleToggleVisibility(params.row)}
            showInMenu={false}
          />,
        ]

        // Admin-only actions
        if (isAdmin) {
          if (isInEditMode) {
            actions.push(
              <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={handleSaveClick(params.id)} />,
              <GridActionsCellItem icon={<CancelIcon />} label="Cancel" onClick={handleCancelClick(params.id)} />,
            )
          } else {
            actions.push(
              <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={handleEditClick(params.id)} />,
              <GridActionsCellItem icon={<DeleteIcon color="error" />} label="Delete" onClick={handleDeleteClick(params.row.winget_id)} />,
            )
          }
        }

        return actions
      },
    },
  ]

  const typedSetRows = setRows as unknown as (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void

  const handleCheck = async (id: string) => {
    await dispatch(checkSoftware(id))
    await dispatch(getJiraIssues({ winget_id: id, reload: true }))
  }

  const handleToggleVisibility = (software: SoftwareEntry) => {
    const { id, updatedAt, createdAt, details, ...rest } = software
    dispatch(updateSoftware({ ...rest, id: software.id, is_hidden: !software.is_hidden }))
  }

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Element löschen möchten?')) {
      dispatch(deleteSoftware({ id: id as string }))
      setRows(rows.filter(row => row.id !== id))
    }
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find(row => row.id === id)
    if (editedRow?.isNew) {
      setRows(rows.filter(row => row.id !== id))
    }
  }

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow: SoftwareRow = {
      ...(newRow as SoftwareEntry),
      isNew: false,
    }

    setRows(prevRows => prevRows.map(row => (row.id === updatedRow.id ? updatedRow : row)))

    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  function EditToolbar(props: GridSlotProps['toolbar']) {
    const { setRows, setRowModesModel } = props

    const handleClick = () => {
      const id = `new-${Math.random().toString(36).substr(2, 9)}`
      setRows(oldRows => [{ id, winget_id: id, name: '', version: '', subscribeCreateIssue: false, isNew: true } as SoftwareEntry, ...oldRows])
      setRowModesModel(oldModel => ({
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        ...oldModel,
      }))
    }

    return (
      <Toolbar>
        <Tooltip title="Add record">
          <ToolbarButton onClick={handleClick}>
            <AddIcon fontSize="small" />
          </ToolbarButton>
        </Tooltip>
      </Toolbar>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <DataGrid<SoftwareEntry>
        editMode="row"
        rows={rows}
        columns={columns}
        loading={createSoftwareLoading}
        getRowId={row => row.id}
        onRowClick={params => {
          const index = softwareFilteredList.findIndex(s => s.id === params.row.id)
          setActiveWebsite(params.row, index)
        }}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        sx={{ border: 'none' }}
        slots={{ toolbar: EditToolbar }}
        slotProps={{ toolbar: { showQuickFilter: false, setRows: typedSetRows, setRowModesModel } }}
        checkboxSelection
        disableRowSelectionOnClick
        autoPageSize
        showToolbar
      />
    </div>
  )
}

export default SoftwareTableView
