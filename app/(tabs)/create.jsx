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
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { icons } from "../../constants";

const Create = () => {
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photoUri, setPhotoUri] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const categories = ["Category 1", "Category 2", "Category 3"];

  const handleSubmit = () => {
    console.log("Title:", title);
    console.log("Category:", selectedCategory);
    console.log("Description:", description);
    console.log("Photo URI:", photoUri);
  };

  const handlePhotoUpload = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.log("Image picker error: ", response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setPhotoUri(response.assets[0].uri);
        }
      }
    );
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsModalVisible(false);
  };

  return (
    <View style={[styles.container, { marginTop: 20 }]}>
      <Text style={styles.headerText}>Create Job Listing</Text>

      <TextInput
        style={styles.input}
        placeholder="Give your job a title..."
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity style={styles.photoUpload} onPress={handlePhotoUpload}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photo} />
        ) : (
          <Image source={icons.upload} style={styles.photo} />
        )}
      </TouchableOpacity>

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
    </View>
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
