import React from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import { PublicRoute, PrivateRoute } from './helpers/routing.helper';
import { AuthContextProvider } from './contexts/auth.context';

import Header from './components/layout/header.component';
import WebsitesList from './components/websites/websites-list';
import EditWebsite from './components/websites/edit-website.component';
import LogIn from './components/auth/login.component';
import SignUp from './components/auth/signup.component';
import AddWebsite from './components/websites/add-website.component';

import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <AuthContextProvider>
      <Header />
      <Switch>
        <PublicRoute exact path={['/', '/login']} component={LogIn} />
        <PublicRoute exact path={['/signup']} component={SignUp} />
        <PrivateRoute exact path={'/websites'} component={WebsitesList} />
        <PrivateRoute path="/websites/:id" component={EditWebsite} />
        <PrivateRoute exact path="/add-website" component={AddWebsite} />
      </Switch>
    </AuthContextProvider>
  );
}

export default App;
