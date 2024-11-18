// import React, { useState, useCallback,useContext } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Dimensions, TextInput, Modal } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context'; 
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { useCart } from './contexts/CartContext';
// import { StackNavigationProp } from '@react-navigation/stack';


// type RootStackParamList = {
//   Category: { category: string };
//   LotReportScreen: {item : any};
// };

// type CategoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Category'>;
// type CategoryRouteProp = RouteProp<RootStackParamList, 'Category'>;

// const { width } = Dimensions.get('window');

// // Mock data for categories and items (unchanged)
// const categories = [
//   { id: '1', name: 'fruits', icon: require('../../assets/fruits.png') },
//   { id: '2', name: 'spices', icon: require('../../assets/spices/spices2.png') },
//   { id: '3', name: 'pulses', icon: require('../../assets/pulses.png') },
//   { id: '4', name: 'medicines', icon: require('../../assets/medicines.png') },
//   { id: '5', name: 'dry-fruits', icon: require('../../assets/dry-fruits.png') },
//   { id: '6', name: 'vegetables', icon: require('../../assets/vegetables.png') },
//   { id: '7', name: 'milk-products', icon: require('../../assets/milk-products.png') },
//   { id: '8', name: 'confectionaries', icon: require('../../assets/confectionaries.png') },
//   { id: '9', name: 'meat', icon: require('../../assets/meat.png') },
// ];

// const itemsData = {
//   'fruits': [
//     { id: '1', name: "Apple", quantity: '5000',  image: require('../../assets/fruits/apple.png') },
//     { id: '2', name: "Orange", quantity: '5000', image: require('../../assets/fruits/orange.png') },
//     { id: '3', name: "Banana", quantity: '5000',   image: require('../../assets/fruits/banana.png') },
//     { id: '4', name: "Grapes", quantity: '5000',   image: require('../../assets/fruits/grapes.png') },
//     { id: '5', name: "strawberry", quantity: '5000',  image: require('../../assets/fruits/strawberry.png') },
//     // Add more items for this category
//   ],
//   'spices':[
//     // { id: '1', name: "Sesame", quantity: '5000',  image: require('../../assets/spices/sesame.png') },
//     { id: '1', name: "Redchillipowder", quantity: '5000',  image: require('../../assets/spices/redchillipowder.png') },
//     { id: '2', name: "Cardamon", quantity: '5000',  image: require('../../assets/spices/cardamom.png') },
//     // { id: '3', name: "Cinnamon", quantity: '5000',  image: require('../../assets/spices/cinnamon.png') },
//     { id: '3', name: "Cloves", quantity: '5000',  image: require('../../assets/spices/cloves.png') },
//     { id: '4', name: "Turmeric", quantity: '5000',  image: require('../../assets/spices/turmeric.png') },
    
//     { id: '5', name: "Blackpepper", quantity: '5000',  image: require('../../assets/spices/blackpepper.png') },
//   ],
//   'pulses':[     
//     { id: '2', name: "redlentils", quantity: '5000',  image: require('../../assets/pulses/redlentils.png') },
//     { id: '3', name: "greenpeas", quantity: '5000',  image: require('../../assets/pulses/greenpeas.png') },
//     { id: '4', name: "redbeans", quantity: '5000',  image: require('../../assets/pulses/redbeans.png') },    
//   ],
//   'medicines':[
//     { id: '1', name: "paracetamol", quantity: '5000',  image: require('../../assets/medicines/paracetamol.png') },
//     { id: '2', name: "ibuprofen", quantity: '5000',  image: require('../../assets/medicines/ibuprofen.png') },
//   ],
//   'dry-fruits':[
//     { id: '1', name: "dates", quantity: '5000',  image: require('../../assets/dry-fruits/dates.png') },
//     { id: '2', name: "pistachio", quantity: '5000',  image: require('../../assets/dry-fruits/pistachio.png') },
//     { id: '3', name: "raisins", quantity: '5000',  image: require('../../assets/dry-fruits/raisins.png') },
//     { id: '4', name: "walnut", quantity: '5000',  image: require('../../assets/dry-fruits/walnut.png') },
//   ],
//   'vegetables':[
//     { id: '1', name: "brinjal", quantity: '5000',  image: require('../../assets/vegetables/brinjal.png') },    
//     { id: '2', name: "broccoli", quantity: '5000',  image: require('../../assets/vegetables/broccoli.png') },    
//     { id: '3', name: "tomato", quantity: '5000',  image: require('../../assets/vegetables/tomato.png') },             
//   ],
//   'milk-products':[
//     { id: '1', name: "cheese", quantity: '5000',  image: require('../../assets/milk-products/cheese.png') },    
//     { id: '2', name: "butter", quantity: '5000',  image: require('../../assets/milk-products/butter.png') },    
//   ],
//   'confectionaries':[
//     { id: '1', name: "donuts", quantity: '5000',  image: require('../../assets/confectionaries/donuts.png') },    
//     { id: '2', name: "waffles", quantity: '5000',  image: require('../../assets/confectionaries/waffles.png') },    
//   ],
//   'meat':[
//     { id: '1', name: "fish", quantity: '5000',  image: require('../../assets/meat/fish.jpg') },    
//     { id: '2', name: "chicken", quantity: '5000',  image: require('../../assets/meat/chicken.jpg') },    
//   ]
//   // Add mock data for other categories
// };

// const Category: React.FC = () => {
//   const navigation = useNavigation<CategoryScreenNavigationProp>();
//   const route = useRoute<CategoryRouteProp>();
//   const [selectedCategory, setSelectedCategory] = useState(route.params.category);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<any>(null);
//   const [quantity, setQuantity] = useState('1');
//   const { addToCart } = useCart();

//   const handleAddToCart = () => {
//     if (selectedItem) {
//       addToCart({
//         id: selectedItem.id,
//         name: selectedItem.name,
//         category: selectedCategory,
//         quantity: parseInt(quantity),
//         image: Image.resolveAssetSource(selectedItem.image).uri,
        
//       });       
//       setModalVisible(false);
//       setQuantity('1');
//     }
//   };
  
//   const renderCategoryItem = useCallback(({ item }: { item: { id: string; name: string; icon: any } }) => (
//     <TouchableOpacity
//       style={[styles.categoryItem, selectedCategory === item.name && styles.selectedCategoryItem]}
//       onPress={() => setSelectedCategory(item.name)}
//     >
//       <Image source={item.icon} style={styles.categoryIcon} />
//       <Text style={[styles.categoryText, selectedCategory === item.name && styles.selectedCategoryText]}>
//         {item.name}
//       </Text>
//     </TouchableOpacity>
//   ), [selectedCategory]);

//   const renderItemCard = useCallback(({ item }: { item: { id: string; name: string; quantity: string;image: any } }) => (     
//     <View style={styles.itemCard}>
//       <TouchableOpacity
//         onPress={() => navigation.navigate('LotReportScreen',  {item : item})}>
//       <Image 
//         source={typeof item.image === 'number' ? item.image : { uri: item.image }} 
//         style={styles.itemImage} 
//       />
//       </TouchableOpacity>
//       <View style={styles.itemInfo}>
//         <Text style={styles.itemName}>{item.name}</Text>
//         <Text style={styles.itemQuantity}>Available: {item.quantity}</Text>
//         <View style={styles.itemPriceContainer}>
//           <TouchableOpacity 
//             style={styles.addButton}
//             onPress={() => { 
//               setSelectedItem(item);
//               setModalVisible(true);
//             }}
//           >
//             <Text style={styles.addButtonText}>ADD</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
     
//   ), []);

//   return (     
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>        
//         <View style={styles.categoriesContainer}>
//           <FlatList
//             data={categories}
//             renderItem={renderCategoryItem}
//             keyExtractor={(item) => item.id}
//             scrollEnabled={true}        
//             showsVerticalScrollIndicator={false}   
             
//           />
//         </View>
//         <View style={styles.itemsContainer}>
//           <FlatList
//             data={itemsData[selectedCategory as keyof typeof itemsData]}
//             renderItem={renderItemCard}
//             keyExtractor={(item) => item.id}
//             showsVerticalScrollIndicator={false}
//           />
//         </View>
//       </View>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Enter Quantity:</Text>
//             <View style={styles.modalInputContainer}>
//               <TextInput
//                 style={styles.quantityInput}
//                 keyboardType="numeric"
//                 value={quantity}
//                 onChangeText={setQuantity}
//               />
//               <TouchableOpacity style={styles.modalAddButton} onPress={handleAddToCart}>
//                 <Text style={styles.modalAddButtonText}>Add</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>     
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },       
//   content: {
//     flex: 1,
//     flexDirection: 'row',     
//   },
//   categoriesContainer: {
//     width: '32%',
//     maxHeight:'100%' // Adjust this value to change the width of the category list
//     // borderRightWidth: 1,
//     // borderRightColor: '#e0e0e0',

//   },
//   categoryItem: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     padding: 13,     
//     backgroundColor:'#fff'  ,
//     elevation:1   
//   },
//   selectedCategoryItem: {
//     backgroundColor: '#f0f0f0',
//   },
//   categoryIcon: {
//     width: 40,
//     height: 40,
//     marginRight: 8,
//     borderRadius: 8,
//   },
//   categoryText: {
//     fontSize: 14,
//   },
//   selectedCategoryText: {
//     fontWeight: 'bold',
//   },
//   itemsContainer: {
//     flex: 1,
//     padding: 16,
//   },
//   itemCard: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     borderColor:"white",
//     elevation: 3,
//   },
//   itemImage: {
//     width: 80,
//     height: 80,
//     resizeMode: 'contain',
//     marginRight: 15,
//     borderRadius:25,     
//   },
//   itemInfo: {
//     flex: 1,
//   },
//   itemDeliveryTime: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 4,
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   itemQuantity: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   itemPriceContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   itemPrice: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   addButton: {
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: '#4CAF50',
//     marginLeft:50,
//   },
//   addButtonText: {
//     color: '#4CAF50',
//     fontWeight: 'bold',
//     fontSize: 14,
    
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     width: '70%', // Increased width
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     marginLeft:-100
//   },
//   modalInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   quantityInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     flex: 1,
//     marginRight: 10,
//   },
//   modalAddButton: {
//     backgroundColor: '#F48226',
//     padding: 10,
//     borderRadius: 5,
//     width: 80,
//     alignItems: 'center',
//   },
//   modalAddButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default Category;

// function addToCart(arg0: any) {
//   throw new Error('Function not implemented.');
// }


// import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// import axios from 'axios';
// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   Dimensions,
//   FlatList,
//   Image,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity
// } from 'react-native';
// import { getImage } from '../utils/imageLoader';

// type RootStackParamList = {
//   Category: { category: string };
// };

// type CategoryScreenRouteProp = RouteProp<RootStackParamList, 'Category'>;

// type CategoryItem = {
//   imageUrl: any;
//   CATID: string;
//   CATCODE: string;
//   CATDESC: string;
//   CAT_IMGFILE: string;
// };

// const { width } = Dimensions.get('window');

// const Category: React.FC = () => {
//   const navigation = useNavigation();
//   const route = useRoute<CategoryScreenRouteProp>();
//   const [categories, setCategories] = useState<CategoryItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchCategories();
//   }, [route.params.category]);

//   const fetchCategories = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         'http://192.168.1.3:3000/sf/getItemCatSubCat',
//         {
//           category: route.params.category,
//         }
//       );

//       if (response.data && response.data.output) {
//         const uniqueCategories = response.data.output.reduce(
//           (acc: CategoryItem[], current: CategoryItem) => {
//             const x = acc.find((item) => item.CATID === current.CATID);
//             if (!x) {
//               return acc.concat([current]);
//             } else {
//               return acc;
//             }
//           },
//           []
//         );

//         setCategories(uniqueCategories);
//       }
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [route.params.category]);

//   const renderCategoryItem = ({ item }: { item: CategoryItem }) => {
//     const imageSource = getImage(item.CAT_IMGFILE);

//     return (
//       <TouchableOpacity style={styles.card}>
//         <Image
//           source={imageSource}
//           style={styles.cardImage}
//           resizeMode="contain"
//           onError={() => console.warn(`Failed to load image: ${item.CAT_IMGFILE}`)}
//         />
//         <Text style={styles.cardText}>{item.CATDESC}</Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <FlatList
//         data={categories}
//         renderItem={renderCategoryItem}
//         numColumns={2}
//         keyExtractor={(item) => item.CATID}
//         contentContainerStyle={styles.cardContainer}
//         onRefresh={fetchCategories}
//         refreshing={loading}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   cardContainer: {
//     padding: 10,
//   },
//   card: {
//     flex: 1,
//     margin: 5,
//     backgroundColor: '#f8f8f8',
//     borderRadius: 10,
//     overflow: 'hidden',
//     alignItems: 'center',
//   },
//   cardImage: {
//     width: width / 2.5,
//     height: width / 2.5,
//   },
//   cardText: {
//     marginTop: 10,
//     marginBottom: 10,
//     fontSize: 16,
//     color: '#333',
//   },
// });

// export default Category;


// import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// import axios from 'axios';
// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   Alert,
//   Dimensions,
//   FlatList,
//   Image,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { getImage } from '../utils/imageLoader';

// type RootStackParamList = {
//   Category: { 
//     customerId: string;
//   };
   
 
// };

// type CategoryScreenRouteProp = RouteProp<RootStackParamList, 'Category'>;

// type SubCategoryItem = {
//   SUBCATID: string;
//   SUBCATCODE: string;
//   SUBCATDESC: string;
//   SUBCAT_IMGFILE: string;
// };

// const { width } = Dimensions.get('window');

// const Category: React.FC = () => {
//   const navigation = useNavigation();
//   const route = useRoute<CategoryScreenRouteProp>();
//   const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchSubCategories = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post(
//         'http://192.168.1.3:3000/sf/getItemCatSubCat',
//         {
//           CustomerID: route.params.customerId
//         }
//       );

//       if (response.data && response.data.output) {
//         // Extract unique subcategories
//         const uniqueSubCategories = response.data.output.reduce(
//           (acc: SubCategoryItem[], current: any) => {
//             const x = acc.find(item => item.SUBCATID === current.SUBCATID);
//             if (!x) {
//               return acc.concat([{
//                 SUBCATID: current.SUBCATID,
//                 SUBCATCODE: current.SUBCATCODE,
//                 SUBCATDESC: current.SUBCATDESC,
//                 SUBCAT_IMGFILE: current.SUBCAT_IMGFILE
//               }]);
//             }
//             return acc;
//           },
//           []
//         );
//         setSubCategories(uniqueSubCategories);
//       }
//     } catch (error) {
//       console.error('Error fetching subcategories:', error);
//       setError('Failed to load subcategories. Please try again.');
//       Alert.alert(
//         'Error',
//         'Failed to load subcategories. Please try again.',
//         [{ text: 'OK' }]
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [route.params.customerId]);

//   useEffect(() => {
//     fetchSubCategories();
//   }, [fetchSubCategories]);

  
//   const renderSubCategoryItem = ({ item }: { item: SubCategoryItem }) => {
//     const imageSource = getImage(item.SUBCAT_IMGFILE);
    
//     return (
//       <TouchableOpacity 
//         style={styles.card}
//         activeOpacity={0.7}
//         onPress={() => {
//           // You can add any action you want to happen when pressing the subcategory
//           console.log('Selected subcategory:', item.SUBCATDESC);
//         }}
//       >
//         <View style={styles.imageContainer}>
//           <Image
//             source={imageSource}
//             style={styles.cardImage}
//             resizeMode="contain"
//             onError={() => console.warn(`Failed to load image: ${item.SUBCAT_IMGFILE}`)}
//           />
//         </View>
//         <View style={styles.cardContent}>
//           <Text style={styles.categoryCode}>{item.SUBCATCODE}</Text>
//           <Text style={styles.categoryName} numberOfLines={2}>
//             {item.SUBCATDESC}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   // Rest of your code remains the same
//   // ...

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <FlatList
//         data={subCategories}
//         renderItem={renderSubCategoryItem}
//         keyExtractor={(item) => item.SUBCATID}
//         numColumns={2}
//         contentContainerStyle={styles.listContainer}
//         onRefresh={fetchSubCategories}
//         refreshing={loading}
//         ListEmptyComponent={() => (
//           <View style={styles.centerContainer}>
//             <Text style={styles.emptyText}>No subcategories found</Text>
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   listContainer: {
//     padding: 10,
//     flexGrow: 1,
//   },
//   card: {
//     flex: 1,
//     margin: 8,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     overflow: 'hidden',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     maxWidth: (width - 36) / 2,
//   },
//   imageContainer: {
//     backgroundColor: '#f5f5f5',
//     aspectRatio: 1,
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cardImage: {
//     width: '80%',
//     height: '80%',
//   },
//   cardContent: {
//     padding: 12,
//   },
//   categoryCode: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   categoryName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     lineHeight: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//   },
// });

// export default Category;

// import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// import axios from 'axios';
// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   FlatList,
//   Image,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { getImage } from "../utils/imageLoader";

// // Type definitions
// type RootStackParamList = {
//   Category: { 
//     customerId: string;
//   };
//   SubcategoryItems: {
//     subcategoryId: string;
//     subcategoryName: string;
//   };
// };

// type CategoryScreenRouteProp = RouteProp<RootStackParamList, 'Category'>;

// type SubCategoryItem = {
//   SUBCATID: string;
//   SUBCATCODE: string;
//   SUBCATDESC: string;
//   SUBCAT_IMGFILE: string;
// };

// type NavigationProp = {
//   navigate: (screen: string, params: any) => void;
// };

// const { width } = Dimensions.get('window');

// const Category: React.FC = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<CategoryScreenRouteProp>();
//   const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [refreshing, setRefreshing] = useState(false);


//   const fetchSubCategories = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await axios.post(
//         'http://192.168.1.3:3000/sf/getItemCatSubCat',
//         {
//           CustomerID: route.params.customerId
//         }
//       );

//       if (response.data && response.data.output) {
//         // Extract unique subcategories using a Map to ensure uniqueness
//         const uniqueMap = new Map();
//         response.data.output.forEach((item: SubCategoryItem) => {
//           if (!uniqueMap.has(item.SUBCATID)) {
//             uniqueMap.set(item.SUBCATID, {
//               SUBCATID: item.SUBCATID,
//               SUBCATCODE: item.SUBCATCODE,
//               SUBCATDESC: item.SUBCATDESC,
//               SUBCAT_IMGFILE: item.SUBCAT_IMGFILE
//             });
//           }
//         });
        
//         const uniqueSubCategories = Array.from(uniqueMap.values());
//         setSubCategories(uniqueSubCategories);
//       } else {
//         setError('No data received from server');
//       }
//     } catch (err) {
//       console.error('Error fetching subcategories:', err);
//       setError('Failed to load subcategories');
//       Alert.alert(
//         'Error',
//         'Failed to load subcategories. Please try again.',
//         [{ text: 'OK' }]
//       );
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [route.params.customerId]);

//   useEffect(() => {
//     fetchSubCategories();
//   }, [fetchSubCategories]);

//   const handleRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchSubCategories();
//   }, [fetchSubCategories]);

//   const handleSubCategoryPress = useCallback((item: SubCategoryItem) => {
//     navigation.navigate('SubcategoryItems', {
//       subcategoryId: item.SUBCATID,
//       subcategoryName: item.SUBCATDESC
//     });
//   }, [navigation]);

//   // const getImageSource = useCallback((imageName: string) => {
//   //   // Handle image loading based on your requirements
//   //   if (!imageName) {
//   //     return require('../assets/placeholder.png'); // Make sure to add a placeholder image
//   //   }
    
//   //   // If using remote images, construct the URL
//   //   return {
//   //     uri: `YOUR_IMAGE_BASE_URL/${imageName}`,
//   //     headers: {
//   //       // Add any required headers for image loading
//   //       Authorization: 'YOUR_AUTH_TOKEN'
//   //     }
//   //   };
//   // }, []);

//   const renderSubCategoryItem = useCallback(({ item }: { item: SubCategoryItem }) => {
//     const imageSource = getImage(item.SUBCAT_IMGFILE);
//     return (
//       <TouchableOpacity 
//         style={styles.card}
//         activeOpacity={0.7}
//         onPress={() => handleSubCategoryPress(item)}
//       >
//         <View style={styles.imageContainer}>
//           <Image
//             source={imageSource(item.SUBCAT_IMGFILE)}
//             style={styles.cardImage}
//             resizeMode="contain"
//             onError={() => console.warn(`Failed to load image: ${item.SUBCAT_IMGFILE}`)}
//           />
//         </View>
//         <View style={styles.cardContent}>
//           <Text style={styles.categoryCode}>{item.SUBCATCODE}</Text>
//           <Text style={styles.categoryName} numberOfLines={2}>
//             {item.SUBCATDESC}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   }, [handleSubCategoryPress]);

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <FlatList
//         data={subCategories}
//         renderItem={renderSubCategoryItem}
//         keyExtractor={(item) => item.SUBCATID}
//         numColumns={2}
//         contentContainerStyle={styles.listContainer}
//         onRefresh={handleRefresh}
//         refreshing={refreshing}
//         ListEmptyComponent={() => (
//           <View style={styles.centerContainer}>
//             <Text style={styles.emptyText}>
//               {error || 'No subcategories found'}
//             </Text>
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   listContainer: {
//     padding: 10,
//     flexGrow: 1,
//   },
//   card: {
//     flex: 1,
//     margin: 8,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     overflow: 'hidden',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     maxWidth: (width - 36) / 2,
//   },
//   imageContainer: {
//     backgroundColor: '#f5f5f5',
//     aspectRatio: 1,
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cardImage: {
//     width: '80%',
//     height: '80%',
//   },
//   cardContent: {
//     padding: 12,
//   },
//   categoryCode: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   categoryName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     lineHeight: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//   },
// });

// export default Category;


// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// import axios from 'axios';
// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   FlatList,
//   Image,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';


// const BACKEND_URL = "http://192.168.1.3:3000";

// // Type definitions
// type RootStackParamList = {
//   Category: { 
//     category: string;
//   };
//   SubcategoryItems: {
//     subcategoryId: string;
//     subcategoryName: string;
//     subcatImgFile:string;
//   };
//   ItemDetailScreen:undefined;
// };

// type CategoryScreenRouteProp = RouteProp<RootStackParamList, 'Category'>;

// type SubCategoryItem = {
//   CAT_ID: string;
//   CATDESC:string;
//   SUBCATID: string;
//   SUBCATCODE: string;
//   SUBCATDESC: string;
//   SUBCAT_IMGFILE: string;
// };

// type NavigationProp = {
//   navigate: (screen: string, params: any) => void;
// };

// const { width } = Dimensions.get('window');

// const Category: React.FC = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<CategoryScreenRouteProp>();
//   const [CustomerID, setCustomerID] = useState<string | null>(null);
//   const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(route.params.category); // Use category from route params

//   // Fetch CustomerID from AsyncStorage
//   useEffect(() => {
//     const fetchCustomerID = async () => {
//       try {
//         let id = await AsyncStorage.getItem("customerID");
//         if (id) {
//           setCustomerID(id);
//           await AsyncStorage.setItem("customerID", id);
//         } else {
//           const response = await axios.get(`${BACKEND_URL}/getCustomerID`);
//           id = response.data.customerID;
//           setCustomerID(id);
//           await AsyncStorage.setItem("customerID", id || "");
//         }
//       } catch (error) {
//         console.error("Error fetching CustomerID:", error);
//         setError("Failed to fetch Customer ID");
//       }
//     };

//     fetchCustomerID();
//   }, []);

//   const fetchSubCategories = useCallback(async () => {
//     if (!CustomerID || !selectedCategory) {
//       console.log("Waiting for CustomerID or selected category...");
      
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const response = await axios.post(
//         `${BACKEND_URL}/sf/getItemCatSubCat`,
//         {
//           CustomerID: CustomerID
//         },
//         {
//           timeout: 10000
//         }
//       );

//       // console.log("Response received:", response.data);

//       if (response.data && response.data.output) {
//         // Filter subcategories based on the selected category
//         const filteredSubCategories = response.data.output.filter((item: SubCategoryItem) => {
//           return item.CATDESC === selectedCategory; // Filter based on category description
//         });

//         // Extract unique subcategories using a Map to ensure uniqueness
//         const uniqueMap = new Map();
//         filteredSubCategories.forEach((item: SubCategoryItem) => {
//           if (!uniqueMap.has(item.SUBCATID)) {
//             uniqueMap.set(item.SUBCATID, {
//               SUBCATID: item.SUBCATID,
//               SUBCATCODE: item.SUBCATCODE,
//               SUBCATDESC: item.SUBCATDESC,
//               SUBCAT_IMGFILE: item.SUBCAT_IMGFILE
//             });
//           }
//         });

//         const uniqueSubCategories = Array.from(uniqueMap.values());
//         setSubCategories(uniqueSubCategories);
//         // console.log("Filtered subcategories set:", uniqueSubCategories);
//       } else {
//         setError('No data received from server');
//       }
//     } catch (err) {
//       console.error('Error fetching subcategories:', err);
//       if (axios.isAxiosError(err)) {
//         if (err.response) {
//           console.error("Error data:", err.response.data);
//           console.error("Error status:", err.response.status);
//           setError(`Server error: ${err.response.status}`);
//         } else if (err.request) {
//           console.error("Error request:", err.request);
//           setError('Network error. Please check your connection.');
//         } else {
//           console.error("Error message:", err.message);
//           setError('An unexpected error occurred');
//         }
//       } else {
//         setError('Failed to load subcategories');
//       }
//       Alert.alert(
//         'Error',
//         'Failed to load subcategories. Please try again.',
//         [{ text: 'OK' }]
//       );
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [CustomerID, selectedCategory]); // Add selectedCategory as a dependency

//   // Fetch subcategories when CustomerID or selectedCategory is available
//   useEffect(() => {
//     if (CustomerID) {
//       fetchSubCategories();
//     }
//   }, [CustomerID, fetchSubCategories, selectedCategory]);

//   const handleRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchSubCategories();
//   }, [fetchSubCategories]);

//   const handleSubCategoryPress = useCallback((item: SubCategoryItem) => {
//   navigation.navigate('ItemDetailScreen', {
//   subcategoryId: item.SUBCATID,
//   subcategoryName: item.SUBCATDESC,
//   subcatImgFile: item.SUBCAT_IMGFILE
// });
//   }, [navigation]);

//   const renderSubCategoryItem = useCallback(({ item }: { item: SubCategoryItem }) => {
//     // const imageSource = getImage(item.SUBCAT_IMGFILE);
    
//     // console.log("Rendering item:", item.SUBCATDESC, "with image:", item.SUBCAT_IMGFILE);
    
//     return (
    
//       <TouchableOpacity 
//         style={styles.card}
//         activeOpacity={0.7}
//         onPress={() => handleSubCategoryPress(item)}
//       >
//         <View style={styles.imageContainer}>
//           <Image
//             // source={imageSource}
//             style={styles.cardImage}
//             resizeMode="contain"
//             onError={() => console.warn(`Failed to load image: ${item.SUBCAT_IMGFILE}`)}
//           />
//         </View>
//         <View style={styles.cardContent}>
//           <Text style={styles.categoryCode}>{item.SUBCATCODE}</Text>
//           <Text style={styles.categoryName} numberOfLines={2}>
//             {item.SUBCATDESC}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   }, [handleSubCategoryPress]);

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <FlatList
//         data={subCategories}
//         renderItem={renderSubCategoryItem}
//         keyExtractor={(item) => item.SUBCATID}
//         numColumns={2}
//         contentContainerStyle={styles.listContainer}
//         onRefresh={handleRefresh}
//         refreshing={refreshing}
//         ListEmptyComponent={() => (
//           <View style={styles.centerContainer}>
//             <Text style={styles.emptyText}>
//               {error || 'No subcategories found'}
//             </Text>
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff'
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   listContainer: {
//     padding: 10
//   },
//   card: {
//     flex: 1,
//     margin: 5,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     maxWidth: (width - 30) / 2,
//   },
//   imageContainer: {
//     height: 120,
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//     overflow: 'hidden'
//   },
//   cardImage: {
//     width: '100%',
//     height: '100%'
//   },
//   cardContent: {
//     padding: 10
//   },
//   categoryCode: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 4
//   },
//   categoryName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333'
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666'
//   }
// });

// export default Category;
  

 

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// import axios from 'axios';
// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Dimensions,
//   FlatList,
//   Image,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { getImage } from "../utils/imageLoader";

// const BACKEND_URL = "http://192.168.1.3:3000";

// // Type definitions
// type RootStackParamList = {
//   Category: { 
//     category: string;
//     categoryId: string; // Add categoryId to identify the category
//   };
//   SubcategoryItems: {
//     subcategoryId: string;
//     subcategoryName: string;
//   };
// };

// type CategoryScreenRouteProp = RouteProp<RootStackParamList, 'Category'>;

// type SubCategoryItem = {
//   CAT_ID: string;
//   SUBCATID: string;
//   SUBCATCODE: string;
//   SUBCATDESC: string;
//   SUBCAT_IMGFILE: string;
// };

// type NavigationProp = {
//   navigate: (screen: string, params: any) => void;
// };

// const { width } = Dimensions.get('window');

// const Category: React.FC = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<CategoryScreenRouteProp>();
//   const [CustomerID, setCustomerID] = useState<string | null>(null);
//   const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const { categoryId, category } = route.params;

//   // Fetch CustomerID from AsyncStorage
//   useEffect(() => {
//     const fetchCustomerID = async () => {
//       try {
//         let id = await AsyncStorage.getItem("customerID");
//         if (id) {
//           setCustomerID(id);
//           await AsyncStorage.setItem("customerID", id);
//         } else {
//           const response = await axios.get("http://192.168.1.3/getCustomerID");
//           id = response.data.customerID;
//           setCustomerID(id);
//           await AsyncStorage.setItem("customerID", id || "");
//         }
//       } catch (error) {
//         console.error("Error fetching CustomerID:", error);
//         setError("Failed to fetch Customer ID");
//       }
//     };

//     fetchCustomerID();
//   }, []);

//   const fetchSubCategories = useCallback(async () => {
//     if (!CustomerID) {
//       console.log("Waiting for CustomerID...");
//       return;
//     }
  
//     try {
//       setLoading(true);
//       setError(null);
  
//       // Log the category being fetched
//       // console.log("Fetching subcategories for categoryId:", categoryId);\
//       console.log("Making request with CustomerID:", CustomerID);
//       console.log("Current categoryId:", categoryId);
  
//       const response = await axios.post(
//         `${BACKEND_URL}/sf/getItemCatSubCat`,
//         {
//           CustomerID: CustomerID
//         },
//         {
//           timeout: 10000
//         }
//       );
  
//       console.log("Response received:", response.data);
  
//       if (response.data && response.data.output) {
//         // Filter subcategories based on selected category ID
//         const filteredSubCategories = response.data.output.filter(
          
//           (item: SubCategoryItem) => item.CAT_ID === categoryId
//         );
  
//         // Extract unique subcategories
//         const uniqueMap = new Map();
//         filteredSubCategories.forEach((item: SubCategoryItem) => {
//           if (!uniqueMap.has(item.SUBCATID)) {
//             uniqueMap.set(item.SUBCATID, {
//               ...item, // Preserve all item properties
//               SUBCATID: item.SUBCATID,
//               SUBCATCODE: item.SUBCATCODE,
//               SUBCATDESC: item.SUBCATDESC,
//               SUBCAT_IMGFILE: item.SUBCAT_IMGFILE
//             });
//           }
//         });
  
//         const uniqueSubCategories = Array.from(uniqueMap.values());
//         console.log(`Found ${uniqueSubCategories.length} subcategories for category ${categoryId}`);
//         setSubCategories(uniqueSubCategories);
//       } else {
//         setError('No data received from server');
//       }
//     } catch (err) {
//       // ... rest of your existing error handling code ...
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [CustomerID, categoryId]);

//   // const fetchSubCategories = useCallback(async () => {
//   //   if (!CustomerID) {
//   //     console.log("Waiting for CustomerID...");
//   //     return;
//   //   }

//   //   try {
//   //     setLoading(true);
//   //     setError(null);

//   //     const response = await axios.post(
//   //       `${BACKEND_URL}/sf/getItemCatSubCat`,
//   //       {
//   //         CustomerID: CustomerID
//   //       },
//   //       {
//   //         timeout: 10000
//   //       }
//   //     );

//   //     console.log("Response received:", response.data);

//   //     if (response.data && response.data.output) {
//   //       // Filter subcategories based on selected category ID
//   //       const filteredSubCategories = response.data.output.filter(
//   //         (item: SubCategoryItem) => item.CAT_ID === categoryId
//   //       );

//   //       // Extract unique subcategories using a Map to ensure uniqueness
//   //       const uniqueMap = new Map();
//   //       filteredSubCategories.forEach((item: SubCategoryItem) => {
//   //         if (!uniqueMap.has(item.SUBCATID)) {
//   //           uniqueMap.set(item.SUBCATID, {
//   //             SUBCATID: item.SUBCATID,
//   //             SUBCATCODE: item.SUBCATCODE,
//   //             SUBCATDESC: item.SUBCATDESC,
//   //             SUBCAT_IMGFILE: item.SUBCAT_IMGFILE
//   //           });
//   //         }
//   //       });

//   //       const uniqueSubCategories = Array.from(uniqueMap.values());
//   //       setSubCategories(uniqueSubCategories);
//   //       console.log("Subcategories set:", uniqueSubCategories);
//   //     } else {
//   //       setError('No data received from server');
//   //     }
//   //   } catch (err) {
//   //     console.error('Error fetching subcategories:', err);
//   //     if (axios.isAxiosError(err)) {
//   //       if (err.response) {
//   //         console.error("Error data:", err.response.data);
//   //         console.error("Error status:", err.response.status);
//   //         setError(`Server error: ${err.response.status}`);
//   //       } else if (err.request) {
//   //         console.error("Error request:", err.request);
//   //         setError('Network error. Please check your connection.');
//   //       } else {
//   //         console.error("Error message:", err.message);
//   //         setError('An unexpected error occurred');
//   //       }
//   //     } else {
//   //       setError('Failed to load subcategories');
//   //     }
//   //     Alert.alert(
//   //       'Error',
//   //       'Failed to load subcategories. Please try again.',
//   //       [{ text: 'OK' }]
//   //     );
//   //   } finally {
//   //     setLoading(false);
//   //     setRefreshing(false);
//   //   }
//   // }, [CustomerID, categoryId]);

//   // Fetch subcategories when CustomerID is available
//   useEffect(() => {
//     if (CustomerID) {
//       fetchSubCategories();
//     }
//   }, [CustomerID, fetchSubCategories]);

//   const handleRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchSubCategories();
//   }, [fetchSubCategories]);

//   const handleSubCategoryPress = useCallback((item: SubCategoryItem) => {
//     navigation.navigate('SubcategoryItems', {
//       subcategoryId: item.SUBCATID,
//       subcategoryName: item.SUBCATDESC
//     });
//   }, [navigation]);

//   const renderSubCategoryItem = useCallback(({ item }: { item: SubCategoryItem }) => {
//     const imageSource = getImage(item.SUBCAT_IMGFILE);

//     console.log("Rendering item:", item.SUBCATDESC, "with image:", item.SUBCAT_IMGFILE);

//     return (
//       <TouchableOpacity
//         style={styles.card}
//         activeOpacity={0.7}
//         onPress={() => handleSubCategoryPress(item)}
//       >
//         <View style={styles.imageContainer}>
//           <Image
//             source={imageSource}
//             style={styles.cardImage}
//             resizeMode="contain"
//             onError={() => console.warn(`Failed to load image: ${item.SUBCAT_IMGFILE}`)}
//           />
//         </View>
//         <View style={styles.cardContent}>
//           <Text style={styles.categoryCode}>{item.SUBCATCODE}</Text>
//           <Text style={styles.categoryName} numberOfLines={2}>
//             {item.SUBCATDESC}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   }, [handleSubCategoryPress]);

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <FlatList
//         data={subCategories}
//         renderItem={renderSubCategoryItem}
//         keyExtractor={(item) => item.SUBCATID}
//         numColumns={2}
//         contentContainerStyle={styles.listContainer}
//         onRefresh={handleRefresh}
//         refreshing={refreshing}
//         ListEmptyComponent={() => (
//           <View style={styles.centerContainer}>
//             <Text style={styles.emptyText}>
//               {error || 'No subcategories found'}
//             </Text>
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff'
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   listContainer: {
//     padding: 10
//   },
//   card: {
//     flex: 1,
//     margin: 5,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     maxWidth: (width - 30) / 2,
//   },
//   imageContainer: {
//     height: 120,
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//     overflow: 'hidden'
//   },
//   cardImage: {
//     width: '100%',
//     height: '100%'
//   },
//   cardContent: {
//     padding: 10
//   },
//   categoryCode: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 4
//   },
//   categoryName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333'
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center'
//   }
// });

// export default Category;
 
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { fetchImageMappings, formatImageName, getSubcategoryImage, ImageMapping } from '../utils/imageRegistry';
import { useCart } from './contexts/CartContext';

const BACKEND_URL = "http://192.168.1.3:3000";

type RootStackParamList = {
  SubCategory: { 
    category: string;
    categoryId: string;
  };
  ItemDetailScreen: {
    subcategoryId: string;
    subcategoryName: string;
    subcategoryImage: string;
  };
};

type SubCategoryScreenRouteProp = RouteProp<RootStackParamList, 'SubCategory'>;

type SubCategoryItem = {
  CATID: string;
  CATDESC: string;
  SUBCATID: string;
  SUBCATCODE: string;
  SUBCATDESC: string;
  subcategoryImage: string;
  imageUrl: any;
};

type NavigationProp = {
  navigate: (screen: string, params: any) => void;
};

const { width } = Dimensions.get('window');

const SubCategory: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SubCategoryScreenRouteProp>();
  const [CustomerID, setCustomerID] = useState<string | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [imageMappings, setImageMappings] = useState<{
    categories: ImageMapping[];
    subcategories: ImageMapping[];
  }>({ categories: [], subcategories: [] });

  const { cart } = useCart();
  const cartItemCount = cart.length;

  // Fetch images mappings
  useEffect(() => {
    const loadImageMappings = async () => {
      const mappings = await fetchImageMappings();
      setImageMappings(mappings);
    };
    loadImageMappings();
  }, []);

  // Fetch CustomerID from AsyncStorage
  useEffect(() => {
    const fetchCustomerID = async () => {
      try {
        let id = await AsyncStorage.getItem("customerID");
        if (id) {
          setCustomerID(id);
        } else {
          const response = await axios.get(`${BACKEND_URL}/getCustomerID`);
          id = response.data.customerID;
          if (id) {
            setCustomerID(id);
            await AsyncStorage.setItem("customerID", id);
          }
        }
      } catch (error) {
        console.error("Error fetching CustomerID:", error);
        setError("Failed to fetch Customer ID");
      }
    };

    fetchCustomerID();
  }, []);

  // Fetch subcategories
  useEffect(() => {
    if (CustomerID && route.params.categoryId) {
      fetchSubCategories();
    }
  }, [CustomerID, route.params.categoryId]);

  const fetchSubCategories = useCallback(async () => {
    if (!CustomerID || !route.params.categoryId) {
      console.log("Waiting for CustomerID or categoryId...");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${BACKEND_URL}/sf/getItemCatSubCat`,
        {
          CustomerID: CustomerID
        },
        {
          timeout: 10000
        }
      );

      if (response.data && response.data.output) {
        // console.log('Total items received:', response.data.output.length);
        // console.log('Category ID to filter:', route.params.categoryId);

        const filteredSubCategories = response.data.output.filter((item: SubCategoryItem) => 
          item.CATID === route.params.categoryId
        );

        // console.log('Filtered subcategories:', filteredSubCategories.length);

        const uniqueSubCategories = filteredSubCategories.map((item: SubCategoryItem) => ({
          ...item,
          subcategoryImage: formatImageName(item.SUBCATID, false),
          imageUrl: getSubcategoryImage(item.SUBCATID)
        }));

        setSubCategories(uniqueSubCategories);
        setFilteredSubCategories(uniqueSubCategories);
      } else {
        setError('No data received from server');
      }
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(`Server error: ${err.response.status}`);
        } else if (err.request) {
          setError('Network error. Please check your connection.');
        } else {
          setError('An unexpected error occurred');
        }
      } else {
        setError('Failed to load subcategories');
      }
      Alert.alert(
        'Error',
        'Failed to load subcategories. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [CustomerID, route.params.categoryId]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    const filtered = subCategories.filter((subcategory) =>
      subcategory.SUBCATDESC.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredSubCategories(filtered);
  }, [subCategories]);

  const handleSubCategoryPress = useCallback((item: SubCategoryItem) => {
    navigation.navigate('ItemDetailScreen', {
      subcategoryId: item.SUBCATID,
      subcategoryName: item.SUBCATDESC,
      subcategoryImage: item.subcategoryImage,
      
    });
  }, [navigation]);
   

  const renderSubCategoryItem = useCallback(({ item }: { item: SubCategoryItem }) => {
    return (
      <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => handleSubCategoryPress(item)}
      >
        <View style={styles.imageContainer}>
          <Image
            source={item.imageUrl}
            style={styles.cardImage}
            resizeMode="contain"
            onError={(error) => {
              console.warn(`Failed to load image for subcategory ${item.SUBCATID}:`, error);
            }}
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.categoryCode}>{item.SUBCATCODE}</Text>
          <Text style={styles.categoryName} numberOfLines={2}>
            {item.SUBCATDESC}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, [handleSubCategoryPress]);

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ddd" />
      {/* <Header title={route.params.category} cartItemCount={cartItemCount} /> */}

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search subcategories..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton}>
          <MaterialIcons name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredSubCategories}
        renderItem={renderSubCategoryItem}
        keyExtractor={(item) => item.SUBCATID}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        onRefresh={fetchSubCategories}
        refreshing={refreshing}
        ListEmptyComponent={() => (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>
              {error || 'No subcategories found'}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  listContainer: {
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxWidth: (width - 30) / 2,
  },
  imageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 10,
  },
  categoryCode: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default SubCategory;

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// import axios from 'axios';
// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   FlatList,
//   Image,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { fetchImageMappings, formatImageName, getSubcategoryImage, ImageMapping } from '../utils/imageUtils';

// const BACKEND_URL = "http://192.168.1.3:3000";

// type RootStackParamList = {
//   Category: { 
//     category: string;
//   };
//   SubcategoryItems: {
//     subcategoryId: string;
//     subcategoryName: string;
//     subcategoryImage: string;
//   };
//   ItemDetailScreen: undefined;
// };

// type SubCategoryScreenRouteProp = RouteProp<RootStackParamList, 'SubcategoryItems'>;

// type SubCategoryItem = {
//   CAT_ID: string;
//   CATDESC: string;
//   SUBCATID: string;
//   SUBCATCODE: string;
//   SUBCATDESC: string;
//   subcategoryImage: string;
//   imageUrl: any;
// };

// type NavigationProp = {
//   navigate: (screen: string, params: any) => void;
// };

// const { width } = Dimensions.get('window');

// const Category: React.FC = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const route = useRoute<SubCategoryScreenRouteProp>();
//   const [CustomerID, setCustomerID] = useState<string | null>(null);
//   const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(route.params.subcategoryName);
//   const [imageMappings, setImageMappings] = useState<{
//     categories: ImageMapping[];
//     subcategories: ImageMapping[];
//   }>({ categories: [], subcategories: [] });

//   // Fetch images mappings
//   useEffect(() => {
//     const loadImageMappings = async () => {
//       const mappings = await fetchImageMappings();
//       setImageMappings(mappings);
//     };
//     loadImageMappings();
//   }, []);

//   // Fetch CustomerID from AsyncStorage
//   useEffect(() => {
//     const fetchCustomerID = async () => {
//       try {
//         let id = await AsyncStorage.getItem("customerID");
//         if (id) {
//           setCustomerID(id);
//         } else {
//           const response = await axios.get(`${BACKEND_URL}/getCustomerID`);
//           id = response.data.customerID;
//           if (id) {
//             setCustomerID(id);
//             await AsyncStorage.setItem("customerID", id);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching CustomerID:", error);
//         setError("Failed to fetch Customer ID");
//       }
//     };

//     fetchCustomerID();
//   }, []);

//   // Fetch subcategories
//   useEffect(() => {
//     if (CustomerID && route.params.subcategoryId) {
//       fetchSubCategories();
//     }
//   }, [CustomerID, route.params.subcategoryId]);

//   const fetchSubCategories = useCallback(async () => {
//     if (!CustomerID || !route.params.subcategoryId) {
//       console.log("Waiting for CustomerID or subcategoryId...");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const response = await axios.post(
//         `${BACKEND_URL}/sf/getItemCatSubCat`,
//         {
//           CustomerID: CustomerID
//         },
//         {
//           timeout: 10000
//         }
//       );

//       if (response.data && response.data.output) {
//         const filteredSubCategories = response.data.output.filter((item: SubCategoryItem) => 
//           item.SUBCATID === route.params.subcategoryId
//         );

//         const uniqueSubCategories = filteredSubCategories.map((item: SubCategoryItem) => ({
//           ...item,
//           subcategoryImage: formatImageName(item.SUBCATID, true),
//           imageUrl: getSubcategoryImage(item.SUBCATID)
//         }));

//         setSubCategories(uniqueSubCategories);
//       } else {
//         setError('No data received from server');
//       }
//     } catch (err) {
//       console.error('Error fetching subcategories:', err);
//       if (axios.isAxiosError(err)) {
//         if (err.response) {
//           setError(`Server error: ${err.response.status}`);
//         } else if (err.request) {
//           setError('Network error. Please check your connection.');
//         } else {
//           setError('An unexpected error occurred');
//         }
//       } else {
//         setError('Failed to load subcategories');
//       }
//       Alert.alert(
//         'Error',
//         'Failed to load subcategories. Please try again.',
//         [{ text: 'OK' }]
//       );
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [CustomerID, route.params.subcategoryId]);

//   const handleRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchSubCategories();
//   }, [fetchSubCategories]);

//   const handleSubCategoryPress = useCallback((item: SubCategoryItem) => {
//     navigation.navigate('ItemDetailScreen', {
//       subcategoryId: item.SUBCATID,
//       subcategoryName: item.SUBCATDESC,
//       subcategoryImage: item.subcategoryImage
//     });
//   }, [navigation]);

//   const renderSubCategoryItem = useCallback(({ item }: { item: SubCategoryItem }) => {
//     const imageSource = getSubcategoryImage(item.SUBCATID, imageMappings.subcategories);
    
//     return (
//       <TouchableOpacity 
//         style={styles.card}
//         activeOpacity={0.7}
//         onPress={() => handleSubCategoryPress(item)}
//       >
//         <View style={styles.imageContainer}>
//           <Image
//             source={imageSource}
//             style={styles.cardImage}
//             resizeMode="contain"
//             onError={(error) => {
//               console.warn(`Failed to load image for subcategory ${item.SUBCATID}:`, error);
//             }}
//           />
//         </View>
//         <View style={styles.cardContent}>
//           <Text style={styles.categoryCode}>{item.SUBCATCODE}</Text>
//           <Text style={styles.categoryName} numberOfLines={2}>
//             {item.SUBCATDESC}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   }, [handleSubCategoryPress, imageMappings.subcategories]);

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <FlatList
//         data={subCategories}
//         renderItem={renderSubCategoryItem}
//         keyExtractor={(item) => item.SUBCATID}
//         numColumns={2}
//         contentContainerStyle={styles.listContainer}
//         onRefresh={handleRefresh}
//         refreshing={refreshing}
//         ListEmptyComponent={() => (
//           <View style={styles.centerContainer}>
//             <Text style={styles.emptyText}>
//               {error || 'No subcategories found'}
//             </Text>
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// };


// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContainer: {
//     padding: 10,
//   },
//   card: {
//     flex: 1,
//     margin: 5,
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     maxWidth: (width - 30) / 2,
//   },
//   imageContainer: {
//     height: 120,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 10,
//   },
//   cardImage: {
//     width: '100%',
//     height: '100%',
//   },
//   cardContent: {
//     padding: 10,
//   },
//   categoryCode: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 4,
//   },
//   categoryName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//   },
// });

// export default Category;