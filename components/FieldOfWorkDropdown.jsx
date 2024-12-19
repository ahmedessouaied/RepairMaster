import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  StyleSheet 
} from 'react-native';

// List of Fields of Work
const FIELDS_OF_WORK = [
  'Plumber',
  'Electrician',
  'Carpenter',
  'Painter',
  'HVAC Technician',
  'General Maintenance',
  'Appliance Repair',
  'Electronics Repair'
].sort(); // Sort alphabetically

const FieldOfWorkDropdown = ({ 
  onSelectField, 
  selectedField = '', 
  placeholder = 'Select Field of Work',
  containerStyle = {},
  textStyle = {},
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFieldSelect = (field) => {
    onSelectField(field);
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
            { color: selectedField ? '#000' : '#999' }
          ]}
        >
          {selectedField || placeholder}
        </Text>
      </TouchableOpacity>

      {/* Field of Work Selection Modal */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Field of Work</Text>
            
            <ScrollView>
              {FIELDS_OF_WORK.map((field) => (
                <TouchableOpacity
                  key={field}
                  onPress={() => handleFieldSelect(field)}
                  style={styles.fieldItem}
                >
                  <Text style={styles.fieldItemText}>{field}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%', 
    backgroundColor: 'white', 
    borderRadius: 10, 
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    textAlign: 'center',
  },
  fieldItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  fieldItemText: {
    textAlign: 'center', 
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FF0000',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white', 
    textAlign: 'center', 
    fontWeight: 'bold',
  },
});

export default FieldOfWorkDropdown;
