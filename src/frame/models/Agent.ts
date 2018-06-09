/* tslint:disable:variable-name */

export class Agent {

  public id: string;
  public name: string;
  public photo: string;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.photo = data.photo;
    }
  }
}
