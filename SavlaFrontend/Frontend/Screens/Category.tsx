import React, { useState, useCallback,useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Dimensions, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useCart } from './contexts/CartContext';
import { StackNavigationProp } from '@react-navigation/stack';


type RootStackParamList = {
  Category: { category: string };
  LotReportScreen: {item : any};
};

type CategoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Category'>;
type CategoryRouteProp = RouteProp<RootStackParamList, 'Category'>;

const { width } = Dimensions.get('window');

// Mock data for categories and items (unchanged)
const categories = [
  { id: '1', name: 'fruits', icon: require('../../assets/fruits.png') },
  { id: '2', name: 'spices', icon: require('../../assets/spices/spices2.png') },
  { id: '3', name: 'pulses', icon: require('../../assets/pulses.png') },
  { id: '4', name: 'medicines', icon: require('../../assets/medicines.png') },
  { id: '5', name: 'dry-fruits', icon: require('../../assets/dry-fruits.png') },
  { id: '6', name: 'vegetables', icon: require('../../assets/vegetables.png') },
  { id: '7', name: 'milk-products', icon: require('../../assets/milk-products.png') },
  { id: '8', name: 'confectionaries', icon: require('../../assets/confectionaries.png') },
  { id: '9', name: 'meat', icon: require('../../assets/meat.png') },
];

const itemsData = {
  'fruits': [
    { id: '1', name: "Apple", quantity: '5000',  image: require('../../assets/fruits/apple.png') },
    { id: '2', name: "Orange", quantity: '5000', image: require('../../assets/fruits/orange.png') },
    { id: '3', name: "Banana", quantity: '5000',   image: require('../../assets/fruits/banana.png') },
    { id: '4', name: "Grapes", quantity: '5000',   image: require('../../assets/fruits/grapes.png') },
    { id: '5', name: "strawberry", quantity: '5000',  image: require('../../assets/fruits/strawberry.png') },
    // Add more items for this category
  ],
  'spices':[
    // { id: '1', name: "Sesame", quantity: '5000',  image: require('../../assets/spices/sesame.png') },
    { id: '1', name: "Redchillipowder", quantity: '5000',  image: require('../../assets/spices/redchillipowder.png') },
    { id: '2', name: "Cardamon", quantity: '5000',  image: require('../../assets/spices/cardamom.png') },
    // { id: '3', name: "Cinnamon", quantity: '5000',  image: require('../../assets/spices/cinnamon.png') },
    { id: '3', name: "Cloves", quantity: '5000',  image: require('../../assets/spices/cloves.png') },
    { id: '4', name: "Turmeric", quantity: '5000',  image: require('../../assets/spices/turmeric.png') },
    
    { id: '5', name: "Blackpepper", quantity: '5000',  image: require('../../assets/spices/blackpepper.png') },
  ],
  'pulses':[     
    { id: '2', name: "redlentils", quantity: '5000',  image: require('../../assets/pulses/redlentils.png') },
    { id: '3', name: "greenpeas", quantity: '5000',  image: require('../../assets/pulses/greenpeas.png') },
    { id: '4', name: "redbeans", quantity: '5000',  image: require('../../assets/pulses/redbeans.png') },    
  ],
  'medicines':[
    { id: '1', name: "paracetamol", quantity: '5000',  image: require('../../assets/medicines/paracetamol.png') },
    { id: '2', name: "ibuprofen", quantity: '5000',  image: require('../../assets/medicines/ibuprofen.png') },
  ],
  'dry-fruits':[
    { id: '1', name: "dates", quantity: '5000',  image: require('../../assets/dry-fruits/dates.png') },
    { id: '2', name: "pistachio", quantity: '5000',  image: require('../../assets/dry-fruits/pistachio.png') },
    { id: '3', name: "raisins", quantity: '5000',  image: require('../../assets/dry-fruits/raisins.png') },
    { id: '4', name: "walnut", quantity: '5000',  image: require('../../assets/dry-fruits/walnut.png') },
  ],
  'vegetables':[
    { id: '1', name: "brinjal", quantity: '5000',  image: require('../../assets/vegetables/brinjal.png') },    
    { id: '2', name: "broccoli", quantity: '5000',  image: require('../../assets/vegetables/broccoli.png') },    
    { id: '3', name: "tomato", quantity: '5000',  image: require('../../assets/vegetables/tomato.png') },             
  ],
  'milk-products':[
    { id: '1', name: "cheese", quantity: '5000',  image: require('../../assets/milk-products/cheese.png') },    
    { id: '2', name: "butter", quantity: '5000',  image: require('../../assets/milk-products/butter.png') },    
  ],
  'confectionaries':[
    { id: '1', name: "donuts", quantity: '5000',  image: require('../../assets/confectionaries/donuts.png') },    
    { id: '2', name: "waffles", quantity: '5000',  image: require('../../assets/confectionaries/waffles.png') },    
  ],
  'meat':[
    { id: '1', name: "fish", quantity: '5000',  image: require('../../assets/meat/fish.jpg') },    
    { id: '2', name: "chicken", quantity: '5000',  image: require('../../assets/meat/chicken.jpg') },    
  ]
  // Add mock data for other categories
};

const Category: React.FC = () => {
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const route = useRoute<CategoryRouteProp>();
  const [selectedCategory, setSelectedCategory] = useState(route.params.category);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [quantity, setQuantity] = useState('1');
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (selectedItem) {
      addToCart({
        id: selectedItem.id,
        name: selectedItem.name,
        category: selectedCategory,
        quantity: parseInt(quantity),
        image: Image.resolveAssetSource(selectedItem.image).uri,
        
      });       
      setModalVisible(false);
      setQuantity('1');
    }
  };
  
  const renderCategoryItem = useCallback(({ item }: { item: { id: string; name: string; icon: any } }) => (
    <TouchableOpacity
      style={[styles.categoryItem, selectedCategory === item.name && styles.selectedCategoryItem]}
      onPress={() => setSelectedCategory(item.name)}
    >
      <Image source={item.icon} style={styles.categoryIcon} />
      <Text style={[styles.categoryText, selectedCategory === item.name && styles.selectedCategoryText]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  ), [selectedCategory]);

  const renderItemCard = useCallback(({ item }: { item: { id: string; name: string; quantity: string;image: any } }) => (     
    <View style={styles.itemCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate('LotReportScreen',  {item : item})}>
      <Image 
        source={typeof item.image === 'number' ? item.image : { uri: item.image }} 
        style={styles.itemImage} 
      />
      </TouchableOpacity>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>Available: {item.quantity}</Text>
        <View style={styles.itemPriceContainer}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => { 
              setSelectedItem(item);
              setModalVisible(true);
            }}
          >
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
     
  ), []);

  return (     
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>        
        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}        
            showsVerticalScrollIndicator={false}   
             
          />
        </View>
        <View style={styles.itemsContainer}>
          <FlatList
            data={itemsData[selectedCategory as keyof typeof itemsData]}
            renderItem={renderItemCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Quantity:</Text>
            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.quantityInput}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
              <TouchableOpacity style={styles.modalAddButton} onPress={handleAddToCart}>
                <Text style={styles.modalAddButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>     
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },       
  content: {
    flex: 1,
    flexDirection: 'row',     
  },
  categoriesContainer: {
    width: '32%',
    maxHeight:'100%' // Adjust this value to change the width of the category list
    // borderRightWidth: 1,
    // borderRightColor: '#e0e0e0',

  },
  categoryItem: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 13,     
    backgroundColor:'#fff'  ,
    elevation:1   
  },
  selectedCategoryItem: {
    backgroundColor: '#f0f0f0',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 14,
  },
  selectedCategoryText: {
    fontWeight: 'bold',
  },
  itemsContainer: {
    flex: 1,
    padding: 16,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderColor:"white",
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 15,
    borderRadius:25,     
  },
  itemInfo: {
    flex: 1,
  },
  itemDeliveryTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginLeft:50,
  },
  addButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 14,
    
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '70%', // Increased width
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft:-100
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  modalAddButton: {
    backgroundColor: '#F48226',
    padding: 10,
    borderRadius: 5,
    width: 80,
    alignItems: 'center',
  },
  modalAddButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Category;

function addToCart(arg0: any) {
  throw new Error('Function not implemented.');
}