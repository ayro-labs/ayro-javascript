'use strict';

import Author from './Author';

export default class ChatMessage {

  public static readonly DIRECTION_OUTGOING = 'OUTGOING';
  public static readonly DIRECTION_INCOMING = 'INCOMING';

  public static readonly STATUS_SENDING = 'SENDING';
  public static readonly STATUS_SENT = 'SENT';
  public static readonly STATUS_ERROR_SENDING = 'ERROR_SENDING';

  author: Author;
  text: string;
  status: string;
  direction: string;
  date: Date;

  constructor(data?: any) {
    if (data) {
      this.author = data.author;
      this.text = data.text;
      this.status = data.status;
      this.direction = data.direction;
      this.date = data.date;
    }
  }
}