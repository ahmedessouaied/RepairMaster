import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants/index.js";
import SearchInput from "../../components/SearchInput.jsx";
import CardHeader from "../../components/CardHeader.jsx";
import SmoothHorizontalScroll from "../../components/SmoothHorizontalScroll.jsx";
import Firestore, { db } from '../../config/firebaseConfig.js'; // Firebase imports
import { collection, getDocs } from "firebase/firestore";
import { router } from "expo-router";



const Home = () => {
  
  const [professionals, setProfessionals] = useState([]); // State for professional data
  const [loading, setLoading] = useState(true); // Loading state

  const DomainesImages = [
    { id: "1", src: require("../../assets/images/cards/card1.jpg"), title: "A" },
    { id: "2", src: require("../../assets/images/cards/card2.jpeg"), title: "A" },
    { id: "3", src: require("../../assets/images/cards/card3.jpg"), title: "A" },
    { id: "4", src: require("../../assets/images/cards/card4.jpg"), title: "A" },
  ];

  const fetchProfessionals = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Professionals"));
      const ProfessionalsList = [];
      querySnapshot.forEach((doc) => {
        ProfessionalsList.push({ id: doc.id, ...doc.data() });
      });
      setProfessionals(ProfessionalsList);
    } catch (error) {
      console.error("Error fetching Professionals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="my-6 px-4 space-y-6">
          <View className="justify-between items-start flex-row mb-4 ">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">
                Welcome Back
              </Text>
              <Text className="text-2xl font-psemibold text-black">Lehne nhotou pro</Text>
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
          <Text
            className="text-2xl font-pmedium text-red-100 text-center">
            Available Domains
          </Text>
        </View>

        <SafeAreaView style={styles.container}>
          <SmoothHorizontalScroll  images={DomainesImages} />
        </SafeAreaView>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          professionals.map((Professional) => (
            <TouchableOpacity 
              key={Professional.id} 
              style={styles.card} 
              onPress={() => router.push('/card/repairJobDetails')}
>
            <View key={Professional.id} style={styles.card}>
              <CardHeader
                Name={Professional.Name}
                desc={Professional.Description}
                loc={Professional.Location}

              />
              <Image
                source={{ uri: '../../assets/images/jobs/photo2.png' }}
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
