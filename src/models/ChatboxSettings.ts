export default class ChatboxSettings {

  public title: string;
  public message_placeholder: string;

  constructor(data?: any) {
    if (data) {
      this.title = data.title || 'How can we help?';
      this.message_placeholder = data.message_placeholder || 'Type a message...';
    }
  }
}
