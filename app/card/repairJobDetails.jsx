import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const RepairJobDetails = () => {
  const [bidAmount, setBidAmount] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const jobDetails = {
    owner: {
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1 (555) 234-5678",
      image: "/api/placeholder/64/64" // You'll need to replace with actual image URL
    },
    repair: {
      title: "Leaking Bathroom Faucet Repair",
      description: "Need urgent repair for a constantly dripping bathroom faucet. The leak has been ongoing for about a week and is getting worse. The faucet is a dual-handle model installed around 5 years ago. Would prefer someone who can come in the next 2-3 days.",
      images: [
        "/api/placeholder/800/600", // Replace with actual image URLs
        "/api/placeholder/800/600",
        "/api/placeholder/800/600"
      ],
      location: "Brooklyn, NY",
      postedDate: "2024-03-18"
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? jobDetails.repair.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === jobDetails.repair.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleBidSubmit = () => {
    Alert.alert('Bid Submitted', `Your bid of $${bidAmount} has been submitted`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Owner Profile Section */}
      <View style={styles.card}>
        <View style={styles.ownerContainer}>
          <Image
            source={{ uri: jobDetails.owner.image }}
            style={styles.ownerImage}
          />
          <View style={styles.ownerInfo}>
            <Text style={styles.ownerName}>{jobDetails.owner.name}</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>
                <Text style={styles.contactLabel}>Email: </Text>
                {jobDetails.owner.email}
              </Text>
              <Text style={styles.contactText}>
                <Text style={styles.contactLabel}>Phone: </Text>
                {jobDetails.owner.phone}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Repair Details Section */}
      <View style={styles.card}>
        <Text style={styles.title}>{jobDetails.repair.title}</Text>
        
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: jobDetails.repair.images[currentImageIndex] }}
            style={styles.mainImage}
          />
          <TouchableOpacity
            style={[styles.navButton, styles.leftButton]}
            onPress={handlePrevImage}
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, styles.rightButton]}
            onPress={handleNextImage}
          >
            <ArrowRight color="white" size={24} />
          </TouchableOpacity>
          <View style={styles.pagination}>
            {jobDetails.repair.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentImageIndex === index && styles.activeDot
                ]}
              />
            ))}
          </View>
        </View>

        {/* Thumbnail Preview */}
        <ScrollView horizontal style={styles.thumbnailContainer}>
          {jobDetails.repair.images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentImageIndex(index)}
            >
              <Image
                source={{ uri: image }}
                style={[
                  styles.thumbnail,
                  currentImageIndex === index && styles.activeThumbnail
                ]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{jobDetails.repair.description}</Text>
          
          <View style={styles.metaInfo}>
            <Text style={styles.metaText}>📍 {jobDetails.repair.location}</Text>
            <Text style={styles.metaText}>📅 Posted: {jobDetails.repair.postedDate}</Text>
          </View>
        </View>
      </View>

      {/* Bid Submission Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Submit Your Bid</Text>
        <View style={styles.bidForm}>
          <Text style={styles.label}>Your Bid Amount ($)</Text>
          <TextInput
            style={styles.input}
            value={bidAmount}
            onChangeText={setBidAmount}
            placeholder="Enter your bid amount"
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleBidSubmit}
          >
            <Text style={styles.submitButtonText}>Submit Bid</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  ownerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  ownerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  contactInfo: {
    marginTop: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#4b5563',
    marginVertical: 2,
  },
  contactLabel: {
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
    height: 300,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  leftButton: {
    left: 8,
  },
  rightButton: {
    right: 8,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'white',
  },
  thumbnailContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 8,
  },
  activeThumbnail: {
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  descriptionContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  metaInfo: {
    flexDirection: 'row',
    marginTop: 12,
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 16,
  },
  bidForm: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RepairJobDetails;