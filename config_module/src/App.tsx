import React from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import Header from './components/layout/header.component';
import WebsitesList from './components/websites-list';
import WebsitePage from './components/website-page.component';

import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <>
      <Header />
      <div className="container">
        <Switch>
          <Route exact path={['/', '/websites']} component={WebsitesList} />
          <Route path="/websites/:id" component={WebsitePage} />
        </Switch>
      </div>
    </>
  );
}

export default App;
