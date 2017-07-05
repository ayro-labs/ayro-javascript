'use strict';

import * as Faye from 'faye';
import { Store } from 'redux';

import Actions from '../store/Actions';

import ChatMessage from '../models/ChatMessage';

export default class NotificationService {

  public static readonly EVENT_CHAT_MESSAGE = 'chat_message';

  private static readonly URL = 'http://api.chatz.io:3102';

  private static faye: any;
  private static store: Store<any>;

  private constructor() {

  }

  public static start(store: Store<any>) {
    if (!NotificationService.faye) {
      let user = store.getState().user;
      NotificationService.store = store;
      NotificationService.faye = new Faye.Client(NotificationService.URL);
      NotificationService.faye.addExtension(NotificationService.authenticate(store));
      NotificationService.faye.subscribe(`/users/${user._id}`, (data: any) => {
        NotificationService.messageReceived(data);
      });
    }
  }

  private static messageReceived(data: any) {
    switch (data.event) {
      case NotificationService.EVENT_CHAT_MESSAGE:
        let chatMessage = new ChatMessage(data.message);
        chatMessage.status = ChatMessage.STATUS_SENT;
        chatMessage.direction = ChatMessage.DIRECTION_INCOMING;
        NotificationService.store.dispatch(Actions.addChatMessage(chatMessage));
        break;
    }
  }

  private static authenticate(store: Store<any>): any {
    return {
      outgoing: function(message, callback) {
        if (!message.ext) {
          message.ext = {};
        }
        message.ext.api_token = store.getState().apiToken;
        callback(message);
      }
    };
  }
}