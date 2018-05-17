/* tslint:disable:variable-name */

import {Agent} from 'frame/models/Agent';

interface Metadata {
  available_channels: string[];
}

export class ChatMessage {

  public static readonly TYPE_TEXT: string = 'text';
  public static readonly TYPE_CONNECT_CHANNELS: string = 'connect_channels';

  public static readonly DIRECTION_OUTGOING: string = 'outgoing';
  public static readonly DIRECTION_INCOMING: string = 'incoming';

  public static readonly STATUS_SENDING: string = 'sending';
  public static readonly STATUS_SENT: string = 'sent';
  public static readonly STATUS_ERROR: string = 'error';

  public id: string;
  public device: string;
  public agent: Agent;
  public type: string;
  public text: string;
  public status: string;
  public direction: string;
  public metadata: Metadata;
  public date: Date;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.device = data.device;
      this.agent = data.agent ? new Agent(data.agent) : null;
      this.type = data.type;
      this.text = data.text;
      this.status = data.status;
      this.direction = data.direction;
      this.metadata = data.metadata;
      this.date = data.date instanceof Date ? data.date : new Date(data.date);
    }
  }
}
