import {v4 as uuid} from 'uuid';

import {Device} from 'models/Device';
import {Storage} from 'utils/Storage';

export class AppUtils {

  public static getDevice(): Device {
    return new Device({
      uid: AppUtils.getDeviceUid(),
      platform: 'web',
      info: {
        user_agent: navigator.userAgent,
        location: window.location.href,
      },
    });
  }

  private static readonly DEVICE_UID: string = 'device_uid';

  private static getDeviceUid() {
    let uid = Storage.get(AppUtils.DEVICE_UID);
    if (!uid) {
      uid = uuid().replace(/-/g, '');
      Storage.set(AppUtils.DEVICE_UID, uid);
    }
    return uid;
  }

  private constructor() {

  }
}
