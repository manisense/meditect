import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HistoryStackParamList } from '../types';

// Screens
import HistoryScreen from '../screens/history/HistoryScreen';
import MedicineDetailsScreen  from '../screens/home/MedicineDetailsScreen';

const Stack = createStackNavigator<HistoryStackParamList>();

const HistoryStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
      <Stack.Screen name="MedicineDetails" component={MedicineDetailsScreen} />
    </Stack.Navigator>
  );
};

export default HistoryStack;
