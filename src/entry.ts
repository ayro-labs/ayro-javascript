import {Chatz} from 'Chatz';
import {User} from 'models/User';

export function init(data: any): Promise<void> {
  return Chatz.init(data);
}

export function login(data: any): Promise<User> {
  return Chatz.login(data);
}

export function logout(): Promise<void> {
  return Chatz.logout();
}

export function updateUser(data: any): Promise<User> {
  return Chatz.updateUser(data);
}
