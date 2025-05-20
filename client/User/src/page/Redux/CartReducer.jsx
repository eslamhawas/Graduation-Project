export const CartReducer = (state = { cart: [] }, action) => 
     {
  switch (action.type) {
    case "ADD_TO_CART":
      const exist = state.cart.find((item) => item.id === action.payload.id);
      if (exist) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, qty: item.qty + action.payload.qty }
              : item
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, qty: action.payload.qty || 1 }],
        };
      }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((c) => c.id !== action.payload.id),
      };
      case "UPDATE_QUANTITY":
  return {
    ...state,
    cart: state.cart.map(item =>
      item.id === action.payload.id
        ? { ...item, quantity: action.payload.quantity }
        : item
    )
  };

    default:
      return state;
  }
  
};
