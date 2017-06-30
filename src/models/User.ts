'use strict';

export default class User {

  public uid: string;
  public first_name: string;
  public last_name: string;
  public photo_url: string;
  public email: string;
  public sign_up_date: Date;
  public properties: Map<string, string>;

}