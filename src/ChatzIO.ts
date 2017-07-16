import './assets/css/main.less';
import 'whatwg-fetch';

import Components from './components/Components';
import Actions from './stores/Actions';
import Store from './stores/Store';

import ChatzService from './services/ChatzService';
import MessagingService from './services/MessagingService';
import App from './utils/App';

import Settings from './models/Settings';
import User from './models/User';

export default class ChatzIO {

  public init(data: any) {
    const settings = new Settings(data);
    Store.dispatch(Actions.setSettings(settings));
    this.login({});
  }

  public login(data: any) {
    const user = new User(data);
    const appToken = Store.getState().settings.app_token;
    Store.dispatch(Actions.setUser(user));
    ChatzService.login(appToken, user, App.getDevice()).then((result) => {
      Store.dispatch(Actions.setApiToken(result.token));
      Store.dispatch(Actions.setUser(new User(result.user)));
      MessagingService.start();
      Components.init();
    });
  }

  public logout() {
    Store.dispatch(Actions.unsetUser());
  }
}
