// import React, { useEffect, useState } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   FlatList, 
//   ActivityIndicator, 
//   RefreshControl 
// } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import axios from 'axios';
// import { Ionicons } from '@expo/vector-icons';

// const BACKEND_URL = "http://192.168.43.4:3000/sf";

// interface OrderHistoryItem {
//   ORDER_ID: number;
//   LOT_NO: string;
//   ITEM_ID: number;
//   QUANTITY: number;
//   ORDER_DATE: string;
//   ITEM_NAME: string;
// }

// const OrderHistoryScreen: React.FC = () => {
//   const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchOrderHistory = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`${BACKEND_URL}/getOrderHistory`);
      
//       if (response.data.success) {
//         // Sort orders by most recent first
//         const sortedOrders = response.data.data.sort((a: { ORDER_DATE: string | number | Date; }, b: { ORDER_DATE: string | number | Date; }) => 
//           new Date(b.ORDER_DATE).getTime() - new Date(a.ORDER_DATE).getTime()
//         );
//         setOrderHistory(sortedOrders);
//         setError(null);
//       } else {
//         setError(response.data.message || 'Failed to fetch order history');
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message || 'An error occurred');
//     } finally {
//       setIsLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Use useFocusEffect to refetch when screen comes into focus
//   useFocusEffect(
//     React.useCallback(() => {
//       fetchOrderHistory();
//     }, [])
//   );

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchOrderHistory();
//   };

//   const renderOrderItem = ({ item }: { item: OrderHistoryItem }) => (
//     <View style={styles.orderItemContainer}>
//       <View style={styles.orderHeader}>
//         <Text style={styles.itemName} numberOfLines={1}>{item.ITEM_NAME}</Text>
//         <Text style={styles.orderDate}>{item.ORDER_DATE}</Text>
//       </View>
      
//       <View style={styles.orderDetails}>
//         <View style={styles.detailColumn}>
//           <DetailRow label="Order ID" value={item.ORDER_ID.toString()} />
//           <DetailRow label="Lot No" value={item.LOT_NO} />
//         </View>
//         <View style={styles.detailColumn}>
//           <DetailRow label="Item ID" value={item.ITEM_ID.toString()} />
//           <DetailRow label="Quantity" value={item.QUANTITY.toString()} highlighted />
//         </View>
//       </View>
//     </View>
//   );

//   const DetailRow = ({ label, value, highlighted = false }) => (
//     <View style={styles.detailRow}>
//       <Text style={styles.detailLabel}>{label}</Text>
//       <Text style={[styles.detailValue, highlighted && styles.highlightedValue]}>{value}</Text>
//     </View>
//   );

//   if (isLoading && !refreshing) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centerContainer}>
//         <Ionicons name="alert-circle-outline" size={50} color="#FF6B6B" />
//         <Text style={styles.errorText}>{error}</Text>
//         <Text onPress={fetchOrderHistory} style={styles.retryButton}>
//           Retry
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.headerText}>Order History</Text>
      
//       <FlatList
//         data={orderHistory}
//         renderItem={renderOrderItem}
//         keyExtractor={(item) => item.ORDER_ID.toString()}
//         ListEmptyComponent={
//           <View style={styles.centerContainer}>
//             <Text style={styles.emptyText}>No order history found</Text>
//           </View>
//         }
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#4CAF50']}
//             tintColor="#4CAF50"
//           />
//         }
//       />
//     </View>
//   );
// };

 
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 16,
//     backgroundColor: '#f5f5f5'
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   headerText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginTop: 16,
//     marginBottom: 16
//   },
//   orderItemContainer: {
//     marginBottom: 12,
//     borderRadius: 8,
//     backgroundColor: '#ffffff',
//     padding: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3
//   },
//   orderHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     flex: 1,
//     marginRight: 8
//   },
//   orderDate: {
//     fontSize: 12,
//     color: '#666'
//   },
//   orderDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between'
//   },
//   detailColumn: {
//     flex: 1
//   },
//   detailRow: {
//     marginBottom: 8
//   },
//   detailLabel: {
//     fontSize: 12,
//     color: '#777'
//   },
//   detailValue: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#333'
//   },
//   highlightedValue: {
//     color: '#FF5722'
//   },
//   errorText: {
//     color: '#FF6B6B',
//     marginTop: 16,
//     textAlign: 'center'
//   },
//   retryButton: {
//     color: '#4CAF50',
//     marginTop: 16,
//     fontWeight: '600'
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center'
//   }
// });

// export default OrderHistoryScreen;


import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl,
  Alert 
} from 'react-native';
import axios from 'axios';

// Define the structure of an order history item based on your data
interface OrderHistoryItem {
  ORDER_ID: number;
  LOT_NO: string | null;
  ITEM_NAME: string | null;
  ORDER_DATE: string;
  CUSTOMER_ID: number | null;
}

const BACKEND_URL = "http://192.168.1.37:3000/sf";

const OrderHistoryScreen: React.FC = () => {
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch order history from the backend
  const fetchOrderHistory = async () => {
    try {
      setIsLoading(true);
      
      // Make sure this matches your exact backend route
      const response = await axios.get(`${BACKEND_URL}/getOrderHistory`);
      
      if (response.data.success && response.data.data) {
        // Transform and sanitize the data
        const processedOrders = response.data.data.map((item: any) => ({
          ORDER_ID: item.ORDER_ID || 0,
          LOT_NO: item.LOT_NO || 'N/A',
          ITEM_NAME: item.ITEM_NAME || 'Unknown Item',
          ORDER_DATE: item.ORDER_DATE || 'Unknown Date',
          CUSTOMER_ID: item.CUSTOMER_ID || null
        }));

        // Sort orders by most recent first
        const sortedOrders = processedOrders.sort((a, b) => 
          new Date(b.ORDER_DATE).getTime() - new Date(a.ORDER_DATE).getTime()
        );

        setOrderHistory(sortedOrders);
      } else {
        // Handle case where no orders are found
        setOrderHistory([]);
        Alert.alert('No Orders', 'No order history found.');
      }
    } catch (error: any) {
      console.error('Error fetching order history:', error);
      Alert.alert('Error', 'Failed to fetch order history. Please try again.');
      setOrderHistory([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchOrderHistory();
  }, []);

  // Render individual order item
  const renderOrderItem = ({ item }: { item: OrderHistoryItem }) => (
    <View style={styles.orderItemContainer}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderIdText}>Order #{item.ORDER_ID}</Text>
        <Text style={styles.orderDateText}>{item.ORDER_DATE}</Text>
      </View>
      
      <View style={styles.orderDetails}>
        <Text style={styles.itemNameText}>
          {item.ITEM_NAME || 'No Item Name'}
        </Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Lot No:</Text>
          <Text style={styles.detailValue}>{item.LOT_NO || 'N/A'}</Text>
        </View>
        
        {item.CUSTOMER_ID && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Customer ID:</Text>
            <Text style={styles.detailValue}>{item.CUSTOMER_ID}</Text>
          </View>
        )}
      </View>
    </View>
  );

  // Render loading state
  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Order History...</Text>
      </View>
    );
  }

  // Render empty state
  if (orderHistory.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.emptyStateText}>No Order History Found</Text>
        <Text style={styles.emptyStateSubText}>Your orders will appear here</Text>
      </View>
    );
  }

  // Main render with order history list
  return (
    <View style={styles.container}>
      <FlatList
        data={orderHistory}
        keyExtractor={(item) => item.ORDER_ID.toString()}
        renderItem={renderOrderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchOrderHistory();
            }}
            colors={['#0000ff']}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  orderItemContainer: {
    backgroundColor: 'white',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDateText: {
    fontSize: 14,
    color: '#666',
  },
  orderDetails: {
    marginTop: 8,
  },
  itemNameText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});

export default OrderHistoryScreen;