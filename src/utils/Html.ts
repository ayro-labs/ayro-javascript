export class Html {

  public static whenReady(document: Document): Promise<{}> {
    return new Promise((resolve) => {
      const readyStates = ['complete', 'loaded', 'interactive'];
      if (readyStates.includes(document.readyState)) {
        resolve();
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          resolve();
        });
      }
    });
  }

  private constructor() {

  }
}
