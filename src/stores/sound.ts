// sound.ts
import {makeAutoObservable} from 'mobx';
import {hydrateStore, makePersistable} from 'mobx-persist-store';
import {SOUND_CATEGORIES} from '@app/utils/constants';

type SoundState = {
  isPlaying: boolean;
  volume: number;
};

export class SoundStore implements IStore {
  sounds: Record<string, SoundState> = {};

  constructor() {
    makeAutoObservable(this);
    this.initializeSounds();
    makePersistable(this, {
      name: SoundStore.name,
      properties: ['sounds'],
    });
  }

  initializeSounds() {
    SOUND_CATEGORIES.forEach(category => {
      this.sounds[category.id] = {isPlaying: false, volume: 0};
    });
  }

  setSound(id: string, isPlaying: boolean, volume: number) {
    this.sounds[id] = {isPlaying, volume};
  }

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
  }

  hydrate = async (): Promise<void> => {
    await hydrateStore(this);
  };
}
