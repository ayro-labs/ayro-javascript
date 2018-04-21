import {AnyAction} from 'redux';
import {AppStatus} from 'enums/AppStatus';
import {UserStatus} from 'enums/UserStatus';
import {Settings} from 'models/Settings';
import {App} from 'models/App';
import {Integration} from 'models/Integration';
import {User} from 'models/User';
import {ChatMessage} from 'models/ChatMessage';

export class Actions {

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

  public static openChat(): AnyAction {
    return {
      type: Actions.OPEN_CHAT,
    };
  }

  public static closeChat(): AnyAction {
    return {
      type: Actions.CLOSE_CHAT,
    };
  }

  public static setAppStatus(appStatus: AppStatus): AnyAction {
    return {
      type: Actions.SET_APP_STATUS,
      extraProps: {appStatus},
    };
  }

  public static setUserStatus(userStatus: UserStatus): AnyAction {
    return {
      type: Actions.SET_USER_STATUS,
      extraProps: {userStatus},
    };
  }

  public static setSettings(settings: Settings): AnyAction {
    return {
      type: Actions.SET_SETTINGS,
      extraProps: {settings},
    };
  }

  public static setApp(app: App): AnyAction {
    return {
      type: Actions.SET_APP,
      extraProps: {app},
    };
  }

  public static setIntegration(integration: Integration): AnyAction {
    return {
      type: Actions.SET_INTEGRATION,
      extraProps: {integration},
    };
  }

  public static setUser(user: User): AnyAction {
    return {
      type: Actions.SET_USER,
      extraProps: {user},
    };
  }

  public static unsetUser(): AnyAction {
    return {
      type: Actions.UNSET_USER,
    };
  }

  public static setApiToken(apiToken: string): AnyAction {
    return {
      type: Actions.SET_API_TOKEN,
      extraProps: {apiToken},
    };
  }

  public static unsetApiToken(): AnyAction {
    return {
      type: Actions.UNSET_API_TOKEN,
    };
  }

  public static setChatMessages(chatMessages: ChatMessage[]): AnyAction {
    return {
      type: Actions.SET_CHAT_MESSAGES,
      extraProps: {chatMessages},
    };
  }

  public static addChatMessage(chatMessage: ChatMessage): AnyAction {
    return {
      type: Actions.ADD_CHAT_MESSAGE,
      extraProps: {chatMessage},
    };
  }

  public static updateChatMessage(id: string, chatMessage: ChatMessage): AnyAction {
    return {
      type: Actions.UPDATE_CHAT_MESSAGE,
      extraProps: {id, chatMessage},
    };
  }

  public static removeChatMessage(chatMessage: ChatMessage): AnyAction {
    return {
      type: Actions.REMOVE_CHAT_MESSAGE,
      extraProps: {chatMessage},
    };
  }

  private constructor() {

  }
}
