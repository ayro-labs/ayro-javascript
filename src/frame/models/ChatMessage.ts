/* tslint:disable:variable-name */

import {Agent} from 'frame/models/Agent';
import {Media} from 'frame/models/Media';
import {QuickReply} from 'frame/models/QuickReply';

export class ChatMessage {

  public static readonly TYPE_TEXT = 'text';
  public static readonly TYPE_CONNECT_CHANNELS = 'connect_channels';
  public static readonly TYPE_FILE = 'file';

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
  public payload: string;
  public available_channels: string[];
  public media: Media;
  public quick_replies: QuickReply[];

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
      this.payload = data.payload;
      this.available_channels = data.available_channels;
      this.media = data.media ? new Media(data.media) : null;
      if (data.quick_replies) {
        this.quick_replies = [];
        (data.quick_replies as any[]).forEach((quickReply) => {
          this.quick_replies.push(new QuickReply(quickReply));
        });
      }
    }
  }
}
