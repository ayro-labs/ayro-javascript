import {Store as ReduxStore, createStore, AnyAction} from 'redux';
import * as PubSub from 'pubsub-js';
import * as DotProp from 'dot-prop-immutable';

import {AppStatus} from 'enums/AppStatus';
import {UserStatus} from 'enums/UserStatus';
import {Settings} from 'models/Settings';
import {App} from 'models/App';
import {Integration} from 'models/Integration';
import {User} from 'models/User';
import {ChatMessage} from 'models/ChatMessage';
import {Actions} from 'stores/Actions';

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
  lastUnread: ChatMessage;
}

export class Store {

  public static get(): ReduxStore<IStoreState> {
    return Store.STORE;
  }

  public static getState(): IStoreState {
    return Store.STORE.getState();
  }

  public static dispatch(action: AnyAction) {
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
    lastUnread: null,
  };

  private static STORE: ReduxStore<IStoreState> = createStore((state: IStoreState, action: AnyAction) => {
    if (!state) {
      return Store.INITIAL_STATE;
    }
    let newState: IStoreState = null;
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
      case Actions.UNSET_USER:
        newState = Store.unsetUser(state);
        break;
      case Actions.SET_API_TOKEN:
        newState = Store.setApiToken(state, action);
        break;
      case Actions.UNSET_API_TOKEN:
        newState = Store.unsetApiToken(state);
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

  private static openChat(state: IStoreState): IStoreState {
    let finalState = DotProp.set(state, 'chatOpened', true) as IStoreState;
    finalState = DotProp.set(finalState, 'lastUnread', null) as IStoreState;
    return finalState;
  }

  private static closeChat(state: IStoreState): IStoreState {
    return DotProp.set(state, 'chatOpened', false);
  }

  private static setAppStatus(state: IStoreState, action: AnyAction): IStoreState {
    return DotProp.set(state, 'appStatus', action.extraProps.appStatus);
  }

  private static setUserStatus(state: IStoreState, action: AnyAction): IStoreState {
    return DotProp.set(state, 'userStatus', action.extraProps.userStatus);
  }

  private static setSettings(state: IStoreState, action: AnyAction): IStoreState {
    return DotProp.set(state, 'settings', action.extraProps.settings);
  }

  private static setApp(state: IStoreState, action: AnyAction): IStoreState {
    return DotProp.set(state, 'app', action.extraProps.app);
  }

  private static setIntegration(state: IStoreState, action: AnyAction): IStoreState {
    return DotProp.set(state, 'integration', action.extraProps.integration);
  }

  private static setUser(state: IStoreState, action: AnyAction): IStoreState {
    return DotProp.set(state, 'user', action.extraProps.user);
  }

  private static unsetUser(state: IStoreState): IStoreState {
    return DotProp.set(state, 'user', null);
  }

  private static setApiToken(state: IStoreState, action: AnyAction): IStoreState {
    return DotProp.set(state, 'apiToken', action.extraProps.apiToken);
  }

  private static unsetApiToken(state: IStoreState): IStoreState {
    return DotProp.set(state, 'apiToken', null);
  }

  private static setChatMessages(state: IStoreState, action: AnyAction): IStoreState {
    return DotProp.set(state, 'chatMessages', action.extraProps.chatMessages);
  }

  private static addChatMessage(state: IStoreState, action: AnyAction): IStoreState {
    const chatMessage = action.extraProps.chatMessage;
    let finalState = DotProp.set(state, 'chatMessages', (chatMessages: ChatMessage[]) => [...chatMessages, chatMessage]) as IStoreState;
    if (!finalState.chatOpened && chatMessage.direction === ChatMessage.DIRECTION_INCOMING) {
      finalState = DotProp.set(finalState, 'lastUnread', chatMessage);
    }
    return finalState;
  }

  private static updateChatMessage(state: IStoreState, action: AnyAction): IStoreState {
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

  private static removeChatMessage(state: IStoreState, action: AnyAction): IStoreState {
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

  private static clearUnreads(state: IStoreState): IStoreState {
    return DotProp.set(state, 'lastUnread', null);
  }

  private constructor() {

  }
}
