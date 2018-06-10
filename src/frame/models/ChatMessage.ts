/* tslint:disable:variable-name */

import {Agent} from 'frame/models/Agent';

export class ChatMessage {

  public static readonly TYPE_TEXT = 'text';
  public static readonly TYPE_CONNECT_CHANNELS = 'connect_channels';

  public static readonly DIRECTION_OUTGOING = 'outgoing';
  public static readonly DIRECTION_INCOMING = 'incoming';

  public static readonly STATUS_SENDING = 'sending';
  public static readonly STATUS_SENT = 'sent';
  public static readonly STATUS_ERROR = 'error';

  public id: string;
  public device: string;
  public agent: Agent;
  public type: string;
  public text: string;
  public status: string;
  public direction: string;
  public date: Date;

  // Specific attributes
  public available_channels: string[];

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.device = data.device;
      this.agent = data.agent ? new Agent(data.agent) : null;
      this.type = data.type;
      this.text = data.text;
      this.status = data.status;
      this.direction = data.direction;
      this.date = data.date instanceof Date ? data.date : new Date(data.date);

      // Specific attributes
      this.available_channels = data.available_channels;
    }
  }
}
