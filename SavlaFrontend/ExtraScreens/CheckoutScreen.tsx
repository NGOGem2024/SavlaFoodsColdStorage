// import React from 'react';
// import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
// import { RouteProp } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../Frontend/type/types' // Adjust the import path based on your file structure

// // Define the Product type
// type Product = {
//   id: string;
//   name: string;
//   price: number;
//   quantity?: number;
// };

// // Define the props that the Checkout screen expects
// type CheckoutScreenRouteProp = RouteProp<RootStackParamList, 'Checkout'>;
// type CheckoutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Checkout'>;

// type CheckoutProps = {
//   route: CheckoutScreenRouteProp;
//   navigation: CheckoutScreenNavigationProp;
// };

// const CheckoutScreen: React.FC<CheckoutProps> = ({ route, navigation }) => {
//   const { cart, totalPrice } = route.params;

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={cart}
//         keyExtractor={item => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.productItem}>
//             <Text>{item.name} - ${item.price} x {item.quantity || 1}</Text>
//           </View>
//         )}
//       />
//       <View style={styles.cartSummary}>
//         <Text>Total: ${totalPrice.toFixed(2)}</Text>
//         <Button title="Confirm Purchase" onPress={() => {/* Implement Purchase Logic */}} />
//         <Button title="Cancel" onPress={() => navigation.goBack()} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   productItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   cartSummary: {
//     padding: 10,
//     borderTopWidth: 1,
//     borderTopColor: '#ddd',
//     marginTop: 10,
//   },
// });

// export default CheckoutScreen;
