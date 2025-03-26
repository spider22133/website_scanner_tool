import { Box, IconButton, Stack, TextField, Tooltip, Autocomplete, Typography } from '@mui/material'
import { createSoftware, queryWinGetSoftware } from '../../slices/software.slice'
import { useState, useMemo } from 'react'
import { RootState, useAppDispatch } from '../../store'
import { useSelector } from 'react-redux'
import { SoftwareEntry } from '../../../../types/common'
import { debounce } from 'lodash'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined'
import Visibility from '@mui/icons-material/VisibilityOutlined'

type Props = {
  value: boolean
  handleClickToggle?: () => void
}

const AppFilterBar: React.FC<Props> = ({ handleClickToggle, value }) => {
  const dispatch = useAppDispatch()
  const softwareList = useSelector((state: RootState) => state.software.softwareSearchList || [])
  const [inputValue, setInputValue] = useState('')
  const [selectedSoftware, setSelectedSoftware] = useState<SoftwareEntry | null>(null)

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        if (query.length >= 3) dispatch(queryWinGetSoftware(query))
      }, 700),
    [dispatch],
  )

  const handleSearchChange = (_: React.SyntheticEvent, value: string, reason: string) => {
    setInputValue(value)
    if (reason === 'input') debouncedSearch(value)
  }

  const handleAddToList = () => {
    if (selectedSoftware) {
      dispatch(createSoftware(selectedSoftware))
      setSelectedSoftware(null)
      setInputValue('')
    }
  }

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
      <Autocomplete
        options={softwareList} // Ensure this is an array (use empty array fallback)
        inputValue={inputValue}
        filterOptions={options => (options.length === 0 ? [] : options)} // Force empty array when no results
        getOptionLabel={option => (typeof option === 'string' ? option : `${option.name} (${option.version})`)}
        noOptionsText="Keine Suchergebnisse"
        onInputChange={handleSearchChange}
        onChange={(_, value) => setSelectedSoftware(typeof value === 'string' ? null : value)}
        renderInput={params => <TextField {...params} variant="outlined" label="Filter" placeholder="Filter by name..." fullWidth />}
        renderOption={(props, option) => {
          if (typeof option === 'string') return null // Prevent rendering invalid options
          return (
            <li {...props} key={`${option.winget_id}-${option.version}`}>
              <Box>
                <Typography variant="body1">{option.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {option.winget_id} - v{option.version}
                </Typography>
              </Box>
            </li>
          )
        }}
        sx={{ flexGrow: 1 }}
        size="small"
        freeSolo
      />

      <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
        <Tooltip title={value ? 'Hide' : 'Show'} arrow>
          <IconButton aria-label="toggle visibility" onClick={handleClickToggle} edge="end">
            {value ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Tooltip>
      </Box>
    </Stack>
  )
}

export default AppFilterBar
