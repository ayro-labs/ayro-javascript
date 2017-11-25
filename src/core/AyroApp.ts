import {Components} from 'components/Components';
import {AyroError} from 'errors/AyroError';
import {AyroService} from 'services/AyroService';
import {MessagingService} from 'services/MessagingService';
import {AppStatus} from 'enums/AppStatus';
import {UserStatus} from 'enums/UserStatus';
import {Settings} from 'models/Settings';
import {User} from 'models/User';
import {Actions} from 'stores/Actions';
import {Store} from 'stores/Store';
import {App} from 'utils/App';
import {Messages} from 'utils/Messages';

export class AyroApp {

  public static getInstance(): AyroApp {
    if (!AyroApp.instance) {
      AyroApp.instance = new AyroApp();
    }
    return AyroApp.instance;
  }

  private static instance: AyroApp;

  private constructor() {
    Store.dispatch(Actions.setAppStatus(AppStatus.NOT_INITIALIZED));
    Store.dispatch(Actions.setUserStatus(UserStatus.LOGGED_OUT));
  }

  public getAppStatus(): AppStatus {
    return Store.getState().appStatus;
  }

  public getUserStatus(): UserStatus {
    return Store.getState().userStatus;
  }

  public init(data: any): Promise<void> {
    const settings = new Settings(data);
    Store.dispatch(Actions.setSettings(settings));
    return AyroService.init(settings.app_token).then((result) => {
      Store.dispatch(Actions.setAppStatus(AppStatus.INITIALIZED));
      Store.dispatch(Actions.setApp(result.app));
      Store.dispatch(Actions.setIntegration(result.integration));
      Components.init();
    }).catch((err: AyroError) => {
      Messages.improve(err);
      throw err;
    });
  }

  public login(data: any): Promise<User> {
    this.fixUserAttributes(data);
    const user = App.getUser(data);
    Store.dispatch(Actions.setUser(user));
    const appToken = Store.getState().settings.app_token;
    return AyroService.login(appToken, user, App.getDevice()).then((result) => {
      Store.dispatch(Actions.setUserStatus(UserStatus.LOGGED_IN));
      Store.dispatch(Actions.setUser(result.user));
      Store.dispatch(Actions.setApiToken(result.token));
      MessagingService.start();
      return result.user;
    }).catch((err: AyroError) => {
      Messages.improve(err);
      throw err;
    });
  }

  public logout(): Promise<void> {
    return AyroService.logout(Store.getState().apiToken).then(() => {
      Store.dispatch(Actions.setUserStatus(UserStatus.LOGGED_OUT));
      Store.dispatch(Actions.unsetUser());
      Store.dispatch(Actions.unsetApiToken());
      MessagingService.stop();
    }).catch((err: AyroError) => {
      Messages.improve(err);
      throw err;
    });
  }

  public updateUser(data: any): Promise<User> {
    this.fixUserAttributes(data);
    const user = App.getUser(data);
    Store.dispatch(Actions.setUser(user));
    return AyroService.updateUser(Store.getState().apiToken, user).then((updatedUser) => {
      Store.dispatch(Actions.setUser(updatedUser));
      return updatedUser;
    }).catch((err: AyroError) => {
      Messages.improve(err);
      throw err;
    });
  }

  private fixUserAttributes(data: any) {
    if (data) {
      delete data.id;
      delete data.identified;
    }
  }
}
