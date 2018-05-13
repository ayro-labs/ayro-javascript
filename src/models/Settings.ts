/* tslint:disable:variable-name */

import {ChatboxSettings} from 'models/ChatboxSettings';

export class Settings {

  public app_token: string;
  public sounds: boolean;
  public chatbox: ChatboxSettings;

  constructor(data?: any) {
    const attrs = data || {};
    this.app_token = attrs.app_token;
    this.sounds = attrs.sounds || true;
    this.chatbox = new ChatboxSettings(attrs.chatbox);
  }
}
