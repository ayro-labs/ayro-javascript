'use strict';

export default class User {

  uid: string;
  first_name: string;
  last_name: string;
  photo_url: string;
  email: string;
  sign_up_date: Date;
  properties: Map<string, string>;

  constructor(data?: any) {
    if (data) {
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