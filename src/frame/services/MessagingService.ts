import * as Faye from 'faye';
import * as firebase from 'firebase/app';
import 'firebase/messaging';

import {ChatMessage} from 'frame/models/ChatMessage';
import {Actions} from 'frame/stores/Actions';
import {Store} from 'frame/stores/Store';

export class MessagingService {

  public static start(): void {
    const config = {
      apiKey: 'AIzaSyCtyxGruZtJPCgcdr0FpHFp0VGnQhci51c',
      projectId: 'ayro-testapp',
      messagingSenderId: '805636879679',
    };
    firebase.initializeApp(config);
    const messaging = firebase.messaging();
    messaging.getToken().then((currentToken) => {
      if (currentToken) {
        console.log(currentToken);
      } else {
        messaging.requestPermission().then(() => {
          console.log('Notification permission granted.');
        }).catch((err) => {
          console.log('Unable to get permission to notify.', err);
        });
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });

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
