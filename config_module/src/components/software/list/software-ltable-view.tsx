import React, { useEffect, useRef, useState } from 'react'
import {
  DataGrid,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowModel,
  GridRowId,
  GridValidRowModel,
  GridApi,
} from '@mui/x-data-grid'

import { useSelector } from 'react-redux'
import { SoftwareEntry } from '../../../../../types/common'
import { RootState, useAppDispatch } from '../../../store/store'
import { checkSoftware, deleteSoftware, updateSoftware } from '../../../store/thunks/software.thunk'
import TimeAgo from 'javascript-time-ago'
import { isAdminUser } from '../../utilities/isAdminUser'
import { getJiraIssues } from '../../../store/thunks/issues.thunk'
import SoftwareColumns from './software-list-columns'
import SoftwareEditToolbar from './software-list-toolbar'

interface SoftwareTableProps {
  timeAgo: TimeAgo
  softwareFilteredList: SoftwareEntry[]
  createSoftwareLoading: boolean
  setActiveWebsite: (software: SoftwareEntry, index: number) => void
}

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    rows: GridValidRowModel[]
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
    setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void
  }
}

export type SoftwareRow = SoftwareEntry & { isNew?: boolean }

const SoftwareTableView: React.FC<SoftwareTableProps> = ({ timeAgo, softwareFilteredList, createSoftwareLoading, setActiveWebsite }) => {
  const dispatch = useAppDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
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

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <DataGrid
        apiRef={gridRef}
        editMode="row"
        rows={rows}
        columns={SoftwareColumns({
          timeAgo,
          isAdmin,
          rowModesModel,
          onCheck: handleCheck,
          onEdit: handleEditClick,
          onDelete: handleDeleteClick,
          onToggleVisibility: handleToggleVisibility,
          onCancel: handleCancelClick,
          onSave: handleSaveClick,
        })}
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
        slots={{ toolbar: SoftwareEditToolbar }}
        slotProps={{
          toolbar: {
            rows,
            setRows: updateFn => {
              setRows(prev => [...updateFn(prev)])
            },
            setRowModesModel: updateFn => {
              setRowModesModel(prev => ({ ...updateFn(prev) }))
            },
          },
        }}
        autoPageSize
        showToolbar
      />
    </div>
  )
}

export default SoftwareTableView
