import 'whatwg-fetch';
import 'frame/assets/styles/main.less';

import {AyroApp} from 'frame/core/AyroApp';
import {User} from 'frame/models/User';
import {AppStatus} from 'frame/enums/AppStatus';
import {UserStatus} from 'frame/enums/UserStatus';

export function getAppStatus(): AppStatus {
  const ayroApp = AyroApp.getInstance();
  return ayroApp.getAppStatus();
}

export function getUserStatus(): UserStatus {
  const ayroApp = AyroApp.getInstance();
  return ayroApp.getUserStatus();
}

export function init(data: any): Promise<void> {
  const ayroApp = AyroApp.getInstance();
  return ayroApp.init(data);
}

export function login(data: any, jwtToken: string): Promise<User> {
  const ayroApp = AyroApp.getInstance();
  return ayroApp.login(data, jwtToken);
}

export function logout(): Promise<void> {
  const ayroApp = AyroApp.getInstance();
  return ayroApp.logout();
}

export function updateUser(data: any): Promise<User> {
  const ayroApp = AyroApp.getInstance();
  return ayroApp.updateUser(data);
}
