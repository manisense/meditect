import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSupabase } from '../../context/SupabaseContext';
import { useAuth } from '../../context/AuthContext';
import { HomeStackParamList, Medicine } from '../../types';

const HomeScreen = () => {
  const [recentMedicines, setRecentMedicines] = useState<Medicine[]>([]);
  const [upcomingExpirations, setUpcomingExpirations] = useState<Medicine[]>([]);
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      // Fetch recent medicines
      const { data: recentData, error: recentError } = await supabase
        .from('medicines')
        .select('*')
        .eq('userId', user.id)
        .order('scannedAt', { ascending: false })
        .limit(5);
        
      if (recentError) {
        console.error('Error fetching recent medicines:', recentError);
      } else {
        setRecentMedicines(recentData);
      }
      
      // Fetch upcoming expirations (within next 90 days)
      const today = new Date();
      const ninetyDaysLater = new Date(today);
      ninetyDaysLater.setDate(today.getDate() + 90);
      
      const { data: expiryData, error: expiryError } = await supabase
        .from('medicines')
        .select('*')
        .eq('userId', user.id)
        .gte('expiryDate', today.toISOString().split('T')[0])
        .lte('expiryDate', ninetyDaysLater.toISOString().split('T')[0])
        .order('expiryDate', { ascending: true })
        .limit(5);
        
      if (expiryError) {
        console.error('Error fetching upcoming expirations:', expiryError);
      } else {
        setUpcomingExpirations(expiryData);
      }
    };
    
    fetchData();
  }, [user, supabase]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderMedicineCard = ({ item }: { item: Medicine }) => (
    <TouchableOpacity 
      style={styles.medicineCard}
      onPress={() => navigation.navigate('MedicineDetails', { medicineId: item.id })}
    >
      <View style={styles.medicineIconContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.medicineImage} />
        ) : (
          <Ionicons name="medical-outline" size={28} color="#246BFD" />
        )}
      </View>
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{item.name}</Text>
        <Text style={styles.medicineDetails}>
          Expires: {formatDate(item.expiryDate)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Hello, {user?.name || 'User'}</Text>
            <Text style={styles.headerSubtitle}>Welcome back to Meditect</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.scanButton}>
          <TouchableOpacity 
            style={styles.scanButtonInner}
            onPress={() => navigation.navigate('Scan' as any)}
          >
            <Ionicons name="scan-outline" size={24} color="#fff" />
            <Text style={styles.scanButtonText}>Scan Medicine</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History' as any)}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          {recentMedicines.length > 0 ? (
            <FlatList
              data={recentMedicines}
              renderItem={renderMedicineCard}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.medicineList}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No recent scans found</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Expirations</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History' as any)}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          {upcomingExpirations.length > 0 ? (
            <View style={styles.expirationList}>
              {upcomingExpirations.map(medicine => (
                <TouchableOpacity
                  key={medicine.id}
                  style={styles.expirationCard}
                  onPress={() => navigation.navigate('MedicineDetails', { medicineId: medicine.id })}
                >
                  <View style={styles.expirationInfo}>
                    <Text style={styles.expirationName}>{medicine.name}</Text>
                    <Text style={styles.expirationDate}>
                      Expires: {formatDate(medicine.expiryDate)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#9E9E9E" />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No upcoming expirations</Text>
            </View>
          )}
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
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#9E9E9E',
    marginTop: 4,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scanButton: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scanButtonInner: {
    flexDirection: 'row',
    backgroundColor: '#246BFD',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    fontSize: 16,
    color: '#246BFD',
  },
  medicineList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  medicineCard: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  medicineIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicineImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  medicineDetails: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  expirationList: {
    paddingHorizontal: 20,
  },
  expirationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  expirationInfo: {
    flex: 1,
  },
  expirationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  expirationDate: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 4,
  },
  emptyStateContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9E9E9E',
    textAlign: 'center',
  }
});

export default HomeScreen;