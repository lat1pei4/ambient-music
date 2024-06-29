const _languages = {
  system: 'System',
  en: 'EN',
  de: 'DE',
  ru: 'RU',
} as const;
export type Language = keyof typeof _languages;
export type LanguageUI = (typeof _languages)[Language];
export const languageToUI: Record<Language, LanguageUI> = {
  system: 'System',
  en: 'EN',
  de: 'DE',
  ru: 'RU',
};
export const languageUIToInternal: Record<LanguageUI, Language> = {
  System: 'system',
  EN: 'en',
  DE: 'de',
  RU: 'ru',
};
export const languages = Object.keys(languageToUI) as Language[];
export const languagesUI = Object.keys(languageUIToInternal) as LanguageUI[];

const _appearances = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
} as const;
export type Appearance = keyof typeof _appearances;
export type AppearanceUI = (typeof _appearances)[Appearance];
export const appearanceToUI: Record<Appearance, AppearanceUI> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
};
export const appearanceUIToInternal: Record<AppearanceUI, Appearance> = {
  System: 'system',
  Light: 'light',
  Dark: 'dark',
};
export const appearances = Object.keys(appearanceToUI) as Appearance[];
export const appearancesUI = Object.keys(appearanceUIToInternal) as AppearanceUI[];

const _times = {
  day: '日',
  night: '夜',
} as const;

const _seasons = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
} as const;

const _weathers = {
  sunny: '晴れ',
  cloudy: '曇り',
  rainy: '雨',
  snowy: '雪',
} as const;

export type Time = keyof typeof _times;
export type TimeUI = (typeof _times)[Time];

export type Season = keyof typeof _seasons;
export type SeasonUI = (typeof _seasons)[Season];

export type Weather = keyof typeof _weathers;
export type WeatherUI = (typeof _weathers)[Weather];

export const timeToUI: Record<Time, TimeUI> = {
  day: '日',
  night: '夜',
};

export const timeUIToInternal: Record<TimeUI, Time> = {
  日: 'day',
  夜: 'night',
};

export const seasonToUI: Record<Season, SeasonUI> = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
};

export const seasonUIToInternal: Record<SeasonUI, Season> = {
  春: 'spring',
  夏: 'summer',
  秋: 'autumn',
  冬: 'winter',
};

export const weatherToUI: Record<Weather, WeatherUI> = {
  sunny: '晴れ',
  cloudy: '曇り',
  rainy: '雨',
  snowy: '雪',
};

export const weatherUIToInternal: Record<WeatherUI, Weather> = {
  晴れ: 'sunny',
  曇り: 'cloudy',
  雨: 'rainy',
  雪: 'snowy',
};

export const times = Object.keys(timeToUI) as Time[];
export const timesUI = Object.keys(timeUIToInternal) as TimeUI[];

export const seasons = Object.keys(seasonToUI) as Season[];
export const seasonsUI = Object.keys(seasonUIToInternal) as SeasonUI[];

export const weathers = Object.keys(weatherToUI) as Weather[];
export const weathersUI = Object.keys(weatherUIToInternal) as WeatherUI[];
