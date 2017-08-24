import {User} from 'models/User';
import {ChatboxSettings} from 'models/ChatboxSettings';

export class Settings {

  public app_token: string;
  public user: User;
  public chatbox: ChatboxSettings;

  constructor(data?: any) {
    if (data) {
      this.app_token = data.app_token;
      this.user = data.user;
      this.chatbox = new ChatboxSettings(data.chatbox);
    }
  }
}
