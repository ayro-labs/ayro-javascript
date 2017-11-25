import {AyroError} from 'errors/AyroError';
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

export class AyroService {

  public static init(appToken: string): Promise<IInitResult> {
    return fetch(AyroService.getUrl('/apps/integrations/website/init'), {
      method: 'POST',
      headers: AyroService.API_HEADERS,
      body: JSON.stringify({app_token: appToken}),
    }).then((response: Response) => {
      return AyroService.parseResponse(response);
    }).then((result: IInitResult) => {
      return {app: new App(result.app), integration: new Integration(result.integration)};
    });
  }

  public static login(appToken: string, user: User, device: Device): Promise<ILoginResult> {
    return fetch(AyroService.getUrl('/auth/users'), {
      method: 'POST',
      headers: AyroService.API_HEADERS,
      body: JSON.stringify({user, device, app_token: appToken}),
    }).then((response: Response) => {
      return AyroService.parseResponse(response);
    }).then((result: ILoginResult) => {
      return {token: result.token, user: new User(result.user)};
    });
  }

  public static logout(apiToken: string): Promise<any> {
    return fetch(AyroService.getUrl('/auth/users'), {
      method: 'DELETE',
      headers: AyroService.getHeaders(apiToken),
    }).then(() => {
      return null;
    });
  }

  public static updateUser(apiToken: string, user: User): Promise<User> {
    return fetch(AyroService.getUrl('/users'), {
      method: 'PUT',
      headers: AyroService.getHeaders(apiToken),
      body: JSON.stringify(user),
    }).then((response: Response) => {
      return AyroService.parseResponse(response);
    }).then((result: any) => {
      return new User(result);
    });
  }

  public static listMessages(apiToken: string): Promise<ChatMessage[]> {
    return fetch(AyroService.getUrl('/chat'), {
      method: 'GET',
      headers: AyroService.getHeaders(apiToken),
    }).then((response: Response) => {
      return AyroService.parseResponse(response);
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
    return fetch(AyroService.getUrl('/chat/web'), {
      method: 'POST',
      headers: AyroService.getHeaders(apiToken),
      body: JSON.stringify({
        text: message,
      }),
    }).then((response: Response) => {
      return AyroService.parseResponse(response);
    }).then((response: any) => {
      return new ChatMessage(response);
    });
  }

  private static readonly API_HEADERS: any = {'Content-Type': 'application/json'};

  private static getUrl(url: string): string {
    return process.env.API_URL + url;
  }

  private static getHeaders(apiToken: string) {
    return Object.assign({'X-Token': apiToken}, AyroService.API_HEADERS);
  }

  private static parseResponse(response: Response): any {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    } else {
      return AyroService.parseError(response);
    }
  }

  private static parseError(response: Response): any {
    return response.json().then((value) => {
      throw new AyroError(value);
    });
  }

  private constructor() {

  }
}
