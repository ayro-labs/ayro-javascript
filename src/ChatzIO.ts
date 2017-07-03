'use strict';

import { v4 as uuid } from 'uuid';

import Actions from './components/store/Actions';
import store from './components/store';
import App from './components/App';

import Storage from './utils/Storage';
import ChatzClient from './services/ChatzClient';
import Notifications from './services/Notifications';

import Settings from './Settings';
import User from './models/User';
import Device from './models/Device';
import ChatMessage from './models/ChatMessage';

import '../assets/css/styles.css';

export default class ChatzIO {

  private static readonly DEVICE_UID = 'device_uid';

  private settings: Settings;
  private user: User;

  init(settings: Settings): void {
    this.settings = settings;
    this.login(new User());
  }

  login(user: User): void {
    this.user = user;
    ChatzClient.login(this.settings.app_token, this.user, this.getDevice()).then((apiToken) => {
      store.dispatch(Actions.setApiToken(apiToken));
      Notifications.start(apiToken, this.onMessage);
      App.init(store);
    });
  }

  logout(): void {
    this.user = null;
  }

  private getDevice() {
    let uid = Storage.get(ChatzIO.DEVICE_UID);
    if (!uid) {
      uid = uuid();
      Storage.set(ChatzIO.DEVICE_UID, uid);
    }
    return new Device({
      uid: uid,
      platform: 'web'
    });
  }

  private onMessage(event: string, message: any) {
    switch (event) {
      case Notifications.EVENT_CHAT_MESSAGE:
        let chatMessage = new ChatMessage(message);
        chatMessage.status = ChatMessage.STATUS_SENT;
        chatMessage.direction = ChatMessage.DIRECTION_INCOMING;
        store.dispatch(Actions.addMessage(message));
        break;
    }
  }
}