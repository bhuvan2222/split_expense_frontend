import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useRegisterFcmTokenMutation } from '../api/usersApi';
import { useAuth } from './useAuth';

const registerForPushNotifications = async (): Promise<string | null> => {
  const settings = await Notifications.getPermissionsAsync();
  let status = settings.status;
  if (status !== 'granted') {
    const request = await Notifications.requestPermissionsAsync();
    status = request.status;
  }
  if (status !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT
    });
  }

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data ?? null;
};

export const usePushNotifications = () => {
  const { isAuthenticated } = useAuth();
  const [registerFcmToken] = useRegisterFcmTokenMutation();

  useEffect(() => {
    if (!isAuthenticated) return;

    const run = async () => {
      try {
        const token = await registerForPushNotifications();
        if (token) {
          await registerFcmToken({ token }).unwrap();
        }
      } catch {
        // Silent: push notifications are optional
      }
    };

    run();
  }, [isAuthenticated, registerFcmToken]);
};
