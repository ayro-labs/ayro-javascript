'use strict';

import Author from './Author';

export default class ChatMessage {

  public static readonly DIRECTION_OUTGOING = 'outgoing';
  public static readonly DIRECTION_INCOMING = 'incoming';

  public static readonly STATUS_SENDING = 'sending';
  public static readonly STATUS_SENT = 'sent';
  public static readonly STATUS_ERROR_SENDING = 'error_sending';

  _id: string;
  device: string;
  author: Author;
  text: string;
  status: string;
  direction: string;
  date: Date;

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