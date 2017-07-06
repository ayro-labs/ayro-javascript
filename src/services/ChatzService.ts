'use strict';

import User from '../models/User';
import Device from '../models/Device';
import ChatMessage from '../models/ChatMessage';

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

export default class ChatzService {

  private static readonly BASE_URL = 'http://api.chatz.io';
  private static readonly HEADERS = {
    'Content-Type': 'application/json'
  };

  private static apiToken: string;

  private constructor() {

  }

  private static getUrl(url: string) {
    return ChatzService.BASE_URL + url;
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
    return fetch(ChatzService.getUrl('/auth/users'), {
      method: 'POST',
      headers: ChatzService.HEADERS,
      body: JSON.stringify({
        app_token: appToken,
        user: user,
        device: device
      })
    }).then(function(response) {
      return ChatzService.checkStatus(response)
    }).then(function(response) {
      return ChatzService.parseJSON(response);
    }).then(function(response) {
      ChatzService.apiToken = response.token;
      return response;
    });
  };

  public static listChatMessages(): Promise<Array<ChatMessage>> {
    return fetch(ChatzService.getUrl('/chat'), {
      method: 'GET',
      headers: Object.assign({'X-Token': ChatzService.apiToken}, ChatzService.HEADERS)
    }).then(function(response) {
      return ChatzService.checkStatus(response)
    }).then(function(response) {
      return ChatzService.parseJSON(response);
    }).then(function(response) {
      let chatMessages = new Array<ChatMessage>();
      response.forEach(function(message) {
        let chatMessage = new ChatMessage(message);
        chatMessage.status = ChatMessage.STATUS_SENT;
        chatMessages.push(chatMessage);
      });
      return chatMessages;
    });
  };

  public static postChatMessage(message: string): Promise<void> {
    return fetch(ChatzService.getUrl('/chat/web'), {
      method: 'POST',
      headers: Object.assign({'X-Token': ChatzService.apiToken}, ChatzService.HEADERS),
      body: JSON.stringify({
        text: message
      })
    }).then(function(response) {
      return ChatzService.checkStatus(response)
    }).then(function(response) {
      return ChatzService.parseJSON(response);
    });
  };
}