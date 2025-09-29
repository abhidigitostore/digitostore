// lib/context/CartContext.tsx
'use client';

import React, { createContext, useReducer, useContext, useEffect, Dispatch } from 'react';

// 1. DEFINE THE TYPES
// Shape of a single item in the cart
interface CartItem {
  _id: string;
  title: string;
  price: number;
  imageUrl?: string;
  // Add any other properties your document object has
}

// Shape of the cart's state
interface CartState {
  cartItems: CartItem[];
}

// Shape of the actions you can dispatch
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { _id: string } }
  | { type: 'CLEAR_CART' };

// Shape of the context value
interface CartContextType {
  state: CartState;
  dispatch: Dispatch<CartAction>;
}


// 2. CREATE THE CONTEXT WITH A TYPE AND DEFAULT VALUE
const CartContext = createContext<CartContextType>({
  state: { cartItems: [] },
  dispatch: () => null, // A dummy function for the default value
});


// 3. DEFINE THE REDUCER WITH TYPES
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cartItems.find(
        (item: CartItem) => item._id === newItem._id
      );

      const cartItems = existItem
        ? state.cartItems
        : [...state.cartItems, newItem];
      
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cartItems };
    }
    case 'REMOVE_ITEM': {
      const itemToRemove = action.payload;
      const cartItems = state.cartItems.filter(
        (item: CartItem) => item._id !== itemToRemove._id
      );

      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cartItems };
    }
    case 'CLEAR_CART': {
      localStorage.removeItem('cartItems');
      return { ...state, cartItems: [] };
    }
    default:
      return state;
  }
};


// 4. DEFINE THE PROVIDER COMPONENT WITH TYPED PROPS
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const initialState: CartState = {
    cartItems: [],
  };

  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem('cartItems');
      if (storedItems) {
        const items: CartItem[] = JSON.parse(storedItems);
        items.forEach((item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item }));
      }
    } catch (error) {
      console.error("Failed to parse cart items from localStorage", error);
      localStorage.removeItem('cartItems');
    }
  }, []);

  // 5. FIX THE JSX SYNTAX
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};


// 6. CREATE THE CUSTOM HOOK
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};