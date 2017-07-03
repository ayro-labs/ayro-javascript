'use strict';

export default class Storage {

  private static readonly MEMORY_STORAGE = {};

  private constructor() {

  }

  public static set(key: string, value: string): void {
    try {
      if (localStorage) {
        localStorage.setItem(key, value);
      } else {
        Storage.MEMORY_STORAGE[key] = value;
      }
    } catch (err) {
      Storage.MEMORY_STORAGE[key] = value;
    }
  }

  public static get(key: string): string {
    let value;
    if (localStorage) {
      value = localStorage.getItem(key) || Storage.MEMORY_STORAGE[key];
    } else {
      value = Storage.MEMORY_STORAGE[key];
    }
    return value || null;
  }

  public static remove(key: string): void {
    if (localStorage) {
      localStorage.removeItem(key);
    }
    delete Storage.MEMORY_STORAGE[key];
  }
}