export class ChatboxSettings {

  public title: string;
  public input_placeholder: string;

  constructor(data?: any) {
    if (data) {
      this.title = data.title || 'How can we help?';
      this.input_placeholder = data.input_placeholder || 'Type a message...';
    }
  }
}
