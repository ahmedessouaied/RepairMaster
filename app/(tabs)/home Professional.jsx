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
import { db } from "../../config/firebaseConfig.js"; // Firebase imports
import { collection, getDocs } from "firebase/firestore";
import { router } from "expo-router";

const Home = () => {
  const [problems, setProblems] = useState([]); // State for problems data
  const [loading, setLoading] = useState(true); // Loading state

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

  // Fetch problems from Firebase
  const fetchProblems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Problems")); // Query 'Problems' collection
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

  useEffect(() => {
    fetchProblems();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        {/* Header */}
        <View className="my-6 px-4 space-y-6">
          <View className="justify-between items-start flex-row mb-4 ">
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
          <Text className="text-2xl font-pmedium text-red-100">
            Available Domains
          </Text>
        </View>
        <SafeAreaView style={styles.container}>
          <HorizontalScrollingCards cards={DomainesImages} />
        </SafeAreaView>

        {/* Problems List */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          problems.map((problem) => (
            <TouchableOpacity
              key={problem.id}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/card/repairJobDetails",
                  params: { problemId: problem.id },
                })
              }
            >
              <View style={styles.card}>
                <CardHeader
                  Name={problem.title} // Adjust fields to match Problems data structure
                  desc={problem.description}
                  loc={problem.localisation}
                />
                <Image
                  source={{
                    uri:
                      problem.photos?.[0] ||
                      "../../assets/images/jobs/photo2.png",
                  }}
                  style={styles.Jobimage}
                />
              </View>
            </TouchableOpacity>
          ))
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
  Jobcontainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  Jobimage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
});

export default Home;
