import React, { Component } from 'react';
import { compact, indexOf, last } from 'lodash';
import TextField from '@material-ui/core/TextField';
import styles from './Lab1.module.css';

export class Lab1 extends Component {
  state = {
    text: '',
    paramText: '',
    params: [],
    paramAlreadyExistsError: false
  }

  textareaChangeHanlder = e =>
    this.setState({ text: e.target.value });

  paramChangeHandler = e =>
    this.setState({ paramText: e.target.value });

  paramSubmitHandler = e => {
    if (e.key !== 'Enter') {
      return;
    }

    const { params, paramText } = this.state;

    const isUniq = indexOf(params, paramText) === -1;

    isUniq
      ? this.setState(
        prevState => {
          return {
            paramText: '',
            params: compact([...params, paramText]),
            paramAlreadyExistsError: false
          }
        },
        this.searchParamInText
      )
      : (this.setState({
        paramText: '',
        paramAlreadyExistsError: true
      }))
  };

  searchParamInText = () => {
    const { text, params } = this.state;
    const regexp = new RegExp('\\b' + `(${last(params)})` + '\\b', 'g');

    const count = (text.match(regexp) || []).length;
    console.log(count);
  };

  render() {
    const {
      text,
      paramText,
      params,
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
                params.map((item, index) => (<p key={index} className={styles.statsItem}>{item}</p>))
              }
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
