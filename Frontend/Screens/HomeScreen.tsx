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
} from "react-native";
import { MainStackParamList, RootStackParamList } from "../../App";

import { fetchImageMappings, formatImageName, getCategoryImage, ImageMapping } from '../utils/imageRegistry';
import Carousel from "./Carousel";
import Header from "./Header"; // Update path as needed
import { useCart } from "./contexts/CartContext";
import { useDisplayName } from "./contexts/DisplayNameContext";

const BACKEND_URL = "http://192.168.1.37:3000";

interface HomeScreenParams {
  initialLogin?: boolean;
  customerID?: string;
  switchedAccount?: boolean;
  newCustomerId?: string;
}

// type HomeScreenRouteProp = RouteProp<RootStackParamList, "HomeScreen">;
type HomeScreenNavigationProp = NavigationProp<MainStackParamList>;

type CategoryItem = {
  imageUrl: any;
  customerID:string;
  CATID: string;
  CATCODE: string;
  CATDESC: string;
  // CAT_IMGFILE: string;
  categoryImage: string;    // Will contain "C{CATID}.jpg"
  subcategoryImage: string; // Will contain "SC{SUBCATID}.jpg"
};

const { width } = Dimensions.get("window");
const BASE_IMAGE_PATH = 'http://192.168.1.37:3000/assets/images'; // Adjust this to your image server path
// const imageService = ImageService.getInstance();


export const getImagePath = (imageFileName: string) => {
  if (!imageFileName) return null;
  return `${BASE_IMAGE_PATH}/${imageFileName}`;
};


const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
  // const navigation = useNavigation<HomeScreenNavigationProp>();
  // const route = useRoute<HomeScreenRouteProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'HomeScreen'>>();
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

  const handleAccountSwitch = useCallback(() => {
    // Clear existing data
    setCategories([]);
    setFilteredCategories([]);
    
    // Re-fetch customer ID and categories
    fetchCustomerID();
  }, []);


  
  const fetchCustomerID = useCallback(async () => {
    try {
      const storedId = await AsyncStorage.getItem("customerID");
      if (storedId) {
        setCustomerID(storedId);
        fetchCategories(storedId); // Pass the customerID directly
      } else {
        const response = await axios.get(`${BACKEND_URL}/getCustomerID`);
        const newId = response.data.customerID;
        if (newId) {
          await AsyncStorage.setItem("customerID", newId);
          setCustomerID(newId);
          fetchCategories(newId);
        }
      }
    } catch (error) {
      console.error("Error fetching CustomerID:", error);
      Alert.alert("Error", "Failed to fetch customer ID");
    }
  }, []);

  const fetchCategories = useCallback(async (customerId: string) => {
    console.log('Fetching Categories for CustomerID:', customerId);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/sf/getItemCatSubCat`,
        { CustomerID: customerId },
        { timeout: 10000 }
      );

      if (response.data?.output) {
        const uniqueCategories = response.data.output.reduce(
          (acc: CategoryItem[], current: CategoryItem) => {
            const exists = acc.find((item) => item.CATID === current.CATID);
            if (!exists) {
              return [...acc, {
                ...current,
                categoryImage: formatImageName(current.CATID, true),
                imageUrl: getCategoryImage(current.CATID)
              }];
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
      Alert.alert("Error", "Failed to fetch categories");
    }
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        let id: string | null = null;

        // Handle account switching
        if (route.params?.switchedAccount && route.params?.newCustomerId) {
          id = route.params.newCustomerId;
        }
        // Handle initial login
        else if (route.params?.initialLogin && route.params?.customerID) {
          id = route.params.customerID;
        }
        // Use stored CustomerID as fallback
        else {
          id = await AsyncStorage.getItem('customerID');
        }

        if (id) {
          setCustomerID(id);
          fetchCategories(id);
        }
      } catch (error) {
        console.error("Error initializing data:", error);
        Alert.alert("Error", "Failed to initialize data");
      }
    };

    initializeData();
  }, [
    route.params?.switchedAccount, 
    route.params?.newCustomerId,
    fetchCustomerID,
    fetchCategories
  ]);

  useEffect(() => {
    if (route.params?.switchedAccount && route.params?.newCustomerId) {
      setCustomerID(route.params.newCustomerId);
      fetchCategories(route.params.newCustomerId);
    }
  }, [route.params?.switchedAccount, route.params?.newCustomerId]);

   
  // Add this useEffect to fetch image mappings
  useEffect(() => {
    const loadImageMappings = async () => {
      const mappings = await fetchImageMappings();
      setImageMappings(mappings);
    };
    loadImageMappings();
  }, []);

 
   // Safely handle cart context
   const { cartItems } = useCart() || {};
   const cartItemCount = cartItems?.length || 0;
 

  // Add handleCartPress method
  const handleCartPress = () => {
    navigation.navigate('PlaceOrderScreen');
  };

 

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
          const response = await axios.get("http://192.168.1.37/getCustomerID");
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
  if (route.params?.switchedAccount) {
    setCategories([]);
    setFilteredCategories([]);
  }
}, [route.params?.switchedAccount]);

// Handle CustomerID updates
useEffect(() => {
  const fetchCustomerID = async () => {
    console.log(CustomerID);
    try {
      if (route.params?.switchedAccount && route.params?.newCustomerId) {
        await AsyncStorage.setItem("customerID", route.params.newCustomerId);
        setCustomerID(route.params.newCustomerId);
        return;
      }

      const storedId = await AsyncStorage.getItem("customerID");
      if (storedId) {
        setCustomerID(storedId);
      } else {
        const response = await axios.get(`${BACKEND_URL}/getCustomerID`);
        const newId = response.data.customerID;
        if (newId) {
          await AsyncStorage.setItem("customerID", newId);
          setCustomerID(newId);
        }
      }
    } catch (error) {
      console.error("Error fetching CustomerID:", error);
      Alert.alert("Error", "Failed to fetch customer ID");
    }
  };

  fetchCustomerID();
}, [route.params?.switchedAccount, route.params?.newCustomerId]);
const renderCardItem = useCallback(
  ({ item }: { item: CategoryItem }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("SubCategory", {              
            category: item.CATDESC,
            categoryId: item.CATID,     
            customerID: CustomerID || item.customerID, // Prioritize the current CustomerID
            subcategoryImage: item.subcategoryImage // Add this if needed
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
  [navigation, CustomerID]
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
      {/* <Header displayName={displayName} cartItemCount={cartItemCount} /> */}
      <Header 
         displayName={displayName}
         cartItemCount={cartItemCount}
         onCartPress={handleCartPress}
         onAccountSwitch={handleAccountSwitch}
        />
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
  
//23.11
