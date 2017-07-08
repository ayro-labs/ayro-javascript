'use strict';

import User from '../models/User';
import ChatMessage from '../models/ChatMessage';

export default class Actions {

  public static readonly OPEN_CHAT: string = 'OPEN_CHAT';
  public static readonly CLOSE_CHAT: string = 'CLOSE_CHAT';
  public static readonly SET_API_TOKEN: string = 'SET_API_TOKEN';
  public static readonly SET_USER: string = 'SET_USER';
  public static readonly UNSET_USER: string = 'UNSET_USER';
  public static readonly SET_CHAT_MESSAGES: string = 'SET_CHAT_MESSAGES';
  public static readonly ADD_CHAT_MESSAGE: string = 'ADD_CHAT_MESSAGE';
  public static readonly UPDATE_CHAT_MESSAGE: string = 'UPDATE_CHAT_MESSAGE';

  private constructor() {

  }

  public static openChat() {
    return {
      type: Actions.OPEN_CHAT
    };
  }

  public static closeChat() {
    return {
      type: Actions.CLOSE_CHAT
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

  public static updateChatMessage(id: string, chatMessage: ChatMessage) {
    return {
      type: Actions.UPDATE_CHAT_MESSAGE,
      id: id,
      value: chatMessage
    }
  }
}