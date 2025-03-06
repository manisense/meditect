import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ScanStackParamList } from '../types';

// Screens
import ScanScreen from '../screens/scan/ScanScreen';
import ScanResultScreen from '../screens/scan/ScanResultScreen';

const Stack = createStackNavigator<ScanStackParamList>();

const ScanStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ScanScreen" component={ScanScreen} />
      <Stack.Screen name="ScanResult" component={ScanResultScreen} />
    </Stack.Navigator>
  );
};

export default ScanStack;
