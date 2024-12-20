import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { getAuth } from 'firebase/auth';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

const RepairJobDetails = () => {
  const { problemId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [interventionDate, setInterventionDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [jobDetails, setJobDetails] = useState(null);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Date not available';
    
    // Handle both Firestore Timestamp and regular Date objects
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    // Format the date
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        const problemDoc = await getDoc(doc(db, 'Problems', problemId));
        if (problemDoc.exists()) {
          const data = problemDoc.data();
          setJobDetails({
            owner: {
              name: data.clientName || "Anonymous",
              phone: data.phoneNumber || "No phone number provided",
              image: data.clientImage || "/api/placeholder/64/64"
            },
            repair: {
              title: data.title,
              description: data.description,
              images: data.photos || [],
              location: data.localisation,
              postedDate: data.createdAt,
              category: data.category,
              status: data.status
            }
          });
        }
      } catch (error) {
        console.error('Error fetching problem details:', error);
        Alert.alert('Error', 'Failed to load repair job details');
      } finally {
        setLoading(false);
      }
    };

    if (problemId) {
      fetchProblemDetails();
    }
  }, [problemId]);

  const handlePrevImage = () => {
    if (!jobDetails?.repair.images.length) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? jobDetails.repair.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!jobDetails?.repair.images.length) return;
    setCurrentImageIndex((prev) => 
      prev === jobDetails.repair.images.length - 1 ? 0 : prev + 1
    );
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setInterventionDate(selectedDate);
    }
  };

  const handleBidSubmit = async () => {
    if (!bidAmount || !estimatedTime || !interventionDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const auth = getAuth();
    const professionalId = auth.currentUser?.uid;

    if (!professionalId) {
      Alert.alert('Error', 'User not authenticated. Please log in.');
      return;
    }

    try {
      await addDoc(collection(db, 'offers'), {
        Price_proposed: parseFloat(bidAmount),
        Problem_id: problemId,
        Statue: false, // Initial status is "denied"
        working_time: parseInt(estimatedTime, 10),
        date_proposed: interventionDate,
        professional_id: professionalId,
      });

      Alert.alert(
        'Bid Submitted',
        `Your bid of ${bidAmount} TND has been successfully submitted.\nEstimated time: ${estimatedTime} hours\nIntervention date: ${interventionDate.toLocaleDateString()}`
      );

      // Reset form fields
      setBidAmount('');
      setEstimatedTime('');
      setInterventionDate(new Date());
    } catch (error) {
      console.error('Error submitting bid:', error);
      Alert.alert('Error', 'Failed to submit bid. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ef4444" />
      </View>
    );
  }

  if (!jobDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.description}>Problem not found</Text>
      </View>
    );
  }

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
        
        {jobDetails.repair.status && (
          <View style={[
            styles.statusBadge, 
            jobDetails.repair.status === 'on hold' && styles.statusOnHold
          ]}>
            <Text style={styles.statusText}>
              {jobDetails.repair.status}
            </Text>
          </View>
        )}

        {/* Image Gallery */}
        {jobDetails.repair.images.length > 0 && (
          <>
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
          </>
        )}

        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{jobDetails.repair.description}</Text>
          
          <View style={styles.metaInfo}>
            <Text style={styles.metaText}>📍 {jobDetails.repair.location}</Text>
            {jobDetails.repair.category && (
              <Text style={styles.metaText}>🏷️ {jobDetails.repair.category}</Text>
            )}
            <Text style={styles.metaText}>
              📅 Posted: {formatDate(jobDetails.repair.postedDate)}
            </Text>
          </View>
        </View>
      </View>

      {/* Bid Submission Section */}
      {(!jobDetails.repair.status || jobDetails.repair.status === 'on hold') && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Offer details</Text>
          <View style={styles.bidForm}>
            <Text style={styles.label}>Your Bid Amount in TND</Text>
            <TextInput
              style={styles.input}
              value={bidAmount}
              onChangeText={setBidAmount}
              placeholder="Enter your bid amount"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Estimated Working Time (hours)</Text>
            <TextInput
              style={styles.input}
              value={estimatedTime}
              onChangeText={setEstimatedTime}
              placeholder="Enter estimated time"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Proposed Intervention Date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {interventionDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={interventionDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleBidSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Bid</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
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
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#9CA3AF',
    marginBottom: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  statusOnHold: {
    backgroundColor: '#FF0000',
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
    transform: [{ translateY: -20 }],
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
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 16,
    marginBottom: 4,
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
  dateInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    backgroundColor: 'white',
  },
  dateText: {
    fontSize: 16,
    color: '#374151',
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