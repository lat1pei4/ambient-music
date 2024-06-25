import React, {useEffect} from 'react';
import {Text, View} from 'react-native-ui-lib';
import {observer} from 'mobx-react';
import {NavioScreen} from 'rn-navio';
import {StyleSheet} from 'react-native';
import {services, useServices} from '@app/services';
import {useAppearance} from '@app/utils/hooks';
import {Video} from 'expo-av';

export type Params = {
  type?: 'push' | 'show';
  productId?: string;
};

export const AnimeBackgroundScreen: NavioScreen = observer(() => {
  useAppearance(); // for Dark Mode
  const {t, navio} = useServices();
  const navigation = navio.useN();
  const params = navio.useParams<Params>();
  // const {ui} = useStores();

  // State

  // Methods

  // Start
  useEffect(() => {
    configureUI();
  }, []);

  // UI Methods
  const configureUI = () => {
    navigation.setOptions({});
  };

  // UI Methods

  const video = require('../../assets/video.mp4');

  return (
    <View flex bg-bgColor>
      <View style={styles.container}>
        <Video
          source={video} // Your video source
          rate={1.0}
          volume={0.0} // Mute the sound
          isMuted={true}
          resizeMode="cover"
          shouldPlay
          isLooping
          style={styles.backgroundVideo}
        />
        <Text style={styles.text}>Your Content Goes Here</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  text: {
    position: 'absolute',
    top: '50%',
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

AnimeBackgroundScreen.options = props => ({
  headerBackTitleStyle: false,
  headerShown: false,
  title: `${services.t.do('example.title')} ${(props?.route?.params as Params)?.type ?? ''}`,
});
