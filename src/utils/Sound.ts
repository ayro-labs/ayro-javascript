export class Sound {

  private soundUrl: string;
  private context: AudioContext;
  private buffer: AudioBuffer;

  constructor(soundUrl: string) {
    try {
      this.soundUrl = soundUrl;
      this.context = new AudioContext();
    } catch (err) {
      // Nothing to do...
    }
  }

  public play() {
    if (!this.buffer) {
      return;
    }
    const gainNode = this.context.createGain();
    gainNode.gain.value = 0.5;
    gainNode.connect(this.context.destination);
    const source = this.context.createBufferSource();
    source.buffer = this.buffer;
    source.connect(gainNode);
    source.start();
  }

  public async load() {
    if (!this.context) {
      return;
    }
    if (this.context.state === 'running') {
      this.loadSound();
      return;
    }
    const onDocumentClick = () => {
      this.loadSound();
      document.removeEventListener('click', onDocumentClick);
    };
    document.addEventListener('click', onDocumentClick);
  }

  private async loadSound() {
    await this.context.resume();
    const response = await fetch(this.soundUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'audio/mp3',
      },
    });
    const audioData = await response.arrayBuffer();
    this.buffer = await this.context.decodeAudioData(audioData);
  }
}
