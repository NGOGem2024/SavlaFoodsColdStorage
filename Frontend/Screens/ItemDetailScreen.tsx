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
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { MainStackParamList } from "../../App";

const BACKEND_URL = "http://192.168.1.3:3000/sf";
const { width } = Dimensions.get("window");

interface Item {
  ITEM_ID: number;
  ITEM_CODE: string;
  DESCRIPTION: string;
  ITEM_NAME: string;
  BALANCE_QTY_SUM: number;
}

type ItemDetailScreenRouteProp = RouteProp<MainStackParamList, "ItemDetailScreen">;
type ItemDetailScreenNavigationProp = NavigationProp<MainStackParamList>;

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
      itemName:item.ITEM_NAME
    });
  };

  const renderHeaderImage = () => {
    console.log("Rendering image:", route.params.subcategoryImage);
    // const imageSource = route.params.subcategoryImage 
      // ? getSubcategoryImage(route.params.subcategoryImage)
      // : require('../../assets/images/default.jpg');

    return (
      <View style={styles.imageContainer}>        
        <Image
          source={route.params.subcategoryImage}
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
      <StatusBar
        backgroundColor="#ffffff"
        barStyle="dark-content"
      />      
      <View style={styles.header}>
        <View style={styles.headerContentWrapper}>
          <View style={styles.titleContainer}>             
            <Text style={styles.headerText} numberOfLines={2}>
              {route.params.subcategoryName}
            </Text>
            <View style={styles.statsContainer}>
              <Icon name="cube-outline" size={16} color="#666666" />
              <Text style={styles.statsText}>{items.length} Items Available</Text>
            </View>
          </View>
          
          {renderHeaderImage()}
        </View>
        
        <View style={styles.divider} />
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop:-50
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F48221",
    marginBottom: 4,
  },
  imageNameText: {
    fontSize: 14,
    color: "#F48221", // Orange color for the image name
    marginTop: 4,
  },
  imageContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginLeft:40
  },
  subHeaderText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginLeft: 25,
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
  },
   statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  statsText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 6,
    fontWeight: "500",
  },
  headerContentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom:-10
  },
  titleContainer: {
    flex: 1,
    marginRight: 20,
  },
  categoryLabel: {
    fontSize: 13,
    color: "#666666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#e1e1e1",
    marginHorizontal: 20,
  },
});

export default ItemDetailScreen;
