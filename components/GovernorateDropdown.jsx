import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  StyleSheet 
} from 'react-native';

// List of Tunisian Governorates (Wilayat)
export const TUNISIAN_GOVERNORATES = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 
  'Kairouan', 'Kasserine', 'Kebili', 'Le Kef', 'Mahdia', 'Manouba', 
  'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 
  'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
].sort(); // Sort alphabetically

const GovernorateDropdown = ({ 
  onSelectGovernorate, 
  selectedGovernorate = '', 
  placeholder = 'Select Governorate',
  containerStyle = {},
  textStyle = {},
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleGovernorateSelect = (governorate) => {
    onSelectGovernorate(governorate);
    setIsModalVisible(false);
  };

  return (
    <View style={containerStyle}>
      {/* Dropdown Trigger */}
      <TouchableOpacity 
        onPress={() => setIsModalVisible(true)}
        style={styles.dropdownTrigger}
      >
        <Text 
          style={[
            styles.dropdownText, 
            textStyle,
            { color: selectedGovernorate ? '#000' : '#999' }
          ]}
        >
          {selectedGovernorate || placeholder}
        </Text>
      </TouchableOpacity>

      {/* Governorate Selection Modal */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Your Governorate</Text>
            
            <ScrollView>
              {TUNISIAN_GOVERNORATES.map((governorate) => (
                <TouchableOpacity
                  key={governorate}
                  onPress={() => handleGovernorateSelect(governorate)}
                  style={styles.governorateItem}
                >
                  <Text style={styles.governorateItemText}>{governorate}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownTrigger: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  dropdownText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContainer: {
    width: '80%', 
    backgroundColor: 'white', 
    borderRadius: 10, 
    padding: 20,
    maxHeight: '70%'
  },
  modalTitle: {
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    textAlign: 'center'
  },
  governorateItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  governorateItemText: {
    textAlign: 'center', 
    fontSize: 16
  },
  cancelButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FF0000',
    borderRadius: 5
  },
  cancelButtonText: {
    color: 'white', 
    textAlign: 'center', 
    fontWeight: 'bold'
  }
});

export default GovernorateDropdown;