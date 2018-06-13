/* tslint:disable:variable-name */

export class Media {

  public name: string;
  public type: string;
  public size: number;
  public url: string;
  public file: File;

  constructor(data?: any) {
    if (data) {
      this.name = data.name;
      this.type = data.type;
      this.size = data.size;
      this.url = data.url;
      this.file = data.file;
    }
  }
}
