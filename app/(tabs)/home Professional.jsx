import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants/index.js";
import SearchInput from "../../components/SearchInput.jsx";
import CardHeader from "../../components/CardHeader.jsx";
import HorizontalScrollingCards from "../../components/HorizontalScrollingCards.jsx";
import { db } from "../../config/firebaseConfig.js";
import { collection, getDocs, query, where } from "firebase/firestore";
import { router } from "expo-router";
import GovernorateDropdown from "../../components/GovernorateDropdown.jsx";

const Home = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGovernorate, setSelectedGovernorate] = useState("");

  const DomainesImages = [
    {
      description: "1",
      uri: "https://res.cloudinary.com/dgszdxhif/image/upload/v1734617774/upload_y5x5xz.jpg",
      title: "A",
    },
    {
      description: "2",
      uri: "https://res.cloudinary.com/dgszdxhif/image/upload/v1734617774/upload_y5x5xz.jpg",
      title: "A",
    },
    {
      description: "3",
      uri: "https://res.cloudinary.com/dgszdxhif/image/upload/v1734617774/upload_y5x5xz.jpg",
      title: "A",
    },
    {
      description: "4",
      uri: "https://res.cloudinary.com/dgszdxhif/image/upload/v1734617774/upload_y5x5xz.jpg",
      title: "A",
    },
  ];

  const fetchProblems = async (governorate = "") => {
    setLoading(true);
    try {
      let q;
      if (governorate) {
        // If governorate is selected, create a filtered query
        q = query(
          collection(db, "Problems"),
          where("localisation", "==", governorate)
        );
      } else {
        // If no governorate selected, get all problems
        q = collection(db, "Problems");
      }

      const querySnapshot = await getDocs(q);
      const problemsList = [];
      querySnapshot.forEach((doc) => {
        problemsList.push({ id: doc.id, ...doc.data() });
      });
      setProblems(problemsList);
    } catch (error) {
      console.error("Error fetching Problems:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle governorate selection
  const handleGovernorateSelect = (governorate) => {
    setSelectedGovernorate(governorate);
    fetchProblems(governorate);
  };

  useEffect(() => {
    // Initial fetch of all problems
    fetchProblems();
  }, []);

  const renderProblemImage = (photos) => {
    const defaultImage = require("../../assets/images/jobs/photo2.png");
    
    if (!photos || photos.length === 0) {
      return (
        <Image
          source={defaultImage}
          style={styles.Jobimage}
        />
      );
    }

    return (
      <Image
        source={{ uri: photos[0] }}
        style={styles.Jobimage}
        loadingIndicatorSource={<ActivityIndicator />}
      />
    );
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        {/* Header Section */}
        <View className="my-6 px-4 space-y-6">
          <View className="justify-between items-start flex-row mb-4">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">
                Welcome Back
              </Text>
              <Text className="text-2xl font-psemibold text-black">
                Problem Dashboard
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

        {/* Domains Section */}
        <View>
          <Text className="text-2xl font-pmedium text-red-100 text-center">
            Available Domains
          </Text>
        </View>
        <SafeAreaView style={styles.container}>
          <HorizontalScrollingCards cards={DomainesImages} />
        </SafeAreaView>

        {/* Governorate Filter Section */}
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

        {/* Problems List Section */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {problems.length === 0 ? (
              <Text style={styles.noResultsText}>
                No problems found in this governorate
              </Text>
            ) : (
              problems.map((problem) => (
                <TouchableOpacity
                  key={problem.id}
                  onPress={() =>
                    router.push({
                      pathname: "/card/repairJobDetails",
                      params: { problemId: problem.id },
                    })
                  }
                >
                  <View style={styles.card}>
                    <CardHeader
                      Name={problem.title}
                      desc={problem.description}
                      loc={problem.localisation}
                    />
                    {renderProblemImage(problem.photos)}
                  </View>
                </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});

export default Home;