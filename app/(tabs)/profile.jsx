import React from "react";
import { images } from "../../constants";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { router } from 'expo-router';

const Profile = () => {

  return (
    <SafeAreaView style={[styles.container, { marginTop: 20 }]}>
      <View style={styles.profileSection}>
        <Image source={images.profile} style={styles.profileImage} />
        <Text style={styles.profileName}>Emna Maalej</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Total Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Active Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Completed Jobs</Text>
          </View>
        </View>
      </View>

      {/* Job Cards */}
      <View style={styles.cardContainer}>
        {/* Card 1 */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Leaky Faucet</Text>
          <Text style={styles.cardSubtitle}>Plumbery</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.cardBody}>
            <View style={styles.statusBadgeContainer}>
              <Text style={styles.activeBadge}>Active</Text>
            </View>
            <Text style={styles.cardOffers}>3 offers received</Text>
          </View>
          <TouchableOpacity style={styles.detailsButton}>
          <TouchableOpacity onPress={() => router.push("offers/OffersReceived")}>
      <Text style={styles.detailsButtonText}>View Details</Text>
    </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Card 2 */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Light Problem</Text>
          <Text style={styles.cardSubtitle}>Electricity</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.cardBody}>
            <View style={styles.statusBadgeContainer}>
              <Text style={styles.completedBadge}>Completed</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Adjust background as needed
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
    padding: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#FF0000",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    color: "#000",
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  cardContainer: {
    padding: 24,
  },
  card: {
    backgroundColor: "#EDEDED",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statusBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeBadge: {
    backgroundColor: "#FF0000",
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  completedBadge: {
    backgroundColor: "#00FF00",
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  cardOffers: {
    fontSize: 14,
    color: "#000",
  },
  detailsButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 12,
  },
  detailsButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Profile;
