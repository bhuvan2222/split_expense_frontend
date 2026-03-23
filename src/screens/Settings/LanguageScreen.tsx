import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { Screen } from '../../components/common/Screen';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../api/usersApi';
import { COLORS } from '../../constants/colors';
import { HeroHeader } from '../../components/common/HeroHeader';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ta', label: 'Tamil' }
];

export const LanguageScreen = () => {
  const [selected, setSelected] = useState('en');
  const { data: profile } = useGetProfileQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    if (profile?.preferredLanguage) {
      setSelected(profile.preferredLanguage);
    }
  }, [profile]);

  const handleSave = async () => {
    await updateProfile({ preferredLanguage: selected }).unwrap();
  };

  return (
    <Screen>
      <HeroHeader title="Language" subtitle="Choose your preferred language" icon="translate" />
      <Card style={styles.card} mode="contained">
        <Card.Content>
          <View style={styles.choiceRow}>
            {LANGUAGES.map((lang) => (
              <Button
                key={lang.code}
                mode={selected === lang.code ? 'contained' : 'outlined'}
                onPress={() => setSelected(lang.code)}
                style={styles.choiceButton}
              >
                {lang.label}
              </Button>
            ))}
          </View>
          <Button mode="contained" onPress={handleSave} loading={isLoading} disabled={isLoading} style={styles.primaryButton}>
            Save
          </Button>
        </Card.Content>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 0, backgroundColor: '#ffffff', marginHorizontal: -20 },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  choiceButton: { marginBottom: 6, borderRadius: 10 },
  primaryButton: { marginTop: 8 }
});
