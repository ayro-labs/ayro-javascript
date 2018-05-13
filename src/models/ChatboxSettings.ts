/* tslint:disable:variable-name */

export class ChatboxSettings {

  private static readonly DEFAULT_TITLE = 'Como podemos ajudá-lo?';
  private static readonly DEFAULT_INPUT_PLACEHOLDER = 'Digite uma mensagem...';
  private static readonly DEFAULT_CONNECT_CHANNELS_MESSAGE = 'Conecte seus aplicativos e seja notificado dentro deles quando for respondido.';

  public title: string;
  public input_placeholder: string;
  public connect_channels_message: string;

  constructor(data?: any) {
    const attrs = data || {};
    this.title = attrs.title || ChatboxSettings.DEFAULT_TITLE;
    this.input_placeholder = attrs.input_placeholder || ChatboxSettings.DEFAULT_INPUT_PLACEHOLDER;
    this.connect_channels_message = attrs.connect_channels_message || ChatboxSettings.DEFAULT_CONNECT_CHANNELS_MESSAGE;
  }
}
