import 'whatwg-fetch';
import 'assets/styles/main.less';
import 'assets/img/btn-icon.less';

import {AyroApp} from 'core/AyroApp';
import {AppStatus} from 'enums/AppStatus';
import {User} from 'models/User';

export class Ayro {

  public static init(data: any): Promise<void> {
    this.ayroApp = AyroApp.getInstance();
    return this.ayroApp.init(data);
  }

  public static login(data: any): Promise<User> {
    this.assertInitialized(Ayro.FUNC_LOGIN);
    return this.ayroApp.login(data);
  }

  public static logout(): Promise<void> {
    this.assertInitialized(Ayro.FUNC_LOGOUT);
    return this.ayroApp.logout();
  }

  public static updateUser(data: any): Promise<User> {
    this.assertInitialized(Ayro.FUNC_UPDATE_USER);
    return this.ayroApp.updateUser(data);
  }

  private static ayroApp: AyroApp;

  private static readonly FUNC_LOGIN: string = 'login';
  private static readonly FUNC_LOGOUT: string = 'logout';
  private static readonly FUNC_UPDATE_USER: string = 'updateUser';

  private static assertInitialized(funcName: string) {
    if (this.ayroApp == null || this.ayroApp.getAppStatus() !== AppStatus.INITIALIZED) {
      throw new Error(`App not initialized, please make sure you call ${funcName} after init function completion.`);
    }
  }

  private constructor() {

  }
}
