export class App {

  public id: string;
  public name: string;
  public icon: string;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.icon = data.icon;
    }
  }
}
