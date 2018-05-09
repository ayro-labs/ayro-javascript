import {Store as ReduxStore, createStore, AnyAction} from 'redux';
import * as PubSub from 'pubsub-js';
import * as DotProp from 'dot-prop-immutable';

import {AppStatus} from 'enums/AppStatus';
import {UserStatus} from 'enums/UserStatus';
import {Settings} from 'models/Settings';
import {App} from 'models/App';
import {Integration} from 'models/Integration';
import {User} from 'models/User';
import {Device} from 'models/Device';
import {ChatMessage} from 'models/ChatMessage';
import {Actions} from 'stores/Actions';

export interface StoreState {
  appStatus: AppStatus;
  userStatus: UserStatus;
  settings: Settings;
  app: App;
  integration: Integration;
  user: User;
  device: Device;
  apiToken: string;
  chatOpened: boolean;
  chatMessages: ChatMessage[];
  lastUnread: ChatMessage;
}

export class Store {

  public static get(): ReduxStore<StoreState> {
    return Store.STORE;
  }

  public static getState(): StoreState {
    return Store.STORE.getState();
  }

  public static dispatch(action: AnyAction) {
    Store.STORE.dispatch(action);
  }

  private static readonly INITIAL_STATE: StoreState = {
    appStatus: null,
    userStatus: null,
    settings: null,
    app: null,
    integration: null,
    user: null,
    device: null,
    apiToken: null,
    chatOpened: false,
    chatMessages: [],
    lastUnread: null,
  };

  private static STORE: ReduxStore<StoreState> = createStore((state: StoreState, action: AnyAction) => {
    if (!state) {
      return Store.INITIAL_STATE;
    }
    let newState: StoreState = null;
    switch (action.type) {
      case Actions.OPEN_CHAT:
        newState = Store.openChat(state);
        break;
      case Actions.CLOSE_CHAT:
        newState = Store.closeChat(state);
        break;
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
      case Actions.SET_DEVICE:
        newState = Store.setDevice(state, action);
        break;
      case Actions.SET_API_TOKEN:
        newState = Store.setApiToken(state, action);
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
      case Actions.CLEAR_UNREADS:
        newState = Store.clearUnreads(state);
        break;
    }
    PubSub.publish(action.type, action);
    return newState;
  });

  private static openChat(state: StoreState): StoreState {
    let finalState = DotProp.set(state, 'chatOpened', true) as StoreState;
    finalState = DotProp.set(finalState, 'lastUnread', null) as StoreState;
    return finalState;
  }

  private static closeChat(state: StoreState): StoreState {
    return DotProp.set(state, 'chatOpened', false);
  }

  private static setAppStatus(state: StoreState, action: AnyAction): StoreState {
    return DotProp.set(state, 'appStatus', action.extraProps.appStatus);
  }

  private static setUserStatus(state: StoreState, action: AnyAction): StoreState {
    return DotProp.set(state, 'userStatus', action.extraProps.userStatus);
  }

  private static setSettings(state: StoreState, action: AnyAction): StoreState {
    return DotProp.set(state, 'settings', action.extraProps.settings);
  }

  private static setApp(state: StoreState, action: AnyAction): StoreState {
    return DotProp.set(state, 'app', action.extraProps.app);
  }

  private static setIntegration(state: StoreState, action: AnyAction): StoreState {
    return DotProp.set(state, 'integration', action.extraProps.integration);
  }

  private static setUser(state: StoreState, action: AnyAction): StoreState {
    return DotProp.set(state, 'user', action.extraProps.user);
  }

  private static setDevice(state: StoreState, action: AnyAction): StoreState {
    return DotProp.set(state, 'device', action.extraProps.device);
  }

  private static setApiToken(state: StoreState, action: AnyAction): StoreState {
    return DotProp.set(state, 'apiToken', action.extraProps.apiToken);
  }

  private static setChatMessages(state: StoreState, action: AnyAction): StoreState {
    return DotProp.set(state, 'chatMessages', action.extraProps.chatMessages);
  }

  private static addChatMessage(state: StoreState, action: AnyAction): StoreState {
    const chatMessage = action.extraProps.chatMessage;
    let finalState = DotProp.set(state, 'chatMessages', (chatMessages: ChatMessage[]) => [...chatMessages, chatMessage]) as StoreState;
    if (!finalState.chatOpened && chatMessage.direction === ChatMessage.DIRECTION_INCOMING) {
      finalState = DotProp.set(finalState, 'lastUnread', chatMessage);
    }
    return finalState;
  }

  private static updateChatMessage(state: StoreState, action: AnyAction): StoreState {
    return DotProp.set(state, 'chatMessages', (chatMessages: ChatMessage[]) => {
      const newChatMessages: ChatMessage[] = [];
      chatMessages.forEach((chatMessage) => {
        if (chatMessage.id === action.extraProps.id) {
          newChatMessages.push(new ChatMessage(action.extraProps.chatMessage));
        } else {
          newChatMessages.push(new ChatMessage(chatMessage));
        }
      });
      return newChatMessages;
    });
  }

  private static removeChatMessage(state: StoreState, action: AnyAction): StoreState {
    return DotProp.set(state, 'chatMessages', (chatMessages: ChatMessage[]) => {
      const newChatMessages: ChatMessage[] = [];
      chatMessages.forEach((chatMessage) => {
        if (chatMessage.id !== action.extraProps.chatMessage.id) {
          newChatMessages.push(new ChatMessage(chatMessage));
        }
      });
      return newChatMessages;
    });
  }

  private static clearUnreads(state: StoreState): StoreState {
    return DotProp.set(state, 'lastUnread', null);
  }

  private constructor() {

  }
}
