import { Box, IconButton, Stack, TextField, Autocomplete, Typography, InputAdornment } from '@mui/material'
import { createSoftware, queryWinGetSoftware } from '../../store/thunks/software'
import { useState, useMemo } from 'react'
import { RootState, useAppDispatch } from '../../store/store'
import { useSelector } from 'react-redux'
import { SoftwareEntry } from '../../../../types/common'
import { debounce } from 'lodash'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import SearchIcon from '@mui/icons-material/Search'

const AppSearchBar: React.FC = () => {
  const dispatch = useAppDispatch()
  const softwareList = useSelector((state: RootState) => state.software.softwareSearchList || [])

  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selectedSoftware, setSelectedSoftware] = useState<SoftwareEntry | null>(null)

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        if (query.length >= 3) {
          setLoading(true)
          dispatch(queryWinGetSoftware(query)).finally(() => setLoading(false))
        }
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
        loading={loading}
        filterOptions={x => x}
        getOptionLabel={option => `${option.name} (${option.version})`}
        onInputChange={handleSearchChange}
        onChange={(_, value) => setSelectedSoftware(value)}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Geben Sie den Namen der gesuchten Anwendung ein..."
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        )}
        renderOption={(props, option) => {
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
      />

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton title="Neue Anwendung zur Liste hinzufügen" disabled={!selectedSoftware} onClick={handleAddToList} color="primary" size="large">
          <PlaylistAddIcon />
        </IconButton>
      </Box>
    </Stack>
  )
}

export default AppSearchBar
