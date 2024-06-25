import React, {useState, useEffect, useCallback} from 'react';
import {ScrollView, StyleSheet, Pressable} from 'react-native';
import {Text, View, Button, Incubator} from 'react-native-ui-lib';
import {observer} from 'mobx-react';
import {NavioScreen} from 'rn-navio';
import {useStores} from '@app/stores';
import {services, useServices} from '@app/services';
import {useAppearance} from '@app/utils/hooks';
import {SOUND_CATEGORIES} from '@app/utils/constants';
import {CircularProgressCard} from '@app/components/CircularProgressCard';

const {Toast, Slider} = Incubator;

type SoundState = {
  isPlaying: boolean;
  volume: number;
};

type SoundStates = {
  [key: string]: SoundState;
};

export const ManageSoundsScreen: NavioScreen = observer(() => {
  useAppearance();
  const {navio} = useServices();
  const navigation = navio.useN();
  const {ui} = useStores();

  const [toastVisible, setToastVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [soundStates, setSoundStates] = useState<SoundStates>({});
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    configureUI();
    initializeSoundStates();
  }, []);

  useEffect(() => {
    if (selectedCategory && soundStates[selectedCategory]) {
      setVolume(soundStates[selectedCategory].volume);
    }
  }, [selectedCategory, soundStates]);

  const initializeSoundStates = () => {
    const initialStates = SOUND_CATEGORIES.reduce((acc, category) => {
      acc[category.title] = {isPlaying: false, volume: 0};
      return acc;
    }, {} as SoundStates);
    setSoundStates(initialStates);
  };

  const toggleToast = useCallback(() => {
    setToastVisible(prev => !prev);
  }, []);

  // const handleCardPress = useCallback((category: string) => {
  //   setSelectedCategory(category);
  //   setSoundStates(prevStates => {
  //     const currentState = prevStates[category];
  //     const newVolume = currentState.isPlaying ? currentState.volume : 30;
  //     const newIsPlaying = !currentState.isPlaying;
  //     return {
  //       ...prevStates,
  //       [category]: {
  //         isPlaying: newIsPlaying,
  //         volume: newIsPlaying ? Math.max(newVolume, 1) : 0,
  //       },
  //     };
  //   });
  //   setToastVisible(true);
  // }, []);

  const resetVolume = useCallback(() => {
    if (selectedCategory) {
      setSoundStates(prevStates => ({
        ...prevStates,
        [selectedCategory]: {
          isPlaying: false,
          volume: 0,
        },
      }));
      setVolume(0);
    }
  }, [selectedCategory]);

  const handleCardPress = useCallback((category: string) => {
    setSelectedCategory(category);
    setToastVisible(true);
  }, []);

  const onVolumeChange = useCallback(
    (newVolume: number) => {
      setVolume(newVolume);
      if (selectedCategory) {
        setSoundStates(prevStates => ({
          ...prevStates,
          [selectedCategory]: {
            isPlaying: newVolume > 0,
            volume: newVolume,
          },
        }));
      }
    },
    [selectedCategory],
  );

  const configureUI = () => {
    navigation.setOptions({});
  };

  const renderCards = () => {
    return SOUND_CATEGORIES.reduce((rows: any[], category, index) => {
      if (index % 2 === 0) rows.push([]);
      rows[rows.length - 1].push(category);
      return rows;
    }, []).map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((category, cardIndex) => (
          <Pressable
            key={cardIndex}
            style={styles.cardContainer}
            onPress={() => handleCardPress(category.title)}
          >
            <CircularProgressCard
              initialFill={soundStates[category.title]?.volume || 0}
              size={120}
              title={category.title}
              iconUrl={category.iconUrl}
              soundUrl={category.soundUrl}
              isPlaying={soundStates[category.title]?.isPlaying || false}
            />
          </Pressable>
        ))}
      </View>
    ));
  };

  return (
    <View flex bg-bgColor>
      <ScrollView contentInsetAdjustmentBehavior="always" style={styles.scrollView}>
        <View style={styles.container}>{renderCards()}</View>
      </ScrollView>
      <Toast
        visible={toastVisible}
        position={'bottom'}
        message={selectedCategory ? `Adjust volume for ${selectedCategory}` : ''}
        onDismiss={toggleToast}
        autoDismiss={0}
        showLoader={false}
        swipeable={true}
      >
        <View bg-$backgroundNeutralLight padding-40>
          <Text $textDefault text60>
            Volume: {volume.toFixed(0)}%
          </Text>
          <Slider
            value={volume}
            minimumValue={0}
            maximumValue={100}
            onValueChange={onVolumeChange}
            containerStyle={styles.sliderContainer}
          />
          <View style={styles.buttonContainer}>
            <Button label="Reset" onPress={resetVolume} marginT-10 />
            <Button label="Close" onPress={toggleToast} marginT-10 />
          </View>
        </View>
      </Toast>
    </View>
  );
});

ManageSoundsScreen.options = () => ({
  headerBackTitleStyle: false,
  title: "services.t.do('ManageSoundsScreen.title')",
});

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardContainer: {
    width: '48%',
    alignItems: 'center',
  },
  sliderContainer: {
    marginVertical: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
});
