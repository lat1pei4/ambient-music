import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, Icon} from 'react-native-ui-lib';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Audio} from 'expo-av';

type Props = {
  initialFill?: number;
  size?: number;
  width?: number;
  backgroundWidth?: number;
  tintColor?: string;
  tintColorSecondary?: string;
  backgroundColor?: string;
  arcSweepAngle?: number;
  rotation?: number;
};

export const CircularProgressCard: React.FC<Props> = ({
  initialFill = 0,
  size = 120,
  width = 10,
  backgroundWidth = 10,
  tintColor = '#00ff00',
  tintColorSecondary = '#ff0000',
  backgroundColor = '#3d5875',
  arcSweepAngle = 240,
  rotation = 240,
}) => {
  const [fill, setFill] = useState(initialFill);

  return (
    <>
      <Card borderRadius={size / 2} width={size} onPress={() => console.log('pressed')}>
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
              uri: 'https://cdn.iconscout.com/icon/free/png-256/react-1-282599.png',
            }}
            size={50}
          />
        </View>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    marginVertical: 10,
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
});
