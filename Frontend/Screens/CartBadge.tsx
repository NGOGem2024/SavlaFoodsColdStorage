// // In a components folder
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { useCart } from '././contexts/CartContext';

// export const CartBadge = () => {
//   const { cartItems } = useCart();

//   if (cartItems.length === 0) return null;

//   return (
//     <View style={styles.badge}>
//       <Text style={styles.badgeText}>{cartItems.length}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   badge: {
//     position: 'absolute',
//     top: -8,
//     right: -8,
//     backgroundColor: 'red',
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   badgeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold'
//   }
// });