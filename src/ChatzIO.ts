'use strict';

import { v4 as uuid } from 'uuid';

import * as actions from './components/store/actions';
import store from './components/store';
import App from './components/App';

import { apiService } from './services/api';
import { storage } from './utils/storage';

import Settings from './Settings';
import User from './models/User';
import Device from './models/Device';

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
    this.user = user;
    apiService.login(this.settings.app_token, this.user, this.getDevice()).then((apiToken) => {
      this.apiToken = apiToken;
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
    return new Device({
      uid: uid,
      platform: 'web'
    });
  }
}