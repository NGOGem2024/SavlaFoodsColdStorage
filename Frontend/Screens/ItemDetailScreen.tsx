 
import { NavigationProp, RouteProp } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
 
const BACKEND_URL = "http://192.168.1.37:3000/sf";
const { width } = Dimensions.get("window");
 
interface Item {
  ITEM_SUB_CATEGORY_ID: number;
  ITEM_ID: number;
  ITEM_CODE: string;
  DESCRIPTION: string;
  ITEM_NAME: string;
  customerID : string;
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
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
 
  // Dynamically get CustomerID from route params
  const customerID = route.params?.customerID;
  const subcategoryId = route.params?.subcategoryId;
  const subcategoryName = route.params?.subcategoryName || "Items";
  const subcategoryImage = route.params?.subcategoryImage;
 
  // Fetch items effect with dependencies
  useEffect(() => {
    if (!subcategoryId || !customerID) {
      setError("Invalid subcategory ID or Customer ID");
      setLoading(false);
      return;
    }
    fetchItems();
  }, [subcategoryId, customerID]);
 
  // Memoized fetch items function
  const fetchItems = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
 
    try {
      console.log(
        "Fetching items for subcategory ID:",
        subcategoryId,
        "CustomerID:",
        customerID
      );
 
      const payload = {
        SubCategoryID: subcategoryId,
        CustomerID: customerID
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
 
      if (response.data?.status === 'success' && response.data?.output?.items) {
        setItems(response.data.output.items);
      } else {
        setError(response.data?.message || "No items available");
        setItems([]);
      }
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Unexpected error occurred";
     
      setError(`Error: ${errorMessage}`);
      console.error("Fetch Items Error:", err);
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [subcategoryId, customerID]);
 
  const handleViewDetails = useCallback((item: Item) => {
    if (!item.ITEM_ID) {
      Alert.alert("Error", "Invalid item ID");
      return;
    }
 
    navigation.navigate("ItemDetailsExpanded", {
      ItemID: item.ITEM_ID,
      itemName: item.ITEM_NAME,
      customerID: customerID  // Pass the customerID to the next screen
    });
  }, [navigation, customerID]);
 
 
  const renderHeaderImage = useCallback(() => {
    const imageSource =
      typeof subcategoryImage === 'string'
        ? { uri: subcategoryImage }
        : subcategoryImage || require('../../assets/images/default.jpg');
 
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
        />
        {imageError && (
          <Text style={styles.imageErrorText}>
            Failed to load image: {subcategoryImage}
          </Text>
        )}
      </View>
    );
  }, [subcategoryImage, imageError]);
 
  const renderItem = useCallback(({ item }: { item: Item }) => {
    return (
      <TouchableOpacity
        style={styles.itemCard}
        onPress={() => handleViewDetails(item)}
      >
        <View style={styles.itemContent}>
          <View style={styles.itemMainInfo}>
            <Text style={styles.itemName}>{item.ITEM_NAME}</Text>
            <Text style={styles.description}>{item.DESCRIPTION}</Text>
            {/* <Text style={styles.customerIdText}>
              Customer ID: {customerID}
            </Text> */}
            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={() => handleViewDetails(item)}
            >
              <Icon name="arrow-forward-outline" size={20} color="#2196f3" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [handleViewDetails, customerID]);
 
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchItems(false);
  }, [fetchItems]);
 
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
 
  return (
    <View style={styles.container}>      
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />      
      <View style={styles.header}>
        <View style={styles.headerContentWrapper}>
          <View style={styles.titleContainer}>            
            <Text style={styles.headerText} numberOfLines={2}>
              {subcategoryName}
            </Text>
            <View style={styles.statsContainer}>
              <Icon name="cube-outline" size={16} color="#666666" />
              <Text style={styles.statsText}>
                {items.length} Items Available
              </Text>
              {/* <View style={styles.customerIdBadge}>
                <Text style={styles.customerIdBadgeText}>
                  Customer ID: {customerID}
                </Text>
              </View> */}
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
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  headerContentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F48221',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statsText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 12,
  },
  imageContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  imageErrorText: {
    color: 'red',
    fontSize: 10,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  itemCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemMainInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  customerIdText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  viewDetailsButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2196f3',
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
  },
});
 
export default ItemDetailScreen;
 
 