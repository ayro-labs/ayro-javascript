'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux'

import ChatzContainer from './ChatzContainer';

export default class App {

  static init(store: Store<any>): void {
    ReactDOM.render(
      <Provider store={store}>
        <ChatzContainer/>
      </Provider>,
      document.getElementById('root')
    );
  }
}