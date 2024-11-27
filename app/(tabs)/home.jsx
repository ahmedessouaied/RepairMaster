import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Dimensions,
} from "react-native";
import React from "react";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";

const { width: screenWidth } = Dimensions.get("window");

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // recall videos -> if any new videos
    setRefreshing(fasle);
  };

  const DomainesImages = [
    { id: "1", src: require("../../assets/images/cards/card1.jpg") }, // Replace with your image paths
    { id: "2", src: require("../../assets/images/cards/card2.jpeg") },
    { id: "3", src: require("../../assets/images/cards/card3.jpg") },
    { id: "4", src: require("../../assets/images/cards/card4.jpg") },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const ITEM_WIDTH = Dimensions.get("window").width; // Full screen width
  const SPACING = 16; // Adjust based on your padding/margin needs

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / screenWidth);
    setCurrentIndex(newIndex);
  };
  return (
    <SafeAreaView
      className="bg-primary h-full"
      style={{ backgroundColor: "white" }}
    >
      <View className="my-6 px-4 space-y-6">
        <View className="justify-between items-start flex-row mb-6 ">
          <View>
            <Text
              className="font-pmedium text-sm text-gray-100"
              style={{ color: "#7B7B8B" }}
            >
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

      {/* <FlatList
        data={[{ id: 1 }, { id: 2 }, { id: 3 }]}

        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Text className="text-3xl text-black">{item.id}</Text>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to upload a video"
          />
        )}
        // ListHeaderComponent={() => ()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        /> */}

      <View style={styles.container}>
        <FlatList
          data={DomainesImages}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <Text style={styles.headerText}>Available Domains</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <Image source={item.src} style={styles.image} resizeMode="cover" />
          )}
          snapToInterval={screenWidth} // Use screen width for snapping
          decelerationRate="fast"
        />

        <View style={styles.pagination}>
          {DomainesImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 186, // Adjust width to leave some padding
    height: 300, // Set desired height
    marginHorizontal: 20, // Space between images
    borderRadius: 16, // Rounded corners for the images
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "red",
  },
  inactiveDot: {
    backgroundColor: "gray",
  },
});

export default Home;
