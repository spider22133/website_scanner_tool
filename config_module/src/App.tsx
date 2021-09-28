import React from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import { PublicRoute, PrivateRoute } from './helpers/routing.helper';
import { AuthContextProvider } from './contexts/auth.context';
import Header from './components/layout/header.component';
import WebsitesList from './components/websites/websites-list';
import WebsitePage from './components/websites/website-edit.component';
import LogIn from './components/auth/login.component';
import 'bootstrap/dist/css/bootstrap.css';
import SignUp from './components/auth/signup.component';

function App() {
  return (
    <AuthContextProvider>
      <Header />
      <Switch>
        <PublicRoute exact path={['/', '/login']} component={LogIn} />
        <PublicRoute exact path={['/signup']} component={SignUp} />
        <PrivateRoute exact path={'/websites'} component={WebsitesList} />
        <PrivateRoute path="/websites/:id" component={WebsitePage} />
      </Switch>
    </AuthContextProvider>
  );
}

export default App;
