import React, { Component } from 'react';
import { compact, indexOf, find } from 'lodash';
import TextField from '@material-ui/core/TextField';
import styles from './Lab1.module.css';

import WebWorker from '../../webWorker';
import qSortWorker from './../../workers/qSortWorker.js';
import { genId } from '../../heplers/genId';

export class Lab1 extends Component {
  state = {
    text: '',
    wordsNumber: 0,
    paramText: '',
    params: [],
    stats: [],
    categoryAlreadyExistsError: false,
    categoryText: '',
    categories: []
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

    const isExisting = !!find(categories, {name: categoryText});

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
            params: []
          }
        ])
    });

    // const { params, paramText } = this.state;

    // const isUniq = indexOf(params, paramText) === -1;

    // (isUniq && paramText) && this.processParam(paramText);

    // this.setState({
    //   paramText: '',
    //   categoryAlreadyExistsError: !isUniq,
    //   params: isUniq ? compact([...params, paramText]) : params
    // });
  };

  paramSubmitHandler = (e, id) => {
    if (e.key !== 'Enter') {
      return;
    }

    const { categories } = this.state;

    const { value: name } = e.target;
    const category = find(categories, { id });
    const index = indexOf(categories, category)

    e.target.value = '';

    this.setState({
      categories: [
        ...categories.slice(0, index),
        {
          ...category,
          params: [
            ...category.params,
            {
              name,
              count: 0,
              percent: 0
            }
          ]
        },
        ...categories.slice(index + 1)
      ]
    })
  };

  // processParam = param => {
  //   const { text, wordsNumber, stats } = this.state;
  //   const regexp = new RegExp(`\\b(${param})\\b`, 'g');

  //   this.worker = new WebWorker(qSortWorker);

  //   this.worker.onmessage = e => {
  //     const count = e.data;

  //     const percent = count
  //       ? `${Math.round((count / wordsNumber) * 10000) / 100}%`
  //       : `0%`;

  //     this.setState({
  //       stats: [
  //         ...stats,
  //         {
  //           param,
  //           count,
  //           percent
  //         }
  //       ]
  //     });

  //     this.worker.terminate();
  //   };

  //   this.worker.postMessage({
  //     text,
  //     regexp
  //   });
  // };

  renderCategories = () => {
    const { categories } = this.state;

    return categories.map(item => {
      const { id, name, params } = item;

      return (
        <div key={id} className='categoryItem'>
          <h2>{`Category: ${name}`}</h2>
          <TextField
            required
            // error={categoryAlreadyExistsError}
            id={`category-${id}-param-input`}
            label="Params"
            placeholder="Enter param here"
            className={styles.textField}
            margin="normal"
            onKeyPress={e => this.paramSubmitHandler(e, id)}
          />
          {params.map((item, index) => (<p key={index}>{item.name}</p>))}
        </div>
      );
    })
  };

  start = () => {
    const { categories, wordsNumber, text } = this.state;

    this.worker = new WebWorker(qSortWorker);

    this.worker.onmessage = e => {
      const categories = e.data;

      // const percent = count
      //   ? `${Math.round((count / wordsNumber) * 10000) / 100}%`
      //   : `0%`;

      // this.setState({
      //   stats: [
      //     ...stats,
      //     {
      //       param,
      //       count,
      //       percent
      //     }
      //   ]
      // });
      this.setState({
        categories: [...categories]
      });

      this.worker.terminate();
    };

    this.worker.postMessage({
      categories: [...categories],
      wordsNumber,
      text
    });
  };

  render() {
    const {
      text,
      // paramText,
      categoryText,
      stats,
      categoryAlreadyExistsError
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
                error={categoryAlreadyExistsError}
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
                  categoryAlreadyExistsError &&
                  <p className={styles.paramError}>
                    You've already searched this value!
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
                />
              </div>
            </div>
            <div className='categoryBlock'>
              <button onClick={this.start}>Start</button>
              {this.renderCategories()}
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
