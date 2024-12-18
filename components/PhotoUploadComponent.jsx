import React, { useState } from 'react';
import { TouchableOpacity, Image, Alert, View, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const PhotoUploadComponent = ({ icons, styles, onPhotoUpload }) => {
  const [photoUri, setPhotoUri] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async () => {
    try {
      // Request permission to access media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Sorry, we need camera roll permissions to make this work!'
        );
        return;
      }

      // Launch image picker with more robust configuration
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Change to false to allow full image selection
        allowsMultipleSelection: false, // Ensure only one image can be selected
        quality: 1,
        base64: false, // Set to true if you want base64 representation
      });

      if (result.canceled) {
        console.log('Image selection was canceled');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setPhotoUri(selectedImage.uri);
        
        // Upload to Cloudinary
        await uploadToCloudinary(selectedImage.uri);
      }
    } catch (error) {
      console.error('Photo selection error:', error);
      Alert.alert('Error', 'Unable to select photo');
    }
  };

  const uploadToCloudinary = async (uri) => {
    setIsUploading(true);
    try {

      // Create form data
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: 'image/jpeg', // or the actual mime type
        name: 'upload.jpg',
      });

      // Your Cloudinary upload preset and cloud name
      formData.append('upload_preset', 'ml_default');
      formData.append('api_key', "319917892412341"); // Provided by your backend

      // Make the upload request to Cloudinary
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dgszdxhif/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Handle successful upload
      if (response.data && response.data.secure_url) {
        const cloudinaryUrl = response.data.secure_url;
        
        // Optional: pass the Cloudinary URL back to parent component
        onPhotoUpload && onPhotoUpload(cloudinaryUrl);
        Alert.alert('Success', 'Image uploaded successfully');
      }
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      Alert.alert('Upload Failed', 'Unable to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.photoUpload}
      onPress={handlePhotoUpload}
      disabled={isUploading}
    >
      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={styles.photo}
        />
      ) : (
        <Image
          source={icons.upload}
          style={styles.photo}
        />
      )}
      {isUploading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PhotoUploadComponent;