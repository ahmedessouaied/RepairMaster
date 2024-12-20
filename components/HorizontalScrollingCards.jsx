import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';



const Card = ({ title, description, image_uri, CARD_WIDTH }) => {
  return (
    <TouchableOpacity style={{ ...styles.cardContainer, width: CARD_WIDTH }}activeOpacity={0.9}>
      <ImageBackground
        source={{ uri: image_uri }}
        style={styles.cardBackground}
        imageStyle={styles.cardImage}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={styles.gradient}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardText}>{description}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const HorizontalScrollingCards = ({cards, CARD_WIDTH = 190}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center"
      >
        {cards.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            description={card.description}
            image_uri={card.uri}
            CARD_WIDTH={CARD_WIDTH}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  cardContainer: {
    height: 240,
    marginHorizontal: 10,
    borderRadius: 6,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardBackground: {
    flex: 1,
  },
  cardImage: {
    borderRadius: 6,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    borderRadius: 6,
  },
  cardInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 5,
  },
  cardText: {
    fontSize: 16,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 5,
  },
});

export default HorizontalScrollingCards;