import { Box, IconButton, Stack, TextField, Tooltip, InputAdornment, Autocomplete } from '@mui/material'
import { useState, ChangeEvent, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { updateSoftwareFilteredList } from '../../store/slices/software.slice'
import { SoftwareEntry } from '../../../../types/common'
import { RootState, useAppDispatch } from '../../store/store'
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined'
import Visibility from '@mui/icons-material/VisibilityOutlined'
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined'
import ClearIcon from '@mui/icons-material/Clear'
import IUser from '../../interfaces/user.interface'

interface FilterState {
  searchTerm: string
  showHidden: boolean
  status: string
  responsible: IUser | string
}

const optionLabelMap: Record<string, string> = {
  all: 'Alle',
  none: 'Keinem zugewiesen',
}

const AppFilterBar: React.FC = () => {
  const dispatch = useAppDispatch()
  const allSoftwareEntries = useSelector((state: RootState) => state.software.software)
  const { users } = useSelector((state: RootState) => state.users)
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false)
  const [filterState, setFilterState] = useState<FilterState>({
    searchTerm: '',
    showHidden: false,
    status: 'all',
    responsible: 'all',
  })

  const updateFilteredSoftwareList = (filteredSoftware: SoftwareEntry[]) => {
    dispatch(updateSoftwareFilteredList(filteredSoftware))
  }

  const getFilteredSoftwareList = (filter: FilterState): SoftwareEntry[] => {
    return allSoftwareEntries.filter(software => {
      const matchesName = software.name.toLowerCase().includes(filter.searchTerm.toLowerCase())
      const matchesVisibility = software.is_hidden === filter.showHidden
      const matchesStatus =
        filter.status === 'all' ||
        (filter.status === 'Aktuell' && software.is_current && software.bara_version !== null) ||
        (filter.status === 'Nicht Aktuell' && !software.is_current && !(software.bara_version === null || software.bara_version === undefined)) ||
        (filter.status === 'Fehlgeschlagen' && (software.bara_version === null || software.bara_version === undefined)) ||
        (filter.status === 'EPM Team' && software.is_central_managed) ||
        (filter.status === 'Nicht EPM Team' && !software.is_central_managed)

      const matchesResponsible =
        filter.responsible === 'all' ||
        (filter.responsible === 'none' && software.user_id === null) ||
        (typeof filter.responsible !== 'string' && software.user_id === filter.responsible.id)

      return matchesName && matchesVisibility && matchesStatus && matchesResponsible
    })
  }

  const updateFilterState = (updates: Partial<FilterState>) => {
    setFilterState(prevState => {
      const newFilterState = { ...prevState, ...updates }
      updateFilteredSoftwareList(getFilteredSoftwareList(newFilterState))
      return newFilterState
    })
  }

  const toggleVisibilityFilter = () => {
    updateFilterState({ showHidden: !filterState.showHidden })
  }

  const handleSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateFilterState({ searchTerm: event.target.value })
  }

  const handleStatusChange = (_event: ChangeEvent<object>, value: string | null) => {
    updateFilterState({ status: value || 'all' })
  }

  const handleResponsibleChange = (_event: ChangeEvent<object>, value: IUser | string | null) => {
    updateFilterState({ responsible: value || 'all' })
  }

  useEffect(() => {
    const savedFilterState = sessionStorage.getItem('filters')
    if (savedFilterState) {
      setFilterState(JSON.parse(savedFilterState))
    }
    setHasLoadedStorage(true)
  }, [])

  useEffect(() => {
    if (hasLoadedStorage) {
      sessionStorage.setItem('filters', JSON.stringify(filterState))
      updateFilteredSoftwareList(getFilteredSoftwareList(filterState))
    }
  }, [filterState, hasLoadedStorage])

  useEffect(() => {
    if (hasLoadedStorage) {
      updateFilteredSoftwareList(getFilteredSoftwareList(filterState))
    }
  }, [allSoftwareEntries, hasLoadedStorage])

  const staticOptions = ['all', 'none'] as const
  const responsibleOptions = [...staticOptions, ...users.filter(user => !user.roles?.some(role => role.name === 'admin'))]

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={2} sx={{ width: '100%' }}>
      <TextField
        label="Name"
        placeholder="Nach Namen filtern..."
        value={filterState.searchTerm}
        onChange={handleSearchTermChange}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <DriveFileRenameOutlineOutlinedIcon />
              </InputAdornment>
            ),
            endAdornment: filterState.searchTerm ? (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => updateFilterState({ searchTerm: '' })}>
                  <ClearIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </InputAdornment>
            ) : (
              <></>
            ),
          },
        }}
        size="small"
        fullWidth
        aria-label="Software filter input"
      />
      <Stack direction="row" alignItems="center" spacing={2}>
        <Autocomplete
          options={['all', 'Aktuell', 'Nicht Aktuell', 'Fehlgeschlagen', 'EPM Team', 'Nicht EPM Team']}
          value={filterState.status}
          getOptionLabel={option => optionLabelMap[option] || option}
          onChange={handleStatusChange}
          renderInput={params => <TextField {...params} label="Status" size="small" />}
          disableClearable
          sx={{ minWidth: 180 }}
        />
        <Autocomplete
          options={responsibleOptions}
          value={
            responsibleOptions.find(option =>
              typeof option === 'string' ? option === filterState.responsible : option.id === (filterState.responsible as IUser)?.id,
            ) || 'none'
          }
          getOptionLabel={option => optionLabelMap[option as string] || (option as IUser).email}
          onChange={handleResponsibleChange}
          renderInput={params => <TextField {...params} label="Hauptverantwortlicher" size="small" />}
          disableClearable
          sx={{ minWidth: 220 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={filterState.showHidden ? 'Ausblenden' : 'Anzeigen'}>
            <IconButton onClick={toggleVisibilityFilter}>{filterState.showHidden ? <VisibilityOff /> : <Visibility />}</IconButton>
          </Tooltip>
        </Box>
      </Stack>
    </Stack>
  )
}

export default AppFilterBar
