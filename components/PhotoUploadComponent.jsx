import React, { useState } from "react";
import {
  TouchableOpacity,
  Image,
  Alert,
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const PhotoUploadComponent = ({
  children,
  styles,
  onPhotoUpload,
  photoSelectionLimit = 10,
  uploadedphotostyle = PhotoUpload_styles.photo
}) => {
  const [photoUris, setPhotoUris] = useState([]);
  const [cloudinaryUrls, setCloudinaryUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async () => {
    try {
      // Request permission to access media library
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }

      // Launch image picker with more robust configuration
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: true, // Changed to true to allow multiple selection
        selectionLimit: photoSelectionLimit, // Optional: set a limit to how many images can be selected
        quality: 1,
        base64: false,
      });

      if (result.canceled) {
        console.log("Image selection was canceled");
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const selectedImages = [];
        const uploadedUrls = [];

        for (let index = 0; index < result.assets.length; index++) {
          const selectedImage = result.assets[index];
          selectedImages.push(selectedImage.uri);

          // Upload to Cloudinary
          try {
            const cloudinaryUrl = await uploadToCloudinary(selectedImage.uri);
            if (cloudinaryUrl) {
              uploadedUrls.push(cloudinaryUrl);
            }
          } catch (error) {
            console.error(`Error uploading image ${selectedImage.uri}:`, error);
          }
        }

        setPhotoUris(selectedImages); // Update selected images
        setCloudinaryUrls(uploadedUrls); // Update Cloudinary URLs
        if (onPhotoUpload) {
          onPhotoUpload(uploadedUrls); // Notify parent component with uploaded URLs
          Alert.alert("Success", "Image uploaded successfully");
        }
      }
    } catch (error) {
      console.error("Photo selection error:", error);
      Alert.alert("Error", "Unable to select photo");
    }
  };

  const uploadToCloudinary = async (uri) => {
    setIsUploading(true);
    try {
      // Create form data
      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        type: "image/jpeg", // or the actual mime type
        name: "upload.jpg",
      });

      // Your Cloudinary upload preset and cloud name
      formData.append("upload_preset", "ml_default");
      formData.append("api_key", "319917892412341"); // Provided by your backend

      // Make the upload request to Cloudinary
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dgszdxhif/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle successful upload
      if (response.data && response.data.secure_url) {
        const cloudinaryUrl = response.data.secure_url;

        return cloudinaryUrl;
      }
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      Alert.alert("Upload Failed", "Unable to upload image");
      return null;
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
      <View style={PhotoUpload_styles.container}>
        {photoUris.length !== 0 ? (
          <View style={PhotoUpload_styles.scrollViewContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={PhotoUpload_styles.photoContainer}
            >
              {photoUris.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={uploadedphotostyle}
                />
              ))}
            </ScrollView>
          </View>
        ) : isUploading ? (
          <View style={PhotoUpload_styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <View>
            {children}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
const PhotoUpload_styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContainer: {
    // Add this new style
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  photoContainer: {
    // Add this new style
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  photo: {
    width: 75,
    height: 75,
    margin: 5,
  },
  upload_photo: {
    width: 50,
    height: 50,
  },
});

export default PhotoUploadComponent;
