'use strict';

import { createStore } from 'redux'

import * as actions from './actions';

let reducer = (state, action) => {
  if (!state) {
    return {};
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
  }
  return newState;
};

export default createStore(reducer);