import {v4 as uuid} from 'uuid';

import {Device} from 'models/Device';
import {Storage} from 'utils/Storage';

export class App {

  public static getDevice(): Device {
    let deviceId = Storage.get(App.DEVICE_UID);
    if (!deviceId) {
      deviceId = uuid().replace(/-/g, '');
      Storage.set(App.DEVICE_UID, deviceId);
    }
    return new Device({
      uid: deviceId,
      platform: 'web',
    });
  }

  private static readonly DEVICE_UID: string = 'device_uid';

  private constructor() {

  }
}
