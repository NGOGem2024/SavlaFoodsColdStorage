// // // import { RouteProp, useRoute } from '@react-navigation/native';
// // // import React, { useEffect, useState } from 'react';
// // // import {
// // //   ActivityIndicator,
// // //   Alert,
// // //   StyleSheet,
// // //   Text,
// // //   View
// // // } from 'react-native';
// // // import { MainStackParamList } from '../../App';

// // // type PlaceOrderScreenRouteProp = RouteProp<MainStackParamList, 'PlaceOrder'>;

// // // const PlaceOrderScreen: React.FC = () => {
// // //   const route = useRoute<PlaceOrderScreenRouteProp>();
// // //   const { orderDetails } = route.params;
// // //   const [loading, setLoading] = useState(false);

// // //   const placeOrder = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const response = await fetch('http://192.168.1.3:3000/place_order', { // Update the URL to match your server URL
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify(orderDetails),
// // //       });

// // //       if (!response.ok) {
// // //         const errorText = await response.text();
// // //         throw new Error(errorText || 'Failed to place order');
// // //       }

// // //       const result = await response.json();
// // //       Alert.alert('Success', result.message || 'Order placed successfully');
// // //     } catch (error) {
// // //       console.error('Order placement error:', error);

// // //       if (error instanceof Error) {
// // //         Alert.alert('Error', error.message || 'Failed to place order');
// // //       } else {
// // //         Alert.alert('Error', 'An unknown error occurred');
// // //       }
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     placeOrder();
// // //   }, []);

// // //   return (
// // //     <View style={styles.container}>
// // //       {loading ? (
// // //         <ActivityIndicator size="large" color="#0000ff" />
// // //       ) : (
// // //         <Text style={styles.message}>Order has been placed!</Text>
// // //       )}
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   message: {
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //   },
// // // });

// // // export default PlaceOrderScreen;
// // // PlaceOrderScreen.tsx
// // import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// // import React, { useEffect, useState } from 'react';
// // import { ActivityIndicator, Alert, BackHandler, StyleSheet, Text, View } from 'react-native';
// // import { OrderItem, OrderResponse } from '../type/types';

// // type RootStackParamList = {
// //   PlaceOrder: { orderDetails: OrderItem | OrderItem[] };
// //   Home: undefined;
// // };

// // type PlaceOrderScreenRouteProp = RouteProp<RootStackParamList, 'PlaceOrder'>;

// // const API_URL = 'http://192.168.1.3:3000/place_order';

// // export const PlaceOrderScreen: React.FC = () => {
// //   const route = useRoute<PlaceOrderScreenRouteProp>();
// //   const navigation = useNavigation();
// //   const { orderDetails } = route.params;
// //   const [loading, setLoading] = useState(false);
// //   const [retryCount, setRetryCount] = useState(0);
// //   const MAX_RETRIES = 3;

// //   useEffect(() => {
// //     const backHandler = BackHandler.addEventListener(
// //       'hardwareBackPress',
// //       () => loading
// //     );

// //     placeOrder();

// //     return () => backHandler.remove();
// //   }, []);

// //   const placeOrder = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await fetch(API_URL, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Accept': 'application/json',
// //         },
// //         body: JSON.stringify(orderDetails),
// //       });

// //       // Handle non-JSON responses
// //       const contentType = response.headers.get('content-type');
// //       if (!contentType || !contentType.includes('application/json')) {
// //         throw new Error('Invalid response format from server');
// //       }

// //       const result: OrderResponse = await response.json();

// //       if (!response.ok) {
// //         throw new Error(result.error || result.message || 'Failed to place order');
// //       }

// //       Alert.alert(
// //         'Success',
// //         result.message || 'Order placed successfully',
// //         [
// //           {
// //             text: 'OK',
// //             // onPress: () => navigation.navigate('Home')
// //           }
// //         ]
// //       );
// //     } catch (error) {
// //       console.error('Order placement error:', error);
      
// //       const errorMessage = error instanceof Error 
// //         ? error.message 
// //         : 'An unknown error occurred';

// //       if (retryCount < MAX_RETRIES) {
// //         Alert.alert(
// //           'Error',
// //           `${errorMessage}\nAttempt ${retryCount + 1} of ${MAX_RETRIES}`,
// //           [
// //             {
// //               text: 'Try Again',
// //               onPress: () => {
// //                 setRetryCount(prev => prev + 1);
// //                 placeOrder();
// //               }
// //             },
// //             {
// //               text: 'Cancel',
// //               style: 'cancel',
// //               onPress: () => navigation.goBack()
// //             }
// //           ]
// //         );
// //       } else {
// //         Alert.alert(
// //           'Error',
// //           'Maximum retry attempts reached. Please try again later.',
// //           [
// //             {
// //               text: 'OK',
// //               onPress: () => navigation.goBack()
// //             }
// //           ]
// //         );
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       {loading ? (
// //         <>
// //           <ActivityIndicator size="large" color="#0000ff" />
// //           <Text style={styles.loadingText}>Processing your order...</Text>
// //         </>
// //       ) : (
// //         <Text style={styles.message}>Order has been placed!</Text>
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 20,
// //   },
// //   message: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     textAlign: 'center',
// //   },
// //   loadingText: {
// //     marginTop: 10,
// //     fontSize: 16,
// //     color: '#666',
// //   },
// // });
// // export default PlaceOrderScreen;
// import { useNavigation } from '@react-navigation/native';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// interface OrderItem {
//   item_id: number;
//   lot_no: string;
//   quantity: number;
// }

// interface ItemDetails {
//   ITEM_ID: number;
//   ITEM_NAME: string;
//   LOT_NO: string;
//   ITEM_MARKS: string;
//   VAKAL_NO: string;
//   AVAILABLE_QTY: number;
//   UNIT_NAME: string;
// }

// interface OrderResponse {
//   success: boolean;
//   message: string;
//   error?: string;
//   orderDetails?: any;
// }

// interface ItemResponse {
//   success: boolean;
//   count: number;
//   data: ItemDetails[];
//   message?: string;
//   error?: string;
// }

// const API_BASE_URL = 'http://192.168.1.3:3000';
// const LOOKUP_URL = `${API_BASE_URL}/getItemsByLotNo`;
// const ORDER_URL = `${API_BASE_URL}/place_order`;

// export const PlaceOrderScreen: React.FC = () => {
//   const navigation = useNavigation();
//   const [loading, setLoading] = useState(false);
//   const [retryCount, setRetryCount] = useState(0);
//   const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
//   const MAX_RETRIES = 3;

//   const initialOrderItem: OrderItem = {
//     item_id: 543,
//     lot_no: "91156",
//     quantity: 1
//   };

//   const [orderItem, setOrderItem] = useState<OrderItem>(initialOrderItem);

//   useEffect(() => {
//     fetchItemDetails();
//   }, []);

//   const fetchItemDetails = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(LOOKUP_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ lotNos: [orderItem.lot_no] }),
//       });

//       const result: ItemResponse = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(result.message || 'Failed to fetch item details');
//       }

//       if (result.data && result.data.length > 0) {
//         setItemDetails(result.data[0]);
//         // Update order item with fetched item_id
//         setOrderItem(prev => ({
//           ...prev,
//           item_id: result.data[0].ITEM_ID
//         }));
//       } else {
//         throw new Error('No item found with the specified lot number');
//       }
//     } catch (error) {
//       console.error('Item lookup error:', error);
//       Alert.alert(
//         'Error',
//         error instanceof Error ? error.message : 'Failed to fetch item details'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateResponse = async (response: Response): Promise<OrderResponse> => {
//     let responseData: OrderResponse;
    
//     try {
//       responseData = await response.json();
//     } catch (error) {
//       const textContent = await response.text();
//       console.log('Raw response:', textContent);
      
//       responseData = {
//         success: false,
//         message: 'Invalid response format',
//         error: textContent
//       };
//     }

//     return {
//       success: Boolean(responseData.success),
//       message: responseData.message || 'No message provided',
//       error: responseData.error,
//       orderDetails: responseData.orderDetails
//     };
//   };

//   const placeOrder = async () => {
//     if (!itemDetails) {
//       Alert.alert('Error', 'Item details not available');
//       return;
//     }

//     if (orderItem.quantity > itemDetails.AVAILABLE_QTY) {
//       Alert.alert('Error', `Only ${itemDetails.AVAILABLE_QTY} units available`);
//       return;
//     }

//     setLoading(true);
//     try {
//       console.log('Sending order:', JSON.stringify(orderItem, null, 2));

//       const response = await fetch(ORDER_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify(orderItem),
//       });

//       const result = await validateResponse(response);

//       if (!response.ok || !result.success) {
//         throw new Error(result.error || result.message || 'Failed to place order');
//       }

//       Alert.alert(
//         'Success',
//         result.message || 'Order placed successfully',
//         [{ text: 'OK', onPress: () => navigation.goBack() }]
//       );
//     } catch (error) {
//       console.error('Order placement error:', error);
      
//       const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

//       if (retryCount < MAX_RETRIES) {
//         Alert.alert(
//           'Error',
//           `${errorMessage}\nAttempt ${retryCount + 1} of ${MAX_RETRIES}`,
//           [
//             {
//               text: 'Try Again',
//               onPress: () => {
//                 setRetryCount(prev => prev + 1);
//                 placeOrder();
//               }
//             },
//             {
//               text: 'Cancel',
//               style: 'cancel',
//               onPress: () => navigation.goBack()
//             }
//           ]
//         );
//       } else {
//         Alert.alert(
//           'Error',
//           'Maximum retry attempts reached. Please try again later.',
//           [{ text: 'OK', onPress: () => navigation.goBack() }]
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddToCart = () => {
//     if (!itemDetails) {
//       Alert.alert('Error', 'Item details not available');
//       return;
//     }

//     Alert.alert(
//       'Confirm Order',
//       'Do you want to place this order?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Place Order', onPress: placeOrder }
//       ]
//     );
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#0000ff" />
//           <Text style={styles.loadingText}>
//             {itemDetails ? 'Processing your order...' : 'Fetching item details...'}
//           </Text>
//         </View>
//       ) : (
//         <>
//           <View style={styles.itemCard}>
//             <Text style={styles.itemTitle}>Item Details</Text>
//             {itemDetails ? (
//               <>
//                 <Text style={styles.itemDetail}>Item Name: {itemDetails.ITEM_NAME}</Text>
//                 <Text style={styles.itemDetail}>Item ID: {itemDetails.ITEM_ID}</Text>
//                 <Text style={styles.itemDetail}>Lot No: {itemDetails.LOT_NO}</Text>
//                 <Text style={styles.itemDetail}>Marks: {itemDetails.ITEM_MARKS}</Text>
//                 <Text style={styles.itemDetail}>Vakal No: {itemDetails.VAKAL_NO}</Text>
//                 <Text style={styles.itemDetail}>Available Qty: {itemDetails.AVAILABLE_QTY} {itemDetails.UNIT_NAME}</Text>
//                 <Text style={styles.itemDetail}>Order Quantity: {orderItem.quantity}</Text>
//               </>
//             ) : (
//               <Text style={styles.errorText}>No item details available</Text>
//             )}
//           </View>

//           <TouchableOpacity
//             style={[
//               styles.addToCartButton,
//               (!itemDetails || loading) && styles.disabledButton
//             ]}
//             onPress={handleAddToCart}
//             disabled={!itemDetails || loading}
//           >
//             <Text style={styles.buttonText}>Add to Cart & Place Order</Text>
//           </TouchableOpacity>
//         </>
//       )}

//       {__DEV__ && (
//         <TouchableOpacity 
//           style={styles.debugButton}
//           onPress={() => {
//             console.log('API Base URL:', API_BASE_URL);
//             console.log('Current Item Details:', itemDetails);
//           }}
//         >
//           <Text style={styles.debugButtonText}>Show Debug Info</Text>
//         </TouchableOpacity>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   itemCard: {
//     backgroundColor: '#f5f5f5',
//     padding: 16,
//     borderRadius: 8,
//     margin: 16,
//   },
//   itemTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     color: '#333',
//   },
//   itemDetail: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#666',
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#ff0000',
//     textAlign: 'center',
//     marginVertical: 10,
//   },
//   addToCartButton: {
//     backgroundColor: '#4CAF50',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     margin: 16,
//   },
//   disabledButton: {
//     backgroundColor: '#cccccc',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   loadingContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//     marginTop: 20,
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#666',
//   },
//   debugButton: {
//     margin: 16,
//     padding: 10,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 4,
//   },
//   debugButtonText: {
//     color: '#666',
//     textAlign: 'center',
//   }
// });

// export default PlaceOrderScreen;





import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { Package, Box, Boxes, ShoppingBag, TrendingUp, ClipboardCheck } from 'lucide-react-native';

interface PlaceOrderScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

interface ItemDetails {
  category: string;
  subcategory: string;
  lotNo: string;
  vakkal: string;
  availableQty: number;
  netQty: number;
  balanceQty: number;
  placedQty: number;
}

const PlaceOrderScreen: React.FC<PlaceOrderScreenProps> = ({ navigation, route }) => {
  const [itemDetails, setItemDetails] = useState<ItemDetails>({
    category: '',
    subcategory: '',
    lotNo: '',
    vakkal: '',
    availableQty: 0,
    netQty: 0,
    balanceQty: 0,
    placedQty: 0,
  });

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(-50);
  const scaleAnim = new Animated.Value(0.9);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 12,
        bounciness: 6,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: 12,
        bounciness: 6,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const animateProgress = () => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  };

  const handlePlaceOrder = () => {
    if (itemDetails.placedQty <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    if (itemDetails.placedQty > itemDetails.availableQty) {
      Alert.alert('Error', 'Placed quantity cannot exceed available quantity');
      return;
    }

    Alert.alert(
      'Confirm Order',
      'Do you want to place this order?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            animateProgress();
            setTimeout(() => {
              Alert.alert('Success', 'Order placed successfully');
              navigation.goBack();
            }, 1500);
          },
        },
      ]
    );
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          style={[
            styles.headerSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.headerIconContainer}>
            <ShoppingBag size={32} color="#F48221" />
          </View>
          <Text style={styles.headerTitle}>Place Order</Text>
          <Text style={styles.headerSubtitle}>Review and confirm your order details</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Package size={20} color="#F48221" />
            <Text style={styles.sectionTitle}>Item Details</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{itemDetails.category || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Subcategory:</Text>
            <Text style={styles.value}>{itemDetails.subcategory || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Lot No:</Text>
            <Text style={styles.value}>{itemDetails.lotNo || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Vakkal:</Text>
            <Text style={styles.value}>{itemDetails.vakkal || 'N/A'}</Text>
          </View>
        </Animated.View>

        <Animated.View 
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Boxes size={20} color="#F48221" />
            <Text style={styles.sectionTitle}>Quantity Details</Text>
          </View>
          
          <View style={styles.quantityGrid}>
            <View style={styles.quantityBox}>
              <Text style={styles.quantityLabel}>Available</Text>
              <Text style={styles.quantityValue}>{itemDetails.availableQty}</Text>
            </View>
            
            <View style={styles.quantityBox}>
              <Text style={styles.quantityLabel}>Net</Text>
              <Text style={styles.quantityValue}>{itemDetails.netQty}</Text>
            </View>
            
            <View style={styles.quantityBox}>
              <Text style={styles.quantityLabel}>Balance</Text>
              <Text style={styles.quantityValue}>{itemDetails.balanceQty}</Text>
            </View>
          </View>

          <View style={styles.placedQuantityContainer}>
            <Text style={styles.placedQuantityLabel}>Placed Quantity</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.quantityInput}
                keyboardType="numeric"
                value={itemDetails.placedQty.toString()}
                onChangeText={(text) => 
                  setItemDetails({
                    ...itemDetails,
                    placedQty: parseInt(text) || 0
                  })
                }
                placeholder="Enter quantity"
                placeholderTextColor="#999"
              />
              <View style={styles.inputIcon}>
                <Box size={20} color="#666" />
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          style={[
            styles.progressContainer,
            { opacity: progressAnim }
          ]}
        >
          <Animated.View 
            style={[
              styles.progressBar,
              { width: progressWidth }
            ]} 
          />
        </Animated.View>

        <TouchableOpacity 
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          activeOpacity={0.8}
        >
          <ClipboardCheck size={24} color="#FFF" style={styles.buttonIcon} />
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 16,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIconContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 15,
    color: '#666',
  },
  value: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  quantityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quantityBox: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quantityLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F48221',
  },
  placedQuantityContainer: {
    marginTop: 16,
  },
  placedQuantityLabel: {
    fontSize: 15,
    color: '#666',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  quantityInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  inputIcon: {
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginVertical: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#F48221',
  },
  placeOrderButton: {
    backgroundColor: '#F48221',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#F48221',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  placeOrderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PlaceOrderScreen;


// import React, { useState } from 'react';
// import {
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// interface FormData {
//   lotNo: string;  
//   vakkal: string;
//   quantity: string;
// }

// const PlaceOrderScreen: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     lotNo: '',
//     vakkal: '',
//     quantity: '',
//   });

//   const handleSubmit = (): void => {
//     // Handle order placement logic here
//     console.log('Order placed:', formData);
//   };

//   const handleChange = (name: keyof FormData, value: string): void => {
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView 
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardAvoidingView}
//       >
//         <ScrollView contentContainerStyle={styles.scrollView}>
//           <View style={styles.card}>
//             <Text style={styles.title}>Place Order</Text>
            
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Lot No</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter Lot Number"
//                 value={formData.lotNo}
//                 onChangeText={(value) => handleChange('lotNo', value)}
//                 placeholderTextColor="#666"
//               />
//             </View>
            
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Vakkal</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter Vakkal"
//                 value={formData.vakkal}
//                 onChangeText={(value) => handleChange('vakkal', value)}
//                 placeholderTextColor="#666"
//               />
//             </View>
            
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Available Quantity</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter Available Quantity"
//                 value={formData.quantity}
//                 onChangeText={(value) => handleChange('quantity', value)}
//                 keyboardType="numeric"
//                 placeholderTextColor="#666"
//               />
//             </View>

//             <TouchableOpacity 
//               style={styles.button}
//               onPress={handleSubmit}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.buttonText}>Place Order</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   keyboardAvoidingView: {
//     flex: 1,
//   },
//   scrollView: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     padding: 16,
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 24,
//     color: '#333',
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#333',
//     fontWeight: '500',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     color: '#333',
//     backgroundColor: '#fff',
//   },
//   button: {
//     backgroundColor: '#ff6b00',
//     padding: 16,
//     borderRadius: 8,
//     marginTop: 8,
//   },
//   buttonText: {
//     color: 'white',
//     textAlign: 'center',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default PlaceOrderScreen;