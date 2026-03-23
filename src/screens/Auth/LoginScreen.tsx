import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Chip, HelperText, TextInput } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import {
  useGoogleMobileMutation,
  useLoginMutation,
  useRegisterMutation,
  useRequestPhoneOtpMutation,
  useVerifyPhoneOtpMutation
} from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import { googleAuthConfig } from '../../constants/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Screen } from '../../components/common/Screen';
import { HeroHeader } from '../../components/common/HeroHeader';

export const LoginScreen = () => {
  const [mode, setMode] = useState<'phone' | 'email'>('phone');
  const [emailMode, setEmailMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pinId, setPinId] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const [login, loginState] = useLoginMutation();
  const [register, registerState] = useRegisterMutation();
  const [googleMobile, googleState] = useGoogleMobileMutation();
  const [requestPhoneOtp, requestPhoneState] = useRequestPhoneOtpMutation();
  const [verifyPhoneOtp, verifyPhoneState] = useVerifyPhoneOtpMutation();
  const { persistSession } = useAuth();

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['profile', 'email'],
      webClientId: googleAuthConfig.webClientId || undefined
    });
  }, []);

  useEffect(() => {
    setError('');
    setFieldErrors({});
    if (mode !== 'phone') {
      setPinId(null);
      setPin('');
    }
  }, [mode, emailMode]);

  const handleSubmit = async () => {
    setError('');
    setFieldErrors({});
    try {
      if (emailMode === 'register') {
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
      const fields = err?.data?.error?.fields;
      if (Array.isArray(fields) && fields.length > 0) {
        const next: { name?: string; email?: string; password?: string } = {};
        fields.forEach((f: { field?: string; message?: string }) => {
          if (!f?.field || !f?.message) return;
          if (f.field === 'name') next.name = f.message;
          if (f.field === 'email') next.email = f.message;
          if (f.field === 'password') next.password = f.message;
        });
        setFieldErrors(next);
        setError('');
        return;
      }
      const code = err?.data?.error?.code;
      let message = err?.data?.error?.message || 'Authentication failed';
      if (code === 'USER_NOT_FOUND') {
        message = 'User not found. Sign up to continue.';
      } else if (code === 'INVALID_PASSWORD') {
        message = 'Incorrect password. Try again.';
      }
      setError(message);
    }
  };

  const phoneLoading = requestPhoneState.isLoading || verifyPhoneState.isLoading;
  const loading = loginState.isLoading || registerState.isLoading || googleState.isLoading || phoneLoading;

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

  const handleSendCode = async () => {
    setError('');
    try {
      const result = await requestPhoneOtp({ phoneNumber: phoneNumber.trim() }).unwrap();
      setPinId(result.pinId);
    } catch (err: any) {
      const message = err?.data?.error?.message || err?.error || 'Failed to send code';
      setError(message);
    }
  };

  const handleVerifyCode = async () => {
    if (!pinId) return;
    setError('');
    try {
      const result = await verifyPhoneOtp({ phoneNumber: phoneNumber.trim(), pinId, pin }).unwrap();
      await persistSession({
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        user: result.user
      });
    } catch (err: any) {
      const message = err?.data?.error?.message || err?.error || 'Verification failed';
      setError(message);
    }
  };

  return (
    <Screen scroll>
      <HeroHeader
        title={mode === 'phone' ? 'Sign in with phone' : emailMode === 'login' ? 'Welcome back' : 'Create your account'}
        subtitle="Secure sign-in with quick access to your groups."
        icon="account"
      />

      <Card style={styles.formCard} mode="contained">
        <Card.Content>
          {mode === 'phone' ? (
            <>
              <TextInput
                mode="outlined"
                label="Phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                style={styles.input}
              />
              <HelperText type="info" visible style={styles.infoText}>
                Use country code, for example +91XXXXXXXXXX
              </HelperText>
              {pinId ? (
                <TextInput
                  mode="outlined"
                  label="Verification code"
                  value={pin}
                  onChangeText={setPin}
                  keyboardType="numeric"
                  style={styles.input}
                />
              ) : null}

              {error ? <HelperText type="error">{error}</HelperText> : null}

              <Button
                mode="contained"
                onPress={pinId ? handleVerifyCode : handleSendCode}
                loading={phoneLoading}
                disabled={phoneLoading || !phoneNumber || (pinId ? !pin : false)}
                style={styles.primaryButton}
              >
                {pinId ? 'Verify code' : 'Send code'}
              </Button>

              {pinId ? (
                <Button mode="text" onPress={() => setPinId(null)} style={styles.secondaryButton}>
                  Use a different number
                </Button>
              ) : null}
            </>
          ) : (
            <>
              <View style={styles.modeRow}>
                <Chip
                  selected={emailMode === 'login'}
                  onPress={() => setEmailMode('login')}
                  style={[styles.modeChip, emailMode === 'login' && styles.modeChipSelected]}
                  textStyle={emailMode === 'login' ? styles.modeChipTextSelected : styles.modeChipText}
                >
                  Sign in
                </Chip>
                <Chip
                  selected={emailMode === 'register'}
                  onPress={() => setEmailMode('register')}
                  style={[styles.modeChip, emailMode === 'register' && styles.modeChipSelected]}
                  textStyle={emailMode === 'register' ? styles.modeChipTextSelected : styles.modeChipText}
                >
                  Create account
                </Chip>
              </View>
              {emailMode === 'register' ? (
                <>
                  <TextInput
                    mode="outlined"
                    label="Name"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                  />
                  {fieldErrors.name ? <HelperText type="error">{fieldErrors.name}</HelperText> : null}
                </>
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
              {fieldErrors.email ? <HelperText type="error">{fieldErrors.email}</HelperText> : null}
              <TextInput
                mode="outlined"
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
              {fieldErrors.password ? <HelperText type="error">{fieldErrors.password}</HelperText> : null}

              {error ? <HelperText type="error">{error}</HelperText> : null}

              <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={styles.primaryButton}>
                {emailMode === 'login' ? 'Sign in' : 'Create account'}
              </Button>
            </>
          )}

          <Button
            mode="outlined"
            onPress={handleGoogle}
            disabled={loading}
            style={styles.googleButton}
          >
            Continue with Google
          </Button>
        </Card.Content>
      </Card>

      <Button
        mode="text"
        onPress={() => setMode(mode === 'phone' ? 'email' : 'phone')}
        style={styles.toggle}
      >
        {mode === 'phone' ? 'Use email instead' : 'Use phone instead'}
      </Button>
    </Screen>
  );
};

const styles = StyleSheet.create({
  modeRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  modeChip: { backgroundColor: '#e5e7eb' },
  modeChipSelected: { backgroundColor: COLORS.primary },
  modeChipText: { color: COLORS.text },
  modeChipTextSelected: { color: '#ffffff', fontWeight: '700' },
  formCard: { borderRadius: 0, backgroundColor: '#ffffff', marginHorizontal: -20 },
  input: { marginBottom: 12, backgroundColor: '#ffffff' },
  infoText: { marginTop: -6, marginBottom: 8, color: COLORS.muted },
  primaryButton: { marginTop: 8 },
  secondaryButton: { marginTop: 4 },
  googleButton: { marginTop: 12 },
  toggle: { marginTop: 10 }
});
