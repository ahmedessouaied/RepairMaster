import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import StarRating from "../../components/StarRating";

const RepairDetails = () => {
  const RepairDetailsJson = {
    id: 1,
    repairer: "Ahmed Essouaied",
    type: "Electrical Wiring Repair",
    date: "12 Nov 2023",
    cost: "80 DT",
    status: "Completed",
    description:
      "Full home electrical system inspection and rewiring of main circuit board",
    image: "https://via.placeholder.com/150",
    Rating: 3
  };

  const handleRatingChange = (rating) => {
    console.log(`Review rating updated: ${rating}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Repair Card */}
      <View style={styles.repairCardContainer}>
        <View style={styles.repairCard}>
          <Image
            source={{ uri: RepairDetailsJson.image }}
            style={styles.image}
          />
          <View style={styles.repairDetails}>
            <Text style={styles.name}>{RepairDetailsJson.repairer}</Text>
            <Text style={styles.description}>{RepairDetailsJson.type}</Text>

            <View style={styles.additionalInfo}>
              <Text style={styles.infoText}>{RepairDetailsJson.date}</Text>
              <Text style={styles.statusText}>{RepairDetailsJson.status}</Text>
            </View>
          </View>
        </View>

        {/* Cost Section */}
        <View style={styles.costContainer}>
          <Text style={styles.costLabel}>Total Cost</Text>
          <Text style={styles.price}>{RepairDetailsJson.cost}</Text>
        </View>

        {/* Job Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Job Description</Text>
          <Text style={styles.jobDescription}>
            {RepairDetailsJson.description}
          </Text>
        </View>

        <View style={{marginBottom:10}}>
          <StarRating onRatingChange={handleRatingChange}  initialRating={RepairDetailsJson.Rating}/>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.buttonText}>View Invoice</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
  },
  repairCardContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  repairCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  repairDetails: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  additionalInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
  statusText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  costContainer: {
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  costLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  descriptionContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 10,
  },
  jobDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  buttonContainer: {
    alignItems: "center",
  },
  detailsButton: {
    width: "100%",
    padding: 15,
    backgroundColor: "#000",
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RepairDetails;
