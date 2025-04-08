import React, { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, Chip, Stack, TextField, Typography } from '@mui/material'
import SaveIcon from '@mui/icons-material/SaveOutlined'
import { RootState, useAppDispatch } from '../../../store'
import { useSelector } from 'react-redux'
import { fetchSoftwareRepresentatives, updateSoftware, updateSoftwareRepresentatives } from '../../../slices/software.slice'
import IUser from '../../../interfaces/user.interface'
import { SoftwareEntry } from '../../../../../types/common'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

// Define the form data type
interface FormData {
  mainResponsible: IUser | null
  mainRepresentatives: IUser[]
}

// Define a Yup schema for IUser
const userSchema = Yup.object().shape({
  id: Yup.number().required(),
  email: Yup.string().required(),
  password: Yup.string().required(),
})

// Validation schema with explicit typing
const validationSchema = Yup.object().shape({
  mainResponsible: userSchema.nullable().required('Hauptverantwortlicher ist erforderlich'),
  mainRepresentatives: Yup.array().of(userSchema).min(1, 'Mindestens ein Vertreter ist erforderlich'),
}) as Yup.ObjectSchema<FormData>

const SoftwareSettingsWidget: React.FC<SoftwareSettingsWidgetProps> = ({ software }) => {
  const { users } = useSelector((state: RootState) => state.users)
  const { representatives } = useSelector((state: RootState) => state.software)
  const dispatch = useAppDispatch()

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormData>({
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
  }, [software, dispatch])

  useEffect(() => {
    const initialResponsible = users.find(user => user.id === software.user_id) || null

    const initialRepresentatives = representatives
      .map(repr => users.find(user => user.email === repr.email))
      .filter((user): user is IUser => user !== undefined)

    reset({
      mainResponsible: initialResponsible,
      mainRepresentatives: initialRepresentatives,
    })
  }, [software, representatives, users, reset])

  const onSubmit: SubmitHandler<FormData> = data => {
    if (!isDirty) return
    const updatedSoftware = {
      version: software.version,
      winget_id: software.winget_id,
      name: software.name,
      user_id: data.mainResponsible?.id,
    }

    dispatch(updateSoftware(updatedSoftware))

    if (mainRepresentatives && mainRepresentatives.length > 0) {
      dispatch(
        updateSoftwareRepresentatives({
          id: software.winget_id,
          data: mainRepresentatives.map(user => user.id || 0),
        }),
      )
    }
  }

  return (
    <Accordion defaultExpanded sx={{ p: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5" fontWeight={600}>
          Einstellungen
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} sx={{ width: '100%' }}>
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

            <Button type="submit" variant="contained" color="primary" endIcon={<SaveIcon />} disabled={!isDirty}>
              Speichern
            </Button>
          </Stack>
        </form>
      </AccordionDetails>
    </Accordion>
  )
}

interface SoftwareSettingsWidgetProps {
  software: SoftwareEntry
}

export default SoftwareSettingsWidget
