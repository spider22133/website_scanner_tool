import React from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import Header from './components/layout/header.component';
import WebsitesList from './components/websites/websites-list';
import WebsitePage from './components/websites/website-page.component';
import LogIn from './components/login.component';

import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <>
      <Header />

      <Switch>
        <Route exact path={['/', '/login']} component={LogIn} />
        <Route exact path={'/websites'} component={WebsitesList} />
        <Route path="/websites/:id" component={WebsitePage} />
      </Switch>
    </>
  );
}

export default App;
