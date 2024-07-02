import {makeAutoObservable, reaction} from 'mobx';
import {hydrateStore, makePersistable} from 'mobx-persist-store';
import {SOUND_CATEGORIES} from '@app/utils/constants';

type SoundState = {
  isPlaying: boolean;
  volume: number;
  wasPlaying?: boolean;
  dynamicVolume?: number; // New property for dynamic volume
};

export class SoundStore implements IStore {
  sounds: Record<string, SoundState> = {};
  allPaused: boolean = false;
  isDynamicMode: boolean = false; // New property for dynamic mode
  private dynamicInterval: NodeJS.Timeout | null = null;

  constructor() {
    makeAutoObservable(this);
    this.initializeSounds();
    makePersistable(this, {
      name: SoundStore.name,
      properties: ['sounds', 'allPaused', 'isDynamicMode'],
    });

    // Set up reaction for dynamic mode
    reaction(
      () => this.isDynamicMode,
      isDynamic => {
        if (isDynamic) {
          this.startDynamicMode();
        } else {
          this.stopDynamicMode();
        }
      },
    );
  }

  initializeSounds() {
    SOUND_CATEGORIES.forEach(category => {
      this.sounds[category.id] = {isPlaying: false, volume: 0};
    });
  }

  // setSound(id: string, isPlaying: boolean, volume: number) {
  //   this.sounds[id] = {...this.sounds[id], isPlaying, volume};
  // }

  toggleSound(id: string) {
    const sound = this.sounds[id];
    if (sound) {
      if (!sound.isPlaying) {
        this.setSound(id, true, 10);
      }
    }
  }

  setVolume(id: string, volume: number) {
    const sound = this.sounds[id];
    if (sound) {
      this.setSound(id, volume > 0, volume);
    }
  }

  resetSound(id: string) {
    this.setSound(id, false, 0);
  }

  resetAllSounds() {
    Object.keys(this.sounds).forEach(id => {
      this.setSound(id, false, 0);
    });
    this.allPaused = false;
  }

  pauseAllSounds() {
    if (!this.allPaused) {
      // Pause all playing sounds
      Object.entries(this.sounds).forEach(([id, sound]) => {
        if (sound.isPlaying) {
          this.sounds[id] = {...sound, isPlaying: false, wasPlaying: true};
        }
      });
      this.allPaused = true;
    } else {
      // Resume previously playing sounds
      Object.entries(this.sounds).forEach(([id, sound]) => {
        if (sound.wasPlaying) {
          this.sounds[id] = {...sound, isPlaying: true, wasPlaying: false};
        }
      });
      this.allPaused = false;
    }
  }

  randomSound() {
    Object.keys(this.sounds).forEach(id => {
      const isPlaying = Math.random() < 0.5; // 50% chance of playing
      const volume = isPlaying ? Math.floor(Math.random() * 101) : 0; // Random volume 0-100 if playing
      this.setSound(id, isPlaying, volume);
    });
  }

  toggleDynamicMode() {
    this.isDynamicMode = !this.isDynamicMode;
  }

  private startDynamicMode() {
    if (this.dynamicInterval) {
      clearInterval(this.dynamicInterval);
    }
    this.dynamicInterval = setInterval(() => {
      Object.entries(this.sounds).forEach(([id, sound]) => {
        if (sound.isPlaying) {
          const variation = (Math.random() * 0.2 - 0.1) * sound.volume; // -10% to +10%
          const newVolume = Math.max(0, Math.min(100, sound.volume + variation));
          this.sounds[id] = {...sound, dynamicVolume: newVolume};
        }
      });
    }, 5000); // Update every second
  }

  private stopDynamicMode() {
    if (this.dynamicInterval) {
      clearInterval(this.dynamicInterval);
      this.dynamicInterval = null;
    }
    // Reset dynamic volumes
    Object.keys(this.sounds).forEach(id => {
      if (this.sounds[id].dynamicVolume !== undefined) {
        this.sounds[id] = {...this.sounds[id], dynamicVolume: undefined};
      }
    });
  }

  // Override the existing setSound method to handle dynamic volume
  setSound(id: string, isPlaying: boolean, volume: number) {
    this.sounds[id] = {
      ...this.sounds[id],
      isPlaying,
      volume,
      dynamicVolume: this.isDynamicMode ? volume : undefined,
    };
  }

  // New getter for the effective volume (considering dynamic mode)
  getEffectiveVolume(id: string): number {
    const sound = this.sounds[id];
    return sound.dynamicVolume !== undefined ? sound.dynamicVolume : sound.volume;
  }

  hydrate = async (): Promise<void> => {
    await hydrateStore(this);
    if (this.isDynamicMode) {
      this.startDynamicMode();
    }
  };

  // Don't forget to clear the interval when the store is destroyed
  dispose() {
    if (this.dynamicInterval) {
      clearInterval(this.dynamicInterval);
    }
  }
}
