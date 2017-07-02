'use strict';

export default class Settings {

  app_token: string

  constructor(data?: any) {
    if (data) {
      this.app_token = data.app_token;
    }
  }
}