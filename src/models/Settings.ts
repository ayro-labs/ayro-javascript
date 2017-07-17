import ChatboxSettings from 'models/ChatboxSettings';

export default class Settings {

  public app_token: string;
  public chatbox: ChatboxSettings;

  constructor(data?: any) {
    if (data) {
      this.app_token = data.app_token;
      this.chatbox = new ChatboxSettings(data.chatbox);
    }
  }
}
