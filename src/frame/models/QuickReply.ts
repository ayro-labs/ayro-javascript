/* tslint:disable:variable-name */

export class QuickReply {

  public type: string;
  public title: string;
  public payload: string;
  public icon_url: string;

  constructor(data?: any) {
    if (data) {
      this.type = data.type;
      this.title = data.title;
      this.payload = data.payload;
      this.icon_url = data.icon_url;
    }
  }
}
