import {v4 as uuid} from 'uuid';

import {Device} from 'frame/models/Device';
import {ChatMessage} from 'frame/models/ChatMessage';
import {Storage} from 'frame/utils/Storage';

export class AppUtils {

  public static getDevice(): Device {
    return new Device({
      uid: AppUtils.getDeviceUid(),
      platform: AppUtils.DEVICE_PLATFORM,
      info: {
        user_agent: navigator.userAgent,
        location: window.location.href,
      },
    });
  }

  public static formatMessageTime(chatMessage: ChatMessage): string {
    const hours = chatMessage.date.getHours();
    const minutes = chatMessage.date.getMinutes();
    return [hours > 9 ? hours : '0' + hours, minutes > 9 ? minutes : '0' + minutes].join(':');
  }

  private static readonly DEVICE_UID = 'device_uid';
  private static readonly DEVICE_PLATFORM = 'browser';

  private static getDeviceUid(): string {
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
