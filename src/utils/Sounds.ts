import {Sound} from 'utils/Sound';
import {Store} from 'stores/Store';

export class Sounds {

  public static async init() {
    if (Store.getState().settings.sounds) {
      await this.incomingMessageSound.load();
    }
  }

  public static playChatMessageSound() {
    if (Store.getState().settings.sounds) {
      this.incomingMessageSound.play();
    }
  }

  private static incomingMessageSound: Sound = new Sound('https://cdn.ayro.io/incoming-message.mp3');

}
