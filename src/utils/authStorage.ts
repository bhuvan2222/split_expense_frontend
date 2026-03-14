import * as SecureStore from 'expo-secure-store';
import type { AuthUser } from '../store/authSlice';

const ACCESS_TOKEN_KEY = 'auth.accessToken';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';
const USER_KEY = 'auth.user';

export const saveAuthSession = async (session: {
  accessToken: string;
  refreshToken?: string | null;
  user: AuthUser;
}) => {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, session.accessToken);
  if (session.refreshToken) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, session.refreshToken);
  }
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(session.user));
};

export const loadAuthSession = async (): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
}> => {
  const accessToken = (await SecureStore.getItemAsync(ACCESS_TOKEN_KEY)) ?? null;
  const refreshToken = (await SecureStore.getItemAsync(REFRESH_TOKEN_KEY)) ?? null;
  const userRaw = (await SecureStore.getItemAsync(USER_KEY)) ?? null;
  let user: AuthUser | null = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw) as AuthUser;
    } catch {
      user = null;
    }
  }
  return { accessToken, refreshToken, user };
};

export const clearAuthSession = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
};
