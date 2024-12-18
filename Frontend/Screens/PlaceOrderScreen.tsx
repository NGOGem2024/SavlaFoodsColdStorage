<<<<<<< HEAD
// import { Ionicons } from '@expo/vector-icons';
// import { RouteProp } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { MainStackParamList } from '../../App';
// import { useCart } from './contexts/CartContext';
 
// const BACKEND_URL = "http://192.168.1.3:3000/sf";
 
// interface OrderItem {
//   NET_QUANTITY: any;
//   ITEM_NAME: string;
//   LOT_NO: string;
//   ITEM_ID: number;
//   VAKAL_NO: string;
//   ITEM_MARKS: string;
//   UNIT_NAME: string;
//   AVAILABLE_QTY: number;
//   UPDATED_QTY: number[];
//   ORDERED_QUANTITY: number;
// }
 
// type PlaceOrderScreenRouteProp = RouteProp<MainStackParamList, 'PlaceOrderScreen'>;
// type PlaceOrderScreenNavigationProp = StackNavigationProp<MainStackParamList, 'PlaceOrderScreen'>;
 
// interface PlaceOrderScreenProps {
//   route: PlaceOrderScreenRouteProp;
//   navigation: PlaceOrderScreenNavigationProp;
// }
 
// const PlaceOrderScreen: React.FC<PlaceOrderScreenProps> = ({ route, navigation }) => {
//   const { selectedItems } = route.params || { selectedItems: [] };
//   const { cartItems, clearCart, removeCartItem } = useCart();
//   const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
 
//   useEffect(() => {
//     if (selectedItems.length > 0 || cartItems.length > 0) {
//       const combinedItems: OrderItem[] = [
//         ...selectedItems,
//         ...cartItems.map(cartItem => {
//           const netQuantity = Math.max(0, (cartItem.available_qty || 0) - (cartItem.quantity || 0));
         
//           return {
//             LOT_NO: cartItem.lot_no || '',
//             ITEM_ID: cartItem.item_id,
//             ITEM_NAME: cartItem.item_name,
//             VAKAL_NO: cartItem.vakal_no,
//             ITEM_MARKS: cartItem.item_marks,
//             UNIT_NAME: cartItem.unit_name || '',
//             AVAILABLE_QTY: cartItem.available_qty,
//             NET_QUANTITY: netQuantity,
//             UPDATED_QTY: [cartItem.quantity],
//             ORDERED_QUANTITY: cartItem.quantity || 0
//           } as OrderItem;
//         })
//       ];
 
//       const uniqueItems = Array.from(
//         new Map(combinedItems.map(item => [item.LOT_NO, item])).values()
//       );
 
//       setOrderItems(prevItems => {
//         const areItemsEqual = uniqueItems.length === prevItems.length &&
//           uniqueItems.every((item, index) =>
//             item.LOT_NO === prevItems[index]?.LOT_NO &&
//             item.ORDERED_QUANTITY === prevItems[index]?.ORDERED_QUANTITY
//           );
//         return areItemsEqual ? prevItems : uniqueItems;
//       });
//     }
//   }, [selectedItems, cartItems]);
 
//   const handleRemoveItem = (itemToRemove: OrderItem) => {
//     setOrderItems(prevItems =>
//       prevItems.filter(item => item.LOT_NO !== itemToRemove.LOT_NO)
//     );
 
//     const cartItemToRemove = cartItems.find(
//       cartItem => cartItem.lot_no === itemToRemove.LOT_NO
//     );
 
//     if (cartItemToRemove) {
//       removeCartItem(cartItemToRemove);
//     }
//   };
 
//   // const handleConfirmOrder = async () => {
//   //   setIsLoading(true);
//   //   let hasError = false;
//   //   let errorMessage = '';
 
//   //   try {
//   //     for (const item of orderItems) {
//   //       try {
//   //         const orderPayload = {
//   //           LotNo: item.LOT_NO,
//   //           CustomerID: route.params?.customerID || "1",
//   //           ItemID: item.ITEM_ID,
//   //           Quantity: item.ORDERED_QUANTITY
//   //         };
 
//   //         const response = await axios.post(
//   //           `${BACKEND_URL}/getItemDetailsAndUpdateStock`,
//   //           orderPayload
//   //         );
 
//   //         if (!response.data.success) {
//   //           hasError = true;
//   //           errorMessage += `Failed to place order for ${item.ITEM_NAME}\n`;
//   //         }
//   //       } catch (itemError: any) {
//   //         hasError = true;
//   //         errorMessage += `Error with ${item.ITEM_NAME}: ${itemError.response?.data?.message || 'Unknown error'}\n`;
//   //       }
//   //     }
 
//   //     if (!hasError) {
//   //       Alert.alert(
//   //         'Success',
//   //         'Order placed successfully!',
//   //         [
//   //           {
//   //             text: 'OK',
//   //             onPress: () => {
//   //               clearCart();
//   //               navigation.goBack();
//   //             }
//   //           }
//   //         ]
//   //       );
//   //     } else {
//   //       Alert.alert('Error', errorMessage);
//   //     }
//   //   } catch (error: any) {
//   //     console.error('Order placement error:', error);
//   //     Alert.alert(
//   //       'Error',
//   //       error.response?.data?.message || 'Failed to place order. Please try again.'
//   //     );
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const handleConfirmOrder = async () => {
//     setIsLoading(true);
//     let successCount = 0;
//     let errorMessages: string[] = [];

//     try {
//       // Process each order item sequentially
//       for (const item of orderItems) {
//         try {
//           const orderPayload = {
//             LotNo: item.LOT_NO,
//             CustomerID: route.params?.customerID || "1",
//             ItemID: item.ITEM_ID,
//             Quantity: item.ORDERED_QUANTITY
//           };

//           const response = await axios.post(
//             `${BACKEND_URL}/getItemDetailsAndUpdateStock`,
//             orderPayload
//           );

//           if (response.data.success) {
//             successCount++;
//             // Update local state with new stock quantity
//             setOrderItems(prevItems =>
//               prevItems.map(prevItem =>
//                 prevItem.LOT_NO === item.LOT_NO
//                   ? { ...prevItem, AVAILABLE_QTY: response.data.data.remainingStock }
//                   : prevItem
//               )
//             );
//           } else {
//             errorMessages.push(`Failed to place order for ${item.ITEM_NAME}: ${response.data.message}`);
//           }
//         } catch (error: any) {
//           const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
//           errorMessages.push(`Error with ${item.ITEM_NAME}: ${errorMessage}`);
//         }
//       }

//       // Show appropriate message based on results
//       if (successCount === orderItems.length) {
//         Alert.alert(
//           'Success',
//           'All orders placed successfully!',
//           [
//             {
//               text: 'OK',
//               onPress: () => {
//                 clearCart();
//                 navigation.navigate('ItemDetailsExpanded', {
//                   shouldRefresh: true,
//                   customerID: route.params?.customerID
//                 });
//               }
//             }
//           ]
//         );
//       } else if (successCount > 0) {
//         // Some orders succeeded, some failed
//         Alert.alert(
//           'Partial Success',
//           `${successCount} out of ${orderItems.length} orders were successful.\n\nErrors:\n${errorMessages.join('\n')}`,
//           [
//             {
//               text: 'OK',
//               onPress: () => {
//                 clearCart();
//                 navigation.navigate('ItemDetailsExpanded', {
//                   shouldRefresh: true,
//                   customerID: route.params?.customerID
//                 });
//               }
//             }
//           ]
//         );
//       } else {
//         // All orders failed
//         Alert.alert(
//           'Error',
//           `Failed to place orders:\n${errorMessages.join('\n')}`
//         );
//       }
//     } catch (error: any) {
//       console.error('Order placement error:', error);
//       Alert.alert(
//         'Error',
//         'Failed to process orders. Please try again.'
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderFooter = () => (
//     <View style={styles.footer}>
//       <TouchableOpacity
//         style={[styles.confirmButton, isLoading && styles.disabledButton]}
//         onPress={handleConfirmOrder}
//         disabled={isLoading}
//       >
//         {isLoading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator color="#FFFFFF" />
//             <Text style={styles.confirmButtonText}>Processing...</Text>
//           </View>
//         ) : (
//           <>
//             <Text style={styles.confirmButtonText}>Place Order</Text>
//             <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
//           </>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
 
//   const renderOrderItem = (item: OrderItem, index: number) => (
//     <View key={index} style={styles.orderItemContainer}>
//       <View style={styles.statusIndicator} />
     
//       <View style={styles.orderItemHeader}>
//         <View style={styles.headerContent}>
//           <Text style={styles.itemName} numberOfLines={1}>{item.ITEM_NAME}</Text>
//           <Text style={styles.lotNumber}>Lot No: {item.LOT_NO}</Text>
//         </View>
//         <TouchableOpacity
//           style={styles.deleteButton}
//           onPress={() => {
//             Alert.alert(
//               'Remove Item',
//               'Are you sure you want to remove this item?',
//               [
//                 { text: 'Cancel', style: 'cancel' },
//                 {
//                   text: 'Remove',
//                   style: 'destructive',
//                   onPress: () => handleRemoveItem(item)
//                 }
//               ]
//             );
//           }}
//         >
//           <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
//         </TouchableOpacity>
//       </View>
 
//       <View style={styles.orderItemDetails}>
//         <View style={styles.detailColumn}>          
//           <DetailRow label="Vakal No" value={item.VAKAL_NO} />
//           <DetailRow label="Item Marks" value={item.ITEM_MARKS} />
//           <DetailRow label="Available Quantity" value={`${item.AVAILABLE_QTY}`} />
//         </View>
//         <View style={styles.detailColumn}>
//           <DetailRow label="Unit Name" value={item.UNIT_NAME} />
//           <DetailRow label="Net Quantity" value={`${item.NET_QUANTITY}`} highlighted />
//           <DetailRow label="Ordered Quantity" value={`${item.ORDERED_QUANTITY}`} />
//         </View>
//       </View>
//     </View>
//   );
 
//   const DetailRow = ({ label, value, highlighted = false }) => (
//     <View style={styles.detailRow}>
//       <Text style={styles.detailLabel}>{label}</Text>
//       <Text style={[
//         styles.detailValue,
//         highlighted && styles.highlightedValue
//       ]}>{value}</Text>
//     </View>
//   );
 
 
 
//   return (
//     <View style={styles.container}>
//     <ScrollView style={styles.scrollView}>
//       {orderItems.length === 0 ? (
//         <View style={styles.emptyStateContainer}>
//           <Ionicons name="cart-outline" size={64} color="#CBD5E0" />
//           <Text style={styles.emptyStateText}>No items in the order</Text>
//         </View>
//       ) : (
//         orderItems.map(renderOrderItem)
//       )}
//         {orderItems.length > 0 && renderFooter()}
//     </ScrollView>
 
 
//       {orderItems.length > 0 && (
//         <View style={styles.footer}>
//           <TouchableOpacity
//             style={[
//               styles.confirmButton,
//               isLoading && styles.disabledButton
//             ]}
//             onPress={handleConfirmOrder}
//             disabled={isLoading}
//           >
           
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };


 
// const styles = StyleSheet.create({
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   loadingText: {
//     color: '#FFFFFF',
//     marginLeft: 8,
//     fontSize: 16,
//     fontWeight: '600'
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#F7FAFC',
//   },
//   scrollView: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   orderItemContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     marginBottom: 16,
//     padding: 16,
//     shadowColor: '#6B46C1',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   statusIndicator: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: 4,
//     height: '100%',
//     backgroundColor: '#6B46C1',
//   },
//   orderItemHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 16,
//   },
//   headerContent: {
//     flex: 1,
//     marginRight: 12,
//   },
//   itemName: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#2D3748',
//     marginBottom: 4,
//   },
//   lotNumber: {
//     fontSize: 14,
//     color: '#6B46C1',
//     fontWeight: '600',
//   },
//   deleteButton: {
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: '#FFF5F5',
//   },
//   orderItemDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   detailColumn: {
//     flex: 1,
//   },
//   detailRow: {
//     marginBottom: 8,
//   },
//   detailLabel: {
//     fontSize: 12,
//     color: '#718096',
//     marginBottom: 2,
//   },
//   detailValue: {
//     fontSize: 14,
//     color: '#4A5568',
//     fontWeight: '500',
//   },
//   highlightedValue: {
//     color: '#6B46C1',
//     fontWeight: '600',
//   },
//   emptyStateContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     minHeight: Dimensions.get('window').height * 0.5,
//   },
//   emptyStateText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: '#718096',
//     fontWeight: '500',
//   },
//   footer: {
//     padding: 16,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderTopColor: '#E2E8F0',
//   },
//   confirmButton: {
//     backgroundColor: '#6B46C1',
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   confirmButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//     marginRight: 8,
//   },
//   disabledButton: {
//     backgroundColor: '#A0AEC0',
//     opacity: 0.7
//   }
// });
 
// export default PlaceOrderScreen;
 
 

=======
 
>>>>>>> 30e18c0fcd6fbb8dde0968d9c5e9358259bc5766

import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { MainStackParamList } from '../../App';
import { useCart } from './contexts/CartContext';

const BACKEND_URL = "http://192.168.1.3:3000/sf";

interface OrderItem {
<<<<<<< HEAD
  NET_QUANTITY: any;
=======
>>>>>>> 30e18c0fcd6fbb8dde0968d9c5e9358259bc5766
  ITEM_NAME: string;
  LOT_NO: string;
  ITEM_ID: number;
  VAKAL_NO: string;
  ITEM_MARKS: string;
  UNIT_NAME: string;
  AVAILABLE_QTY: number;
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
  const { selectedItems } = route.params || { selectedItems: [] };
  const { cartItems, clearCart, removeCartItem } = useCart();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedItems.length > 0 || cartItems.length > 0) {
<<<<<<< HEAD
      const combinedItems: OrderItem[] = [
        ...selectedItems,
        ...cartItems.map(cartItem => {
          const netQuantity = Math.max(0, (cartItem.available_qty || 0) - (cartItem.quantity || 0));
=======
    const combinedItems : OrderItem[]= [
      ...selectedItems,
      ...cartItems.map(cartItem => ({
        LOT_NO: cartItem.lot_no || '',
        ITEM_ID: cartItem.item_id,
        ITEM_NAME: cartItem.item_name,
        VAKAL_NO: cartItem.vakal_no, // You might want to fetch these details
        ITEM_MARKS: cartItem.item_marks,
        UNIT_NAME: cartItem.unit_name || '',
        BOX_QUANTITY: cartItem.box_quantity || 0,
        BALANCE_QTY: cartItem.available_qty || 0,
        UPDATED_QTY: [cartItem.quantity],
        ORDERED_QUANTITY: cartItem.quantity || 0
      } as OrderItem))
    ];
>>>>>>> 30e18c0fcd6fbb8dde0968d9c5e9358259bc5766

          return {
            LOT_NO: cartItem.lot_no || '',
            ITEM_ID: cartItem.item_id,
            ITEM_NAME: cartItem.item_name,
            VAKAL_NO: cartItem.vakal_no,
            ITEM_MARKS: cartItem.item_marks,
            UNIT_NAME: cartItem.unit_name || '',
            AVAILABLE_QTY: cartItem.available_qty,
            NET_QUANTITY: netQuantity,
            UPDATED_QTY: [cartItem.quantity],
            ORDERED_QUANTITY: cartItem.quantity || 0
          } as OrderItem;
        })
      ];

      const uniqueItems = Array.from(
        new Map(combinedItems.map(item => [item.LOT_NO, item])).values()
      );

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

  const handleRemoveItem = (itemToRemove: OrderItem) => {
    setOrderItems(prevItems =>
      prevItems.filter(item => item.LOT_NO !== itemToRemove.LOT_NO)
    );

    const cartItemToRemove = cartItems.find(
      cartItem => cartItem.lot_no === itemToRemove.LOT_NO
    );

    if (cartItemToRemove) {
      removeCartItem(cartItemToRemove);
    }
  };
  const handleConfirmOrder = async () => {
    setIsLoading(true);
    let successCount = 0;
    let errorMessages: string[] = [];
  
    try {
      // Prepare all items in the format expected by the backend
      const orderPayload = {
        CustomerID: route.params?.customerID || "1",
        items: orderItems.map(item => ({
          LotNo: item.LOT_NO,
          ItemID: item.ITEM_ID,
          Quantity: item.ORDERED_QUANTITY
        }))
      };
  
      // Single API call for all items
      const response = await axios.post(
        `${BACKEND_URL}/getItemDetailsAndUpdateStock`,
        orderPayload
      );
  
      if (response.data.success) {
        Alert.alert(
          'Success',
          'Order placed successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                clearCart();
                navigation.navigate('ItemDetailsExpanded', {
                  shouldRefresh: true,
                  customerID: route.params?.customerID
                });
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Error',
          response.data.message || 'Failed to place order'
        );
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      Alert.alert(
        'Error',
        `Failed to place order: ${errorMessage}`
      );
    } finally {
      setIsLoading(false);
    }
  };
  

  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[styles.confirmButton, isLoading && styles.disabledButton]}
        onPress={handleConfirmOrder}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#FFFFFF" />
            <Text style={styles.confirmButtonText}>Processing...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.confirmButtonText}>Place Order</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderOrderItem = (item: OrderItem, index: number) => (
    <View key={index} style={styles.orderItemContainer}>
      <View style={styles.statusIndicator} />
     
      <View style={styles.orderItemHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.itemName} numberOfLines={1}>{item.ITEM_NAME}</Text>
          <Text style={styles.lotNumber}>Lot No: {item.LOT_NO}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              'Remove Item',
              'Are you sure you want to remove this item?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Remove',
                  style: 'destructive',
                  onPress: () => handleRemoveItem(item)
                }
              ]
            );
          }}
        >
          <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
 
      <View style={styles.orderItemDetails}>
<<<<<<< HEAD
        <View style={styles.detailColumn}>          
          <DetailRow label="Vakal No" value={item.VAKAL_NO} />
          <DetailRow label="Item Marks" value={item.ITEM_MARKS} />
          <DetailRow label="Available Quantity" value={`${item.AVAILABLE_QTY}`} />
        </View>
        <View style={styles.detailColumn}>
          <DetailRow label="Unit Name" value={item.UNIT_NAME} />
          <DetailRow label="Net Quantity" value={`${item.NET_QUANTITY}`} highlighted />
          <DetailRow label="Ordered Quantity" value={`${item.ORDERED_QUANTITY}`} />
=======
      <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Item Name:</Text>
          <Text style={styles.detailValue}>{item.ITEM_NAME}</Text>
        </View>

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
        -
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Net Quantity:</Text>
          <Text style={styles.detailValue}>{item.BOX_QUANTITY}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Balance Quantity:</Text>
          <Text style={styles.detailValue}>{item.BALANCE_QTY}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Ordered Quantity:</Text>
          <Text style={styles.detailValue}>{item.ORDERED_QUANTITY}</Text>
>>>>>>> 30e18c0fcd6fbb8dde0968d9c5e9358259bc5766
        </View>
      </View>
    </View>
  );

 

  const DetailRow = ({ label, value, highlighted = false }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, highlighted && styles.highlightedValue]}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Confirm Your Order</Text>
      {orderItems.map(renderOrderItem)}
      {renderFooter()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 16
  },
  orderItemContainer: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    padding: 12
  },
  statusIndicator: {
    height: 5,
    borderRadius: 2,
    backgroundColor: '#4CAF50',
    marginBottom: 12
  },
  orderItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center'
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  lotNumber: {
    fontSize: 12,
    color: '#666'
  },
  deleteButton: {
    marginLeft: 12
  },
  orderItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  detailColumn: {
    flex: 1
  },
  detailRow: {
    marginBottom: 8
  },
  detailLabel: {
    fontSize: 12,
    color: '#777'
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333'
  },
  highlightedValue: {
    color: '#FF5722'
  },
  footer: {
    marginTop: 16,
    alignItems: 'center'
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  disabledButton: {
    backgroundColor: '#BDBDBD'
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default PlaceOrderScreen;
