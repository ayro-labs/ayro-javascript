export default class User {

  public _id: string;
  public uid: string;
  public first_name: string;
  public last_name: string;
  public photo_url: string;
  public email: string;
  public sign_up_date: Date;
  public properties: Map<string, string>;

  constructor(data?: any) {
    if (data) {
      this._id = data._id;
      this.uid = data.uid;
      this.first_name = data.first_name;
      this.last_name = data.last_name;
      this.photo_url = data.photo_url;
      this.email = data.email;
      this.sign_up_date = data.sign_up_date;
      this.properties = data.properties;
    }
  }
}
