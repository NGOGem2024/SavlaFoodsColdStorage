// CategoryStockScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

interface Stock {
  id: string;
  name: string;
  quantity: number;
  lot_no: number;
  category: string;
}

const dummyData: Stock[] = [
  { id: '1', name: 'Apples', quantity: 50, lot_no: 101, category: 'Fruits' },
  { id: '2', name: 'Bananas', quantity: 30, lot_no: 102, category: 'Fruits' },
  { id: '3', name: 'Grapes', quantity: 30, lot_no: 103, category: 'Fruits' },
  { id: '4', name: 'Watermelon', quantity: 40, lot_no: 104, category: 'Fruits' },
  { id: '5', name: 'orange', quantity: 35, lot_no: 105, category: 'Fruits' },
  { id: '1', name: 'Cheese', quantity: 30, lot_no: 106, category: 'Milk Products' },
  { id: '2', name: 'Paneer', quantity: 30, lot_no: 102, category: 'Milk Products' },
  { id: '3', name: 'Ghee', quantity: 30, lot_no: 107, category: 'Milk Products' },
  { id: '4', name: 'Butter', quantity: 30, lot_no: 109, category: 'Milk Products' },
  { id: '5', name: 'Curd', quantity: 30, lot_no: 108, category: 'Milk Products' },
  { id: '1', name: 'Tomato', quantity: 30, lot_no: 106, category: 'Vegetables' },
  { id: '2', name: 'Potato', quantity: 30, lot_no: 102, category: 'Vegetables' },
  { id: '3', name: 'Coriender', quantity: 30, lot_no: 107, category: 'Vegetables' },
  { id: '4', name: 'Onion', quantity: 30, lot_no: 109, category: 'Vegetables' },
  { id: '5', name: 'Chilli', quantity: 30, lot_no: 108, category: 'Vegetables' },
  { id: '1', name: 'Almond', quantity: 30, lot_no: 106, category: 'Dry Fruits' },
  { id: '2', name: 'Cashew', quantity: 30, lot_no: 102, category: 'Dry Fruits' },
  { id: '3', name: 'Berries', quantity: 30, lot_no: 107, category: 'Dry Fruits' },
  { id: '4', name: 'Raisins', quantity: 30, lot_no: 109, category: 'Dry Fruits' },
  { id: '5', name: 'Walnuts', quantity: 30, lot_no: 108, category: 'Dry Fruits' },
  { id: '1', name: 'Cheakpeas', quantity: 30, lot_no: 106, category: 'Pulses' },
  { id: '2', name: 'Lentils', quantity: 30, lot_no: 102, category: 'Pulses' },
  { id: '3', name: 'Kidney Beans', quantity: 30, lot_no: 107, category: 'Pulses' },
  { id: '4', name: 'Black Gram', quantity: 30, lot_no: 109, category: 'Pulses' },
  { id: '5', name: 'Green Gram', quantity: 30, lot_no: 108, category: 'Pulses' },
  { id: '1', name: 'Paracetmol', quantity: 30, lot_no: 106, category: 'Medicines' },
  { id: '2', name: 'Amoxicillin', quantity: 30, lot_no: 102, category: 'Medicines' },
  { id: '3', name: 'Azithromycin', quantity: 30, lot_no: 107, category: 'Medicines' },
  { id: '4', name: 'Ativan', quantity: 30, lot_no: 109, category: 'Medicines' },
  { id: '5', name: 'Antibiotic', quantity: 30, lot_no: 108, category: 'Medicines' },
  { id: '1', name: 'Frozen Bread', quantity: 30, lot_no: 106, category: 'Frozen Food' },
  { id: '2', name: 'Frozen Cheese', quantity: 30, lot_no: 102, category: 'Frozen Food' },
  { id: '3', name: 'Frozen Pizzas', quantity: 30, lot_no: 107, category: 'Frozen Food' },
  { id: '4', name: 'Frozen meat', quantity: 30, lot_no: 109, category: 'Frozen Food' },
  { id: '5', name: 'Pre- cooked Frozen Food', quantity: 30, lot_no: 108, category: 'Frozen Food' },
  { id: '1', name: 'Sugar Candy', quantity: 30, lot_no: 106, category: 'Confectioneries' },
  { id: '2', name: 'Caramels', quantity: 30, lot_no: 102, category: 'Confectioneries' },
  { id: '3', name: 'Chocolate', quantity: 30, lot_no: 107, category: 'Confectioneries' },
  { id: '4', name: 'Tofee', quantity: 30, lot_no: 109, category: 'Confectioneries' },
  { id: '5', name: 'lozenges', quantity: 30, lot_no: 108, category: 'Confectioneries' },

];

type CategoryStockRouteProp = RouteProp<{ CategoryStock: { category: string } }, 'CategoryStock'>;

const CategoryStockScreen: React.FC = () => {
  const route = useRoute<CategoryStockRouteProp>();
  const { category } = route.params;

  const filteredData = dummyData.filter((item) => item.category === category);

  const renderItem = ({ item }: { item: Stock }) => (
    

    <View style={styles.item}>      
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.details}>Quantity: {item.quantity}</Text>
      <Text style={styles.details}>Lot no: {item.lot_no}</Text>       
    </View>      
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items available in {category}</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  item: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopColor:"#d6eaf8",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },
});

export default CategoryStockScreen;
