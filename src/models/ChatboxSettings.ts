/* tslint:disable:variable-name */

export class ChatboxSettings {

  public title: string = 'How can we help?';
  public input_placeholder: string = 'Type a message...';

  constructor(data?: any) {
    if (data) {
      if (data.title) {
        this.title = data.title;
      }
      if (data.input_placeholder) {
        this.input_placeholder = data.input_placeholder;
      }
    }
  }
}
