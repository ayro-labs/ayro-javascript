import 'whatwg-fetch';
import 'assets/styles/main.less';

import {ChatzApp} from 'core/ChatzApp';
import {AppStatus} from 'enums/AppStatus';
import {User} from 'models/User';

export class Chatz {

  public static init(data: any): Promise<void> {
    this.chatzApp = ChatzApp.getInstance();
    return this.chatzApp.init(data);
  }

  public static login(data: any): Promise<User> {
    this.assertInitialized(Chatz.FUNC_LOGIN);
    return this.chatzApp.login(data);
  }

  public static logout(): Promise<void> {
    this.assertInitialized(Chatz.FUNC_LOGOUT);
    return this.chatzApp.logout();
  }

  public static updateUser(data: any): Promise<User> {
    this.assertInitialized(Chatz.FUNC_UPDATE_USER);
    return this.chatzApp.updateUser(data);
  }

  private static chatzApp: ChatzApp;

  private static readonly FUNC_LOGIN: string = 'login';
  private static readonly FUNC_LOGOUT: string = 'logout';
  private static readonly FUNC_UPDATE_USER: string = 'updateUser';

  private static assertInitialized(funcName: string) {
    if (this.chatzApp == null || this.chatzApp.getAppStatus() !== AppStatus.INITIALIZED) {
      throw new Error(`App not initialized, please make sure you call ${funcName} after init function completion.`);
    }
  }

  private constructor() {

  }
}
