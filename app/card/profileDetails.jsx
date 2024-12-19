import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Star } from 'lucide-react-native';

const ProfileDetails = () => {
 const profile = {
   name: "Emna Maalej",
   rating: 4.5,
   description: "Professional plumber with 10+ years of experience specializing in residential and commercial plumbing services. Licensed and insured.",
   email: "emna.maalej@example.com",
   phone: "+1 (555) 123-4567",
   reviews: [
     {
       id: 1,
       author: "John Doe",
       rating: 5,
       comment: "Excellent work on fixing our kitchen sink. Very professional and thorough.",
       date: "2024-03-15"
     },
     {
       id: 2,
       author: "Sarah Smith",
       rating: 4,
       comment: "Quick response and good service. Would recommend.",
       date: "2024-03-10"
     }
   ]
 };

 const renderStars = (rating) => {
   return [...Array(5)].map((_, index) => (
     <Star
       key={index}
       size={20}
       color={index < Math.floor(rating) ? '#FBBF24' : '#D1D5DB'}
       fill={index < Math.floor(rating) ? '#FBBF24' : 'none'}
     />
   ));
 };

 return (
   <ScrollView style={styles.container}>
     {/* Profile Header */}
     <View style={styles.card}>
       <View style={styles.profileHeader}>
         <Image
           source={{ uri: 'https://via.placeholder.com/80' }}
           style={styles.profileImage}
         />
         <View style={styles.headerInfo}>
           <Text style={styles.name}>{profile.name}</Text>
           <View style={styles.ratingContainer}>
             <View style={styles.starsContainer}>
               {renderStars(profile.rating)}
             </View>
             <Text style={styles.ratingText}>{profile.rating}</Text>
           </View>
         </View>
       </View>
       
       <View style={styles.descriptionContainer}>
         <Text style={styles.description}>{profile.description}</Text>
       </View>

       {/* Contact Information */}
       <View style={styles.contactInfo}>
         <View style={styles.contactItem}>
           <Text style={styles.label}>Email:</Text>
           <Text style={styles.value}>{profile.email}</Text>
         </View>
         <View style={styles.contactItem}>
           <Text style={styles.label}>Phone:</Text>
           <Text style={styles.value}>{profile.phone}</Text>
         </View>
       </View>
     </View>

     {/* Past Reviews */}
     <View style={styles.card}>
       <Text style={styles.reviewsTitle}>Past Reviews</Text>
       <View style={styles.reviewsContainer}>
         {profile.reviews.map((review) => (
           <View key={review.id} style={styles.review}>
             <View style={styles.reviewHeader}>
               <View>
                 <Text style={styles.reviewAuthor}>{review.author}</Text>
                 <View style={styles.starsContainer}>
                   {renderStars(review.rating)}
                 </View>
               </View>
               <Text style={styles.reviewDate}>{review.date}</Text>
             </View>
             <Text style={styles.reviewComment}>{review.comment}</Text>
           </View>
         ))}
       </View>
     </View>
   </ScrollView>
 );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#F9FAFB',
   padding: 16,
 },
 card: {
   backgroundColor: '#FFFFFF',
   borderRadius: 8,
   padding: 16,
   marginBottom: 16,
   shadowColor: '#000',
   shadowOffset: {
     width: 0,
     height: 2,
   },
   shadowOpacity: 0.1,
   shadowRadius: 3,
   elevation: 3,
 },
 profileHeader: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 16,
 },
 profileImage: {
   width: 80,
   height: 80,
   borderRadius: 40,
   borderWidth: 2,
   borderColor: '#EF4444',
 },
 headerInfo: {
   marginLeft: 16,
   flex: 1,
 },
 name: {
   fontSize: 24,
   fontWeight: 'bold',
   color: '#111827',
 },
 ratingContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   marginTop: 8,
 },
 starsContainer: {
   flexDirection: 'row',
 },
 ratingText: {
   marginLeft: 8,
   color: '#4B5563',
 },
 descriptionContainer: {
   marginBottom: 16,
 },
 description: {
   color: '#4B5563',
   fontSize: 16,
 },
 contactInfo: {
   gap: 8,
 },
 contactItem: {
   flexDirection: 'row',
   alignItems: 'center',
 },
 label: {
   fontWeight: '500',
   color: '#374151',
   marginRight: 8,
 },
 value: {
   color: '#4B5563',
 },
 reviewsTitle: {
   fontSize: 20,
   fontWeight: 'bold',
   color: '#111827',
   marginBottom: 16,
 },
 reviewsContainer: {
   gap: 16,
 },
 review: {
   borderBottomWidth: 1,
   borderBottomColor: '#E5E7EB',
   paddingBottom: 16,
 },
 reviewHeader: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'flex-start',
 },
 reviewAuthor: {
   fontWeight: '500',
   color: '#111827',
   marginBottom: 4,
 },
 reviewDate: {
   fontSize: 14,
   color: '#6B7280',
 },
 reviewComment: {
   marginTop: 8,
   color: '#4B5563',
 },
});

export default ProfileDetails;