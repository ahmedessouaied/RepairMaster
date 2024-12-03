import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const CardHeader = ({ title, desc }) => {
  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
      <Image
        source={require('../assets/images/more.png')}
        style={styles.dotsImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  statItem: {
    flex: 1, // Ensures the text area takes up available space
  },
  title: {
    fontSize: 16, // Adjust for desired text size
    fontWeight: '500', // Medium font weight
    color: '#000', // Black color for the title
  },
  desc: {
    fontSize: 12, // Adjust for the description's text size
    color: '#7B7B7B', // Gray color for description
  },
  dotsImage: {
    width: 20,  // Adjust size as needed
    height: 20, // Adjust size as needed
    tintColor: '#C5C5C5', // Optional: apply a color tint to the image if needed
  },
});

export default CardHeader;
