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
import {Channel} from 'models/Channel';
import {Actions} from 'stores/Actions';

export interface StoreState {
  showButton: boolean;
  showChat: boolean;
  showConnectChannel: boolean;
  channelToConnect: Channel;
  appStatus: AppStatus;
  userStatus: UserStatus;
  settings: Settings;
  app: App;
  integration: Integration;
  user: User;
  device: Device;
  apiToken: string;
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
    showButton: true,
    showChat: false,
    showConnectChannel: false,
    appStatus: null,
    userStatus: null,
    settings: null,
    app: null,
    integration: null,
    user: null,
    device: null,
    apiToken: null,
    chatMessages: [],
    lastUnread: null,
    channelToConnect: null,
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
      case Actions.SHOW_CONNECT_CHANNEL:
        newState = Store.showConnectChannel(state);
        break;
      case Actions.HIDE_CONNECT_CHANNEL:
        newState = Store.hideConnectChannel(state);
        break;
      case Actions.SET_CHANNEL_TO_CONNECT:
        newState = Store.setChannelToConnect(state, action);
        break;
      case Actions.UNSET_CHANNEL_TO_CONNECT:
        newState = Store.unsetChannelToConnect(state);
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

  private static showConnectChannel(state: StoreState): StoreState {
    return DotProp.set(state, 'showConnectChannel', true);
  }

  private static hideConnectChannel(state: StoreState): StoreState {
    return DotProp.set(state, 'showConnectChannel', false);
  }

  private static setChannelToConnect(state: StoreState, action: AnyAction): StoreState {
    return DotProp.set(state, 'channelToConnect', action.extraProps.channel);
  }

  private static unsetChannelToConnect(state: StoreState): StoreState {
    return DotProp.set(state, 'channelToConnect', null);
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
    const buttonDisplayed = state.showButton && !state.showChat && !state.showConnectChannel;
    let updatedState = DotProp.set(state, 'chatMessages', (chatMessages: ChatMessage[]) => [...chatMessages, chatMessage]) as StoreState;
    if (buttonDisplayed && chatMessage.direction === ChatMessage.DIRECTION_INCOMING) {
      updatedState = DotProp.set(updatedState, 'lastUnread', chatMessage);
    }
    return updatedState;
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
