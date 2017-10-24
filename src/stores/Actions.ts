import {Action} from 'redux';
import {AppStatus} from 'enums/AppStatus';
import {UserStatus} from 'enums/UserStatus';
import {Settings} from 'models/Settings';
import {App} from 'models/App';
import {Integration} from 'models/Integration';
import {User} from 'models/User';
import {ChatMessage} from 'models/ChatMessage';

export interface IAction extends Action {
  value: any;
}

export class Actions {

  public static readonly GET_USER_UID: string = 'GET_USER_UID';
  public static readonly SET_USER_UID: string = 'SET_USER_UID';
  public static readonly GET_DEVICE_UID: string = 'GET_DEVICE_UID';
  public static readonly SET_DEVICE_UID: string = 'SET_DEVICE_UID';
  public static readonly SET_APP_STATUS: string = 'SET_APP_STATUS';
  public static readonly SET_USER_STATUS: string = 'SET_USER_STATUS';
  public static readonly SET_SETTINGS: string = 'SET_SETTINGS';
  public static readonly SET_APP: string = 'SET_APP';
  public static readonly SET_INTEGRATION: string = 'SET_INTEGRATION';
  public static readonly SET_USER: string = 'SET_USER';
  public static readonly UNSET_USER: string = 'UNSET_USER';
  public static readonly SET_API_TOKEN: string = 'SET_API_TOKEN';
  public static readonly UNSET_API_TOKEN: string = 'UNSET_API_TOKEN';
  public static readonly OPEN_CHAT: string = 'OPEN_CHAT';
  public static readonly CLOSE_CHAT: string = 'CLOSE_CHAT';
  public static readonly SET_CHAT_MESSAGES: string = 'SET_CHAT_MESSAGES';
  public static readonly ADD_CHAT_MESSAGE: string = 'ADD_CHAT_MESSAGE';
  public static readonly UPDATE_CHAT_MESSAGE: string = 'UPDATE_CHAT_MESSAGE';
  public static readonly REMOVE_CHAT_MESSAGE: string = 'REMOVE_CHAT_MESSAGE';

  public static openChat(): IAction {
    return {
      type: Actions.OPEN_CHAT,
      value: null,
    };
  }

  public static closeChat(): IAction {
    return {
      type: Actions.CLOSE_CHAT,
      value: null,
    };
  }

  public static setAppStatus(status: AppStatus): IAction {
    return {
      type: Actions.SET_APP_STATUS,
      value: status,
    };
  }

  public static setUserStatus(status: UserStatus): IAction {
    return {
      type: Actions.SET_USER_STATUS,
      value: status,
    };
  }

  public static setSettings(settings: Settings): IAction {
    return {
      type: Actions.SET_SETTINGS,
      value: settings,
    };
  }

  public static setApp(app: App): IAction {
    return {
      type: Actions.SET_APP,
      value: app,
    };
  }

  public static setIntegration(integration: Integration): IAction {
    return {
      type: Actions.SET_INTEGRATION,
      value: integration,
    };
  }

  public static setUser(user: User): IAction {
    return {
      type: Actions.SET_USER,
      value: user,
    };
  }

  public static unsetUser(): IAction {
    return {
      type: Actions.UNSET_USER,
      value: null,
    };
  }

  public static setApiToken(apiToken: string): IAction {
    return {
      type: Actions.SET_API_TOKEN,
      value: apiToken,
    };
  }

  public static unsetApiToken(): IAction {
    return {
      type: Actions.UNSET_API_TOKEN,
      value: null,
    };
  }

  public static setChatMessages(chatMessages: ChatMessage[]): IAction {
    return {
      type: Actions.SET_CHAT_MESSAGES,
      value: chatMessages,
    };
  }

  public static addChatMessage(chatMessage: ChatMessage): IAction {
    return {
      type: Actions.ADD_CHAT_MESSAGE,
      value: chatMessage,
    };
  }

  public static updateChatMessage(id: string, chatMessage: ChatMessage): IAction {
    return {
      type: Actions.UPDATE_CHAT_MESSAGE,
      value: {
        id,
        chatMessage,
      },
    };
  }

  public static removeChatMessage(chatMessage: ChatMessage): IAction {
    return {
      type: Actions.REMOVE_CHAT_MESSAGE,
      value: chatMessage,
    };
  }

  private constructor() {

  }
}
