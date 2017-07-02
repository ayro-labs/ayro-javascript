'use strict';

export default class DeviceInfo {

  manufacturer: string;
  model: string;
  os_name: string;
  os_version: string;

  constructor(data?: any) {
    if (data) {
      this.manufacturer = data.manufacturer;
      this.model = data.model;
      this.os_name = data.os_name;
      this.os_version = data.os_version;
    }
  }
}