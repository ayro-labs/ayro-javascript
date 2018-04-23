import {Components} from 'components/Components';
import {AyroService} from 'services/AyroService';
import {MessagingService} from 'services/MessagingService';
import {AppStatus} from 'enums/AppStatus';
import {UserStatus} from 'enums/UserStatus';
import {Settings} from 'models/Settings';
import {User} from 'models/User';
import {Actions} from 'stores/Actions';
import {Store} from 'stores/Store';
import {AppUtils} from 'utils/AppUtils';
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

  public async init(data: any): Promise<void> {
    try {
      const settings = new Settings(data);
      Store.dispatch(Actions.setSettings(settings));
      const result = await AyroService.init(settings.app_token, AppUtils.getDevice());
      Store.dispatch(Actions.setAppStatus(AppStatus.INITIALIZED));
      Store.dispatch(Actions.setApp(result.app));
      Store.dispatch(Actions.setIntegration(result.integration));
      Store.dispatch(Actions.setUser(result.user));
      Store.dispatch(Actions.setApiToken(result.token));
      Components.init();
      MessagingService.start();
    } catch (err) {
      Messages.improve(err);
      throw err;
    }
  }

  public async login(data: any): Promise<User> {
    this.assertInitialized();
    try {
      const user = new User(data);
      const apiToken = Store.getState().apiToken;
      const appToken = Store.getState().settings.app_token;
      const result = await AyroService.login(apiToken, appToken, user, AppUtils.getDevice());
      Store.dispatch(Actions.setUserStatus(UserStatus.LOGGED_IN));
      Store.dispatch(Actions.setUser(result.user));
      Store.dispatch(Actions.setApiToken(result.token));
      MessagingService.stop();
      MessagingService.start();
      return result.user;
    } catch (err) {
      Messages.improve(err);
      throw err;
    }
  }

  public async logout(): Promise<void> {
    this.assertInitialized();
    this.assertAuthenticated();
    try {
      const result = await AyroService.logout(Store.getState().apiToken);
      Store.dispatch(Actions.setUserStatus(UserStatus.LOGGED_OUT));
      Store.dispatch(Actions.setUser(result.user));
      Store.dispatch(Actions.setApiToken(result.token));
      MessagingService.stop();
      MessagingService.start();
    } catch (err) {
      Messages.improve(err);
      throw err;
    }
  }

  public async updateUser(data: any): Promise<User> {
    this.assertInitialized();
    this.assertAuthenticated();
    try {
      const user = new User(data);
      const updatedUser = await AyroService.updateUser(Store.getState().apiToken, user);
      Store.dispatch(Actions.setUser(updatedUser));
      return updatedUser;
    } catch (err) {
      Messages.improve(err);
      throw err;
    }
  }

  private assertInitialized() {
    if (this.getAppStatus() !== AppStatus.INITIALIZED) {
      throw new Error('App not initialized, please make sure you call init function first.');
    }
  }

  private assertAuthenticated() {
    if (this.getUserStatus() !== UserStatus.LOGGED_IN) {
      throw new Error('User is not authenticated, please make sure you call login function first.');
    }
  }
}
