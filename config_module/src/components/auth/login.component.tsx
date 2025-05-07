import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import IUser from '../../interfaces/user.interface'
import { RootState, useAppDispatch } from '../../store/store'
import { login } from '../../store/slices/auth.slice'
import { useSelector } from 'react-redux'
import { APIErrorNotification } from '../elements/error-notification.component'
import { Button, TextField, Box, Container, Paper, Typography } from '@mui/material'

const validationSchema = Yup.object().shape({
  email: Yup.string().required('E-Mail oder Benutzername ist erforderlich'),
  password: Yup.string()
    .required('Passwort ist erforderlich')
    .min(6, 'Passwort muss mindestens 6 Zeichen lang sein')
    .max(40, 'Passwort darf 40 Zeichen nicht überschreiten'),
})

export default function LogIn() {
  const { loading } = useSelector((state: RootState) => state.auth)
  const messages = useSelector((state: RootState) => state.messages)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>({
    resolver: yupResolver(validationSchema),
  })

  const onSubmit: SubmitHandler<IUser> = data => {
    dispatch(login({ data, id: 'login' })).then(response => login.fulfilled.match(response) && navigate('/dashboard'))
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#508bfc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: '1rem',
            backgroundColor: '#fff',
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Anmeldung
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mb: 3, pt: 1 }}>
              <TextField
                fullWidth
                label="E-Mail oder Benutzername eingeben"
                variant="filled"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email')}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Passwort eingeben"
                type="password"
                variant="filled"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password')}
              />
            </Box>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ my: 2, boxShadow: 2 }}>
              {loading ? 'Wird geladen...' : 'Anmelden'}
            </Button>
          </form>
          <APIErrorNotification messages={messages} websiteId="login" />
        </Paper>
      </Container>
    </Box>
  )
}
