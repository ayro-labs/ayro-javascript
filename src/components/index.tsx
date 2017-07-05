'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux'

import Container from './Container';

export default class Components {

  static init(store: Store<any>) {
    ReactDOM.render(
      <Provider store={store}>
        <Container/>
      </Provider>,
      document.getElementById('chatz')
    );
  }
}