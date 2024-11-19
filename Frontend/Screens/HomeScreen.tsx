// import { MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   NavigationProp,
//   RouteProp,
//   useNavigation,
//   useRoute,
// } from "@react-navigation/native";
// import axios from "axios";
// import { default as React, useCallback, useEffect, useState } from "react";
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
// import Carousel from "./Carousel";
// import { useCart } from "./contexts/CartContext";
// import { useDisplayName } from "./contexts/DisplayNameContext";

// const BACKEND_URL = "http://192.168.1.3:3000";

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
//   Category: { category: string, categoryId: string };
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
//   const { displayName, setDisplayName } = useDisplayName();
//   const [categories, setCategories] = useState<CategoryItem[]>([]);
//   // const [Disp_name, setDisp_name] = useState<string | null>(null);
//   const [filteredCategories, setFilteredCategories] = useState<CategoryItem[]>(
//     []
//   );
//   const [showAllCards, setShowAllCards] = useState(false);
//   const { cart } = useCart();
//   const cartItemCount = cart.length;

//   useEffect(() => {
//     const fetchDisplayName = async () => {
//       try {
//         let name = await AsyncStorage.getItem("Disp_name");
//         if (name) {
//           setDisplayName(name);
//         } else {
//           const response = await axios.get(`${BACKEND_URL}/getCustomerInfo`);
//           name = response.data.Disp_name;
//           setDisplayName(name);
//           await AsyncStorage.setItem("Disp_name", name || "");
//         }
//       } catch (error) {
//         console.error("Error fetching Display Name:", error);
//       }
//     };

//     fetchDisplayName();
//   }, [route.params]);

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

//       // console.log("Response received:", response.data);

//       if (response.data && response.data.output) {
//         const uniqueCategories = response.data.output.reduce(
//           (acc: CategoryItem[], current: CategoryItem) => {
//             const x = acc.find((item) => item.CATID === current.CATID);
//             if (!x) {
//               // console.log(
//               //   `Category: ${current.CATDESC}, CAT_IMGFILE: ${current.CAT_IMGFILE}`
//               // );
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
//       // await AsyncStorage.removeItem("customerID");
//       await AsyncStorage.removeItem("Disp_name");
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

//       // console.log(
//       //   "Rendering item:",
//       //   item.CATDESC,
//       //   "with image:",
//       //   item.CAT_IMGFILE
//       // );

//       return (
//         <TouchableOpacity
//           style={styles.card}
//           onPress={() =>
//             navigation.navigate("Category", { category: item.CATDESC ,categoryId: item.CATID})
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
//           <View style={styles.headerTitleContainer}>
//           <Text style={styles.headerTitle}>{displayName || "Loading..."}</Text>
//           </View>

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
//       {/* <Text style={styles.id}>Customer ID: {CustomerID || "Loading..."}</Text> */}

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
//           <Text style={styles.moreText}>
//             {showAllCards ? "Less" : "More->"}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={
//           showAllCards ? filteredCategories : filteredCategories.slice(0, 6)
//         }
//         renderItem={renderCardItem}
//         numColumns={2}
//         keyExtractor={(item) => item.CATID}
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
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     backgroundColor: "#fff",
//     position: 'relative',
//     height: 65,
//   },
//   headerRightContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     position: 'absolute',
//     right: 16,
//     top: '50%',
//     transform: [{ translateY: -12 }], // Center vertically
//     minWidth: 80, // Ensure minimum width
//     justifyContent: 'flex-end',
//     gap: 16, // Consistent spacing between icons
//     zIndex: 2, // Ensure it stays above other elements
//   },
//   headerTitleContainer: {
//     position: 'absolute',
//     left: 70, // Adjust based on logo width + padding
//     right: 100, // Space for right container
//     top: 0,
//     bottom: 0,
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 1,
//   },
//   cartButton: {
//     padding: 0,
//     // marginRight: 2,
//   },
//   cartBadge: {
//     position: "absolute",
//     right: -3,
//     top: -6,
//     backgroundColor: "red",
//     borderRadius: 9,
//     width: 18,
//     height: 18,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   cartBadgeText: {
//     color: "white",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   logoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//     marginLeft: -2,
//   },
//   logo: {
//     width: 45,
//     height: 45,
//     marginRight: 10,
//   },
//   headerTitle: {
//     fontSize: 18,
//     color: "#007BFA",
//     fontWeight: "bold",
//     marginLeft: 25,
//     textAlign: "center",
//     // alignItems:"center"
//   },
//   logoutButton: {
//     // marginHorizontal: 30,
//     // padding:5
//   },
//   searchContainer: {
//     flexDirection: "row",
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     marginBottom: -10,
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     marginRight: 10,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   searchButton: {
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   cardContainer: {
//     paddingHorizontal: 10,
//     paddingBottom: 10,
//     minHeight:200
//   },
//   card: {
//     width: (width - 40) / 2,
//     margin: 5,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 8,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     minHeight:150,
//   },
//   id: {
//     color: "black",
//     fontSize: 20,
//     flexDirection: "row",
//     marginLeft: 25,
//   },
//   cardImage: {
//     width: "100%",
//     height: 85,
//     resizeMode: "cover",
//     borderRadius: 5,
//   },
//   cardText: {
//     marginTop: 5,
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   headingContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     // marginTop:-110,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   headingText: {
//     fontSize: 22,
//     fontWeight: "bold",
//   },
//   moreText: {
//     fontSize: 16,
//     color: "#F48221",
//     fontWeight: "bold",
//   },
//   bottomTab: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderTopWidth: 1,
//     borderTopColor: "#ddd",
//   },
//   tabItem: {
//     alignItems: "center",
//   },

// });

// export default HomeScreen;





import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import axios from "axios";
import { default as React, useCallback, useEffect, useState } from "react";
import {
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
} from "react-native";
import { RootStackParamList } from "../../App";

import { fetchImageMappings, formatImageName, getCategoryImage, ImageMapping } from '../utils/imageRegistry';
import Carousel from "./Carousel";
import Header from "./Header"; // Update path as needed
import { useCart } from "./contexts/CartContext";
import { useDisplayName } from "./contexts/DisplayNameContext";




const BACKEND_URL = "http://192.168.1.3:3000";

type HomeScreenRouteProp = RouteProp<RootStackParamList, "HomeScreen">;
type HomeScreenNavigationProp = NavigationProp<RootStackParamList>;

type CategoryItem = {
  imageUrl: any;
  CATID: string;
  CATCODE: string;
  CATDESC: string;
  // CAT_IMGFILE: string;
  categoryImage: string;    // Will contain "C{CATID}.jpg"
  subcategoryImage: string; // Will contain "SC{SUBCATID}.jpg"
};

const { width } = Dimensions.get("window");
const BASE_IMAGE_PATH = 'http://192.168.1.3:3000/assets/images'; // Adjust this to your image server path
// const imageService = ImageService.getInstance();


export const getImagePath = (imageFileName: string) => {
  if (!imageFileName) return null;
  return `${BASE_IMAGE_PATH}/${imageFileName}`;
};


const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const [CustomerID, setCustomerID] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { displayName, setDisplayName } = useDisplayName();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryItem[]>(
    []
  );
  const [showAllCards, setShowAllCards] = useState(false);
  const [imageMappings, setImageMappings] = useState<{
    categories: ImageMapping[];
    subcategories: ImageMapping[];
  }>({ categories: [], subcategories: [] });

  // Add this useEffect to fetch image mappings
  useEffect(() => {
    const loadImageMappings = async () => {
      const mappings = await fetchImageMappings();
      setImageMappings(mappings);
    };
    loadImageMappings();
  }, []);

  const { cart } = useCart();
  const cartItemCount = cart.length;

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

      if (response.data && response.data.output) {
        const uniqueCategories = response.data.output.reduce(
          (acc: CategoryItem[], current: CategoryItem) => {
            const x = acc.find((item) => item.CATID === current.CATID);
            if (!x) {
              // Format the image name using the CATID
              const formattedCategory = {
                ...current,
                categoryImage: formatImageName(current.CATID, true),
                imageUrl: getCategoryImage(current.CATID)
              };
              return acc.concat([formattedCategory]);
            }
            return acc;
          },
          []
        );

        setCategories(uniqueCategories);
        setFilteredCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [CustomerID]);

  const renderCardItem = useCallback(
    ({ item }: { item: CategoryItem }) => {
      return (
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate("SubCategory", {
              category: item.CATDESC,
              categoryId: item.CATID,              
            })
          }
        >
          <View style={styles.imageContainer}>
            <Image
              source={item.imageUrl}
              style={styles.cardImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.cardText}>{item.CATDESC}</Text>
        </TouchableOpacity>
      );
    },
    [navigation]
  );

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


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ddd" />
      <Header displayName={displayName} cartItemCount={cartItemCount} />

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
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 0,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  imageContainer: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  searchButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    minHeight: 200,
  },
  card: {
    width: (width - 40) / 2,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    minHeight: 150,
  },
  cardImage: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
    borderRadius: 5,
  },
  cardText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 0,
  },
  headingText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  moreText: {
    fontSize: 16,
    color: "#F48221",
    fontWeight: "bold",
  },
});

export default HomeScreen;
  

// import { MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   NavigationProp,
//   RouteProp,
//   useNavigation,
//   useRoute,
// } from "@react-navigation/native";
// import axios from "axios";
// import { default as React, useCallback, useEffect, useState } from "react";
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
// import { RootStackParamList } from "../../App";
// import Carousel from "./Carousel";
// import { useCart } from "./contexts/CartContext";
// import { useDisplayName } from "./contexts/DisplayNameContext";
// import Header from "./Header";

// const BACKEND_URL = "http://192.168.1.3:3000";

// type HomeScreenRouteProp = RouteProp<RootStackParamList, "HomeScreen">;
// type HomeScreenNavigationProp = NavigationProp<RootStackParamList>;

// type CategoryItem = {
//   CATID: string;
//   CATCODE: string;
//   CATDESC: string;
//   imageUrl?: string;
// };

// type ImageIdResponse = {
//   categories: Array<{
//     id: string;
//     imageUrl: string;
//   }>;
//   subcategories: Array<{
//     id: string;
//     imageUrl: string;
//   }>;
// };

// const { width } = Dimensions.get("window");

// const HomeScreen: React.FC = () => {
//   const navigation = useNavigation<HomeScreenNavigationProp>();
//   const route = useRoute<HomeScreenRouteProp>();
//   const [CustomerID, setCustomerID] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const { displayName, setDisplayName } = useDisplayName();
//   const [categories, setCategories] = useState<CategoryItem[]>([]);
//   const [filteredCategories, setFilteredCategories] = useState<CategoryItem[]>([]);
//   const [showAllCards, setShowAllCards] = useState(false);
//   const { cart } = useCart();
//   const cartItemCount = cart.length;
//   const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());

//   // Fetch image URLs
//   const fetchImageUrls = useCallback(async () => {
//     try {
//       const response = await axios.get<ImageIdResponse>(`${BACKEND_URL}/image-ids`);
//       const newImageUrls = new Map();
      
//       response.data.categories.forEach(({ id, imageUrl }) => {
//         newImageUrls.set(id, imageUrl);
//       });
      
//       setImageUrls(newImageUrls);
//     } catch (error) {
//       console.error("Error fetching image URLs:", error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchImageUrls();
//   }, [fetchImageUrls]);

//   useEffect(() => {
//     const fetchDisplayName = async () => {
//       try {
//         let name = await AsyncStorage.getItem("Disp_name");
//         if (name) {
//           setDisplayName(name);
//         } else {
//           const response = await axios.get(`${BACKEND_URL}/getCustomerInfo`);
//           name = response.data.Disp_name;
//           setDisplayName(name);
//           await AsyncStorage.setItem("Disp_name", name || "");
//         }
//       } catch (error) {
//         console.error("Error fetching Display Name:", error);
//       }
//     };

//     fetchDisplayName();
//   }, [route.params]);

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
//         setFilteredCategories(uniqueCategories);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       if (axios.isAxiosError(error)) {
//         if (error.response) {
//           Alert.alert(
//             "Server Error",
//             `Error ${error.response.status}: ${error.response.data.message || "Unknown error"}`
//           );
//         } else if (error.request) {
//           Alert.alert(
//             "Network Error",
//             "Unable to connect to the server. Please check your internet connection and try again."
//           );
//         } else {
//           Alert.alert("Error", "An unexpected error occurred. Please try again.");
//         }
//       } else {
//         Alert.alert("Error", "An unexpected error occurred. Please try again.");
//       }
//     }
//   }, [CustomerID]);

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
//       const imageUrl = imageUrls.get(item.CATID);

//       const categoryImage = imageUrl ? getImageForCategory(imageUrl) : require('../../assets/images/default.jpg');


//       return (
//         <TouchableOpacity
//           style={styles.card}
//           onPress={() =>
//             navigation.navigate("SubCategory", {
//               category: item.CATDESC,
//               categoryId: item.CATID,
//             })
//           }
//         >
//           <Image
//             source={imageUrl ? { uri: `${BACKEND_URL}/images/${imageUrl}` } : require('../../assets/images/default.jpg')}
//             style={styles.cardImage}
//             resizeMode="contain"
//             onError={(error) => console.warn(`Failed to load image for category ${item.CATID}:`, error)}
//           />
//           <Text style={styles.cardText}>{item.CATDESC}</Text>
//         </TouchableOpacity>
//       );
//     },
//     [navigation, imageUrls]
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ddd" />
//       <Header displayName={displayName} cartItemCount={cartItemCount} />

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
//           <Text style={styles.moreText}>
//             {showAllCards ? "Less" : "More->"}
//           </Text>
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
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     backgroundColor: '#fff',
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     marginRight: 10,
//   },
//   searchButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 40,
//   },
//   headingContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 10,
//   },
//   headingText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   moreText: {
//     color: '#666',
//   },
//   cardContainer: {
//     padding: 5,
//   },
//   card: {
//     flex: 1,
//     margin: 5,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   cardImage: {
//     width: width * 0.4,
//     height: width * 0.4,
//     marginBottom: 10,
//   },
//   cardText: {
//     textAlign: 'center',
//     fontSize: 16,
//   },
// });

// export default HomeScreen;