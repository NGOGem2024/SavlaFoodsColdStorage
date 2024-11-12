// import { RouteProp } from '@react-navigation/native';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { RootStackParamList } from '../../App';

// const BACKEND_URL = "http://192.168.1.3:3000/sf";

// interface ItemDetails {
//   DESCRIPTION: string;
//   ITEM_CODE: string;
//   ITEM_ID: number;
//   ITEM_NAME: string;
//   ITEM_SUB_CATEGORY_ID: number;
// }

// interface StockDetails {
//   LOT_NO: string | null;
//   FK_UNIT_ID: number | null;
//   ITEM_MARKS: string | null;
//   VAKAL_NO: string | null;
//   BATCH_NO: string | null;
//   AVAILABLE_QTY: number | null;
//   BOX_QUANTITY: number | null;
//   EXPIRY_DATE: string | null;
//   REMARKS: string | null;
//   STATUS: string | null;
// }

// interface APIResponse {
//   input: {
//     ItemID: number;
//   };
//   output: {
//     itemDetails: ItemDetails;
//     stockDetails: StockDetails[];
//   };
// }

// type ItemDetailsExpandedProps = {
//   route: RouteProp<RootStackParamList, 'ItemDetailsExpanded'>;
// };

// const ItemDetailsExpanded: React.FC<ItemDetailsExpandedProps> = ({ route }) => {
//   const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
//   const [stockDetails, setStockDetails] = useState<StockDetails[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchStockDetails = async (showLoader = true) => {
//     if (showLoader) setLoading(true);
//     setError(null);

//     try {
//       const { ItemID } = route.params;
//       console.log('Fetching details for ItemID:', ItemID);

//       const response = await axios.post<APIResponse>(
//         `${BACKEND_URL}/getItemDetailsWithStock`,
//         { ItemID },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           },
//           timeout: 10000
//         }
//       );

//       console.log('API Response:', response.data);

//       if (response.data?.output) {
//         const { itemDetails, stockDetails } = response.data.output;

//         if (!stockDetails || stockDetails.length === 0) {
//           setError('No stock details available for this item');
//           setStockDetails([]);
//         } else {
//           setItemDetails(itemDetails);
//           setStockDetails(stockDetails);
//           setError(null);
//         }
//       } else {
//         throw new Error('Invalid response format from server');
//       }
//     } catch (err) {
//       console.error('Error fetching stock details:', err);
//       const errorMessage = axios.isAxiosError(err)
//         ? err.response?.data?.message || err.message
//         : 'An unexpected error occurred';

//       setError(errorMessage);
//       Alert.alert('Error', errorMessage);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     if (!route.params?.ItemID) {
//       setError('Invalid item ID');
//       setLoading(false);
//       return;
//     }
//     fetchStockDetails();
//   }, [route.params.ItemID]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchStockDetails(false);
//   };

//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return 'Not Available';
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     } catch {
//       return 'Invalid Date';
//     }
//   };

//   const formatQuantity = (quantity: number | null) => {
//     if (quantity === null) return 'Not Available';
//     return quantity.toLocaleString();
//   };

//   const renderDetailItem = (label: string, value: any, formatter?: (value: any) => string) => (
//     <View style={styles.detailItem}>
//       <Text style={styles.detailLabel}>{label}</Text>
//       <Text style={styles.detailValue}>
//         {value === null
//           ? 'Not Available'
//           : formatter
//             ? formatter(value)
//             : value.toString()
//         }
//       </Text>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity
//           style={styles.retryButton}
//           onPress={() => fetchStockDetails()}
//         >
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={styles.container}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }
//     >
//       {itemDetails && (
//         <View style={styles.card}>
//           <Text style={styles.cardHeader}>{itemDetails.ITEM_NAME}</Text>
//           <View style={styles.itemDetailsSection}>
//             {renderDetailItem('Item Code', itemDetails.ITEM_CODE)}
//             {renderDetailItem('Description', itemDetails.DESCRIPTION)}
//           </View>
//         </View>
//       )}

//       {stockDetails.map((stock, index) => (
//         <View key={index} style={styles.card}>
//           <Text style={styles.cardHeader}>Stock Details {index + 1}</Text>
//           {renderDetailItem('Lot Number', stock.LOT_NO)}
//           {renderDetailItem('Unit ID', stock.FK_UNIT_ID)}
//           {renderDetailItem('Item Marks', stock.ITEM_MARKS)}
//           {renderDetailItem('Vakal Number', stock.VAKAL_NO)}
//           {renderDetailItem('Batch Number', stock.BATCH_NO)}
//           {renderDetailItem('Available Quantity', stock.AVAILABLE_QTY, formatQuantity)}
//           {renderDetailItem('Box Quantity', stock.BOX_QUANTITY, formatQuantity)}
//           {renderDetailItem('Expiry Date', stock.EXPIRY_DATE, formatDate)}
//           {renderDetailItem('Remarks', stock.REMARKS)}
//           {renderDetailItem('Status', stock.STATUS)}
//         </View>
//       ))}

//       {stockDetails.length === 0 && !loading && !error && (
//         <View style={styles.card}>
//           <Text style={styles.noDataText}>No stock details available</Text>
//         </View>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#dc3545',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   retryButton: {
//     backgroundColor: '#007bff',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//     elevation: 2,
//   },
//   retryButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     margin: 16,
//     padding: 16,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   cardHeader: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   itemDetailsSection: {
//     marginBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e9ecef',
//     paddingBottom: 16,
//   },
//   detailItem: {
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e9ecef',
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: '#6c757d',
//     marginBottom: 4,
//     fontWeight: '500',
//   },
//   detailValue: {
//     fontSize: 16,
//     color: '#2c3e50',
//     fontWeight: '600',
//   },
//   noDataText: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#6c757d',
//     padding: 20,
//   },
// });

// export default ItemDetailsExpanded;

// import { RouteProp } from '@react-navigation/native';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { RootStackParamList } from '../../App';

// const BACKEND_URL = "http://192.168.1.3:3000/sf";

// interface ItemDetails {
//   DESCRIPTION: string;
//   ITEM_CODE: string;
//   ITEM_ID: number;
//   ITEM_NAME: string;
//   ITEM_SUB_CATEGORY_ID: number;
// }

// interface StockDetails {
//   LOT_NO: string | null;
//   FK_UNIT_ID: number | null;
//   ITEM_MARKS: string | null;
//   VAKAL_NO: string | null;
//   BATCH_NO: string | null;
//   AVAILABLE_QTY: number | null;
//   BOX_QUANTITY: number | null;
//   EXPIRY_DATE: string | null;
//   REMARKS: string | null;
//   STATUS: string | null;
// }

// interface APIResponse {
//   input: {
//     ItemID: number;
//   };
//   output: {
//     itemDetails: ItemDetails;
//     stockDetails: StockDetails[];
//   };
// }

// type ItemDetailsExpandedProps = {
//   route: RouteProp<RootStackParamList, 'ItemDetailsExpanded'>;
// };

// const ItemDetailsExpanded: React.FC<ItemDetailsExpandedProps> = ({ route }) => {
//   const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
//   const [stockDetails, setStockDetails] = useState<StockDetails[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({});

//   const fetchStockDetails = async (showLoader = true) => {
//     if (showLoader) setLoading(true);
//     setError(null);

//     try {
//       const { ItemID } = route.params;
//       console.log('Fetching details for ItemID:', ItemID);

//       const response = await axios.post<APIResponse>(
//         `${BACKEND_URL}/getItemDetailsWithStock`,
//         { ItemID },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           },
//           timeout: 10000
//         }
//       );

//       console.log('API Response:', response.data);

//       if (response.data?.output) {
//         const { itemDetails, stockDetails } = response.data.output;

//         if (!stockDetails || stockDetails.length === 0) {
//           setError('No stock details available for this item');
//           setStockDetails([]);
//         } else {
//           setItemDetails(itemDetails);
//           setStockDetails(stockDetails);
//           setError(null);
//         }
//       } else {
//         throw new Error('Invalid response format from server');
//       }
//     } catch (err) {
//       console.error('Error fetching stock details:', err);
//       const errorMessage = axios.isAxiosError(err)
//         ? err.response?.data?.message || err.message
//         : 'An unexpected error occurred';

//       setError(errorMessage);
//       Alert.alert('Error', errorMessage);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     if (!route.params?.ItemID) {
//       setError('Invalid item ID');
//       setLoading(false);
//       return;
//     }
//     fetchStockDetails();
//   }, [route.params.ItemID]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchStockDetails(false);
//   };

//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return 'Not Available';
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     } catch {
//       return 'Invalid Date';
//     }
//   };

//   const formatQuantity = (quantity: number | null) => {
//     if (quantity === null) return 'Not Available';
//     return quantity.toLocaleString();
//   };

//   const toggleExpand = (index: number) => {
//     setExpandedItems(prev => ({
//       ...prev,
//       [index]: !prev[index]
//     }));
//   };

//   const filteredStockDetails = stockDetails.filter(stock =>
//     stock.LOT_NO?.toString().toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const renderDetailItem = (label: string, value: any, formatter?: (value: any) => string) => (
//     <View style={styles.detailItem}>
//       <Text style={styles.detailLabel}>{label}</Text>
//       <Text style={styles.detailValue}>
//         {value === null
//           ? 'Not Available'
//           : formatter
//             ? formatter(value)
//             : value.toString()
//         }
//       </Text>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#0066CC" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity
//           style={styles.retryButton}
//           onPress={() => fetchStockDetails()}
//         >
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.mainContainer}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerText}>UNICORP ENTERPRISES</Text>
//       </View>

//       {/* Search Filter */}
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search by Lot Number"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           placeholderTextColor="#6B7280"
//         />
//       </View>

//       <ScrollView
//         style={styles.container}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {itemDetails && (
//           <View style={styles.card}>
//             <Text style={styles.cardHeader}>{itemDetails.ITEM_NAME}</Text>
//             <View style={styles.itemDetailsSection}>
//               {renderDetailItem('Item Code', itemDetails.ITEM_CODE)}
//               {renderDetailItem('Description', itemDetails.DESCRIPTION)}
//             </View>
//           </View>
//         )}

//         {filteredStockDetails.map((stock, index) => (
//           <View key={index} style={styles.stockCard}>
//             {/* Basic Info - Always Visible */}
//             <TouchableOpacity
//               style={styles.stockHeader}
//               onPress={() => toggleExpand(index)}
//             >
//               <View style={styles.stockBasicInfo}>
//                 <Text style={styles.lotNumber}>Lot No: {stock.LOT_NO || 'N/A'}</Text>
//                 <Text style={styles.quantity}>
//                   Qty: {formatQuantity(stock.AVAILABLE_QTY)}
//                 </Text>
//               </View>
//               <Text style={[
//                 styles.expandButton,
//                 expandedItems[index] && styles.expandButtonRotated
//               ]}>
//                 ▼
//               </Text>
//             </TouchableOpacity>

//             {/* Expanded Details */}
//             {expandedItems[index] && (
//               <View style={styles.expandedDetails}>
//                 {renderDetailItem('Unit ID', stock.FK_UNIT_ID)}
//                 {renderDetailItem('Item Marks', stock.ITEM_MARKS)}
//                 {renderDetailItem('Vakal Number', stock.VAKAL_NO)}
//                 {renderDetailItem('Batch Number', stock.BATCH_NO)}
//                 {renderDetailItem('Box Quantity', stock.BOX_QUANTITY, formatQuantity)}
//                 {renderDetailItem('Expiry Date', stock.EXPIRY_DATE, formatDate)}
//                 {renderDetailItem('Remarks', stock.REMARKS)}
//                 {renderDetailItem('Status', stock.STATUS)}
//               </View>
//             )}
//           </View>
//         ))}

//         {filteredStockDetails.length === 0 && !loading && !error && (
//           <View style={styles.card}>
//             <Text style={styles.noDataText}>No stock details available</Text>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     backgroundColor: '#0066CC',
//     padding: 16,
//     alignItems: 'center',
//     elevation: 4,
//   },
//   headerText: {
//     color: '#FFFFFF',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   searchContainer: {
//     backgroundColor: '#FFFFFF',
//     margin: 16,
//     marginBottom: 8,
//     borderRadius: 8,
//     elevation: 2,
//     padding: 8,
//   },
//   searchInput: {
//     height: 40,
//     paddingHorizontal: 12,
//     fontSize: 16,
//     color: '#1F2937',
//   },
//   container: {
//     flex: 1,
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#dc3545',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   retryButton: {
//     backgroundColor: '#0066CC',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//     elevation: 2,
//   },
//   retryButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     margin: 16,
//     marginTop: 8,
//     padding: 16,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   stockCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     margin: 16,
//     marginTop: 8,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     overflow: 'hidden',
//   },
//   stockHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#f8f9fa',
//   },
//   stockBasicInfo: {
//     flex: 1,
//   },
//   lotNumber: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2c3e50',
//     marginBottom: 4,
//   },
//   quantity: {
//     fontSize: 14,
//     color: '#666',
//   },
//   expandButton: {
//     fontSize: 16,
//     color: '#0066CC',
//     marginLeft: 8,
//   },
//   expandButtonRotated: {
//     transform: [{ rotate: '180deg' }],
//   },
//   expandedDetails: {
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   cardHeader: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 16,
//   },
//   itemDetailsSection: {
//     marginBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e9ecef',
//     paddingBottom: 16,
//   },
//   detailItem: {
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e9ecef',
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: '#6c757d',
//     marginBottom: 4,
//     fontWeight: '500',
//   },
//   detailValue: {
//     fontSize: 16,
//     color: '#2c3e50',
//     fontWeight: '600',
//   },
//   noDataText: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#6c757d',
//     padding: 20,
//   },
// });

// export default ItemDetailsExpanded;

// import { RouteProp } from '@react-navigation/native';
// import axios from 'axios';
// import { Search } from 'lucide-react-native';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { RootStackParamList } from '../../App';

// const BACKEND_URL = "http://192.168.1.3:3000/sf";

// // Keep existing interfaces (ItemDetails, StockDetails, APIResponse, ItemDetailsExpandedProps)
// interface ItemDetails {
//   DESCRIPTION: string;
//   ITEM_CODE: string;
//   ITEM_ID: number;
//   ITEM_NAME: string;
//   ITEM_SUB_CATEGORY_ID: number;
// }

// interface StockDetails {
//   LOT_NO: string | null;
//   FK_UNIT_ID: number | null;
//   ITEM_MARKS: string | null;
//   VAKAL_NO: string | null;
//   BATCH_NO: string | null;
//   AVAILABLE_QTY: number | null;
//   BOX_QUANTITY: number | null;
//   EXPIRY_DATE: string | null;
//   REMARKS: string | null;
//   STATUS: string | null;
// }

// interface APIResponse {
//   input: {
//     ItemID: number;
//   };
//   output: {
//     itemDetails: ItemDetails;
//     stockDetails: StockDetails[];
//   };
// }

// type ItemDetailsExpandedProps = {
//   route: RouteProp<RootStackParamList, 'ItemDetailsExpanded'>;
// };

// const ItemDetailsExpanded: React.FC<ItemDetailsExpandedProps> = ({ route }) => {
//   // Keep existing state management code
//   const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
//   const [stockDetails, setStockDetails] = useState<StockDetails[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({});

//   // Keep existing functions (fetchStockDetails, useEffect, onRefresh, formatDate, formatQuantity, toggleExpand, etc.)
//   const fetchStockDetails = async (showLoader = true) => {
//     if (showLoader) setLoading(true);
//     setError(null);

//     try {
//       const { ItemID } = route.params;
//       const response = await axios.post<APIResponse>(
//         `${BACKEND_URL}/getItemDetailsWithStock`,
//         { ItemID },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           },
//           timeout: 10000
//         }
//       );

//       if (response.data?.output) {
//         const { itemDetails, stockDetails } = response.data.output;

//         if (!stockDetails || stockDetails.length === 0) {
//           setError('No stock details available for this item');
//           setStockDetails([]);
//         } else {
//           setItemDetails(itemDetails);
//           setStockDetails(stockDetails);
//           setError(null);
//         }
//       } else {
//         throw new Error('Invalid response format from server');
//       }
//     } catch (err) {
//       console.error('Error fetching stock details:', err);
//       const errorMessage = axios.isAxiosError(err)
//         ? err.response?.data?.message || err.message
//         : 'An unexpected error occurred';

//       setError(errorMessage);
//       Alert.alert('Error', errorMessage);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     if (!route.params?.ItemID) {
//       setError('Invalid item ID');
//       setLoading(false);
//       return;
//     }
//     fetchStockDetails();
//   }, [route.params.ItemID]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchStockDetails(false);
//   };

//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return 'Not Available';
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     } catch {
//       return 'Invalid Date';
//     }
//   };

//   const formatQuantity = (quantity: number | null) => {
//     if (quantity === null) return 'Not Available';
//     return quantity.toLocaleString();
//   };

//   const toggleExpand = (index: number) => {
//     setExpandedItems(prev => ({
//       ...prev,
//       [index]: !prev[index]
//     }));
//   };

//   const filteredStockDetails = stockDetails.filter(stock =>
//     stock.LOT_NO?.toString().toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const renderDetailItem = (label: string, value: any, formatter?: (value: any) => string) => (
//     <View style={styles.detailItem}>
//       <Text style={styles.detailLabel}>{label}</Text>
//       <Text style={styles.detailValue}>
//         {value === null
//           ? 'Not Available'
//           : formatter
//             ? formatter(value)
//             : value.toString()
//         }
//       </Text>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#0066CC" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity
//           style={styles.retryButton}
//           onPress={() => fetchStockDetails()}
//         >
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.mainContainer}>
//       {/* Search Filter */}
//       <View style={styles.searchContainer}>
//         <View style={styles.searchInputContainer}>
//           <Search size={20} color="#6B7280" style={styles.searchIcon} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search by Lot Number"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             placeholderTextColor="#6B7280"
//           />
//         </View>
//       </View>

//       <ScrollView
//         style={styles.container}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {itemDetails && (
//           <View style={styles.card}>
//             <Text style={styles.cardHeader}>{itemDetails.ITEM_NAME}</Text>
//             <View style={styles.itemDetailsSection}>
//               {renderDetailItem('Item Code', itemDetails.ITEM_CODE)}
//               {renderDetailItem('Description', itemDetails.DESCRIPTION)}
//             </View>
//           </View>
//         )}

//         {filteredStockDetails.map((stock, index) => (
//           <View key={index} style={styles.stockCard}>
//             <TouchableOpacity
//               style={styles.stockHeader}
//               onPress={() => toggleExpand(index)}
//             >
//               <View style={styles.stockBasicInfo}>
//                 <Text style={styles.lotNumber}>Lot No: {stock.LOT_NO || 'N/A'}</Text>
//                 <Text style={styles.quantity}>
//                   Qty: {formatQuantity(stock.AVAILABLE_QTY)}
//                 </Text>
//               </View>
//               <Text style={[
//                 styles.expandButton,
//                 expandedItems[index] && styles.expandButtonRotated
//               ]}>
//                 ▼
//               </Text>
//             </TouchableOpacity>

//             {expandedItems[index] && (
//               <View style={styles.expandedDetails}>
//                 {renderDetailItem('Unit ID', stock.FK_UNIT_ID)}
//                 {renderDetailItem('Item Marks', stock.ITEM_MARKS)}
//                 {renderDetailItem('Vakal Number', stock.VAKAL_NO)}
//                 {renderDetailItem('Batch Number', stock.BATCH_NO)}
//                 {renderDetailItem('Box Quantity', stock.BOX_QUANTITY, formatQuantity)}
//                 {renderDetailItem('Expiry Date', stock.EXPIRY_DATE, formatDate)}
//                 {renderDetailItem('Remarks', stock.REMARKS)}
//                 {renderDetailItem('Status', stock.STATUS)}
//               </View>
//             )}
//           </View>
//         ))}

//         {filteredStockDetails.length === 0 && !loading && !error && (
//           <View style={styles.card}>
//             <Text style={styles.noDataText}>No stock details available</Text>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   searchContainer: {
//     backgroundColor: '#FFFFFF',
//     width:'90%',
//     alignSelf:'center',
//     margin: 16,
//     marginBottom: 8,
//     borderRadius: 20,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     height:50
//   },
//   searchInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     height: 36,
//     fontSize: 14,
//     color: '#1F2937',
//     // textAlign:'center',

//   },
//   container: {
//     flex: 1,
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#dc3545',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   retryButton: {
//     backgroundColor: '#0066CC',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//     elevation: 2,
//   },
//   retryButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     margin: 16,
//     marginTop: 8,
//     padding: 16,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   stockCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     margin: 16,
//     marginTop: 8,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     overflow: 'hidden',
//   },
//   stockHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#E8F4FF', // Light blue background
//   },
//   stockBasicInfo: {
//     flex: 1,
//   },
//   lotNumber: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#0066CC', // Blue text
//     marginBottom: 4,
//   },
//   quantity: {
//     fontSize: 14,
//     color: '#666',
//   },
//   expandButton: {
//     fontSize: 16,
//     color: '#0066CC',
//     marginLeft: 8,
//   },
//   expandButtonRotated: {
//     transform: [{ rotate: '180deg' }],
//   },
//   expandedDetails: {
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#E8F4FF', // Light blue border
//   },
//   cardHeader: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FF6B00', // Orange text for item name
//     marginBottom: 16,
//   },
//   itemDetailsSection: {
//     marginBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e9ecef',
//     paddingBottom: 16,
//   },
//   detailItem: {
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e9ecef',
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: '#0066CC', // Blue labels
//     marginBottom: 4,
//     fontWeight: '500',
//   },
//   detailValue: {
//     fontSize: 16,
//     color: '#2c3e50',
//     fontWeight: '600',
//   },
//   noDataText: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#6c757d',
//     padding: 20,
//   },
// });

// export default ItemDetailsExpanded;

// import { RouteProp } from '@react-navigation/native';
// import axios from 'axios';
// import { ChevronDown, Grid, Search, Table } from 'lucide-react-native';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Animated,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { RootStackParamList } from '../../App';

// const BACKEND_URL = "http://192.168.1.3:3000/sf";

// // Interfaces remain the same
// interface ItemDetails {
//   DESCRIPTION: string;
//   ITEM_CODE: string;
//   ITEM_ID: number;
//   ITEM_NAME: string;
//   ITEM_SUB_CATEGORY_ID: number;
// }

// interface StockDetails {
//   LOT_NO: string | null;
//   FK_UNIT_ID: number | null;
//   ITEM_MARKS: string | null;
//   VAKAL_NO: string | null;
//   BATCH_NO: string | null;
//   AVAILABLE_QTY: number | null;
//   BOX_QUANTITY: number | null;
//   EXPIRY_DATE: string | null;
//   REMARKS: string | null;
//   STATUS: string | null;
// }

// interface APIResponse {
//   input: { ItemID: number };
//   output: {
//     itemDetails: ItemDetails;
//     stockDetails: StockDetails[];
//   };
// }

// type ItemDetailsExpandedProps = {
//   route: RouteProp<RootStackParamList, 'ItemDetailsExpanded'>;
// };

// const ItemDetailsExpanded: React.FC<ItemDetailsExpandedProps> = ({ route }) => {
//   const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
//   const [stockDetails, setStockDetails] = useState<StockDetails[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({});
//   const [isTableView, setIsTableView] = useState(false);
//   const [rotationValues] = useState<{ [key: number]: Animated.Value }>({});

//   // Animation setup for card expansion
//   const getRotationValue = (index: number) => {
//     if (!rotationValues[index]) {
//       rotationValues[index] = new Animated.Value(0);
//     }
//     return rotationValues[index];
//   };

//   const toggleExpand = (index: number) => {
//     const isExpanded = !expandedItems[index];
//     setExpandedItems(prev => ({ ...prev, [index]: isExpanded }));

//     Animated.spring(getRotationValue(index), {
//       toValue: isExpanded ? 1 : 0,
//       useNativeDriver: true,
//     }).start();
//   };

//   const fetchStockDetails = async (showLoader = true) => {
//     if (showLoader) setLoading(true);
//     setError(null);

//     try {
//       const { ItemID } = route.params;
//       const response = await axios.post<APIResponse>(
//         `${BACKEND_URL}/getItemDetailsWithStock`,
//         { ItemID },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           },
//           timeout: 10000
//         }
//       );

//       if (response.data?.output) {
//         const { stockDetails } = response.data.output;
//         if (!stockDetails || stockDetails.length === 0) {
//           setError('No stock details available');
//           setStockDetails([]);
//         } else {
//           setStockDetails(stockDetails);
//           setError(null);
//         }
//       } else {
//         throw new Error('Invalid response format');
//       }
//     } catch (err) {
//       const errorMessage = axios.isAxiosError(err)
//         ? err.response?.data?.message || err.message
//         : 'An unexpected error occurred';
//       setError(errorMessage);
//       Alert.alert('Error', errorMessage);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     if (!route.params?.ItemID) {
//       setError('Invalid item ID');
//       setLoading(false);
//       return;
//     }
//     fetchStockDetails();
//   }, [route.params.ItemID]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchStockDetails(false);
//   };

//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     } catch {
//       return 'Invalid Date';
//     }
//   };

//   const formatQuantity = (quantity: number | null) => {
//     if (quantity === null) return 'N/A';
//     return quantity.toLocaleString();
//   };

//   // Enhanced search functionality
//   const filteredStockDetails = stockDetails.filter(stock => {
//     const searchLower = searchQuery.toLowerCase();
//     return Object.values(stock).some(value =>
//       value !== null && value.toString().toLowerCase().includes(searchLower)
//     );
//   });

//   const renderCardView = () => (
//     <ScrollView
//       style={styles.container}
//       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//     >
//       {filteredStockDetails.map((stock, index) => {
//         const rotationValue = getRotationValue(index).interpolate({
//           inputRange: [0, 1],
//           outputRange: ['0deg', '180deg']
//         });

//         return (
//           <Animated.View key={index} style={styles.stockCard}>
//             <TouchableOpacity
//               style={styles.stockHeader}
//               onPress={() => toggleExpand(index)}
//             >
//               <View style={styles.stockBasicInfo}>
//                 <Text style={styles.lotNumber}>Lot No: {stock.LOT_NO || 'N/A'}</Text>
//                 <Text style={styles.quantity}>
//                   Quantity: {formatQuantity(stock.AVAILABLE_QTY)}
//                 </Text>
//               </View>
//               <Animated.View style={{ transform: [{ rotate: rotationValue }] }}>
//                 <ChevronDown size={24} color="#0066CC" />
//               </Animated.View>
//             </TouchableOpacity>

//             {expandedItems[index] && (
//               <Animated.View style={styles.expandedDetails}>
//                 <View style={styles.detailGrid}>
//                   <View style={styles.detailCard}>
//                     <Text style={styles.detailLabel}>Unit ID</Text>
//                     <Text style={styles.detailValue}>{stock.FK_UNIT_ID || 'N/A'}</Text>
//                   </View>
//                   <View style={styles.detailCard}>
//                     <Text style={styles.detailLabel}>Batch No</Text>
//                     <Text style={styles.detailValue}>{stock.BATCH_NO || 'N/A'}</Text>
//                   </View>
//                   <View style={styles.detailCard}>
//                     <Text style={styles.detailLabel}>Box Qty</Text>
//                     <Text style={styles.detailValue}>{formatQuantity(stock.BOX_QUANTITY)}</Text>
//                   </View>
//                   <View style={styles.detailCard}>
//                     <Text style={styles.detailLabel}>Expiry</Text>
//                     <Text style={styles.detailValue}>{formatDate(stock.EXPIRY_DATE)}</Text>
//                   </View>
//                 </View>
//               </Animated.View>
//             )}
//           </Animated.View>
//         );
//       })}
//     </ScrollView>
//   );

//   const renderTableView = () => (
//     <ScrollView
//       style={styles.container}
//       horizontal={true}
//       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//     >
//       <View>
//         <View style={styles.tableHeader}>
//           <Text style={[styles.tableHeaderCell, { width: 120 }]}>Lot No</Text>
//           <Text style={[styles.tableHeaderCell, { width: 100 }]}>Quantity</Text>
//           <Text style={[styles.tableHeaderCell, { width: 100 }]}>Unit ID</Text>
//           <Text style={[styles.tableHeaderCell, { width: 120 }]}>Batch No</Text>
//           <Text style={[styles.tableHeaderCell, { width: 100 }]}>Box Qty</Text>
//           <Text style={[styles.tableHeaderCell, { width: 150 }]}>Expiry Date</Text>
//         </View>
//         <ScrollView>
//           {filteredStockDetails.map((stock, index) => (
//             <View key={index} style={styles.tableRow}>
//               <Text style={[styles.tableCell, styles.highlightedCell, { width: 120 }]}>{stock.LOT_NO || 'N/A'}</Text>
//               <Text style={[styles.tableCell, styles.highlightedCell, { width: 100 }]}>{formatQuantity(stock.AVAILABLE_QTY)}</Text>
//               <Text style={[styles.tableCell, { width: 100 }]}>{stock.FK_UNIT_ID || 'N/A'}</Text>
//               <Text style={[styles.tableCell, { width: 120 }]}>{stock.BATCH_NO || 'N/A'}</Text>
//               <Text style={[styles.tableCell, { width: 100 }]}>{formatQuantity(stock.BOX_QUANTITY)}</Text>
//               <Text style={[styles.tableCell, { width: 150 }]}>{formatDate(stock.EXPIRY_DATE)}</Text>
//             </View>
//           ))}
//         </ScrollView>
//       </View>
//     </ScrollView>
//   );

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#0066CC" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity
//           style={styles.retryButton}
//           onPress={() => fetchStockDetails()}
//         >
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.mainContainer}>
//       <View style={styles.headerContainer}>
//         <View style={styles.searchContainer}>
//           <Search size={20} color="#6B7280" style={styles.searchIcon} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search in all fields..."
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             placeholderTextColor="#6B7280"
//           />
//         </View>
//         <View style={styles.toggleContainer}>
//           <TouchableOpacity
//             style={[styles.toggleButton, !isTableView && styles.toggleButtonActive]}
//             onPress={() => setIsTableView(false)}
//           >
//             <Grid size={20} color={!isTableView ? "#FFFFFF" : "#0066CC"} />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.toggleButton, isTableView && styles.toggleButtonActive]}
//             onPress={() => setIsTableView(true)}
//           >
//             <Table size={20} color={isTableView ? "#FFFFFF" : "#0066CC"} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {isTableView ? renderTableView() : renderCardView()}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   headerContainer: {
//     backgroundColor: '#FFFFFF',
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   searchContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     marginRight: 12,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     fontSize: 14,
//     color: '#1F2937',
//   },
//   toggleContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//     padding: 4,
//   },
//   toggleButton: {
//     padding: 8,
//     borderRadius: 6,
//     marginHorizontal: 2,
//   },
//   toggleButtonActive: {
//     backgroundColor: '#0066CC',
//   },
//   container: {
//     flex: 1,
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   stockCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     margin: 8,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     overflow: 'hidden',
//   },
//   stockHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#E8F4FF',
//   },
//   stockBasicInfo: {
//     flex: 1,
//   },
//   lotNumber: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#0066CC',
//     marginBottom: 4,
//   },
//   quantity: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#0066CC',
//   },
//   expandedDetails: {
//     padding: 16,
//     backgroundColor: '#FFFFFF',
//   },
//   detailGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginHorizontal: -8,
//   },
//   detailCard: {
//     width: '50%',
//     padding: 8,
//   },
//   detailLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginBottom: 4,
//   },
//   detailValue: {
//     fontSize: 14,
//     color: '#1F2937',
//     fontWeight: '500',
//   },
//   // Table styles
//   tableHeader: {
//     flexDirection: 'row',
//     backgroundColor: '#E8F4FF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },

//     tableHeaderCell: {
//         padding: 12,
//         fontWeight: '600',
//         color: '#0066CC',
//         fontSize: 14,
//     },
//     tableRow: {
//         flexDirection: 'row',
//         borderBottomWidth: 1,
//         borderBottomColor: '#E5E7EB',
//         backgroundColor: '#FFFFFF',
//     },
//     tableCell: {
//         padding: 12,
//         fontSize: 14,
//         color: '#1F2937',
//     },
//     highlightedCell: {
//         color: '#0066CC',
//         fontWeight: '600',
//     },
//     errorContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//         backgroundColor: '#f8f9fa',
//     },
//     errorText: {
//         fontSize: 16,
//         color: '#dc3545',
//         textAlign: 'center',
//         marginBottom: 16,
//     },
//     retryButton: {
//         backgroundColor: '#0066CC',
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//         borderRadius: 8,
//         elevation: 2,
//     },
//     retryButtonText: {
//         color: '#ffffff',
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     noDataText: {
//         textAlign: 'center',
//         fontSize: 16,
//         color: '#6c757d',
//         padding: 20,
//     },
// });

// export default ItemDetailsExpanded;

import { RouteProp } from "@react-navigation/native";
import axios from "axios";
import { CreditCard, Grid, Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../../App";

const BACKEND_URL = "http://192.168.1.3:3000/sf";

// Keep existing interfaces
interface ItemDetails {
  DESCRIPTION: string;
  ITEM_CODE: string;
  ITEM_ID: number;
  ITEM_NAME: string;
  ITEM_SUB_CATEGORY_ID: number;
}

interface StockDetails {
  LOT_NO: string | null;
  // FK_UNIT_ID: number | null;
  ITEM_MARKS: string | null;
  VAKAL_NO: string | null;
  BATCH_NO: string | null;
  AVAILABLE_QTY: number | null;
  BOX_QUANTITY: number | null;
  EXPIRY_DATE: string | null;
  REMARKS: string | null;
  STATUS: string | null;
  UNIT_NAME: string | null;
}

interface APIResponse {
  input: { ItemID: number };
  output: {
    itemDetails: ItemDetails;
    stockDetails: StockDetails[];
  };
}

type ItemDetailsExpandedProps = {
  route: RouteProp<RootStackParamList, "ItemDetailsExpanded">;
};

const ItemDetailsExpanded: React.FC<ItemDetailsExpandedProps> = ({ route }) => {
  const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
  const [stockDetails, setStockDetails] = useState<StockDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTableView, setIsTableView] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const fetchStockDetails = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);

    try {
      const { ItemID } = route.params;
      const response = await axios.post<APIResponse>(
        `${BACKEND_URL}/getItemDetailsWithStock`,
        { ItemID },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 10000,
        }
      );
      console.log("Response received:", response.data);

      if (response.data?.output) {
        const { stockDetails } = response.data.output;
        if (!stockDetails || stockDetails.length === 0) {
          setError("No stock details available");
          setStockDetails([]);
        } else {
          setStockDetails(stockDetails);
          setError(null);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "An unexpected error occurred";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!route.params?.ItemID) {
      setError("Invalid item ID");
      setLoading(false);
      return;
    }
    fetchStockDetails();
  }, [route.params.ItemID]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStockDetails(false);
  };
  // Keep existing fetchStockDetails, useEffect, and other utility functions

  const fadeIn = (index: number) => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: index * 10,
      useNativeDriver: true,
    }).start();
  };

  // const formatDate = (dateString: string | null) => {
  //   if (!dateString) return 'N/A';
  //   try {
  //     return new Date(dateString).toLocaleDateString('en-US', {
  //       year: 'numeric',
  //       month: 'long',
  //       day: 'numeric'
  //     });
  //   } catch {
  //     return 'Null';
  //   }
  // };

  const formatDate = (dateString: string | null) => {
    if (!dateString || dateString === "null") return ""; // Return empty string instead of 'N/A'
    try {
      const date = new Date(dateString);
      // Check if date is invalid
      if (isNaN(date.getTime())) {
        return "";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return ""; // Return empty string instead of 'Null'
    }
  };

  const formatQuantity = (quantity: number | null) => {
    if (quantity === null) return "N/A";
    return quantity.toLocaleString();
  };

  const filteredStockDetails = stockDetails.filter((stock) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (stock.LOT_NO?.toString().toLowerCase().includes(searchLower) ?? false) ||
      (stock.UNIT_NAME?.toString().toLowerCase().includes(searchLower) ??
        false) ||
      (stock.BATCH_NO?.toString().toLowerCase().includes(searchLower) ??
        false) ||
      (stock.AVAILABLE_QTY?.toString().toLowerCase().includes(searchLower) ??
        false) ||
      (stock.BOX_QUANTITY?.toString().toLowerCase().includes(searchLower) ??
        false) ||
      (stock.EXPIRY_DATE?.toString().toLowerCase().includes(searchLower) ??
        false) ||
      (stock.STATUS?.toString().toLowerCase().includes(searchLower) ?? false) ||
      (stock.REMARKS?.toString().toLowerCase().includes(searchLower) ?? false)
    );
  });

  const renderCardView = () => (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {filteredStockDetails.map((stock, index) => (
        <Animated.View
          key={index}
          style={[
            styles.stockCard,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
          onLayout={() => fadeIn(index)}
        >
          {/* <View key={index} style={styles.stockCard}> */}
          <View style={styles.stockHeader}>
            <View style={styles.lotNoContainer}>
              <Text style={styles.lotNoLabel}>LOT NO : </Text>
              <View style={styles.lotNoValueContainer}>
                <Text style={styles.lotNoValue}>{stock.LOT_NO || "N/A"}</Text>
              </View>
            </View>
            {/* <View style={styles.quantityContainer}>
              <Text style={styles.quantityValue}>
                {formatQuantity(stock.AVAILABLE_QTY)}
              </Text>
              <Text style={styles.quantityLabel}>Avl. Quantity</Text>
            </View> */}
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Unit Name</Text>
                <Text style={styles.detailValue}>
                  {stock.UNIT_NAME || "N/A"}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Vakal No:</Text>
                <Text style={styles.detailValue}>
                  {stock.VAKAL_NO || "N/A"}
                </Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Item Marks</Text>
                <Text style={styles.detailValue}>
                  {stock.ITEM_MARKS || "N/A"}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Batch No</Text>
                <Text style={styles.detailValue}>
                  {stock.BATCH_NO || "N/A"}
                </Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>AVAILABLE Quantity</Text>
                <Text style={styles.detailValue}>
                  {formatQuantity(stock.AVAILABLE_QTY)}
                </Text>
              </View>
              <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Box Quantity</Text>
                <Text style={styles.detailValue}>
                  {formatQuantity(stock.BOX_QUANTITY)}
                </Text>
                
              </View>
            </View>
            <View style={styles.detailRow}>
            <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Expiry Date</Text>
                <Text style={styles.detailValue}>
                  {formatDate(stock.EXPIRY_DATE)}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Remarks</Text>
                <Text style={styles.detailValue}>{stock.REMARKS || "N/A"}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      ))}
    </ScrollView>
  );

  const renderTableView = () => (
    <ScrollView
      style={styles.container}
      horizontal={true}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: 120 }]}>Lot No</Text>          
          <Text style={[styles.tableHeaderCell, { width: 100 }]}>Quantity</Text>
          <Text style={[styles.tableHeaderCell, { width: 100 }]}>
            Unit Name
          </Text>
          <Text style={[styles.tableHeaderCell, { width: 100 }]}>Vakal No</Text>
          <Text style={[styles.tableHeaderCell, { width: 100 }]}>Item Marks</Text>
          <Text style={[styles.tableHeaderCell, { width: 120 }]}>Batch No</Text>
          <Text style={[styles.tableHeaderCell, { width: 100 }]}>Available Qty</Text>
          <Text style={[styles.tableHeaderCell, { width: 100 }]}>Box Qty</Text>
          <Text style={[styles.tableHeaderCell, { width: 150 }]}>
            Expiry Date
          </Text>
          <Text style={[styles.tableHeaderCell, { width: 100 }]}>Remarks</Text>
        </View>
        <ScrollView>
          {filteredStockDetails.map((stock, index) => (
            //   <View key={index} style={styles.tableRow}>
            //     <Text style={[styles.tableCell, styles.lotNoTableCell, { width: 120 }]}>
            //       {stock.LOT_NO || 'N/A'}
            //     </Text>
            //     <Text style={[styles.tableCell, styles.quantityTableCell, { width: 100 }]}>
            //       {formatQuantity(stock.AVAILABLE_QTY)}
            //     </Text>
            //     <Text style={[styles.tableCell, { width: 100 }]}>{stock.UNIT_NAME || 'N/A'}</Text>
            //     <Text style={[styles.tableCell, { width: 120 }]}>{stock.BATCH_NO || 'N/A'}</Text>
            //     <Text style={[styles.tableCell, { width: 100 }]}>{formatQuantity(stock.BOX_QUANTITY)}</Text>
            //     <Text style={[styles.tableCell, { width: 150 }]}>{formatDate(stock.EXPIRY_DATE)}</Text>
            //     <Text style={[styles.tableCell, { width: 100 }]}>{stock.STATUS || 'N/A'}</Text>
            //   </View>

            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCellContainer, { width: 120 }]}>
                <Text style={[styles.tableCell, styles.lotNoTableCell]}>
                  {stock.LOT_NO || "N/A"}
                </Text>
              </View>
              <View style={[styles.tableCellContainer, { width: 100 }]}>
                <Text style={[styles.tableCell, styles.quantityTableCell]}>
                  {formatQuantity(stock.AVAILABLE_QTY)}
                </Text>
              </View>
              <View style={[styles.tableCellContainer, { width: 100 }]}>
                <Text style={styles.tableCell}>{stock.UNIT_NAME || "N/A"}</Text>
              </View>
              <View style={[styles.tableCellContainer, { width: 100 }]}>
                <Text style={styles.tableCell}>{stock.VAKAL_NO || "N/A"}</Text>
              </View>
              <View style={[styles.tableCellContainer, { width: 100 }]}>
                <Text style={styles.tableCell}>{stock.ITEM_MARKS || "N/A"}</Text>
              </View>
              <View style={[styles.tableCellContainer, { width: 120 }]}>
                <Text style={styles.tableCell}>{stock.BATCH_NO || "N/A"}</Text>
              </View>
              <View style={[styles.tableCellContainer, { width: 100 }]}>
                <Text style={styles.tableCell}>
                  {formatQuantity(stock.AVAILABLE_QTY)}
                </Text>
              </View>
              <View style={[styles.tableCellContainer, { width: 100 }]}>
                <Text style={styles.tableCell}>
                  {formatQuantity(stock.BOX_QUANTITY)}
                </Text>
              </View>
              <View style={[styles.tableCellContainer, { width: 150 }]}>
                <Text style={styles.tableCell}>
                  {formatDate(stock.EXPIRY_DATE)}
                </Text>
              </View>
              <View style={[styles.tableCellContainer, { width: 100 }]}>
                <Text style={styles.tableCell}>{stock.REMARKS || "N/A"}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchStockDetails()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by LotNo..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#6B7280"
          />
        </View>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !isTableView && styles.toggleButtonActive,
            ]}
            onPress={() => setIsTableView(false)}
          >
            <CreditCard size={23} color={!isTableView ? "#F48221" : "#F48221"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              isTableView && styles.toggleButtonActive,
            ]}
            onPress={() => setIsTableView(true)}
          >
            <Grid size={23} color={isTableView ? "#007bff" : "#007bff"} />
          </TouchableOpacity>
        </View>
      </View>

      {isTableView ? renderTableView() : renderCardView()}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: "#1F2937",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  toggleButtonActive: {
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  stockCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    margin: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stockHeader: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 5,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },
  lotNoContainer: {
    flex: 1,
    flexDirection: "row",
  },
  lotNoLabel: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    alignSelf: "center",
  },
  quantityContainer: {
    alignItems: "flex-end",
  },

  quantityLabel: {
    color: "black",
    fontSize: 12,
    marginTop: 4,
  },

  detailItem: {
    flex: 1,
    marginHorizontal: 8,
    rowGap:-5
  },
  detailLabel: {
    color: "#F48221",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  detailValue: {
    color: "#1F2937",
    fontSize: 14,
    fontWeight: "500",
    
  },

  lotNoTableCell: {
    color: "#F48221",
    fontWeight: "700",
  },
  quantityTableCell: {
    color: "black",
    fontWeight: "600",
  },
  // Keep existing error and loading styles
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff5733",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  lotNoValueContainer: {
    backgroundColor: "#F48221",
    borderRadius: 4, // Reduced from 6
    padding: 6, // Reduced from 8
    width: "20%", // Reduced from 40%
  },
  lotNoValue: {
    color: "#FFFFFF",
    fontSize: 16, // Reduced from 16
    fontWeight: "700",
    textAlign: "center",
  },
  quantityValue: {
    color: "black",
    fontSize: 18, // Reduced from 20
    fontWeight: "700",
  },
  detailsContainer: {
    padding: 8,
    paddingTop: 4,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12, // Reduced from 16
  },
  // Table view enhancements
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1a73e8", // More professional blue
    borderWidth: 1,
    borderColor: "#dadce0",
  },
  tableHeaderCell: {
    padding: 10,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    borderRightWidth: 1,
    borderRightColor: "#4285f4",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#dadce0",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#dadce0",
    backgroundColor: "#FFFFFF",
  },
  tableCell: {
    padding: 10,
    fontSize: 13,
    color: "#1F2937",
    borderRightWidth: 2,
    borderRightColor: "#dadce0",
  },
  tableCellContainer: {
    borderRightWidth: 1,
    borderRightColor: "#dadce0",
    justifyContent: "center",
  },
});

export default ItemDetailsExpanded;
