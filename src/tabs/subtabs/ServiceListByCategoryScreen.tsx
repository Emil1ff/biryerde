"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Image } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import servicesData from "../../data/services.json" 
interface ServiceProvider {
  id: string
  providerName: string
  serviceName: string
  price: number
  rating: number
  reviews: number
  image: string
  backgroundColor: string
  category: string
  description: string
  contact: string
  email: string
  address: string
}

const ServiceListByCategoryScreen: React.FC<any> = ({ navigation, route }) => {
  const { categoryName } = route.params // Get category name from navigation params

  // Filter services based on the category name from the imported JSON data
  const filteredServices = servicesData.serviceProviders.filter((service) => service.category === categoryName)

  const renderServiceItem = ({ item }: { item: ServiceProvider }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => navigation.navigate("ServiceDetail", { service: item })} // Navigate to the new ServiceDetailScreen
    >
      <View style={[styles.serviceImageContainer, { backgroundColor: item.backgroundColor }]}>
        <Image source={{ uri: item.image }} style={styles.providerImage} />
      </View>
      <View style={styles.serviceInfo}>
        <Text style={styles.providerName}>{item.providerName}</Text>
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        <Text style={styles.servicePrice}>${item.price}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviews}>| {item.reviews.toLocaleString()} reviews</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bookmarkButton}>
        <Icon name="bookmark-outline" size={20} color="#8B5CF6" />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName}</Text>
        <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate("Search")}>
          <Icon name="search-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredServices}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.servicesList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  servicesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  serviceImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  providerImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B5CF6",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 4,
    marginRight: 4,
  },
  reviews: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default ServiceListByCategoryScreen
