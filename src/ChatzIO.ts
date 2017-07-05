'use strict';

import Components from './components';
import Actions from './store/Actions';
import store from './store';

import ChatzService from './services/Chatz';
import NotificationService from './services/Notification';
import App from './utils/App';

import Settings from './Settings';
import User from './models/User';

import '../assets/css/styles.css';

export default class ChatzIO {

  private settings: Settings;

  init(settings: Settings) {
    this.settings = settings;
    this.login(new User());
  }

  login(user: User) {
    ChatzService.login(this.settings.app_token, user, App.getDevice()).then((result) => {
      store.dispatch(Actions.setApiToken(result.token));
      store.dispatch(Actions.setUser(new User(result.user)));
      NotificationService.start(store);
      Components.init(store);
    });
  }

  logout() {
    store.dispatch(Actions.unsetUser());
  }
}