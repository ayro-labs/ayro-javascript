import {Sound} from 'frame/utils/Sound';
import {Store} from 'frame/stores/Store';

export class Sounds {

  public static async init(): Promise<void> {
    if (Store.getState().settings.sounds) {
      await this.INCOMING_MESSAGE.load();
    }
  }

  public static playChatMessageSound(): void {
    if (Store.getState().settings.sounds) {
      this.INCOMING_MESSAGE.play();
    }
  }

  private static readonly INCOMING_MESSAGE = new Sound('https://cdn.ayro.io/sounds/incoming_message.mp3');

  private constructor() {

  }
}
