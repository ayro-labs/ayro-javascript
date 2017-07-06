'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux'

import Html from '../utils/Html';

import Container from './Container';

export default class Components {

  static init(store: Store<any>) {
    Html.whenReady().then(() => {
      let chatzDiv = document.createElement('div');
      chatzDiv.setAttribute('id', 'chatz');
      ReactDOM.render(
        <Provider store={store}>
          <Container/>
        </Provider>,
        chatzDiv
      );
      document.body.appendChild(chatzDiv);
    });
  }
}