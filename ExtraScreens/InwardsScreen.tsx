import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

type FoodType = 'Fruits' | 'Milk Products' | 'Pulses' | 'Vegetables' | 'Dry Fruits' | 'Medicines' | 'Frozen Food' | 'Confectioneries';

interface StockItem {
  id: string;
  name: string;
  quantity: number;
  lot_no: number;
  type: FoodType;
}

const InwardsScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [lotNo, setLotNo] = useState('');
  const [type, setType] = useState<FoodType | null>(null);

  const navigation = useNavigation();

  const handleAddStock = () => {
    if (name && quantity && lotNo && type) {
      const newStock: StockItem = {
        id: Math.random().toString(), // Generate a random ID
        name,
        quantity: parseInt(quantity),
        lot_no: parseInt(lotNo),
        type,
      };

      // Implement logic to add to stocks
      console.log('New stock added:', newStock);
      Alert.alert('Success', `${name} added to ${type} stocks!`);

      // Reset fields after adding
      setName('');
      setQuantity('');
      setLotNo('');
      setType(null); // Reset to default "Select the Product"
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  return (
    <View style={styles.container}>
       <Text style={styles.label}>Type of Product:</Text>
      <Picker
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue as FoodType)}
        style={styles.picker}
      >
        <Picker.Item label="Select the Product" value={null} />
        <Picker.Item label="Fruits" value="Fruits" />
        <Picker.Item label="Milk Products" value="Milk Products" />
        <Picker.Item label="Pulses" value="Pulses" />
        <Picker.Item label="Vegetables" value="Vegetables" />
        <Picker.Item label="Dry Fruits" value="Dry Fruits" />
        <Picker.Item label="Medicines" value="Medicines" />
        <Picker.Item label="Frozen Food" value="Frozen Food" />
        <Picker.Item label="Confectioneries" value="Confectioneries" />
      </Picker>

      <Text style={styles.label}>Name of the Product:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter product name"
      />
      
      <Text style={styles.label}>Quantity:</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        placeholder="Enter quantity"
      />
      
      <Text style={styles.label}>Lot Number:</Text>
      <TextInput
        style={styles.input}
        value={lotNo}
        onChangeText={setLotNo}
        keyboardType="numeric"
        placeholder="Enter lot number"
      />
      
      <Text style={styles.label}>Received By</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Goods Received by"
      />
       
      <TouchableOpacity style={styles.addButton} onPress={handleAddStock}>
        <Icon name="add-circle" size={24} color="#fff" />
        <Text style={styles.buttonText}>Add Stock</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
    marginLeft:5
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    width:'95%',
    justifyContent: 'center',
    marginLeft:5,
    elevation:2
  },
  picker: {
    height: 50,
    marginBottom: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    width:'95%',
    marginLeft:5,
    elevation:2
  },
  addButton: {
    width:"50%",  
    flexDirection: 'row',    
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#91d3f6',
    borderRadius: 8,
    elevation: 3,
    marginHorizontal:'25%',
    alignItems: 'center',
    justifyContent: 'center',   
    marginTop:20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default InwardsScreen;
