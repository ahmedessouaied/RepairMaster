import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";
import { icons } from "../../constants";
import PhotoUploadComponent from "../../components/PhotoUploadComponent";
import Firestore, { db } from "../../config/firebaseConfig.js"; // Firebase imports
import { collection, getDocs } from "firebase/firestore";

const Create = () => {
  const [title, setTitle] = useState("");
  const [number, setNumber] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [description, setDescription] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [governoratesIsModalVisible, setGovernoratesIsModalVisible] =
    useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageSelected = (imageUri) => {
    setSelectedImage(imageUri);
  };

  const handlePhotoUploaded = (cloudinaryUrl) => {
    // Do something with the Cloudinary URL
    console.log(cloudinaryUrl);
    // Maybe save to your database or state
  };

  const categories = ["Category 1", "Category 2", "Category 3"];
  const tunisian_governorates = [
    "Tunis",
    "Sfax",
    "Sousse",
    "Kairouan",
    "Bizerte",
    "Gabès",
    "Nabeul",
    "Hammamet",
    "Monastir",
    "Mahdia",
    "Tataouine",
    "Tozeur",
    "Gafsa",
    "El Kef",
    "Jendouba",
    "Medenine",
    "Kasserine",
    "Siliana",
    "Zaghouan",
    "M'saken",
    "Kelibia",
    "Béja",
    "Gremda",
    "Hammam-Lif",
  ];

  const handleSubmit = () => {
    console.log("Title:", title);
    console.log("Category:", selectedCategory);
    console.log("Governorate:", selectedGovernorate);
    console.log("Description:", description);
    console.log("Number:", number);
    console.log("Photo URI:", selectedImage);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsModalVisible(false);
  };
  const handleGovernoratesSelect = (Governorate) => {
    setSelectedGovernorate(Governorate);
    setGovernoratesIsModalVisible(false);
  };

  return (
    <ScrollView style={[styles.container, { marginTop: 20 }]}>
      <Text style={styles.headerText}>Create Job Listing</Text>

      <TextInput
        style={styles.input}
        placeholder="Give your job a title..."
        value={title}
        onChangeText={setTitle}
      />

      <PhotoUploadComponent
        icons={icons}
        styles={styles}
        onPhotoUpload={handlePhotoUploaded}
      />

      <View style={styles.categorySection}>
        <Text style={styles.label}>Choose Category</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.dropdownText}>
            {selectedCategory || "Categories"}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categorySection}>
        <Text style={styles.label}>Choose Governorate</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setGovernoratesIsModalVisible(true)}
        >
          <Text style={styles.dropdownText}>
            {selectedGovernorate || "Governorates"}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleCategorySelect(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={governoratesIsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setGovernoratesIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={tunisian_governorates}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleGovernoratesSelect(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setGovernoratesIsModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        multiline={true}
        value={number}
        onChangeText={setNumber}
      />

      <TextInput
        style={styles.textArea}
        placeholder="Write description..."
        multiline={true}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit & Publish</Text>
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
  photo: {
    width: 50,
    height: 50,
    borderRadius: 8,
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
    height: 40,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
