'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker } from 'react-native-maps';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Booking {
  id: string;
  serviceName: string;
  providerName: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
  image: string;
  backgroundColor: string;
  address: string;
  mapImage?: string;
  latitude: number;
  longitude: number;
}

const getStatusColor = (status: Booking['status']) => {
  switch (status) {
    case 'upcoming':
      return '#00BCD4';
    case 'completed':
      return '#4CAF50';
    case 'cancelled':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};

const getStatusText = (status: Booking['status']) => {
  switch (status) {
    case 'upcoming':
      return 'Upcoming';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

const BookingCard: React.FC<{ item: Booking }> = ({ item }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity style={styles.bookingItem} activeOpacity={0.8}>
        <View style={styles.cardContent}>
          <View
            style={[
              styles.serviceImageContainer,
              { backgroundColor: item.backgroundColor },
            ]}
          >
            <Image source={{ uri: item.image }} style={styles.providerImage} />
          </View>
          <View style={styles.bookingInfo}>
            <View style={styles.bookingHeader}>
              <Text style={styles.serviceName}>{item.serviceName}</Text>
              <TouchableOpacity style={styles.moreButton}>
                <MaterialCommunityIcons
                  name="dots-horizontal"
                  size={20}
                  color="#B0BEC5"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.providerName}>{item.providerName}</Text>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {getStatusText(item.status)}
                </Text>
              </View>
            </View>
            <View style={styles.bookingDetails}>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={16}
                  color="#B0BEC5"
                  style={styles.detailIcon}
                />
                <Text style={styles.detailText}>{item.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={16}
                  color="#B0BEC5"
                  style={styles.detailIcon}
                />
                <Text style={styles.detailText}>{item.time}</Text>
              </View>
            </View>
            <View style={styles.addressContainer}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={16}
                color="#B0BEC5"
                style={styles.detailIcon}
              />
              <Text style={styles.addressText}>{item.address}</Text>
            </View>
          </View>
        </View>

        {(item.status === 'completed' || item.status === 'cancelled') && (
          <View style={styles.mapContainer}>
            {/* <MapView
              style={styles.mapImage}
              initialRegion={{
                latitude: item.latitude,
                longitude: item.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false} 
            >
              <Marker
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
              />
            </MapView> */}

            
            {/* <MapView
              style={styles.mapImage}
              region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            ></MapView> */}
            <LinearGradient
              colors={['rgba(0, 188, 212, 0.8)', 'rgba(0, 229, 255, 0.8)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.viewReceiptButtonGradient}
            >
              <TouchableOpacity style={styles.viewReceiptButton}>
                <Text style={styles.viewReceiptButtonText}>View E-Receipt</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {item.status === 'upcoming' && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rescheduleButton}>
              <LinearGradient
                colors={['#8B5CF6', '#A855F7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.rescheduleButtonGradient}
              >
                <Text style={styles.rescheduleButtonText}>Reschedule</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const BookingsScreen: React.FC<any> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState<Booking['status'] | 'All'>(
    'Upcoming',
  );
  const tabs: (Booking['status'] | 'All')[] = [
    'Upcoming',
    'Completed',
    'Cancelled',
  ];

  const bookings: Booking[] = [
    {
      id: '1',
      serviceName: 'Plumbing Repair',
      providerName: 'Chantel Chadwick',
      date: 'Dec 23, 2024',
      time: '10:00 AM',
      status: 'upcoming',
      price: 25,
      image: '/images/plumbing-repair-image.jpeg',
      backgroundColor: '#FFCDD2', // Light Red
      address: '123 Main St, New York',
      latitude: 40.712776,
      longitude: -74.005974,
    },
    {
      id: '2',
      serviceName: 'Appliance Service',
      providerName: 'Kenny Spenceman',
      date: 'Dec 24, 2024',
      time: '2:00 PM',
      status: 'upcoming',
      price: 45,
      image: '/images/appliance-service-image.jpeg',
      backgroundColor: '#BBDEFB', // Light Blue
      address: '456 Oak Ave, Brooklyn',
      latitude: 40.712776,
      longitude: -74.005974,
    },
    {
      id: '3',
      serviceName: 'Laundry Services',
      providerName: 'Phyllis Godley',
      date: 'Dec 20, 2024',
      time: '9:00 AM',
      status: 'upcoming',
      price: 30,
      image: '/images/laundry-services-image.jpeg',
      backgroundColor: '#C8E6C9', // Light Green
      address: '789 Pine St, Manhattan',
      latitude: 40.712776,
      longitude: -74.005974,
    },
    {
      id: '4',
      serviceName: 'Home Cleaning',
      providerName: 'Marygold Medley',
      date: 'Dec 12, 2024',
      time: '10:00 AM',
      status: 'completed',
      price: 60,
      image: '/images/home-cleaning-image.jpeg',
      backgroundColor: '#FFF9C4', // Light Yellow
      address: '169 Carpenter Pass',
      mapImage: '/images/map-placeholder-q23423.png',
      latitude: 40.712776,
      longitude: -74.005974,
    },
    {
      id: '5',
      serviceName: 'Laundry Services',
      providerName: 'Alfonso Schumacher',
      date: 'Dec 08, 2024',
      time: '09:00 AM',
      status: 'completed',
      price: 35,
      image: '/images/laundry-services-image-2.jpeg',
      backgroundColor: '#DCEDC8', // Light Greenish-Yellow
      address: '08099 Anhalt Alley',
      mapImage: '/images/map-placeholder-q23423.png',
      latitude: 40.712776,
      longitude: -74.005974,
    },
    {
      id: '6',
      serviceName: 'Painting the Walls',
      providerName: 'Alfonso Schumacher',
      date: 'Dec 04, 2024',
      time: '02:00 PM',
      status: 'completed',
      price: 20,
      image: '/images/painting-walls-image.jpeg',
      backgroundColor: '#CFD8DC', // Light Blue-Grey
      address: '8620 Kropf Street',
      mapImage: '/images/map-placeholder-q23423.png',
      latitude: 40.712776,
      longitude: -74.005974,
    },
    {
      id: '7',
      serviceName: 'Plumbing Repair',
      providerName: 'Chantel Chadwick',
      date: 'Nov 20, 2024',
      time: '11:00 AM',
      status: 'cancelled',
      price: 50,
      image: '/images/plumbing-repair-image.jpeg',
      backgroundColor: '#FFCDD2', // Light Red
      address: '123 Main St, New York',
      mapImage: '/images/map-placeholder-q23423.png',
      latitude: 40.712776,
      longitude: -74.005974,
    },
  ];

  // Filter bookings based on the selected tab
  const filteredBookings = bookings.filter(booking => {
    if (selectedTab === 'All') {
      return true; // Show all bookings if "All" is selected (though not in current tabs)
    }
    return booking.status === selectedTab.toLowerCase(); // Filter by status
  });

  // Animate layout changes when the selected tab changes
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [selectedTab]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation?.navigate('Search')} // Use optional chaining for navigation
        >
          <MaterialCommunityIcons name="magnify" size={24} color="#E0E0E0" />
        </TouchableOpacity>
      </View>

      {/* Tabs Section */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bookings List or Empty State */}
      {filteredBookings.length > 0 ? (
        <FlatList
          data={filteredBookings}
          renderItem={({ item }) => <BookingCard item={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.bookingsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Image
            source={{
              uri: '/images/empty-state-image.png',
            }}
            style={styles.emptyStateImage}
          />
          <Text style={styles.emptyStateTitle}>
            You have no upcoming booking
          </Text>
          <Text style={styles.emptyStateDescription}>
            You do not have an upcoming booking. Make a new booking by clicking
            the button below
          </Text>
          <TouchableOpacity style={styles.makeNewBookingButton}>
            <Text style={styles.makeNewBookingButtonText}>
              Make New Booking
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

// Stylesheet for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Dark background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: Platform.OS === 'android' ? 0 : 30, // Adjust for iOS SafeAreaView
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsWrapper: {
    backgroundColor: '#000000',
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabsContent: {
    paddingHorizontal: 20,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)', // Purple border for inactive tabs
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#8B5CF6', // Solid purple for active tab
    borderColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 14,
    color: 'rgba(139, 92, 246, 0.9)', // Light purple text for inactive tabs
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF', // White text for active tab
  },
  bookingsList: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 100, // Ensure space at the bottom for scrolling
  },
  bookingItem: {
    backgroundColor: '#212121', // Dark grey card background
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // Android shadow
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  serviceImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  providerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bookingInfo: {
    flex: 1, // Takes remaining space
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  moreButton: {
    padding: 4,
  },
  providerName: {
    fontSize: 13,
    color: '#B0BEC5', // Light grey
    marginBottom: 8,
  },
  statusRow: {
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start', // Make badge only as wide as its content
  },
  statusText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bookingDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailIcon: {
    marginRight: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#CFD8DC', // Lighter grey
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 13,
    color: '#B0BEC5',
    flex: 1,
  },
  mapContainer: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  viewReceiptButtonGradient: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  viewReceiptButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewReceiptButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(244, 67, 54, 0.15)', // Light red transparent
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#F44336', // Red border
  },
  cancelButtonText: {
    fontSize: 13,
    color: '#F44336', // Red text
    fontWeight: '600',
  },
  rescheduleButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  rescheduleButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  rescheduleButtonText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 50,
  },
  emptyStateImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  makeNewBookingButton: {
    backgroundColor: '#8B5CF6', // Purple button
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  makeNewBookingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingsScreen;
