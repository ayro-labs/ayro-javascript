'use strict';

import { v4 as uuid } from 'uuid';

import Settings from './Settings';
import User from './models/User';
import App from './components/App';
import store from './components/store';
import * as actions from './components/store/actions';
import { http } from './utils/http';
import { storage } from './utils/storage';

import '../assets/css/styles.css';

export default class ChatzIO {

  private static readonly DEVICE_UID = 'device_uid';

  private settings: Settings;
  private user: User;
  private apiToken: string;

  init(settings: Settings): void {
    this.settings = settings;
    this.login(new User());
  }

  login(user: User): void {
    let context = this;
    this.user = user;
    http.post('/auth/users', {
      app_token: this.settings.app_token,
      user: this.user,
      device: this.getDevice()
    }).then(function(apiToken) {
      context.apiToken = apiToken;
      store.dispatch(actions.setApiToken(apiToken));
      App.init(store);
    });
  }

  logout(): void {
    this.user = null;
  }

  private getDevice() {
    let uid = storage.get(ChatzIO.DEVICE_UID);
    if (!uid) {
      uid = uuid();
      storage.set(ChatzIO.DEVICE_UID, uid);
    }
    return {
      uid: uid,
      platform: 'web'
    }
  }
}