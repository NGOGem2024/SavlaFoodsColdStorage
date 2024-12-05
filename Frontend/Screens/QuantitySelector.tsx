import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MainStackParamList } from '../../App';

export interface Item {
  item_id: number | string;
  item_name: string;
  lot_no: string;
  available_qty: number;
  unit_name: string;
  price?: number;
  description?: string;
  item_marks?: string;
  vakal_no?: string;
}

interface QuantitySelectorModalProps {
  isVisible: boolean;
  item: Item;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorModalProps> = ({
  isVisible,
  item,
  onClose,
  onConfirm,
}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const [inputValue, setInputValue] = useState('1');
  const maxQuantity = item.available_qty;

  // Reset quantity when modal opens
  useEffect(() => {
    if (isVisible) {
      setInputValue('1');
    }
  }, [isVisible]);

  const validateAndUpdateQuantity = (value: string) => {
    // Remove any non-numeric characters
    const cleanedValue = value.replace(/[^0-9]/g, '');
   
    // Handle empty or zero cases
    if (cleanedValue === '' || cleanedValue === '0') {
      setInputValue('');
      return;
    }

    const numValue = parseInt(cleanedValue);
   
    // If the number is greater than max quantity, set to max
    if (numValue > maxQuantity) {
      setInputValue(maxQuantity.toString());
      Alert.alert(
        'Invalid Quantity',
        `Maximum available quantity is ${maxQuantity}`
      );
      return;
    }
   
    // Update with the cleaned value
    setInputValue(cleanedValue);
  };

  const incrementQuantity = () => {
    const currentValue = parseInt(inputValue) || 0;
    if (currentValue < maxQuantity) {
      setInputValue((currentValue + 1).toString());
    }
  };

  const decrementQuantity = () => {
    const currentValue = parseInt(inputValue) || 0;
    if (currentValue > 1) {
      setInputValue((currentValue - 1).toString());
    }
  };

  const isIncrementDisabled = () => {
    const currentValue = parseInt(inputValue) || 0;
    return currentValue >= maxQuantity;
  };

  const handleConfirm = () => {
    const quantity = parseInt(inputValue) || 0;
   
    if (quantity <= 0) {
      Alert.alert(
        'Invalid Quantity',
        'Please enter a quantity greater than 0'
      );
      setInputValue('1');
      return;
    }

    if (quantity > maxQuantity) {
      Alert.alert(
        'Invalid Quantity',
        `Please select a quantity between 1 and ${maxQuantity}`
      );
      return;
    }

    // Navigate to Order Confirmation Screen with the selected item details
    navigation.navigate('OrderConfirmation', {
      orderDetails: [{
        itemId: item.item_id,
        lotNo: item.lot_no,
        quantity: quantity
      }]
    });

    // Close the modal
    onClose();
  };

   return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Quantity</Text>
         
          <View style={styles.itemInfo}>
            <Text style={styles.modalItemDetail}>
              Item: <Text style={styles.modalItemDetail1}>{item.item_name}</Text>
            </Text>
            <Text style={styles.modalItemDetail}>
              Lot No: <Text style={styles.modalItemDetail1}>{item.lot_no}</Text>
            </Text>
            <Text style={styles.modalItemDetail}>
              Available Quantity: <Text style={styles.modalItemDetail1}>{maxQuantity} {item.unit_name}</Text>
            </Text>
          </View>

          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                (!inputValue || parseInt(inputValue) <= 1) && styles.quantityButtonDisabled
              ]}
              onPress={decrementQuantity}
              disabled={!inputValue || parseInt(inputValue) <= 1}
              accessibilityLabel="Decrease Quantity"
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.quantityInput}
              keyboardType="numeric"
              value={inputValue}
              onChangeText={validateAndUpdateQuantity}
              selectTextOnFocus={true}
              maxLength={String(maxQuantity).length}
              accessibilityLabel="Quantity Input"
            />

            <TouchableOpacity
              style={[
                styles.quantityButton,
                isIncrementDisabled() && styles.quantityButtonDisabled
              ]}
              onPress={incrementQuantity}
              disabled={isIncrementDisabled()}
              accessibilityLabel="Increase Quantity"
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
               
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              accessibilityLabel="Cancel"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
              accessibilityLabel="Add to Cart"
            >
              <Text style={styles.confirmButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  itemInfo: {
    marginBottom: 25,
  },
  modalItemDetail: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: '#534141',
  },
  modalItemDetail1: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  quantitySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F48221',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#d1d1d1',
  },
  quantityButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 7,
    width: 80,
    textAlign: 'center',
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#F48221',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default QuantitySelector;
