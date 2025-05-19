import React, { useEffect, useMemo, useState } from 'react'
import {
  Typography,
  Divider,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Button,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RefreshIcon from '@mui/icons-material/Refresh'
import AddIcon from '@mui/icons-material/Add'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store/store'
import { SoftwareEntry } from '../../../../../types/common'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { PRIORITY_MAP } from '../../../helpers/issue-priority-mapper'
import { createIssue, getJiraIssues } from '../../../store/thunks/issues.thunk'
import MailIcon from '@mui/icons-material/Mail'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import { updateSoftware } from '../../../store/thunks/software.thunk'
import { isAdminUser } from '../../utilities/isAdminUser'

interface TicketsWidgetProps {
  software: SoftwareEntry
}

const TicketsWidget: React.FC<TicketsWidgetProps> = ({ software }) => {
  const dispatch = useDispatch<AppDispatch>()

  const [selectedPriority, setSelectedPriority] = useState<string>('3')
  const [autoCreateSubscribed, setAutoCreateSubscribed] = useState(false)

  const { softwareIssues, createIssueLoading } = useSelector((state: RootState) => state.issues)
  const { user } = useSelector((state: RootState) => state.auth)

  const isAdmin = isAdminUser(user?.roles)

  useEffect(() => {
    if (software?.winget_id) {
      dispatch(getJiraIssues({ winget_id: software.winget_id }))
      setAutoCreateSubscribed(software.subscribeCreateIssue)
    }
  }, [software, dispatch])

  const issues = useMemo(() => {
    return software.id ? (softwareIssues[software.id] ?? []) : []
  }, [softwareIssues, software])

  const renderSkeleton = () => (
    <Box display="flex" alignItems="center" height="100%">
      <Skeleton variant="text" width="100%" height={30} />
    </Box>
  )

  const rows = useMemo(() => {
    if (createIssueLoading) {
      return [
        {
          id: 'skeleton',
          jira_key: '',
          createdAt: '',
          priority: '',
          statusName: '',
          resolutionName: '',
          isSkeleton: true,
        },
        ...issues,
      ]
    }
    return issues
  }, [issues, createIssueLoading])

  const version = useMemo(() => software?.versions?.find(item => item.version === software.version), [software])

  const handleRefresh = () => {
    if (software?.winget_id) {
      dispatch(getJiraIssues({ winget_id: software.winget_id, reload: true }))
    }
  }

  const handleCreateTicket = () => {
    if (software?.winget_id) {
      dispatch(createIssue({ winget_id: software.winget_id, priority: selectedPriority }))
    }
  }

  const handleAutoUpdateSubscription = () => {
    const { id, updatedAt, createdAt, details, versions, users, ...rest } = software
    dispatch(
      updateSoftware({
        ...rest,
        subscribeCreateIssue: !autoCreateSubscribed,
      }),
    )
    setAutoCreateSubscribed(!autoCreateSubscribed)
  }

  const renderPriority = (priorityId: string, isSkeleton: boolean) => {
    if (isSkeleton) {
      return renderSkeleton()
    }

    const priority = PRIORITY_MAP[priorityId]
    if (!priority) return 'Unbekannt'

    return (
      <Stack direction="row" alignItems="center" spacing={1} sx={{ height: '100%' }}>
        <img src={priority.iconUrl} alt={priority.name} width={16} height={16} />
        <Typography variant="body2" color={priority.statusColor}>
          {priority.name}
        </Typography>
      </Stack>
    )
  }

  const columns: GridColDef[] = [
    {
      field: 'jira_key',
      headerName: 'Nummer',
      flex: 1,
      renderCell: params => {
        if (params.row.isSkeleton) {
          return renderSkeleton()
        }

        const key = params.row.jira_key
        return (
          <a href={`https://jira.med.tu-dresden.de/browse/${key}`} target="_blank" rel="noreferrer">
            {key}
          </a>
        )
      },
    },
    {
      field: 'createdAt',
      headerName: 'Erstellt am',
      flex: 1,
      renderCell: params => {
        if (params.row.isSkeleton) {
          return renderSkeleton()
        }

        return new Date(params.row.createdAt).toLocaleDateString('de-DE')
      },
    },
    {
      field: 'software_version',
      headerName: 'Version',
      flex: 1,
    },
    {
      field: 'statusName',
      headerName: 'Vorgangsstand',
      flex: 1,
      renderCell: params => (params.row.isSkeleton ? renderSkeleton() : params.row.statusName),
    },
    {
      field: 'resolutionName',
      headerName: 'Lösungsstand',
      flex: 1,
      renderCell: params => {
        if (params.row.isSkeleton) {
          return renderSkeleton()
        }

        const value = params.row.resolutionName
        return (
          <span
            style={{
              color: value ? 'inherit' : '#888',
              fontStyle: value ? 'normal' : 'italic',
            }}
          >
            {value || 'Offen'}
          </span>
        )
      },
    },
    {
      field: 'priority',
      headerName: 'Priorität',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => renderPriority(params.value, params.row.isSkeleton),
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
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" mb={2}>
          <Stack direction="row" spacing={2}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="priority-select-label">Priorität</InputLabel>
              <Select
                labelId="priority-select-label"
                id="priority-select"
                value={selectedPriority}
                label="Priorität"
                disabled={software.is_current || version?.hasJiraIssue}
                onChange={e => setSelectedPriority(e.target.value)}
              >
                {Object.entries(PRIORITY_MAP).map(([id, priority]) => (
                  <MenuItem key={id} value={id}>
                    {priority.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateTicket}
              sx={{ height: 40 }}
              disabled={software.is_current || version?.hasJiraIssue}
            >
              Ticket erstellen
            </Button>
          </Stack>

          <Stack direction="row" spacing={1}>
            <IconButton onClick={handleRefresh} sx={{ height: 46, width: 46 }} title="Aktualisieren">
              <RefreshIcon />
            </IconButton>

            {!isAdmin && (
              <IconButton
                onClick={handleAutoUpdateSubscription}
                sx={{ height: 46, width: 46 }}
                title={`Jira-Ticket-Erstellung${autoCreateSubscribed ? ' nicht mehr' : ''} abonnieren`}
              >
                {autoCreateSubscribed ? <MarkEmailReadIcon /> : <MailIcon />}
              </IconButton>
            )}
          </Stack>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ height: 350, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={row => row.id}
            sx={{ border: 'none' }}
            disableRowSelectionOnClick
            autoPageSize
            showToolbar
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default TicketsWidget
