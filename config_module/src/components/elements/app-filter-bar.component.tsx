import { Box, IconButton, Stack, TextField, Tooltip, InputAdornment, Autocomplete } from '@mui/material'
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
  status: string // 'Alle', 'Aktuell', 'Nicht aktuell'
}

const AppFilterBar: React.FC = () => {
  const dispatch = useAppDispatch()
  const allSoftwareEntries = useSelector((state: RootState) => state.software.software ?? [])
  const [filterState, setFilterState] = useState<FilterState>({
    searchTerm: '',
    showHidden: false,
    status: 'Alle',
  })

  const updateFilteredSoftwareList = (filteredSoftware: SoftwareEntry[]) => {
    dispatch(updateSoftwareFilteredList(filteredSoftware))
  }

  const getFilteredSoftwareList = (filter: FilterState): SoftwareEntry[] => {
    return allSoftwareEntries.filter(software => {
      const matchesName = software.name.toLowerCase().includes(filter.searchTerm.toLowerCase())
      const matchesVisibility = software.is_hidden === filter.showHidden
      const matchesStatus =
        filter.status === 'Alle' || (filter.status === 'Aktuell' && software.is_current) || (filter.status === 'Ungültig' && !software.is_current)

      return matchesName && matchesVisibility && matchesStatus
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

  const handleStatusChange = (event: ChangeEvent<{}>, value: string | null) => {
    updateFilterState({ status: value || 'Alle' })
  }

  useEffect(() => {
    updateFilteredSoftwareList(getFilteredSoftwareList(filterState))
  }, [])

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ width: '100%' }}>
      <TextField
        label="Name"
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
      <Autocomplete
        options={['Alle', 'Aktuell', 'Ungültig']}
        value={filterState.status}
        onChange={handleStatusChange}
        renderInput={params => <TextField {...params} label="Gültigkeit" variant="outlined" size="small" />}
        sx={{ minWidth: 180 }}
        aria-label="Status filter"
        disableClearable
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
