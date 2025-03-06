import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [expiryAlerts, setExpiryAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometrics, setBiometrics] = useState(false);
  const navigation = useNavigation();

  const toggleSwitch = (setting: string, value: boolean) => {
    switch (setting) {
      case 'notifications':
        setNotifications(value);
        break;
      case 'expiryAlerts':
        setExpiryAlerts(value);
        break;
      case 'darkMode':
        // In a real app, we'd apply theme changes here
        setDarkMode(value);
        Alert.alert('Dark Mode', 'Dark mode will be available in a future update.');
        setDarkMode(false); // Reset since it's not implemented
        break;
      case 'biometrics':
        // In a real app, we'd configure biometric auth here
        setBiometrics(value);
        Alert.alert('Biometric Authentication', 'Biometric authentication will be available in a future update.');
        setBiometrics(false); // Reset since it's not implemented
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notifications</Text>
        </View>

        <View style={styles.settingsSection}>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Switch
              trackColor={{ false: '#E0E0E0', true: '#BBD6FE' }}
              thumbColor={notifications ? '#246BFD' : '#f4f3f4'}
              ios_backgroundColor="#E0E0E0"
              onValueChange={(value) => toggleSwitch('notifications', value)}
              value={notifications}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Medicine Expiry Alerts</Text>
            <Switch
              trackColor={{ false: '#E0E0E0', true: '#BBD6FE' }}
              thumbColor={expiryAlerts ? '#246BFD' : '#f4f3f4'}
              ios_backgroundColor="#E0E0E0"
              onValueChange={(value) => toggleSwitch('expiryAlerts', value)}
              value={expiryAlerts}
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Appearance</Text>
        </View>

        <View style={styles.settingsSection}>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              trackColor={{ false: '#E0E0E0', true: '#BBD6FE' }}
              thumbColor={darkMode ? '#246BFD' : '#f4f3f4'}
              ios_backgroundColor="#E0E0E0"
              onValueChange={(value) => toggleSwitch('darkMode', value)}
              value={darkMode}
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Security</Text>
        </View>

        <View style={styles.settingsSection}>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Biometric Authentication</Text>
            <Switch
              trackColor={{ false: '#E0E0E0', true: '#BBD6FE' }}
              thumbColor={biometrics ? '#246BFD' : '#f4f3f4'}
              ios_backgroundColor="#E0E0E0"
              onValueChange={(value) => toggleSwitch('biometrics', value)}
              value={biometrics}
            />
          </View>
          
          <TouchableOpacity style={styles.settingAction}>
            <Text style={styles.settingLabel}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Data Management</Text>
        </View>

        <View style={styles.settingsSection}>
          <TouchableOpacity 
            style={styles.settingAction}
            onPress={() => Alert.alert(
              'Clear Scan History',
              'Are you sure you want to clear all your scanning history? This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: () => console.log('Clear history') }
              ]
            )}
          >
            <Text style={styles.settingLabel}>Clear Scan History</Text>
            <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingAction}
            onPress={() => Alert.alert(
              'Export Data',
              'Export all your medicine data to a CSV file.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Export', onPress: () => console.log('Export data') }
              ]
            )}
          >
            <Text style={styles.settingLabel}>Export Data</Text>
            <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#246BFD',
  },
  settingsSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
});

export default SettingsScreen;
