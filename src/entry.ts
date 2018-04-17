import 'whatwg-fetch';
import 'assets/styles/main.less';

import {Ayro} from 'Ayro';
import {User} from 'models/User';

export function init(data: any): Promise<void> {
  return Ayro.init(data);
}

export function login(data: any): Promise<User> {
  return Ayro.login(data);
}

export function logout(): Promise<void> {
  return Ayro.logout();
}

export function updateUser(data: any): Promise<User> {
  return Ayro.updateUser(data);
}
