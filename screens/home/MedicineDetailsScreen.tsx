import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { HomeStackParamList, Medicine } from '../../types';
import { useSupabase } from '../../context/SupabaseContext';

type MedicineDetailsRouteProp = RouteProp<HomeStackParamList, 'MedicineDetails'>;

const  MedicineDetailsScreen = () => {
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const route = useRoute<MedicineDetailsRouteProp>();
  const { medicineId } = route.params;
  const { supabase } = useSupabase();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMedicineDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('medicines')
          .select('*')
          .eq('id', medicineId)
          .single();
          
        if (error) throw error;
        setMedicine(data);
      } catch (error) {
        console.error('Error fetching medicine details:', error);
        Alert.alert('Error', 'Failed to load medicine details');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedicineDetails();
  }, [medicineId, supabase, navigation]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Medicine',
      'Are you sure you want to delete this medicine from your records?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              const { error } = await supabase
                .from('medicines')
                .delete()
                .eq('id', medicineId);
                
              if (error) throw error;
              
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting medicine:', error);
              Alert.alert('Error', 'Failed to delete medicine');
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#246BFD" />
      </SafeAreaView>
    );
  }

  if (!medicine) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text>Medicine not found</Text>
      </SafeAreaView>
    );
  }

  // Calculate if medicine is expired or about to expire
  const today = new Date();
  const expiryDate = new Date(medicine.expiryDate);
  const isExpired = expiryDate < today;
  
  // Calculate days until expiration
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isAboutToExpire = daysUntilExpiry > 0 && daysUntilExpiry <= 30;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medicine Details</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#F44336" />
          ) : (
            <Ionicons name="trash-outline" size={24} color="#F44336" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.medicineHeader}>
          <View style={styles.medicineIconContainer}>
            {medicine.imageUrl ? (
              <Image source={{ uri: medicine.imageUrl }} style={styles.medicineImage} />
            ) : (
              <Ionicons name="medical-outline" size={40} color="#246BFD" />
            )}
          </View>
          <View style={styles.medicineTitleContainer}>
            <Text style={styles.medicineName}>{medicine.name}</Text>
            {medicine.dosage && (
              <Text style={styles.medicineDosage}>{medicine.dosage}</Text>
            )}
          </View>
        </View>

        {(isExpired || isAboutToExpire) && (
          <View style={[
            styles.expiryAlert,
            isExpired ? styles.expiredAlert : styles.expiringAlert
          ]}>
            <Ionicons 
              name={isExpired ? "warning-outline" : "time-outline"} 
              size={24} 
              color={isExpired ? "#F44336" : "#FF9800"} 
            />
            <Text style={[
              styles.expiryAlertText,
              isExpired ? styles.expiredAlertText : styles.expiringAlertText
            ]}>
              {isExpired 
                ? 'This medicine has expired!' 
                : `Expires in ${daysUntilExpiry} days!`}
            </Text>
          </View>
        )}

        <View style={styles.detailsCard}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Expiry Date</Text>
            <Text style={[
              styles.detailValue,
              isExpired && styles.expiredText
            ]}>
              {formatDate(medicine.expiryDate)}
            </Text>
          </View>

          {medicine.manufacturer && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Manufacturer</Text>
              <Text style={styles.detailValue}>{medicine.manufacturer}</Text>
            </View>
          )}

          {medicine.batchNumber && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Batch Number</Text>
              <Text style={styles.detailValue}>{medicine.batchNumber}</Text>
            </View>
          )}

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Scanned On</Text>
            <Text style={styles.detailValue}>{formatDate(medicine.scannedAt)}</Text>
          </View>
        </View>

        <View style={styles.reminderCard}>
          <Text style={styles.reminderCardTitle}>
            <Ionicons name="information-circle-outline" size={20} /> Storage Recommendation
          </Text>
          <Text style={styles.reminderCardText}>
            Store in a cool, dry place away from direct sunlight. Keep out of reach of children.
          </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  medicineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  medicineIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  medicineImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  medicineTitleContainer: {
    flex: 1,
  },
  medicineName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  medicineDosage: {
    fontSize: 16,
    color: '#666',
  },
  expiryAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  expiredAlert: {
    backgroundColor: '#FFE9E9',
  },
  expiringAlert: {
    backgroundColor: '#FFF9E9',
  },
  expiryAlertText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  expiredAlertText: {
    color: '#F44336',
  },
  expiringAlertText: {
    color: '#FF9800',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#9E9E9E',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  expiredText: {
    color: '#F44336',
  },
  reminderCard: {
    backgroundColor: '#F0F6FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  reminderCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#246BFD',
    marginBottom: 12,
  },
  reminderCardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  }
});

export default MedicineDetailsScreen;