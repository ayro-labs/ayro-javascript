/* tslint:disable:variable-name */

export class DeviceInfo {

  public user_agent: string;
  public browser_name: string;
  public browser_version: string;
  public operating_system: string;
  public location: string;

  constructor(data?: any) {
    if (data) {
      this.user_agent = data.user_agent;
      this.browser_name = data.browser_name;
      this.browser_version = data.browser_version;
      this.operating_system = data.operating_system;
      this.location = data.location;
    }
  }
}
