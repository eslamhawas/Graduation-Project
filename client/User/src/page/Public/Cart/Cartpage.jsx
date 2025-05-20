import React from 'react';
import { useCart } from '../../Context/Cartcontext';
import Cart from './cart';

const CartPage = () => {
  const { cart = [], dispatch } = useCart(); 

  const handleDelete = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
  };

  const handleDeleteAll = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const handleQuantityChange = (id, newQuantity) => {
    dispatch({ 
      type: "UPDATE_QUANTITY", 
      payload: { id, qty: Math.max(1, newQuantity) }
    });
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      console.log('Proceeding to checkout with:', cart);
    }
  };

  return (
    <Cart
      cartItems={cart || []} 
      onDelete={handleDelete}
      onDeleteAll={handleDeleteAll}
      onQuantityChange={handleQuantityChange}
      onCheckout={handleCheckout}
    />
  );
};

export default CartPage;