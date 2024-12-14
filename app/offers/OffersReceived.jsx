import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

const offers = [
 {
    id: 1,
    name: "Ahmed Essouaied",
    description: "A Professional Electrician",
    rating: 4.5,
    price: "20DT",
    image: "https://via.placeholder.com/50",
 },
 {
    id: 2,
    name: "Habib Bekir",
    description: "Your Best Electrician",
    rating: 4.0,
    price: "18DT",
    image: "https://via.placeholder.com/50",
 },
 {
    id: 3,
    name: "Mohamed Sehli",
    description: "Quik Fix Electrician",
    rating: 4.2,
    price: "22DT",
    image: "https://via.placeholder.com/50",
 },
];

const OffersReceived = () => {
  const handleGoBack = () => {
    router.back();
  };

  const renderOffer = ({ item }) => (
    <View style={styles.offerCard}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.offerDetails}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
      </View>
      <Text style={styles.price}>{item.price}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.messageButton}>
          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.selectButton}>
          <Text style={styles.buttonText}>Select Offer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{margin: 10}}>
      <Text style={styles.header}>3 Offers Received:</Text>
      <FlatList
        data={offers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOffer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <TouchableOpacity style={styles.validateButton}>
        <Text style={styles.validateButtonText}>Validate</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  offerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  offerDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  rating: {
    fontSize: 14,
    color: "#FFD700",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  messageButton: {
    padding: 8,
    backgroundColor: "#EEE",
    borderRadius: 8,
    marginRight: 5,
  },
  selectButton: {
    padding: 8,
    backgroundColor: "#000",
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 12,
  },
  separator: {
    height: 10,
  },
  validateButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#FF0000",
    borderRadius: 8,
    alignItems: "center",
  },
  validateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OffersReceived;