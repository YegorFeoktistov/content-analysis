import React, { Component } from 'react';
import styles from './Home.module.css';

export class Home extends Component {
  render() {
    return (
      <h1 className={styles.header}>
        Home Page
      </h1>
    );
  }
}
