import Author from './Author';

export default class ChatMessage {

  public static readonly DIRECTION_OUTGOING: string = 'outgoing';
  public static readonly DIRECTION_INCOMING: string = 'incoming';

  public static readonly STATUS_SENDING: string = 'sending';
  public static readonly STATUS_SENT: string = 'sent';
  public static readonly STATUS_ERROR_SENDING: string = 'error_sending';

  public _id: string;
  public device: string;
  public author: Author;
  public text: string;
  public status: string;
  public direction: string;
  public date: Date;

  constructor(data?: any) {
    if (data) {
      this._id = data._id;
      this.device = data.device;
      this.author = new Author(data.author);
      this.text = data.text;
      this.status = data.status;
      this.direction = data.direction;
      this.date = data.date instanceof Date ? data.date : new Date(data.date);
    }
  }
}
