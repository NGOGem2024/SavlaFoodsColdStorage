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
   NET_QUANTITY: any;
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
       const combinedItems: OrderItem[] = [
         ...selectedItems,
         ...cartItems.map(cartItem => {
           // Calculate net quantity based on available quantity and ordered quantity
           const netQuantity = Math.max(0, cartItem.available_qty - cartItem.quantity);
  
           return {
             LOT_NO: cartItem.lot_no || '',
             ITEM_ID: cartItem.item_id,
             ITEM_NAME: cartItem.item_name,
             VAKAL_NO: cartItem.vakal_no || '',
             ITEM_MARKS: cartItem.item_marks || '',
             UNIT_NAME: cartItem.unit_name || '',
             AVAILABLE_QTY: cartItem.available_qty,
             NET_QUANTITY: netQuantity,
             UPDATED_QTY: [cartItem.quantity],
             ORDERED_QUANTITY: cartItem.quantity // Use the actual quantity from cart
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
                 navigation.navigate('BottomTabNavigator', {
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
         <View style={styles.detailColumn}>          
           <DetailRow label="Vakal No" value={item.VAKAL_NO} />
           <DetailRow label="Item Marks" value={item.ITEM_MARKS} />
           <DetailRow label="Available Quantity" value={`${item.AVAILABLE_QTY}`} />
         </View>
         <View style={styles.detailColumn}>
           <DetailRow label="Unit Name" value={item.UNIT_NAME} />
           <DetailRow label="Net Quantity" value={`${item.NET_QUANTITY}`} highlighted />
           <DetailRow label="Ordered Quantity" value={`${item.ORDERED_QUANTITY}`} />
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
  
  