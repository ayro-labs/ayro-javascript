/* tslint:disable:variable-name */

import {ConnectChannelsMessageSettings} from 'frame/models/ConnectChannelsMessageSettings';

export class ChatboxSettings {

  private static readonly DEFAULT_TITLE = 'Como podemos ajudá-lo?';
  private static readonly DEFAULT_INPUT_PLACEHOLDER = 'Digite uma mensagem...';

  public title: string;
  public input_placeholder: string;
  public connect_channels_message: ConnectChannelsMessageSettings;

  constructor(data?: any) {
    const attrs = data || {};
    this.title = attrs.title || ChatboxSettings.DEFAULT_TITLE;
    this.input_placeholder = attrs.input_placeholder || ChatboxSettings.DEFAULT_INPUT_PLACEHOLDER;
    this.connect_channels_message = new ConnectChannelsMessageSettings(attrs.connect_channels_message);
  }
}
