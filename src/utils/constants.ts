import {Dimensions} from 'react-native';
import {Assets, Image} from 'react-native-ui-lib';

Assets.loadAssetsGroup('icons', {
  wind: '../../assets/wind.png',
});

export const useConstants = () => {
  const dim = Dimensions.get('screen');

  return {
    dim,
    links: {
      github: 'https://github.com/kanzitelli/expo-starter',
      website: 'https://github.com/kanzitelli/expo-starter',
    },
  };
};

export const SOUND_CATEGORIES = [
  {
    id: '1',
    title: 'Rain',
    iconUrl: '../../assets/wind.png',
    color: '#4a90e2',
    soundUrl: 'https://www.soundjay.com/nature/rain-03.mp3',
  },
  {
    id: '2',
    title: 'Thunder',
    iconUrl:
      'https://cdn.icon-icons.com/icons2/2211/PNG/512/weather_storm_thunder_heavy_rain_cloud_icon_134151.png',
    color: '#f1c40f',
    soundUrl: 'https://www.soundjay.com/nature/rain-03.mp3',
  },
  {
    id: '3',
    title: 'Wind',
    iconUrl: 'https://www.soundjay.com/nature/wind-01.png',
    color: '#e74c3c',
    soundUrl: 'https://www.soundjay.com/nature/rain-03.mp3',
  },
  {
    id: '4',
    title: 'Ocean',
    iconUrl: 'https://www.soundjay.com/nature/ocean-waves-1.png',
    color: '#3498db',
    soundUrl: 'https://www.soundjay.com/nature/rain-03.mp3',
  },
  {
    id: '5',
    title: 'Fire',
    iconUrl: 'https://www.soundjay.com/nature/wind-01.png',
    color: '#e67e22',
    soundUrl: 'https://www.soundjay.com/nature/rain-03.mp3',
  },
  {
    id: '6',
    title: 'Forest',
    iconUrl: 'https://www.soundjay.com/nature/wind-01.png',
    color: '#27ae60',
    soundUrl: 'https://www.soundjay.com/nature/rain-03.mp3',
  },
  {
    id: '7',
    title: 'Night',
    iconUrl: 'https://www.soundjay.com/nature/wind-01.png',
    color: '#8e44ad',
    soundUrl: 'https://www.soundjay.com/nature/rain-03.mp3',
  },
  {
    id: '8',
    title: 'Birds',
    iconUrl: 'https://www.soundjay.com/nature/wind-01.png',
    color: '#f39c12',
    soundUrl: 'https://www.soundjay.com/nature/rain-03.mp3',
  },
];
