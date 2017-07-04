'use strict';

export default class DeviceInfo {

  browser_name: string;
  browser_version: string;

  constructor(data?: any) {
    if (data) {
      this.browser_name = data.browser_name;
      this.browser_version = data.browser_version;
    }
  }
}