import {AyroError} from 'frame/errors/AyroError';

export class Messages {

  public static readonly APP_DOES_NOT_EXIST: string = 'app.doesNotExist';
  public static readonly CHANNEL_NOT_SUPPORTED: string = 'channel.notSupported';

  public static init(): void {
    Messages.MESSAGES.set(Messages.APP_DOES_NOT_EXIST, 'App does not exist, please make sure you initialize Ayro with the correct app token.');
    Messages.MESSAGES.set(Messages.CHANNEL_NOT_SUPPORTED, 'Channel not supported');
  }

  public static get(err: AyroError): string {
    return Messages.MESSAGES.has(err.code) ? Messages.MESSAGES.get(err.code) : err.message;
  }

  public static improve(err: AyroError): void {
    if (Messages.MESSAGES.has(err.code)) {
      err.message = Messages.MESSAGES.get(err.code);
    }
  }

  private static readonly MESSAGES: Map<string, string> = new Map<string, string>();

  private constructor() {

  }
}

Messages.init();
