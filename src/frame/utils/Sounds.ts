import {Settings} from 'frame/models/Settings';
import {Sound} from 'frame/utils/Sound';

export class Sounds {

  public static init(settings: Settings): void {
    if (settings.sounds) {
      Sounds.enabled = true;
      this.INCOMING_MESSAGE.load();
    }
  }

  public static playChatMessageSound(): void {
    if (Sounds.enabled) {
      this.INCOMING_MESSAGE.play();
    }
  }

  private static readonly INCOMING_MESSAGE = new Sound('https://cdn.ayro.io/sounds/incoming_message.mp3');

  private static enabled = false;

  private constructor() {

  }
}
