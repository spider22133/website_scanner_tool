import { Box, IconButton, Stack, TextField, Tooltip, Autocomplete, Typography } from '@mui/material'
import { createSoftware, queryWinGetSoftware } from '../../slices/software.slice'
import { useState, useMemo } from 'react'
import { RootState, useAppDispatch } from '../../store'
import { useSelector } from 'react-redux'
import { WinGetSoftwareEntry } from '../../../../types/common'
import { debounce } from 'lodash'
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined'
import Visibility from '@mui/icons-material/VisibilityOutlined'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'

type Props = {
  value: boolean
  handleClickToggle?: () => void
}

const SearchFilterBar: React.FC<Props> = ({ handleClickToggle, value }) => {
  const dispatch = useAppDispatch()
  const softwareList = useSelector((state: RootState) => state.software.softwareSearchList || [])
  const [inputValue, setInputValue] = useState('')
  const [selectedSoftware, setSelectedSoftware] = useState<WinGetSoftwareEntry | null>(null)

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
        options={softwareList}
        inputValue={inputValue}
        filterOptions={x => x}
        getOptionLabel={option => `${option.name} (${option.version})`}
        onInputChange={handleSearchChange}
        onChange={(_, value) => setSelectedSoftware(value as WinGetSoftwareEntry)}
        renderInput={params => <TextField {...params} variant="outlined" label="Search" fullWidth />}
        renderOption={(props, option) => (
          <li {...props} key={`${option.winget_id}-${option.version}`}>
            <Box>
              <Typography variant="body1">{option.name}</Typography>
              <Typography variant="caption" color="textSecondary">
                {option.winget_id} - v{option.version}
              </Typography>
            </Box>
          </li>
        )}
        sx={{ flexGrow: 1 }}
        freeSolo
      />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton disabled={!selectedSoftware} onClick={handleAddToList} color="primary" size="large">
          <AddCircleOutlineOutlinedIcon />
        </IconButton>
      </Box>
      <Tooltip title={value ? 'Hide' : 'Show'} arrow>
        <IconButton aria-label="toggle visibility" onClick={handleClickToggle} edge="end">
          {value ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </Tooltip>
    </Stack>
  )
}

export default SearchFilterBar
