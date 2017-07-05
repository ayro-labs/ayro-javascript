'use strict';

import { v4 as uuid } from 'uuid';

import Device from '../models/Device';
import Storage from './Storage';

export default class App {

  private static readonly DEVICE_UID = 'device_uid';

  private constructor() {

  }

  public static getDevice(): Device {
    let uid = Storage.get(App.DEVICE_UID);
    if (!uid) {
      uid = uuid();
      Storage.set(App.DEVICE_UID, uid);
    }
    return new Device({
      uid: uid,
      platform: 'web'
    });
  }
}