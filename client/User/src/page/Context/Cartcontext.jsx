import React, { createContext, useReducer, useContext } from "react";
import { CartReducer } from "../Redux/CartReducer";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const initialState = {
    cart: [],
  };

  const [state, dispatch] = useReducer(CartReducer, initialState);

  return (
    <CartContext.Provider value={{ cart: state.cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

