import { SoftwareEntry } from '../../../../../types/common'
import { Tooltip, Typography } from '@mui/material'
import { Stack, Box } from '@mui/system'
import { GridSlotProps, GridRowModes, ToolbarButton, Toolbar } from '@mui/x-data-grid'

import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'

const SoftwareEditToolbar = (props: GridSlotProps['toolbar']) => {
  const { rows, setRows, setRowModesModel } = props
  const { software } = useSelector((state: RootState) => state.software)

  const countByVisibility = (isHidden: boolean) => {
    return software.filter(software => software.is_hidden === isHidden).length
  }

  const countByCurrentStatus = (isCurrent: boolean) => {
    return software.filter(software => software.is_current === isCurrent).length
  }

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

export default SoftwareEditToolbar
