import React, { useEffect, useMemo } from 'react'
import { Typography, Divider, Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store/store'
import { getJiraIssues } from '../../../store/thunks/software'
import { SoftwareEntry } from '../../../../../types/common'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

interface TicketsWidgetProps {
  software: SoftwareEntry
}

const TicketsWidget: React.FC<TicketsWidgetProps> = ({ software }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { softwareIssues, loading } = useSelector((state: RootState) => state.software)

  useEffect(() => {
    if (software?.winget_id) {
      dispatch(getJiraIssues(software.winget_id))
    }
  }, [software, dispatch])

  const issues = useMemo(() => {
    return software.id ? (softwareIssues[software.id] ?? []) : []
  }, [softwareIssues, software])

  const columns: GridColDef[] = [
    {
      field: 'jira_key',
      headerName: 'Jira Key',
      flex: 1,
      renderCell: params => {
        const key = params.row.jira_key
        return (
          <a href={`https://jira.med.tu-dresden.de/browse/${key}`} target="_blank" rel="noreferrer">
            {key}
          </a>
        )
      },
    },
    { field: 'priority', headerName: 'Priorität', width: 120 },
    {
      field: 'createdAt',
      headerName: 'Erstellt am',
      width: 180,
      renderCell: params => new Date(params.row.createdAt).toLocaleString('de-DE'),
    },
  ]

  return (
    <Accordion defaultExpanded sx={{ p: 2 }} elevation={0}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5" fontWeight={600}>
          Tickets im Überblick
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div style={{ height: 300, width: '100%' }}>
          <DataGrid
            rows={issues}
            columns={columns}
            loading={loading}
            getRowId={row => row.id}
            sx={{ border: 'none' }}
            disableRowSelectionOnClick
            autoPageSize
          />
        </div>
      </AccordionDetails>
    </Accordion>
  )
}

export default TicketsWidget
