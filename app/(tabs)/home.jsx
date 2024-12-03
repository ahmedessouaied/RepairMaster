import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Dimensions,
  ScrollView
} from "react-native";
import React, { useState, useEffect, useRef }  from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import CardHeader from "../../components/CardHeader";

const { width: screenWidth } = Dimensions.get("window");

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // recall videos -> if any new videos
    setRefreshing(fasle);
  };

  const DomainesImages = [
    { id: "1", src: require("../../assets/images/cards/card1.jpg") },
    { id: "2", src: require("../../assets/images/cards/card2.jpeg") },
    { id: "3", src: require("../../assets/images/cards/card3.jpg") },
    { id: "4", src: require("../../assets/images/cards/card4.jpg") },
  ];

  const users = [
    { name: 'Ahmed Essouaied', desc: "Expert Electrical Services", imageUri: require('../../assets/images/jobs/photo1.png') },
    { name: 'Ahmed Essouaied', desc: "Expert Electrical Services",  imageUri: require('../../assets/images/jobs/photo2.png') },
    { name: 'Ahmed Essouaied', desc: "Expert Electrical Services",  imageUri: require('../../assets/images/jobs/photo3.jpg') },
    { name: 'Ahmed Essouaied', desc: "Expert Electrical Services",  imageUri: require('../../assets/images/jobs/photo4.png') },
  ];

  const flatListRef = useRef(null);

  const getItemLayout = (data, index) => ({
    length: screenWidth, // Each item is the width of the screen
    offset: screenWidth * index, // Offset is index times the item width
    index,
  });

  const onScrollToIndexFailed = (info) => {
    console.warn("Failed to scroll to index:", info.index);
    // Fallback to scroll to the last valid index
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: Math.max(info.highestMeasuredFrameIndex, 0),
        animated: true,
      });
    }
  };


  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / screenWidth);
    setCurrentIndex(newIndex);
  };

  return (
    <SafeAreaView
      className="bg-primary h-full">
        <ScrollView>
      <View className="my-6 px-4 space-y-6">
        <View className="justify-between items-start flex-row mb-6 ">
          <View>
            <Text
              className="font-pmedium text-sm text-gray-100">
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
      <View>
        <Text className="text-2xl font-pmedium text-gray-100" style={{padding:"11px"}}>Available Domains:</Text>
      </View>
      <View style={styles.container}>
        <FlatList
            data={DomainesImages}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            getItemLayout={getItemLayout}
            onScrollToIndexFailed={onScrollToIndexFailed}
            renderItem={({ item, index }) => (
              <Image
                source={item.src}
                style={[
                  styles.image,
                  currentIndex === index ? styles.activeImage : styles.inactiveImage,
                ]}
                resizeMode="cover"
              />
            )}
            initialScrollIndex={3}
            snapToInterval={screenWidth}
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
        {users.map((user, index) => (
          <View key={index} style={styles.card}>
            <CardHeader title={user.name} desc={user.desc}/>
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
  image: {
    marginHorizontal: 7, // Space between images
    borderRadius: 14, // Rounded corners for the images
  },
  activeImage: {
    width: 168, // Adjust width to leave some padding
    height: 268, // Set desired height
  },
  inactiveImage: {
    width: 148, // Adjust width to leave some padding
    height: 236, // Set desired height
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
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
    width: 35,
  },
  inactiveDot: {
    backgroundColor: "gray",
  },
  Jobcontainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    padding: 16,
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  Jobimage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
});

export default Home;
