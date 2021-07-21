import React from 'react';
import './App.css';
import { Switch, Route } from "react-router-dom";
import Header from "./components/layout/header.component";
import WebsitesList from "./components/websites-list";

import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <>
      <Header />
      <div className="container-fluid">
        <Switch>
          <Route exact path={["/","/websites"]} component={WebsitesList} />
          {/* <Route exact path="" component=""/>
          <Route exact path="" component=""/> */}
        </Switch>
      </div>
    </>
  );
}

export default App;
