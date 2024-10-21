import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type RootStackParamList = {
  CategoryStock: { category: string };
  // Other routes can be added here if needed
};

const categories: string[] = [
  'Fruits',
  'Milk Products',
  'Vegetables',
  'Dry Fruits',
  'Pulses',
  'Medicines',
  'Frozen Food',
  'Confectioneries',
];

const StocksScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePress = (category: string) => {
    navigation.navigate('CategoryStock', { category });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Fruits':
        return 'apple'; // Apple icon from MaterialCommunityIcons
      case 'Milk Products':
        return 'cup-water';
      case 'Vegetables':
        return 'leaf';
      case 'Dry Fruits':
        return 'peanut';
      case 'Pulses':
        return 'corn';
      case 'Medicines':
        return 'pill';
      case 'Frozen Food':
        return 'snowflake';
      case 'Confectioneries':
        return 'candycane';
      default:
        return 'food'; // Fallback icon
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Fruits':
        return '#FF6347'; // Tomato red
      case 'Milk Products':
        return '#4682B4'; // Steel blue
      case 'Vegetables':
        return '#32CD32'; // Lime green
      case 'Dry Fruits':
        return '#D2691E'; // Chocolate brown
      case 'Pulses':
        return '#FFD700'; // Gold
      case 'Medicines':
        return '#FF4500'; // Orange red
      case 'Frozen Food':
        return '#1E90FF'; // Dodger blue
      case 'Confectioneries':
        return '#FF1493'; // Deep pink
      default:
        return '#007bff'; // Fallback color
    }
  };

  return (
    <LinearGradient colors={['#f1c564', '#91d3f6']} style={styles.background}>
    <View style={styles.container}>
      <Text style={styles.header}>Stock Categories</Text>      
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryItem} onPress={() => handlePress(item)}>
            <MaterialCommunityIcons
              name={getCategoryIcon(item)}
              size={24}
              color={getCategoryColor(item)}
              style={styles.icon}
            />
            <Text style={styles.categoryText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: {
    marginRight: 12,
  },
  categoryText: {
    fontSize: 18,
    color: '#333',
  },
   background: {
    flex: 1,
  },
});

export default StocksScreen;