//  import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Alert
// } from 'react-native';
// import axios from 'axios';
// import { MainStackParamList } from '../../App';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RouteProp } from '@react-navigation/native';

// const BACKEND_URL = "http://192.168.43.69:3000/sf";

// interface OrderItem {
//   ItemID: number;
//   LotNo: string;
//   Quantity: number;
//   CustomerID?: number | string;
//   item_name?: string;
//   unit_name?: string;
// }

// type PlaceOrderScreenRouteProp = RouteProp<MainStackParamList, 'PlaceOrderScreen'>;
// type PlaceOrderScreenNavigationProp = StackNavigationProp<MainStackParamList, 'PlaceOrderScreen'>;

// interface PlaceOrderScreenProps {
//   route: PlaceOrderScreenRouteProp;
//   navigation: PlaceOrderScreenNavigationProp;
// }

// const PlaceOrderScreen: React.FC<PlaceOrderScreenProps> = ({ route, navigation }) => {
//   const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
//   const [loading, setLoading] = useState(false);
   

//   useEffect(() => {
//     if (route.params?.selectedItems) {
//       setOrderItems(route.params.selectedItems);
//     }
//   }, [route.params?.selectedItems]);

//   const handlePlaceOrder = async () => {
//     try {
//       setLoading(true);

//       // Validate and process each item using the same API
//       const processedItems = [];

//       for (const item of orderItems) {
//         // Re-validate stock and get updated details
//         const response = await axios.post(`${BACKEND_URL}/getItemDetailsAndUpdateStock`, {
//           LotNo: item.LotNo,
//           CustomerID: item.CustomerID || '', 
//           ItemID: item.ItemID,
//           Quantity: item.Quantity
//         });

//         if (response.data.success) {
//           processedItems.push(response.data.data);
//         } else {
//           throw new Error(`Failed to process item: ${item.LotNo}`);
//         }
//       }

//       // If all items are processed successfully, show success message
//       Alert.alert(
//         'Order Placed',
//         'Your order has been successfully placed!',
//         // [{ text: 'OK', onPress: () => navigation.navigate('HomeScreen') }]
//       );

//     } catch (error) {
//       console.error('Order placement error:', error);
//       Alert.alert('Error', 'Failed to place order. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderOrderItem = ({ item }: { item: OrderItem }) => (
//     <View style={styles.orderItemContainer}>
//       <Text style={styles.orderItemText}>Item Name: {item.item_name}</Text>
//       <Text style={styles.orderItemText}>Lot No: {item.LotNo}</Text>
//       <Text style={styles.orderItemText}>Item ID: {item.ItemID}</Text>
//       <Text style={styles.orderItemText}>Ordered Quantity: {item.Quantity}</Text>
//       <Text style={styles.orderItemText}>Unit: {item.unit_name}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Place Order</Text>
//       <FlatList
//         data={orderItems}
//         renderItem={renderOrderItem}
//         keyExtractor={(item) => `${item.ItemID}-${item.LotNo}`}
//       />
//       <TouchableOpacity
//         style={styles.placeOrderButton}
//         onPress={handlePlaceOrder}
//         disabled={loading}
//       >
//         <Text style={styles.placeOrderButtonText}>
//           {loading ? 'Processing...' : 'Place Order'}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   // ... (styles remain the same as in previous example)
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   orderItemContainer: {
//     backgroundColor: '#f9f9f9',
//     padding: 12,
//     marginVertical: 8,
//     borderRadius: 8,
//   },
//   orderItemText: {
//     marginBottom: 4,
//   },
//   placeOrderButton: {
//     backgroundColor: '#007bff',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   placeOrderButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default PlaceOrderScreen;


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../App';
import { useCart } from './contexts/CartContext';
import { Ionicons } from '@expo/vector-icons';


// Define the type for the order item based on the API response
interface OrderItem {
  LOT_NO: string;
  ITEM_ID: number;
  VAKAL_NO: string;
  ITEM_MARKS: string;
  UNIT_NAME: string;
  BOX_QUANTITY: number;
  BALANCE_QTY: number;
  UPDATED_QTY: number[];
  ORDERED_QUANTITY: number;
}

type PlaceOrderScreenRouteProp = RouteProp<MainStackParamList, 'PlaceOrderScreen'>;
type PlaceOrderScreenNavigationProp = StackNavigationProp<MainStackParamList, 'PlaceOrderScreen'>;

interface PlaceOrderScreenProps {
  route: PlaceOrderScreenRouteProp;
  navigation: PlaceOrderScreenNavigationProp;
}

const PlaceOrderScreen: React.FC<PlaceOrderScreenProps> = ({ route, navigation }) => {
  // Get the selected items from route params
  const { selectedItems } = route.params || { selectedItems: [] };
  const { cartItems, clearCart ,removeCartItem} = useCart(); 
  
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);//selectedItems


  useEffect(() => {
    // Combine items from route params and cart
    if (selectedItems.length > 0 || cartItems.length > 0) {
    const combinedItems : OrderItem[]= [
      ...selectedItems,
      ...cartItems.map(cartItem => ({
        LOT_NO: cartItem.lot_no || '',
        ITEM_ID: cartItem.item_id,
        ITEM_NAME: cartItem.item_name,
        VAKAL_NO: cartItem.vakal_no, // You might want to fetch these details
        ITEM_MARKS: cartItem.item_marks,
        UNIT_NAME: cartItem.unit_name || '',
        BOX_QUANTITY: 0,
        BALANCE_QTY: cartItem.available_qty || 0,
        UPDATED_QTY: [cartItem.quantity],
        ORDERED_QUANTITY: cartItem.quantity || 0
      } as OrderItem))
    ];

    const uniqueItems = Array.from(
      new Map(combinedItems.map(item => [item.LOT_NO, item])).values()
    );

    // Only update if the items have actually changed
    setOrderItems(prevItems => {
      const areItemsEqual = uniqueItems.length === prevItems.length && 
        uniqueItems.every((item, index) => 
          item.LOT_NO === prevItems[index]?.LOT_NO &&
          item.ORDERED_QUANTITY === prevItems[index]?.ORDERED_QUANTITY
        );
      
      return areItemsEqual ? prevItems : uniqueItems;
    });
 
  }
     
  }, [selectedItems, cartItems]);


    // Function to remove an item from the order
    const handleRemoveItem = (itemToRemove: OrderItem) => {
      // Remove from orderItems state
      setOrderItems(prevItems => 
        prevItems.filter(item => item.LOT_NO !== itemToRemove.LOT_NO)
      );
  
      // If the item is from cart, remove it from cart context
      const cartItemToRemove = cartItems.find(
        cartItem => cartItem.lot_no === itemToRemove.LOT_NO
      );
  
      if (cartItemToRemove) {
        removeCartItem(cartItemToRemove);
      }
    };

  useEffect(() => {
    // You can add any additional logic here if needed
    console.log('Selected Items:', orderItems);
  }, [orderItems]);

  const renderOrderItem = (item: OrderItem, index: number) => (
    <View key={index} style={styles.orderItemContainer}>
      <View style={styles.orderItemHeader}>
        <Text style={styles.orderItemTitle}>Lot No: {item.LOT_NO}</Text>
        <TouchableOpacity 
          style={styles.deleteIcon} 
          onPress={() => {
            Alert.alert(
              'Remove Item',
              'Are you sure you want to remove this item from the order?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel'
                },
                {
                  text: 'Remove',
                  style: 'destructive',
                  onPress: () => handleRemoveItem(item)
                }
              ]
            );
          }}
        >
          <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>      
      
      </View>
      
      <View style={styles.orderItemDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Item ID:</Text>
          <Text style={styles.detailValue}>{item.ITEM_ID}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Vakal No:</Text>
          <Text style={styles.detailValue}>{item.VAKAL_NO}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Item Marks:</Text>
          <Text style={styles.detailValue}>{item.ITEM_MARKS}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Unit Name:</Text>
          <Text style={styles.detailValue}>{item.UNIT_NAME}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Box Quantity:</Text>
          <Text style={styles.detailValue}>{item.BOX_QUANTITY}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Balance Quantity:</Text>
          <Text style={styles.detailValue}>{item.BALANCE_QTY}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Ordered Quantity:</Text>
          <Text style={styles.detailValue}>{item.ORDERED_QUANTITY}</Text>
        </View>
      </View>
    </View>
  );

  const handleConfirmOrder = () => {
    // Implement order confirmation logic

    // if (response.data.success) {
      // Clear cart items
      clearCart();


    Alert.alert(
      'Confirm Order',
      'Are you sure you want to place this order?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => {
            // Add your order confirmation API call or navigation logic here
            Alert.alert('Order Placed', 'Your order has been successfully placed.');
            // Optionally navigate back or to another screen
            navigation.goBack();
          }
        }
      ]
    
    );
  
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* <Text style={styles.screenTitle}>Place Order</Text> */}
        
        {orderItems.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>No items in the order</Text>
          </View>
        ) : (
          orderItems.map(renderOrderItem)
        )}
      </ScrollView>

      {orderItems.length > 0 && (
        <TouchableOpacity 
          style={styles.confirmOrderButton}
          onPress={handleConfirmOrder}
        >
          <Text style={styles.confirmOrderButtonText}>Confirm Order</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  // screenTitle: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  //   marginVertical: 15,
  //   color: '#007bff'
  // },
  orderItemContainer: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  orderItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
    marginBottom: 10
  },
  deleteIcon: {
    padding: 5,
    marginLeft:-25
  },
  orderItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff'
  },
  orderItemDetails: {},
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600'
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  emptyCartText: {
    fontSize: 18,
    color: '#888'
  },
  confirmOrderButton: {
    backgroundColor: '#007bff',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  confirmOrderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default PlaceOrderScreen;