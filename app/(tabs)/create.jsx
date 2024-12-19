import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { icons } from "../../constants";
import PhotoUploadComponent from "../../components/PhotoUploadComponent";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebaseConfig.js";
import { getAuth } from "firebase/auth";
import GovernorateDropdown from "../../components/GovernorateDropdown"; // Adjust the import path
import FieldOfWorkDropdown from "../../components/FieldOfWorkDropdown"; // Adjust the import path

const Create = () => {
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [description, setDescription] = useState("");
  const [number, setNumber] = useState("");
  const [photos, setPhotos] = useState([]);

  const auth = getAuth();

  const handlePhotoUploaded = (cloudinaryUrls) => {
    setPhotos(cloudinaryUrls);
  };

  const handleSubmit = async () => {
    if (!title || !selectedCategory || !selectedGovernorate || !description || !number) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      const problemData = {
        title,
        category: selectedCategory,
        description,
        phoneNumber: number,
        photos,
        localisation: selectedGovernorate,
        status: "on hold",
        clientId: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "Problems"), problemData);

      Alert.alert(
        "Success",
        "Your problem has been submitted successfully",
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form
              setTitle("");
              setSelectedCategory("");
              setSelectedGovernorate("");
              setDescription("");
              setNumber("");
              setPhotos([]);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to submit problem: " + error.message);
    }
  };

  return (
    <ScrollView style={[styles.container, { marginTop: 20 }]}>
      <Text style={styles.headerText}>Report a Problem</Text>

      <TextInput
        style={styles.input}
        placeholder="Give your problem a title..."
        value={title}
        onChangeText={setTitle}
      />

      {/* Keep the PhotoUploadComponent unchanged */}
      <PhotoUploadComponent
        icons={icons}
        styles={styles}
        onPhotoUpload={handlePhotoUploaded}
      />

      <View style={styles.dropdownSection}>
        <Text style={styles.label}>Choose Category</Text>
        <FieldOfWorkDropdown
          selectedField={selectedCategory}
          onSelectField={setSelectedCategory}
          placeholder="Select Category"
          containerStyle={styles.dropdown}
          textStyle={styles.dropdownText}
        />
      </View>

      <View style={styles.dropdownSection}>
        <Text style={styles.label}>Choose Location</Text>
        <GovernorateDropdown
          selectedGovernorate={selectedGovernorate}
          onSelectGovernorate={setSelectedGovernorate}
          placeholder="Select Location"
          containerStyle={styles.dropdown}
          textStyle={styles.dropdownText}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        value={number}
        onChangeText={setNumber}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.textArea}
        placeholder="Describe your problem..."
        multiline={true}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Problem</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  dropdownSection: {
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    height: 40,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  photoUpload: {
    height: 150,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  categorySection: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#666",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
  },
  dropdownText: {
    color: "#000",
  },
  dropdownArrow: {
    color: "#666",
  },
  textArea: {
    height: 100,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlignVertical: "top",
    backgroundColor: "#FFF",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#FF0000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
    width: "100%",
  },
  modalItemText: {
    fontSize: 16,
    color: "#000",
  },
  closeModalButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FF0000",
    borderRadius: 8,
  },
  closeModalButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
export default Create;