import React, { useEffect, useRef } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, Chip, Stack, TextField, Typography, Box, Avatar } from '@mui/material'
import SaveIcon from '@mui/icons-material/SaveOutlined'
import { RootState, useAppDispatch } from '../../../store/store'
import { useSelector } from 'react-redux'
import { fetchSoftwareRepresentatives, updateSoftware, updateSoftwareRepresentatives, uploadSoftwareIcon } from '../../../store/thunks/software.thunk'
import IUser from '../../../interfaces/user.interface'
import { SoftwareEntry } from '../../../../../types/common'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

// Define the form data type
interface FormData {
  mainResponsible: IUser | null
  mainRepresentatives: IUser[]
  icon: FileList
}

// Define a Yup schema for IUser
const userSchema = Yup.object().shape({
  id: Yup.number().required(),
  email: Yup.string().required(),
})

// Validation schema with explicit typing
const validationSchema = Yup.object().shape({
  mainResponsible: userSchema.nullable().required('Hauptverantwortlicher ist erforderlich'),
  icon: Yup.mixed()
    .test('fileSize', 'Zu große Datei', (value: any) => {
      if (!value || value.length === 0) return true
      return value[0].size <= 1024 * 1024 * 2 // 2MB limit
    })
    .test('fileType', 'Nur PNG, JPG oder SVG erlaubt', (value: any) => {
      if (!value || value.length === 0) return true
      const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml']
      return allowedTypes.includes(value[0].type)
    }),
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
      icon: undefined,
    },
  })

  const mainResponsible = watch('mainResponsible')
  const mainRepresentatives = watch('mainRepresentatives')
  const iconFiles = watch('icon')

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
    console.log(errors)
    console.log(isDirty, data)

    // if (!isDirty) return

    const updatedSoftware: SoftwareEntry = {
      version: software.version,
      winget_id: software.winget_id,
      name: software.name,
      user_id: data.mainResponsible?.id,
    }

    dispatch(updateSoftware(updatedSoftware))

    if (data.icon?.[0]) {
      const originalExt = data.icon[0].name.split('.').pop()?.toLowerCase()
      const renamedFile = new File([data.icon[0]], `${software.winget_id}.${originalExt}`, {
        type: data.icon[0].type,
      })

      const formData = new FormData()
      formData.append('icon', renamedFile)

      dispatch(
        uploadSoftwareIcon({
          id: updatedSoftware.winget_id,
          formData: formData,
        }),
      )
    }

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
    <Accordion defaultExpanded sx={{ p: 2 }} elevation={0}>
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
                options={users.filter(user => !user.roles?.some(role => role.name === 'admin'))}
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
                options={users.filter(user => !user.roles?.some(role => role.name === 'admin'))}
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
            <Box>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button variant="outlined" component="label" sx={{ textTransform: 'none' }}>
                  {software.icon ? 'Icon ändern' : 'Icon hochladen'}
                  <input
                    hidden
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml" // Specify supported types
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const files = e.target.files
                      if (files?.length) {
                        setValue('icon', files, { shouldDirty: true })
                      }
                    }}
                  />
                </Button>
                {software.icon && <Avatar src={`http://localhost:3001${software.icon}`} alt="Software Icon" sx={{ width: 32, height: 32 }} />}

                {iconFiles?.[0] && (
                  <Box>
                    <Typography variant="body2" noWrap>
                      {iconFiles[0].name}
                    </Typography>
                  </Box>
                )}
                <Box>
                  {errors.icon && (
                    <Typography variant="caption" color="error">
                      {errors.icon.message}
                    </Typography>
                  )}
                </Box>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Unterstützte Formate: PNG, JPG, SVG (max. 2 MB)
              </Typography>
            </Box>
            <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />} disabled={!isDirty} sx={{ height: 40, width: 200 }}>
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
