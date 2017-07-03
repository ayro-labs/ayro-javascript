'use strict';

import ChatMessage from '../../models/ChatMessage';

export default class Actions {

  public static readonly CHAT_OPENED = 'CHAT_OPENED';
  public static readonly SET_API_TOKEN = 'SET_API_TOKEN';
  public static readonly ADD_MESSAGE = 'ADD_MESSAGE';

  private constructor() {

  }

  public static openChat() {
    return {
      type: Actions.CHAT_OPENED,
      value: true
    };
  }

  public static closeChat() {
    return {
      type: Actions.CHAT_OPENED,
      value: false
    };
  }

  public static setApiToken(apiToken: string) {
    return {
      type: Actions.SET_API_TOKEN,
      value: apiToken
    }
  }

  public static addMessage(chatMessage: ChatMessage) {
    return {
      type: Actions.ADD_MESSAGE,
      value: chatMessage
    }
  }
}