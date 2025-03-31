import { Box, IconButton, Stack, TextField, Tooltip, InputAdornment } from '@mui/material'
import { useState, ChangeEvent, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { updateSoftwareFilteredList } from '../../slices/software.slice'
import { SoftwareEntry } from '../../../../types/common'
import { RootState, useAppDispatch } from '../../store'
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined'
import Visibility from '@mui/icons-material/VisibilityOutlined'
import FilterListIcon from '@mui/icons-material/FilterList'

// Define filter state interface
interface FilterState {
  searchTerm: string
  showHidden: boolean
}

const AppFilterBar: React.FC = () => {
  const dispatch = useAppDispatch()
  const allSoftwareEntries = useSelector((state: RootState) => state.software.software ?? [])
  const [filterState, setFilterState] = useState<FilterState>({
    searchTerm: '',
    showHidden: false,
  })

  const updateFilteredSoftwareList = (filteredSoftware: SoftwareEntry[]) => {
    dispatch(updateSoftwareFilteredList(filteredSoftware))
  }

  const getFilteredSoftwareList = (filter: FilterState): SoftwareEntry[] => {
    return allSoftwareEntries.filter(software => {
      const matchesName = software.name.toLowerCase().includes(filter.searchTerm.toLowerCase())
      const matchesVisibility = software.is_hidden === filter.showHidden
      return matchesName && matchesVisibility
    })
  }

  const updateFilterState = (updates: Partial<FilterState>) => {
    setFilterState(prevState => {
      const newFilterState = { ...prevState, ...updates }
      updateFilteredSoftwareList(getFilteredSoftwareList(newFilterState))
      return newFilterState
    })
  }

  const handleSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateFilterState({ searchTerm: event.target.value })
  }

  const toggleVisibilityFilter = () => {
    updateFilterState({ showHidden: !filterState.showHidden })
  }

  useEffect(() => {
    updateFilteredSoftwareList(getFilteredSoftwareList(filterState))
  }, [])

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ width: '100%' }}>
      <TextField
        placeholder="Nach Namen filtern..."
        variant="outlined"
        value={filterState.searchTerm}
        onChange={handleSearchTermChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FilterListIcon />
            </InputAdornment>
          ),
        }}
        size="small"
        fullWidth
        aria-label="Software filter input"
      />
      <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
        <Tooltip title={filterState.showHidden ? 'Ausblenden' : 'Anzeigen'} arrow>
          <IconButton aria-label="Toggle hidden software visibility" onClick={toggleVisibilityFilter} edge="end">
            {filterState.showHidden ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Tooltip>
      </Box>
    </Stack>
  )
}

export default AppFilterBar
