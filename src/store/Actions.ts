'use strict';

import User from '../models/User';
import ChatMessage from '../models/ChatMessage';

export default class Actions {

  public static readonly CHAT_OPENED = 'CHAT_OPENED';
  public static readonly SET_API_TOKEN = 'SET_API_TOKEN';
  public static readonly SET_USER = 'SET_USER';
  public static readonly UNSET_USER = 'UNSET_USER';
  public static readonly SET_CHAT_MESSAGES = 'SET_CHAT_MESSAGES';
  public static readonly ADD_CHAT_MESSAGE = 'ADD_CHAT_MESSAGE';

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

  public static setUser(user: User) {
    return {
      type: Actions.SET_USER,
      value: user
    }
  }

  public static unsetUser() {
    return {
      type: Actions.UNSET_USER
    }
  }

  public static setChatMessages(chatMessages: Array<ChatMessage>) {
    return {
      type: Actions.SET_CHAT_MESSAGES,
      value: chatMessages
    }
  }

  public static addChatMessage(chatMessage: ChatMessage) {
    return {
      type: Actions.ADD_CHAT_MESSAGE,
      value: chatMessage
    }
  }
}