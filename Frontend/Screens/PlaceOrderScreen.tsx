import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { Package, Box, Boxes, ShoppingBag, TrendingUp, ClipboardCheck } from 'lucide-react-native';

interface PlaceOrderScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

interface ItemDetails {
  category: string;
  subcategory: string;
  lotNo: string;
  vakkal: string;
  availableQty: number;
  netQty: number;
  balanceQty: number;
  placedQty: number;
}

const PlaceOrderScreen: React.FC<PlaceOrderScreenProps> = ({ navigation, route }) => {
  const [itemDetails, setItemDetails] = useState<ItemDetails>({
    category: '',
    subcategory: '',
    lotNo: '',
    vakkal: '',
    availableQty: 0,
    netQty: 0,
    balanceQty: 0,
    placedQty: 0,
  });

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(-50);
  const scaleAnim = new Animated.Value(0.9);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 12,
        bounciness: 6,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: 12,
        bounciness: 6,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const animateProgress = () => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  };

  const handlePlaceOrder = () => {
    if (itemDetails.placedQty <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    if (itemDetails.placedQty > itemDetails.availableQty) {
      Alert.alert('Error', 'Placed quantity cannot exceed available quantity');
      return;
    }

    Alert.alert(
      'Confirm Order',
      'Do you want to place this order?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            animateProgress();
            setTimeout(() => {
              Alert.alert('Success', 'Order placed successfully');
              navigation.goBack();
            }, 1500);
          },
        },
      ]
    );
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          style={[
            styles.headerSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.headerIconContainer}>
            <ShoppingBag size={32} color="#F48221" />
          </View>
          <Text style={styles.headerTitle}>Place Order</Text>
          <Text style={styles.headerSubtitle}>Review and confirm your order details</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Package size={20} color="#F48221" />
            <Text style={styles.sectionTitle}>Item Details</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{itemDetails.category || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Subcategory:</Text>
            <Text style={styles.value}>{itemDetails.subcategory || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Lot No:</Text>
            <Text style={styles.value}>{itemDetails.lotNo || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Vakkal:</Text>
            <Text style={styles.value}>{itemDetails.vakkal || 'N/A'}</Text>
          </View>
        </Animated.View>

        <Animated.View 
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Boxes size={20} color="#F48221" />
            <Text style={styles.sectionTitle}>Quantity Details</Text>
          </View>
          
          <View style={styles.quantityGrid}>
            <View style={styles.quantityBox}>
              <Text style={styles.quantityLabel}>Available</Text>
              <Text style={styles.quantityValue}>{itemDetails.availableQty}</Text>
            </View>
            
            <View style={styles.quantityBox}>
              <Text style={styles.quantityLabel}>Net</Text>
              <Text style={styles.quantityValue}>{itemDetails.netQty}</Text>
            </View>
            
            <View style={styles.quantityBox}>
              <Text style={styles.quantityLabel}>Balance</Text>
              <Text style={styles.quantityValue}>{itemDetails.balanceQty}</Text>
            </View>
          </View>

          <View style={styles.placedQuantityContainer}>
            <Text style={styles.placedQuantityLabel}>Placed Quantity</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.quantityInput}
                keyboardType="numeric"
                value={itemDetails.placedQty.toString()}
                onChangeText={(text) => 
                  setItemDetails({
                    ...itemDetails,
                    placedQty: parseInt(text) || 0
                  })
                }
                placeholder="Enter quantity"
                placeholderTextColor="#999"
              />
              <View style={styles.inputIcon}>
                <Box size={20} color="#666" />
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          style={[
            styles.progressContainer,
            { opacity: progressAnim }
          ]}
        >
          <Animated.View 
            style={[
              styles.progressBar,
              { width: progressWidth }
            ]} 
          />
        </Animated.View>

        <TouchableOpacity 
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          activeOpacity={0.8}
        >
          <ClipboardCheck size={24} color="#FFF" style={styles.buttonIcon} />
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 16,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIconContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 15,
    color: '#666',
  },
  value: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  quantityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quantityBox: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quantityLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F48221',
  },
  placedQuantityContainer: {
    marginTop: 16,
  },
  placedQuantityLabel: {
    fontSize: 15,
    color: '#666',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  quantityInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  inputIcon: {
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginVertical: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#F48221',
  },
  placeOrderButton: {
    backgroundColor: '#F48221',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#F48221',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  placeOrderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PlaceOrderScreen;