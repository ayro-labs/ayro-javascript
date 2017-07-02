'use strict';

const memoryStorage = {};

function set(key: string, value: string): void {
  try {
    if (localStorage) {
      localStorage.setItem(key, value);
    } else {
      memoryStorage[key] = value;
    }
  } catch (err) {
    memoryStorage[key] = value;
  }
}

function get(key: string): string {
  let value;
  if (localStorage) {
    value = localStorage.getItem(key) || memoryStorage[key];
  } else {
    value = memoryStorage[key];
  }
  return value || null;
}

function remove(key: string): void {
  if (localStorage) {
    localStorage.removeItem(key);
  }
  delete memoryStorage[key];
}

export const storage = {set, get, remove};