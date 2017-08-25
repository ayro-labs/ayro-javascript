import 'whatwg-fetch';
import 'assets/css/main.less';

import {ChatzApp} from 'core/ChatzApp';
import {User} from 'models/User';

export class Chatz {

  private chatzApp: ChatzApp;

  public init(data: any): Promise<void> {
    this.chatzApp = ChatzApp.getInstance();
    return this.chatzApp.init(data);
  }

  public login(data: any): Promise<User> {
    this.assertInitCalledFirst();
    return this.chatzApp.login(data);
  }

  public logout(): Promise<void> {
    this.assertInitCalledFirst();
    return this.chatzApp.logout();
  }

  public updateUser(data: any): Promise<User> {
    this.assertInitCalledFirst();
    return this.chatzApp.updateUser(data);
  }

  private assertInitCalledFirst() {
    if (this.chatzApp == null) {
      throw new Error('Init function should be called first!');
    }
  }
}
