import { GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowId, GridRowModes, GridRowModesModel } from '@mui/x-data-grid'
import { Avatar, Box, IconButton, Stack, Tooltip } from '@mui/material'
import { SoftwareEntry } from '../../../../../types/common'
import { API_URL } from '../../../http-connection'

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
import TimeAgo from 'javascript-time-ago'

interface SoftwareColumnsParams {
  timeAgo: TimeAgo
  isAdmin: boolean
  rowModesModel: GridRowModesModel
  onEdit: (id: GridRowId) => () => void
  onDelete: (id: GridRowId) => () => void
  onSave: (id: GridRowId) => () => void
  onCancel: (id: GridRowId) => () => void
  onToggleVisibility: (row: SoftwareEntry) => void
  onCheck: (id: string) => void
}

const SoftwareColumns = ({
  timeAgo,
  isAdmin,
  rowModesModel,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onToggleVisibility,
  onCheck,
}: SoftwareColumnsParams): GridColDef[] => [
  {
    field: 'icons',
    headerName: '',
    width: 80,
    renderCell: (params: GridRenderCellParams<SoftwareEntry>) => {
      const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit

      return (
        <Stack direction="row" alignItems="center" spacing={2} height="100%">
          {isInEditMode ? (
            <></>
          ) : (
            <>
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
            </>
          )}

          <>
            {params.row?.icon ? (
              <Avatar src={`${API_URL}${params.row.icon}`} sx={{ width: 25, height: 25 }} />
            ) : (
              <Inventory2OutlinedIcon sx={{ width: 25, height: 25 }} />
            )}
          </>
        </Stack>
      )
    },
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
      const { id, row } = params
      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit
      const isHidden = row.is_hidden
      const isCustom = row.source === 'custom'

      const actions = [
        // Visible to everyone
        <GridActionsCellItem
          icon={
            <Tooltip title="Prüfen">
              <CachedOutlinedIcon />
            </Tooltip>
          }
          label="Prüfen"
          onClick={() => onCheck(row.id)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          icon={<Tooltip title={isHidden ? 'Anzeigen' : 'Ausblenden'}>{isHidden ? <VisibilityOff /> : <Visibility />}</Tooltip>}
          label={isHidden ? 'Anzeigen' : 'Ausblenden'}
          onClick={() => onToggleVisibility(row)}
          showInMenu={false}
        />,
      ]

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
                onClick={onSave(id)}
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
              onClick={onCancel(id)}
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
                onClick={onEdit(id)}
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
              onClick={onDelete(row.id)}
              showInMenu
            />,
          )
        }
      }

      return actions
    },
  },
]

export default SoftwareColumns
