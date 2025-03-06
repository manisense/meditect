import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const HelpScreen = () => {
  const navigation = useNavigation();

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to contact support?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Email', 
          onPress: () => Linking.openURL('mailto:support@meditect.com') 
        },
        { 
          text: 'Phone', 
          onPress: () => Linking.openURL('tel:+18001234567') 
        }
      ]
    );
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
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How does medicine scanning work?</Text>
            <Text style={styles.faqAnswer}>
              Our app uses image recognition to identify medicines from their labels or packaging. 
              Simply point your camera at the medicine, and we'll detect key information like the name and expiry date.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Is my data secure?</Text>
            <Text style={styles.faqAnswer}>
              Yes, all your medicine information is stored securely in your personal account. 
              We use end-to-end encryption and never share your data with third parties.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What if the scan doesn't work?</Text>
            <Text style={styles.faqAnswer}>
              Try scanning in a well-lit area and ensure the medicine label is clearly visible. 
              If problems persist, you can manually enter medicine details.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I receive expiry alerts?</Text>
            <Text style={styles.faqAnswer}>
              Ensure notifications are enabled in your settings, and we'll send you timely alerts 
              before your medicines expire.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={handleContactSupport}
          >
            <Ionicons name="headset-outline" size={24} color="#246BFD" />
            <Text style={styles.contactButtonText}>Get in Touch with Support</Text>
          </TouchableOpacity>
          
          <Text style={styles.supportHours}>
            Our support team is available Monday to Friday, 9am - 5pm EST.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tutorials</Text>
          
          <View style={styles.tutorialsList}>
            <TouchableOpacity style={styles.tutorialItem}>
              <View style={styles.tutorialIcon}>
                <Ionicons name="scan-outline" size={20} color="#246BFD" />
              </View>
              <View style={styles.tutorialInfo}>
                <Text style={styles.tutorialTitle}>How to Scan Medicines</Text>
                <Text style={styles.tutorialDescription}>
                  Learn how to properly scan different types of medicine packaging
                </Text>
              </View>
              <Ionicons name="play-circle-outline" size={24} color="#246BFD" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.tutorialItem}>
              <View style={styles.tutorialIcon}>
                <Ionicons name="notifications-outline" size={20} color="#246BFD" />
              </View>
              <View style={styles.tutorialInfo}>
                <Text style={styles.tutorialTitle}>Setting Up Reminders</Text>
                <Text style={styles.tutorialDescription}>
                  Configure notifications for medicine expiry and dosage reminders
                </Text>
              </View>
              <Ionicons name="play-circle-outline" size={24} color="#246BFD" />
            </TouchableOpacity>
          </View>
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
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F6FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  contactButtonText: {
    color: '#246BFD',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  supportHours: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  tutorialsList: {
    gap: 12,
  },
  tutorialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tutorialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tutorialInfo: {
    flex: 1,
  },
  tutorialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tutorialDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default HelpScreen;
