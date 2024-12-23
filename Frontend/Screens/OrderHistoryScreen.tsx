// // // // import axios from 'axios';
// // // // import React, { useEffect, useState } from 'react';
// // // // import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

// // // // interface OrderHistoryItem {
// // // //   ORDER_ID: number;
// // // //   LOT_NO: string;
// // // //   ITEM_ID: number;
// // // //   ITEM_NAME: string;
// // // //   ORDER_DATE: string;
// // // //   QUANTITY: number;
// // // // }

// // // // const BACKEND_URL = "http://192.168.1.3:3000/sf";
// // // // const CUSTOMER_ID = "1279"; // You might want to pass this as a prop or get from context/store

// // // // const OrderHistoryScreen: React.FC = () => {
// // // //   const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
// // // //   const [isLoading, setIsLoading] = useState(true);
// // // //   const [refreshing, setRefreshing] = useState(false);

// // // //   const fetchOrderHistory = async () => {
// // // //     try {
// // // //       setIsLoading(true);
// // // //       const url = `${BACKEND_URL}/getOrderHistory/${CUSTOMER_ID}`;
// // // //       console.log('Fetching from:', url);
      
// // // //       // Add your authentication token here
// // // //       const token = 'your-auth-token'; // Get this from your auth context/store
      
// // // //       const response = await axios.get(url, {
// // // //         timeout: 10000,
// // // //         headers: {
// // // //           'Accept': 'application/json',
// // // //           'Content-Type': 'application/json',
// // // //           'Authorization': `Bearer ${token}` // Add authentication header
// // // //         }
// // // //       });
      
// // // //       console.log('Response:', response.data);
      
// // // //       if (response.data.success && Array.isArray(response.data.data)) {
// // // //         const processedOrders = response.data.data.map((item: OrderHistoryItem) => ({
// // // //           ORDER_ID: item.ORDER_ID || 0,
// // // //           LOT_NO: item.LOT_NO || 'N/A',
// // // //           ITEM_ID: item.ITEM_ID || 0,
// // // //           ITEM_NAME: item.ITEM_NAME || 'Unknown Item',
// // // //           ORDER_DATE: item.ORDER_DATE || 'Unknown Date',
// // // //           QUANTITY: item.QUANTITY || 1
// // // //         }));

// // // //         setOrderHistory(processedOrders);
// // // //       } else {
// // // //         console.log('No data or invalid format:', response.data);
// // // //         setOrderHistory([]);
// // // //         Alert.alert('No Orders', 'No order history found.');
// // // //       }
// // // //     } catch (error: any) {
// // // //       console.error('Error details:', {
// // // //         message: error.message,
// // // //         response: error.response?.data,
// // // //         status: error.response?.status,
// // // //         url: error.config?.url
// // // //       });

// // // //       let errorMessage = 'Failed to fetch order history. ';
// // // //       if (error.response?.status === 401) {
// // // //         errorMessage = 'Authentication error. Please log in again.';
// // // //       } else if (error.response?.status === 404) {
// // // //         errorMessage = 'No orders found for this customer.';
// // // //       } else if (error.response) {
// // // //         errorMessage += `Server error: ${error.response.status}`;
// // // //       } else if (error.request) {
// // // //         errorMessage += 'No response from server. Check server connection.';
// // // //       } else {
// // // //         errorMessage += error.message;
// // // //       }

// // // //       Alert.alert('Error', errorMessage);
// // // //       setOrderHistory([]);
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //       setRefreshing(false);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     fetchOrderHistory();
// // // //   }, []);

// // // //   const formatDate = (dateString: string) => {
// // // //     try {
// // // //       const date = new Date(dateString);
// // // //       return date.toLocaleDateString('en-US', {
// // // //         month: 'short',
// // // //         day: 'numeric',
// // // //         hour: '2-digit',
// // // //         minute: '2-digit'
// // // //       });
// // // //     } catch (error) {
// // // //       console.error('Date formatting error:', error);
// // // //       return dateString;
// // // //     }
// // // //   };

// // // //   const renderOrderItem = ({ item }: { item: OrderHistoryItem }) => {
// // // //     return (
// // // //       <View style={styles.tile}>
// // // //         <View style={styles.tileHeader}>
// // // //           <View style={styles.orderInfo}>
// // // //             <Text style={styles.orderId}>#{item.ORDER_ID}</Text>
// // // //             <Text style={styles.date}>{formatDate(item.ORDER_DATE)}</Text>
// // // //           </View>
// // // //         </View>

// // // //         <View style={styles.tileBody}>
// // // //           <View style={styles.itemInfo}>
// // // //             <Text style={styles.itemName} numberOfLines={1}>
// // // //               {item.ITEM_NAME}
// // // //             </Text>
// // // //             <View style={styles.quantityBadge}>
// // // //               <Text style={styles.quantityText}>×{item.QUANTITY}</Text>
// // // //             </View>
// // // //           </View>

// // // //           <View style={styles.details}>
// // // //             <Text style={styles.detailText}>
// // // //               Lot: <Text style={styles.detailValue}>{item.LOT_NO}</Text>
// // // //             </Text>
// // // //             <Text style={styles.dot}>•</Text>
// // // //             <Text style={styles.detailText}>
// // // //               Item ID: <Text style={styles.detailValue}>{item.ITEM_ID}</Text>
// // // //             </Text>
// // // //           </View>
// // // //         </View>
// // // //       </View>
// // // //     );
// // // //   };

// // // //   if (isLoading) {
// // // //     return (
// // // //       <View style={styles.centered}>
// // // //         <ActivityIndicator size="large" color="#0284C7" />
// // // //       </View>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <View style={styles.container}>
// // // //       <Text style={styles.header}>Order History</Text>
// // // //       <FlatList
// // // //         data={orderHistory}
// // // //         keyExtractor={(item) => item.ORDER_ID.toString()}
// // // //         renderItem={renderOrderItem}
// // // //         contentContainerStyle={styles.list}
// // // //         refreshControl={
// // // //           <RefreshControl
// // // //             refreshing={refreshing}
// // // //             onRefresh={() => {
// // // //               setRefreshing(true);
// // // //               fetchOrderHistory();
// // // //             }}
// // // //           />
// // // //         }
// // // //       />
// // // //     </View>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: '#F8FAFC',
// // // //   },
// // // //   header: {
// // // //     fontSize: 24,
// // // //     fontWeight: '700',
// // // //     color: '#0F172A',
// // // //     padding: 16,
// // // //     backgroundColor: 'white',
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#E2E8F0',
// // // //   },
// // // //   list: {
// // // //     padding: 12,
// // // //   },
// // // //   tile: {
// // // //     backgroundColor: 'white',
// // // //     borderRadius: 12,
// // // //     marginBottom: 8,
// // // //     padding: 12,
// // // //     borderWidth: 1,
// // // //     borderColor: '#E2E8F0',
// // // //   },
// // // //   tileHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     marginBottom: 8,
// // // //   },
// // // //   orderInfo: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //   },
// // // //   orderId: {
// // // //     fontSize: 15,
// // // //     fontWeight: '600',
// // // //     color: '#0F172A',
// // // //     marginRight: 8,
// // // //   },
// // // //   date: {
// // // //     fontSize: 13,
// // // //     color: '#64748B',
// // // //   },
// // // //   tileBody: {
// // // //     gap: 8,
// // // //   },
// // // //   itemInfo: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'space-between',
// // // //   },
// // // //   itemName: {
// // // //     fontSize: 14,
// // // //     fontWeight: '500',
// // // //     color: '#334155',
// // // //     flex: 1,
// // // //     marginRight: 8,
// // // //   },
// // // //   quantityBadge: {
// // // //     backgroundColor: '#F1F5F9',
// // // //     paddingHorizontal: 8,
// // // //     paddingVertical: 4,
// // // //     borderRadius: 6,
// // // //   },
// // // //   quantityText: {
// // // //     fontSize: 13,
// // // //     fontWeight: '500',
// // // //     color: '#475569',
// // // //   },
// // // //   details: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //   },
// // // //   detailText: {
// // // //     fontSize: 13,
// // // //     color: '#64748B',
// // // //   },
// // // //   detailValue: {
// // // //     color: '#334155',
// // // //     fontWeight: '500',
// // // //   },
// // // //   dot: {
// // // //     fontSize: 13,
// // // //     color: '#CBD5E1',
// // // //     marginHorizontal: 6,
// // // //   },
// // // //   centered: {
// // // //     flex: 1,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // // });

// // // // export default OrderHistoryScreen;



// // // import axios from 'axios';
// // // import React, { useEffect, useState } from 'react';
// // // import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

// // // interface OrderHistoryItem {
// // //   ORDER_ID: number;
// // //   CUSTOMERID: string;
// // //   ITEM_ID: number;
// // //   ITEM_NAME: string;
// // //   ORDER_DATE: string;
// // //   QUANTITY: number;
// // //   LOT_NO: string;
// // // }

// // // const BACKEND_URL = "http://192.168.1.3:3000/sf";
// // // const CUSTOMER_ID = "1279"; // Replace or fetch dynamically

// // // const OrderHistoryScreen: React.FC = () => {
// // //   const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [refreshing, setRefreshing] = useState(false);

// // //   const fetchOrderHistory = async () => {
// // //     try {
// // //       setIsLoading(true);
// // //       const url = `${BACKEND_URL}/getOrderHistory/${CUSTOMER_ID}`;
// // //       console.log('Fetching from:', url);

// // //       const token = 'your-auth-token'; // Replace with actual token
// // //       const response = await axios.get(url, {
// // //         timeout: 10000,
// // //         headers: {
// // //           'Accept': 'application/json',
// // //           'Content-Type': 'application/json',
// // //           'Authorization': `Bearer ${token}`,
// // //         },
// // //       });

// // //       if (response.data.success && Array.isArray(response.data.data)) {
// // //         setOrderHistory(response.data.data);
// // //       } else {
// // //         Alert.alert('No Orders', 'No order history found.');
// // //         setOrderHistory([]);
// // //       }
// // //     } catch (error: any) {
// // //       console.error('Error fetching order history:', error);
// // //       Alert.alert('Error', 'Failed to fetch order history.');
// // //       setOrderHistory([]);
// // //     } finally {
// // //       setIsLoading(false);
// // //       setRefreshing(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchOrderHistory();
// // //   }, []);

// // //   const formatDate = (dateString: string) => {
// // //     try {
// // //       const date = new Date(dateString);
// // //       return date.toLocaleDateString('en-US', {
// // //         month: 'short',
// // //         day: 'numeric',
// // //         hour: '2-digit',
// // //         minute: '2-digit',
// // //       });
// // //     } catch {
// // //       return dateString;
// // //     }
// // //   };

// // //   const renderOrderItem = ({ item }: { item: OrderHistoryItem }) => (
// // //     <View style={styles.tile}>
// // //       <Text style={styles.orderId}>Order ID: {item.ORDER_ID}</Text>
// // //       <Text>Customer ID: {item.CUSTOMERID}</Text>
// // //       <Text>Item: {item.ITEM_NAME}</Text>
// // //       <Text>Quantity: {item.QUANTITY}</Text>
// // //       <Text>Lot No: {item.LOT_NO}</Text>
// // //       <Text>Date: {formatDate(item.ORDER_DATE)}</Text>
// // //     </View>
// // //   );

// // //   if (isLoading) {
// // //     return (
// // //       <View style={styles.centered}>
// // //         <ActivityIndicator size="large" color="#0284C7" />
// // //       </View>
// // //     );
// // //   }

// // //   return (
// // //     <FlatList
// // //       data={orderHistory}
// // //       keyExtractor={(item) => item.ORDER_ID.toString()}
// // //       renderItem={renderOrderItem}
// // //       refreshControl={
// // //         <RefreshControl
// // //           refreshing={refreshing}
// // //           onRefresh={() => {
// // //             setRefreshing(true);
// // //             fetchOrderHistory();
// // //           }}
// // //         />
// // //       }
// // //       contentContainerStyle={styles.list}
// // //     />
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// // //   list: { padding: 16 },
// // //   tile: { padding: 16, marginBottom: 8, backgroundColor: '#fff', borderRadius: 8 },
// // //   orderId: { fontWeight: 'bold' },
// // // });

// // // export default OrderHistoryScreen;


// // import axios from 'axios';
// // import React, { useEffect, useState } from 'react';
// // import {
// //   ActivityIndicator,
// //   Alert,
// //   Dimensions,
// //   FlatList,
// //   RefreshControl,
// //   StatusBar,
// //   StyleSheet,
// //   Text,
// //   View,
// // } from 'react-native';

// // interface OrderHistoryItem {
// //   ORDER_ID: number;
// //   CUSTOMERID: string;
// //   ITEM_ID: number;
// //   ITEM_NAME: string;
// //   ORDER_DATE: string;
// //   QUANTITY: number;
// //   LOT_NO: string;
// // }

// // const BACKEND_URL = "http://192.168.1.3:3000/sf";
// // const CUSTOMER_ID = "1279";
// // const { width } = Dimensions.get('window');

// // const OrderHistoryScreen: React.FC = () => {
// //   const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);

// //   const fetchOrderHistory = async () => {
// //     try {
// //       setIsLoading(true);
// //       const url = `${BACKEND_URL}/getOrderHistory/${CUSTOMER_ID}`;
// //       const token = 'your-auth-token';
      
// //       const response = await axios.get(url, {
// //         timeout: 10000,
// //         headers: {
// //           'Accept': 'application/json',
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${token}`,
// //         },
// //       });

// //       if (response.data.success && Array.isArray(response.data.data)) {
// //         setOrderHistory(response.data.data);
// //       } else {
// //         Alert.alert('No Orders', 'No order history found.');
// //         setOrderHistory([]);
// //       }
// //     } catch (error: any) {
// //       console.error('Error fetching order history:', error);
// //       Alert.alert('Error', 'Failed to fetch order history.');
// //       setOrderHistory([]);
// //     } finally {
// //       setIsLoading(false);
// //       setRefreshing(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchOrderHistory();
// //   }, []);

// //   const formatDate = (dateString: string) => {
// //     try {
// //       const date = new Date(dateString);
// //       const formattedDate = date.toLocaleDateString('en-US', {
// //         month: 'long',
// //         day: 'numeric',
// //         year: 'numeric',
// //       });
// //       const formattedTime = date.toLocaleTimeString('en-US', {
// //         hour: '2-digit',
// //         minute: '2-digit',
// //         hour12: true,
// //       });
// //       return `${formattedDate} at ${formattedTime}`;
// //     } catch {
// //       return dateString;
// //     }
// //   };

// //   const renderOrderItem = ({ item }: { item: OrderHistoryItem }) => (
// //     <View style={styles.card}>
// //       <View style={styles.cardHeader}>
// //         <View style={styles.headerLeft}>
// //           <Text style={styles.orderIdText}>Order #{item.ORDER_ID}</Text>
// //           <Text style={styles.dateText} numberOfLines={2}>{formatDate(item.ORDER_DATE)}</Text>
// //         </View>
// //         <View style={styles.statusContainer}>
// //           <View style={styles.statusDot} />
// //           <Text style={styles.statusText}>Processing</Text>
// //         </View>
// //       </View>
      
// //       <View style={styles.divider} />
      
// //       <View style={styles.cardContent}>
// //         <View style={styles.infoRow}>
// //           <Text style={styles.label}>Item Name :</Text>
// //           <Text style={styles.value} numberOfLines={2}>{item.ITEM_NAME}</Text>
// //         </View>
// //         <View style={styles.infoRow}>
// //           <Text style={styles.label}>Quantity :</Text>
// //           <Text style={styles.value}>{item.QUANTITY}</Text>
// //         </View>
// //         <View style={styles.infoRow}>
// //           <Text style={styles.label}>Lot No. :</Text>
// //           <Text style={[styles.value, styles.highlightedValue]} >{item.LOT_NO} </Text>
// //         </View>
// //       </View>
// //     </View>
// //   );

// //   if (isLoading) {
// //     return (
// //       <View style={styles.centered}>
// //         <ActivityIndicator size="large" color="#0284C7" />
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
// //       <View style={styles.header}>
// //         <Text style={styles.headerTitle}>Order History</Text>
// //         <Text style={styles.subtitle}>View your past orders</Text>
// //       </View>
// //       <FlatList
// //         data={orderHistory}
// //         keyExtractor={(item) => item.ORDER_ID.toString()}
// //         renderItem={renderOrderItem}
// //         refreshControl={
// //           <RefreshControl
// //             refreshing={refreshing}
// //             onRefresh={() => {
// //               setRefreshing(true);
// //               fetchOrderHistory();
// //             }}
// //           />
// //         }
// //         contentContainerStyle={styles.list}
// //         showsVerticalScrollIndicator={false}
// //       />
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f3f4f6',
// //   },
// //   centered: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#f3f4f6',
// //   },
// //   header: {
// //     padding: 20,
// //     backgroundColor: '#f3f4f6',
// //   },
// //   headerTitle: {
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     color: '#1f2937',
// //   },
// //   subtitle: {
// //     fontSize: 16,
// //     color: '#6b7280',
// //     marginTop: 4,
// //   },
// //   list: {
// //     padding: 16,
// //   },
// //   card: {
// //     backgroundColor: '#ffffff',
// //     borderRadius: 16,
// //     marginBottom: 16,
// //     padding: 16,
// //     shadowColor: '#000',
// //     shadowOffset: {
// //       width: 0,
// //       height: 2,
// //     },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 3,
// //     elevation: 3,
// //   },
// //   cardHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'flex-start',
// //   },
// //   headerLeft: {
// //     flex: 1,
// //     marginRight: 12,
// //   },
// //   orderIdText: {
// //     fontSize: 18,
// //     fontWeight: '700',
// //     color: '#1f2937',
// //   },
// //   dateText: {
// //     fontSize: 14,
// //     color: '#6b7280',
// //     marginTop: 4,
// //     flexWrap: 'wrap',
// //   },
// //   highlightedValue: {
// //     color: '#F28C28',
// //     fontWeight:'bold'
// //   },
// //   statusContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#ecfdf5',
// //     paddingVertical: 4,
// //     paddingHorizontal: 8,
// //     borderRadius: 12,
// //   },
// //   statusDot: {
// //     width: 6,
// //     height: 6,
// //     borderRadius: 3,
// //     backgroundColor: '#059669',
// //     marginRight: 6,
// //   },
// //   statusText: {
// //     fontSize: 12,
// //     color: '#059669',
// //     fontWeight: '500',
// //   },
// //   divider: {
// //     height: 1,
// //     backgroundColor: '#e5e7eb',
// //     marginVertical: 12,
// //   },
// //   cardContent: {
// //     gap: 12,
// //   },
// //   infoRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'flex-start',
// //     paddingRight: 8,
// //   },
// //   label: {
// //     fontSize: 15,
// //     color: '#6b7280',
// //     width: '30%',
// //   },
// //   value: {
// //     fontSize: 15,
// //     color: '#1f2937',
// //     fontWeight: '500',
// //     width: '70%',
// //     textAlign: 'right',
// //     flexWrap: 'wrap',
// //   },
// // });

// // export default OrderHistoryScreen;

// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   RefreshControl,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';

// interface OrderHistoryItem {
//   ORDER_ID: number;
//   CUSTOMERID: string;
//   ITEM_ID: number;
//   ITEM_NAME: string;
//   ORDER_DATE: string;
//   QUANTITY: number;
//   LOT_NO: string;
// }

// const BACKEND_URL = "http://192.168.1.3:3000/sf";
// const CUSTOMER_ID = "1279";

// const OrderHistoryScreen: React.FC = () => {
//   const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [expandedId, setExpandedId] = useState<number | null>(null);

//   const fetchOrderHistory = async () => {
//     try {
//       setIsLoading(true);
//       const url = `${BACKEND_URL}/getOrderHistory/${CUSTOMER_ID}`;
//       const token = 'your-auth-token';
      
//       const response = await axios.get(url, {
//         timeout: 10000,
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.data.success && Array.isArray(response.data.data)) {
//         setOrderHistory(response.data.data);
//       } else {
//         Alert.alert('No Orders', 'No order history found.');
//         setOrderHistory([]);
//       }
//     } catch (error: any) {
//       console.error('Error fetching order history:', error);
//       Alert.alert('Error', 'Failed to fetch order history.');
//       setOrderHistory([]);
//     } finally {
//       setIsLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrderHistory();
//   }, []);

//   const formatDate = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       const formattedDate = date.toLocaleDateString('en-US', {
//         month: 'long',
//         day: 'numeric',
//         year: 'numeric',
//       });
//       const formattedTime = date.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//       });
//       return `${formattedDate} at ${formattedTime}`;
//     } catch {
//       return dateString;
//     }
//   };

//   const toggleExpand = (orderId: number) => {
//     setExpandedId(expandedId === orderId ? null : orderId);
//   };

//   const renderOrderItem = ({ item }: { item: OrderHistoryItem }) => {
//     const isExpanded = expandedId === item.ORDER_ID;

//     return (
//       <View style={styles.card}>
//         <View style={styles.mainContent}>
//           <View style={styles.orderInfo}>
//             <Text style={styles.orderIdText}>Order #{item.ORDER_ID}</Text>
//             <Text style={styles.dateText}>{formatDate(item.ORDER_DATE)}</Text>
//           </View>
//           <TouchableOpacity
//             onPress={() => toggleExpand(item.ORDER_ID)}
//             style={styles.menuButton}
//           >
//             <Text style={styles.menuIcon}>{isExpanded ? '▼' : '▶'}</Text>
//           </TouchableOpacity>
//         </View>

//         {isExpanded && (
//           <View style={styles.expandedContent}>
//             <View style={styles.divider} />
//             <View style={styles.detailsContainer}>
//               <View style={styles.detailRow}>
//                 <Text style={styles.label}>Item Name:</Text>
//                 <Text style={styles.value}>{item.ITEM_NAME}</Text>
//               </View>
//               <View style={styles.detailRow}>
//                 <Text style={styles.label}>Quantity:</Text>
//                 <Text style={styles.value}>{item.QUANTITY}</Text>
//               </View>
//               <View style={styles.detailRow}>
//                 <Text style={styles.label}>Lot No.:</Text>
//                 <Text style={[styles.value, styles.highlightedValue]}>{item.LOT_NO}</Text>
//               </View>
//             </View>
//           </View>
//         )}
//       </View>
//     );
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#0284C7" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Order History</Text>
//         <Text style={styles.subtitle}>View your past orders</Text>
//       </View>
//       <FlatList
//         data={orderHistory}
//         keyExtractor={item => `order-${item.ORDER_ID}`}
//         renderItem={renderOrderItem}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={() => {
//               setRefreshing(true);
//               fetchOrderHistory();
//             }}
//           />
//         }
//         contentContainerStyle={styles.list}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f3f4f6',
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f3f4f6',
//   },
//   header: {
//     padding: 20,
//     backgroundColor: '#f3f4f6',
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#1f2937',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#6b7280',
//     marginTop: 4,
//   },
//   list: {
//     padding: 16,
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     marginBottom: 12,
//     padding: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   mainContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   orderInfo: {
//     flex: 1,
//   },
//   orderIdText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1f2937',
//     marginBottom: 4,
//   },
//   dateText: {
//     fontSize: 14,
//     color: '#6b7280',
//   },
//   menuButton: {
//     padding: 8,
//   },
//   menuIcon: {
//     fontSize: 16,
//     color: '#6b7280',
//   },
//   expandedContent: {
//     marginTop: 12,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#e5e7eb',
//     marginBottom: 12,
//   },
//   detailsContainer: {
//     gap: 8,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   label: {
//     fontSize: 14,
//     color: '#6b7280',
//     flex: 1,
//   },
//   value: {
//     fontSize: 14,
//     color: '#1f2937',
//     flex: 2,
//     textAlign: 'right',
//   },
//   highlightedValue: {
//     color: '#F28C28',
//     fontWeight: '600',
//   },
// });

// export default OrderHistoryScreen;


import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface OrderHistoryItem {
  ORDER_ID: number;
  CUSTOMERID: string;
  ITEM_ID: number;
  ITEM_NAME: string;
  ORDER_DATE: string;
  QUANTITY: number;
  LOT_NO: string;
}

interface GroupedOrder {
  ORDER_ID: number;
  ORDER_DATE: string;
  items: OrderHistoryItem[];
}

const BACKEND_URL = "http://192.168.1.3:3000/sf";
const CUSTOMER_ID = "1279";

const OrderHistoryScreen: React.FC = () => {
  const [orderHistory, setOrderHistory] = useState<GroupedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const groupOrdersByOrderId = (orders: OrderHistoryItem[]): GroupedOrder[] => {
    const groupedOrders = orders.reduce((acc: { [key: number]: GroupedOrder }, curr) => {
      if (!acc[curr.ORDER_ID]) {
        acc[curr.ORDER_ID] = {
          ORDER_ID: curr.ORDER_ID,
          ORDER_DATE: curr.ORDER_DATE,
          items: [],
        };
      }
      acc[curr.ORDER_ID].items.push(curr);
      return acc;
    }, {});

    return Object.values(groupedOrders).sort((a, b) => 
      new Date(b.ORDER_DATE).getTime() - new Date(a.ORDER_DATE).getTime()
    );
  };

  const fetchOrderHistory = async () => {
    try {
      setIsLoading(true);
      const url = `${BACKEND_URL}/getOrderHistory/${CUSTOMER_ID}`;
      const token = 'your-auth-token';
      
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        const groupedOrders = groupOrdersByOrderId(response.data.data);
        setOrderHistory(groupedOrders);
      } else {
        Alert.alert('No Orders', 'No order history found.');
        setOrderHistory([]);
      }
    } catch (error: any) {
      console.error('Error fetching order history:', error);
      Alert.alert('Error', 'Failed to fetch order history.');
      setOrderHistory([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      return `${formattedDate} at ${formattedTime}`;
    } catch {
      return dateString;
    }
  };

  const toggleExpand = (orderId: number) => {
    setExpandedId(expandedId === orderId ? null : orderId);
  };

  const renderOrderItem = ({ item }: { item: GroupedOrder }) => {
    const isExpanded = expandedId === item.ORDER_ID;

    return (
      <View style={styles.card}>
        <View style={styles.mainContent}>
          <View style={styles.orderHeader}>
            <View style={styles.orderTitleContainer}>
              <Text style={styles.orderIdText}>Order #{item.ORDER_ID}</Text>
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Processing</Text>
              </View>
            </View>
            <Text style={styles.dateText}>{formatDate(item.ORDER_DATE)}</Text>
          </View>
          <TouchableOpacity
            onPress={() => toggleExpand(item.ORDER_ID)}
            style={styles.menuButton}
          >
            <Text style={styles.menuIcon}>{isExpanded ? '▼' : '▶'}</Text>
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.divider} />
            <View style={styles.detailsContainer}>
              {item.items.map((orderItem, index) => (
                <View key={orderItem.ITEM_ID} style={styles.itemContainer}>
                  {index > 0 && <View style={styles.itemDivider} />}
                  <Text style={styles.itemTitle}>ITEM {index + 1}</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Item Name:</Text>
                    <Text style={styles.value}>{orderItem.ITEM_NAME}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Ordered Quantity:</Text>
                    <Text style={styles.value}>{orderItem.QUANTITY}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Lot No:</Text>
                    <Text style={[styles.value, styles.highlightedValue]}>{orderItem.LOT_NO}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0284C7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
        <Text style={styles.subtitle}>View your orders</Text>
      </View>
      <FlatList
        data={orderHistory}
        keyExtractor={item => `order-${item.ORDER_ID}`}
        renderItem={renderOrderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchOrderHistory();
            }}
          />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#663399',
    textAlign:'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
    textAlign:'center',
    fontWeight:'500'
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderHeader: {
    flex: 1,
  },
  orderTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight:'500'
  },
  menuButton: {
    padding: 4,
    marginLeft: 8,
  },
  menuIcon: {
    fontSize: 16,
    color: '#663399',
  },
  expandedContent: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginBottom: 12,
  },
  itemDivider: {
    height: 2,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  detailsContainer: {
    gap: 8,
  },
  itemContainer: {
    gap: 8,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#663399',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 13,
    color: '#6b7280',
    width:'50%',
    flex: 1,
    fontWeight:'500'
  },
  value: {
    fontSize: 13,
    color: '#1f2937',
    flex: 2,
    fontWeight:'bold',
    textAlign: 'right',
  },
  highlightedValue: {
    color: '#F28C28',
    fontWeight: '700',
  },
});

export default OrderHistoryScreen;