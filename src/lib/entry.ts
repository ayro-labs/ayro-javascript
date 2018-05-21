import 'lib/assets/styles/main.less';

import {Components} from 'lib/components/Components';
import {User} from 'lib/interfaces/User';

export async function init(data: any): Promise<void> {
  await Components.init();
  return Components.getLibrary().init(data);
}

export function login(data: any, jwtToken: string): Promise<User> {
  return Components.getLibrary().login(data, jwtToken);
}

export function logout(): Promise<void> {
  return Components.getLibrary().logout();
}

export function updateUser(data: any): Promise<User> {
  return Components.getLibrary().updateUser(data);
}

export function getAppStatus(): string {
  return Components.getLibrary().getAppStatus();
}

export function getUserStatus(): string {
  return Components.getLibrary().getUserStatus();
}
