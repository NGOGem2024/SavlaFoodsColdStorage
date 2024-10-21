import React, { useState } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

// Define the Product type
type Product = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
};

// Define your navigation stack types
type RootStackParamList = {
  Checkout: { cart: Product[], totalPrice: number }; // Passing cart and totalPrice to Checkout
  OrderPlacement: undefined;
  // Add other screens here if needed
};

const products: Product[] = [
  { id: '1', name: 'Apple', price: 2 },
  { id: '2', name: 'Bread', price: 3 },
  { id: '3', name: 'Milk', price: 1.5 },
  // Add more products here
];

const OrderPlacementScreen: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const addToCart = (product: Product) => {
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
      const updatedCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity! + 1 } : item
      );
      setCart(updatedCart);
      setTotalPrice(totalPrice + product.price);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      setTotalPrice(totalPrice + product.price);
    }
  };

  const removeFromCart = (product: Product) => {
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct && existingProduct.quantity! > 1) {
      const updatedCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity! - 1 } : item
      );
      setCart(updatedCart);
      setTotalPrice(totalPrice - product.price);
    } else {
      const updatedCart = cart.filter(item => item.id !== product.id);
      setCart(updatedCart);
      setTotalPrice(totalPrice - product.price);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const proceedToCheckout = () => {
    // Implement navigation to the Checkout screen
    navigation.navigate('Checkout', { cart, totalPrice });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={20} color="#000" />
        <TextInput
          style={styles.input}
          placeholder="Search products"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text>{item.name} - {item.price} Rs</Text>
            <View style={styles.buttons}>
              <Button title="-" onPress={() => removeFromCart(item)} />
              <Text>{cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}</Text>
              <Button title="+" onPress={() => addToCart(item)} />
            </View>
          </View>
        )}
      />
      <View style={styles.cartSummary}>
        <Text>Total:  {totalPrice.toFixed(2)}  Rs</Text>
        <Button title="Proceed to Checkout" onPress={proceedToCheckout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  productItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartSummary: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 8,
  },
});

export default OrderPlacementScreen;
