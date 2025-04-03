import React, { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Autocomplete, Chip, Paper, Stack, TextField, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import SaveIcon from '@mui/icons-material/SaveOutlined'

import { RootState } from '../../../store'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSoftwareRepresentatives, updateSoftware, updateSoftwareRepresentatives } from '../../../slices/software.slice'
import IUser from '../../../interfaces/user.interface'
import { IRepresentative, SoftwareEntry } from '../../../../../types/common'

interface SoftwareSettingsWidgetProps {
  software: SoftwareEntry
}

const validationSchema = Yup.object().shape({
  mainResponsible: Yup.object().nullable().required('Hauptverantwortlicher ist erforderlich'),
  representatives: Yup.array().of(Yup.object()).min(1, 'Mindestens ein Vertreter ist erforderlich'),
})

const SoftwareSettingsWidget: React.FC<SoftwareSettingsWidgetProps> = ({ software }) => {
  const { users } = useSelector((state: RootState) => state.users)
  const { representatives } = useSelector((state: RootState) => state.software)
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<{
    mainResponsible: IUser | null
    mainRepresentatives: IUser[]
  }>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      mainResponsible: null,
      mainRepresentatives: [],
    },
  })

  const mainResponsible = watch('mainResponsible')
  const mainRepresentatives = watch('mainRepresentatives')

  useEffect(() => {
    dispatch(fetchSoftwareRepresentatives(software.winget_id))
  }, [software])

  useEffect(() => {
    const initialResponsible = users.find(user => user.id === software.user_id) || null

    const initialRepresentatives = representatives
      .map(repr => users.find(user => user.email === repr.email))
      .filter((user): user is IUser => user !== undefined) // Filter out undefined values

    reset({
      mainResponsible: initialResponsible,
      mainRepresentatives: initialRepresentatives,
    })
  }, [software, representatives, users, reset])

  const onSubmit: SubmitHandler<{ mainResponsible: IUser | null; mainRepresentatives: IUser[] }> = data => {
    if (!isDirty) return
    const updatedSoftware = {
      version: software.version,
      winget_id: software.winget_id,
      name: software.name,
      user_id: data.mainResponsible?.id,
    }

    dispatch(updateSoftware(updatedSoftware))

    if (mainRepresentatives && mainRepresentatives.length > 0) {
      dispatch(updateSoftwareRepresentatives({ id: software.winget_id, data: mainRepresentatives.map(user => user.id || 0) }))
    }
  }

  return (
    <Paper sx={{ my: 2, p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ width: '100%' }}>
          <Typography variant="h5" fontWeight={600}>
            Einstellungen
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Autocomplete
              options={users}
              getOptionLabel={option => option.email}
              value={mainResponsible}
              onChange={(_, value) => setValue('mainResponsible', value, { shouldDirty: true })}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Hauptverantwortlicher"
                  error={!!errors.mainResponsible}
                  helperText={errors.mainResponsible?.message}
                  variant="filled"
                />
              )}
              sx={{ flexGrow: 1 }}
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Autocomplete
              multiple
              options={users}
              getOptionLabel={option => option.email}
              value={mainRepresentatives}
              onChange={(_, value) => setValue('mainRepresentatives', value, { shouldDirty: true })}
              renderTags={(value: readonly IUser[], getTagProps) =>
                value.map((option, index) => <Chip {...getTagProps({ index })} key={option.id} label={option.email} size="small" />)
              }
              renderInput={params => (
                <TextField
                  {...params}
                  label="Vertreter"
                  error={!!errors.mainRepresentatives?.[0]}
                  variant="filled"
                  helperText={errors.mainRepresentatives?.[0]?.message}
                />
              )}
              sx={{ flexGrow: 1 }}
            />
          </Stack>

          <LoadingButton type="submit" variant="contained" color="primary" endIcon={<SaveIcon />} disabled={!isDirty}>
            Speichern
          </LoadingButton>
        </Stack>
      </form>
    </Paper>
  )
}

export default SoftwareSettingsWidget
