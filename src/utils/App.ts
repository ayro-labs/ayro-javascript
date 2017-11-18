import {v4 as uuid} from 'uuid';

import {User} from 'models/User';
import {Device} from 'models/Device';
import {Storage} from 'utils/Storage';

export class App {

  public static getUser(data: any): User {
    const user = new User(data);
    if (!user.uid) {
      user.uid = App.getUserUid();
      user.identified = false;
    } else {
      user.identified = true;
    }
    return user;
  }

  public static getDevice(): Device {
    return new Device({
      uid: App.getDeviceUid(),
      platform: 'web',
      info: {
        user_agent: navigator.userAgent,
        location: window.location.href,
      },
    });
  }

  private static readonly USER_UID: string = 'user_uid';
  private static readonly DEVICE_UID: string = 'device_uid';

  private static getUserUid() {
    let uid = Storage.get(App.USER_UID);
    if (!uid) {
      uid = App.generateUid();
      Storage.set(App.USER_UID, uid);
    }
    return uid;
  }

  private static getDeviceUid() {
    let uid = Storage.get(App.DEVICE_UID);
    if (!uid) {
      uid = App.generateUid();
      Storage.set(App.DEVICE_UID, uid);
    }
    return uid;
  }

  private static generateUid() {
    return uuid().replace(/-/g, '');
  }

  private constructor() {

  }
}
