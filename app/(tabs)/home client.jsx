import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants/index.js";
import SearchInput from "../../components/SearchInput.jsx";
import CardHeader from "../../components/CardHeader.jsx";
import SmoothHorizontalScroll from "../../components/SmoothHorizontalScroll.jsx";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../../config/firebaseConfig.js';
import GovernorateDropdown from "../../components/GovernorateDropdown.jsx";

const Home = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGovernorate, setSelectedGovernorate] = useState("");

  const DomainesImages = [
    { id: "1", src: require("../../assets/images/cards/card1.jpg"), title: "A" },
    { id: "2", src: require("../../assets/images/cards/card2.jpeg"), title: "A" },
    { id: "3", src: require("../../assets/images/cards/card3.jpg"), title: "A" },
    { id: "4", src: require("../../assets/images/cards/card4.jpg"), title: "A" },
  ];

  const fetchProfessionals = async (governorate = "") => {
    setLoading(true);
    try {
      let q;
      if (governorate) {
        // If governorate is selected, create a filtered query
        q = query(
          collection(db, "Professionals"),
          where("governorate", "==", governorate)
        );
      } else {
        // If no governorate selected, get all professionals
        q = collection(db, "Professionals");
      }

      const querySnapshot = await getDocs(q);
      const professionalsList = [];
      querySnapshot.forEach((doc) => {
        const professionalData = doc.data();
        professionalsList.push({
          id: doc.id,
          ...professionalData,
          imageUrl: professionalData.Profile_pic || null,
        });
      });
      setProfessionals(professionalsList);
    } catch (error) {
      console.error("Error fetching Professionals:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle governorate selection
  const handleGovernorateSelect = (governorate) => {
    setSelectedGovernorate(governorate);
    fetchProfessionals(governorate);
  };

  useEffect(() => {
    // Initial fetch of all professionals
    fetchProfessionals();
  }, []);

  const renderProfessionalImage = (imageUrl) => {
    if (!imageUrl) {
      return (
        <Image
          source={require('../../assets/images/jobs/photo2.png')}
          style={styles.Jobimage}
        />
      );
    }

    return (
      <Image
        source={{ uri: imageUrl }}
        style={styles.Jobimage}
        loadingIndicatorSource={<ActivityIndicator />}
      />
    );
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="my-6 px-4 space-y-6">
          <View className="justify-between items-start flex-row mb-4">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">
                Welcome Back
              </Text>
              <Text className="text-2xl font-psemibold text-black">
                Lehne nhoto Client
              </Text>
            </View>
            <View className="mt-2">
              <Image
                source={images.logoCercle}
                className="w-9 h-10"
                resizeMode="contain"
              />
            </View>
          </View>
          <SearchInput />
        </View>

        <View>
          <Text className="text-2xl font-pmedium text-red-100 text-center">
            Available Domains
          </Text>
        </View>

        <SafeAreaView style={styles.container}>
          <SmoothHorizontalScroll images={DomainesImages} />
        </SafeAreaView>
        <View>
          <Text className="text-2xl font-pmedium text-red-100 text-left pl-5">
            Filter by region
          </Text>
        </View>
        <View className="px-4 mt-4">
          <GovernorateDropdown
            selectedGovernorate={selectedGovernorate}
            onSelectGovernorate={handleGovernorateSelect}
            placeholder="Select Governorate"
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.cardsContainer}>
            {professionals.length === 0 ? (
              <Text style={styles.noResultsText}>
                No professionals found in this governorate
              </Text>
            ) : (
              professionals.map((Professional) => (
                <View key={Professional.id} style={styles.card}>
                  <CardHeader
                    Name={Professional.username}
                    desc={Professional.description}
                    loc={Professional.governorate}
                  />
                  {renderProfessionalImage(Professional.imageUrl)}
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  cardsContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    padding: 16,
    marginBottom: 16,
  },
  Jobimage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  }
});

export default Home;