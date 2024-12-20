import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants/index.js";
import SearchInput from "../../components/SearchInput.jsx";
import CardHeader from "../../components/CardHeader.jsx";
import HorizontalScrollingCards from "../../components/HorizontalScrollingCards.jsx";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig.js";
import GovernorateDropdown from "../../components/GovernorateDropdown.jsx";
import { auth } from "../../config/firebaseConfig.js";
import { router } from "expo-router";

const Home = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGovernorate, setSelectedGovernorate] = useState("");

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
          source={require("../../assets/images/jobs/photo2.png")}
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

        <View>
          <Text className="text-2xl font-pmedium text-red-100" style={{ marginLeft: 15 }}>
          Professionals in your area
          </Text>
        </View>

        <SafeAreaView style={styles.container}>
          <HorizontalScrollingCards cards={DomainesImages} />
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
                <TouchableOpacity
                  key={Professional.id}
                  onPress={() =>
                    router.push({
                      pathname: "/card/profileDetails",
                      params: { professionalId: Professional.id },
                    })
                  }
                >
                  <View style={styles.card}>
                    <CardHeader
                      Name={Professional.username}
                      desc={Professional.description}
                      loc={Professional.governorate}
                    />
                    {renderProfessionalImage(Professional.imageUrl)}
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