import React, { Component } from 'react';
import { compact, indexOf, filter, find, isEmpty, map, reduce, includes } from 'lodash';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import LinearProgress from '@material-ui/core/LinearProgress';

import PlayArrow from '@material-ui/icons/PlayArrow';
import Delete from '@material-ui/icons/Delete';

import styles from './Lab1.module.css';
import * as muiStyles from './../../muiStyles';

import WebWorker from '../../webWorker';
import qSortWorker from './../../workers/qSortWorker.js';
import { classnames, genId } from '../../heplers';

export class Lab1 extends Component {
  state = {
    text: '',
    wordsNumber: 0,
    stats: [],
    categoryAlreadyExistsError: false,
    categoryText: '',
    categories: [],
    totalAverage: 0,
    matchedIds: []
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

  categoryChangeHandler = e =>
    this.setState({ categoryText: e.target.value });

  categorySubmitHandler = e => {
    if (e.key !== 'Enter') {
      return;
    }

    const { categories, categoryText } = this.state;

    if (!categoryText) {
      return;
    }

    const isExisting = !!find(categories, { name: categoryText });

    this.setState({
      categoryText: '',
      categoryAlreadyExistsError: isExisting,
      categories: isExisting
        ? categories
        : compact([
          ...categories,
          {
            id: genId(),
            name: categoryText,
            average: 0,
            params: [],
            error: false
          }
        ])
    });
  };

  paramSubmitHandler = (e, id) => {
    if (e.key !== 'Enter') {
      return;
    }

    const { categories } = this.state;

    const { value: name } = e.target;
    const category = find(categories, { id });
    const index = indexOf(categories, category);

    const isExist = !!find(category.params, { name });
    const newParams = !isExist
      ? [
        ...category.params,
        {
          name,
          count: 0,
          percent: 0
        }
      ]
      : [...category.params];

    e.target.value = '';

    this.setState({
      categories: [
        ...categories.slice(0, index),
        {
          ...category,
          params: newParams,
          error: isExist
        },
        ...categories.slice(index + 1)
      ]
    })
  };

  renderCategories = () => {
    const { categories, matchedIds, loading } = this.state;

    return categories.map(category => {
      const { id, name, params, average, error } = category;

      return (
        <div key={id} className='categoryItem'>
          <h2
            className={classnames([
              styles.categoryHeader,
              includes(matchedIds, id) && styles.categoryHeaderMatch
            ])}
          >
            <span className={styles.categoryName}>
              {name}
            </span>
            <span className={styles.categoryValue}>
              {average}
            </span>
          </h2>
          <TextField
            required
            error={error}
            id={`category-${id}-param-input`}
            label="Params"
            placeholder="Enter param here"
            className={styles.paramInput}
            margin="normal"
            onKeyPress={e => this.paramSubmitHandler(e, id)}
            disabled={loading}
          />
          {
            error &&
            <p className={styles.paramError}>
              You've already entered this value!
            </p>
          }
          <div className={styles.paramsBlock}>
            {
              params.map(
                (item, index) => (
                  <span key={index} className={styles.param}>{item.name} - {item.count} | {item.percent}%</span>
                )
              )
            }
          </div>
        </div>
      );
    })
  };

  start = () => {
    const { categories, wordsNumber, text } = this.state;

    this.setState({ loading: true });

    this.worker = new WebWorker(qSortWorker);

    this.worker.onmessage = e => {
      const categories = e.data;

      const totalSum = !isEmpty(categories)
        ? reduce(categories, (result, item) => result + item.average, 0)
        : 0;

      const totalAverage = totalSum
        ? Math.round((totalSum / categories.length) * 100) / 100
        : 0;

      const maxValue = Math.max(...(map(categories, 'average')));
      const matchedIds = !isEmpty(categories) && maxValue
        ? map(
            filter(categories, item => item.average === maxValue),
            'id'
          )
        : [];

      this.setState({
        categories: [...categories],
        totalAverage,
        matchedIds,
        loading: false
      });

      this.worker.terminate();
    };

    this.worker.postMessage({
      categories: [...categories],
      wordsNumber,
      text
    });
  };

  clearAll = () => {
    this.setState({
      text: '',
      wordsNumber: 0,
      stats: [],
      categoryAlreadyExistsError: false,
      categoryText: '',
      categories: [],
      totalAverage: 0
    });
  };

  render() {
    const {
      text,
      categoryText,
      categoryAlreadyExistsError,
      totalAverage,
      loading
    } = this.state;

    return (
      <React.Fragment>
        {loading && <LinearProgress style={muiStyles.progressStyle} variant="query" />}
        <h1 className={styles.header}>Q-sorting</h1>
        <div className={styles.mainBlock}>
          <div className={styles.left}>
            <TextField
              multiline
              required
              error={categoryAlreadyExistsError}
              id="lab1-textarea"
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
                Enter category here. Don't repeat it.
              </p>
              {
                categoryAlreadyExistsError &&
                <p className={styles.paramError}>
                  You've already entered this value!
                </p>
              }
              <TextField
                required
                error={categoryAlreadyExistsError}
                id="lab1-categories-input"
                label="Categories"
                placeholder="Enter category here"
                className={styles.textField}
                margin="normal"
                onChange={this.categoryChangeHandler}
                onKeyPress={this.categorySubmitHandler}
                value={categoryText}
                disabled={loading}
              />
              <div className={styles.buttonBlock}>
                <Fab disabled={loading} variant="extended" aria-label="Start" style={muiStyles.startButtonStyle} onClick={this.start}>
                  <PlayArrow style={muiStyles.iconStyle} />
                  Start
                </Fab>
                <Fab disabled={loading} variant="extended" aria-label="Delete" style={muiStyles.deleteButtonStyle} onClick={this.clearAll}>
                  <Delete style={muiStyles.iconStyle} />
                  Clear
                </Fab>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <h2 className={styles.categoryBlockHeader}>
              Categories
              {
                totalAverage ? (<span>Total average: {totalAverage}</span>) : null
              }
            </h2>
            <div className={styles.categoryBlock}>
              {this.renderCategories()}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
