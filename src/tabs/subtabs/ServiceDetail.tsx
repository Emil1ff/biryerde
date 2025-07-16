import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { servicesData } from '../../data/services.json'; // Adjust path as needed

interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  iconFamily: 'Ionicons' | 'MaterialIcons';
  description: string;
  providersCount: number;
}

const AllServices = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allCategories, setAllCategories] = useState<ServiceCategory[]>([]);

  useEffect(() => {
    setAllCategories(servicesData.categories);
  }, []);

  const filteredCategories = allCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderServiceItem = ({ item }: { item: ServiceCategory }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() =>
        // Pass serviceId instead of the whole item
        navigation.navigate('ServiceDetail', { serviceId: item.id })
      }
    >
      <View style={[styles.serviceIcon, { backgroundColor: item.color }]}>
        {item.iconFamily === 'Ionicons' ? (
          <Icon name={item.icon} size={32} color="#FFFFFF" />
        ) : (
          <MaterialIcons name={item.icon} size={32} color="#FFFFFF" />
        )}
      </View>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceDescription}>{item.description}</Text>
        <Text style={styles.providerCount}>
          {item.providersCount} providers
        </Text>
      </View>
      <Icon name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.5)" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Services</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Icon name="search-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredCategories}
        renderItem={renderServiceItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.servicesList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  servicesList: {
    paddingHorizontal: 20,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  providerCount: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
});

export default AllServices;