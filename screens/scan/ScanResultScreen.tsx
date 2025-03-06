import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { ScanStackParamList } from '../../types';
import { useSupabase } from '../../context/SupabaseContext';
import { useAuth } from '../../context/AuthContext';

type ScanResultRouteProp = RouteProp<ScanStackParamList, 'ScanResult'>;

const ScanResultScreen = () => {
  const [isSaving, setIsSaving] = useState(false);
  const route = useRoute<ScanResultRouteProp>();
  const { result } = route.params;
  const navigation = useNavigation<StackNavigationProp<ScanStackParamList>>();
  const { supabase } = useSupabase();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to save medicines');
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('medicines')
        .insert({
          ...result.medicine,
          userId: user.id,
          scannedAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      Alert.alert(
        'Success',
        'Medicine saved successfully',
        [{ text: 'OK', onPress: () => navigation.navigate('ScanScreen') }]
      );
    } catch (error) {
      console.error('Error saving medicine:', error);
      Alert.alert('Error', 'Failed to save medicine information');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderInfoItem = (label: string, value: string | undefined) => {
    if (!value) return null;
    return (
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{label === 'Expiry Date' ? formatDate(value) : value}</Text>
      </View>
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return '#4CAF50'; // Green
    if (confidence >= 0.7) return '#FFC107'; // Yellow
    return '#F44336'; // Red
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
        <Text style={styles.headerTitle}>Scan Result</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.resultHeader}>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Confidence</Text>
            <View style={styles.confidenceBar}>
              <View 
                style={[
                  styles.confidenceFill, 
                  { 
                    width: `${result.confidence * 100}%`,
                    backgroundColor: getConfidenceColor(result.confidence)
                  }
                ]} 
              />
            </View>
            <Text style={styles.confidenceValue}>{Math.round(result.confidence * 100)}%</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Medicine Information</Text>
          
          {renderInfoItem('Name', result.medicine.name)}
          {renderInfoItem('Expiry Date', result.medicine.expiryDate)}
          {renderInfoItem('Manufacturer', result.medicine.manufacturer)}
          {renderInfoItem('Dosage', result.medicine.dosage)}
          {renderInfoItem('Batch Number', result.medicine.batchNumber)}
        </View>
        
        <View style={styles.noteContainer}>
          <Ionicons name="information-circle-outline" size={20} color="#666" />
          <Text style={styles.noteText}>
            Please verify the information above is correct before saving.
          </Text>
        </View>
      </ScrollView>

      <SafeAreaView style={styles.footer} edges={['bottom']}>
        <TouchableOpacity
          style={styles.scanAgainButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.scanAgainButtonText}>Scan Again</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Medicine</Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
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
  resultHeader: {
    marginBottom: 24,
  },
  confidenceContainer: {
    marginBottom: 8,
  },
  confidenceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  confidenceBar: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 6,
  },
  confidenceValue: {
    fontSize: 14,
    color: '#666',
    alignSelf: 'flex-end',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9E9E9E',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  noteText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  scanAgainButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#246BFD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanAgainButtonText: {
    color: '#246BFD',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#246BFD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ScanResultScreen;
