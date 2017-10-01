export class Author {

  public id: string;
  public name: string;
  public photo_url: string;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.photo_url = data.photo_url;
    }
  }
}
