export default class Classes {

  public static get(classes: any): string {
    const array: string[] = [];
    for (const key in classes) {
      if (classes[key]) {
        array.push(key);
      }
    }
    return array.join(' ');
  }

  private constructor() {

  }
}
