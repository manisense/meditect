// App.tsx

import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import ExpoSecureStore from 'expo-secure-store/build/ExpoSecureStore';
import * as tf from '@tensorflow/tfjs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';

// Navigation
import MainNavigator from './navigation/MainNavigator';
import AuthNavigator from './navigation/AuthNavigator';

// Context
import { AuthProvider } from './context/AuthContext';
import { SupabaseProvider } from './context/SupabaseContext';

// Define navigation theme
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
  },
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize TensorFlow.js
    const setupTf = async () => {
      try {
        await tf.ready();
        console.log('TensorFlow.js is ready');
        setIsModelReady(true);
      } catch (error) {
        console.error('Failed to initialize TensorFlow.js:', error);
      }
    };

    // Check if user is logged in
    const checkLoginStatus = async () => {
      try {
        const session = await ExpoSecureStore.getValueWithKeyAsync('session');
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    setupTf();
    checkLoginStatus();
  }, []);

  if (isLoading) {
    return null; // or a loading screen
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <SupabaseProvider>
          <AuthProvider>
            <NavigationContainer theme={navigationTheme}>
              {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
            </NavigationContainer>
          </AuthProvider>
        </SupabaseProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
