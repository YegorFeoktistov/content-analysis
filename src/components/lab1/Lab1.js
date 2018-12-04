import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import styles from './Lab1.module.css';

export class Lab1 extends Component {
  render() {
    return (
      <React.Fragment>
        <h1 className={styles.header}>Q-sorting</h1>
        <div className={styles.mainBlock}>
          <div className={styles.left}>
            <div className={styles.inputRow}>
              <TextField
                multiline
                required
                error={false}
                id="lab1-textarea"
                label="Source text"
                rows="8"
                placeholder="Enter source text here"
                defaultValue=""
                className={styles.textarea}
                margin="normal"
              />
              <div className={styles.parameters}>
                <p className={styles.paramDescr}>
                  Enter search value here.<br />Each time you type a new value, previous will be saved.
                </p>
                <p className={styles.paramError}>
                  You've already searched this value!
                </p>
                <TextField
                  required
                  error={false} // depend on error
                  id="lab1-params-input"
                  label="Search values"
                  defaultValue=""
                  placeholder="Enter search values here"
                  className={styles.textField}
                  margin="normal"
                />
              </div>
            </div>
          </div>
          <div className={styles.stats}>
            <h2 className={styles.statsHeader}>
              Search values stats
            </h2>
            <div className={styles.statsList}>
              stats
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
