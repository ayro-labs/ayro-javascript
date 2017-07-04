'use strict';

import User from '../models/User';
import Device from '../models/Device';

import 'whatwg-fetch';

interface LoginResult {

  token: string;
  user: User;

}

class ApiError extends Error {

  response: any;

  constructor(response: any) {
    super(response.statusText);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.response = response;
  }
}

export default class ChatzClient {

  public static readonly ApiError = ApiError;

  private static readonly BASE_URL = 'http://api.chatz.io';
  private static readonly HEADERS = {
    'Content-Type': 'application/json'
  };

  private constructor() {

  }

  private static getUrl(url: string) {
    return ChatzClient.BASE_URL + url;
  }

  private static checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new ApiError(response);
    }
  }

  private static parseJSON(response) {
    return response.json();
  }

  public static login(appToken: string, user: User, device: Device): Promise<LoginResult> {
    return fetch(ChatzClient.getUrl('/auth/users'), {
      method: 'POST',
      headers: ChatzClient.HEADERS,
      body: JSON.stringify({
        app_token: appToken,
        user: user,
        device: device
      })
    }).then(function(response) {
      return ChatzClient.checkStatus(response)
    }).then(function(response) {
      return ChatzClient.parseJSON(response);
    });
  };

  public static postMessage(apiToken: string, message: string): Promise<void> {
    return fetch(ChatzClient.getUrl('/chat/web'), {
      method: 'POST',
      headers: Object.assign({'X-Token': apiToken}, ChatzClient.HEADERS),
      body: JSON.stringify({
        text: message
      })
    }).then(function(response) {
      return ChatzClient.checkStatus(response)
    }).then(function(response) {
      return ChatzClient.parseJSON(response);
    });
  };
}