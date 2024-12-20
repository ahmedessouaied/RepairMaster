import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const Profiledetails = () => {
  const { professionalId } = useLocalSearchParams(); // Assuming you pass professionalId as a parameter
  const [loading, setLoading] = useState(true);
  const [professionalData, setProfessionalData] = useState(null);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Date not available';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    const fetchProfessionalData = async () => {
      try {
        const professionalDoc = await getDoc(
          doc(db, 'Professionals', professionalId)
        );
        if (professionalDoc.exists()) {
          const data = professionalDoc.data();
          setProfessionalData({
            profilePic:
              data.Profile_Pic ||
              'https://www.freepik.com/free-photos-vectors/default-user', // Consider using a placeholder image URL instead of a text string
            availabilityStatus: data.availabilityStatus || 'Not specified',
            completedJobs: data.completedJobs || 0,
            createdAt: data.createdAt,
            email: data.email,
            governorate: data.governorate || 'Not specified',
            phoneNumber: data.phoneNumber,
            profileComplete: data.profileComplete || false,
            rating: data.rating || 0,
            role: data.role,
            specialties: data.specialties || [],
            status: data.status || 'Not specified',
            totalRatings: data.totalRatings || 0,
            updatedAt: data.updatedAt,
            userId: data.userId,
            username: data.username || 'Anonymous',
            verificationStatus: data.verificationStatus || 'Not specified',
          });
        } else {
          console.log('No such professional found!');
          setProfessionalData(null);
        }
      } catch (error) {
        console.error('Error fetching professional data:', error);
        setProfessionalData(null);
      } finally {
        setLoading(false);
      }
    };

    if (professionalId) {
      fetchProfessionalData();
    }
  }, [professionalId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ef4444" />
      </View>
    );
  }

  if (!professionalData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Professional not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Professional Profile Section */}
      <View style={styles.card}>
        <View style={styles.professionalContainer}>
          <Image
            source={{ uri: professionalData.profilePic }}
            style={styles.professionalImage}
          />
          <View style={styles.professionalInfo}>
            <Text style={styles.professionalName}>
              {professionalData.username}
            </Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>
                <Text style={styles.contactLabel}>Email: </Text>
                {professionalData.email}
              </Text>
              <Text style={styles.contactText}>
                <Text style={styles.contactLabel}>Phone: </Text>
                {professionalData.phoneNumber}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Professional Details Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Profile Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Availability:</Text>
          <Text
            style={[
              styles.detailValue,
              professionalData.availabilityStatus === 'available'
                ? styles.available
                : styles.unavailable,
            ]}
          >
            {professionalData.availabilityStatus}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Rating:</Text>
          <Text style={styles.detailValue}>
            {professionalData.rating} ({professionalData.totalRatings}{' '}
            ratings)
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Completed Jobs:</Text>
          <Text style={styles.detailValue}>
            {professionalData.completedJobs}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Governorate:</Text>
          <Text style={styles.detailValue}>
            {professionalData.governorate}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Specialties:</Text>
          <Text style={styles.detailValue}>
            {professionalData.specialties.length > 0
              ? professionalData.specialties.join(', ')
              : 'No specialties listed'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Verification Status:</Text>
          <Text
            style={[
              styles.detailValue,
              professionalData.verificationStatus === 'verified'
                ? styles.verified
                : styles.unverified,
            ]}
          >
            {professionalData.verificationStatus}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Member Since:</Text>
          <Text style={styles.detailValue}>
            {formatDate(professionalData.createdAt)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Last Updated:</Text>
          <Text style={styles.detailValue}>
            {formatDate(professionalData.updatedAt)}
          </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
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
  professionalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  professionalImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  professionalInfo: {
    marginLeft: 16,
    flex: 1,
  },
  professionalName: {
    fontSize: 22,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  detailValue: {
    fontSize: 16,
    color: '#6b7280',
  },
  available: {
    color: '#10b981', // Example green color for availability
  },
  unavailable: {
    color: '#ef4444', // Example red color for unavailability
  },
  verified: {
    color: '#10b981', // Green color
  },
  unverified: {
    color: '#ef4444', // Red color
  },
});

export default Profiledetails;