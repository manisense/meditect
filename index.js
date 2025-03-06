import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';
import App from './App';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Unsupported top level event type "topInsetsChange" dispatched',
  'Require cycle:'
]);

// Use registerRootComponent to register the App
registerRootComponent(App);
