import {v4 as uuid} from 'uuid';

import Device from 'models/Device';
import Storage from 'utils/Storage';

export default class App {

  public static getDevice(): Device {
    let uid = Storage.get(App.DEVICE_UID);
    if (!uid) {
      uid = uuid();
      Storage.set(App.DEVICE_UID, uid);
    }
    return new Device({
      uid,
      platform: 'web',
    });
  }

  private static readonly DEVICE_UID: string = 'device_uid';

  private constructor() {

  }
}
