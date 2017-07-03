'use strict';

export default class Classes {

  private constructor() {

  }

  public static get(classes: any): string {
    let array = new Array<string>();
    for (let key in classes) {
      if (classes[key]) {
        array.push(key);
      }
    }
    return array.join(' ');
  }
}