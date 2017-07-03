'use strict';

import * as Faye from 'faye';

interface Listener {

  (event: string, message: any): void;

}

export default class Notifications {

  public static readonly EVENT_CHAT_MESSAGE = 'chat_message';

  private static readonly URL = 'http://api.chatz.io:3100';

  private static websocket = null;

  private constructor() {

  }

  public static start(apiToken: string, listener: Listener) {
    if (!Notifications.websocket) {
      Notifications.websocket = new Faye.Client(Notifications.URL);
      Notifications.websocket.setHeader('X-Token', apiToken);
      Notifications.websocket.subscribe('/messages', (message: any) => {
        if (listener) {
          listener(Notifications.EVENT_CHAT_MESSAGE, message);
        }
      });
    }
  }
}