import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, HelperText } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import { useGoogleMobileMutation, useLoginMutation, useRegisterMutation } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import { googleAuthConfig } from '../../constants/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export const LoginScreen = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [login, loginState] = useLoginMutation();
  const [register, registerState] = useRegisterMutation();
  const [googleMobile, googleState] = useGoogleMobileMutation();
  const { persistSession } = useAuth();

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['profile', 'email'],
      webClientId: googleAuthConfig.webClientId || undefined
    });
  }, []);

  const handleSubmit = async () => {
    setError('');
    try {
      if (mode === 'register') {
        const result = await register({ name, email, password }).unwrap();
        await persistSession({
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
          user: result.user
        });
      } else {
        const result = await login({ email, password }).unwrap();
        await persistSession({
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
          user: result.user
        });
      }
    } catch (err: any) {
      const message = err?.data?.error?.message || 'Authentication failed';
      setError(message);
    }
  };

  const loading = loginState.isLoading || registerState.isLoading || googleState.isLoading;

  const handleGoogle = async () => {
    setError('');
    if (!googleAuthConfig.androidClientId) {
      setError('Google sign-in is not configured. Missing Android client ID.');
      return;
    }
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens.idToken || undefined;
      const accessToken = tokens.accessToken || undefined;
      if (!accessToken && !idToken) {
        setError('Google sign-in failed. Missing token.');
        return;
      }
      const payload: { idToken?: string; accessToken?: string } = {};
      if (idToken) payload.idToken = idToken;
      if (accessToken) payload.accessToken = accessToken;
      const result = await googleMobile(payload).unwrap();
      await persistSession({
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        user: result.user
      });
    } catch (err: any) {
      let message = err?.data?.error?.message || err?.message || 'Google sign-in failed';
      const code = err?.code;
      if (code === statusCodes.SIGN_IN_CANCELLED) {
        message = 'Google sign-in cancelled.';
      } else if (code === statusCodes.IN_PROGRESS) {
        message = 'Google sign-in already in progress.';
      } else if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        message = 'Google Play Services not available or outdated.';
      } else if (code) {
        message = `Google sign-in failed (${code}).`;
      }
      console.warn('Google sign-in error', err);
      setError(message);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </Text>

      {mode === 'register' ? (
        <TextInput
          mode="outlined"
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      ) : null}
      <TextInput
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {error ? <HelperText type="error">{error}</HelperText> : null}

      <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading}>
        {mode === 'login' ? 'Sign in' : 'Create account'}
      </Button>

      <Button
        mode="outlined"
        onPress={handleGoogle}
        disabled={loading}
        style={styles.googleButton}
      >
        Continue with Google
      </Button>

      <Button
        mode="text"
        onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
        style={styles.toggle}
      >
        {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: COLORS.background },
  title: { color: COLORS.primary, marginBottom: 20 },
  input: { marginBottom: 12 },
  googleButton: { marginTop: 12 },
  toggle: { marginTop: 8 }
});
