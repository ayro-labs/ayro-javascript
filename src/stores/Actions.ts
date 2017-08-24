import {AppStatus} from 'enums/AppStatus';
import {UserStatus} from 'enums/UserStatus';
import {Settings} from 'models/Settings';
import {App} from 'models/App';
import {Integration} from 'models/Integration';
import {User} from 'models/User';
import {ChatMessage} from 'models/ChatMessage';

export class Actions {

  public static readonly OPEN_CHAT: string = 'OPEN_CHAT';
  public static readonly CLOSE_CHAT: string = 'CLOSE_CHAT';
  public static readonly SET_APP_STATUS: string = 'SET_APP_STATUS';
  public static readonly SET_USER_STATUS: string = 'SET_USER_STATUS';
  public static readonly SET_SETTINGS: string = 'SET_SETTINGS';
  public static readonly SET_APP: string = 'SET_APP';
  public static readonly SET_INTEGRATION: string = 'SET_INTEGRATION';
  public static readonly SET_USER: string = 'SET_USER';
  public static readonly UNSET_USER: string = 'UNSET_USER';
  public static readonly SET_API_TOKEN: string = 'SET_API_TOKEN';
  public static readonly UNSET_API_TOKEN: string = 'UNSET_API_TOKEN';
  public static readonly SET_CHAT_MESSAGES: string = 'SET_CHAT_MESSAGES';
  public static readonly ADD_CHAT_MESSAGE: string = 'ADD_CHAT_MESSAGE';
  public static readonly UPDATE_CHAT_MESSAGE: string = 'UPDATE_CHAT_MESSAGE';

  public static openChat() {
    return {
      type: Actions.OPEN_CHAT,
    };
  }

  public static closeChat() {
    return {
      type: Actions.CLOSE_CHAT,
    };
  }

  public static setAppStatus(status: AppStatus) {
    return {
      type: Actions.SET_APP_STATUS,
      value: status,
    };
  }

  public static setUserStatus(status: UserStatus) {
    return {
      type: Actions.SET_USER_STATUS,
      value: status,
    };
  }

  public static setSettings(settings: Settings) {
    return {
      type: Actions.SET_SETTINGS,
      value: settings,
    };
  }

  public static setApp(app: App) {
    return {
      type: Actions.SET_APP,
      value: app,
    };
  }

  public static setIntegration(integration: Integration) {
    return {
      type: Actions.SET_INTEGRATION,
      value: integration,
    };
  }

  public static setUser(user: User) {
    return {
      type: Actions.SET_USER,
      value: user,
    };
  }

  public static unsetUser() {
    return {
      type: Actions.UNSET_USER,
    };
  }

  public static setApiToken(apiToken: string) {
    return {
      type: Actions.SET_API_TOKEN,
      value: apiToken,
    };
  }

  public static unsetApiToken() {
    return {
      type: Actions.UNSET_API_TOKEN,
    };
  }

  public static setChatMessages(chatMessages: ChatMessage[]) {
    return {
      type: Actions.SET_CHAT_MESSAGES,
      value: chatMessages,
    };
  }

  public static addChatMessage(chatMessage: ChatMessage) {
    return {
      type: Actions.ADD_CHAT_MESSAGE,
      value: chatMessage,
    };
  }

  public static updateChatMessage(id: string, chatMessage: ChatMessage) {
    return {
      id,
      type: Actions.UPDATE_CHAT_MESSAGE,
      value: chatMessage,
    };
  }

  private constructor() {

  }
}
