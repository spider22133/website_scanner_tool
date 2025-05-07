import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../../store/slices/auth.slice'
import { RootState, useAppDispatch } from '../../store/store'

import { AppBar, Toolbar, Typography, IconButton, Button, Box, Collapse, Stack, Container } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

export default function Header() {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth)
  const [open, setOpen] = useState(false)
  const dispatch = useAppDispatch()

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth={false}>
        <Toolbar
          disableGutters
          sx={{
            py: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link to="/dashboard">
            <img src="/logo1.png" alt="logo" width="100%" height="50" />
            {/* <img src="/logo.jpg" alt="logo" width="50" height="50" /> */}
          </Link>

          <IconButton edge="end" color="inherit" aria-label="menu" onClick={() => setOpen(prev => !prev)} sx={{ display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            {isLoggedIn ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body1">
                  Hallo, {user?.firstName} {user?.lastName}
                </Typography>
                <Button variant="outlined" color="error" size="small" onClick={() => dispatch(logout())}>
                  Abmelden
                </Button>
              </Stack>
            ) : (
              <Button variant="outlined" color="success" component={Link} to="/login">
                Anmelden
              </Button>
            )}
          </Box>
        </Toolbar>

        {/* Mobile menu */}
        <Collapse in={open} timeout="auto" unmountOnExit sx={{ display: { md: 'none' } }}>
          <Box px={2} pb={2}>
            {isLoggedIn ? (
              <Stack spacing={1}>
                <Typography variant="body1">
                  Hallo, {user?.firstName} {user?.lastName}
                </Typography>
                <Button variant="outlined" color="error" fullWidth onClick={() => dispatch(logout())}>
                  Abmelden
                </Button>
              </Stack>
            ) : (
              <Button variant="outlined" color="success" fullWidth component={Link} to="/login">
                Anmelden
              </Button>
            )}
          </Box>
        </Collapse>
      </Container>
    </AppBar>
  )
}
