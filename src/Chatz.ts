import 'whatwg-fetch';
import 'assets/css/main.less';

import {ChatzApp} from 'core/ChatzApp';
import {User} from 'models/User';

export class Chatz {

  public static init(data: any): Promise<void> {
    this.chatzApp = ChatzApp.getInstance();
    return this.chatzApp.init(data);
  }

  public static login(data: any): Promise<User> {
    this.assertInitCalled();
    return this.chatzApp.login(data);
  }

  public static logout(): Promise<void> {
    this.assertInitCalled();
    return this.chatzApp.logout();
  }

  public static updateUser(data: any): Promise<User> {
    this.assertInitCalled();
    return this.chatzApp.updateUser(data);
  }

  private static chatzApp: ChatzApp;

  private static assertInitCalled() {
    if (this.chatzApp == null) {
      throw new Error('Init function should be called first!');
    }
  }

  private constructor() {

  }
}
