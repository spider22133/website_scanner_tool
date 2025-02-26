import { Box, IconButton, InputAdornment, Stack, TextField, Tooltip, Autocomplete, Typography } from '@mui/material'
import { createSoftware, queryWinGetSoftware } from '../../slices/websites.slice'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined'
import Visibility from '@mui/icons-material/VisibilityOutlined'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import React, { useState, useMemo, useEffect } from 'react'
import { RootState, useAppDispatch } from '../../store'
import { useSelector } from 'react-redux'
import { WinGetSoftwareEntry } from '../../interfaces/website.interface'
import { debounce } from 'lodash'

type Props = {
  value: boolean
  handleClickToggle?: () => void
}

const SearchFilterBar: React.FC<Props> = ({ handleClickToggle, value }) => {
  const dispatch = useAppDispatch()
  const softwareList = useSelector((state: RootState) => state.websites.softwareList || []) // Fallback to empty array
  const [inputValue, setInputValue] = useState('')
  const [selectedSoftware, setSelectedSoftware] = useState<WinGetSoftwareEntry | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (softwareList.length > 0) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [softwareList])

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        if (query.length >= 3) {
          dispatch(queryWinGetSoftware(query))
        }
      }, 300),
    [dispatch],
  )

  const handleSearchChange = (_event: React.SyntheticEvent, value: string, reason: string) => {
    setInputValue(value) // Always update inputValue, whether typing or selecting
    if (reason === 'input') {
      // Only dispatch on typing, not selection
      debouncedSearch(value)
    }
  }

  const handleOptionSelect = (_event: React.SyntheticEvent, value: WinGetSoftwareEntry | null) => {
    setSelectedSoftware(value)
    setOpen(false)
  }

  const handleAddToList = () => {
    if (selectedSoftware) {
      dispatch(createSoftware(selectedSoftware))
      setSelectedSoftware(null)
      setInputValue('') // Clear input after adding, adjust if you want to keep it
      setOpen(false)
    }
  }

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
      <Autocomplete
        open={open}
        options={softwareList}
        inputValue={inputValue}
        filterOptions={x => x} // Disable client-side filtering
        getOptionLabel={option => `${option.name} (${option.version})`}
        onInputChange={handleSearchChange}
        onChange={handleOptionSelect}
        onOpen={() => {
          if (inputValue.length >= 3 && softwareList.length > 0) setOpen(true)
        }}
        onClose={() => setOpen(false)}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Search"
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
          console.log('Rendering option:', option)
          return (
            <li {...props} key={option.id}>
              <Box>
                <Typography variant="body1">{option.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {option.id} - v{option.version}
                </Typography>
              </Box>
            </li>
          )
        }}
        sx={{ flexGrow: 1 }}
        disablePortal
      />
      <Box alignItems="center" justifyContent="center" sx={{ display: 'flex', height: '100%' }}>
        <IconButton disabled={!selectedSoftware} onClick={handleAddToList} color="primary" size="large" title="Add to List">
          <AddCircleOutlineOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ ml: '0 !important' }}>
        <Tooltip title={value ? 'Hide' : 'Show'} arrow>
          <IconButton aria-label="toggle visibility" onClick={handleClickToggle} edge="end" sx={{ mr: 1 }}>
            {value ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Tooltip>
      </Box>
    </Stack>
  )
}

export default SearchFilterBar
