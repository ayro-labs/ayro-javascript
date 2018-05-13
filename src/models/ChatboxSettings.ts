/* tslint:disable:variable-name */

export class ChatboxSettings {

  private static readonly DEFAULT_TITLE = 'How can we help?';
  private static readonly DEFAULT_INPUT_PLACEHOLDER = 'Type a message...';
  private static readonly DEFAULT_CONNECT_CHANNELS_MESSAGE_PLACEHOLDER = 'Conecte seus apps e seja notificado dentro deles quando for respondido.';

  public title: string;
  public input_placeholder: string;
  public connect_channels_message: string;

  constructor(data?: any) {
    if (data) {
      this.title = data.title || ChatboxSettings.DEFAULT_TITLE;
      this.input_placeholder = data.input_placeholder || ChatboxSettings.DEFAULT_INPUT_PLACEHOLDER;
      this.connect_channels_message = data.connect_channels_message || ChatboxSettings.DEFAULT_CONNECT_CHANNELS_MESSAGE_PLACEHOLDER;
    }
  }
}
