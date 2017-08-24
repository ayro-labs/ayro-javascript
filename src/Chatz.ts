import 'whatwg-fetch';
import 'assets/css/main.less';

import {ChatzApp} from 'core/ChatzApp';

export class Chatz {

  private chatzApp: ChatzApp;

  public init(data: any) {
    this.chatzApp = ChatzApp.getInstance();
    this.chatzApp.init(data);
  }

  public login(data: any) {
    this.assertInitCalledFirst();
    this.chatzApp.login(data);
  }

  public logout() {
    this.assertInitCalledFirst();
    this.chatzApp.logout();
  }

  private assertInitCalledFirst() {
    if (this.chatzApp == null) {
      throw new Error('Init function should be called first!');
    }
  }
}
