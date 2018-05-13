/* tslint:disable:variable-name */

export class Channel {

  public id: string;
  public name: string;
  public icon: string;
  public connected: boolean;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.icon = data.icon;
      this.connected = data.connected;
    }
  }
}
