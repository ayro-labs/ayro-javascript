import * as Faye from 'faye';

import Actions from '../stores/Actions';
import Store from '../stores/Store';

import ChatMessage from '../models/ChatMessage';

export default class MessagingService {

  public static start() {
    if (!MessagingService.faye) {
      const user = Store.getState().user;
      MessagingService.faye = new Faye.Client(MessagingService.URL);
      MessagingService.faye.addExtension(MessagingService.authenticationExtension());
      MessagingService.faye.subscribe(`/users/${user.id}`, (data: any) => {
        MessagingService.messageReceived(data);
      }).then(null, () => {
        setTimeout(() => {
          MessagingService.start();
        }, 20000);
      });
    }
  }

  private static readonly EVENT_CHAT_MESSAGE: string = 'chat_message';
  private static readonly URL: string = 'http://api.chatz.io:3102';

  private static faye: any;

  private static messageReceived(data: any) {
    switch (data.event) {
      case MessagingService.EVENT_CHAT_MESSAGE:
        const chatMessage = new ChatMessage(data.message);
        chatMessage.status = ChatMessage.STATUS_SENT;
        chatMessage.direction = ChatMessage.DIRECTION_INCOMING;
        Store.dispatch(Actions.addChatMessage(chatMessage));
        break;
    }
  }

  private static authenticationExtension() {
    return {
      outgoing: (message: any, callback: (message: any) => void) => {
        if (!message.ext) {
          message.ext = {};
        }
        message.ext.api_token = Store.getState().apiToken;
        callback(message);
      },
    };
  }

  private constructor() {

  }
}
