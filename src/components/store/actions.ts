'use strict';

import ChatMessage from '../../models/ChatMessage';

export const CHAT_OPENED = 'CHAT_OPENED';
export const SET_API_TOKEN = 'SET_API_TOKEN';
export const ADD_MESSAGE = 'ADD_MESSAGE';

export function openChat() {
  return {
    type: CHAT_OPENED,
    value: true
  };
}

export function closeChat() {
  return {
    type: CHAT_OPENED,
    value: false
  };
}

export function setApiToken(apiToken: string) {
  return {
    type: SET_API_TOKEN,
    value: apiToken
  }
}

export function addMessage(chatMessage: ChatMessage) {
  return {
    type: ADD_MESSAGE,
    value: chatMessage
  }
}