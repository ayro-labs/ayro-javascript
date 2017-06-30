'use strict';

import DeviceInfo from './DeviceInfo';

export default class Device {

  public uid: string;
  public platform: string;
  public app_id: string;
  public app_version: string;
  public push_token: string;
  public info: DeviceInfo;

}