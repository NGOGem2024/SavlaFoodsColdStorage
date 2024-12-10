import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../App';
import axios from 'axios';
import {useCart} from '././contexts/CartContext'

const BACKEND_URL = "http://192.168.1.37:3000/sf";

interface QuantitySelectorModalProps {
  isVisible: boolean;
  item: {
    item_id: number;
    item_name: string;
    lot_no: string;
    available_qty: number;
    unit_name: string;
    customerID?: number | string; // Add customer ID
    vakal_no?: string;  // Make it optional
    item_marks?: string; 
   
  };
  onClose: () => void;
  onConfirm?: (quantity: number) => void;
}

const QuantitySelectorModal: React.FC<QuantitySelectorModalProps> = ({
  isVisible,
  item,
  onClose,
  // onConfirm,
}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const [inputValue, setInputValue] = useState('1');
  const maxQuantity = item.available_qty;
  const { addToCart} = useCart();

  useEffect(() => {
    if (isVisible) {
      setInputValue('1');
    }
  }, [isVisible]);

  const validateAndUpdateQuantity = (value: string) => {
    const cleanedValue = value.replace(/[^0-9]/g, '');

    if (cleanedValue === '' || cleanedValue === '0') {
      setInputValue('');
      return;
    }

    const numValue = parseInt(cleanedValue);

    if (numValue > maxQuantity) {
      setInputValue(maxQuantity.toString());
      Alert.alert(
        'Invalid Quantity',
        `Maximum available quantity is ${maxQuantity}`
      );
      return;
    }

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




// In QuantitySelectorModal.tsx
 
// In QuantitySelectorModal.tsx
const handleConfirm = async () => {
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

  try {
    const response = await axios.post(`${BACKEND_URL}/getItemDetailsAndUpdateStock`, {
      LotNo: item.lot_no,
      CustomerID: item.customerID, 
      ItemID: item.item_id,
      Quantity: quantity
    });

     
      
    if (response.data.success) {

      console.log('Vakal No:', response.data.data.VAKAL_NO);
      console.log('Item Marks:', response.data.data.ITEM_MARKS);
      // Create a complete order item object
      const orderItem = {
        LOT_NO: item.lot_no,
        ITEM_ID: item.item_id,
        ITEM_NAME: item.item_name,
        VAKAL_NO: item.vakal_no || response.data.data.VAKAL_NO || '',
        ITEM_MARKS: item.item_marks || response.data.data.ITEM_MARKS || '',
        // VAKAL_NO: response.data.data.VAKAL_NO || '',
        // ITEM_MARKS: response.data.data.ITEM_MARKS || '',
        UNIT_NAME: item.unit_name,
        BOX_QUANTITY: response.data.data.BOX_QUANTITY || 0,
        BALANCE_QTY: response.data.data.BALANCE_QTY || 0,
        UPDATED_QTY: [quantity],
        ORDERED_QUANTITY: quantity
      };

      // Add to cart 
      addToCart({
        ...item,
        quantity,
        
      });

      // Display the popup
      Alert.alert(
        'Added to Cart',
        `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart`,
        [
          {
            text: 'Continue Shopping',
            onPress: onClose,
            style: 'cancel'
          },
          {
            text: 'Go to Cart',
            onPress: () => {
              onClose(); // Close the modal
              navigation.navigate('PlaceOrderScreen', {
                selectedItems: [orderItem]
              });
            },
            style: 'default'
          }
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert('Error', response.data.message || 'Failed to add item to cart');
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    Alert.alert('Error', 'Failed to add item to cart');
  }
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
            {/* <Text style={styles.modalItemDetail}>
    Vakal No: <Text style={styles.modalItemDetail1}>{item.vakal_no || 'N/A'}</Text>
  </Text> */}
  {/* <Text style={styles.modalItemDetail}>
    Item Marks: <Text style={styles.modalItemDetail1}>{item.item_marks || 'N/A'}</Text>
  </Text> */}
            <Text style={styles.modalItemDetail}>
              Available Quantity: <Text style={styles.modalItemDetail1}>{maxQuantity}</Text>
            </Text>
            <Text style={styles.modalItemDetail}>
              Unit Name: <Text style={styles.modalItemDetail1}>{item.unit_name}</Text>
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
                parseInt(inputValue) >= maxQuantity && styles.quantityButtonDisabled
              ]}
              onPress={incrementQuantity}
              disabled={parseInt(inputValue) >= maxQuantity}
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


export default QuantitySelectorModal;





  // const handleConfirm = async () => {
  //   const quantity = parseInt(inputValue) || 0;
    
  //   if (quantity <= 0) {
  //     Alert.alert(
  //       'Invalid Quantity',
  //       'Please enter a quantity greater than 0'
  //     );
  //     setInputValue('1');
  //     return;
  //   }
  
  //   if (quantity > maxQuantity) {
  //     Alert.alert(
  //       'Invalid Quantity',
  //       `Please select a quantity between 1 and ${maxQuantity}`
  //     );
  //     return;
  //   }

  //       // Add to cart with selected quantity
  //       addToCart({
  //         ...item,
  //         quantity
  //       });
    
  //       // Show success message
  //       Alert.alert('Added to Cart', `${quantity} ${item.item_name} added to cart`);
    
  
  //   try {
  //     // Use the existing API for stock update and item details
  //     const response = await axios.post(`${BACKEND_URL}/getItemDetailsAndUpdateStock`, {
  //       LotNo: item.lot_no,
  //       CustomerID: item.customerID, // Ensure this is passed
  //       ItemID: item.item_id,
  //       Quantity: quantity
  //     });
  
  //     if (response.data.success) {
  //       // Display the popup
  //       Alert.alert(
  //         'Added to Cart',
  //         `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart`,
  //         [
  //           {
  //             text: 'Continue Shopping',
  //             onPress: onClose,
  //             style: 'cancel'
  //           },
  //           {
  //             text: 'Go to Cart',
  //             onPress: () => {
  //               onClose(); // Close the modal
  //               navigation.navigate('PlaceOrderScreen', {
  //                 selectedItems: [response.data.data]
  //               });
  //             },
  //             style: 'default'
  //           }
  //         ],
  //         { cancelable: false }
  //       );
  //     } else {
  //       Alert.alert('Error', response.data.message || 'Failed to add item to cart');
  //     }
  //   } catch (error) {
  //     console.error('Error adding item to cart:', error);
  //     Alert.alert('Error', 'Failed to add item to cart');
  //   }
  // };

  // const handleConfirm = async () => {
  //   const quantity = parseInt(inputValue) || 0;
    
  //   if (quantity <= 0) {
  //     Alert.alert(
  //       'Invalid Quantity',
  //       'Please enter a quantity greater than 0'
  //     );
  //     setInputValue('1');
  //     return;
  //   }

  //   if (quantity > maxQuantity) {
  //     Alert.alert(
  //       'Invalid Quantity',
  //       `Please select a quantity between 1 and ${maxQuantity}`
  //     );
  //     return;
  //   }

  //   try {
  //     // Use the existing API for stock update and item details
  //     const response = await axios.post(`${BACKEND_URL}/getItemDetailsAndUpdateStock`, {
  //       LotNo: item.lot_no,
  //       CustomerID: item.customerID, // Ensure this is passed
  //       ItemID: item.item_id,
  //       Quantity: quantity
  //     });

  //     if (response.data.success) {
  //       // // If onConfirm callback is provided, use it
  //       // if (onConfirm) {
  //       //   onConfirm(quantity);
  //       // }

  //       // Navigate to Place Order Screen with the selected item details
  //       navigation.navigate('PlaceOrderScreen', {
  //         selectedItems: [response.data.data]
  //       });

  //       // Close the modal
  //       onClose();
  //     } else {
  //       Alert.alert('Error', response.data.message || 'Failed to add item to cart');
  //     }
  //   } catch (error) {
  //     console.error('Error adding item to cart:', error);
  //     Alert.alert('Error', 'Failed to add item to cart');
  //   }
  // };

    // const handleConfirm = async () => {
  //   const quantity = parseInt(inputValue) || 0;

  //   if (quantity <= 0) {
  //     Alert.alert(
  //       'Invalid Quantity',
  //       'Please enter a quantity greater than 0'
  //     );
  //     setInputValue('1');
  //     return;
  //   }

  //   if (quantity > maxQuantity) {
  //     Alert.alert(
  //       'Invalid Quantity',
  //       `Please select a quantity between 1 and ${maxQuantity}`
  //     );
  //     return;
  //   }

  //   try {
  //     // Use the existing API for stock update and item details
  //     const response = await axios.post(`${BACKEND_URL}/getItemDetailsAndUpdateStock`, {
  //       LotNo: item.lot_no,
  //       CustomerID: item.customerID,
  //       ItemID: item.item_id,
  //       Quantity: quantity
  //     });

  //     if (response.data.success) {
  //       // Display the popup
  //       Alert.alert(
  //         'Added to Cart',
  //         `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart`,
  //         [
  //           {
  //             text: 'Continue Shopping',
  //             onPress: onClose,
  //             style: 'cancel'
  //           },
  //           {
  //             text: 'Go to Cart',
  //             onPress: () => navigation.navigate('PlaceOrderScreen'),
  //             style: 'default'
  //           }
  //         ],
  //         { cancelable: false }
  //       );
  //     } else {
  //       Alert.alert('Error', response.data.message || 'Failed to add item to cart');
  //     }
  //   } catch (error) {
  //     console.error('Error adding item to cart:', error);
  //     Alert.alert('Error', 'Failed to add item to cart');
  //   }
  // };