import {Components} from 'components/Components';
import {ChatzService} from 'services/ChatzService';
import {MessagingService} from 'services/MessagingService';
import {AppStatus} from 'enums/AppStatus';
import {UserStatus} from 'enums/UserStatus';
import {Settings} from 'models/Settings';
import {User} from 'models/User';
import {Actions} from 'stores/Actions';
import {Store} from 'stores/Store';
import {App} from 'utils/App';

export class ChatzApp {

  public static getInstance(): ChatzApp {
    if (!ChatzApp.instance) {
      ChatzApp.instance = new ChatzApp();
    }
    return ChatzApp.instance;
  }

  private static instance: ChatzApp;

  private constructor() {
    Store.dispatch(Actions.setAppStatus(AppStatus.NOT_INITIALIZED));
    Store.dispatch(Actions.setUserStatus(UserStatus.LOGGED_OUT));
  }

  public init(data: any) {
    const settings = new Settings(data);
    Store.dispatch(Actions.setSettings(settings));
    ChatzService.init(settings.app_token).then((result) => {
      Store.dispatch(Actions.setAppStatus(AppStatus.INITIALIZED));
      Store.dispatch(Actions.setApp(result.app));
      Store.dispatch(Actions.setIntegration(result.integration));
      Components.init();
    });
  }

  public login(data: any): Promise<User> {
    const user = new User(data);
    const appToken = Store.getState().settings.app_token;
    Store.dispatch(Actions.setUser(user));
    return ChatzService.login(appToken, user, App.getDevice()).then((result) => {
      Store.dispatch(Actions.setUserStatus(UserStatus.LOGGED_IN));
      Store.dispatch(Actions.setUser(result.user));
      Store.dispatch(Actions.setApiToken(result.token));
      MessagingService.start();
      return result.user;
    });
  }

  public logout() {
    ChatzService.logout(Store.getState().apiToken).then(() => {
      Store.dispatch(Actions.setUserStatus(UserStatus.LOGGED_OUT));
      Store.dispatch(Actions.unsetUser());
      Store.dispatch(Actions.unsetApiToken());
      MessagingService.stop();
    });
  }
}
