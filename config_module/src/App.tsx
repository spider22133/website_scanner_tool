import React from 'react';
import './App.css';
import { Switch } from 'react-router-dom';
import { PublicRoute, PrivateRoute } from './helpers/routing.helper';
import { AuthContextProvider } from './contexts/auth.context';

import Header from './components/layout/header.component';
import WebsitesList from './components/websites/websites-list';
import EditWebsite from './components/websites/edit-website.component';
import LogIn from './components/auth/login.component';
import SignUp from './components/auth/signup.component';
import AddWebsite from './components/websites/add-website.component';

import 'bootstrap/dist/css/bootstrap.css';
import { APIErrorProvider } from './contexts/api-error.context';
import { APIErrorNotification } from './components/elements/error-notification.component';

function App() {
  return (
    <AuthContextProvider>
      <APIErrorProvider>
        <Header />
        <Switch>
          <PublicRoute exact path={['/', '/login']} component={LogIn} />
          <PublicRoute exact path={['/signup']} component={SignUp} />
          <PrivateRoute exact path={'/websites'} component={WebsitesList} />
          <PrivateRoute path="/websites/:id" component={EditWebsite} />
          <PrivateRoute exact path="/add-website" component={AddWebsite} />
        </Switch>
        <APIErrorNotification />
      </APIErrorProvider>
    </AuthContextProvider>
  );
}

export default App;
