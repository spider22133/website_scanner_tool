import './App.css';
import { Switch } from 'react-router-dom';
import { PublicRoute, PrivateRoute } from './helpers/routing.helper';

import Header from './components/layout/header.component';
import LogIn from './components/auth/login.component';
import SignUp from './components/auth/signup.component';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import 'bootstrap/dist/css/bootstrap.css';
import DashboardComponent from './components/dashboard.component';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Switch>
        <PublicRoute exact path={['/', '/login']} component={LogIn} />
        <PublicRoute exact path={['/signup']} component={SignUp} />
        <PrivateRoute exact path={'/dashboard'} component={DashboardComponent} />
      </Switch>
    </ThemeProvider>
  );
}

export default App;
