import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, Icon, Text} from 'react-native-ui-lib';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Audio} from 'expo-av';

type Props = {
  initialFill: number;
  size?: number;
  width?: number;
  backgroundWidth?: number;
  tintColor?: string;
  tintColorSecondary?: string;
  backgroundColor?: string;
  arcSweepAngle?: number;
  rotation?: number;
  iconUrl?: string;
  soundUrl: string;
  title: string;
  isPlaying: boolean;
};

export const CircularProgressCard: React.FC<Props> = ({
  initialFill,
  size = 120,
  width = 10,
  backgroundWidth = 10,
  tintColor = '#00ff00',
  tintColorSecondary = '#ff0000',
  backgroundColor = '#3d5875',
  arcSweepAngle = 240,
  rotation = 240,
  soundUrl,
  iconUrl,
  title,
  isPlaying,
}) => {
  const [fill, setFill] = useState(initialFill);
  const [playbackObject, setPlaybackObject] = useState<Audio.Sound | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (playbackObject) {
        playbackObject.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    setFill(initialFill);
    if (playbackObject) {
      playbackObject.setVolumeAsync(initialFill / 100);
    }

    if (initialFill === 0) {
      pauseSound();
    } else if (isPlaying) {
      playSound();
    }
  }, [initialFill, isPlaying]);

  const playSound = async () => {
    if (!playbackObject) {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const {sound} = await Audio.Sound.createAsync(
          {uri: soundUrl},
          {shouldPlay: true},
          // onPlaybackStatusUpdate,
        );
        // if (isMounted.current) {
        //   setPlaybackObject(sound);
        // }
        // await sound.setIsLoopingAsync(true);
        setPlaybackObject(sound);
        sound.setIsLoopingAsync(true); // Loop the sound
        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        sound.setVolumeAsync(initialFill / 100); // Set the initial volume
      } catch (error) {
        console.error('Error loading sound', error);
      }
    } else {
      await playbackObject.playAsync();
    }
  };

  const pauseSound = async () => {
    if (playbackObject) {
      await playbackObject.pauseAsync();
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) return;
    if (status.isPlaying) {
      if (isMounted.current) setFill(status.volume * 100);
    }
  };

  return (
    <View style={styles.container}>
      <Card borderRadius={size / 2} width={size} height={size}>
        <AnimatedCircularProgress
          size={size}
          width={width}
          backgroundWidth={backgroundWidth}
          fill={fill}
          tintColor={tintColor}
          tintColorSecondary={tintColorSecondary}
          backgroundColor={backgroundColor}
          arcSweepAngle={arcSweepAngle}
          rotation={rotation}
          lineCap="round"
        />
        <View style={styles.iconContainer}>
          <Icon
            source={{
              uri:
                isPlaying && fill > 0
                  ? 'https://cdn-icons-png.flaticon.com/512/7960/7960808.png' // pause icon
                  : iconUrl, // play icon
            }}
            size={50}
          />
        </View>
      </Card>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    width: 50,
    height: 50,
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
  },
  title: {
    marginTop: 10,
    textAlign: 'center',
  },
});
