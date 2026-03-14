import 'react-native-gesture-handler';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store } from './src/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { appTheme } from './src/theme';
import { usePushNotifications } from './src/hooks/usePushNotifications';

const PushBootstrap = () => {
  usePushNotifications();
  return null;
};

export default function App() {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={appTheme}>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootNavigator />
            <PushBootstrap />
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </StoreProvider>
  );
}
