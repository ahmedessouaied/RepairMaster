import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';

const CustomDropdown = () => {
  const [selectedValue, setSelectedValue] = useState("Select an option");
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const options = ["Customer", "Worker"];

  const handleSelect = (value) => {
    setSelectedValue(value);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text className="font-pmedium text-sm text-gray-100">Select an account Type:</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDropdownVisible(!isDropdownVisible)}
      >
        <Text className="font-pmedium text-sm text-black">{selectedValue}</Text>
      </TouchableOpacity>

      <Modal visible={isDropdownVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownContainer}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  dropdownButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContainer: {
    width: 250,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
    padding: 8,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});

export default CustomDropdown;
