// import React from 'react';
// import {
//   Dimensions,
//   Image,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';

// // Define the type for our item
// interface Item {
//   id: string;
//   code: string;
//   description: string;
//   name: string;

// }

// // Sample data
// const sampleItems: Item[] = [
//   {
//     id: '1',
//     code: 'ITEM001',
//     description: 'This is a sample item description',
//     name: 'Sample Item 1',

//   },
//   {
//     id: '2',
//     code: 'ITEM002',
//     description: 'Another sample item description',
//     name: 'Sample Item 2',

//   },
//   {
//     id: '2',
//     code: 'ITEM002',
//     description: 'Another sample item description',
//     name: 'Sample Item 2',

//   },
//   {
//     id: '2',
//     code: 'ITEM002',
//     description: 'Another sample item description',
//     name: 'Sample Item 2',

//   },
//   {
//     id: '2',
//     code: 'ITEM002',
//     description: 'Another sample item description',
//     name: 'Sample Item 2',

//   },
// ];

// const ItemDetailScreen: React.FC = () => {
//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView bounces={false}>
//         {/* Main Image Container with Overlay */}
//         <View style={styles.imageContainer}>
//           <Image
//             source={require('../../assets/images/SC14.jpg')} // Replace with your image
//             style={styles.mainImage}
//             resizeMode="cover"
//           />
//           <View style={styles.imageOverlay} />
//         </View>

//         {/* Cards Container */}
//         <View style={styles.cardsContainer}>
//           {sampleItems.map((item) => (
//             <View key={item.id} style={styles.card}>
//               {/* Item ID Row */}
//               <View style={styles.detailRow}>
//                 <View style={styles.labelValuePair}>
//                   <Text style={styles.label}>ITEM ID:</Text>
//                   <Text style={styles.value}>{item.id}</Text>
//                 </View>

//               </View>

//               <View style={styles.detailRow}>
//               <View style={styles.labelValuePair}>
//                   <Text style={styles.label}>ITEM CODE:</Text>
//                   <Text style={styles.value}>{item.code}</Text>
//                 </View>
//               </View>

//               {/* Description Row */}
//               <View style={styles.detailRow}>
//                 <View style={styles.labelValuePair}>
//                   <Text style={styles.label}>DESCRIPTION:</Text>
//                   <Text style={styles.value}>{item.description}</Text>
//                 </View>
//               </View>

//               {/* Item Name Row */}
//               <View style={styles.detailRow}>
//                 <View style={styles.labelValuePair}>
//                   <Text style={styles.label}>ITEM NAME:</Text>
//                   <Text style={styles.value}>{item.name}</Text>
//                 </View>
//               </View>
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const { width } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   imageContainer: {
//     width: '100%',
//     height: width * 0.3, // Aspect ratio 3:5
//     position: 'relative',
//     marginBottom: -20, // Overlap with cards
//   },
//   mainImage: {
//     // marginTop:20,
//     width: '100%',
//     height: '100%',
//   },
//   imageOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.1)', // Subtle overlay
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   cardsContainer: {
//     padding: 16,
//     paddingTop: 20,
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     marginBottom: 16,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     marginBottom: 12,
//     flexWrap: 'wrap',
//   },
//   labelValuePair: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 20,
//     flexShrink: 1,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#666',
//     marginRight: 8,
//   },
//   value: {
//     fontSize: 14,
//     color: '#333',
//     flexShrink: 1,
//   },
// });

// export default ItemDetailScreen;
// import React, { useEffect, useRef } from 'react';
// import {
//   Animated,
//   Image,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   View
// } from 'react-native';

// interface Item {
//   id: string;
//   code: string;
//   description: string;
//   name: string;
// }

// const sampleItems: Item[] = [
//   {
//     id: '1',
//     code: 'ITEM001',
//     description: 'This is a sample item description',
//     name: 'Sample Item 1',
//   },
//   {
//     id: '1',
//     code: 'ITEM001',
//     description: 'This is a sample item description',
//     name: 'Sample Item 1',
//   },
//   {
//     id: '1',
//     code: 'ITEM001',
//     description: 'This is a sample item description',
//     name: 'Sample Item 1',
//   },
//   {
//     id: '1',
//     code: 'ITEM001',
//     description: 'This is a sample item description',
//     name: 'Sample Item 1',
//   },
//   {
//     id: '1',
//     code: 'ITEM001',
//     description: 'This is a sample item description',
//     name: 'Sample Item 1',
//   },
// ];

// const ItemDetailScreen: React.FC = () => {
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.95)).current;
//   const imageSlideAnim = useRef(new Animated.Value(-50)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         tension: 15,
//         friction: 8,
//         useNativeDriver: true,
//       }),
//       Animated.spring(imageSlideAnim, {
//         toValue: 0,
//         tension: 15,
//         friction: 8,
//         useNativeDriver: true,
//       })
//     ]).start();
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* Wrapper for centering the image container */}
//         <View style={styles.centerWrapper}>
//           {/* Image Container with Animation */}
//           <Animated.View
//             style={[
//               styles.imageWrapper,
//               {
//                 opacity: fadeAnim,
//                 transform: [
//                   { translateX: imageSlideAnim },
//                   { scale: scaleAnim }
//                 ]
//               }
//             ]}
//           >
//             <Image
//               source={require('../../assets/images/SC32.jpg')}
//               style={styles.mainImage}
//               resizeMode="contain"
//             />
//           </Animated.View>
//         </View>

//         {/* Cards Container */}
//         <View style={styles.cardsContainer}>
//           {sampleItems.map((item, index) => (
//             <Animated.View
//               key={item.id}
//               style={[
//                 styles.card,
//                 {
//                   opacity: fadeAnim,
//                   transform: [{
//                     translateY: fadeAnim.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: [50 * (index + 1), 0],
//                     })
//                   }]
//                 }
//               ]}
//             >
//               <View style={styles.cardHeader}>
//                 <Text style={styles.cardTitle}>{item.name}</Text>
//               </View>

//               <View style={styles.detailRow}>
//                 <Text style={styles.label}>ITEM ID:</Text>
//                 <Text style={styles.value}>{item.id}</Text>
//               </View>

//               <View style={styles.detailRow}>
//                 <Text style={styles.label}>ITEM CODE:</Text>
//                 <Text style={styles.value}>{item.code}</Text>
//               </View>

//               <View style={styles.detailRow}>
//                 <Text style={styles.label}>DESCRIPTION:</Text>
//                 <Text style={styles.value}>{item.description}</Text>
//               </View>
//             </Animated.View>
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   scrollContent: {
//     paddingVertical: 15,
//   },
//   centerWrapper: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     width: '100%',
//   },
//   imageWrapper: {
//     width: '50%', // Match image width
//     height: 120,
//     borderRadius: 15,
//     overflow: 'hidden',
//     backgroundColor: '#fff',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//   },
//   mainImage: {
//     width: '100%',
//     height: '100%',
//   },
//   cardsContainer: {
//     padding: 20,
//     paddingTop: 10,
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     marginBottom: 15,
//     overflow: 'hidden',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },
//   cardHeader: {
//     backgroundColor: '#f8f9fa',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2196F3',
//   },
//   detailRow: {
//     flexDirection: 'row',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   label: {
//     width: 100,
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: 'black',
//     // fontWeight: "bold",
//   },
//   value: {
//     flex: 1,
//     fontSize: 14,
//     color: '#333',
//   },
// });

// export default ItemDetailScreen;

// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Image,
//   RefreshControl,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { getImage } from '../utils/imageLoader';

// const BACKEND_URL = 'http://192.168.1.3:3000';

// interface StockDetail {
//   balanceQty: number;
//   availableQty: number;
//   boxQuantity: number;
//   batchNo: string;
//   expiryDate: string;
// }

// interface Item {
//   itemId: number;
//   itemCode: string;
//   itemName: string;
//   description: string;
//   subcategoryId: string;
//   stock: StockDetail[];
// }

// interface ItemListScreenProps {
//   route: {
//     params: {
//       subcategoryId: string;
//       subcategoryName: string;
//       subcatImgFile: string;
//     };
//   };
// }

// const ItemDetailScreen: React.FC<ItemListScreenProps> = ({ route }) => {
//   const navigation = useNavigation();
//   const [items, setItems] = useState<Item[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchItems = async (showLoader = true) => {
//     if (showLoader) setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post(`${BACKEND_URL}/getItemsBySubCategory`, {
//         subcategoryId: route.params.subcategoryId
//       });

//       if (response.data.success && response.data.data) {
//         setItems(response.data.data);
//       } else {
//         setError(response.data.message || 'Failed to fetch items');
//       }
//     } catch (err) {
//       console.error('Error fetching items:', err);

//       if (axios.isAxiosError(err)) {
//         if (err.response?.status === 404) {
//           setError('No items found for this subcategory');
//         } else if (!err.response) {
//           setError('Network error. Please check your connection and server status.');
//           Alert.alert(
//             'Connection Error',
//             'Unable to connect to the server. Please check if the server is running and try again.',
//             [{ text: 'OK' }]
//           );
//         } else {
//           setError(`Error: ${err.response.data.message || 'Something went wrong'}`);
//         }
//       } else {
//         setError('An unexpected error occurred');
//       }
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchItems();
//   }, [route.params.subcategoryId]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchItems(false);
//   };

//   const renderStockInfo = (stock: StockDetail[]) => {
//     if (!stock || stock.length === 0) return null;

//     return (
//       <View style={styles.stockContainer}>
//         {stock.map((stockItem, index) => (
//           <View key={index} style={styles.stockItem}>
//             <Text style={styles.stockText}>
//               Batch: {stockItem.batchNo} | Available: {stockItem.availableQty}
//             </Text>
//             <Text style={styles.stockText}>
//               Expires: {new Date(stockItem.expiryDate).toLocaleDateString()}
//             </Text>
//           </View>
//         ))}
//       </View>
//     );
//   };

//   const renderItem = ({ item }: { item: Item }) => (
//     <View style={styles.itemCard}>
//       <View style={styles.itemHeader}>
//         <Text style={styles.itemCode}>{item.itemCode}</Text>
//         <Text style={styles.itemName}>{item.itemName}</Text>
//       </View>
//       <Text style={styles.description}>{item.description}</Text>
//       {renderStockInfo(item.stock)}
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>{route.params.subcategoryName}</Text>
//         {route.params.subcatImgFile && (
//           <Image
//             source={getImage(route.params.subcatImgFile)}
//             style={styles.headerImage}
//             resizeMode="contain"
//           />
//         )}
//       </View>

//       <FlatList
//         data={items}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.itemId.toString()}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>
//               {error || 'No items found'}
//             </Text>
//             <TouchableOpacity
//               style={styles.retryButton}
//               onPress={() => fetchItems()}
//             >
//               <Text style={styles.retryButtonText}>Refresh</Text>
//             </TouchableOpacity>
//           </View>
//         }
//         contentContainerStyle={styles.listContainer}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     backgroundColor: 'white',
//     padding: 15,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     alignItems: 'center',
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   headerImage: {
//     width: 100,
//     height: 60,
//     marginTop: 5,
//   },
//   listContainer: {
//     padding: 10,
//     flexGrow: 1,
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   itemCard: {
//     backgroundColor: 'white',
//     margin: 8,
//     padding: 15,
//     borderRadius: 8,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   itemHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   itemCode: {
//     fontSize: 14,
//     color: '#666',
//     flex: 1,
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     flex: 2,
//   },
//   description: {
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 10,
//   },
//   stockContainer: {
//     marginTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//     paddingTop: 8,
//   },
//   stockItem: {
//     marginVertical: 4,
//   },
//   stockText: {
//     fontSize: 13,
//     color: '#666',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   retryButton: {
//     backgroundColor: '#007AFF',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 5,
//   },
//   retryButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });

// export default ItemDetailScreen;

// import { RouteProp, useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   FlatList,
//   Image,
//   RefreshControl,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { RootStackParamList } from '../../App';
// import { getImage } from '../utils/imageLoader';

// const BACKEND_URL = "http://192.168.1.3:3000/sf";

// interface Item {
//   ITEM_ID: number;
//   ITEM_CODE: string;
//   DESCRIPTION: string;
//   ITEM_NAME: string;
//   BALANCE_QTY_SUM: number;
// }

// type ItemDetailScreenRouteProp = RouteProp<RootStackParamList, 'ItemDetailScreen'>;

// interface ItemDetailScreenProps {
//   route: ItemDetailScreenRouteProp;
// }

// const ItemDetailScreen: React.FC<ItemDetailScreenProps> = ({ route }) => {
//   const navigation = useNavigation();
//   const [items, setItems] = useState<Item[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchItems = async (showLoader = true) => {
//     if (showLoader) setLoading(true);
//     setError(null);

//     try {
//       // Log the subcategory ID we're trying to fetch
//       console.log('Attempting to fetch items for subcategory ID:', route.params.subcategoryId);

//       // Create the request payload
//       const payload = {
//         SubCategoryID: route.params.subcategoryId // Send as is, without Number()
//       };

//       console.log('Request payload:', JSON.stringify(payload, null, 2));

//       const response = await axios.post(
//         `${BACKEND_URL}/getItemsBySubCategory`,
//         payload,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           },
//           timeout: 10000 // 10 second timeout
//         }
//       );

//       console.log('Response status:', response.status);
//       console.log('Response data:', JSON.stringify(response.data, null, 2));

//       // Check if we have items in the response
//       if (response.data?.output?.items) {
//         console.log('Found items:', response.data.output.items.length);
//         setItems(response.data.output.items);
//       } else {
//         console.log('No items found in response');
//         setError('No items available');
//         setItems([]);
//       }
//     } catch (err) {
//       console.error('Detailed error information:');
//       if (axios.isAxiosError(err)) {
//         console.error('Request URL:', err.config?.url);
//         console.error('Request Method:', err.config?.method);
//         console.error('Request Headers:', err.config?.headers);
//         console.error('Request Data:', err.config?.data);
//         console.error('Response Status:', err.response?.status);
//         console.error('Response Data:', err.response?.data);

//         const errorMessage = err.response?.data?.message || err.message;
//         setError(`Error: ${errorMessage}`);
//       } else {
//         console.error('Non-Axios error:', err);
//         setError('Unexpected error occurred');
//       }
//       setItems([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Add error boundary
//   useEffect(() => {
//     if (!route.params?.subcategoryId) {
//       console.error('No subcategoryId provided in route params');
//       setError('Invalid subcategory ID');
//       setLoading(false);
//       return;
//     }
//     fetchItems();
//   }, [route.params.subcategoryId]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchItems(false);
//   };

//   const renderItem = ({ item }: { item: Item }) => (
//     <TouchableOpacity
//       style={styles.itemCard}
//       onPress={() => {
//         // Handle item selection if needed
//       }}
//     >
//       <View style={styles.itemHeader}>
//         {/* <Text style={styles.itemCode}>{item.ITEM_CODE}</Text> */}
//       </View>
//       <Text style={styles.itemName}>{item.ITEM_NAME}</Text>
//       <Text style={styles.balance_qty}>{item.BALANCE_QTY_SUM}</Text>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>
//           {route.params.subcategoryName} (ID: {route.params.subcategoryId})
//         </Text>
//         {route.params.subcatImgFile && (
//           <Image
//             source={getImage(route.params.subcatImgFile)}
//             style={styles.headerImage}
//             resizeMode="contain"
//           />
//         )}
//       </View>

//       <FlatList
//         data={items}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.ITEM_ID.toString()}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>
//               {error || 'No items found'}
//             </Text>
//             <TouchableOpacity
//               style={styles.retryButton}
//               onPress={() => fetchItems()}
//             >
//               <Text style={styles.retryButtonText}>Try Again</Text>
//             </TouchableOpacity>
//           </View>
//         }
//         contentContainerStyle={styles.listContainer}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   headerImage: {
//     width: 40,
//     height: 40,
//   },
//   itemCard: {
//     padding: 16,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   itemHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   itemCode: {
//     fontSize: 14,
//     color: '#666',
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   description: {
//     fontSize: 14,
//     color: '#666',
//   },
//   balance_qty:{
//     fontSize: 14,
//     color: '#666',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   retryButton: {
//     padding: 12,
//     backgroundColor: '#007AFF',
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   listContainer: {
//     flexGrow: 1,
//   },
// });

// export default ItemDetailScreen;

// import { RouteProp, useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Animated,
//   Dimensions,
//   FlatList,
//   Image,
//   RefreshControl,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { RootStackParamList } from '../../App';
// import { getImage } from '../utils/imageLoader';

// const BACKEND_URL = "http://192.168.1.3:3000/sf";
// const { width } = Dimensions.get('window');

// interface Item {
//   ITEM_ID: number;
//   ITEM_CODE: string;
//   DESCRIPTION: string;
//   ITEM_NAME: string;
//   BALANCE_QTY_SUM: number;
// }

// type ItemDetailScreenRouteProp = RouteProp<RootStackParamList, 'ItemDetailScreen'>;

// interface ItemDetailScreenProps {
//   route: ItemDetailScreenRouteProp;
// }

// const ItemDetailScreen: React.FC<ItemDetailScreenProps> = ({ route }) => {
//   const navigation = useNavigation();
//   const [items, setItems] = useState<Item[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchItems = async (showLoader = true) => {
//     if (showLoader) setLoading(true);
//     setError(null);

//     try {
//       console.log('Attempting to fetch items for subcategory ID:', route.params.subcategoryId);

//       const payload = {
//         SubCategoryID: route.params.subcategoryId
//       };

//       const response = await axios.post(
//         `${BACKEND_URL}/getItemsBySubCategory`,
//         payload,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           },
//           timeout: 10000
//         }
//       );

//       if (response.data?.output?.items) {
//         setItems(response.data.output.items);
//       } else {
//         setError('No items available');
//         setItems([]);
//       }
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         const errorMessage = err.response?.data?.message || err.message;
//         setError(`Error: ${errorMessage}`);
//       } else {
//         setError('Unexpected error occurred');
//       }
//       setItems([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     if (!route.params?.subcategoryId) {
//       setError('Invalid subcategory ID');
//       setLoading(false);
//       return;
//     }
//     fetchItems();
//   }, [route.params.subcategoryId]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchItems(false);
//   };

//   const renderItem = ({ item, index }: { item: Item; index: number }) => {
//     const scaleAnim = new Animated.Value(1);

//     const onPressIn = () => {
//       Animated.spring(scaleAnim, {
//         toValue: 0.95,
//         useNativeDriver: true,
//       }).start();
//     };

//     const onPressOut = () => {
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         useNativeDriver: true,
//       }).start();
//     };

//     return (
//       <Animated.View
//         style={[
//           styles.itemCard,
//           {
//             transform: [{ scale: scaleAnim }],
//           },
//         ]}
//       >
//         <TouchableOpacity
//           onPressIn={onPressIn}
//           onPressOut={onPressOut}
//           activeOpacity={1}
//         >
//           <View style={styles.itemContent}>
//             <View style={styles.itemMainInfo}>
//               <Text style={styles.itemName}>{item.ITEM_NAME}</Text>
//               {/* <Text style={styles.itemCode}>Code: {item.ITEM_CODE}</Text> */}
//               <Text style={styles.description}>{item.DESCRIPTION}</Text>
//               <View style={styles.quantityContainer}>
//                 <Text style={styles.quantityLabel}>Balance Quantity : </Text>
//                 <Text style={styles.quantityValue}>{item.BALANCE_QTY_SUM}</Text>
//               </View>
//             </View>

//             <View style={styles.itemRightSection}>
//               <TouchableOpacity
//                 style={styles.cartIcon}
//                 onPress={() => {
//                   // Handle add to cart
//                   console.log('Add to cart:', item.ITEM_ID);
//                 }}
//               >

//                 <Text style={styles.cartIconText}>🛒</Text>
//                 {/* <Text style={styles.cartIconText}>Add</Text> */}
//               </TouchableOpacity>
// {/*
//               <View style={styles.quantityContainer}>
//                 <Text style={styles.quantityLabel}>Balance. Qty</Text>
//                 <Text style={styles.quantityValue}>{item.BALANCE_QTY_SUM}</Text>
//               </View> */}
//             </View>
//           </View>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.headerContent}>
//           <Text style={styles.headerText}>
//             {route.params.subcategoryName}
//           </Text>
//           <Text style={styles.subHeaderText}>
//             ID: {route.params.subcategoryId}
//           </Text>
//         </View>
//         {route.params.subcatImgFile && (
//           <Image
//             source={getImage(route.params.subcatImgFile)}
//             style={styles.headerImage}
//             resizeMode="contain"
//           />
//         )}
//       </View>

//       <FlatList
//         data={items}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.ITEM_ID.toString()}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>
//               {error || 'No items found'}
//             </Text>
//             <TouchableOpacity
//               style={styles.retryButton}
//               onPress={() => fetchItems()}
//             >
//               <Text style={styles.retryButtonText}>Try Again</Text>
//             </TouchableOpacity>
//           </View>
//         }
//         contentContainerStyle={styles.listContainer}
//       />
//     </View>
//   );
// };

// import { RouteProp, useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Animated,
//   Dimensions,
//   FlatList,
//   Image,
//   RefreshControl,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { RootStackParamList } from '../../App';
// import { getImage } from '../utils/imageLoader';

// const BACKEND_URL = "http://192.168.1.3:3000/sf";
// const { width } = Dimensions.get('window');

// interface Item {
//   ITEM_ID: number;
//   ITEM_CODE: string;
//   DESCRIPTION: string;
//   ITEM_NAME: string;
//   BALANCE_QTY_SUM: number;
// }

// type ItemDetailScreenRouteProp = RouteProp<RootStackParamList, 'ItemDetailScreen'>;

// interface ItemDetailScreenProps {
//   route: ItemDetailScreenRouteProp;
// }

// const ItemDetailScreen: React.FC<ItemDetailScreenProps> = ({ route }) => {
//   const navigation = useNavigation();
//   const [items, setItems] = useState<Item[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [cartAnimations, setCartAnimations] = useState<{ [key: number]: Animated.Value }>({});

//   // Initialize cart animations for each item
//   useEffect(() => {
//     const animations: { [key: number]: Animated.Value } = {};
//     items.forEach(item => {
//       animations[item.ITEM_ID] = new Animated.Value(0);
//     });
//     setCartAnimations(animations);
//   }, [items]);

//   const fetchItems = async (showLoader = true) => {
//     if (showLoader) setLoading(true);
//     setError(null);

//     try {
//       console.log('Attempting to fetch items for subcategory ID:', route.params.subcategoryId);

//       const payload = {
//         SubCategoryID: route.params.subcategoryId
//       };

//       const response = await axios.post(
//         `${BACKEND_URL}/getItemsBySubCategory`,
//         payload,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           },
//           timeout: 10000
//         }
//       );

//       if (response.data?.output?.items) {
//         setItems(response.data.output.items);
//       } else {
//         setError('No items available');
//         setItems([]);
//       }
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         const errorMessage = err.response?.data?.message || err.message;
//         setError(`Error: ${errorMessage}`);
//       } else {
//         setError('Unexpected error occurred');
//       }
//       setItems([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     if (!route.params?.subcategoryId) {
//       setError('Invalid subcategory ID');
//       setLoading(false);
//       return;
//     }
//     fetchItems();
//   }, [route.params.subcategoryId]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchItems(false);
//   };

//   const handleAddToCart = (itemId: number) => {
//     // Trigger the add to cart animation
//     Animated.sequence([
//       Animated.timing(cartAnimations[itemId], {
//         toValue: 1,
//         duration: 200,
//         useNativeDriver: true,
//       }),
//       Animated.timing(cartAnimations[itemId], {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: true,
//       })
//     ]).start();

//     // Handle add to cart logic here
//     console.log('Add to cart:', itemId);
//   };

//   const renderItem = ({ item, index }: { item: Item; index: number }) => {
//     const scaleAnim = new Animated.Value(1);

//     const onPressIn = () => {
//       Animated.spring(scaleAnim, {
//         toValue: 0.95,
//         useNativeDriver: true,
//       }).start();
//     };

//     const onPressOut = () => {
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         useNativeDriver: true,
//       }).start();
//     };

//     const cartButtonScale = cartAnimations[item.ITEM_ID]?.interpolate({
//       inputRange: [0, 0.5, 1],
//       outputRange: [1, 1.2, 1]
//     }) || new Animated.Value(1);

//     return (
//       <Animated.View
//         style={[
//           styles.itemCard,
//           {
//             transform: [{ scale: scaleAnim }],
//           },
//         ]}
//       >
//         <TouchableOpacity
//           onPressIn={onPressIn}
//           onPressOut={onPressOut}
//           activeOpacity={1}
//         >
//           <View style={styles.itemContent}>
//             <View style={styles.itemMainInfo}>
//               <Text style={styles.itemName}>{item.ITEM_NAME}</Text>
//               <Text style={styles.description}>{item.DESCRIPTION}</Text>
//               <View style={styles.quantityContainer}>
//                 <Text style={styles.quantityLabel}>Balance Quantity : </Text>
//                 <Text style={styles.quantityValue}>{item.BALANCE_QTY_SUM}</Text>
//               </View>
//             </View>
//           </View>

//           <Animated.View
//             style={[
//               styles.addToCartContainer,
//               {
//                 transform: [{ scale: cartButtonScale }]
//               }
//             ]}
//           >
//             <TouchableOpacity
//               style={styles.addToCartButton}
//               onPress={() => handleAddToCart(item.ITEM_ID)}
//             >
//               {/* <View style={styles.cartIconWrapper}> */}
//                 <Text style={styles.cartIcon}>🛒</Text>
//               {/* </View> */}
//               <Text style={styles.addToCartText}>Add to Cart</Text>
//             </TouchableOpacity>
//           </Animated.View>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.headerContent}>
//           <Text style={styles.headerText}>
//             {route.params.subcategoryName}
//           </Text>
//           <Text style={styles.subHeaderText}>
//             ID: {route.params.subcategoryId}
//           </Text>
//         </View>
//         {route.params.subcatImgFile && (
//           <Image
//             source={getImage(route.params.subcatImgFile)}
//             style={styles.headerImage}
//             resizeMode="contain"
//           />
//         )}
//       </View>

//       <FlatList
//         data={items}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.ITEM_ID.toString()}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>
//               {error || 'No items found'}
//             </Text>
//             <TouchableOpacity
//               style={styles.retryButton}
//               onPress={() => fetchItems()}
//             >
//               <Text style={styles.retryButtonText}>Try Again</Text>
//             </TouchableOpacity>
//           </View>
//         }
//         contentContainerStyle={styles.listContainer}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     // padding: 16,
//     backgroundColor: '#ffffff',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e1e1e1',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   headerContent: {
//     flex: 1,
//     marginRight: 16,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 4,
//     marginLeft:25,
//   },
//   subHeaderText: {
//     fontSize: 14,
//     color: '#7f8c8d',
//     marginLeft:25,
//   },
//   headerImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 8,
//     marginRight:10
//   },
//   itemCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     overflow: 'hidden',
//   },
//   itemContent: {
//     padding: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   itemMainInfo: {
//     flex: 1,
//     marginRight: 16,
//   },
//   itemRightSection: {
//     alignItems: 'flex-end',
//     justifyContent: 'space-between',
//   },
//   itemName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 8,
//   },
//   itemCode: {
//     fontSize: 14,
//     color: '#7f8c8d',
//     marginBottom: 4,
//   },
//   description: {
//     fontSize: 14,
//     color: '#34495e',
//     marginBottom: 8,
//   },
//   cartIcon: {
//     // backgroundColor: '#3498db',
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   cartIconText: {
//     fontSize: 20,
//   },
//   addToCartContainer: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     padding: 12,
//   },
//   addToCartButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#2ecc71',
//     paddingHorizontal: 6,
//     paddingVertical: 6,
//     borderRadius: 20,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   cartIconWrapper: {
//     marginRight: 8,
//   },

//   addToCartText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   quantityContainer: {
//     alignItems: 'center',
//     flexDirection:'row',
//   },
//   quantityLabel: {
//     fontSize: 16,
//     // color: '#7f8c8d',
//     color:'black',
//     marginBottom: 2,
//   },
//   quantityValue: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#27ae60',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   retryButton: {
//     padding: 12,
//     backgroundColor: '#3498db',
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   listContainer: {
//     flexGrow: 1,
//     paddingVertical: 8,
//   },
// });

// export default ItemDetailScreen;

// import { RouteProp, useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Animated,
//   Dimensions,
//   FlatList,
//   Image,
//   RefreshControl,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { RootStackParamList } from '../../App';
// import { getImage } from '../utils/imageLoader';

// const BACKEND_URL = "http://192.168.1.3:3000/sf";
// const { width } = Dimensions.get('window');

// interface Item {
//   ITEM_ID: number;
//   ITEM_CODE: string;
//   DESCRIPTION: string;
//   ITEM_NAME: string;
//   BALANCE_QTY_SUM: number;
// }

// type ItemDetailScreenRouteProp = RouteProp<RootStackParamList, 'ItemDetailScreen'>;

// interface ItemDetailScreenProps {
//   route: ItemDetailScreenRouteProp;
// }

// const ItemDetailScreen: React.FC<ItemDetailScreenProps> = ({ route }) => {
//   const navigation = useNavigation();
//   const [items, setItems] = useState<Item[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [cartAnimations, setCartAnimations] = useState<{ [key: number]: Animated.Value }>({});

//   // Initialize cart animations for each item
//   useEffect(() => {
//     const animations: { [key: number]: Animated.Value } = {};
//     items.forEach(item => {
//       animations[item.ITEM_ID] = new Animated.Value(0);
//     });
//     setCartAnimations(animations);
//   }, [items]);

//   const fetchItems = async (showLoader = true) => {
//     if (showLoader) setLoading(true);
//     setError(null);

//     try {
//       console.log('Attempting to fetch items for subcategory ID:', route.params.subcategoryId);

//       const payload = {
//         SubCategoryID: route.params.subcategoryId
//       };

//       const response = await axios.post(
//         `${BACKEND_URL}/getItemsBySubCategory`,
//         payload,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           },
//           timeout: 10000
//         }
//       );

//       if (response.data?.output?.items) {
//         setItems(response.data.output.items);
//       } else {
//         setError('No items available');
//         setItems([]);
//       }
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         const errorMessage = err.response?.data?.message || err.message;
//         setError(`Error: ${errorMessage}`);
//       } else {
//         setError('Unexpected error occurred');
//       }
//       setItems([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     if (!route.params?.subcategoryId) {
//       setError('Invalid subcategory ID');
//       setLoading(false);
//       return;
//     }
//     fetchItems();
//   }, [route.params.subcategoryId]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchItems(false);
//   };

//   const handleAddToCart = (itemId: number) => {
//     // Trigger the add to cart animation
//     Animated.sequence([
//       Animated.timing(cartAnimations[itemId], {
//         toValue: 1,
//         duration: 200,
//         useNativeDriver: true,
//       }),
//       Animated.timing(cartAnimations[itemId], {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: true,
//       })
//     ]).start();

//     // Handle add to cart logic here
//     console.log('Add to cart:', itemId);
//   };

//   const renderItem = ({ item, index }: { item: Item; index: number }) => {
//     const scaleAnim = new Animated.Value(1);

//     const onPressIn = () => {
//       Animated.spring(scaleAnim, {
//         toValue: 0.95,
//         useNativeDriver: true,
//       }).start();
//     };

//     const onPressOut = () => {
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         useNativeDriver: true,
//       }).start();
//     };

//     const cartButtonScale = cartAnimations[item.ITEM_ID]?.interpolate({
//       inputRange: [0, 0.5, 1],
//       outputRange: [1, 1.2, 1]
//     }) || new Animated.Value(1);

//     return (
//       <Animated.View
//         style={[
//           styles.itemCard,
//           {
//             transform: [{ scale: scaleAnim }],
//           },
//         ]}
//       >
//         <TouchableOpacity
//           onPressIn={onPressIn}
//           onPressOut={onPressOut}
//           activeOpacity={1}
//         >
//           <View style={styles.itemContent}>
//             <View style={styles.itemMainInfo}>
//               <Text style={styles.itemName}>{item.ITEM_NAME}</Text>
//               <Text style={styles.description}>{item.DESCRIPTION}</Text>
//               <View style={styles.quantityContainer}>
//                 <Text style={styles.quantityLabel}>Balance Quantity : </Text>
//                 <Text style={styles.quantityValue}>{item.BALANCE_QTY_SUM}</Text>
//               </View>
//             </View>
//           </View>

//           <Animated.View
//             style={[
//               styles.addToCartContainer,
//               {
//                 transform: [{ scale: cartButtonScale }]
//               }
//             ]}
//           >
//             <TouchableOpacity
//               style={styles.addToCartButton}
//               onPress={() => handleAddToCart(item.ITEM_ID)}
//             >
//               <View style={styles.cartIconWrapper}>
//                 <Text style={styles.cartIcon}>🛒</Text>
//               </View>
//               <Text style={styles.addToCartText}>Add</Text>
//             </TouchableOpacity>
//           </Animated.View>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.headerContent}>
//           <Text style={styles.headerText}>
//             {route.params.subcategoryName}
//           </Text>
//           <Text style={styles.subHeaderText}>
//             ID: {route.params.subcategoryId}
//           </Text>
//         </View>
//         {route.params.subcatImgFile && (
//           <Image
//             source={getImage(route.params.subcatImgFile)}
//             style={styles.headerImage}
//             resizeMode="contain"
//           />
//         )}
//       </View>

//       <FlatList
//         data={items}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.ITEM_ID.toString()}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>
//               {error || 'No items found'}
//             </Text>
//             <TouchableOpacity
//               style={styles.retryButton}
//               onPress={() => fetchItems()}
//             >
//               <Text style={styles.retryButtonText}>Try Again</Text>
//             </TouchableOpacity>
//           </View>
//         }
//         contentContainerStyle={styles.listContainer}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     backgroundColor: '#ffffff',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e1e1e1',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   headerContent: {
//     flex: 1,
//     marginRight: 16,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 4,
//     marginLeft: 25,
//   },
//   subHeaderText: {
//     fontSize: 14,
//     color: '#7f8c8d',
//     marginLeft: 25,
//   },
//   headerImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 8,
//     marginRight: 10
//   },
//   itemCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     overflow: 'hidden',
//   },
//   itemContent: {
//     padding: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   itemMainInfo: {
//     flex: 1,
//     marginRight: 16,
//   },
//   itemName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 8,
//   },
//   description: {
//     fontSize: 14,
//     color: '#34495e',
//     marginBottom: 8,
//   },
//   addToCartContainer: {
//     padding: 12,
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//   },
//   addToCartButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFDD0',
//     paddingHorizontal: 8,
//     paddingVertical: 8,
//     borderRadius: 25,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     // width:'80%'
//   },
//   cartIconWrapper: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: 20,
//     padding: 4,
//     marginRight: 8,
//   },
//   cartIcon: {
//     fontSize: 16,
//   },
//   addToCartText: {
//     color: '#F48221',
//     fontSize: 14,
//     fontWeight: '700',
//     marginLeft: -4,
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   quantityLabel: {
//     fontSize: 16,
//     color: 'black',
//     marginBottom: 2,
//   },
//   quantityValue: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#27ae60',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   retryButton: {
//     padding: 12,
//     backgroundColor: '#3498db',
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   listContainer: {
//     flexGrow: 1,
//     paddingVertical: 8,
//   },
// });

// export default ItemDetailScreen;


import { NavigationProp, RouteProp } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from "../../App";
import { getSubcategoryImage } from "../utils/imageRegistry";

const BACKEND_URL = "http://192.168.1.3:3000/sf";
const { width } = Dimensions.get("window");

interface Item {
  ITEM_ID: number;
  ITEM_CODE: string;
  DESCRIPTION: string;
  ITEM_NAME: string;
  BALANCE_QTY_SUM: number;
}

type ItemDetailScreenRouteProp = RouteProp<RootStackParamList, "ItemDetailScreen">;
type ItemDetailScreenNavigationProp = NavigationProp<RootStackParamList>;

interface ItemDetailScreenProps {
  route: ItemDetailScreenRouteProp;
  navigation: ItemDetailScreenNavigationProp;
}

const ItemDetailScreen: React.FC<ItemDetailScreenProps> = ({
  route,
  navigation,
}) => {
  // State declarations - all hooks at the top level
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [cartAnimations, setCartAnimations] = useState<{
    [key: number]: Animated.Value;
  }>({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState("");

  // Debug logging for image path
  useEffect(() => {
    console.log("Subcategory Image Path:", route.params.subcategoryImage);
    console.log("Full Image Details:", route.params);
  }, [route.params]);

  // Cart animations effect
  useEffect(() => {
    const animations: { [key: number]: Animated.Value } = {};
    items.forEach((item) => {
      animations[item.ITEM_ID] = new Animated.Value(0);
    });
    setCartAnimations(animations);
  }, [items]);

  // Fetch items effect
  useEffect(() => {
    if (!route.params?.subcategoryId) {
      setError("Invalid subcategory ID");
      setLoading(false);
      return;
    }
    fetchItems();
  }, [route.params.subcategoryId]);

  const fetchItems = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);

    try {
      console.log(
        "Attempting to fetch items for subcategory ID:",
        route.params.subcategoryId
      );

      const payload = {
        SubCategoryID: route.params.subcategoryId,
      };

      const response = await axios.post(
        `${BACKEND_URL}/getItemsBySubCategory`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 10000,
        }
      );

      if (response.data?.output?.items) {
        setItems(response.data.output.items);
      } else {
        setError("No items available");
        setItems([]);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(`Error: ${errorMessage}`);
      } else {
        setError("Unexpected error occurred");
      }
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddToCart = (ItemId: number) => {
    Animated.sequence([
      Animated.timing(cartAnimations[ItemId], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cartAnimations[ItemId], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setModalVisible(true);
    console.log("Add to cart:", ItemId);
  };

  const handleConfirmQuantity = () => {
    console.log("Item added to cart with quantity:", quantity);
    setModalVisible(false);
    setQuantity("");
  };

  const handleViewDetails = (item: Item) => {
    if (!item.ITEM_ID) {
      console.error("Invalid ItemId:", item.ITEM_ID);
      Alert.alert("Error", "Invalid item ID");
      return;
    }

    console.log("Navigating to details for item ID:", item.ITEM_ID);
    navigation.navigate("ItemDetailsExpanded", {
      ItemID: item.ITEM_ID,
    });
  };

  const renderHeaderImage = () => {
    const imageSource = route.params.subcategoryImage 
      ? getSubcategoryImage(route.params.subcategoryImage)
      : require('../../assets/images/default.jpg');

    return (
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.headerImage}
          resizeMode="contain"
          onError={(e) => {
            console.error("Image loading error:", e.nativeEvent.error);
            setImageError(true);
          }}
          onLoad={() => {
            console.log("Image loaded successfully");
            setImageError(false);
          }}
        />
        {imageError && (
          <Text style={styles.imageErrorText}>
            Failed to load image: {route.params.subcategoryImage}
          </Text>
        )}
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: Item; index: number }) => {
    const scaleAnim = new Animated.Value(1);
    const cartButtonScale = cartAnimations[item.ITEM_ID]?.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.2, 1],
    }) || new Animated.Value(1);

    return (
      <Animated.View
        style={[
          styles.itemCard,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => handleViewDetails(item)}
        >
          <View style={styles.itemContent}>
            <View style={styles.itemMainInfo}>
              <Text style={styles.itemName}>{item.ITEM_NAME}</Text>
              <Text style={styles.description}>{item.DESCRIPTION}</Text>
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Balance Quantity : </Text>
                <Text style={styles.quantityValue}>{item.BALANCE_QTY_SUM}</Text>
              </View>

              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => handleViewDetails(item)}
              >
                <Icon name="arrow-forward-outline" size={20} color="#2196f3" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchItems(false);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {renderHeaderImage()}
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>{route.params.subcategoryName}</Text>
        </View>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.ITEM_ID.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{error || "No items found"}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchItems()}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};


const styles = StyleSheet.create({
 
  viewDetailsButton: {
    backgroundColor: "#e3f2fd",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 8,
    alignSelf: "flex-end",
    // borderWidth: 1,
    // borderColor: "#2196f3",
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 2,
    right: -15,
  },
  viewDetailsText: {
    color: "#2196f3",
    fontSize: 14,
    fontWeight: "600",
  },
  imageErrorText: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  imageContainer: {
    width: width,
    height: width * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
    marginLeft: 25,
  },
  subHeaderText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginLeft: 25,
  },
  headerImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  itemCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  itemContent: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemMainInfo: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#34495e",
    marginBottom: 8,
  },
  addToCartContainer: {
    padding: 10,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFDD0",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cartIconWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 4,
    marginRight: 8,
  },
  cartIcon: {
    fontSize: 16,
  },
  addToCartText: {
    color: "#F48221",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: -4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityLabel: {
    fontSize: 16,
    color: "black",
    marginBottom: 2,
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#27ae60",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    padding: 12,
    backgroundColor: "#3498db",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  quantityInput: {
    width: "100%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  }
});

export default ItemDetailScreen;

// import { NavigationProp, RouteProp } from "@react-navigation/native";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Animated,
//   Dimensions,
//   FlatList,
//   Image,
//   RefreshControl,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from "react-native";
// import Icon from 'react-native-vector-icons/Ionicons';
// import { RootStackParamList } from "../../App";
// import { getSubcategoryImage } from "../utils/imageRegistry";

// const BACKEND_URL = "http://192.168.1.3:3000/sf";
// const { width } = Dimensions.get("window");

// interface Item {
//   ITEM_ID: number;
//   ITEM_CODE: string;
//   DESCRIPTION: string;
//   ITEM_NAME: string;
//   BALANCE_QTY_SUM: number;
// }

// type ItemDetailScreenRouteProp = RouteProp<
//   RootStackParamList,
//   "ItemDetailScreen"
// >;
// type ItemDetailScreenNavigationProp = NavigationProp<RootStackParamList>;

// interface ItemDetailScreenProps {
//   route: ItemDetailScreenRouteProp;
//   navigation: ItemDetailScreenNavigationProp;
// }

// const ItemDetailScreen: React.FC<ItemDetailScreenProps> = ({
//   route,
//   navigation,
// }) => {
//   // const navigation = useNavigation();
//   const [items, setItems] = useState<Item[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [imageError, setImageError] = useState(false);
//   const [cartAnimations, setCartAnimations] = useState<{
//     [key: number]: Animated.Value;
//   }>({});
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [quantity, setQuantity] = useState("");

//   useEffect(() => {
//     const animations: { [key: number]: Animated.Value } = {};
//     items.forEach((item) => {
//       animations[item.ITEM_ID] = new Animated.Value(0);
//     });
//     setCartAnimations(animations);
//   }, [items]);

//   // Debug logging for image path
//   useEffect(() => {
//     console.log("Subcategory Image Path:", route.params.subcategoryImage);
//     console.log("Full Image Details:", route.params);
//   }, [route.params]);

//   const fetchItems = async (showLoader = true) => {
//     if (showLoader) setLoading(true);
//     setError(null);

//     try {
//       console.log(
//         "Attempting to fetch items for subcategory ID:",
//         route.params.subcategoryId
//       );

//       const payload = {
//         SubCategoryID: route.params.subcategoryId,
//       };

//       const response = await axios.post(
//         `${BACKEND_URL}/getItemsBySubCategory`,
//         payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           timeout: 10000,
//         }
//       );

//       if (response.data?.output?.items) {
//         setItems(response.data.output.items);
//       } else {
//         setError("No items available");
//         setItems([]);
//       }
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         const errorMessage = err.response?.data?.message || err.message;
//         setError(`Error: ${errorMessage}`);
//       } else {
//         setError("Unexpected error occurred");
//       }
//       setItems([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     if (!route.params?.subcategoryId) {
//       setError("Invalid subcategory ID");
//       setLoading(false);
//       return;
//     }
//     fetchItems();
//   }, [route.params.subcategoryId]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchItems(false);
//   };

//   const handleAddToCart = (ItemId: number) => {
//     // Trigger the add to cart animation
//     Animated.sequence([
//       Animated.timing(cartAnimations[ItemId], {
//         toValue: 1,
//         duration: 200,
//         useNativeDriver: true,
//       }),
//       Animated.timing(cartAnimations[ItemId], {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Handle add to cart logic here
//     setModalVisible(true);
//     console.log("Add to cart:", ItemId);
//   };
//   const handleConfirmQuantity = () => {
//     // Handle the quantity logic here, like updating cart with quantity
//     console.log("Item added to cart with quantity:", quantity);

//     // Close the modal
//     setModalVisible(false);
//     setQuantity(""); // Reset quantity after adding to cart
//   };
//   const handleViewDetails = (item: Item) => {
//     if (!item.ITEM_ID) {
//       console.error("Invalid ItemId:", item.ITEM_ID);
//       Alert.alert("Error", "Invalid item ID");
//       return;
//     }

//     console.log("Navigating to details for item ID:", item.ITEM_ID);

//     navigation.navigate("ItemDetailsExpanded", {
//       ItemID: item.ITEM_ID, // Change to match backend's expected format
//     });
//   };

//   const renderItem = ({ item, index }: { item: Item; index: number }) => {
//     const scaleAnim = new Animated.Value(1);
//     const cartButtonScale =
//       cartAnimations[item.ITEM_ID]?.interpolate({
//         inputRange: [0, 0.5, 1],
//         outputRange: [1, 1.2, 1],
//       }) || new Animated.Value(1);

//     return (
//       <Animated.View
//         style={[
//           styles.itemCard,
//           {
//             transform: [{ scale: scaleAnim }],
//           },
//         ]}
//       >
//         <TouchableOpacity
//           onPress={() =>
//             navigation.navigate("ItemDetailsExpanded", { ItemID: 1 })
//           }
//         >
//           <View style={styles.itemContent}>
//             <View style={styles.itemMainInfo}>
//               <Text style={styles.itemName}>{item.ITEM_NAME}</Text>
//               <Text style={styles.description}>{item.DESCRIPTION}</Text>
//               <View style={styles.quantityContainer}>
//                 <Text style={styles.quantityLabel}>Balance Quantity : </Text>
//                 <Text style={styles.quantityValue}>{item.BALANCE_QTY_SUM}</Text>
//               </View>

//               {/* New View Details Button */}
//               <TouchableOpacity
//                 style={styles.viewDetailsButton}
//                 onPress={() => handleViewDetails(item)}
//               >
//                  <Icon name="arrow-forward-outline" size={20} color="#2196f3" />
//                 {/* <Text style={styles.viewDetailsText}></Text> */}
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* <Animated.View
//             style={[
//               styles.addToCartContainer,
//               {
//                 transform: [{ scale: cartButtonScale }],
//               },
//             ]}
//           >
//             <TouchableOpacity
//               style={styles.addToCartButton}
//               onPress={() => handleAddToCart(item.ITEM_ID)}
//             >
//               <View style={styles.cartIconWrapper}>
//                 <Text style={styles.cartIcon}>🛒</Text>
//               </View>
//               <Text style={styles.addToCartText}>Add</Text>
//             </TouchableOpacity>
//             <Modal
//               transparent={true}
//               visible={isModalVisible}
//               onRequestClose={() => setModalVisible(false)}
//             >
//               <View style={styles.modalOverlay}>
//                 <View style={styles.modalContent}>
//                   <Text style={styles.modalTitle}>Enter Quantity</Text>
//                   <TextInput
//                     style={styles.quantityInput}
//                     placeholder="Enter quantity"
//                     keyboardType="numeric"
//                     value={quantity}
//                     onChangeText={setQuantity}
//                   />
//                   <TouchableOpacity
//                     style={styles.confirmButton}
//                     onPress={handleConfirmQuantity}
//                   >
//                     <Text style={styles.confirmButtonText}>Add Quantity</Text>
//                   </TouchableOpacity>
//                 </View> 
//               </View>
//             </Modal>
//           </Animated.View> */}
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

  
//   const renderHeaderImage = () => {
//     const imageSource = route.params.subcategoryImage 
//       ? getSubcategoryImage(route.params.subcategoryImage)
//       : require('../../assets/images/default.jpg'); // Make sure you have a default image

//     return (
//       <View style={styles.imageContainer}>
//         <Image
//           source={imageSource}
//           style={styles.headerImage}
//           resizeMode="contain"
//           onError={(e) => {
//             console.error("Image loading error:", e.nativeEvent.error);
//             setImageError(true);
//           }}
//           onLoad={() => {
//             console.log("Image loaded successfully");
//             setImageError(false);
//           }}
//         />
//         {imageError && (
//           <Text style={styles.imageErrorText}>
//             Failed to load image: {route.params.subcategoryImage}
//           </Text>
//         )}
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   // Debug logging for image path
//   useEffect(() => {
//     console.log("Subcategory Image Path:", route.params.subcategoryImage);
//     console.log("Full Image Details:", route.params);
//   }, [route.params]);
//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//       {renderHeaderImage()}
//         <View style={styles.headerContent}>
//           <Text style={styles.headerText}>{route.params.subcategoryName}</Text>
//         </View>
//         {route.params.subcategoryImage && (
//           <Image
//             source={getSubcategoryImage(route.params.subcategoryImage)}
//             style={styles.headerImage}
//             resizeMode="contain"
//           />
//         )}
//       </View>

//       <FlatList
//         data={items}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.ITEM_ID.toString()}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>{error || "No items found"}</Text>
//             <TouchableOpacity
//               style={styles.retryButton}
//               onPress={() => fetchItems()}
//             >
//               <Text style={styles.retryButtonText}>Try Again</Text>
//             </TouchableOpacity>
//           </View>
//         }
//         contentContainerStyle={styles.listContainer}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   // ... existing styles ...

//   // viewDetailsButton: {
//   //   backgroundColor: "#e3f2fd",
//   //   paddingVertical: 8,
//   //   paddingHorizontal: 12,
//   //   borderRadius: 8,
//   //   // marginTop: 8,
//   //   alignSelf: "flex-end",
//   //   borderWidth: 1,
//   //   borderColor: "#2196f3",
//   // },
//   viewDetailsButton: {
//     backgroundColor: "#e3f2fd",
//     paddingVertical: 5,
//     paddingHorizontal: 5,
//     borderRadius: 8,
//     alignSelf: "flex-end",
//     // borderWidth: 1,
//     // borderColor: "#2196f3",
//     flexDirection: 'row',
//     alignItems: 'center',
//     position: 'absolute',
//     top: 2,
//     right: -15,
//   },
//   viewDetailsText: {
//     color: "#2196f3",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   imageErrorText: {
//     color: 'red',
//     fontSize: 12,
//     textAlign: 'center',
//     marginTop: 5,
//   },
//   imageContainer: {
//     width: width,
//     height: width * 0.5,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//   },
//   header: {
//     backgroundColor: "#ffffff",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e1e1e1",
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   headerContent: {
//     flex: 1,
//     marginRight: 16,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#2c3e50",
//     marginBottom: 4,
//     marginLeft: 25,
//   },
//   subHeaderText: {
//     fontSize: 14,
//     color: "#7f8c8d",
//     marginLeft: 25,
//   },
//   headerImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 8,
//     marginRight: 10,
//   },
//   itemCard: {
//     backgroundColor: "#ffffff",
//     borderRadius: 12,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     overflow: "hidden",
//   },
//   itemContent: {
//     padding: 16,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   itemMainInfo: {
//     flex: 1,
//     marginRight: 16,
//   },
//   itemName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#2c3e50",
//     marginBottom: 8,
//   },
//   description: {
//     fontSize: 14,
//     color: "#34495e",
//     marginBottom: 8,
//   },
//   addToCartContainer: {
//     padding: 10,
//     position: "absolute",
//     bottom: 0,
//     right: 0,
//   },
//   addToCartButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFFDD0",
//     paddingHorizontal: 8,
//     paddingVertical: 8,
//     borderRadius: 25,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//   },
//   cartIconWrapper: {
//     backgroundColor: "rgba(255, 255, 255, 0.2)",
//     borderRadius: 20,
//     padding: 4,
//     marginRight: 8,
//   },
//   cartIcon: {
//     fontSize: 16,
//   },
//   addToCartText: {
//     color: "#F48221",
//     fontSize: 14,
//     fontWeight: "700",
//     marginLeft: -4,
//   },
//   quantityContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   quantityLabel: {
//     fontSize: 16,
//     color: "black",
//     marginBottom: 2,
//   },
//   quantityValue: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#27ae60",
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: "#666",
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   retryButton: {
//     padding: 12,
//     backgroundColor: "#3498db",
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   listContainer: {
//     flexGrow: 1,
//     paddingVertical: 8,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     width: "80%",
//     backgroundColor: "white",
//     padding: 20,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   modalTitle: {
//     fontSize: 18,
//     marginBottom: 15,
//   },
//   quantityInput: {
//     width: "100%",
//     padding: 10,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 5,
//     marginBottom: 20,
//   },
//   confirmButton: {
//     backgroundColor: "#28a745",
//     padding: 10,
//     borderRadius: 5,
//   },
//   confirmButtonText: {
//     color: "white",
//     fontWeight: "bold",
//   },
// });

// export default ItemDetailScreen;
