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
        newState = DotProp.set(state, 'appStatus', action.value);
        break;
      case Actions.SET_USER_STATUS:
        newState = DotProp.set(state, 'userStatus', action.value);
        break;
      case Actions.SET_SETTINGS:
        newState = DotProp.set(state, 'settings', action.value);
        break;
      case Actions.SET_APP:
        newState = DotProp.set(state, 'app', action.value);
        break;
      case Actions.SET_INTEGRATION:
        newState = DotProp.set(state, 'integration', action.value);
        break;
      case Actions.SET_USER:
        newState = DotProp.set(state, 'user', action.value);
        break;
      case Actions.UNSET_USER:
        newState = DotProp.set(state, 'user', null);
        break;
      case Actions.SET_API_TOKEN:
        newState = DotProp.set(state, 'apiToken', action.value);
        break;
      case Actions.UNSET_API_TOKEN:
        newState = DotProp.set(state, 'apiToken', null);
        break;
      case Actions.OPEN_CHAT:
        newState = DotProp.set(state, 'chatOpened', true);
        break;
      case Actions.CLOSE_CHAT:
        newState = DotProp.set(state, 'chatOpened', false);
        break;
      case Actions.SET_CHAT_MESSAGES:
        newState = DotProp.set(state, 'chatMessages', action.value);
        break;
      case Actions.ADD_CHAT_MESSAGE:
        newState = DotProp.set(state, 'chatMessages', (chatMessages: ChatMessage[]) => [...chatMessages, action.value]);
        break;
      case Actions.UPDATE_CHAT_MESSAGE:
        newState = DotProp.set(state, 'chatMessages', (chatMessages: ChatMessage[]) => {
          const newChatMessages: ChatMessage[] = [];
          chatMessages.forEach((chatMessage) => {
            if (chatMessage.id === action.value.id) {
              newChatMessages.push(action.value.chatMessage);
            } else {
              newChatMessages.push(chatMessage);
            }
          });
          return newChatMessages;
        });
        break;
    }
    PubSub.publish(action.type, action);
    return newState;
  });

  private constructor() {

  }
}
