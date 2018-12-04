import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route } from 'react-router';

import { Home } from './components';

class App extends Component {
  render() {
    return (
      <div className='App'>
        <div className='sidebar'>
          Lab1
        </div>
        <div className='main'>
          <header className='App-header'>
            <img src={logo} className='App-logo' alt='logo' />
          </header>
          <div className='content'>
            <Router>
              <Switch>
                <Route exact path="/" component={Home} />
              </Switch>
            </Router>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
