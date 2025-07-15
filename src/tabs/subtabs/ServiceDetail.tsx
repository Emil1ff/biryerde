"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import LinearGradient from "react-native-linear-gradient"

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

const ServiceDetailScreen: React.FC<any> = ({ navigation, route }) => {
  const { service } = route.params // Get service ID from navigation params

  // Find the service provider by ID from the imported JSON data
  // const service: ServiceProvider | undefined = servicesData.serviceProviders.find((s) => s.id === serviceId)

  if (!service) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service Not Found</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Service details could not be loaded.</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service Detail</Text>
          <TouchableOpacity style={styles.bookmarkButton}>
            <Icon name="bookmark-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Service Provider Info */}
        <View style={styles.providerSection}>
          <View style={[styles.providerImageContainer, { backgroundColor: service.backgroundColor }]}>
            <Image source={{ uri: service.image }} style={styles.providerImage} />
          </View>
          <Text style={styles.providerName}>{service.providerName}</Text>
          <Text style={styles.serviceCategory}>{service.category} Service</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={20} color="#FFD700" />
            <Text style={styles.rating}>{service.rating}</Text>
            <Text style={styles.reviews}>({service.reviews.toLocaleString()} reviews)</Text>
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>About Service</Text>
          <Text style={styles.serviceDescription}>{service.description}</Text>

          <View style={styles.infoRow}>
            <Icon name="pricetag-outline" size={20} color="#8B5CF6" style={styles.infoIcon} />
            <Text style={styles.infoText}>Price: ${service.price}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="call-outline" size={20} color="#8B5CF6" style={styles.infoIcon} />
            <Text style={styles.infoText}>Contact: {service.contact}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="mail-outline" size={20} color="#8B5CF6" style={styles.infoIcon} />
            <Text style={styles.infoText}>Email: {service.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="location-outline" size={20} color="#8B5CF6" style={styles.infoIcon} />
            <Text style={styles.infoText}>Address: {service.address}</Text>
          </View>
        </View>

        {/* Reviews Section (Placeholder) */}
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <View style={styles.reviewSummary}>
            <Text style={styles.reviewRating}>{service.rating}</Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon key={star} name="star" size={20} color={star <= service.rating ? "#FFD700" : "#6B7280"} />
              ))}
            </View>
            <Text style={styles.reviewCount}>{service.reviews.toLocaleString()} Reviews</Text>
          </View>
          {/* Add actual review list here if available */}
          <TouchableOpacity style={styles.seeAllReviewsButton}>
            <Text style={styles.seeAllReviewsText}>See All Reviews</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomAction}>
        <TouchableOpacity style={styles.bookNowButton}>
          <LinearGradient
            colors={["#8B5CF6", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bookNowGradient}
          >
            <Text style={styles.bookNowText}>Book Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollView: {
    flex: 1,
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
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    width: 40, // To balance the header layout
  },
  providerSection: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  providerImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  providerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  providerName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  serviceCategory: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  rating: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
    marginRight: 8,
  },
  reviews: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
  },
  detailSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  serviceDescription: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 24,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  reviewSummary: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  reviewRating: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginRight: 12,
  },
  stars: {
    flexDirection: "row",
    marginRight: 12,
  },
  reviewCount: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
  },
  seeAllReviewsButton: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
  seeAllReviewsText: {
    fontSize: 16,
    color: "#8B5CF6",
    fontWeight: "600",
  },
  bottomAction: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#000000",
  },
  bookNowButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  bookNowGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  bookNowText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.6)",
  },
})

export default ServiceDetailScreen
