import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSupabase } from '../../context/SupabaseContext';
import { useAuth } from '../../context/AuthContext';
import { HistoryStackParamList, Medicine } from '../../types';

const HistoryScreen = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const navigation = useNavigation<StackNavigationProp<HistoryStackParamList>>();

  useEffect(() => {
    if (!user) return;
    
    const fetchMedicines = async () => {
      try {
        const { data, error } = await supabase
          .from('medicines')
          .select('*')
          .eq('userId', user.id)
          .order('scannedAt', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setMedicines(data || []);
        setFilteredMedicines(data || []);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedicines();
  }, [user, supabase]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMedicines(medicines);
    } else {
      const filtered = medicines.filter(medicine => 
        medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (medicine.manufacturer && medicine.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredMedicines(filtered);
    }
  }, [searchQuery, medicines]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderMedicineItem = ({ item }: { item: Medicine }) => (
    <TouchableOpacity
      style={styles.medicineItem}
      onPress={() => navigation.navigate('MedicineDetails', { medicineId: item.id })}
    >
      <View style={styles.medicineIconContainer}>
        <Ionicons name="medical-outline" size={24} color="#246BFD" />
      </View>
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{item.name}</Text>
        <Text style={styles.medicineMetadata}>
          Expires: {formatDate(item.expiryDate)}
        </Text>
        {item.manufacturer && (
          <Text style={styles.medicineMetadata}>
            Manufacturer: {item.manufacturer}
          </Text>
        )}
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.scannedDate}>
          {formatDate(item.scannedAt)}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medicine History</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#9E9E9E" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search medicines..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#9E9E9E" />
          </TouchableOpacity>
        )}
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#246BFD" />
        </View>
      ) : filteredMedicines.length > 0 ? (
        <FlatList
          data={filteredMedicines}
          renderItem={renderMedicineItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="medkit-outline" size={64} color="#BDBDBD" />
          <Text style={styles.emptyText}>
            {searchQuery.length > 0 ? 
              "No medicines found matching your search." : 
              "No medicine history found. Scan some medicines to get started!"}
          </Text>
          {searchQuery.length === 0 && (
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={() => navigation.navigate('Scan' as any)}
            >
              <Text style={styles.scanButtonText}>Scan Medicine</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  listContainer: {
    padding: 20,
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  medicineIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  medicineMetadata: {
    fontSize: 14,
    color: '#9E9E9E',
    marginBottom: 2,
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  scannedDate: {
    fontSize: 12,
    color: '#9E9E9E',
    marginRight: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  scanButton: {
    backgroundColor: '#246BFD',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HistoryScreen;
