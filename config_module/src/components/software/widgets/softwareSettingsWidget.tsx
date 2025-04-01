import React, { useEffect, useState } from 'react'
import { SoftwareEntry } from '../../../../../types/common'
import { Autocomplete, Chip, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/EditOutlined'
import SaveIcon from '@mui/icons-material/SaveOutlined'
import { RootState } from '../../../store'
import { useSelector, useDispatch } from 'react-redux'
import { updateSoftware } from '../../../slices/software.slice'
import IUser from '../../../interfaces/user.interface'

interface SoftwareSettingsWidgetProps {
  software: SoftwareEntry
}

const SoftwareSettingsWidget: React.FC<SoftwareSettingsWidgetProps> = ({ software }) => {
  const { winget_id, version, name } = software
  const { users } = useSelector((state: RootState) => state.users)
  const dispatch = useDispatch()

  const [isMainResponsibleEditable, setMainResponsibleEditable] = useState(false)
  const [isRepresentativeEditable, setRepresentativeEditable] = useState(false)
  const [selectedMainResponsible, setSelectedMainResponsible] = useState<IUser | null>(null)
  const [selectedRepresentatives, setSelectedRepresentatives] = useState<IUser[]>([])

  const toggleMainResponsibleEdit = () => {
    if (isMainResponsibleEditable && selectedMainResponsible) {
      // Check if the selected value differs from the current one
      if (selectedMainResponsible.id !== software.user_id) {
        dispatch(updateSoftware({ winget_id, name, version, user_id: selectedMainResponsible.id }))
      }
    }
    setMainResponsibleEditable(!isMainResponsibleEditable)
  }

  const toggleRepresentativeEdit = () => {
    if (isRepresentativeEditable && selectedRepresentatives.length > 0) {
      // Create an array of selected representative IDs
      const selectedIds = selectedRepresentatives.map(rep => rep.id)
      // Check if the selected IDs differ from the stored software representatives
      // if (JSON.stringify(selectedIds) !== JSON.stringify(software.representative_ids)) {
      //   dispatch(updateSoftware({ ...software, representative_ids: selectedIds }))
      // }
    }
    setRepresentativeEditable(!isRepresentativeEditable)
  }

  useEffect(() => {
    setSelectedMainResponsible(users.find(item => item.id === software.user_id) || null)
    // setSelectedRepresentatives(users.filter(user => software.representative_ids?.includes(user.id)))
  }, [software, users])

  return (
    <Paper sx={{ my: 2, p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack spacing={3} sx={{ width: '100%' }}>
        <Typography variant="h5" fontWeight={600}>
          Einstellungen
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Autocomplete
            options={users}
            getOptionLabel={option => option.email}
            value={selectedMainResponsible}
            onChange={(event, value) => setSelectedMainResponsible(value)}
            renderInput={params => <TextField {...params} variant="filled" label="Hauptverantwortlicher" />}
            sx={{ flexGrow: 1 }}
            readOnly={!isMainResponsibleEditable}
          />
          <IconButton onClick={toggleMainResponsibleEdit} color={isMainResponsibleEditable ? 'primary' : 'default'} size="large">
            {isMainResponsibleEditable ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Autocomplete
            multiple
            options={users}
            getOptionLabel={option => option.email}
            value={selectedRepresentatives}
            onChange={(event, value) => setSelectedRepresentatives(value)}
            renderTags={(value: readonly IUser[], getTagProps) =>
              value.map((option: IUser, index: number) => <Chip variant="outlined" size="small" label={option.email} {...getTagProps({ index })} />)
            }
            renderInput={params => <TextField {...params} variant="filled" label="Vertreter" />}
            sx={{ flexGrow: 1 }}
            readOnly={!isRepresentativeEditable}
          />
          <IconButton onClick={toggleRepresentativeEdit} color={isRepresentativeEditable ? 'primary' : 'default'} size="large">
            {isRepresentativeEditable ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default SoftwareSettingsWidget
