'use strict';

import { createStore } from 'redux'

import Actions from './Actions';

import ChatMessage from '../models/ChatMessage';

const INITIAL_STATE: any = {
  apiToken: null,
  user: null,
  chatOpened: false,
  chatMessages: new Array<ChatMessage>()
};

const REDUCER = (state, action) => {
  if (!state) {
    return INITIAL_STATE;
  }
  let newState: any = {};
  Object.assign(newState, state);
  switch (action.type) {
    case Actions.CHAT_OPENED:
      newState.chatOpened = action.value;
      break;
    case Actions.SET_API_TOKEN:
      newState.apiToken = action.value;
      break;
    case Actions.SET_USER:
      newState.user = action.value;
      break;
    case Actions.UNSET_USER:
      newState.user = null;
      break;
    case Actions.SET_CHAT_MESSAGES:
      newState.chatMessages = action.value;
      break;
    case Actions.ADD_CHAT_MESSAGE:
      newState.chatMessages = newState.chatMessages.concat(action.value);
      break;
  }
  return newState;
};

export default createStore(REDUCER);