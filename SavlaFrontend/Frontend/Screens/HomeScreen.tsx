// import React, { useState, useCallback } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Image, TextInput, FlatList, Dimensions } from 'react-native';
// import { useNavigation, NavigationProp } from '@react-navigation/native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { auth } from '../../firebaseconfig';
// import { useCart } from './contexts/CartContext';
// import Carousel from './Carousel'; 

// type RootStackParamList = {
//   Stocks: undefined;
//   Inwards: undefined;
//   Outwards: undefined;
//   ExpiringProducts: undefined;
//   Invoices: undefined;
//   OrderPlacement: undefined;
//   ProductSearch: undefined;
//   HomeScreen: undefined;
//   OtpVerificationScreen: undefined;
//   Category: { category: string };
//   CartScreen: undefined;
// };

// type HomeScreenNavigationProp = NavigationProp<RootStackParamList>;

// const cardData = [
//   { id: '1', name: 'fruits', image: require('../../assets/fruits.png') },
//   { id: '2', name: 'spices', image: require('../../assets/spices/spices2.png') },
//   { id: '3', name: 'pulses', image: require('../../assets/pulses.png') },
//   { id: '4', name: 'medicines', image: require('../../assets/medicines.png') },
//   { id: '5', name: 'dry-fruits', image: require('../../assets/dry-fruits.png') },
//   { id: '6', name: 'vegetables', image: require('../../assets/vegetables.png') },
//   { id: '7', name: 'milk-products', image: require('../../assets/milk-products.png') },
//   { id: '8', name: 'confectionaries', image: require('../../assets/confectionaries.png') },
//   { id: '9', name: 'meat', image: require('../../assets/meat.png') },
// ];

// const { width } = Dimensions.get('window');

// const HomeScreen: React.FC = () => {
//   const navigation = useNavigation<HomeScreenNavigationProp>();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredCards, setFilteredCards] = useState(cardData);
//   const [showAllCards, setShowAllCards] = useState(false);
//   const { cart } = useCart();
//   const cartItemCount = cart.length;

//   const handleSearch = useCallback((text: string) => {
//     setSearchQuery(text);
//     const filtered = cardData.filter(card => 
//       card.name.toLowerCase().includes(text.toLowerCase())
//     );
//     setFilteredCards(filtered);
//   }, []);

//   const handleLogout = useCallback(() => {
//     auth.signOut()
//       .then(() => {
//         navigation.navigate('OtpVerificationScreen');
//       })
//       .catch((error) => {
//         console.error('Logout error:', error);
//       });
//   }, [navigation]);

//   const renderCardItem = useCallback(({ item }: { item: { id: string; name: string; image: any } }) => (
//     <TouchableOpacity 
//       style={styles.card}
//       onPress={() => navigation.navigate('Category', {category:item.name})}
//     >
//       <Image source={Image.resolveAssetSource(item.image)} style={styles.cardImage} resizeMode='contain'/>
//       <Text style={styles.cardText}>
//         {item.name}
//       </Text>
//     </TouchableOpacity>
//   ), [navigation]);

//   return (     
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ddd" />
//       <View style={styles.header}>
//         <View style={styles.logoContainer}>
//           <Image
//             source={require('../../assets/New folder/SavlaLogo.png')}
//             style={styles.logo}
//           />            
//           <Text style={styles.headerTitle}>UNICORP ENTERPRISES</Text>
//         </View>
//         <View style={styles.headerRightContainer}>
//           <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={styles.cartButton}>
//             <MaterialIcons name="shopping-cart" size={24} color="#000" />
//             {cartItemCount > 0 && (
//               <View style={styles.cartBadge}>
//                 <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//           <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//             <MaterialIcons name="logout" size={24} color="#000" />
//           </TouchableOpacity>
//         </View>         
//       </View>
//       <Text style={styles.id}>Customer ID :123456 </Text>
//       <View style={styles.searchContainer}>      
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search..."
//           value={searchQuery}
//           onChangeText={handleSearch}
//         />
//         <TouchableOpacity style={styles.searchButton}>
//           <MaterialIcons name="search" size={24} color="#000" />
//         </TouchableOpacity>
//       </View>

//       <Carousel />

//       <View style={styles.headingContainer}>
//         <Text style={styles.headingText}>Stocks</Text>
//         <TouchableOpacity onPress={() => setShowAllCards(!showAllCards)}>
//           <Text style={styles.moreText}>{showAllCards ? 'Less' : 'More->'}</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={showAllCards ? filteredCards : filteredCards.slice(0, 6)}
//         renderItem={renderCardItem}
//         numColumns={2}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.cardContainer}
//         scrollEnabled={true}
//       />       
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#fff', 
//   },
//   headerRightContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: -40,
//   },
//   cartButton: {
//     padding: 5,
//     marginRight: -25,
//   },
//   cartBadge: {
//     position: 'absolute',
//     right: -3,
//     top: -6,
//     backgroundColor: 'red',
//     borderRadius: 9,
//     width: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   cartBadgeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   logoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//     marginLeft: -5
//   },
//   logo: {
//     width: 45,
//     height: 45,
//     marginRight: 10,
//   },
//   headerTitle: {
//     fontSize: 18,
//     color: '#007BFA',
//     fontWeight: 'bold',
//     marginLeft: 20
//   },
//   logoutButton: {
//     marginHorizontal: 30,   
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     paddingVertical: 15,   
//     marginBottom: -10 
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     marginRight: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   searchButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   cardContainer: {
//     paddingHorizontal: 10,
//     paddingBottom: 10,
//   },
//   card: {
//     width: (width - 40) / 2,
//     margin: 5,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 8,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   id:{
//     color:'black',
//     fontSize:20,
//     flexDirection: 'row',
//     marginLeft:25
//   },
//   cardImage: {
//     width: '100%',
//     height: 85,
//     resizeMode: 'cover',
//     borderRadius: 5,
//   },
//   cardText: {
//     marginTop: 5,
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   headingContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   headingText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   moreText: {
//     fontSize: 16,
//     color: '#F48221',
//     fontWeight: 'bold',
//   },
//   bottomTab: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#ddd',
     
//   },
//   tabItem: {
//     alignItems: 'center',
//   },
// });

// export default HomeScreen;



// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NavigationProp, useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import React, { useCallback, useEffect, useState } from 'react';
// import { Dimensions, SafeAreaView, StyleSheet, Text } from 'react-native';
// import { useCart } from './contexts/CartContext';
// import { useCustomer } from './contexts/CustomerContext';

// // ... (other imports and type definitions remain the same)
// type RootStackParamList = {
//   Stocks: undefined;
//   Inwards: undefined;
//   Outwards: undefined;
//   ExpiringProducts: undefined;
//   Invoices: undefined;
//   OrderPlacement: undefined;
//   ProductSearch: undefined;
//   HomeScreen: { customerID? : string };
//   OtpVerificationScreen: undefined;
//   Category: { category: string };
//   CartScreen: undefined;
// };

// type HomeScreenNavigationProp = NavigationProp<RootStackParamList>;

// type CategoryItem = {
//   CATID: string;
//   CATCODE: string;
//   CATDESC: string;
//   CAT_IMGFILE: string;
// };

// const { width } = Dimensions.get('window');

// const HomeScreen: React.FC = () => {
//   const navigation = useNavigation<HomeScreenNavigationProp>();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [categories, setCategories] = useState<CategoryItem[]>([]);
//   const [filteredCategories, setFilteredCategories] = useState<CategoryItem[]>([]);
//   const [showAllCards, setShowAllCards] = useState(false);
//   const { cart } = useCart();
//   const cartItemCount = cart.length;
//   const { customerID, displayName, setCustomerID, setDisplayName } = useCustomer();

//   useEffect(() => {
//     const fetchCustomerInfo = async () => {
//       try {
//         const storedCustomerID = await AsyncStorage.getItem('customerID');
//         const storedDisplayName = await AsyncStorage.getItem('displayName');
//         const token = await AsyncStorage.getItem('token');

//         if (storedCustomerID && storedDisplayName && token) {
//           setCustomerID(storedCustomerID);
//           setDisplayName(storedDisplayName);
//           fetchCategories(token);
//         } else {
//           // Handle the case when the user is not logged in
//           navigation.navigate('OtpVerificationScreen');
//         }
//       } catch (error) {
//         console.error('Error fetching customer info:', error);
//       }
//     };

//     fetchCustomerInfo();
//   }, []);

//   const fetchCategories = async (token: string) => {
//     try {
//       const response = await axios.post('http://192.168.1.3:3000/sf/getItemCatSubCat', 
//         { CustomerID: customerID },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.data && response.data.output) {
//         const uniqueCategories = response.data.output.reduce((acc: CategoryItem[], current: CategoryItem) => {
//           const x = acc.find(item => item.CATID === current.CATID);
//           if (!x) {
//             return acc.concat([current]);
//           } else {
//             return acc;
//           }
//         }, []);

//         setCategories(uniqueCategories);
//         setFilteredCategories(uniqueCategories);
//       }
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };

//   const handleLogout = useCallback(async () => {
//     try {
//       await AsyncStorage.removeItem('token');
//       await AsyncStorage.removeItem('customerID');
//       await AsyncStorage.removeItem('displayName');
//       setCustomerID(null);
//       setDisplayName(null);
//       navigation.navigate('OtpVerificationScreen');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   }, [navigation]);

//   // ... (rest of the component remains the same)

//   return (     
//     <SafeAreaView style={styles.safeArea}>
//       {/* ... (other components remain the same) */}
//       <Text style={styles.id}>Welcome, {displayName || 'Guest'}</Text>
//       {/* ... (rest of the JSX remains the same) */}
//     </SafeAreaView>
//   );
// };


// import { MaterialIcons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// import axios from 'axios';
// import React, { useCallback, useEffect, useState } from 'react';
// import { Dimensions, FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { auth } from '../../firebaseconfig';
// import Carousel from './Carousel';
// import { useCart } from './contexts/CartContext';
// import { useCustomer } from './contexts/CustomerContext';

// type RootStackParamList = {
//   Stocks: undefined;
//   Inwards: undefined;
//   Outwards: undefined;
//   ExpiringProducts: undefined;
//   Invoices: undefined;
//   OrderPlacement: undefined;
//   ProductSearch: undefined;
//   HomeScreen: { customerID? : string };
//   OtpVerificationScreen: undefined;
//   Category: { category: string };
//   CartScreen: undefined;
// };

// type HomeScreenRouteProp = RouteProp<RootStackParamList, 'HomeScreen'>;
// type HomeScreenNavigationProp = NavigationProp<RootStackParamList>;

// type CategoryItem = {
//   CATID: string;
//   CATCODE: string;
//   CATDESC: string;
//   CAT_IMGFILE: string;
// };

// const { width } = Dimensions.get('window');

// const HomeScreen: React.FC = () => {
//   const navigation = useNavigation<HomeScreenNavigationProp>();
//   const route = useRoute();
//   const [CustomerID, setCustomerID] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [categories, setCategories] = useState<CategoryItem[]>([]);
//   const [filteredCategories, setFilteredCategories] = useState<CategoryItem[]>([]);
//   const [showAllCards, setShowAllCards] = useState(false);
//   const { cart } = useCart();
//   const cartItemCount = cart.length;
//   const { customerID } = useCustomer();

//   useEffect(() => {
//     const fetchCustomerID = async () => {
//       try {
//         let id = await AsyncStorage.getItem('customerID');
//         if (id) {
//           setCustomerID(id);
//           await AsyncStorage.setItem('customerID', id);
//         } else {
//           const response = await axios.get('http://192.168.1.3/getCustomerID');
//           id = response.data.customerID;
//           setCustomerID(id);
//           await AsyncStorage.setItem('customerID', id || '');
//         }
//       } catch (error) {
//         console.error('Error fetching CustomerID:', error);
//       }
//     };

//     fetchCustomerID();
//   }, [route.params]);

//   useEffect(() => {
//     if (CustomerID) {
//       fetchCategories();
//     }
//   }, [CustomerID]);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.post('http://192.168.1.3/sf/getItemCatSubCat', {
//         CustomerID: CustomerID
//       });

//       if (response.data && response.data.output) {
//         const uniqueCategories = response.data.output.reduce((acc: CategoryItem[], current: CategoryItem) => {
//           const x = acc.find(item => item.CATID === current.CATID);
//           if (!x) {
//             return acc.concat([current]);
//           } else {
//             return acc;
//           }
//         }, []);

//         setCategories(uniqueCategories);
//         setFilteredCategories(uniqueCategories);
//       }
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };


//   const handleSearch = useCallback((text: string) => {
//     setSearchQuery(text);
//     const filtered = categories.filter(category =>
//       category.CATDESC.toLowerCase().includes(text.toLowerCase())
//     );
//     setFilteredCategories(filtered);
//   }, [categories]);

//   const handleLogout = useCallback(async () => {
//     try {
//       await auth.signOut();
//       await AsyncStorage.removeItem('customerID');
//       navigation.navigate('OtpVerificationScreen');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   }, [navigation]);

  
//   const getImageSource = (imageName: string) => {
//     try {
//       return {uri: `assets://${imageName}`};
//     } catch (error) {
//       console.warn(`Image not found: ${imageName}, using default image`);
//       return require('../../assets/images/default.jpg');
//     }
//   };

//   const renderCardItem = useCallback(({ item }: { item: CategoryItem }) => {
//     const imageSource = item.CAT_IMGFILE ? getImageSource(item.CAT_IMGFILE) : require('../../assets/images/default.jpg');

//     return (
//       <TouchableOpacity 
//         style={styles.card}
//         onPress={() => navigation.navigate('Category', {category: item.CATDESC})}
//       >
//         <Image 
//           source={imageSource}
//           style={styles.cardImage} 
//           resizeMode='contain'
//         />
//         <Text style={styles.cardText}>
//           {item.CATDESC}
//         </Text>
//       </TouchableOpacity>
//     );
//   }, [navigation]);
  
  
//   return (     
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ddd" />
//       <View style={styles.header}>
//         <View style={styles.logoContainer}>
//           <Image
//             source={require('../../assets/New folder/SavlaLogo.png')}
//             style={styles.logo}
//           />            
//           <Text style={styles.headerTitle}>UNICORP ENTERPRISES</Text>
//         </View>
//         <View style={styles.headerRightContainer}>
//           <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={styles.cartButton}>
//             <MaterialIcons name="shopping-cart" size={24} color="#000" />
//             {cartItemCount > 0 && (
//               <View style={styles.cartBadge}>
//                 <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//           <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//             <MaterialIcons name="logout" size={24} color="#000" />
//           </TouchableOpacity>
//         </View>         
//       </View>
//       <Text style={styles.id}>Customer ID: {CustomerID || 'Loading...'}</Text>
//       <View style={styles.searchContainer}>      
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search..."
//           value={searchQuery}
//           onChangeText={handleSearch}
//         />
//         <TouchableOpacity style={styles.searchButton}>
//           <MaterialIcons name="search" size={24} color="#000" />
//         </TouchableOpacity>
//       </View>

//       <Carousel />

//       <View style={styles.headingContainer}>
//         <Text style={styles.headingText}>Categories</Text>
//         <TouchableOpacity onPress={() => setShowAllCards(!showAllCards)}>
//           <Text style={styles.moreText}>{showAllCards ? 'Less' : 'More->'}</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={showAllCards ? filteredCategories : filteredCategories.slice(0, 6)}
//         renderItem={renderCardItem}
//         numColumns={2}
//         keyExtractor={(item) => item.CATID}
//         contentContainerStyle={styles.cardContainer}
//         scrollEnabled={true}
//       />       
//     </SafeAreaView>
//   );
// };


// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#fff', 
//   },
//   headerRightContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: -40,
//   },
//   cartButton: {
//     padding: 5,
//     marginRight: -25,
//   },
//   cartBadge: {
//     position: 'absolute',
//     right: -3,
//     top: -6,
//     backgroundColor: 'red',
//     borderRadius: 9,
//     width: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   cartBadgeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   logoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//     marginLeft: -5
//   },
//   logo: {
//     width: 45,
//     height: 45,
//     marginRight: 10,
//   },
//   headerTitle: {
//     fontSize: 18,
//     color: '#007BFA',
//     fontWeight: 'bold',
//     marginLeft: 20
//   },
//   logoutButton: {
//     marginHorizontal: 30,   
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     paddingVertical: 15,   
//     marginBottom: -10 
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     marginRight: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   searchButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   cardContainer: {
//     paddingHorizontal: 10,
//     paddingBottom: 10,
//   },
//   card: {
//     width: (width - 40) / 2,
//     margin: 5,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 8,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   id:{
//     color:'black',
//     fontSize:20,
//     flexDirection: 'row',
//     marginLeft:25
//   },
//   cardImage: {
//     width: '100%',
//     height: 85,
//     resizeMode: 'cover',
//     borderRadius: 5,
//   },
//   cardText: {
//     marginTop: 5,
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   headingContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   headingText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   moreText: {
//     fontSize: 16,
//     color: '#F48221',
//     fontWeight: 'bold',
//   },
//   bottomTab: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#ddd',
     
//   },
//   tabItem: {
//     alignItems: 'center',
//   },
// });

// export default HomeScreen;


// import { MaterialIcons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// import axios from 'axios';
// import React, { useCallback, useEffect, useState } from 'react';
// import { Dimensions, FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { auth } from '../../firebaseconfig';
// import Carousel from './Carousel';
// import { useCart } from './contexts/CartContext';
// import { useCustomer } from './contexts/CustomerContext';

// type RootStackParamList = {
//   Stocks: undefined;
//   Inwards: undefined;
//   Outwards: undefined;
//   ExpiringProducts: undefined;
//   Invoices: undefined;
//   OrderPlacement: undefined;
//   ProductSearch: undefined;
//   HomeScreen: { customerID?: string };
//   OtpVerificationScreen: undefined;
//   Category: { category: string };
//   CartScreen: undefined;
// };

// type HomeScreenRouteProp = RouteProp<RootStackParamList, 'HomeScreen'>;
// type HomeScreenNavigationProp = NavigationProp<RootStackParamList>;

// type CategoryItem = {
//   CATID: string;
//   CATCODE: string;
//   CATDESC: string;
//   CAT_IMGFILE: string;
// };

// const { width } = Dimensions.get('window');

// const HomeScreen: React.FC = () => {
//   const navigation = useNavigation<HomeScreenNavigationProp>();
//   const route = useRoute<HomeScreenRouteProp>();
//   const [CustomerID, setCustomerID] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [categories, setCategories] = useState<CategoryItem[]>([]);
//   const [filteredCategories, setFilteredCategories] = useState<CategoryItem[]>([]);
//   const [showAllCards, setShowAllCards] = useState(false);
//   const { cart } = useCart();
//   const cartItemCount = cart.length;
//   const { customerID } = useCustomer();

//   useEffect(() => {
//     const fetchCustomerID = async () => {
//       try {
//         let id = await AsyncStorage.getItem('customerID');
//         if (id) {
//           setCustomerID(id);
//           await AsyncStorage.setItem('customerID', id);
//         } else {
//           const response = await axios.get('http://192.168.0.102/getCustomerID');
//           id = response.data.customerID;
//           setCustomerID(id);
//           await AsyncStorage.setItem('customerID', id || '');
//         }
//       } catch (error) {
//         console.error('Error fetching CustomerID:', error);
//       }
//     };

//     fetchCustomerID();
//   }, [route.params]);

//   useEffect(() => {
//     if (CustomerID) {
//       fetchCategories();
//     }
//   }, [CustomerID]);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.post('http://192.168.0.102/sf/getItemCatSubCat', {
//         CustomerID: CustomerID,
//       });

//       if (response.data && response.data.output) {
//         const uniqueCategories = response.data.output.reduce((acc: CategoryItem[], current: CategoryItem) => {
//           const x = acc.find(item => item.CATID === current.CATID);
//           if (!x) {
//             return acc.concat([current]);
//           } else {
//             return acc;
//           }
//         }, []);

//         setCategories(uniqueCategories);
//         setFilteredCategories(uniqueCategories);
//       }
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };

//   const handleSearch = useCallback(
//     (text: string) => {
//       setSearchQuery(text);
//       const filtered = categories.filter(category =>
//         category.CATDESC.toLowerCase().includes(text.toLowerCase())
//       );
//       setFilteredCategories(filtered);
//     },
//     [categories]
//   );

//   const handleLogout = useCallback(async () => {
//     try {
//       await auth.signOut();
//       await AsyncStorage.removeItem('customerID');
//       navigation.navigate('OtpVerificationScreen');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   }, [navigation]);

//   const getImageSource = (imageName: string) => {
//     try {
//       return { uri: `assets://${imageName}` };
//     } catch (error) {
//       console.warn(`Image not found: ${imageName}, using default image`);
//       return require('../../assets/images/default.jpg');
//     }
//   };

//   const renderCardItem = useCallback(
//     ({ item }: { item: CategoryItem }) => {
//       const imageSource = item.CAT_IMGFILE ? getImageSource(item.CAT_IMGFILE) : require('../../assets/images/default.jpg');

//       return (
//         <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Category', { category: item.CATDESC })}>
//           <Image source={imageSource} style={styles.cardImage} resizeMode="contain" />
//           <Text style={styles.cardText}>{item.CATDESC}</Text>
//         </TouchableOpacity>
//       );
//     },
//     [navigation]
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ddd" />
//       <View style={styles.header}>
//         <View style={styles.logoContainer}>
//           <Image source={require('../../assets/New folder/SavlaLogo.png')} style={styles.logo} />
//           <Text style={styles.headerTitle}>UNICORP ENTERPRISES</Text>
//         </View>
//         <View style={styles.headerRightContainer}>
//           <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={styles.cartButton}>
//             <MaterialIcons name="shopping-cart" size={24} color="#000" />
//             {cartItemCount > 0 && (
//               <View style={styles.cartBadge}>
//                 <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//           <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//             <MaterialIcons name="logout" size={24} color="#000" />
//           </TouchableOpacity>
//         </View>
//       </View>
//       <Text style={styles.id}>Customer ID: {CustomerID || 'Loading...'}</Text>
//       <View style={styles.searchContainer}>
//         <TextInput style={styles.searchInput} placeholder="Search..." value={searchQuery} onChangeText={handleSearch} />
//         <TouchableOpacity style={styles.searchButton}>
//           <MaterialIcons name="search" size={24} color="#000" />
//         </TouchableOpacity>
//       </View>

//       <Carousel />

//       <View style={styles.headingContainer}>
//         <Text style={styles.headingText}>Categories</Text>
//         <TouchableOpacity onPress={() => setShowAllCards(!showAllCards)}>
//           <Text style={styles.moreText}>{showAllCards ? 'Less' : 'More->'}</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={showAllCards ? filteredCategories : filteredCategories.slice(0, 6)}
//         renderItem={renderCardItem}
//         numColumns={2}
//         keyExtractor={item => item.CATID}
//         contentContainerStyle={styles.cardContainer}
//         scrollEnabled={true}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#fff',
//   },
//   headerRightContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: -40,
//   },
//   cartButton: {
//     padding: 5,
//     marginRight: -25,
//   },
//   cartBadge: {
//     position: 'absolute',
//     right: -3,
//     top: -6,
//     backgroundColor: 'red',
//     borderRadius: 9,
//     width: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   cartBadgeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   logoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//     marginLeft: -5,
//   },
//   logo: {
//     width: 45,
//     height: 45,
//     marginRight: 10,
//   },
//   headerTitle: {
//     fontSize: 18,
//     color: '#007BFA',
//     fontWeight: 'bold',
//     marginLeft: 20,
//   },
//   logoutButton: {
//     marginHorizontal: 30,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     marginBottom: -10,
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     marginRight: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   searchButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   headingContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingTop: 10,
//   },
//   headingText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#007BFA',
//   },
//   moreText: {
//     color: '#007BFA',
//   },
//   cardContainer: {
//     paddingHorizontal: 10,
//     paddingBottom: 20,
//   },
//   card: {
//     flex: 1,
//     margin: 10,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   cardImage: {
//     width: width / 2 - 60,
//     height: width / 2 - 60,
//   },
//   cardText: {
//     marginTop: 10,
//     textAlign: 'center',
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   id: {
//     marginTop: 5,
//     marginLeft: 20,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default HomeScreen;


import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseconfig';
import Carousel from './Carousel';
import { useCart } from './contexts/CartContext';
import { useCustomer } from './contexts/CustomerContext';


  const BACKEND_URL = 'http://192.168.1.3:3000';

  type RootStackParamList = {
    Stocks: undefined;
    Inwards: undefined;
    Outwards: undefined;
    ExpiringProducts: undefined;
    Invoices: undefined;
    OrderPlacement: undefined;
    ProductSearch: undefined;
    HomeScreen: { customerID?: string };
    OtpVerificationScreen: undefined;
    Category: { category: string };
    CartScreen: undefined;
  };

  type HomeScreenRouteProp = RouteProp<RootStackParamList, 'HomeScreen'>;
  type HomeScreenNavigationProp = NavigationProp<RootStackParamList>;

  type CategoryItem = {
    imageUrl: any;
    CATID: string;
    CATCODE: string;
    CATDESC: string;
    CAT_IMGFILE: string;
  };

  const { width } = Dimensions.get('window');

  const HomeScreen: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const route = useRoute<HomeScreenRouteProp>();
    const [CustomerID, setCustomerID] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<CategoryItem[]>([]);
    const [showAllCards, setShowAllCards] = useState(false);
    const { cart } = useCart();
    const cartItemCount = cart.length;
    // const { customerID } = useCustomer();

    useEffect(() => {
      const fetchCustomerID = async () => {
        try {
          let id = await AsyncStorage.getItem('customerID');
          if (id) {
            setCustomerID(id);
            await AsyncStorage.setItem('customerID', id);
          } else {
            const response = await axios.get('http://192.168.1.3/getCustomerID');
            id = response.data.customerID;
            setCustomerID(id);
            await AsyncStorage.setItem('customerID', id || '');
          }
        } catch (error) {
          console.error('Error fetching CustomerID:', error);
        }
      };

      fetchCustomerID();
    }, [route.params]);

    useEffect(() => {
      if (CustomerID) {
        fetchCategories();
      }
    }, [CustomerID]);

    const fetchCategories = useCallback(async () => {
      if (!CustomerID) {
        console.log('CustomerID is not set');
        return;
      }
  
      try {
        const response = await axios.post(`${BACKEND_URL}/sf/getItemCatSubCat`, {
          CustomerID: CustomerID,
        }, {
          timeout: 10000,
        });
  
        console.log('Response received:', response.data);
  
        if (response.data && response.data.output) {
          const uniqueCategories = response.data.output.reduce((acc: CategoryItem[], current: CategoryItem) => {
            const x = acc.find(item => item.CATID === current.CATID);
            if (!x) {
              console.log(`Category: ${current.CATDESC}, CAT_IMGFILE: ${current.CAT_IMGFILE}`);
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);
  
          setCategories(uniqueCategories);
          setFilteredCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error('Error data:', error.response.data);
            console.error('Error status:', error.response.status);
            Alert.alert("Server Error", `Error ${error.response.status}: ${error.response.data.message || 'Unknown error'}`);
          } else if (error.request) {
            console.error('Error request:', error.request);
            Alert.alert("Network Error", "Unable to connect to the server. Please check your internet connection and try again.");
          } else {
            console.error('Error message:', error.message);
            Alert.alert("Error", "An unexpected error occurred. Please try again.");
          }
        } else {
          Alert.alert("Error", "An unexpected error occurred. Please try again.");
        }
      }
    }, [CustomerID]);
    
    const handleLogout = useCallback(async () => {
      try {
        await auth.signOut();
        await AsyncStorage.removeItem('customerID');
        navigation.navigate('OtpVerificationScreen');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }, [navigation]);

    const handleSearch = useCallback((text: string) => {
      setSearchQuery(text);
      const filtered = categories.filter(category =>
        category.CATDESC.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCategories(filtered);
    }, [categories]);


    // const getImageSource = (imageName: string) => {
    //   try {
    //     return { uri: `assets://${imageName}` };
    //   } catch (error) {
    //     console.warn(`Image not found: ${imageName}, using default image`);
    //     return require('../../assets/images/default.jpg');
    //   }
    // };

    const renderCardItem = useCallback(
      ({ item }: { item: CategoryItem }) => {
        const imageSource = item.imageUrl 
          ? { uri: `${BACKEND_URL}${item.imageUrl}` }
          : require('../../assets/images/default.jpg');
  
        return (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Category', { category: item.CATDESC })}>
            <Image source={imageSource} style={styles.cardImage} resizeMode="contain" />
            <Text style={styles.cardText}>{item.CATDESC}</Text>
          </TouchableOpacity>
        );
      },
      [navigation]
    );

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#ddd" />
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/New folder/SavlaLogo.png')} style={styles.logo} />
            <Text style={styles.headerTitle}>UNICORP ENTERPRISES</Text>
          </View>
          <View style={styles.headerRightContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={styles.cartButton}>
              <MaterialIcons name="shopping-cart" size={24} color="#000" />
              {cartItemCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <MaterialIcons name="logout" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.id}>Customer ID: {CustomerID || 'Loading...'}</Text>
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchInput} placeholder="Search..." value={searchQuery} onChangeText={handleSearch} />
          <TouchableOpacity style={styles.searchButton}>
            <MaterialIcons name="search" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <Carousel />

        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>Categories</Text>
          <TouchableOpacity onPress={() => setShowAllCards(!showAllCards)}>
            <Text style={styles.moreText}>{showAllCards ? 'Less' : 'More->'}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={showAllCards ? filteredCategories : filteredCategories.slice(0, 6)}
          renderItem={renderCardItem}
          numColumns={2}
          keyExtractor={item => item.CATID}
          contentContainerStyle={styles.cardContainer}
          scrollEnabled={true}
        />
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: -40,
  },
  cartButton: {
    padding: 5,
    marginRight: -25,
  },
  cartBadge: {
    position: 'absolute',
    right: -3,
    top: -6,
    backgroundColor: 'red',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: -5,
  },
  logo: {
    width: 45,
    height: 45,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    color: '#007BFA',
    fontWeight: 'bold',
    marginLeft: 20,
  },
  logoutButton: {
    marginHorizontal: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: -10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFA',
  },
  moreText: {
    color: '#007BFA',
  },
  cardContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardImage: {
    width: width / 2 - 60,
    height: width / 2 - 60,
  },
  cardText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  id: {
    marginTop: 5,
    marginLeft: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;