import * as Faye from 'faye';

import {ChatMessage} from 'frame/models/ChatMessage';
import {Actions} from 'frame/stores/Actions';
import {Store} from 'frame/stores/Store';

export class MessagingService {

  public static start(): void {
    if (!MessagingService.socket) {
      MessagingService.socket = new Faye.Client(process.env.WEBCM_URL, {
        timeout: MessagingService.FAYE_TIMEOUT_SECONDS,
        retry: MessagingService.FAYE_RETRY_SECONDS,
      });
      MessagingService.socket.addExtension(MessagingService.authenticationExtension());
    }
    const device = Store.getState().device;
    MessagingService.subscription = MessagingService.socket.subscribe(`/devices/${device.id}`, (data: any) => {
      MessagingService.messageReceived(data);
    });
  }

  public static stop(): void {
    if (MessagingService.subscription) {
      MessagingService.subscription.cancel();
    }
  }

  private static readonly EVENT_CHAT_MESSAGE: string = 'chat_message';
  private static readonly FAYE_RETRY_SECONDS: number = 5;
  private static readonly FAYE_TIMEOUT_SECONDS: number = 60;

  private static socket: any;
  private static subscription: any;

  private static messageReceived(data: any): void {
    switch (data.event) {
      case MessagingService.EVENT_CHAT_MESSAGE:
        const chatMessage = new ChatMessage(data.message);
        chatMessage.status = ChatMessage.STATUS_SENT;
        chatMessage.direction = ChatMessage.DIRECTION_INCOMING;
        Store.dispatch(Actions.addChatMessage(chatMessage));
        break;
    }
  }

  private static authenticationExtension(): any {
    return {
      outgoing: (message: any, callback: (message: any) => void) => {
        if (!message.ext) {
          message.ext = {};
        }
        message.ext.api_token = Store.getState().apiToken;
        callback(message);
      },
    };
  }

  private constructor() {

  }
}
