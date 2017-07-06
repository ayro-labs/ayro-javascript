'use strict';

export default class Html {

  private constructor() {

  }

  public static whenReady() {
    return new Promise((resolve) => {
      if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
        resolve();
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          resolve();
        });
      }
    });
  }
}