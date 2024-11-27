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


    </SafeAreaView>
  );
};



export default Home;
