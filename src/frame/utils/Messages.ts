import {Settings} from 'frame/models/Settings';
import {AyroError} from 'frame/errors/AyroError';

export class Messages {

  public static readonly APP_NOT_FOUND = 'app_not_found';
  public static readonly CHANNEL_NOT_SUPPORTED = 'channel_not_supported';
  public static readonly FILE_SIZE_LIMIT_EXCEEDED = 'file_size_limit_exceeded';

  public static init(settings: Settings): void {
    Messages.MESSAGES.set(Messages.APP_NOT_FOUND, 'App does not exist, please make sure you initialize Ayro with the correct app token.');
    Messages.MESSAGES.set(Messages.CHANNEL_NOT_SUPPORTED, 'Channel not supported');
    Messages.MESSAGES.set(Messages.FILE_SIZE_LIMIT_EXCEEDED, settings.chatbox.errors.file_size_limit_exceeded);
  }

  public static get(err: AyroError): string {
    return Messages.MESSAGES.has(err.code) ? Messages.MESSAGES.get(err.code) : err.message;
  }

  public static improve(err: AyroError): void {
    if (Messages.MESSAGES.has(err.code)) {
      err.message = Messages.MESSAGES.get(err.code);
    }
  }

  private static readonly MESSAGES = new Map<string, string>();

  private constructor() {

  }
}
