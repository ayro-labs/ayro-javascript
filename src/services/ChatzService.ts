import {ChatzError} from 'errors/ChatzError';
import {App} from 'models/App';
import {Integration} from 'models/Integration';
import {User} from 'models/User';
import {Device} from 'models/Device';
import {ChatMessage} from 'models/ChatMessage';

export interface IInitResult {
  app: App;
  integration: Integration;
}

export interface ILoginResult {
  token: string;
  user: User;
}

export class ChatzService {

  public static init(appToken: string): Promise<IInitResult> {
    return fetch(ChatzService.getUrl('/apps/integrations/website/init'), {
      method: 'POST',
      headers: ChatzService.HEADERS,
      body: JSON.stringify({
        app_token: appToken,
      }),
    }).then((response: Response) => {
      return ChatzService.parseResponse(response);
    }).then((result: IInitResult) => {
      return {
        app: new App(result.app),
        integration: new Integration(result.integration),
      };
    });
  }

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
    }).then((result: ILoginResult) => {
      return {
        token: result.token,
        user: new User(result.user),
      };
    });
  }

  public static logout(apiToken: string): Promise<any> {
    return fetch(ChatzService.getUrl('/auth/users'), {
      method: 'DELETE',
      headers: Object.assign({'X-Token': apiToken}, ChatzService.HEADERS),
    }).then(() => {
      return null;
    });
  }

  public static listMessages(apiToken: string): Promise<ChatMessage[]> {
    return fetch(ChatzService.getUrl('/chat'), {
      method: 'GET',
      headers: Object.assign({'X-Token': apiToken}, ChatzService.HEADERS),
    }).then((response: Response) => {
      return ChatzService.parseResponse(response);
    }).then((response: any[]) => {
      const chatMessages: ChatMessage[] = [];
      response.forEach((message) => {
        const chatMessage = new ChatMessage(message);
        chatMessage.status = ChatMessage.STATUS_SENT;
        chatMessages.push(chatMessage);
      });
      return chatMessages;
    });
  }

  public static postMessage(apiToken: string, message: string): Promise<ChatMessage> {
    return fetch(ChatzService.getUrl('/chat/web'), {
      method: 'POST',
      headers: Object.assign({'X-Token': apiToken}, ChatzService.HEADERS),
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
