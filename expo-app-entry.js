// This file is created to fix the entry point for Expo
import { registerRootComponent } from 'expo';
import App from './App';
import 'react-native-gesture-handler';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Unsupported top level event type "topInsetsChange" dispatched',
]);

registerRootComponent(App);
