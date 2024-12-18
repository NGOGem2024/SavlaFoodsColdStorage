import React, { createContext, useContext, useState } from 'react';

interface CartItem {
<<<<<<< HEAD
  customerID: number | string;
  lot_no: string;
=======
  box_quantity: number;
  item_marks: string;
  vakal_no: string;
  vakkal_no: string;
>>>>>>> 30e18c0fcd6fbb8dde0968d9c5e9358259bc5766
  item_id: number;
  item_name: string;
  vakal_no: string;
  item_marks: string;
  unit_name: string;
  box_quantity: number;
  available_qty: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeCartItem: (item: CartItem) => void;
  clearCart: () => void;
  updateAvailableQuantities: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
<<<<<<< HEAD
    setCartItems(prev => {
      const existingItem = prev.find(i => i.lot_no === item.lot_no);
      if (existingItem) {
        return prev.map(i =>
          i.lot_no === item.lot_no ? { ...i, quantity: item.quantity } : i
        );
=======

    console.log('Adding to cart:', JSON.stringify(item, null, 2));
    setCartItems(prevItems => {
      // Check if item already exists
      const existingItemIndex = prevItems.findIndex(
        cartItem => cartItem.lot_no === item.lot_no
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity
        };
        return updatedItems;
>>>>>>> 30e18c0fcd6fbb8dde0968d9c5e9358259bc5766
      }
      return [...prev, item];
    });
  };

  const removeCartItem = (item: CartItem) => {
    setCartItems(prev => prev.filter(i => i.lot_no !== item.lot_no));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateAvailableQuantities = (items: CartItem[]) => {
    setCartItems(prev => 
      prev.map(cartItem => {
        const updatedItem = items.find(i => i.lot_no === cartItem.lot_no);
        return updatedItem ? { ...cartItem, available_qty: updatedItem.available_qty } : cartItem;
      })
    );
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeCartItem,
      clearCart,
      updateAvailableQuantities
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};