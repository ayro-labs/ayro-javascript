'use strict';

export default class User {

  uid: string;
  first_name: string;
  last_name: string;
  photo_url: string;
  email: string;
  sign_up_date: Date;
  properties: Map<string, string>;

}