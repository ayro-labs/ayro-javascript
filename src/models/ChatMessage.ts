import {Agent} from 'models/Agent';

export class ChatMessage {

  public static readonly DIRECTION_OUTGOING: string = 'outgoing';
  public static readonly DIRECTION_INCOMING: string = 'incoming';

  public static readonly STATUS_SENDING: string = 'sending';
  public static readonly STATUS_SENT: string = 'sent';
  public static readonly STATUS_ERROR: string = 'error';

  public id: string;
  public device: string;
  public agent: Agent;
  public text: string;
  public status: string;
  public direction: string;
  public date: Date;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.device = data.device;
      this.agent = new Agent(data.agent);
      this.text = data.text;
      this.status = data.status;
      this.direction = data.direction;
      this.date = data.date instanceof Date ? data.date : new Date(data.date);
    }
  }
}
