'use strict';

import User from '../models/User';

import * as Faye from 'faye';

interface Listener {

  (data: any): void;

}

export default class Notifications {

  public static readonly EVENT_CHAT_MESSAGE = 'chat_message';

  private static readonly URL = 'http://api.chatz.io:3102';

  private static ws = null;

  private constructor() {

  }

  public static start(user: User, listener: Listener) {
    if (!Notifications.ws) {
      Notifications.ws = new Faye.Client(Notifications.URL);
      Notifications.ws.subscribe(`/users/${user._id}`, (data: any) => {
        if (listener) {
          listener(data);
        }
      });
    }
  }
}