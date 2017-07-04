'use strict';

import DeviceInfo from './DeviceInfo';

export default class Device {

  uid: string;
  platform: string;
  info: DeviceInfo;

  constructor(data?: any) {
    if (data) {
      this.uid = data.uid;
      this.platform = data.platform;
      this.info = data.info instanceof Device ? data.info : new DeviceInfo(data.info);
    }
  }
}