'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './assets/css/styles.css';
import ChatzContainer from './components/ChatzContainer';

export default class ChatzIO {

  init() {
    ReactDOM.render(<ChatzContainer/>, document.getElementById('root'));
  }
}
