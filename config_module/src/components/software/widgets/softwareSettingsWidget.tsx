import React, { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, Chip, Stack, TextField, Typography, Box, Avatar } from '@mui/material'
import SaveIcon from '@mui/icons-material/SaveOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { RootState, useAppDispatch } from '../../../store/store'
import { useSelector } from 'react-redux'
import { fetchSoftwareUsers, updateSoftwareUsers, uploadSoftwareIcon } from '../../../store/thunks/software.thunk'
import IUser from '../../../interfaces/user.interface'
import { SoftwareEntry } from '../../../../../types/common'
import { isAdminUser } from '../../utilities/isAdminUser'

interface FormData {
  mainResponsible: IUser | null
  mainRepresentatives: IUser[]
  icon: FileList
}

const userSchema = Yup.object().shape({
  id: Yup.number().required(),
  email: Yup.string().required(),
})

const validationSchema = Yup.object().shape({
  mainResponsible: userSchema.nullable().required('Hauptverantwortlicher ist erforderlich'),
  mainRepresentatives: Yup.array().of(userSchema).nullable(),
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
  const { softwareUsers } = useSelector((state: RootState) => state.software)
  const dispatch = useAppDispatch()

  const {
    handleSubmit,
    setValue,
    getValues,
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
  const iconFiles = getValues('icon')

  useEffect(() => {
    dispatch(fetchSoftwareUsers(software.id))
    software.icon && resetIcon()
  }, [software, dispatch])

  useEffect(() => {
    resetIcon()
  }, [softwareUsers, users, software, reset])

  const resetIcon = () => {
    const responsible = softwareUsers.find(user => user.userSettings.isPrimaryResponsible) || null
    const representatives = softwareUsers.filter(repr => repr.userSettings.isRepresentative)

    const initialResponsible = users.find(user => user.id === responsible?.id) || null
    const initialRepresentatives = users.filter(user => representatives.find(repr => user.id === repr.id))

    reset({
      mainResponsible: initialResponsible,
      mainRepresentatives: initialRepresentatives,
      icon: undefined,
    })
  }

  const onSubmit: SubmitHandler<FormData> = data => {
    const { mainResponsible, mainRepresentatives, icon } = data

    // Construct final user list from softwareUsers
    const updatedUsers = users
      .filter(user => !isAdminUser(user.roles))
      .map(user => {
        const existing = softwareUsers.find(su => su.id === user.id)
        return {
          userId: user.id,
          ...existing?.userSettings,
          isPrimaryResponsible: user.id === mainResponsible?.id,
          isRepresentative: mainRepresentatives.some(rep => rep.id === user.id),
        }
      })

    dispatch(
      updateSoftwareUsers({
        id: software.id,
        data: updatedUsers,
      }),
    )

    // Upload icon if changed
    if (icon?.[0]) {
      const file = icon[0]
      const ext = file.name.split('.').pop()?.toLowerCase()
      const renamedFile = new File([file], `${software.winget_id}.${ext}`, { type: file.type })

      const formData = new FormData()
      formData.append('icon', renamedFile)

      dispatch(
        uploadSoftwareIcon({
          id: software.id,
          formData,
        }),
      )

      resetIcon()
    }
  }

  // Filter non-admin users
  const nonAdminUsers = users.filter(user => !isAdminUser(user?.roles))

  // Options for mainResponsible: exclude users in mainRepresentatives
  const responsibleOptions = nonAdminUsers

  // Options for mainRepresentatives: exclude mainResponsible
  const representativeOptions = nonAdminUsers.filter(user => !mainResponsible || mainResponsible.id !== user.id)

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
            {/* Hauptverantwortlicher */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Autocomplete
                options={responsibleOptions}
                getOptionLabel={option => option.email}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={mainResponsible}
                onChange={(_, value) => {
                  setValue('mainResponsible', value, { shouldDirty: true })
                  if (value) {
                    const updatedRepresentatives = mainRepresentatives.filter(rep => rep.id !== value.id)
                    setValue('mainRepresentatives', updatedRepresentatives, { shouldDirty: true })
                  }
                }}
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

            {/* Vertreter */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Autocomplete
                multiple
                options={representativeOptions}
                getOptionLabel={option => option.email}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={mainRepresentatives}
                onChange={(_, value) => {
                  setValue('mainRepresentatives', value, { shouldDirty: true })
                }}
                renderTags={(value: readonly IUser[], getTagProps) =>
                  value.map((option, index) => <Chip {...getTagProps({ index })} key={option.id} label={option.email} size="small" />)
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Vertreter"
                    error={!!errors.mainRepresentatives?.[0]}
                    helperText={errors.mainRepresentatives?.[0]?.message}
                    variant="filled"
                  />
                )}
                sx={{ flexGrow: 1 }}
              />
            </Stack>

            {/* Icon Upload */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button variant="outlined" component="label" sx={{ textTransform: 'none' }}>
                  {software.icon ? 'Icon ändern' : 'Icon hochladen'}
                  <input
                    hidden
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    onClick={e => {
                      ;(e.target as HTMLInputElement).value = ''
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const files = e.target.files
                      if (files?.length) {
                        setValue('icon', files, { shouldDirty: true })
                      }
                    }}
                  />
                </Button>
                {software.icon && !iconFiles?.[0] && (
                  <Avatar src={`http://localhost:3001${software.icon}?v=${Date.now()}`} alt="Software Icon" sx={{ width: 32, height: 32 }} />
                )}
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
