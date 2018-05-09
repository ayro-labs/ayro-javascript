/* tslint:disable:variable-name */

import {ChatboxSettings} from 'models/ChatboxSettings';

export class Settings {

  public app_token: string;
  public chatbox: ChatboxSettings;
  public sounds: boolean;

  constructor(data?: any) {
    if (data) {
      this.app_token = data.app_token;
      this.chatbox = new ChatboxSettings(data.chatbox);
      this.sounds = data.sounds || true;
    }
  }
}
