import React, { createContext, useCallback, useContext, useState } from 'react';
 
const BACKEND_URL = "http://192.168.1.3:3000/sf";
 
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
          quantity: item.quantity
         
        };
        return updatedItems;
      }
 
      return [...prevItems, item];
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
 