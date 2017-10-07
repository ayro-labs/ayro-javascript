import {v4 as uuid} from 'uuid';

import {User} from 'models/User';
import {Device} from 'models/Device';
import {Storage} from 'utils/Storage';

export class App {

  public static getUser(data: any): User {
    const user = new User(data);
    if (!user.uid) {
      let uid = Storage.get(App.USER_UID);
      if (!uid) {
        uid = uuid().replace(/-/g, '');
        Storage.set(App.USER_UID, uid);
      }
      user.uid = uid;
      user.identified = false;
    } else {
      user.identified = true;
    }
    return user;
  }

  public static getDevice(): Device {
    let uid = Storage.get(App.DEVICE_UID);
    if (!uid) {
      uid = uuid().replace(/-/g, '');
      Storage.set(App.DEVICE_UID, uid);
    }
    return new Device({
      uid,
      platform: 'web',
    });
  }

  private static readonly USER_UID: string = 'user_uid';
  private static readonly DEVICE_UID: string = 'device_uid';

  private constructor() {

  }
}
