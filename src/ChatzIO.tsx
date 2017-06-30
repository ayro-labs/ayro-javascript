'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Settings from './Settings';
import User from './models/User';
import ChatzContainer from './components/ChatzContainer';

import '../assets/css/styles.css';

export default class ChatzIO {

  private settings: Settings;
  private user: User;

  init(settings: Settings) {
    this.settings = settings;
    ReactDOM.render(<ChatzContainer/>, document.getElementById('root'));
  }

  login(user: User) {
    this.user = user;
  }
}
