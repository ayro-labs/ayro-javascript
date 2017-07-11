import DeviceInfo from './DeviceInfo';

export default class Device {

  public uid: string;
  public platform: string;
  public info: DeviceInfo;

  constructor(data?: any) {
    if (data) {
      this.uid = data.uid;
      this.platform = data.platform;
      this.info = data.info instanceof Device ? data.info : new DeviceInfo(data.info);
    }
  }
}
