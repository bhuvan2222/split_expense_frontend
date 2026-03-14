import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Screen } from '../../components/common/Screen';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../api/usersApi';
import { COLORS } from '../../constants/colors';

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
      <Text variant="headlineSmall" style={styles.title}>Language</Text>
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
      <Button mode="contained" onPress={handleSave} loading={isLoading} disabled={isLoading}>
        Save
      </Button>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { color: COLORS.primary, marginBottom: 12 },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  choiceButton: { marginBottom: 6 }
});
