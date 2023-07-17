// Might even want to import UserInput here eventually. Skeleton code for audio for now.

export default class AudioManager {
    constructor(scene) {
      this.scene = scene;
      this.sounds = {};
    }
  
    loadAudio(key, path) {
      this.scene.load.audio(key, path);
    }
  
    playAudio(key, config) {
      if (!this.sounds[key]) {
        this.sounds[key] = this.scene.sound.add(key, config);
      }
  
      this.sounds[key].play();
    }
  
    stopAudio(key) {
      if (this.sounds[key]) {
        this.sounds[key].stop();
      }
    }
  
    setVolume(key, volume) {
      if (this.sounds[key]) {
        this.sounds[key].setVolume(volume);
      }
    }
  }

  /* Example Use in  your scene:

  // In your scene's `preload()` method
this.audioManager = new AudioManager(this);
this.audioManager.loadAudio('backgroundMusic', 'assets/audio/music.mp3');

// In your scene's `create()` method
this.audioManager.playAudio('backgroundMusic', { loop: true });

// Whenever you want to change the volume
this.audioManager.setVolume('backgroundMusic', 0.5);

  */