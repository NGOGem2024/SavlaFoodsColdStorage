import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from './contexts/CartContext';
import { useNotification } from './contexts/NotificationContext';
import { useNavigation } from '@react-navigation/native';

interface CartItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  image: string;   
}

const CartScreen: React.FC = () => {
  const { cart, removeFromCart, clearCart, getTotalItems, getTotalQuantity } = useCart();
  const navigation = useNavigation();
  const { addNotification } = useNotification();

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          removeFromCart(item.id);
          Alert.alert('Item Removed', `${item.name} has been removed from your cart.`);
        }}
        style={styles.removeButton}
      >
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Add items before placing an order.');
    } else {
      Alert.alert(
        'Order Placed',
        `Your order of ${getTotalItems()} items for a total quantity of ${getTotalQuantity()} has been placed successfully!`,
        [
          {
            text: 'OK',
            onPress: () => {
              clearCart();
              addNotification('Your order has been placed successfully!');
              
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyCart}>Your cart is empty</Text>}
      />
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Total Items: {getTotalItems()}</Text>
        <Text style={styles.summaryText}>Total Quantity: {getTotalQuantity()}</Text>
      </View>
      <TouchableOpacity onPress={handlePlaceOrder} style={styles.placeOrderButton}>
        <Text style={styles.placeOrderButtonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  cartItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
  },
  itemQuantity: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 5,
  },
  emptyCart: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
  summaryContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
  },
  placeOrderButton: {
    backgroundColor: '#F48221',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;