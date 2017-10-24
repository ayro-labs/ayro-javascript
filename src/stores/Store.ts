import {Store as ReduxStore, createStore} from 'redux';
import * as PubSub from 'pubsub-js';
import * as DotProp from 'dot-prop-immutable';

import {AppStatus} from 'enums/AppStatus';
import {UserStatus} from 'enums/UserStatus';
import {Settings} from 'models/Settings';
import {App} from 'models/App';
import {Integration} from 'models/Integration';
import {User} from 'models/User';
import {ChatMessage} from 'models/ChatMessage';
import {Actions, IAction} from 'stores/Actions';

export interface IStoreState {
  userUid: string;
  deviceUid: string;
  appStatus: AppStatus;
  userStatus: UserStatus;
  settings: Settings;
  app: App;
  integration: Integration;
  user: User;
  apiToken: string;
  chatOpened: boolean;
  chatMessages: ChatMessage[];
}

export class Store {

  public static get(): ReduxStore<IStoreState> {
    return Store.STORE;
  }

  public static getState(): IStoreState {
    return Store.STORE.getState();
  }

  public static dispatch(action: IAction) {
    Store.STORE.dispatch(action);
  }

  private static readonly INITIAL_STATE: IStoreState = {
    userUid: null,
    deviceUid: null,
    appStatus: null,
    userStatus: null,
    settings: null,
    app: null,
    integration: null,
    user: null,
    apiToken: null,
    chatOpened: false,
    chatMessages: [],
  };

  private static STORE: ReduxStore<IStoreState> = createStore((state: IStoreState, action: IAction) => {
    if (!state) {
      return Store.INITIAL_STATE;
    }
    let newState: IStoreState = null;
    switch (action.type) {
      case Actions.SET_APP_STATUS:
        newState = Store.setAppStatus(state, action);
        break;
      case Actions.SET_USER_STATUS:
        newState = Store.setUserStatus(state, action);
        break;
      case Actions.SET_SETTINGS:
        newState = Store.setSettings(state, action);
        break;
      case Actions.SET_APP:
        newState = Store.setApp(state, action);
        break;
      case Actions.SET_INTEGRATION:
        newState = Store.setIntegration(state, action);
        break;
      case Actions.SET_USER:
        newState = Store.setUser(state, action);
        break;
      case Actions.UNSET_USER:
        newState = Store.unsetUser(state);
        break;
      case Actions.SET_API_TOKEN:
        newState = Store.setApiToken(state, action);
        break;
      case Actions.UNSET_API_TOKEN:
        newState = Store.unsetApiToken(state);
        break;
      case Actions.OPEN_CHAT:
        newState = Store.openChat(state);
        break;
      case Actions.CLOSE_CHAT:
        newState = Store.closeChat(state);
        break;
      case Actions.SET_CHAT_MESSAGES:
        newState = Store.setChatMessages(state, action);
        break;
      case Actions.ADD_CHAT_MESSAGE:
        newState = Store.addChatMessage(state, action);
        break;
      case Actions.UPDATE_CHAT_MESSAGE:
        newState = Store.updateChatMessage(state, action);
        break;
      case Actions.REMOVE_CHAT_MESSAGE:
        newState = Store.removeChatMessage(state, action);
        break;
    }
    PubSub.publish(action.type, action);
    return newState;
  });

  private static setAppStatus(state: IStoreState, action: IAction): IStoreState {
    return DotProp.set(state, 'appStatus', action.value);
  }

  private static setUserStatus(state: IStoreState, action: IAction): IStoreState {
    return DotProp.set(state, 'userStatus', action.value);
  }

  private static setSettings(state: IStoreState, action: IAction): IStoreState {
    return DotProp.set(state, 'settings', action.value);
  }

  private static setApp(state: IStoreState, action: IAction): IStoreState {
    return DotProp.set(state, 'app', action.value);
  }

  private static setIntegration(state: IStoreState, action: IAction): IStoreState {
    return DotProp.set(state, 'integration', action.value);
  }

  private static setUser(state: IStoreState, action: IAction): IStoreState {
    return DotProp.set(state, 'user', action.value);
  }

  private static unsetUser(state: IStoreState): IStoreState {
    return DotProp.set(state, 'user', null);
  }

  private static setApiToken(state: IStoreState, action: IAction): IStoreState {
    return DotProp.set(state, 'apiToken', action.value);
  }

  private static unsetApiToken(state: IStoreState): IStoreState {
    return DotProp.set(state, 'apiToken', null);
  }

  private static openChat(state: IStoreState): IStoreState {
    return DotProp.set(state, 'chatOpened', true);
  }

  private static closeChat(state: IStoreState): IStoreState {
    return DotProp.set(state, 'chatOpened', false);
  }

  private static setChatMessages(state: IStoreState, action: IAction): IStoreState {
    return DotProp.set(state, 'chatMessages', action.value);
  }

  private static addChatMessage(state: IStoreState, action: IAction): IStoreState {
    return DotProp.set(state, 'chatMessages', (chatMessages: ChatMessage[]) => [...chatMessages, action.value]);
  }

  private static updateChatMessage(state: IStoreState, action: IAction): IStoreState {
    return DotProp.set(state, 'chatMessages', (chatMessages: ChatMessage[]) => {
      const newChatMessages: ChatMessage[] = [];
      chatMessages.forEach((chatMessage) => {
        if (chatMessage.id === action.value.id) {
          newChatMessages.push(new ChatMessage(action.value.chatMessage));
        } else {
          newChatMessages.push(new ChatMessage(chatMessage));
        }
      });
      return newChatMessages;
    });
  }

  private static removeChatMessage(state: IStoreState, action: IAction): IStoreState {
    return DotProp.set(state, 'chatMessages', (chatMessages: ChatMessage[]) => {
      const newChatMessages: ChatMessage[] = [];
      chatMessages.forEach((chatMessage) => {
        if (chatMessage.id !== action.value.id) {
          newChatMessages.push(new ChatMessage(chatMessage));
        }
      });
      return newChatMessages;
    });
  }

  private constructor() {

  }
}
