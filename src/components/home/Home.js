import React, { Component } from 'react';
import styles from './Home.module.css';

export class Home extends Component {
  render() {
    return (
      <div className={styles.content}>
        <h1 className={styles.header}>
          Content Analysis
        </h1>
        <h2 className={styles.header2}>
          by Feoktistov Yegor
        </h2>
        <h2 className={styles.header2}>
          BRU,  masters course
        </h2>
      </div>
    );
  }
}
