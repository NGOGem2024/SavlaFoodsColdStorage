
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { default as React, useCallback, useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseconfig';
import { getImage } from '../utils/imageLoader';
import Carousel from './Carousel';
import { useCart } from './contexts/CartContext';
import { useDisplayName } from './contexts/DisplayNameContext';

const BACKEND_URL = "http://192.168.1.3:3000";
 

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

type HomeScreenRouteProp = RouteProp<RootStackParamList, "HomeScreen">;
type HomeScreenNavigationProp = NavigationProp<RootStackParamList>;

type CategoryItem = {
  imageUrl: any;
  CATID: string;
  CATCODE: string;
  CATDESC: string;
  CAT_IMGFILE: string;
};

const { width } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const [CustomerID, setCustomerID] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { displayName, setDisplayName } = useDisplayName();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  // const [Disp_name, setDisp_name] = useState<string | null>(null);
  const [filteredCategories, setFilteredCategories] = useState<CategoryItem[]>(
    []
  );
  const [showAllCards, setShowAllCards] = useState(false);
  const { cart } = useCart();
  const cartItemCount = cart.length;
   
  // useEffect(() => {
  //   const fetchCustomerInfo = async () => {
  //     try {
  //       let id = await AsyncStorage.getItem("customerID");
  //       let name = await AsyncStorage.getItem("Disp_name");
  //       if (id && name) {
  //         setCustomerID(id);
  //         setDisp_name(name);
  //       } else {
  //         const response = await axios.get("http://192.168.1.3/getCustomerID");
  //         id = response.data.customerID;
  //         name = response.data.Disp_name;
  //         setCustomerID(id);
  //         setDisp_name(name);
  //         await AsyncStorage.setItem("customerID", id || "");
  //         await AsyncStorage.setItem("Disp_name", name || "");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching Customer Info:", error);
  //     }
  //   };

  //   fetchCustomerInfo();
  // }, [route.params]);


  
  useEffect(() => {
    const fetchDisplayName = async () => {
      try {
        let name = await AsyncStorage.getItem("Disp_name");
        if (name) {
          setDisplayName(name);
        } else {
          const response = await axios.get(`${BACKEND_URL}/getCustomerInfo`);
          name = response.data.Disp_name;
          setDisplayName(name);
          await AsyncStorage.setItem("Disp_name", name || "");
        }
      } catch (error) {
        console.error("Error fetching Display Name:", error);
      }
    };

    fetchDisplayName();
  }, [route.params]);

  useEffect(() => {
    const fetchCustomerID = async () => {
      try {
        let id = await AsyncStorage.getItem("customerID");
        if (id) {
          setCustomerID(id);
          await AsyncStorage.setItem("customerID", id);
        } else {
          const response = await axios.get("http://192.168.1.3/getCustomerID");
          id = response.data.customerID;
          setCustomerID(id);
          await AsyncStorage.setItem("customerID", id || "");
        }
      } catch (error) {
        console.error("Error fetching CustomerID:", error);
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
      console.log("CustomerID is not set");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/sf/getItemCatSubCat`,
        {
          CustomerID: CustomerID,
        },
        {
          timeout: 10000,
        }
      );

      console.log("Response received:", response.data);

      if (response.data && response.data.output) {
        const uniqueCategories = response.data.output.reduce(
          (acc: CategoryItem[], current: CategoryItem) => {
            const x = acc.find((item) => item.CATID === current.CATID);
            if (!x) {
              console.log(
                `Category: ${current.CATDESC}, CAT_IMGFILE: ${current.CAT_IMGFILE}`
              );
              return acc.concat([current]);
            } else {
              return acc;
            }
          },
          []
        );

        setCategories(uniqueCategories);
        setFilteredCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Error data:", error.response.data);
          console.error("Error status:", error.response.status);
          Alert.alert(
            "Server Error",
            `Error ${error.response.status}: ${
              error.response.data.message || "Unknown error"
            }`
          );
        } else if (error.request) {
          console.error("Error request:", error.request);
          Alert.alert(
            "Network Error",
            "Unable to connect to the server. Please check your internet connection and try again."
          );
        } else {
          console.error("Error message:", error.message);
          Alert.alert(
            "Error",
            "An unexpected error occurred. Please try again."
          );
        }
      } else {
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    }
  }, [CustomerID]);

  const handleLogout = useCallback(async () => {
    try {
      await auth.signOut();
      // await AsyncStorage.removeItem("customerID");
      await AsyncStorage.removeItem("Disp_name");
      navigation.navigate("OtpVerificationScreen");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [navigation]);

  const handleSearch = useCallback(
    (text: string) => {
      setSearchQuery(text);
      const filtered = categories.filter((category) =>
        category.CATDESC.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCategories(filtered);
    },
    [categories]
  );
   
  const renderCardItem = useCallback(
    ({ item }: { item: CategoryItem }) => {
      const imageSource = getImage(item.CAT_IMGFILE);

      console.log(
        "Rendering item:",
        item.CATDESC,
        "with image:",
        item.CAT_IMGFILE
      );

      return (
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate("Category", { category: item.CATDESC })
          }
        >
          <Image
            source={imageSource}
            style={styles.cardImage}
            resizeMode="contain"
            onError={() =>
              console.warn(`Failed to load image: ${item.CAT_IMGFILE}`)
            }
          />
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
          <Image
            source={require("../../assets/New folder/SavlaLogo.png")}
            style={styles.logo}
          />
          <Text style={styles.headerTitle}>UNICORP ENTERPRISES</Text>
        </View>
        <View style={styles.headerRightContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("CartScreen")}
            style={styles.cartButton}
          >
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
      {/* <Text style={styles.id}>Customer ID: {CustomerID || "Loading..."}</Text> */}
      <Text style={styles.welcomeText}>
        {displayName || "Loading..."}
      </Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton}>
          <MaterialIcons name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Carousel />

      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>Categories</Text>
        <TouchableOpacity onPress={() => setShowAllCards(!showAllCards)}>
          <Text style={styles.moreText}>
            {showAllCards ? "Less" : "More->"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={
          showAllCards ? filteredCategories : filteredCategories.slice(0, 6)
        }
        renderItem={renderCardItem}
        numColumns={2}
        keyExtractor={(item) => item.CATID}
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
    marginLeft: -5
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
    marginLeft: 20
  },
  logoutButton: {
    marginHorizontal: 30,   
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,   
    marginBottom: -10 
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
  cardContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  card: {
    width: (width - 40) / 2,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  id:{
    color:'black',
    fontSize:20,
    flexDirection: 'row',
    marginLeft:25
  },
  cardImage: {
    width: '100%',
    height: 85,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  cardText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  moreText: {
    fontSize: 16,
    color: '#F48221',
    fontWeight: 'bold',
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
     
  },
  tabItem: {
    alignItems: 'center',
  },
  welcomeText: {
    marginTop: 5,
    marginLeft: 20,
    fontSize: 20,
    fontWeight: "bold",
    // textAlign:"center",
    // color:"#F48221"
  },
});

export default HomeScreen;


// src/screens/HomeScreen.js(Demo for image fetching)

// import { MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   NavigationProp,
//   RouteProp,
//   useNavigation,
//   useRoute,
// } from "@react-navigation/native";
// import axios from "axios";
// import React, { useCallback, useEffect, useState } from "react";
// import {
//   Alert,
//   Dimensions,
//   FlatList,
//   Image,
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { auth } from "../../firebaseconfig";
// import { getImage } from "../utils/imageLoader";
// import { useCart } from "./contexts/CartContext";

// const BACKEND_URL = "http://192.168.1.3:3000";

// type RootStackParamList = {
//   // Add your other screen params here
//   HomeScreen: { customerID?: string };
//   Category: { category: string };
//   Stocks: undefined;
//   Inwards: undefined;
//   Outwards: undefined;
//   ExpiringProducts: undefined;
//   Invoices: undefined;
//   OrderPlacement: undefined;
//   ProductSearch: undefined;
//   OtpVerificationScreen: undefined;
//   CartScreen: undefined;
// };

// type HomeScreenRouteProp = RouteProp<RootStackParamList, "HomeScreen">;
// type HomeScreenNavigationProp = NavigationProp<RootStackParamList>;

// type CategoryItem = {
//   imageUrl: any;
//   CATID: string;
//   CATCODE: string;
//   CATDESC: string;
//   CAT_IMGFILE: string;
// };

// const { width } = Dimensions.get("window");

// const HomeScreen: React.FC = () => {
//   const navigation = useNavigation<HomeScreenNavigationProp>();
//   const route = useRoute<HomeScreenRouteProp>();
//   const [CustomerID, setCustomerID] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [categories, setCategories] = useState<CategoryItem[]>([]);
//   const [filteredCategories, setFilteredCategories] = useState<CategoryItem[]>(
//     []
//   );
//   const [showAllCards, setShowAllCards] = useState(false);
//   const { cart } = useCart();
//   const cartItemCount = cart.length;

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
//       }
//     };

//     fetchCustomerID();
//   }, [route.params]);

//   useEffect(() => {
//     if (CustomerID) {
//       fetchCategories();
//     }
//   }, [CustomerID]);

//   const fetchCategories = useCallback(async () => {
//     if (!CustomerID) {
//       console.log("CustomerID is not set");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${BACKEND_URL}/sf/getItemCatSubCat`,
//         {
//           CustomerID: CustomerID,
//         },
//         {
//           timeout: 10000,
//         }
//       );

//       console.log("Response received:", response.data);

//       if (response.data && response.data.output) {
//         const uniqueCategories = response.data.output.reduce(
//           (acc: CategoryItem[], current: CategoryItem) => {
//             const x = acc.find((item) => item.CATID === current.CATID);
//             if (!x) {
//               console.log(
//                 `Category: ${current.CATDESC}, CAT_IMGFILE: ${current.CAT_IMGFILE}`
//               );
//               return acc.concat([current]);
//             } else {
//               return acc;
//             }
//           },
//           []
//         );

//         setCategories(uniqueCategories);
//         setFilteredCategories(uniqueCategories);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       if (axios.isAxiosError(error)) {
//         if (error.response) {
//           console.error("Error data:", error.response.data);
//           console.error("Error status:", error.response.status);
//           Alert.alert(
//             "Server Error",
//             `Error ${error.response.status}: ${
//               error.response.data.message || "Unknown error"
//             }`
//           );
//         } else if (error.request) {
//           console.error("Error request:", error.request);
//           Alert.alert(
//             "Network Error",
//             "Unable to connect to the server. Please check your internet connection and try again."
//           );
//         } else {
//           console.error("Error message:", error.message);
//           Alert.alert(
//             "Error",
//             "An unexpected error occurred. Please try again."
//           );
//         }
//       } else {
//         Alert.alert("Error", "An unexpected error occurred. Please try again.");
//       }
//     }
//   }, [CustomerID]);

//   const handleLogout = useCallback(async () => {
//     try {
//       await auth.signOut();
//       await AsyncStorage.removeItem("customerID");
//       navigation.navigate("OtpVerificationScreen");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   }, [navigation]);

//   const handleSearch = useCallback(
//     (text: string) => {
//       setSearchQuery(text);
//       const filtered = categories.filter((category) =>
//         category.CATDESC.toLowerCase().includes(text.toLowerCase())
//       );
//       setFilteredCategories(filtered);
//     },
//     [categories]
//   );

//   const renderCardItem = useCallback(
//     ({ item }: { item: CategoryItem }) => {
//       const imageSource = getImage(item.CAT_IMGFILE);

//       console.log(
//         "Rendering item:",
//         item.CATDESC,
//         "with image:",
//         item.CAT_IMGFILE
//       );

//       return (
//         <TouchableOpacity
//           style={styles.card}
//           onPress={() =>
//             navigation.navigate("Category", { category: item.CATDESC })
//           }
//         >
//           <Image
//             source={imageSource}
//             style={styles.cardImage}
//             resizeMode="contain"
//             onError={() =>
//               console.warn(`Failed to load image: ${item.CAT_IMGFILE}`)
//             }
//           />
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
//           <Image
//             source={require("../../assets/New folder/SavlaLogo.png")}
//             style={styles.logo}
//           />
//           <Text style={styles.headerTitle}>UNICORP ENTERPRISES</Text>
//         </View>
//         <View style={styles.headerRightContainer}>
//           <TouchableOpacity
//             onPress={() => navigation.navigate("CartScreen")}
//             style={styles.cartButton}
//           >
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
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search by Category"
//           value={searchQuery}
//           onChangeText={handleSearch}
//         />
//       </View>
//       <FlatList
//         data={
//           showAllCards ? filteredCategories : filteredCategories.slice(0, 6)
//         }
//         keyExtractor={(item, index) => item.CATID}
//         renderItem={renderCardItem}
//         contentContainerStyle={styles.cardContainer}
//         ListFooterComponent={
//           !showAllCards && filteredCategories.length > 6 ? (
//             <TouchableOpacity
//               onPress={() => setShowAllCards(true)}
//               style={styles.showMoreButton}
//             >
//               <Text style={styles.showMoreText}>Show More</Text>
//             </TouchableOpacity>
//           ) : null
//         }
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   // ... your existing styles ...
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#f0f0f0",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: "#fff",
//     elevation: 4,
//   },
//   logoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   logo: {
//     width: 50,
//     height: 50,
//     marginRight: 8,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#000",
//   },
//   headerRightContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   cartButton: {
//     marginRight: 16,
//   },
//   cartBadge: {
//     position: "absolute",
//     top: -4,
//     right: -4,
//     backgroundColor: "red",
//     borderRadius: 8,
//     paddingHorizontal: 4,
//     paddingVertical: 2,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cartBadgeText: {
//     color: "#fff",
//     fontSize: 10,
//   },
//   logoutButton: {
//     marginLeft: 8,
//   },
//   searchContainer: {
//     backgroundColor: "#fff",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     elevation: 2,
//   },
//   searchInput: {
//     backgroundColor: "#f0f0f0",
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     fontSize: 16,
//   },
//   cardContainer: {
//     paddingHorizontal: 8,
//     paddingVertical: 16,
//   },
//   card: {
//     flex: 1,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     marginHorizontal: 8,
//     marginVertical: 8,
//     alignItems: "center",
//     padding: 16,
//     elevation: 2,
//   },
//   cardImage: {
//     width: 80,
//     height: 80,
//     marginBottom: 8,
//   },
//   cardText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//     color: "#333",
//   },
//   showMoreButton: {
//     paddingVertical: 16,
//     alignItems: "center",
//   },
//   showMoreText: {
//     fontSize: 16,
//     color: "#007bff",
//   },
// });

// export default HomeScreen;
