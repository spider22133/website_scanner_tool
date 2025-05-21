import React, { useEffect, useRef, useState } from 'react'
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
  GridValidRowModel,
  GridApi,
} from '@mui/x-data-grid'
import { Tooltip, Stack, Box, Avatar, Divider, Typography } from '@mui/material'
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
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'

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
  const { software } = useSelector((state: RootState) => state.software)
  const isAdmin = isAdminUser(user?.roles)

  const [rows, setRows] = useState<GridValidRowModel[]>(softwareFilteredList)
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({})
  const gridRef = useRef<GridApi>(null)

  useEffect(() => {
    setRows(softwareFilteredList)
  }, [softwareFilteredList])

  useEffect(() => {
    const newRowId = Object.keys(rowModesModel).find(id => rowModesModel[id].mode === GridRowModes.Edit && rows.find(row => row.id === id)?.isNew)
    if (newRowId && gridRef.current) {
      const rowIndex = rows.findIndex(row => row.id === newRowId)
      if (rowIndex !== -1) {
        const pageSize = gridRef.current.state.pagination.paginationModel.pageSize || 20
        const page = Math.floor(rowIndex / pageSize)
        gridRef.current.setPage(page)
        gridRef.current.setCellFocus(newRowId, 'name')
      }
    }
  }, [rowModesModel, rows])

  const columns: GridColDef[] = [
    {
      field: 'icons',
      headerName: '',
      width: 80,
      renderCell: (params: GridRenderCellParams<SoftwareEntry>) => (
        <Stack direction="row" alignItems="center" spacing={2} height="100%">
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
        </Stack>
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      editable: true,
      renderCell: (params: GridRenderCellParams<SoftwareEntry>) => <Box>{params.value}</Box>,
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
      editable: false,
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
        const isCustom = params.row.source === 'custom'

        const actions = [
          // Visible to everyone
          <GridActionsCellItem
            icon={
              <Tooltip title="Prüfen">
                <CachedOutlinedIcon />
              </Tooltip>
            }
            label="Prüfen"
            onClick={() => handleCheck(params.row.winget_id)}
            showInMenu={false}
          />,
          <GridActionsCellItem
            icon={<Tooltip title={isHidden ? 'Anzeigen' : 'Ausblenden'}>{isHidden ? <VisibilityOff /> : <Visibility />}</Tooltip>}
            label={isHidden ? 'Anzeigen' : 'Ausblenden'}
            onClick={() => handleToggleVisibility(params.row)}
            showInMenu={false}
          />,
        ]

        // Admin-only actions
        if (isAdmin) {
          if (isInEditMode) {
            if (isCustom) {
              actions.push(
                <GridActionsCellItem
                  key="save"
                  icon={
                    <Tooltip title="Speichern">
                      <SaveIcon />
                    </Tooltip>
                  }
                  label="Save"
                  onClick={handleSaveClick(params.id)}
                  showInMenu
                />,
              )
            }
            actions.push(
              <GridActionsCellItem
                key="cancel"
                icon={
                  <Tooltip title="Abbrechen">
                    <CancelIcon />
                  </Tooltip>
                }
                label="Abbrechen"
                onClick={handleCancelClick(params.id)}
                showInMenu
              />,
            )
          } else {
            if (isCustom) {
              actions.push(
                <GridActionsCellItem
                  key="edit"
                  icon={
                    <Tooltip title="Bearbeiten">
                      <EditIcon />
                    </Tooltip>
                  }
                  label="Bearbeiten"
                  onClick={handleEditClick(params.id)}
                  showInMenu
                />,
              )
            }
            actions.push(
              <GridActionsCellItem
                key="delete"
                icon={
                  <Tooltip title="Löschen">
                    <DeleteIcon color="error" />
                  </Tooltip>
                }
                label="Löschen"
                onClick={handleDeleteClick(params.row.winget_id)}
                showInMenu
              />,
            )
          }
        }

        return actions
      },
    },
  ]

  const handleCheck = async (id: string) => {
    await dispatch(checkSoftware(id))
    await dispatch(getJiraIssues({ id, reload: true }))
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

  const countByVisibility = (isHidden: boolean) => {
    return software.filter(software => software.is_hidden === isHidden).length
  }

  const countByCurrentStatus = (isCurrent: boolean) => {
    return software.filter(software => software.is_current === isCurrent).length
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  function EditToolbar(props: GridSlotProps['toolbar']) {
    const { setRows, setRowModesModel } = props

    const handleClick = () => {
      const maxId = Math.max(...rows.map(item => Number(item.id)), 0)
      const newId = (maxId + 1).toString()
      setRows(oldRows => [
        ...oldRows,
        {
          id: newId,
          winget_id: undefined,
          name: '',
          version: '0.0.0',
          subscribeCreateIssue: false,
          source: 'custom',
          isNew: true,
        } as SoftwareEntry,
      ])

      setRowModesModel(oldModel => ({
        ...oldModel,
        [newId]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }))
    }

    return (
      <Toolbar>
        <Tooltip title="Software manuell hinzufügen">
          <ToolbarButton onClick={handleClick}>
            <AddBoxOutlinedIcon />
          </ToolbarButton>
        </Tooltip>
        <Stack direction={'row'} alignItems={'center'} justifyContent={'flex-end'} sx={{ width: '100%' }} spacing={3}>
          <Stack direction={'row'} alignItems={'center'} spacing={3}>
            <Typography variant="body2">
              Aktuell: {countByCurrentStatus(true)} / Nicht Aktuell: {countByCurrentStatus(false)}
            </Typography>
          </Stack>
          <Box>
            <Typography variant="body2">
              Ausgeblendet: {countByVisibility(true)} / Sichtbar: {countByVisibility(false)} / Gesamt: {software.length}
            </Typography>
          </Box>
        </Stack>
      </Toolbar>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <DataGrid
        apiRef={gridRef}
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
        slotProps={{
          toolbar: {
            setRows: updateFn => {
              setRows(prev => [...updateFn(prev)])
            },
            setRowModesModel: updateFn => {
              setRowModesModel(prev => ({ ...updateFn(prev) }))
            },
          },
        }}
        // disableRowSelectionOnClick
        autoPageSize
        showToolbar
      />
    </div>
  )
}

export default SoftwareTableView
