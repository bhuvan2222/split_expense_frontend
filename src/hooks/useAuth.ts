import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearCredentials, setCredentials } from '../store/authSlice';
import { clearAuthSession, loadAuthSession, saveAuthSession } from '../utils/authStorage';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { accessToken, refreshToken, user } = useAppSelector((state) => state.auth);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isActive = true;
    const hydrate = async () => {
      if (accessToken) {
        if (isActive) {
          setIsReady(true);
        }
        return;
      }
      const session = await loadAuthSession();
      if (!isActive) return;
      if (session.accessToken && session.user) {
        dispatch(
          setCredentials({
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            user: session.user
          })
        );
      }
      setIsReady(true);
    };
    hydrate();
    return () => {
      isActive = false;
    };
  }, [accessToken, dispatch]);

  const persistSession = async (payload: { accessToken: string; refreshToken?: string | null; user: typeof user }) => {
    if (!payload.user) return;
    await saveAuthSession({
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken ?? null,
      user: payload.user
    });
    dispatch(
      setCredentials({
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken ?? null,
        user: payload.user
      })
    );
  };

  const signOut = async () => {
    await clearAuthSession();
    dispatch(clearCredentials());
  };

  return {
    isAuthenticated: Boolean(accessToken),
    isReady,
    accessToken,
    refreshToken,
    user,
    persistSession,
    signOut
  };
};
