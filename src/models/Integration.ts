export class Integration {

  public type: string;
  public channel: string;
  public configuration: any;
  public registration_date: Date;

  constructor(data?: any) {
    if (data) {
      this.type = data.type;
      this.channel = data.channel;
      this.configuration = data.configuration;
      this.registration_date = data.registration_date instanceof Date ? data.registration_date : new Date(data.registration_date);
    }
  }
}
