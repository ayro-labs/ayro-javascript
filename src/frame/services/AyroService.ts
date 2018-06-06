import {AyroError} from 'frame/errors/AyroError';
import {App} from 'frame/models/App';
import {Integration} from 'frame/models/Integration';
import {User} from 'frame/models/User';
import {Device} from 'frame/models/Device';
import {ChatMessage} from 'frame/models/ChatMessage';

export interface InitResult {
  app: App;
  integration: Integration;
  user: User;
  device: Device;
  token: string;
}

export interface LoginResult {
  user: User;
  device: Device;
  token: string;
}

export interface LogoutResult {
  user: User;
  device: Device;
  token: string;
}

export class AyroService {

  public static async init(appToken: string, channel: string, device: Device): Promise<InitResult> {
    const response = await fetch(AyroService.getUrl(`/apps/integrations/${channel}/init`), {
      method: 'POST',
      headers: AyroService.API_HEADERS,
      body: JSON.stringify({device, app_token: appToken}),
    });
    const result = await AyroService.parseResponse(response);
    return {
      app: new App(result.app),
      integration: new Integration(result.integration),
      user: new User(result.user),
      device: new Device(result.device),
      token: result.token,
    };
  }

  public static async login(apiToken: string, appToken: string, jwtToken: string, user: User, device: Device): Promise<LoginResult> {
    const response = await fetch(AyroService.getUrl('/users/login'), {
      method: 'POST',
      headers: AyroService.getHeaders(apiToken),
      body: JSON.stringify({user, device, jwt: jwtToken, app_token: appToken}),
    });
    const result = await AyroService.parseResponse(response);
    return {
      user: new User(result.user),
      device: new Device(result.device),
      token: result.token,
    };
  }

  public static async logout(apiToken: string): Promise<LogoutResult> {
    const response = await fetch(AyroService.getUrl('/users/logout'), {
      method: 'POST',
      headers: AyroService.getHeaders(apiToken),
    });
    const result = await AyroService.parseResponse(response);
    return {
      user: new User(result.user),
      device: new Device(result.device),
      token: result.token,
    };
  }

  public static async updateUser(apiToken: string, user: User): Promise<User> {
    const response = await fetch(AyroService.getUrl('/users'), {
      method: 'PUT',
      headers: AyroService.getHeaders(apiToken),
      body: JSON.stringify(user),
    });
    const result = await AyroService.parseResponse(response);
    return new User(result);
  }

  public static async trackViewChat(apiToken: string): Promise<void> {
    const response = await fetch(AyroService.getUrl(`/events/view_chat`), {
      method: 'POST',
      headers: AyroService.getHeaders(apiToken),
    });
    await AyroService.parseResponse(response);
  }

  public static async listDevices(apiToken: string): Promise<Device[]> {
    const response = await fetch(AyroService.getUrl('/users/devices'), {
      method: 'GET',
      headers: AyroService.getHeaders(apiToken),
    });
    const result = await AyroService.parseResponse(response);
    const devices: Device[] = [];
    result.forEach((device: any) => {
      devices.push(new Device(device));
    });
    return devices;
  }

  public static async listMessages(apiToken: string): Promise<ChatMessage[]> {
    const response = await fetch(AyroService.getUrl('/chat'), {
      method: 'GET',
      headers: AyroService.getHeaders(apiToken),
    });
    const result = await AyroService.parseResponse(response);
    const chatMessages: ChatMessage[] = [];
    result.forEach((message: any) => {
      const chatMessage = new ChatMessage(message);
      chatMessage.status = ChatMessage.STATUS_SENT;
      chatMessages.push(chatMessage);
    });
    return chatMessages;
  }

  public static async postMessage(apiToken: string, message: string): Promise<ChatMessage> {
    const response = await fetch(AyroService.getUrl('/chat'), {
      method: 'POST',
      headers: AyroService.getHeaders(apiToken),
      body: JSON.stringify({
        type: 'text',
        text: message,
      }),
    });
    const result = await AyroService.parseResponse(response);
    return new ChatMessage(result);
  }

  public static async connectEmail(apiToken: string, email: string): Promise<void> {
    const response = await fetch(AyroService.getUrl('/users/connect/email'), {
      method: 'POST',
      headers: AyroService.getHeaders(apiToken),
      body: JSON.stringify({email}),
    });
    await AyroService.parseResponse(response);
  }

  private static readonly API_HEADERS: any = {'Content-Type': 'application/json'};

  private static getUrl(url: string): string {
    return process.env.API_URL + url;
  }

  private static getHeaders(apiToken: string): any {
    const headers = Object.assign({}, AyroService.API_HEADERS);
    if (apiToken) {
      headers.authorization = `Bearer ${apiToken}`;
    }
    return headers;
  }

  private static async parseResponse(response: Response): Promise<any> {
    const result = await response.json();
    if (response.status >= 200 && response.status < 300) {
      return result;
    }
    throw new AyroError(result);
  }

  private constructor() {

  }
}
