import './App.css';
import { Switch } from 'react-router-dom';
import { PublicRoute, PrivateRoute } from './helpers/routing.helper';

import Header from './components/layout/header.component';
import WebsitesList from './components/websites/websites-list';
import EditWebsite from './components/websites/edit-website.component';
import LogIn from './components/auth/login.component';
import SignUp from './components/auth/signup.component';
import { createTheme, ThemeProvider } from '@mui/system';

import 'bootstrap/dist/css/bootstrap.css';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Switch>
        <PublicRoute exact path={['/', '/login']} component={LogIn} />
        <PublicRoute exact path={['/signup']} component={SignUp} />
        <PrivateRoute exact path={'/websites'} component={WebsitesList} />
        <PrivateRoute path="/websites/:id" component={EditWebsite} />
      </Switch>
    </ThemeProvider>
  );
}

export default App;
