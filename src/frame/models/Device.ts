/* tslint:disable:variable-name */

import {DeviceInfo} from 'frame/models/DeviceInfo';

export class Device {

  public id: string;
  public uid: string;
  public channel: string;
  public platform: string;
  public info: DeviceInfo;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.uid = data.uid;
      this.channel = data.channel;
      this.platform = data.platform;
      this.info = new DeviceInfo(data.info);
    }
  }
}
