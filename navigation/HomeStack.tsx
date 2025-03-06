import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeStackParamList } from '../types';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import MedicineDetailsScreen from '../screens/home/MedicineDetailsScreen';

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="MedicineDetails" component={MedicineDetailsScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
