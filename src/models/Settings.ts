'use strict';

import ChatboxSettings from './ChatboxSettings';

export default class Settings {

  app_token: string;
  chatbox: ChatboxSettings;

  constructor(data?: any) {
    if (data) {
      this.app_token = data.app_token;
      this.chatbox = new ChatboxSettings(data.chatbox);
    }
  }
}