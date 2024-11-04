import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';

// Define product types and stock data
const productTypes = [
  'Fruits',
  'Milk Products',
  'Vegetables',
  'Dry Fruits',
  'Pulses',
  'Medicines',
  'Frozen Food',
  'Confectioneries',
] as const;

type FoodType = typeof productTypes[number];

interface StockItem {
  id: string;
  name: string;
  quantity: number;
  lot_no: number;
}

const initialStockData: Record<FoodType, StockItem[]> = {
  'Milk Products': [
    { id: '1', name: 'Paneer', lot_no: 101, quantity: 50 },
    { id: '2', name: 'Cheese', lot_no: 102, quantity: 30 },
  ],
  'Fruits': [
    { id: '3', name: 'Apple', lot_no: 201, quantity: 100 },
    { id: '4', name: 'Banana', lot_no: 202, quantity: 80 },
  ],
  'Vegetables': [],
  'Dry Fruits': [],
  'Pulses': [],
  'Medicines': [],
  'Frozen Food': [],
  'Confectioneries': [],
};

const OutwardsScreen: React.FC = () => {
  const [selectedType, setSelectedType] = useState<FoodType | null>(null);
  const [selectedStock, setSelectedStock] = useState<StockItem[]>([]);
  const [quantityState, setQuantityState] = useState<Record<string, string>>({});
  const [stockData, setStockData] = useState(initialStockData);

  useEffect(() => {
    if (selectedType) {
      setSelectedStock(stockData[selectedType] || []);
    } else {
      setSelectedStock([]);
    }
  }, [selectedType, stockData]);

  const handleDispatchStock = (item: StockItem) => {
    const dispatchQuantity = parseInt(quantityState[item.id] || '0');
    if (dispatchQuantity) {
      if (dispatchQuantity <= item.quantity) {
        // Update stock data
        const updatedStock = stockData[selectedType!].map(stockItem =>
          stockItem.id === item.id
            ? { ...stockItem, quantity: stockItem.quantity - dispatchQuantity }
            : stockItem
        );

        setStockData({
          ...stockData,
          [selectedType!]: updatedStock,
        });

        Alert.alert('Success', `${dispatchQuantity} of ${item.name} dispatched from ${selectedType} stocks!`);
        setQuantityState(prevState => ({ ...prevState, [item.id]: '' }));
      } else {
        Alert.alert('Error', 'Quantity exceeds available stock');
      }
    } else {
      Alert.alert('Error', 'Please enter a valid quantity');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Type of Product:</Text>
      <Picker
        selectedValue={selectedType}
        onValueChange={(itemValue) => setSelectedType(itemValue as FoodType)}
        style={styles.picker}
      >
        <Picker.Item label="Select the Product" value={null} />
        {productTypes.map((type) => (
          <Picker.Item key={type} label={type} value={type} />
        ))}
      </Picker>

      {selectedStock.length > 0 && (
        <FlatList
          data={selectedStock}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.stockItem}>
              <Text style={styles.stockText}>
                {item.name} - Lot No: {item.lot_no} - Quantity: {item.quantity}
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={quantityState[item.id] || ''}
                  onChangeText={(text) => setQuantityState(prevState => ({ ...prevState, [item.id]: text }))}
                  keyboardType="numeric"
                  placeholder="Quantity"
                />
                <TouchableOpacity
                  style={styles.dispatchButton}
                  onPress={() => handleDispatchStock(item)}
                >
                  <MaterialIcons name="send" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
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
    color: '#333',
  },
  picker: {
    height: 50,
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  stockItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  stockText: {
    fontSize: 16, // Reduced font size for better space management
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensures spacing between input and button
  },
  input: {
    height: 35, // Reduced height for a more compact design
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    flex: 1,
    marginRight: 8,
    fontSize: 14, // Reduced font size for better alignment
  },
  dispatchButton: {
    backgroundColor: '#91d3f6', // Blue color for a professional look
    paddingVertical: 6, // Reduced padding for a smaller button
    paddingHorizontal: 12, // Reduced padding for a smaller button
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OutwardsScreen;