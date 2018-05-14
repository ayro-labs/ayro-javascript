export class Sound {

  private url: string;
  private context: AudioContext;
  private buffer: AudioBuffer;

  constructor(url: string) {
    try {
      this.url = url;
      this.context = new AudioContext();
    } catch (err) {
      // Nothing to do...
    }
  }

  public async play() {
    if (!this.buffer) {
      // Loads asynchronously and probably will play in the next time
      this.load();
      return;
    }
    const gainNode = this.context.createGain();
    gainNode.gain.value = 0.6;
    gainNode.connect(this.context.destination);
    const source = this.context.createBufferSource();
    source.buffer = this.buffer;
    source.connect(gainNode);
    source.start();
  }

  public load() {
    if (!this.context || this.buffer) {
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
    try {
      await this.context.resume();
      const response = await fetch(this.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'audio/mp3',
        },
      });
      const audioData = await response.arrayBuffer();
      this.buffer = await this.context.decodeAudioData(audioData);
    } catch (err) {
      // Nothing to do...
    }
  }
}
