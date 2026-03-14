# Splito Mobile App

React Native mobile application built with Expo for splitting expenses with friends and groups.

## Tech Stack

- React Native with Expo
- TypeScript
- React Navigation
- Redux Toolkit (state management)
- Axios (API calls)

## Prerequisites

- Node.js 20+
- npm or yarn
- Expo CLI
- Android Studio/SDK (for Android)
- Xcode (for iOS, macOS only)

## Setup

```bash
npm install
npm start
```

## Running the App

### On Android Emulator
```bash
npm run android
```

### On iOS Simulator (macOS only)
```bash
npm run ios
```

### On Physical Device
1. Install Expo Go app from Play Store/App Store
2. Scan the QR code from the terminal
3. Update API URL in `src/constants/config.ts`:
```ts
export const API_URL = 'http://<your-lan-ip>:3000/api';
```

## Configuration

Edit `src/constants/config.ts` to configure:
- API base URL
- Other app settings

## Project Structure

```
src/
├── api/          # API client and endpoints
├── components/   # Reusable UI components
├── constants/    # App constants and config
├── hooks/        # Custom React hooks
├── i18n/         # Internationalization
├── navigation/   # Navigation setup
├── screens/      # App screens
├── store/        # Redux store and slices
├── utils/        # Utility functions
└── theme.ts      # Theme configuration
```

## Google Sign-In

The app uses Google Sign-In for authentication. Make sure the backend is configured with the correct `GOOGLE_CLIENT_ID` for Android.

## Troubleshooting

### Package Version Warnings
```bash
npx expo install react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens @types/react typescript
```

### Android SDK Missing
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools
```

## Build

### Android APK
```bash
eas build --platform android --profile preview
```

### iOS
```bash
eas build --platform ios --profile preview
```
