import React from "react";
import { images } from "../../constants";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const Profile = () => {
  return (
    <View className="bg-primary h-full ">
      <View style={styles.profileSection}>
        <Image
          // source={{ uri: 'https://via.placeholder.com/80' }}
          source={images.profile}
          style={styles.profileImage}
        />
        <Text className="text-2xl font-psemibold text-black">Emna Maalej</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text className="font-psemibold text-l text-black">2</Text>
            <Text className="font-psemibold text-sm text-grey">
              Total Posts
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text className="font-psemibold text-l text-black">1</Text>
            <Text className="font-psemibold text-sm text-grey">
              Active Posts
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text className="font-psemibold text-l text-black">1</Text>
            <Text className="font-psemibold text-sm">Completed Jobs</Text>
          </View>
        </View>
      </View>

      {/* Job Cards */}
      <View style={styles.cardContainer}>
        {/* Card 1 */}
        <View style={styles.cardHeader}>
          <Text className="font-psemibold text-sm text-black">Leaky Faucet</Text>
          <Text className="font-pmedium text-sm text-grey">Plumbery</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.cardBody}>
            <View style={styles.statusBadgeContainer}>
              <Text className="font-pmedium text-sm" style={styles.activeBadge}>
                Active
              </Text>
            </View>
            <Text className="text-m font-psemibold text-black">
              3 offers received
            </Text>
          </View>
          <TouchableOpacity style={styles.detailsButton}>
            <Text
              className="font-pmedium text-l"
              style={styles.detailsButtonText}
            >
              View Details
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card 2 */}
        <View style={styles.cardHeader}>
          <Text className="font-psemibold text-sm text-black">Light Problem</Text>
          <Text className="font-pmedium text-sm text-grey">Electricity</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.cardBody}>
            <View style={styles.statusBadgeContainer}>
              <Text
                className="font-pmedium text-sm"
                style={styles.completedBadge}
              >
                Completed
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.detailsButton}>
            <Text
              className="font-pmedium text-l"
              style={styles.detailsButtonText}
            >
              View Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
    padding:24
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#FF0000", // Red border
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
    padding:24
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
