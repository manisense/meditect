import { ExpoConfig, ConfigContext } from '@expo/config';


export default ({ config }: ConfigContext): ExpoConfig => ({
  platforms: ['ios', 'android', 'web'],
  ...config,
  name: 'Meditect',
  slug: 'meditect',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  updates: {
    url: 'https://u.expo.dev/your-project-id'
  },
  assetBundlePatterns: [
    "assets/**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.manisense.meditect',
    jsEngine: "hermes"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF'
    },
    package: 'com.manisense.meditect',
    jsEngine: "hermes"
  },
  web: {
    favicon: './assets/icon.png',
    name: 'Meditect',
    shortName: 'Meditect',
    lang: 'en',
    themeColor: '#ffffff',
    backgroundColor: '#ffffff'
  },
  plugins: [
    'expo-camera',
    'expo-secure-store'
  ],
  experiments: {
    tsconfigPaths: true
  },
  newArchEnabled: true,
  extra: {
    eas: {
      projectId: "your-project-id"
    },
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  },
  runtimeVersion: {
    policy: "appVersion"
  },
  jsEngine: "hermes",
});
