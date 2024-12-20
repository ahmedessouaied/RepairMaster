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
import { auth } from "../../config/firebaseConfig.js";

const Home = () => {
  const [problems, setProblems] = useState([]); // State for problems data
  const [loading, setLoading] = useState(true); // Loading state

  const DomainesImages = [
    {
      description: "316 plumbers",
      uri: "https://prowess.org.uk/wp-content/uploads/2013/01/Depositphotos_60839993_s-2019.jpg",
      title: "Plumbery",
    },
    {
      description: "250 Electricians",
      uri: "https://media.istockphoto.com/id/516005348/photo/african-electrical-worker-using-laptop-computer.jpg?s=612x612&w=0&k=20&c=YOoIZXo1BHEVdi_R-bXQvxCwX7nkaCogh6YzdysFtbY=",
      title: "Electricians",
    },
    {
      description: "318 Carpenters",
      uri: "https://www.niagaracollege.ca/trades/wp-content/uploads/sites/73/2021/06/i-gc-1-scaled.jpg",
      title: "Carpenter",
    },
    {
      description: "170 Painter",
      uri: "https://jooinn.com/images/painter-7.jpg",
      title: "Painters",
    },
    {
      description: "220 HVAC Technicians",
      uri: "https://media.istockphoto.com/id/516005348/photo/african-electrical-worker-using-laptop-computer.jpg?s=612x612&w=0&k=20&c=YOoIZXo1BHEVdi_R-bXQvxCwX7nkaCogh6YzdysFtbY=",
      title: "HVAC Technicians",
    },
    {
      description: "598 General Maintenances",
      uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F4.bp.blogspot.com%2F-EB4EbY6lJa8%2FUXi_iTJVUmI%2FAAAAAAAAAEs%2Fij1uTFFyCow%2Fs1600%2Fbuilding%2Bmaintenance%2Band%2Brepair.jpg&f=1&nofb=1&ipt=005c4477410dad7d3eced17121721eff397b094f18b4d39b7da15720dbeabfa5&ipo=images",
      title: "General Maintenance",
    },
    {
      description: "197 Appliance Repaires",
      uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Finsights.workwave.com%2Fwp-content%2Fuploads%2F2020%2F12%2Fchoosing-the-right-tool-plumber-repairing-washing-machine-picture-id1170038003.jpg&f=1&nofb=1&ipt=eb4fb0d6820c39e0c75b394a27c6dcf3dd9aed9e6d4612812292b5dc25263630&ipo=images",
      title: "Appliance Repair",
    },
    {
      description: "897 Electronics Repaires",
      uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthumbs.dreamstime.com%2Fz%2Felectronics-repair-shop-technician-works-flat-screen-tv-antipolo-city-philippines-june-72644593.jpg&f=1&nofb=1&ipt=17cc8480904292e10ed73c48ca59cae9168a127d9facfd49ec0d9ab77d81a2dd&ipo=images",
      title: "Electronics Repair",
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
                {auth.currentUser.displayName}
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
          <Text
            className="text-2xl font-pmedium text-red-100"
            style={{ marginLeft: 15 }}
          >
            Professionals in your area
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
