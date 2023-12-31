import {Store as ReduxStore, createStore, AnyAction} from 'redux';
import * as PubSub from 'pubsub-js';
import * as DotProp from 'dot-prop-immutable';

import {AppStatus} from 'frame/enums/AppStatus';
import {UserStatus} from 'frame/enums/UserStatus';
import {Settings} from 'frame/models/Settings';
import {App} from 'frame/models/App';
import {Integration} from 'frame/models/Integration';
import {User} from 'frame/models/User';
import {Device} from 'frame/models/Device';
import {ChatMessage} from 'frame/models/ChatMessage';
import {Actions} from 'frame/stores/Actions';

export interface StoreState {
  showButton: boolean;
  showChat: boolean;
  appStatus: AppStatus;
  userStatus: UserStatus;
  settings: Settings;
  app: App;
  integration: Integration;
  user: User;
  device: Device;
  devices: Device[];
  apiToken: string;
  chatMessages: ChatMessage[];
  lastUnread: ChatMessage;
  lastMessage: ChatMessage;
}

export class Store {

  public static get(): ReduxStore<StoreState> {
    return Store.STORE;
  }

  public static getState(): StoreState {
    return Store.STORE.getState();
  }

  public static dispatch(action: AnyAction): void {
    Store.STORE.dispatch(action);
  }

  private static readonly INITIAL_STATE: StoreState = {
    showButton: true,
    showChat: false,
    appStatus: null,
    userStatus: null,
    settings: null,
    app: null,
    integration: null,
    user: null,
    device: null,
    devices: [],
    apiToken: null,
    chatMessages: [],
    lastUnread: null,
    lastMessage: null,
  };

  private static STORE: ReduxStore<StoreState> = createStore((state: StoreState, action: AnyAction) => {
    if (!state) {
      return Store.INITIAL_STATE;
    }
    let newState: StoreState = null;
    switch (action.type) {
      case Actions.SHOW_BUTTON:
        newState = Store.showButton(state);
        break;
      case Actions.HIDE_BUTTON:
        newState = Store.hideButton(state);
        break;
      case Actions.SHOW_CHAT:
        newState = Store.showChat(state);
        break;
      case Actions.HIDE_CHAT:
        newState = Store.hideChat(state);
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
      case Actions.SET_DEVICES:
        newState = Store.setDevices(state, action);
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
      case Actions.SET_LAST_UNREAD:
        newState = Store.setLastUnread(state, action);
        break;
      case Actions.UNSET_LAST_UNREAD:
        newState = Store.unsetLastUnread(state);
        break;
    }
    PubSub.publish(action.type, action);
    return newState;
  });

  private static showButton(state: StoreState): StoreState {
    return DotProp.set(state, 'showButton', true);
  }

  private static hideButton(state: StoreState): StoreState {
    return DotProp.set(state, 'showButton', false);
  }

  private static showChat(state: StoreState): StoreState {
    return DotProp.set(state, 'showChat', true);
  }

  private static hideChat(state: StoreState): StoreState {
    return DotProp.set(state, 'showChat', false);
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

  private static setDevices(state: StoreState, action: AnyAction): StoreState {
    return DotProp.set(state, 'devices', action.extraProps.devices);
  }

  private static setApiToken(state: StoreState, action: AnyAction): StoreState {
    return DotProp.set(state, 'apiToken', action.extraProps.apiToken);
  }

  private static setChatMessages(state: StoreState, action: AnyAction): StoreState {
    const chatMessages = action.extraProps.chatMessages as ChatMessage[];
    let newState = DotProp.set(state, 'chatMessages', chatMessages);
    newState = DotProp.set(newState, 'lastMessage', chatMessages[chatMessages.length - 1]);
    return newState;
  }

  private static addChatMessage(state: StoreState, action: AnyAction): StoreState {
    const chatMessage = action.extraProps.chatMessage as ChatMessage;
    let newState = DotProp.set(state, 'chatMessages', (chatMessages: ChatMessage[]) => [...chatMessages, chatMessage]);
    newState = DotProp.set(newState, 'lastMessage', chatMessage);
    return newState;
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

  private static setLastUnread(state: StoreState, action: AnyAction): StoreState {
    return DotProp.set(state, 'lastUnread', action.extraProps.chatMessage);
  }

  private static unsetLastUnread(state: StoreState): StoreState {
    return DotProp.set(state, 'lastUnread', null);
  }

  private constructor() {

  }
}
