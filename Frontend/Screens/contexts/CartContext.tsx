// // // import React, { createContext, useState, useContext, ReactNode } from 'react';

// // // interface CartItem {
// // //   id: string;
// // //   name: string;
// // //   category: string;
// // //   quantity: number;
// // //   image: string;
// // // }

// // // interface CartContextType {
// // //   cart: CartItem[];
// // //   addToCart: (item: CartItem) => void;
// // //   removeFromCart: (id: string) => void;
// // //   clearCart: () => void;
// // //   getTotalItems: () => number;
// // //   getTotalQuantity: () => number;
// // // }

// // // const CartContext = createContext<CartContextType | undefined>(undefined);

// // // export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
// // //   const [cart, setCart] = useState<CartItem[]>([]);

// // //   const addToCart = (newItem: CartItem) => {
// // //     setCart((prevCart) => {
// // //       const existingItemIndex = prevCart.findIndex((item) => item.id === newItem.id);
      
// // //       if (existingItemIndex !== -1) {
// // //         // If the item already exists, update its quantity
// // //         const updatedCart = [...prevCart];
// // //         updatedCart[existingItemIndex] = {
// // //           ...updatedCart[existingItemIndex],
// // //           quantity: updatedCart[existingItemIndex].quantity + newItem.quantity
// // //         };
// // //         return updatedCart;
// // //       } else {
// // //         // If it's a new item, add it to the cart
// // //         return [...prevCart, newItem];
// // //       }
// // //     });
// // //   };

// // //   const removeFromCart = (id: string) => {
// // //     setCart((prevCart) => prevCart.filter((item) => item.id !== id));
// // //   };

// // //   const clearCart = () => {
// // //     setCart([]);
// // //   };

// // //   const getTotalItems = () => cart.length;

// // //   const getTotalQuantity = () => cart.reduce((total, item) => total + item.quantity, 0);

// // //   return (
// // //     <CartContext.Provider
// // //       value={{
// // //         cart,
// // //         addToCart,
// // //         removeFromCart,
// // //         clearCart,
// // //         getTotalItems,
// // //         getTotalQuantity,
// // //       }}
// // //     >
// // //       {children}
// // //     </CartContext.Provider>
// // //   );
// // // };

// // // export const useCart = () => {
// // //   const context = useContext(CartContext);
// // //   if (context === undefined) {
// // //     throw new Error('useCart must be used within a CartProvider');
// // //   }
// // //   return context;
// // // };


// // import React, { createContext, useState, useContext, ReactNode } from 'react';

// // export interface CartItem {
// //   item_id: string | number;
// //   item_name: string;
// //   lot_no: string;
// //   quantity: number;
// //   available_qty?: number;
// //   unit_name?: string;
// //   price?: number;
// //   description?: string;
// //   item_marks?: string;
// //   vakal_no?: string;
// // }

// // interface CartContextType {
// //   cart: CartItem[];
// //   addToCart: (item: CartItem) => void;
// //   removeFromCart: (itemId: string | number, lotNo: string) => void;
// //   clearCart: () => void;
// // }

// // const CartContext = createContext<CartContextType | undefined>(undefined);

// // export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
// //   const [cart, setCart] = useState<CartItem[]>([]);

// //   const addToCart = (item: CartItem) => {
// //     // Check if item already exists in cart
// //     const existingItemIndex = cart.findIndex(
// //       cartItem => cartItem.item_id === item.item_id && cartItem.lot_no === item.lot_no
// //     );

// //     if (existingItemIndex > -1) {
// //       // Update quantity if item exists
// //       const updatedCart = [...cart];
// //       updatedCart[existingItemIndex].quantity += item.quantity;
// //       setCart(updatedCart);
// //     } else {
// //       // Add new item to cart
// //       setCart([...cart, item]);
// //     }
// //   };

// //   const removeFromCart = (itemId: string | number, lotNo: string) => {
// //     setCart(cart.filter(item => 
// //       item.item_id !== itemId || item.lot_no !== lotNo
// //     ));
// //   };

// //   const clearCart = () => {
// //     setCart([]);
// //   };

// //   return (
// //     <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
// //       {children}
// //     </CartContext.Provider>
// //   );
// // };

// // export const useCart = () => {
// //   const context = useContext(CartContext);
// //   if (!context) {
// //     throw new Error('useCart must be used within a CartProvider');
// //   }
// //   return context;
// // };


// // // contexts/CartContext.tsx
// // import React, { createContext, useState, useContext } from 'react';

// // interface CartItem {
// //   item_marks: string;
// //   vakal_no: string;
// //   vakkal_no: string;
// //   item_id: number;
// //   item_name: string;
// //   lot_no: string;
// //   available_qty: number;
// //   unit_name: string;
// //   quantity: number;
// //   customerID?: number | string;
// // }

// // interface CartContextType {
// //   cartItems: CartItem[];
// //   addToCart: (item: CartItem) => void;
// //   clearCart: () => void;
// // }

// // const CartContext = createContext<CartContextType>({
// //   cartItems: [],
// //   addToCart: () => {},
// //   clearCart: () => {}
// // });

// // export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
// //   const [cartItems, setCartItems] = useState<CartItem[]>([]);

// //   // In CartContext.tsx
// // const useCart = () => {
// //   const [cartItems, setCartItems] = useState([]);

// //   const clearCart = () => {
// //     setCartItems([]);
// //   };

// //   return { cartItems, setCartItems, clearCart };
// // };

// //   const addToCart = (item: CartItem) => {
// //     setCartItems(prevItems => {
// //       // Check if item already exists
// //       const existingItemIndex = prevItems.findIndex(
// //         cartItem => cartItem.lot_no === item.lot_no
// //       );


// //       // const updateCartItemQuantity = (itemId, newQuantity) => {
// //       //   setCartItems(prevItems => 
// //       //     prevItems.map(item => 
// //       //       item.item_id === itemId 
// //       //         ? { ...item, quantity: newQuantity } 
// //       //         : item
// //       //     )
// //       //   );
// //       // };

// //       if (existingItemIndex > -1) {
// //         // Update quantity if item exists
// //         const updatedItems = [...prevItems];
// //         updatedItems[existingItemIndex] = {
// //           ...updatedItems[existingItemIndex],
// //           quantity: updatedItems[existingItemIndex].quantity + item.quantity
// //         };
// //         return updatedItems;
// //       }

// //       // Add new item if it doesn't exist
// //       return [...prevItems, item];
// //     });
// //   };

// //   const clearCart = () => {
// //     setCartItems([]);
// //   };

// //   return (
// //     <CartContext.Provider value={{ cartItems, addToCart, clearCart }}>
// //       {children}
// //     </CartContext.Provider>
// //   );
// // };

// // export const useCart = () => useContext(CartContext);

// // import React, { createContext, useState, useContext } from 'react';

// // interface CartItem {
// //   box_quantity: number;
// //   item_marks: string;
// //   vakal_no: string;
// //   vakkal_no: string;
// //   item_id: number;
// //   item_name: string;
// //   lot_no: string;
// //   available_qty: number;
// //   unit_name: string;
// //   quantity: number;
// //   customerID?: number | string;
// // }

// // interface CartContextType {
// //   cartItems: CartItem[];
// //   addToCart: (item: CartItem) => void;
// //   clearCart: () => void;
// //   removeCartItem: (item: CartItem) => void; // New method
// // }

// // const CartContext = createContext<CartContextType>({
// //   cartItems: [],
// //   addToCart: () => {},
// //   clearCart: () => {},
// //   removeCartItem: () => {} // Add default implementation
// // });

// // export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
// //   const [cartItems, setCartItems] = useState<CartItem[]>([]);

// //   const addToCart = (item: CartItem) => {

// //     console.log('Adding to cart:', JSON.stringify(item, null, 2));
// //     setCartItems(prevItems => {
// //       // Check if item already exists
// //       const existingItemIndex = prevItems.findIndex(
// //         cartItem => cartItem.lot_no === item.lot_no
// //       );

// //       if (existingItemIndex > -1) {
// //         // Update quantity if item exists
// //         const updatedItems = [...prevItems];
// //         updatedItems[existingItemIndex] = {
// //           ...updatedItems[existingItemIndex],
// //           quantity: updatedItems[existingItemIndex].quantity + item.quantity
// //         };
// //         return updatedItems;
// //       }

// //       // Add new item if it doesn't exist
// //       return [...prevItems, item];
// //     });
// //   };

// //   const clearCart = () => {
// //     setCartItems([]);
// //   };

// //   const removeCartItem = (itemToRemove: CartItem) => {
// //     setCartItems(prevItems => 
// //       prevItems.filter(item => item.lot_no !== itemToRemove.lot_no)
// //     );
// //   };

// //   return (
// //     <CartContext.Provider value={{ cartItems, addToCart, clearCart, removeCartItem }}>
// //       {children}
// //     </CartContext.Provider>
// //   );
// // };

// // export const useCart = () => useContext(CartContext);



// // import React, { createContext, useState, useContext } from 'react';

// // interface CartItem {
// //   box_quantity: number;
// //   item_marks: string;
// //   vakal_no: string;
// //   vakkal_no: string;
// //   item_id: number;
// //   item_name: string;
// //   lot_no: string;
// //   available_qty: number;
// //   unit_name: string;
// //   quantity: number;
// //   customerID?: number | string;
// //   original_available_qty?: number; // New field to store original quantity
// // }

// // interface CartContextType {
// //   cartItems: CartItem[];
// //   addToCart: (item: CartItem) => void;
// //   clearCart: () => void;
// //   removeCartItem: (item: CartItem) => void;
// //   updateQuantitiesAfterOrder: (orderItems: CartItem[]) => void; // New method
// // }

// // const CartContext = createContext<CartContextType>({
// //   cartItems: [],
// //   addToCart: () => {},
// //   clearCart: () => {},
// //   removeCartItem: () => {},
// //   updateQuantitiesAfterOrder: () => {}
// // });

// // export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
// //   const [cartItems, setCartItems] = useState<CartItem[]>([]);

// //   const addToCart = (item: CartItem) => {
// //     console.log('Adding to cart:', JSON.stringify(item, null, 2));
// //     setCartItems(prevItems => {
// //       // Check if item already exists
// //       const existingItemIndex = prevItems.findIndex(
// //         cartItem => cartItem.lot_no === item.lot_no
// //       );

// //       if (existingItemIndex > -1) {
// //         // Update quantity if item exists
// //         const updatedItems = [...prevItems];
// //         updatedItems[existingItemIndex] = {
// //           ...updatedItems[existingItemIndex],
// //           quantity: updatedItems[existingItemIndex].quantity + item.quantity,
// //           // Store original available quantity when first added to cart
// //           original_available_qty: updatedItems[existingItemIndex].original_available_qty 
// //             || updatedItems[existingItemIndex].available_qty
// //         };
// //         return updatedItems;
// //       }

// //       // Add new item if it doesn't exist, storing original available quantity
// //       return [...prevItems, {
// //         ...item,
// //         original_available_qty: item.available_qty
// //       }];
// //     });
// //   };

// //   const clearCart = () => {
// //     setCartItems([]);
// //   };

// //   const removeCartItem = (itemToRemove: CartItem) => {
// //     setCartItems(prevItems => 
// //       prevItems.filter(item => item.lot_no !== itemToRemove.lot_no)
// //     );
// //   };

// //   const updateQuantitiesAfterOrder = (orderItems: CartItem[]) => {
// //     setCartItems(prevItems => {
// //       // Create a copy of previous items to modify
// //       const updatedItems = [...prevItems];

// //       // Update quantities for ordered items
// //       orderItems.forEach(orderedItem => {
// //         const itemIndex = updatedItems.findIndex(
// //           item => item.lot_no === orderedItem.lot_no
// //         );

// //         if (itemIndex !== -1) {
// //           // Reduce available quantity by the ordered quantity
// //           updatedItems[itemIndex] = {
// //             ...updatedItems[itemIndex],
// //             available_qty: (updatedItems[itemIndex].original_available_qty || updatedItems[itemIndex].available_qty) 
// //               - orderedItem.quantity
// //           };
// //         }
// //       });

// //       return updatedItems;
// //     });

// //     // Clear the cart after order placement
// //     clearCart();
// //   };

// //   return (
// //     <CartContext.Provider 
// //       value={{ 
// //         cartItems, 
// //         addToCart, 
// //         clearCart, 
// //         removeCartItem,
// //         updateQuantitiesAfterOrder 
// //       }}
// //     >
// //       {children}
// //     </CartContext.Provider>
// //   );
// // };

// // export const useCart = () => useContext(CartContext);

// import React, { createContext, useState, useContext } from 'react';

// interface CartItem {
//   box_quantity: number;
//   item_marks: string;
//   vakal_no: string;
//   vakkal_no: string;
//   item_id: number;
//   item_name: string;
//   lot_no: string;
//   available_qty: number;
//   unit_name: string;
//   quantity: number;
//   customerID?: number | string;
//   original_available_qty?: number;
// }

// interface CartContextType {
//   cartItems: CartItem[];
//   addToCart: (item: CartItem) => void;
//   clearCart: () => void;
//   removeCartItem: (item: CartItem) => void;
//   updateQuantitiesAfterOrder: (orderItems: CartItem[]) => void;
//   // Optional: Add a method to update individual item quantity
//   updateItemQuantity: (item: CartItem, newQuantity: number) => void;
// }

// const CartContext = createContext<CartContextType>({
//   cartItems: [],
//   addToCart: () => {},
//   clearCart: () => {},
//   removeCartItem: () => {},
//   updateQuantitiesAfterOrder: () => {},
//   updateItemQuantity: () => {}
// });

// export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   const addToCart = (item: CartItem) => {
//     setCartItems(prevItems => {
//       // Check if item already exists by lot_no
//       const existingItemIndex = prevItems.findIndex(
//         cartItem => cartItem.lot_no === item.lot_no
//       );

//       if (existingItemIndex > -1) {
//         const updatedItems = [...prevItems];
//         updatedItems[existingItemIndex] = {
//           ...updatedItems[existingItemIndex],
//           quantity: updatedItems[existingItemIndex].quantity + item.quantity,
//           original_available_qty: updatedItems[existingItemIndex].original_available_qty 
//             || updatedItems[existingItemIndex].available_qty
//         };
//         return updatedItems;
//       }

//       // Add new item with original available quantity
//       return [...prevItems, {
//         ...item,
//         original_available_qty: item.available_qty
//       }];
//     });
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   const removeCartItem = (itemToRemove: CartItem) => {
//     setCartItems(prevItems => 
//       prevItems.filter(item => item.lot_no !== itemToRemove.lot_no)
//     );
//   };

//   const updateQuantitiesAfterOrder = (orderItems: CartItem[]) => {
//     setCartItems(prevItems => {
//       const updatedItems = [...prevItems];

//       orderItems.forEach(orderedItem => {
//         const itemIndex = updatedItems.findIndex(
//           item => item.lot_no === orderedItem.lot_no
//         );

//         if (itemIndex !== -1) {
//           updatedItems[itemIndex] = {
//             ...updatedItems[itemIndex],
//             available_qty: (
//               updatedItems[itemIndex].original_available_qty || 
//               updatedItems[itemIndex].available_qty
//             ) - orderedItem.quantity
//           };
//         }
//       });

//       return updatedItems;
//     });

//     clearCart();
//   };

//   // New method to update individual item quantity
//   const updateItemQuantity = (item: CartItem, newQuantity: number) => {
//     setCartItems(prevItems => 
//       prevItems.map(cartItem => 
//         cartItem.lot_no === item.lot_no 
//           ? { ...cartItem, quantity: newQuantity }
//           : cartItem
//       )
//     );
//   };

//   return (
//     <CartContext.Provider 
//       value={{ 
//         cartItems, 
//         addToCart, 
//         clearCart, 
//         removeCartItem,
//         updateQuantitiesAfterOrder,
//         updateItemQuantity
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };


import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

const BACKEND_URL = "http://192.168.1.37:3000/sf";

interface CartItem {
  item_id: number;
  item_name: string;
  lot_no: string;
  available_qty: number;
  quantity: number;
  unit_name: string;
  vakal_no: string;
  item_marks: string;
  customerID?: number | string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeCartItem: (item: CartItem) => void;
  clearCart: () => void;
  updateCartItemQuantity: (item: CartItem, newQuantity: number) => void;
  updateCartItemsAfterOrder: (orderResponse: any) => void;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeCartItem: () => {},
  clearCart: () => {},
  updateCartItemQuantity: () => {},
  updateCartItemsAfterOrder: () => {}
});

export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: CartItem) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        cartItem => cartItem.lot_no === item.lot_no
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: Math.min(
            updatedItems[existingItemIndex].quantity + 1, 
            updatedItems[existingItemIndex].available_qty
          )
        };
        return updatedItems;
      }

      return [...prevItems, { ...item, quantity: 1 }];
    });
  }, []);

  const removeCartItem = useCallback((itemToRemove: CartItem) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.lot_no !== itemToRemove.lot_no)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const updateCartItemQuantity = useCallback((item: CartItem, newQuantity: number) => {
    setCartItems(prevItems => 
      prevItems.map(cartItem => 
        cartItem.lot_no === item.lot_no
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    );
  }, []);

  const updateCartItemsAfterOrder = useCallback((orderResponse: any) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        const matchingOrderItem = orderResponse.data.find(
          (orderedItem: any) => 
            orderedItem.LOT_NO === item.lot_no && 
            orderedItem.ITEM_ID === item.item_id
        );
  
        return matchingOrderItem 
          ? { 
              ...item, 
              available_qty: matchingOrderItem.NET_QUANTITY, // Use NET_QUANTITY here
              quantity: Math.min(item.quantity, matchingOrderItem.NET_QUANTITY) // Adjust quantity if needed
            }
          : item;
      }).filter(item => item.quantity > 0)
    );
  }, []);
  
  const contextValue = {
    cartItems,
    addToCart,
    removeCartItem,
    clearCart,
    updateCartItemQuantity,
    updateCartItemsAfterOrder
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);