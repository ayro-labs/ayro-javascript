'use strict';

import DeviceInfo from './DeviceInfo';

export default class Device {

  uid: string;
  platform: string;
  app_id: string;
  app_version: string;
  push_token: string;
  info: DeviceInfo;

}