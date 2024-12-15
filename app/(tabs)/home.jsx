import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import CardHeader from "../../components/CardHeader";
import SmoothHorizontalScroll from "../../components/SmoothHorizontalScroll";


const Home = () => {
  const DomainesImages = [
    { id: "1", src: require("../../assets/images/cards/card1.jpg"), title: "A" },
    { id: "2", src: require("../../assets/images/cards/card2.jpeg"), title: "A" },
    { id: "3", src: require("../../assets/images/cards/card3.jpg"), title: "A" },
    { id: "4", src: require("../../assets/images/cards/card4.jpg"), title: "A" },
  ];

  const users = [
    {
      name: "Ahmed Essouaied",
      desc: "Expert Electrical Services",
      imageUri: require("../../assets/images/jobs/photo1.png"),
    },
    {
      name: "Ahmed Essouaied",
      desc: "Home improvement",
      imageUri: require("../../assets/images/jobs/photo2.png"),
    },
    {
      name: "Ahmed Essouaied",
      desc: "installation, repair, or general carpentry.",
      imageUri: require("../../assets/images/jobs/photo3.jpg"),
    },
    {
      name: "Ahmed Essouaied",
      desc: "construction, installation, or maintenance.",
      imageUri: require("../../assets/images/jobs/photo4.png"),
    },
  ];

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="my-6 px-4 space-y-6">
          <View className="justify-between items-start flex-row mb-6 ">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">
                Welcome Back
              </Text>
              <Text className="text-2xl font-psemibold text-black">Ahmed</Text>
            </View>
            <View className="mt-1.5">
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
            className="text-2xl font-pmedium text-gray-100"
            style={{ padding: "11px" }}
          >
            Available Domains:
          </Text>
        </View>

        <SafeAreaView style={styles.container}>
          <SmoothHorizontalScroll  images={DomainesImages} />
        </SafeAreaView>

        {users.map((user, index) => (
          <View key={index} style={styles.card}>
            <CardHeader title={user.name} desc={user.desc} />
            <Image source={user.imageUri} style={styles.Jobimage} />
          </View>
        ))}
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
