'use strict';

import User from '../models/User';
import ChatMessage from '../models/ChatMessage';

export default class Actions {

  public static readonly CHAT_OPENED = 'CHAT_OPENED';
  public static readonly SET_API_TOKEN = 'SET_API_TOKEN';
  public static readonly SET_USER = 'SET_USER';
  public static readonly UNSET_USER = 'UNSET_USER';
  public static readonly ADD_MESSAGE = 'ADD_MESSAGE';

  private constructor() {

  }

  public static openChat(): any {
    return {
      type: Actions.CHAT_OPENED,
      value: true
    };
  }

  public static closeChat(): any {
    return {
      type: Actions.CHAT_OPENED,
      value: false
    };
  }

  public static setApiToken(apiToken: string): any {
    return {
      type: Actions.SET_API_TOKEN,
      value: apiToken
    }
  }

  public static setUser(user: User): any {
    return {
      type: Actions.SET_USER,
      value: user
    }
  }

  public static unsetUser(): any {
    return {
      type: Actions.UNSET_USER
    }
  }

  public static addMessage(chatMessage: ChatMessage): any {
    return {
      type: Actions.ADD_MESSAGE,
      value: chatMessage
    }
  }
}