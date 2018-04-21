import 'whatwg-fetch';
import 'assets/styles/main.less';

import {AyroApp} from 'core/AyroApp';
import {User} from 'models/User';

export function init(data: any): Promise<void> {
  const ayroApp = AyroApp.getInstance();
  return ayroApp.init(data);
}

export function login(data: any): Promise<User> {
  const ayroApp = AyroApp.getInstance();
  return ayroApp.login(data);
}

export function logout(): Promise<void> {
  const ayroApp = AyroApp.getInstance();
  return ayroApp.logout();
}

export function updateUser(data: any): Promise<User> {
  const ayroApp = AyroApp.getInstance();
  return ayroApp.updateUser(data);
}
