// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

// interface OrderHistoryItem {
//   ORDER_ID: number;
//   LOT_NO: string;
//   ITEM_ID: number;
//   ITEM_NAME: string;
//   ORDER_DATE: string;
//   QUANTITY: number;
// }

// const BACKEND_URL = "http://192.168.1.3:3000/sf";
// const CUSTOMER_ID = "1279"; // You might want to pass this as a prop or get from context/store

// const OrderHistoryScreen: React.FC = () => {
//   const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchOrderHistory = async () => {
//     try {
//       setIsLoading(true);
//       const url = `${BACKEND_URL}/getOrderHistory/${CUSTOMER_ID}`;
//       console.log('Fetching from:', url);
      
//       // Add your authentication token here
//       const token = 'your-auth-token'; // Get this from your auth context/store
      
//       const response = await axios.get(url, {
//         timeout: 10000,
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}` // Add authentication header
//         }
//       });
      
//       console.log('Response:', response.data);
      
//       if (response.data.success && Array.isArray(response.data.data)) {
//         const processedOrders = response.data.data.map((item: OrderHistoryItem) => ({
//           ORDER_ID: item.ORDER_ID || 0,
//           LOT_NO: item.LOT_NO || 'N/A',
//           ITEM_ID: item.ITEM_ID || 0,
//           ITEM_NAME: item.ITEM_NAME || 'Unknown Item',
//           ORDER_DATE: item.ORDER_DATE || 'Unknown Date',
//           QUANTITY: item.QUANTITY || 1
//         }));

//         setOrderHistory(processedOrders);
//       } else {
//         console.log('No data or invalid format:', response.data);
//         setOrderHistory([]);
//         Alert.alert('No Orders', 'No order history found.');
//       }
//     } catch (error: any) {
//       console.error('Error details:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//         url: error.config?.url
//       });

//       let errorMessage = 'Failed to fetch order history. ';
//       if (error.response?.status === 401) {
//         errorMessage = 'Authentication error. Please log in again.';
//       } else if (error.response?.status === 404) {
//         errorMessage = 'No orders found for this customer.';
//       } else if (error.response) {
//         errorMessage += `Server error: ${error.response.status}`;
//       } else if (error.request) {
//         errorMessage += 'No response from server. Check server connection.';
//       } else {
//         errorMessage += error.message;
//       }

//       Alert.alert('Error', errorMessage);
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
//       return date.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       console.error('Date formatting error:', error);
//       return dateString;
//     }
//   };

//   const renderOrderItem = ({ item }: { item: OrderHistoryItem }) => {
//     return (
//       <View style={styles.tile}>
//         <View style={styles.tileHeader}>
//           <View style={styles.orderInfo}>
//             <Text style={styles.orderId}>#{item.ORDER_ID}</Text>
//             <Text style={styles.date}>{formatDate(item.ORDER_DATE)}</Text>
//           </View>
//         </View>

//         <View style={styles.tileBody}>
//           <View style={styles.itemInfo}>
//             <Text style={styles.itemName} numberOfLines={1}>
//               {item.ITEM_NAME}
//             </Text>
//             <View style={styles.quantityBadge}>
//               <Text style={styles.quantityText}>×{item.QUANTITY}</Text>
//             </View>
//           </View>

//           <View style={styles.details}>
//             <Text style={styles.detailText}>
//               Lot: <Text style={styles.detailValue}>{item.LOT_NO}</Text>
//             </Text>
//             <Text style={styles.dot}>•</Text>
//             <Text style={styles.detailText}>
//               Item ID: <Text style={styles.detailValue}>{item.ITEM_ID}</Text>
//             </Text>
//           </View>
//         </View>
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
//       <Text style={styles.header}>Order History</Text>
//       <FlatList
//         data={orderHistory}
//         keyExtractor={(item) => item.ORDER_ID.toString()}
//         renderItem={renderOrderItem}
//         contentContainerStyle={styles.list}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={() => {
//               setRefreshing(true);
//               fetchOrderHistory();
//             }}
//           />
//         }
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#0F172A',
//     padding: 16,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E2E8F0',
//   },
//   list: {
//     padding: 12,
//   },
//   tile: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     marginBottom: 8,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//   },
//   tileHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   orderInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   orderId: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#0F172A',
//     marginRight: 8,
//   },
//   date: {
//     fontSize: 13,
//     color: '#64748B',
//   },
//   tileBody: {
//     gap: 8,
//   },
//   itemInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   itemName: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#334155',
//     flex: 1,
//     marginRight: 8,
//   },
//   quantityBadge: {
//     backgroundColor: '#F1F5F9',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   quantityText: {
//     fontSize: 13,
//     fontWeight: '500',
//     color: '#475569',
//   },
//   details: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   detailText: {
//     fontSize: 13,
//     color: '#64748B',
//   },
//   detailValue: {
//     color: '#334155',
//     fontWeight: '500',
//   },
//   dot: {
//     fontSize: 13,
//     color: '#CBD5E1',
//     marginHorizontal: 6,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default OrderHistoryScreen;



import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

interface OrderHistoryItem {
  ORDER_ID: number;
  CUSTOMERID: string;
  ITEM_ID: number;
  ITEM_NAME: string;
  ORDER_DATE: string;
  QUANTITY: number;
  LOT_NO: string;
}

const BACKEND_URL = "http://192.168.1.3:3000/sf";
const CUSTOMER_ID = "1279"; // Replace or fetch dynamically

const OrderHistoryScreen: React.FC = () => {
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrderHistory = async () => {
    try {
      setIsLoading(true);
      const url = `${BACKEND_URL}/getOrderHistory/${CUSTOMER_ID}`;
      console.log('Fetching from:', url);

      const token = 'your-auth-token'; // Replace with actual token
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        setOrderHistory(response.data.data);
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
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const renderOrderItem = ({ item }: { item: OrderHistoryItem }) => (
    <View style={styles.tile}>
      <Text style={styles.orderId}>Order ID: {item.ORDER_ID}</Text>
      <Text>Customer ID: {item.CUSTOMERID}</Text>
      <Text>Item: {item.ITEM_NAME}</Text>
      <Text>Quantity: {item.QUANTITY}</Text>
      <Text>Lot No: {item.LOT_NO}</Text>
      <Text>Date: {formatDate(item.ORDER_DATE)}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0284C7" />
      </View>
    );
  }

  return (
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
        />
      }
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  tile: { padding: 16, marginBottom: 8, backgroundColor: '#fff', borderRadius: 8 },
  orderId: { fontWeight: 'bold' },
});

export default OrderHistoryScreen;
