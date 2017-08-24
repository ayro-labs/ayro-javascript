import {DeviceInfo} from 'models/DeviceInfo';

export class Device {

  public uid: string;
  public platform: string;
  public info: DeviceInfo;

  constructor(data?: any) {
    if (data) {
      this.uid = data.uid;
      this.platform = data.platform;
      this.info = new DeviceInfo(data.info);
    }
  }
}
