import Constants from 'expo-constants';

type GoogleAuthConfig = {
  expoClientId?: string;
  androidClientId?: string;
  iosClientId?: string;
  webClientId?: string;
};

const extra = Constants.expoConfig?.extra as { googleAuth?: GoogleAuthConfig } | undefined;

export const googleAuthConfig: GoogleAuthConfig = {
  expoClientId: extra?.googleAuth?.expoClientId ?? process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
  androidClientId: extra?.googleAuth?.androidClientId ?? process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: extra?.googleAuth?.iosClientId ?? process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  webClientId: extra?.googleAuth?.webClientId ?? process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
};
