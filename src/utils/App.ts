import {v4 as uuid} from 'uuid';

import {Device} from 'models/Device';
import {Storage} from 'utils/Storage';

export class App {

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

  private static readonly DEVICE_UID: string = 'device_uid';

  private static getDeviceUid() {
    let uid = Storage.get(App.DEVICE_UID);
    if (!uid) {
      uid = uuid().replace(/-/g, '');
      Storage.set(App.DEVICE_UID, uid);
    }
    return uid;
  }

  private constructor() {

  }
}
