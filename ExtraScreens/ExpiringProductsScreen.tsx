import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

type FoodType = 'Fruits' | 'Milk Products' | 'Pulses' | 'Vegetables' | 'Dry Fruits' | 'Medicines' | 'Frozen Food' | 'Confectioneries';

interface Product {
  id: string;
  name: string;
  quantity: number;
  expirationDate: string;
  type: FoodType;
}

const ExpiringProductsScreen: React.FC = () => {
  const [selectedType, setSelectedType] = useState<FoodType | 'All'>('All');
  const [expiringProducts, setExpiringProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch expiring products from your data source or API
    const products: Product[] = [
      { id: '1', name: 'Milk', quantity: 10, expirationDate: '01-09-2024', type: 'Milk Products' },
      { id: '2', name: 'Apples', quantity: 20, expirationDate: '12-09-2024', type: 'Fruits' },
      { id: '3', name: 'Banana', quantity: 20, expirationDate: '12-09-2024', type: 'Fruits' },
      { id: '4', name: 'Almond', quantity: 20, expirationDate: '12-09-2024', type: 'Dry Fruits' },
      { id: '5', name: 'Tomato', quantity: 20, expirationDate: '12-09-2024', type: 'Vegetables' },
      { id: '6', name: 'Black gram', quantity: 20, expirationDate: '12-09-2024', type: 'Pulses' },
      // Add more products as needed
    ];

    setExpiringProducts(products);
  }, []);

  const handleDispose = (id: string) => {
    Alert.alert('Confirm', 'Are you sure you want to dispose of this product?', [
      { text: 'Cancel' },
      {
        text: 'OK',
        onPress: () => {
          setExpiringProducts(prevProducts => prevProducts.filter(product => product.id !== id));
          Alert.alert('Disposed', 'Product has been disposed of.');
        },
      },
    ]);
  };

  const filteredProducts = selectedType === 'All'
    ? expiringProducts
    : expiringProducts.filter(product => product.type === selectedType);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Filter by Product Type:</Text>
      <Picker
        selectedValue={selectedType}
        onValueChange={(itemValue) => setSelectedType(itemValue as FoodType | 'All')}
        style={styles.picker}
      >
        <Picker.Item label="All" value="All" />
        <Picker.Item label="Fruits" value="Fruits" />
        <Picker.Item label="Milk Products" value="Milk Products" />
        <Picker.Item label="Pulses" value="Pulses" />
        <Picker.Item label="Vegetables" value="Vegetables" />
        <Picker.Item label="Dry Fruits" value="Dry Fruits" />
        <Picker.Item label="Medicines" value="Medicines" />
        <Picker.Item label="Frozen Food" value="Frozen Food" />
        <Picker.Item label="Confectioneries" value="Confectioneries" />
      </Picker>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDetail}>Quantity: {item.quantity}</Text>
            <Text style={styles.productDetail}>Expires on: {item.expirationDate}</Text>
            <TouchableOpacity onPress={() => handleDispose(item.id)} style={styles.disposeButton}>
              <Icon name="delete" size={24} color="#d9534f" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No products nearing expiration.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    marginBottom: 16,
    backgroundColor:"#fff",
    elevation:2
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productDetail: {
    fontSize: 14,
    color: '#555',
  },
  disposeButton: {
    padding: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    padding: 20,
  },
});

export default ExpiringProductsScreen;
