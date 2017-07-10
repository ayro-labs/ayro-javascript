'use strict';

import '../assets/stylesheets/main.less';
import 'whatwg-fetch';

import Components from './components';
import Actions from './stores/Actions';
import Store from './stores/Store';

import ChatzService from './services/ChatzService';
import MessagingService from './services/MessagingService';
import App from './utils/App';

import Settings from './models/Settings';
import User from './models/User';

export default class ChatzIO {

  private settings: Settings;

  init(data: any) {
    this.settings = new Settings(data);
    Store.dispatch(Actions.setSettings(this.settings));
    this.login(new User());
  }

  login(data: any) {
    let user = new User(data);
    Store.dispatch(Actions.setUser(user));
    ChatzService.login(this.settings.app_token, user, App.getDevice()).then((result) => {
      Store.dispatch(Actions.setApiToken(result.token));
      Store.dispatch(Actions.setUser(new User(result.user)));
      MessagingService.start();
      Components.init();
    });
  }

  logout() {
    Store.dispatch(Actions.unsetUser());
  }
}