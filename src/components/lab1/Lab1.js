import React, { Component } from 'react';
import { compact, indexOf } from 'lodash';
import TextField from '@material-ui/core/TextField';
import styles from './Lab1.module.css';

import WebWorker from '../../webWorker';
import countInTextWorker from './../../workers/countInTextWorker.js';

export class Lab1 extends Component {
  state = {
    text: '',
    wordsNumber: 0,
    paramText: '',
    params: [],
    stats: [],
    paramAlreadyExistsError: false
  }

  countWords = txt => txt
    .trim()
    .split(' ')
    .filter(item => item !== '')
    .length;

  textareaChangeHanlder = e =>
    this.setState({ text: e.target.value });

  textareaBlurHandler = e =>
    this.setState({ wordsNumber: this.countWords(e.target.value) });

  paramChangeHandler = e =>
    this.setState({ paramText: e.target.value });

  paramSubmitHandler = e => {
    if (e.key !== 'Enter') {
      return;
    }

    const { params, paramText } = this.state;

    const isUniq = indexOf(params, paramText) === -1;

    (isUniq && paramText) && this.processParam(paramText);

    this.setState({
      paramText: '',
      paramAlreadyExistsError: !isUniq,
      params: isUniq ? compact([...params, paramText]) : params
    });
  };

  processParam = param => {
    const { text, wordsNumber, stats } = this.state;
    const regexp = new RegExp(`\\b(${param})\\b`, 'g');

    this.worker = new WebWorker(countInTextWorker);

    this.worker.onmessage = e => {
      const count = e.data;

      const percent = count
        ? `${Math.round((count / wordsNumber) * 10000) / 100}%`
        : `0%`;

      this.setState({
        stats: [
          ...stats,
          {
            param,
            count,
            percent
          }
        ]
      });

      this.worker.terminate();
    };

    this.worker.postMessage({
      text,
      regexp
    });
  };

  render() {
    const {
      text,
      paramText,
      stats,
      paramAlreadyExistsError
    } = this.state;

    return (
      <React.Fragment>
        <h1 className={styles.header}>Q-sorting</h1>
        <div className={styles.mainBlock}>
          <div className={styles.left}>
            <div className={styles.inputRow}>
              <TextField
                multiline
                required
                error={paramAlreadyExistsError}
                id="lab1-textarea"
                label="Source text"
                rows="8"
                placeholder="Enter source text here"
                className={styles.textarea}
                margin="normal"
                onChange={this.textareaChangeHanlder}
                onBlur={this.textareaBlurHandler}
                value={text}
              />
              <div className={styles.parameters}>
                <p className={styles.paramDescr}>
                  Enter search value here.<br />Each time you type a new value, previous will be saved.
                </p>
                {
                  paramAlreadyExistsError &&
                  <p className={styles.paramError}>
                    You've already searched this value!
                    </p>
                }
                <TextField
                  required
                  error={paramAlreadyExistsError}
                  id="lab1-params-input"
                  label="Search values"
                  placeholder="Enter search values here"
                  className={styles.textField}
                  margin="normal"
                  onChange={this.paramChangeHandler}
                  onKeyPress={this.paramSubmitHandler}
                  value={paramText}
                />
              </div>
            </div>
          </div>
          <div className={styles.stats}>
            <h2 className={styles.statsHeader}>
              Search values stats
            </h2>
            <div className={styles.statsList}>
              {
                stats.map((item, index) => (
                  <p key={index} className={styles.statsItem}>
                    <span className={styles.statItemName}>
                      {`${item.param}`}
                    </span>
                    <span className={styles.statItemValues}>
                      {`${item.count} | ${item.percent}`}
                    </span>
                  </p>
                ))
              }
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
