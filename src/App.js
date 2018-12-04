import React, { Component } from 'react';
import logo from './logo.svg';

import styles from './App.module.css';
import './fonts.css'

import { BrowserRouter as Router, Link } from "react-router-dom";
import { Switch, Route } from 'react-router';

import {
  Home,
  Lab1
} from './components';

class App extends Component {
  render() {
    return (
      <Router>
        <div className={styles['App']}>
          <header className={styles['App-header']}>
            <img src={logo} className={styles['App-logo']} alt='logo' />
          </header>
          <div className={styles.appWrap}>
            <div className={styles.sidebar}>
              <h1 className={styles.navHeader} >Links to works</h1>
              <ul className={styles.navList}>
                <li className={styles.navItem}>
                  <Link to="/" className={styles.navLink} >Home</Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="lab1" className={styles.navLink} >Lab 1</Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="lab2" className={styles.navLink} >Lab 2</Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="lab3" className={styles.navLink} >Lab 3</Link>
                </li>
              </ul>
            </div>
            <div className={styles.main}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/lab1" component={Lab1} />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
