// import { RouteProp, useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import {
//     ActivityIndicator,
//     RefreshControl,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View
// } from 'react-native';
// import { RootStackParamList } from '../../App';

// const BACKEND_URL = "http://192.168.1.3:3000/sf";

// interface ItemDetails {
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

// type ItemDetailsExpandedRouteProp = RouteProp<RootStackParamList, 'ItemDetailsExpanded'>;

// interface ItemDetailsExpandedProps {
//   route: ItemDetailsExpandedRouteProp;
// }

// const ItemDetailsExpanded: React.FC<ItemDetailsExpandedProps> = ({ route }) => {
//   const navigation = useNavigation();
//   const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchItemDetails = async (showLoader = true) => {
//     if (showLoader) setLoading(true);
//     setError(null);

//     try {

//         console.log(itemId);
//       const payload = {
//         itemId: route.params.itemId // Assuming you're passing itemId in route params
//       };

//       const response = await axios.post(
//         `${BACKEND_URL}/getItemDetailsWithStock`,
//         payload,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           },
//           timeout: 10000
//         }
//       );

//       if (response.data?.output?.details) {
//         setItemDetails(response.data.output.details);
//       } else {
//         setError('No details available');
//         setItemDetails(null);
//       }
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         const errorMessage = err.response?.data?.message || err.message;
//         setError(`Error: ${errorMessage}`);
//       } else {
//         setError('Unexpected error occurred');
//       }
//       setItemDetails(null);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     if (!route.params?.itemId) {
//       setError('Invalid item ID');
//       setLoading(false);
//       return;
//     }
//     fetchItemDetails();
//   }, [route.params.itemId]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchItemDetails(false);
//   };

//   const renderDetailItem = (label: string, value: any) => (
//     <View style={styles.detailItem}>
//       <Text style={styles.detailLabel}>{label}:</Text>
//       <Text style={styles.detailValue}>
//         {value === null ? 'Not Available' : value.toString()}
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
//           onPress={() => fetchItemDetails()}
//         >
//           <Text style={styles.retryButtonText}>Try Again</Text>
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
//       <View style={styles.card}>
//         <Text style={styles.cardHeader}>Item Details</Text>
//         {itemDetails && (
//           <>
//             {renderDetailItem('Lot Number', itemDetails.LOT_NO)}
//             {renderDetailItem('Unit ID', itemDetails.FK_UNIT_ID)}
//             {renderDetailItem('Item Marks', itemDetails.ITEM_MARKS)}
//             {renderDetailItem('Vakal Number', itemDetails.VAKAL_NO)}
//             {renderDetailItem('Batch Number', itemDetails.BATCH_NO)}
//             {renderDetailItem('Available Quantity', itemDetails.AVAILABLE_QTY)}
//             {renderDetailItem('Box Quantity', itemDetails.BOX_QUANTITY)}
//             {renderDetailItem('Expiry Date', itemDetails.EXPIRY_DATE)}
//             {renderDetailItem('Remarks', itemDetails.REMARKS)}
//             {renderDetailItem('Status', itemDetails.STATUS)}
//           </>
//         )}
//       </View>
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
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
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
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   detailItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e9ecef',
//   },
//   detailLabel: {
//     fontSize: 16,
//     color: '#495057',
//     fontWeight: '600',
//     flex: 1,
//   },
//   detailValue: {
//     fontSize: 16,
//     color: '#6c757d',
//     flex: 1,
//     textAlign: 'right',
//   },
// });

// export default ItemDetailsExpanded;

// import { RouteProp, useNavigation } from '@react-navigation/native';
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

// // Interface for the API response
// interface ItemDetails {
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

// // Route params type
// type ItemDetailsExpandedRouteProp = RouteProp<RootStackParamList, 'ItemDetailsExpanded'>;

// interface ItemDetailsExpandedProps {
//   route: ItemDetailsExpandedRouteProp;
// }

// const ItemDetailsExpanded: React.FC<ItemDetailsExpandedProps> = ({ route }) => {
//   const navigation = useNavigation();
//   const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const itemId = route.params?.itemId;

//   useEffect(() => {
//     // Validate itemId before making the API call
//     if (typeof itemId !== 'number' || isNaN(itemId)) {
//       setError('Invalid item ID: ID must be a number');
//       setLoading(false);
//       return;
//     }

//     console.log('Fetching details for item ID:', itemId); // Debug log
//     fetchItemDetails();
//   }, [itemId]);

//   const fetchItemDetails = async (showLoader = true) => {
//     if (showLoader) setLoading(true);
//     setError(null);
    
//     try {
//       const { itemId } = route.params;
//       // console.log('Fetching details for item ID:', itemId);

//       const parsedItemId = parseInt(String(itemId), 10);
//       if (isNaN(parsedItemId)) {
//         throw new Error('Invalid item ID format');
//       }

//       const response = await axios.post(
//         `${BACKEND_URL}/getItemDetailsWithStock`,
//         { itemId :parsedItemId},
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           },
//           timeout: 10000
//         }
//       );

//       if (response.data?.output?.details) {
//         setItemDetails(response.data.output.details);
//       } else {
//         throw new Error('No details available');
//       }
//     } catch (err) {
//       console.error('Error fetching item details:', err);
//       if (axios.isAxiosError(err)) {
//         const errorMessage = err.response?.data?.message || err.message;
//         setError(`Error: ${errorMessage}`);
//       } else {
//         setError('An unexpected error occurred');
//       }
//       Alert.alert('Error', 'Failed to fetch item details. Please try again.');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     if (!route.params?.itemId) {
//       setError('Invalid item ID');
//       setLoading(false);
//       return;
//     }
//     fetchItemDetails();
//   }, [route.params.itemId]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchItemDetails(false);
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
//       return dateString;
//     }
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
//           onPress={() => fetchItemDetails()}
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
//       <View style={styles.card}>
//         <Text style={styles.cardHeader}>Item Details</Text>
//         {itemDetails && (
//           <>
//             {renderDetailItem('Lot Number', itemDetails.LOT_NO)}
//             {renderDetailItem('Unit ID', itemDetails.FK_UNIT_ID)}
//             {renderDetailItem('Item Marks', itemDetails.ITEM_MARKS)}
//             {renderDetailItem('Vakal Number', itemDetails.VAKAL_NO)}
//             {renderDetailItem('Batch Number', itemDetails.BATCH_NO)}
//             {renderDetailItem('Available Quantity', itemDetails.AVAILABLE_QTY)}
//             {renderDetailItem('Box Quantity', itemDetails.BOX_QUANTITY)}
//             {renderDetailItem('Expiry Date', itemDetails.EXPIRY_DATE, formatDate)}
//             {renderDetailItem('Remarks', itemDetails.REMARKS)}
//             {renderDetailItem('Status', itemDetails.STATUS)}
//           </>
//         )}
//       </View>
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
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   detailItem: {
//     paddingVertical: 12,
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
// });

// export default ItemDetailsExpanded;

import { RouteProp, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { RootStackParamList } from '../../App';

const BACKEND_URL = "http://192.168.1.3:3000/sf";

interface StockDetails {
  LOT_NO: string | null;
  FK_UNIT_ID: number | null;
  ITEM_MARKS: string | null;
  VAKAL_NO: string | null;
  BATCH_NO: string | null;
  AVAILABLE_QTY: number | null;
  BOX_QUANTITY: number | null;
  EXPIRY_DATE: string | null;
  REMARKS: string | null;
  STATUS: string | null;
}

type ItemDetailsExpandedRouteProp = RouteProp<RootStackParamList, 'ItemDetailsExpanded'>;

interface ItemDetailsExpandedProps {
  route: ItemDetailsExpandedRouteProp;
}

const ItemDetailsExpanded: React.FC<ItemDetailsExpandedProps> = ({ route }) => {
  const navigation = useNavigation();
  const [stockDetails, setStockDetails] = useState<StockDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStockDetails = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    
    try {
      const { itemId } = route.params;
      console.log('Attempting to fetch details for item ID:', itemId);

      // Ensure itemId is a number
      const parsedItemId = parseInt(String(itemId), 10);
      if (isNaN(parsedItemId)) {
        throw new Error('Invalid item ID format');
      }

      // Log the request payload for debugging
      const requestPayload = { 
        itemId: parsedItemId,
        // Add any other required parameters your API expects
      };
      console.log('Request payload:', requestPayload);

      const response = await axios.post(
        `${BACKEND_URL}/getItemDetailsWithStock`,
        requestPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );

      // Log the response for debugging
      console.log('API Response:', response.data);

      if (response.data?.output?.details) {
        setStockDetails(response.data.output.details);
      } else {
        console.log('No details in response:', response.data);
        throw new Error('No stock details available in response');
      }
    } catch (err) {
      // Enhanced error logging
      if (axios.isAxiosError(err)) {
        console.error('Axios Error Details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          headers: err.response?.headers
        });
        
        const errorMessage = err.response?.data?.message || err.message;
        setError(`Error: ${errorMessage}`);
        
        // Show more detailed error in dev
        if (__DEV__) {
          Alert.alert(
            'Error Details',
            `Status: ${err.response?.status}\nMessage: ${errorMessage}\nData: ${JSON.stringify(err.response?.data)}`
          );
        } else {
          Alert.alert('Error', 'Failed to fetch stock details. Please try again.');
        }
      } else {
        console.error('Non-Axios Error:', err);
        setError('An unexpected error occurred');
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!route.params?.itemId) {
      setError('Invalid item ID');
      setLoading(false);
      return;
    }
    fetchStockDetails();
  }, [route.params.itemId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStockDetails(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not Available';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatQuantity = (quantity: number | null) => {
    if (quantity === null) return 'Not Available';
    return quantity.toLocaleString();
  };

  const renderDetailItem = (label: string, value: any, formatter?: (value: any) => string) => (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>
        {value === null 
          ? 'Not Available' 
          : formatter 
            ? formatter(value) 
            : value.toString()
        }
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.card}>
        <Text style={styles.cardHeader}>Stock Details</Text>
        {stockDetails && (
          <>
            {renderDetailItem('Lot Number', stockDetails.LOT_NO)}
            {renderDetailItem('Unit ID', stockDetails.FK_UNIT_ID)}
            {renderDetailItem('Item Marks', stockDetails.ITEM_MARKS)}
            {renderDetailItem('Vakal Number', stockDetails.VAKAL_NO)}
            {renderDetailItem('Batch Number', stockDetails.BATCH_NO)}
            {renderDetailItem('Available Quantity', stockDetails.AVAILABLE_QTY, formatQuantity)}
            {renderDetailItem('Box Quantity', stockDetails.BOX_QUANTITY, formatQuantity)}
            {renderDetailItem('Expiry Date', stockDetails.EXPIRY_DATE, formatDate)}
            {renderDetailItem('Remarks', stockDetails.REMARKS)}
            {renderDetailItem('Status', stockDetails.STATUS)}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
});

export default ItemDetailsExpanded;