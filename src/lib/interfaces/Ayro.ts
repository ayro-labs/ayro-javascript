import {User} from 'lib/interfaces/User';

export interface Ayro {
  getAppStatus: () => string;
  getUserStatus: () => string;
  init: (data: any) => Promise<void>;
  login: (data: any, jwtToken: string) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (data: any) => Promise<User>;
}
