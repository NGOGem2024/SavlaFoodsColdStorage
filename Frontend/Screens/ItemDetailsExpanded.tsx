
//nandini
import { NavigationProp, RouteProp } from "@react-navigation/native";
import axios from "axios";
import { CreditCard, Grid, MoreVertical, Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { MainStackParamList } from "../../App";
import QuantitySelectModal from './QuantitySelectorModal';

const BACKEND_URL = "http://192.168.1.3:3000/sf";

// Keep existing interfaces
interface ItemDetails {
  DESCRIPTION: string;
  ITEM_CODE: string;
  ITEM_ID: number;
  ITEM_NAME: string;
  ITEM_SUB_CATEGORY_ID: number;
}
interface Item {
  ITEM_ID: number;
  ITEM_CODE: string;
  DESCRIPTION: string;
  ITEM_NAME: string;
  BALANCE_QTY_SUM: number;
}

interface StockDetails {
  LOT_NO: string | null;
  // FK_UNIT_ID: number | null;
  ITEM_MARKS: string | null;
  VAKAL_NO: string | null;
  BATCH_NO: string | null;
  AVAILABLE_QTY: number | null;
  BOX_QUANTITY: number | null;
  EXPIRY_DATE: string | null;
  REMARKS: string | null;
  STATUS: string | null;
  UNIT_NAME: string | null;
}

interface APIResponse {
  input: { ItemID: number };
  output: {
    itemDetails: ItemDetails;
    stockDetails: StockDetails[];
  };
}

type ItemDetailsExpandedRouteProp = RouteProp<
  MainStackParamList,
  "ItemDetailsExpanded"
>;
type ItemDetailsExpandedNavigationProp = NavigationProp<MainStackParamList>;

interface ItemDetailsExpandedProps {
  route: ItemDetailsExpandedRouteProp;
  navigation: ItemDetailsExpandedNavigationProp;
}
 
const ItemDetailsExpanded: React.FC<ItemDetailsExpandedProps> = ({ route, navigation }) => {
  const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
  const [stockDetails, setStockDetails] = useState<StockDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTableView, setIsTableView] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [cartAnimations, setCartAnimations] = useState<{
    [key: string]: Animated.Value;
  }>({});
  const [quantity, setQuantity] = useState("");
  const [selectedLotNo, setSelectedLotNo] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [addedToCart, setAddedToCart] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const animations: { [key: string]: Animated.Value } = {};
    stockDetails.forEach((stock) => {
      animations[stock.LOT_NO || ""] = new Animated.Value(0);
    });
    setCartAnimations(animations);
  }, [stockDetails]);

   // Add cart functionality
   const handleAddToCart = (lotNo: string | null) => {
    if (!lotNo) return;
    
    // Trigger animation
    Animated.sequence([
      Animated.timing(cartAnimations[lotNo], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cartAnimations[lotNo], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  
    setSelectedLotNo(lotNo);
    setModalVisible(true);
  };



  const handleConfirmQuantity = () => {
    console.log("Item added to cart with quantity:", quantity);
    console.log("Lot No:", selectedLotNo);
    setModalVisible(false);
    setQuantity("");
    setSelectedLotNo(null);
  };

  const fetchStockDetails = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);

    try {
      const { ItemID } = route.params;
      const response = await axios.post<APIResponse>(
        `${BACKEND_URL}/getItemDetailsWithStock`,
        { ItemID },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 10000,
        }
      );
      console.log("Response received:", response.data);

      if (response.data?.output) {
        const { stockDetails } = response.data.output;
        if (!stockDetails || stockDetails.length === 0) {
          setError("No stock details available");
          setStockDetails([]);
        } else {
          setStockDetails(stockDetails);
          setError(null);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "An unexpected error occurred";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!route.params?.ItemID) {
      setError("Invalid item ID");
      setLoading(false);
      return;
    }
    fetchStockDetails();
  }, [route.params.ItemID]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStockDetails(false);
  };
  // Keep existing fetchStockDetails, useEffect, and other utility functions

  const fadeIn = (index: number) => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: index * 10,
      useNativeDriver: true,
    }).start();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString || dateString === "null") return ""; // Return empty string instead of 'N/A'
    try {
      const date = new Date(dateString);
      // Check if date is invalid
      if (isNaN(date.getTime())) {
        return "";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return ""; // Return empty string instead of 'Null'
    }
  };

  const formatQuantity = (quantity: number | null) => {
    if (quantity === null) return "N/A";
    return quantity.toLocaleString();
  };

  const filteredStockDetails = stockDetails.filter((stock) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (stock.LOT_NO?.toString().toLowerCase().includes(searchLower) ?? false) ||
      (stock.UNIT_NAME?.toString().toLowerCase().includes(searchLower) ??
        false) ||
      (stock.BATCH_NO?.toString().toLowerCase().includes(searchLower) ??
        false) ||
      (stock.AVAILABLE_QTY?.toString().toLowerCase().includes(searchLower) ??
        false) ||
      (stock.BOX_QUANTITY?.toString().toLowerCase().includes(searchLower) ??
        false) ||
      (stock.EXPIRY_DATE?.toString().toLowerCase().includes(searchLower) ??
        false) ||
      (stock.STATUS?.toString().toLowerCase().includes(searchLower) ?? false) ||
      (stock.REMARKS?.toString().toLowerCase().includes(searchLower) ?? false)
    );
  });

  const renderCardView = () => (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {filteredStockDetails.map((stock, index) => (
        <Animated.View
          key={index}
          style={[
            styles.stockCard,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
          onLayout={() => fadeIn(index)}
        >
          <View style={styles.stockHeader}>             
            
<View style={styles.lotNoContainer}>
  <Text style={styles.lotNoLabel}>LOT NO : </Text>
  <TouchableOpacity
    style={styles.lotNoValueContainer}
    onPress={() => navigation.navigate('LotReportScreen')}
  >
    <Text style={styles.lotNoValue}>{stock.LOT_NO || "N/A"}</Text>
  </TouchableOpacity>
</View>

            <Animated.View
              style={[
                styles.addToCartContainer,
                {
                  transform: [
                    {
                      scale: cartAnimations[stock.LOT_NO || ""]?.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [1, 1.2, 1],
                      }) || 1,
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => handleAddToCart(stock.LOT_NO)}
              >
                <View style={styles.cartIconWrapper}>
                  <Text style={styles.cartIcon}>🛒</Text>
                </View>
                {/* <Text style={styles.addToCartText}>Add</Text> */}
              </TouchableOpacity>
            </Animated.View>
            
            {/* <View style={styles.quantityContainer}>
              <Text style={styles.quantityValue}>
                {formatQuantity(stock.AVAILABLE_QTY)}
              </Text>
              <Text style={styles.quantityLabel}>Avl. Quantity</Text>
            </View> */}
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Unit Name</Text>
                <Text style={styles.detailValue}>
                  {stock.UNIT_NAME || "N/A"}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Vakal No:</Text>
                <Text style={styles.detailValue}>
                  {stock.VAKAL_NO || "N/A"}
                </Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Item Marks</Text>
                <Text style={styles.detailValue}>
                  {stock.ITEM_MARKS || "N/A"}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Batch No</Text>
                <Text style={styles.detailValue}>
                  {stock.BATCH_NO || "N/A"}
                </Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>AVAILABLE Quantity</Text>
                <Text style={styles.detailValue}>
                  {formatQuantity(stock.AVAILABLE_QTY)}
                </Text>
              </View>
              <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Box Quantity</Text>
                <Text style={styles.detailValue}>
                  {formatQuantity(stock.BOX_QUANTITY)}
                </Text>
                
              </View>
            </View>
            <View style={styles.detailRow}>
            <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Expiry Date</Text>
                <Text style={styles.detailValue}>
                  {formatDate(stock.EXPIRY_DATE)}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Remarks</Text>
                <Text style={styles.detailValue}>{stock.REMARKS || "N/A"}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      ))}

   
       <QuantitySelectModal
        isVisible={isModalVisible}
        selectedLotNo={selectedLotNo}
        stockDetails={stockDetails}
        onClose={() => {
          setModalVisible(false);
          setSelectedLotNo(null);
        } }
        onConfirm={(quantity) => {
          console.log('Item added to cart:', {
            lotNo: selectedLotNo,
            quantity: quantity
          });          
          setModalVisible(false);
          setSelectedLotNo(null);
          
        } } itemName={""}/>         
    </ScrollView>
  );

  const renderTableView = () => (
    <ScrollView
      style={styles.container}
      horizontal={true}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: 120 }]}>Lot No</Text>          
          <Text style={[styles.tableHeaderCell, { width: 100 }]}>Quantity</Text>
          <Text style={[styles.tableHeaderCell, { width: 100 }]}>
            Unit Name
          </Text>
          <Text style={[styles.tableHeaderCell, { width: 100 }]}>Vakal No</Text>
          <Text style={[styles.tableHeaderCell, { width: 100 }]}>Item Marks</Text>
          <Text style={[styles.tableHeaderCell, { width: 120 }]}>Batch No</Text>
          <Text style={[styles.tableHeaderCell, { width: 100 }]}>Available Qty</Text>
          <Text style={[styles.tableHeaderCell, { width: 100 }]}>Box Qty</Text>
          <Text style={[styles.tableHeaderCell, { width: 150 }]}>
            Expiry Date
          </Text>
          <Text style={[styles.tableHeaderCell, { width: 100 }]}>Remarks</Text>
        </View>
        <ScrollView>
          {filteredStockDetails.map((stock, index) => (
            //   <View key={index} style={styles.tableRow}>
            //     <Text style={[styles.tableCell, styles.lotNoTableCell, { width: 120 }]}>
            //       {stock.LOT_NO || 'N/A'}
            //     </Text>
            //     <Text style={[styles.tableCell, styles.quantityTableCell, { width: 100 }]}>
            //       {formatQuantity(stock.AVAILABLE_QTY)}
            //     </Text>
            //     <Text style={[styles.tableCell, { width: 100 }]}>{stock.UNIT_NAME || 'N/A'}</Text>
            //     <Text style={[styles.tableCell, { width: 120 }]}>{stock.BATCH_NO || 'N/A'}</Text>
            //     <Text style={[styles.tableCell, { width: 100 }]}>{formatQuantity(stock.BOX_QUANTITY)}</Text>
            //     <Text style={[styles.tableCell, { width: 150 }]}>{formatDate(stock.EXPIRY_DATE)}</Text>
            //     <Text style={[styles.tableCell, { width: 100 }]}>{stock.STATUS || 'N/A'}</Text>
            //   </View>

            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCellContainer, { width: 120 }]}>
                <Text style={[styles.tableCell, styles.lotNoTableCell]}>
                  {stock.LOT_NO || "N/A"}
                </Text>
              </View>
              <View style={[styles.tableCellContainer, { width: 100 }]}>
                <Text style={[styles.tableCell, styles.quantityTableCell]}>
                  {formatQuantity(stock.AVAILABLE_QTY)}
                </Text>
              </View>
              <View style={[styles.tableCellContainer, { width: 100 }]}>
                <Text style={styles.tableCell}>{stock.UNIT_NAME || "N/A"}</Text>
              </View>
              <View style={[styles.tableCellContainer, { width: 100 }]}>
                <Text style={styles.tableCell}>{stock.VAKAL_NO || "N/A"}</Text>
              </View>
              <View style={[styles.tableCellContainer, { width: 100 }]}>
                <Text style={styles.tableCell}>{stock.ITEM_MARKS || "N/A"}</Text>
              </View>
              <View style={[styles.tableCellContainer, { width: 120 }]}>
                <Text style={styles.tableCell}>{stock.BATCH_NO || "N/A"}</Text>
              </View>
              <View style={[styles.tableCellContainer, { width: 100 }]}>
                <Text style={styles.tableCell}>
                  {formatQuantity(stock.AVAILABLE_QTY)}
                </Text>
              </View>
              <View style={[styles.tableCellContainer, { width: 100 }]}>
                <Text style={styles.tableCell}>
                  {formatQuantity(stock.BOX_QUANTITY)}
                </Text>
              </View>
              <View style={[styles.tableCellContainer, { width: 150 }]}>
                <Text style={styles.tableCell}>
                  {formatDate(stock.EXPIRY_DATE)}
                </Text>
              </View>
              <View style={[styles.tableCellContainer, { width: 100 }]}>
                <Text style={styles.tableCell}>{stock.REMARKS || "N/A"}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchStockDetails()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
      
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by LotNo..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#6B7280"
          />
        </View>
        <View style={styles.rightHeaderSection}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !isTableView && styles.toggleButtonActive,
            ]}
            onPress={() => setIsTableView(false)}
          >
            <CreditCard size={23} color={!isTableView ? "#F48221" : "#F48221"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              isTableView && styles.toggleButtonActive,
            ]}
            onPress={() => setIsTableView(true)}
          >
            <Grid size={23} color={isTableView ? "#007bff" : "#007bff"} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.navigate('PlaceOrderScreen')}
        >
          <MoreVertical size={24} color="#333" />
        </TouchableOpacity>
        </View>
      </View>

      {isTableView ? renderTableView() : renderCardView()}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  rightHeaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: "#1F2937",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  toggleButtonActive: {
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  stockCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    margin: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stockHeader: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 5,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },
  lotNoContainer: {
    flex: 1,
    flexDirection: "row",
  },
  lotNoLabel: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    alignSelf: "center",
  },
  quantityContainer: {
    alignItems: "flex-end",
  },
  quantityLabel: {
    color: "black",
    fontSize: 12,
    marginTop: 4,
  },

  detailItem: {
    flex: 1,
    marginHorizontal: 8,
    rowGap:-5
  },
  detailLabel: {
    color: "#F48221",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  detailValue: {
    color: "#1F2937",
    fontSize: 14,
    fontWeight: "500",
  },
  lotNoTableCell: {
    color: "#F48221",
    fontWeight: "700",
  },
  quantityTableCell: {
    color: "black",
    fontWeight: "600",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff5733",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  lotNoValueContainer: {
    backgroundColor: "#F48221",
    borderRadius: 4, // Reduced from 6
    padding: 6, // Reduced from 8
    width: "30%", // Reduced from 40%
  },
  lotNoValue: {
    color: "#FFFFFF",
    fontSize: 16, // Reduced from 16
    fontWeight: "700",
    textAlign: "center",
  },
  quantityValue: {
    color: "black",
    fontSize: 18, // Reduced from 20
    fontWeight: "700",
  },
  detailsContainer: {
    padding: 8,
    paddingTop: 4,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12, // Reduced from 16
  },
  // Table view enhancements
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1a73e8", // More professional blue
    borderWidth: 1,
    borderColor: "#dadce0",
  },
  tableHeaderCell: {
    padding: 10,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    borderRightWidth: 1,
    borderRightColor: "#4285f4",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#dadce0",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#dadce0",
    backgroundColor: "#FFFFFF",
  },
  tableCell: {
    padding: 10,
    fontSize: 13,
    color: "#1F2937",
    borderRightWidth: 2,
    borderRightColor: "#dadce0",
  },
  tableCellContainer: {
    borderRightWidth: 1,
    borderRightColor: "#dadce0",
    justifyContent: "center",
  },
  addToCartContainer: {
    marginLeft: 8,
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
  },
  cartIcon: {
    fontSize: 20,     
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
    flexDirection:'row'
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
    
  },
  confirmButtonText1: {
    color: "white",
    fontWeight: "bold",
    
  },
});

export default ItemDetailsExpanded;
