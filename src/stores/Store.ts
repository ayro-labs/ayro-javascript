import {Store as ReduxStore, createStore} from 'redux';
import * as PubSub from 'pubsub-js';
import * as DotProp from 'dot-prop-immutable';

import Actions from './Actions';

import ChatMessage from '../models/ChatMessage';

export default class Store {

  public static get(): ReduxStore<any> {
    return Store.STORE;
  }

  public static getState() {
    return Store.STORE.getState();
  }

  public static dispatch(action: any) {
    Store.STORE.dispatch(action);
  }

  private static readonly INITIAL_STATE: any = {
    settings: null,
    user: null,
    apiToken: null,
    chatOpened: false,
    chatMessages: [],
  };

  private static STORE: ReduxStore<any> = createStore((state: any, action: any) => {
    if (!state) {
      return Store.INITIAL_STATE;
    }
    let newState: any = null;
    switch (action.type) {
      case Actions.OPEN_CHAT:
        newState = DotProp.set(state, 'chatOpened', true);
        break;
      case Actions.CLOSE_CHAT:
        newState = DotProp.set(state, 'chatOpened', false);
        break;
      case Actions.SET_SETTINGS:
        newState = DotProp.set(state, 'settings', action.value);
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
            if (chatMessage._id === action.id) {
              newChatMessages.push(action.value);
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
