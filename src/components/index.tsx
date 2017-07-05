'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux'

import ChatzContainer from './ChatzContainer';

export default class Components {

  static init(store: Store<any>) {
    ReactDOM.render(
      <Provider store={store}>
        <ChatzContainer/>
      </Provider>,
      document.getElementById('chatz')
    );
  }
}