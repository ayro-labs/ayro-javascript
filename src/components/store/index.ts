'use strict';

import { createStore } from 'redux'

import * as actions from './actions';

import ChatMessage from '../../models/ChatMessage';

const INITIAL_STATE = {
  apiToken: null,
  chatOpened: false,
  chatMessages: new Array<ChatMessage>()
};

let reducer = (state, action) => {
  if (!state) {
    return INITIAL_STATE;
  }
  let newState: any = {};
  Object.assign(newState, state);
  switch (action.type) {
    case actions.CHAT_OPENED:
      newState.chatOpened = action.value;
      break;
    case actions.SET_API_TOKEN:
      newState.apiToken = action.value;
      break;
    case actions.ADD_MESSAGE:
      newState.chatMessages = newState.chatMessages.concat(action.value);
      break;
  }
  return newState;
};

export default createStore(reducer);