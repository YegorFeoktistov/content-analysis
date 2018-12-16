import React, { Component } from 'react';
import { compact, indexOf } from 'lodash';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import LinearProgress from '@material-ui/core/LinearProgress';

import Delete from '@material-ui/icons/Delete';

import styles from './Lab2.module.css';
import * as muiStyles from './../../muiStyles';

import WebWorker from '../../webWorker';
import countInTextWorker from './../../workers/countInTextWorker.js';

import { classnames } from '../../heplers';

export class Lab2 extends Component {
  state = {
    text: '',
    wordsNumber: 0,
    paramText: '',
    params: [],
    stats: [],
    paramAlreadyExistsError: false,
    loading: false
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

    this.setState({
      loading: true
    })

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
        ],
        loading: false
      });

      this.worker.terminate();
    };

    this.worker.postMessage({
      text,
      regexp
    });
  };

  clearAll = () => {
    this.setState({
      text: '',
      wordsNumber: 0,
      paramText: '',
      params: [],
      stats: [],
      paramAlreadyExistsError: false
    });
  };

  render() {
    const {
      text,
      paramText,
      stats,
      paramAlreadyExistsError,
      loading
    } = this.state;

    const statsItemNameClasses = classnames([
      styles.statsItemValue,
      styles.statsItemValue_name
    ]);

    return (
      <React.Fragment>
        {loading && <LinearProgress style={muiStyles.progressStyle} variant="query" />}
        <h1 className={styles.header}>Pair comparison</h1>
        <div className={styles.mainBlock}>
          <div className={styles.left}>
            <TextField
              multiline
              required
              error={paramAlreadyExistsError}
              id="lab2-textarea"
              label="Source text"
              rows="16"
              placeholder="Enter source text here"
              className={styles.textarea}
              margin="normal"
              onChange={this.textareaChangeHanlder}
              onBlur={this.textareaBlurHandler}
              value={text}
              disabled={loading}
            />
            <div className={styles.parameters}>
              <p className={styles.paramDescr}>
                Enter param here. Don't repeat it. Press Enter to confirm.
              </p>
              {
                paramAlreadyExistsError &&
                <p className={styles.paramError}>
                  You've already entered this value!
                </p>
              }
              <TextField
                required
                error={paramAlreadyExistsError}
                id="lab2-params-input"
                label="Params"
                placeholder="Enter param here"
                className={styles.textField}
                margin="normal"
                onChange={this.paramChangeHandler}
                onKeyPress={this.paramSubmitHandler}
                value={paramText}
                disabled={loading}
              />
              <div className={styles.buttonBlock}>
                <Fab disabled={loading} variant="extended" aria-label="Delete" style={muiStyles.deleteButtonStyle} onClick={this.clearAll}>
                  <Delete style={muiStyles.iconStyle} />
                  Clear
                </Fab>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <h2 className={styles.statsBlockHeader}>
              Parameters
            </h2>
            <h3 className={styles.statsListHeader}>
              <div className={styles.statsListHeaderItem}>Name</div>
              <div className={styles.statsListHeaderItem}>Count</div>
              <div className={styles.statsListHeaderItem}>Percentage</div>
            </h3>
            <div className={styles.statsBlock}>
              {
                stats.map((item, index) => (
                  <p key={index} className={styles.statsItem}>
                    <span className={statsItemNameClasses}>
                      {`${item.param}`}
                    </span>
                    <span className={styles.statsItemValue}>
                      {`${item.count}`}
                    </span>
                    <span className={styles.statsItemValue}>
                      {`${item.percent}`}
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
