import {makeAutoObservable} from 'mobx';
import {hydrateStore, makePersistable} from 'mobx-persist-store';
import {Time, Season, Weather, timeToUI, seasonToUI, weatherToUI} from '@app/utils/types/enums';

export class EnvironmentStore implements IStore {
  time: Time = 'day';
  season: Season = 'spring';
  weather: Weather = 'sunny';

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: EnvironmentStore.name,
      properties: ['time', 'season', 'weather'],
    });
  }

  get timeStr() {
    return timeToUI[this.time];
  }

  get seasonStr() {
    return seasonToUI[this.season];
  }

  get weatherStr() {
    return weatherToUI[this.weather];
  }

  set<T extends keyof EnvironmentStore>(what: T, value: EnvironmentStore[T]) {
    (this as EnvironmentStore)[what] = value;
  }

  setMany<T extends keyof EnvironmentStore>(obj: Partial<Pick<EnvironmentStore, T>>) {
    Object.entries(obj).forEach(([key, value]) => {
      this.set(key as T, value as EnvironmentStore[T]);
    });
  }

  setTime(newTime: Time) {
    this.set('time', newTime);
  }

  setSeason(newSeason: Season) {
    this.set('season', newSeason);
  }

  setWeather(newWeather: Weather) {
    this.set('weather', newWeather);
  }

  // Hydration
  hydrate = async (): Promise<void> => {
    await hydrateStore(this);
  };
}
