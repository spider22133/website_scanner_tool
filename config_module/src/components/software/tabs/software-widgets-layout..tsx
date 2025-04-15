import React, { useState, useMemo, useEffect } from 'react'
import { SoftwareEntry } from '../../../../../types/common'
import SoftwareInfoWidget from '../widgets/softwareInfoWidget'
import SoftwareSettingsWidget from '../widgets/softwareSettingsWidget'
import BaramundiInfoWidget from '../widgets/BaramundiInfoWidget'
import TicketsWidget from '../widgets/TicketsWidget'
import { Alert, AlertTitle, Box, CircularProgress, Grid, Paper, Stack, Typography } from '@mui/material'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { reorder } from '../../utilities/ReorderDnD'

interface PackageDetailsProps {
  software?: SoftwareEntry
}

interface WidgetItem {
  id: string
  component: JSX.Element
}

const SoftwareWidgetsLayout: React.FC<PackageDetailsProps> = ({ software }) => {
  if (!software) {
    return (
      <Grid container spacing={2}>
        <Grid size={12}>
          <Stack width="100%" justifyContent="center" alignItems="center">
            <CircularProgress color="inherit" />
          </Stack>
        </Grid>
      </Grid>
    )
  }

  const widgets = useMemo<WidgetItem[]>(
    () => [
      { id: 'software-info', component: <SoftwareInfoWidget software={software} /> },
      { id: 'software-settings', component: <SoftwareSettingsWidget software={software} /> },
      { id: 'baramundi-info', component: <BaramundiInfoWidget software={software} /> },
      { id: 'tickets', component: <TicketsWidget software={software} /> },
    ],
    [software],
  )

  const widgetMap = useMemo(() => {
    return new Map(widgets.map(w => [w.id, w.component]))
  }, [widgets])

  // Initialize state from localStorage or default values
  const [leftWidgets, setLeftWidgets] = useState<string[]>(() => {
    const saved = localStorage.getItem('leftWidgets')
    return saved ? JSON.parse(saved) : ['software-info', 'software-settings']
  })

  const [rightWidgets, setRightWidgets] = useState<string[]>(() => {
    const saved = localStorage.getItem('rightWidgets')
    return saved ? JSON.parse(saved) : ['baramundi-info', 'tickets']
  })

  // Save widget order to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('leftWidgets', JSON.stringify(leftWidgets))
  }, [leftWidgets])

  useEffect(() => {
    localStorage.setItem('rightWidgets', JSON.stringify(rightWidgets))
  }, [rightWidgets])

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return

    const sourceList = source.droppableId === 'left' ? leftWidgets : rightWidgets
    const destList = destination.droppableId === 'left' ? leftWidgets : rightWidgets
    const setSourceList = source.droppableId === 'left' ? setLeftWidgets : setRightWidgets
    const setDestList = destination.droppableId === 'left' ? setLeftWidgets : setRightWidgets

    if (source.droppableId === destination.droppableId) {
      const reordered = reorder(sourceList, source.index, destination.index)
      setSourceList(reordered)
    } else {
      const sourceClone = [...sourceList]
      const destClone = [...destList]
      const [moved] = sourceClone.splice(source.index, 1)
      destClone.splice(destination.index, 0, moved)
      setSourceList(sourceClone)
      setDestList(destClone)
    }
  }

  const renderWidgetList = (widgetIds: string[], droppableId: string) => (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            minHeight: 50,
            backgroundColor: snapshot.isDraggingOver ? 'grey.100' : 'transparent',
            border: snapshot.isDraggingOver ? '1px dashed grey' : 'none',
            borderRadius: 1,
            transition: 'background-color 0.3s ease',
          }}
        >
          <Stack spacing={2}>
            {widgetIds.map((id, index) => {
              const component = widgetMap.get(id)
              if (!component) return null

              return (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided, snapshot) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      elevation={snapshot.isDragging ? 4 : 1}
                      sx={{
                        position: 'relative',
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <Box
                        {...provided.dragHandleProps}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          cursor: 'grab',
                          p: 0.5,
                          zIndex: 1,
                          '&:hover': { bgcolor: 'grey.200', borderRadius: 1 },
                        }}
                      >
                        <DragIndicatorIcon fontSize="small" color="action" />
                      </Box>
                      <Box sx={{ pointerEvents: snapshot.isDragging ? 'none' : 'auto' }}>{component}</Box>
                    </Paper>
                  )}
                </Draggable>
              )
            })}
            {provided.placeholder}
          </Stack>
        </Box>
      )}
    </Droppable>
  )

  return (
    <Grid container spacing={2} alignItems="stretch">
      <Grid size={12}>
        {(software.bara_version === null || software.bara_version === undefined) && (
          <Alert severity="warning" sx={{ p: 2 }}>
            <AlertTitle>
              <b>Fehlerbehandlung bei der Baramundi App-Ermittlung</b>
            </AlertTitle>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <b>1) Softwarename stimmt nicht überein:</b>
              <br />
              Überprüfung: Stellen Sie sicher, dass der Name der Software im Versionskontroll-Dashboard exakt dem Namen entspricht, der in Baramundi
              verwendet wird.
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <b>2) Versionsformat stimmt nicht überein:</b>
              <br />
              Überprüfung: In vielen Fällen verwendet Baramundi ein anderes Versionsmuster als WinGet (z.B. 1.0.0.0 statt 1.0).
            </Typography>
            <Typography variant="body2">
              <b>3) Software nicht gefunden (Zugriffsprobleme):</b>
              <br />
              Überprüfung: Fehlende Zugriffsberechtigungen auf den Installationsordner können verhindern, dass Baramundi die Software erkennt.
            </Typography>
          </Alert>
        )}
      </Grid>
      <Grid container size={12} spacing={2}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid size={{ xs: 12, xl: 6 }}>{renderWidgetList(leftWidgets, 'left')}</Grid>
          <Grid size={{ xs: 12, xl: 6 }}>{renderWidgetList(rightWidgets, 'right')}</Grid>
        </DragDropContext>
      </Grid>
    </Grid>
  )
}

export default SoftwareWidgetsLayout
