import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { collection, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

const OffersReceived = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const offersQuery = query(collection(db, "offers"));
      const querySnapshot = await getDocs(offersQuery);
      const offersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOffers(offersList);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setError("Failed to load offers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOfferStatus = async (id, status, name) => {
    const action = status ? "accept" : "decline";
    
    Alert.alert(
      `Confirm ${action}`,
      `Are you sure you want to ${action} the offer from ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await updateDoc(doc(db, "offers", id), { 
                status,
                updatedAt: new Date()
              });
              
              // Update local state
              setOffers(currentOffers => 
                currentOffers.map(offer => 
                  offer.id === id ? { ...offer, status } : offer
                )
              );
              
              Alert.alert(
                "Success",
                `Offer ${status ? "accepted" : "declined"} successfully.`
              );
            } catch (error) {
              console.error("Error updating status:", error);
              Alert.alert(
                "Error",
                "Failed to update offer status. Please try again."
              );
            }
          }
        }
      ]
    );
  };

  const formatDate = (date) => {
    if (!date) return "Date not available";
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderOffer = ({ item }) => (
    <View style={styles.offerCard}>
      <Image 
        source={{ uri: item.image || '/api/placeholder/50/50' }}
        style={styles.image}
      />
      <View style={styles.offerDetails}>
        <Text style={styles.name}>{item.name || 'Anonymous'}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description || 'No description provided'}
        </Text>
        {item.rating && (
          <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
        )}
        <Text style={styles.price}>Price: {item.price} TND</Text>
        <Text style={styles.duration}>Duration: {item.duration} hours</Text>
        <Text style={styles.date}>Date: {formatDate(item.date)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => handleOfferStatus(item.id, true, item.name)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.declineButton]}
          onPress={() => handleOfferStatus(item.id, false, item.name)}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <ChevronLeft color="#000" size={24} />
      </TouchableOpacity>
      <Text style={styles.header}>
        {offers.length} {offers.length === 1 ? 'Offer' : 'Offers'} Received
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ef4444" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchOffers}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <FlatList
        data={offers}
        keyExtractor={(item) => item.id}
        renderItem={renderOffer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No offers received yet</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 45,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    marginRight: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  listContent: {
    padding: 16,
  },
  offerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  offerDetails: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 2,
  },
  duration: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: "#111827",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
  },
  acceptButton: {
    backgroundColor: "#10b981",
  },
  declineButton: {
    backgroundColor: "#ef4444",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  separator: {
    height: 16,
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
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: 'center',
  },
});

export default OffersReceived;