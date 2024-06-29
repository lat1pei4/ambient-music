import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {Text, View, SegmentedControl, Colors} from 'react-native-ui-lib';
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
} from '@app/utils/types/enums';
import {useAppearance} from '@app/utils/hooks';
import {useStores} from '@app/stores';
import {HeaderButton} from '@app/components/button';
import {services, useServices} from '@app/services';

export const Settings: NavioScreen = observer(({}) => {
  useAppearance();
  const {ui} = useStores();
  const {navio} = useServices();
  const navigation = navio.useN();

  // State
  const [appearance, setAppearance] = useState(ui.appearance);
  const [language, setLanguage] = useState(ui.language);

  // Computed
  const unsavedChanges = ui.appearance !== appearance || ui.language !== language;

  const appearanceInitialIndex = appearances.findIndex(it => it === appearance);
  const appearanceSegments = appearancesUI.map(it => ({label: it}));

  const languageInitialIndex = languages.findIndex(it => it === language);
  const languageSegments = languagesUI.map(it => ({label: it}));

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

  const handleSave = () => {
    ui.setMany({
      appearance,
      language,
    });
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
        <Section title={'背景動画'}>
          <View paddingV-s1>
            <Row>
              <View flex>
                <Text textColor text60R>
                  季節
                </Text>
              </View>

              <SegmentedControl
                initialIndex={0}
                segments={[{label: '春'}, {label: '夏'}, {label: '秋'}, {label: '冬'}]}
                backgroundColor={Colors.bgColor}
                activeColor={Colors.primary}
                inactiveColor={Colors.textColor}
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
                initialIndex={0}
                segments={[{label: '日'}, {label: '夜'}]}
                backgroundColor={Colors.bgColor}
                activeColor={Colors.primary}
                inactiveColor={Colors.textColor}
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
                initialIndex={0}
                segments={[{label: '晴れ'}, {label: '曇り'}, {label: '雨'}, {label: '雪'}]}
                backgroundColor={Colors.bgColor}
                activeColor={Colors.primary}
                inactiveColor={Colors.textColor}
              />
            </Row>
          </View>
        </Section>
      </ScrollView>
    </View>
  );
});

Settings.options = () => ({
  title: services.t.do('settings.title'),
});
