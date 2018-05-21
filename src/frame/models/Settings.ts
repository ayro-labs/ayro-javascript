/* tslint:disable:variable-name */

import {ChatboxSettings} from 'frame/models/ChatboxSettings';
import {ConnectEmailSettings} from 'frame/models/ConnectEmailSettings';

export class Settings {

  public app_token: string;
  public channel: string;
  public sounds: boolean;
  public chatbox: ChatboxSettings;
  public connect_email: ConnectEmailSettings;

  constructor(data?: any) {
    const attrs = data || {};
    this.app_token = attrs.app_token;
    this.channel = attrs.channel || 'website';
    this.sounds = attrs.sounds || true;
    this.chatbox = new ChatboxSettings(attrs.chatbox);
    this.connect_email = new ConnectEmailSettings(attrs.connect_email);
  }
}
