import 'whatwg-fetch';

import ChatzError from './ChatzError';

import User from '../models/User';
import Device from '../models/Device';
import ChatMessage from '../models/ChatMessage';

interface ILoginResult {
  token: string;
  user: User;
}

export default class ChatzService {

  public static login(appToken: string, user: User, device: Device): Promise<ILoginResult> {
    return fetch(ChatzService.getUrl('/auth/users'), {
      method: 'POST',
      headers: ChatzService.HEADERS,
      body: JSON.stringify({
        user,
        device,
        app_token: appToken,
      }),
    }).then((response: Response) => {
      return ChatzService.parseResponse(response);
    }).then((response: any) => {
      ChatzService.apiToken = response.token;
      return response;
    });
  }

  public static listMessages(): Promise<ChatMessage[]> {
    return fetch(ChatzService.getUrl('/chat'), {
      method: 'GET',
      headers: Object.assign({'X-Token': ChatzService.apiToken}, ChatzService.HEADERS),
    }).then((response: Response) => {
      return ChatzService.parseResponse(response);
    }).then((response: any) => {
      const chatMessages: ChatMessage[] = [];
      response.forEach((message: ChatMessage) => {
        const chatMessage = new ChatMessage(message);
        chatMessage.status = ChatMessage.STATUS_SENT;
        chatMessages.push(chatMessage);
      });
      return chatMessages;
    });
  }

  public static postMessage(message: string): Promise<ChatMessage> {
    return fetch(ChatzService.getUrl('/chat/web'), {
      method: 'POST',
      headers: Object.assign({'X-Token': ChatzService.apiToken}, ChatzService.HEADERS),
      body: JSON.stringify({
        text: message,
      }),
    }).then((response: Response) => {
      return ChatzService.parseResponse(response);
    }).then((response: any) => {
      return new ChatMessage(response);
    });
  }

  private static readonly BASE_URL: string = 'http://api.chatz.io';
  private static readonly HEADERS: any = {'Content-Type': 'application/json'};

  private static apiToken: string;

  private static getUrl(url: string): string {
    return ChatzService.BASE_URL + url;
  }

  private static parseResponse(response: Response): any {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    } else {
      throw new ChatzError(response);
    }
  }

  private constructor() {

  }
}
