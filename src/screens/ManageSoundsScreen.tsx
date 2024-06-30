import React, {useState, useEffect, useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Text, View, Button, Incubator, Card} from 'react-native-ui-lib';
import {observer} from 'mobx-react';
import {NavioScreen} from 'rn-navio';
import {useStores} from '@app/stores';
import {services, useServices} from '@app/services';
import {useAppearance} from '@app/utils/hooks';
import {SOUND_CATEGORIES} from '@app/utils/constants';
import {CircularProgressCard} from '@app/components/CircularProgressCard';

const {Toast, Slider} = Incubator;

export const ManageSoundsScreen: NavioScreen = observer(() => {
  useAppearance();
  const {navio} = useServices();
  const navigation = navio.useN();
  const {sound} = useStores();

  const [toastVisible, setToastVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    configureUI();
  }, []);

  const toggleToast = useCallback(() => {
    setToastVisible(prev => !prev);
  }, []);

  const handleCardPress = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      sound.toggleSound(category);
      setToastVisible(true);
    },
    [sound],
  );

  const resetVolume = useCallback(() => {
    if (selectedCategory) {
      sound.resetSound(selectedCategory);
    }
  }, [selectedCategory, sound]);

  const resetAllVolume = useCallback(() => {
    sound.resetAllSounds();
  }, [selectedCategory, sound]);

  const onVolumeChange = useCallback(
    (newVolume: number) => {
      if (selectedCategory) {
        sound.setVolume(selectedCategory, newVolume);
      }
    },
    [selectedCategory, sound],
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
        {row.map(category => (
          <Card
            key={category.id}
            style={styles.cardContainer}
            onPress={() => handleCardPress(category.id)}
          >
            <CircularProgressCard
              initialFill={sound.sounds[category.id]?.volume || 0}
              size={120}
              title={category.title}
              iconUrl={category.iconUrl}
              soundUrl={category.soundUrl}
              isPlaying={sound.sounds[category.id]?.isPlaying || false}
            />
          </Card>
        ))}
      </View>
    ));
  };

  return (
    <View flex bg-bgColor>
      <ScrollView contentInsetAdjustmentBehavior="always" style={styles.scrollView}>
        <View style={styles.container}>{renderCards()}</View>
      </ScrollView>
      <View style={styles.buttonContainer2}>
        <Button label="reset all sounds" onPress={resetAllVolume} margin-20 />
        <Button
          label="back to home"
          onPress={() => navio.drawers.jumpTo('AnimeBackground')}
          margin-20
        />
      </View>
      <Toast
        visible={toastVisible}
        position={'bottom'}
        message={
          selectedCategory
            ? `Adjust volume for ${SOUND_CATEGORIES.find(c => c.id === selectedCategory)?.title}`
            : ''
        }
        onDismiss={toggleToast}
        autoDismiss={0}
        showLoader={false}
        swipeable={true}
      >
        <View bg-$backgroundNeutralLight padding-40>
          <Text $textDefault text60>
            Volume: {selectedCategory ? sound.sounds[selectedCategory]?.volume.toFixed(0) : 0}%
          </Text>
          <Slider
            value={selectedCategory ? sound.sounds[selectedCategory]?.volume || 0 : 0}
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
    borderRadius: 300,
    backgroundColor: 'transparent',
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
  buttonContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 0,
    margin: 0,
  },
});
