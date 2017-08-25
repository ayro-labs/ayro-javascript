import {ChatzError} from 'errors/ChatzError';

export class Messages {

  public static init() {
    Messages.MESSAGES.set(Messages.APP_DOES_NOT_EXIST, 'App does not exist, please make sure you initialize Chatz with the correct app token.');
  }

  public static get(err: ChatzError): string {
    return Messages.MESSAGES.has(err.code) ? Messages.MESSAGES.get(err.code) : err.message;
  }

  public static improve(err: ChatzError) {
    if (Messages.MESSAGES.has(err.code)) {
      err.message = Messages.MESSAGES.get(err.code);
    }
  }

  private static readonly APP_DOES_NOT_EXIST: string = 'app.doesNotExist';
  private static readonly MESSAGES: Map<string, string> = new Map<string, string>();

  private constructor() {

  }
}

Messages.init();
