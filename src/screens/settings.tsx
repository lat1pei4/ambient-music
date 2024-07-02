import React, {useEffect, useState} from 'react';
import {ScrollView, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {Text, View, SegmentedControl, Colors, Modal, Button} from 'react-native-ui-lib';
import {observer} from 'mobx-react';
import {NavioScreen} from 'rn-navio';

import {Section} from '@app/components/section';
import {Row} from '@app/components/row';
import {
  appearances,
  appearancesUI,
  appearanceUIToInternal,
  languages,
  languagesUI,
  languageUIToInternal,
  seasons,
  seasonsUI,
  seasonUIToInternal,
  times,
  timesUI,
  timeUIToInternal,
  weathers,
  weathersUI,
  weatherUIToInternal,
} from '@app/utils/types/enums';
import {useAppearance} from '@app/utils/hooks';
import {useStores} from '@app/stores';
import {HeaderButton} from '@app/components/button';
import {services, useServices} from '@app/services';

export const Settings: NavioScreen = observer(({}) => {
  useAppearance();
  const {ui} = useStores();
  const {environment} = useStores();
  const {navio} = useServices();
  const navigation = navio.useN();

  // State
  const [appearance, setAppearance] = useState(ui.appearance);
  const [language, setLanguage] = useState(ui.language);

  const [season, setSeason] = useState(environment.season);
  const [time, setTime] = useState(environment.time);
  const [weather, setWeather] = useState(environment.weather);

  const [showDebugMode, setShowDebugMode] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [password, setPassword] = useState('');

  // Computed
  const unsavedChanges =
    ui.appearance !== appearance ||
    ui.language !== language ||
    environment.season !== season ||
    environment.time !== time ||
    environment.weather !== weather;

  const appearanceInitialIndex = appearances.findIndex(it => it === appearance);
  const appearanceSegments = appearancesUI.map(it => ({label: it}));

  const languageInitialIndex = languages.findIndex(it => it === language);
  const languageSegments = languagesUI.map(it => ({label: it}));

  const seasonInitialIndex = seasons.findIndex(it => it === season);
  const seasonSegments = seasonsUI.map(it => ({label: it}));

  const timeInitialIndex = times.findIndex(it => it === time);
  const timeSegments = timesUI.map(it => ({label: it}));

  const weatherInitialIndex = weathers.findIndex(it => it === weather);
  const weatherSegments = weathersUI.map(it => ({label: it}));

  // Start
  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        unsavedChanges ? <HeaderButton onPress={handleSave} label="Save" /> : null,
    });
  }, [unsavedChanges, appearance, language]);

  // Methods
  const handleAppearanceIndexChange = (index: number) =>
    setAppearance(appearanceUIToInternal[appearancesUI[index]]);
  const handleLanguageIndexChange = (index: number) =>
    setLanguage(languageUIToInternal[languagesUI[index]]);

  const handleSeasonIndexChange = (index: number) =>
    setSeason(seasonUIToInternal[seasonsUI[index]]);
  const handleTimeIndexChange = (index: number) => setTime(timeUIToInternal[timesUI[index]]);
  const handleWeatherIndexChange = (index: number) =>
    setWeather(weatherUIToInternal[weathersUI[index]]);

  const handleSave = () => {
    ui.setMany({
      appearance,
      language,
    });
    environment.setMany({
      season,
      time,
      weather,
    });
  };

  const handleDebugModePress = () => {
    setPasswordModalVisible(!passwordModalVisible);
  };

  const handlePasswordSubmit = () => {
    if (password === '0000') {
      setShowDebugMode(true);
      setPasswordModalVisible(false);
    } else {
      // Show error message
      alert('Incorrect password');
      handleDebugModePress();
    }
    setPassword('');
  };

  return (
    <View flex bg-bgColor>
      <ScrollView contentInsetAdjustmentBehavior="always">
        <Section title={'UI'}>
          <View paddingV-s1>
            <Row>
              <View flex>
                <Text textColor text60R>
                  Appearance
                </Text>
              </View>

              <SegmentedControl
                initialIndex={appearanceInitialIndex}
                segments={appearanceSegments}
                backgroundColor={Colors.bgColor}
                activeColor={Colors.primary}
                inactiveColor={Colors.textColor}
                onChangeIndex={handleAppearanceIndexChange}
              />
            </Row>
          </View>

          <View paddingV-s1>
            <Row>
              <View flex>
                <Text textColor text60R>
                  Language
                </Text>
              </View>

              <SegmentedControl
                initialIndex={languageInitialIndex}
                segments={languageSegments}
                backgroundColor={Colors.bgColor}
                activeColor={Colors.primary}
                inactiveColor={Colors.textColor}
                onChangeIndex={handleLanguageIndexChange}
              />
            </Row>
          </View>
        </Section>

        <TouchableOpacity onPress={handleDebugModePress}>
          <Text textColor text60R padding-s1>
            Debug Mode
          </Text>
        </TouchableOpacity>

        {showDebugMode && (
          <>
            <Section title={'背景動画'}>
              <View paddingV-s1>
                <Row>
                  <View flex>
                    <Text textColor text60R>
                      季節
                    </Text>
                  </View>

                  <SegmentedControl
                    initialIndex={seasonInitialIndex}
                    segments={seasonSegments}
                    backgroundColor={Colors.bgColor}
                    activeColor={Colors.primary}
                    inactiveColor={Colors.textColor}
                    onChangeIndex={handleSeasonIndexChange}
                  />
                </Row>
              </View>

              <View paddingV-s1>
                <Row>
                  <View flex>
                    <Text textColor text60R>
                      時間
                    </Text>
                  </View>

                  <SegmentedControl
                    initialIndex={timeInitialIndex}
                    segments={timeSegments}
                    backgroundColor={Colors.bgColor}
                    activeColor={Colors.primary}
                    inactiveColor={Colors.textColor}
                    onChangeIndex={handleTimeIndexChange}
                  />
                </Row>
              </View>
              <View paddingV-s1>
                <Row>
                  <View flex>
                    <Text textColor text60R>
                      天気
                    </Text>
                  </View>

                  <SegmentedControl
                    initialIndex={weatherInitialIndex}
                    segments={weatherSegments}
                    backgroundColor={Colors.bgColor}
                    activeColor={Colors.primary}
                    inactiveColor={Colors.textColor}
                    onChangeIndex={handleWeatherIndexChange}
                  />
                </Row>
              </View>
            </Section>
            <Section title={'位置情報'}>
              <Text textColor text60R>
                日時: xxxx
              </Text>
              <Text textColor text60R>
                現在地: xxxx
              </Text>
              <Text textColor text60R>
                緯度: xxxx
              </Text>
              <Text textColor text60R>
                経度: xxx
              </Text>
              <Button label="更新" onPress={() => {}} style={styles.button} />
            </Section>
          </>
        )}
      </ScrollView>

      <Modal visible={passwordModalVisible} onRequestClose={() => setPasswordModalVisible(false)}>
        <View flex center>
          <Text textColor text60R marginB-s2>
            Enter Debug Mode Password
          </Text>
          <TextInput
            secureTextEntry
            keyboardType="numeric"
            maxLength={4}
            value={password}
            onChangeText={setPassword}
            style={{borderWidth: 1, borderColor: Colors.textColor, padding: 10, marginBottom: 20}}
          />
          <TouchableOpacity onPress={handleDebugModePress}>
            <Text textColor text60R>
              cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePasswordSubmit}>
            <Text textColor text60R>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
});

Settings.options = () => ({
  title: services.t.do('settings.title'),
});

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 40,
    marginTop: 20,
  },
});
