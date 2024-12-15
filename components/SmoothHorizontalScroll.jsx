import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  Animated,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const SmoothHorizontalScroll = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const [DomainesImages, setDomainesImages] = useState(images);

  React.useEffect(() => {
    setDomainesImages(images);
  }, [images]);

  // Optimized scroll handler
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / screenWidth);
        setCurrentIndex(index);
      },
    }
  );

  // Smooth snap to interval
  const getItemLayout = (data, index) => ({
    length: screenWidth,
    offset: index * screenWidth,
    index,
  });

  // Interpolate dot sizes and colors
  const renderPaginationDots = () => {
    return DomainesImages.map((_, index) => {
      const dotOpacity = scrollX.interpolate({
        inputRange: [
          (index - 1) * screenWidth,
          index * screenWidth,
          (index + 1) * screenWidth,
        ],
        outputRange: [0.4, 1, 0.4],
        extrapolate: "clamp",
      });

      const dotScale = scrollX.interpolate({
        inputRange: [
          (index - 1) * screenWidth,
          index * screenWidth,
          (index + 1) * screenWidth,
        ],
        outputRange: [0.8, 1.1, 0.8],
        extrapolate: "clamp",
      });

      return (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              opacity: dotOpacity,
              transform: [{ scale: dotScale }],
              backgroundColor: "#cccccc",
            },
          ]}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={DomainesImages}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
        decelerationRate={0.85} // Smoother deceleration
        snapToInterval={screenWidth}
        renderItem={({ item, index }) => {
          // Interpolate image scale and opacity
          const imageScale = scrollX.interpolate({
            inputRange: [
              (index - 1) * screenWidth,
              index * screenWidth,
              (index + 1) * screenWidth,
            ],
            outputRange: [0.8, 1, 0.8],
            extrapolate: "clamp",
          });

          const imageOpacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * screenWidth,
              index * screenWidth,
              (index + 1) * screenWidth,
            ],
            outputRange: [0.7, 1, 0.7],
            extrapolate: "clamp",
          });

          return (
            <Animated.Image
              source={item.src}
              style={[
                styles.image,
                {
                  transform: [{ scale: imageScale }],
                  opacity: imageOpacity,
                },
              ]}
              resizeMode="cover"
            />
          );
        }}
      />
      <View style={styles.pagination}>{renderPaginationDots()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: screenWidth,
    height: 250, // Adjust as needed
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    margin: 5,
    alignSelf: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default SmoothHorizontalScroll;
