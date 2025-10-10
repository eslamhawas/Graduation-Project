import {
  CART_ADD_ITEM,
  // CART_GET_ALL_ITEM,
  CART_GET_ALL_ITEM_FAIL,
  CART_GET_ALL_ITEM_LOADING,
  CART_GET_ALL_ITEM_SUCCESS,
  CART_REMOVE_ITEM,
  UPDATE_ITEMS_PRICE_WITH_DISCOUNT,
} from "../constants/Cart.constants";

export const CartsReducer = (
  state = { cartItems: [], itemsPrice: 0 ,  },
  action
) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const alreadyExist = state.cartItems.find(
        (x) => x.id === action.payload.id
      );

      if (alreadyExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.id === alreadyExist.id ? action.payload : x
          ),
        };
      } else {
        return { ...state, cartItems: [...state.cartItems, action.payload] };
      }

    case CART_REMOVE_ITEM:
      const removedItem = state.cartItems.find((x) => x._id === action.payload);
      const removedItemPrice = removedItem.totalPrice;

      return {
        ...state, // to ensure you carry over any other properties in the state
        cartItems: state.cartItems.filter((x) => x._id !== action.payload),
        itemsPrice: state.discount
          ? state.itemsPrice -
            (removedItemPrice - (state.discount / 100) * removedItemPrice)
          : state.itemsPrice - removedItemPrice,
        itemsCount: state.itemsCount - 1, // decrement the count

        oldItemsPrice: state.discount
          ? state.oldItemsPrice -
            removedItemPrice.totalPrice * (state.discount / 100)
          : state.oldItemsPrice - removedItemPrice.totalPrice,
      };

    case CART_GET_ALL_ITEM_LOADING:
      return {
        ...state,
        loading: true,
        cartItems: [],
      };

    case CART_GET_ALL_ITEM_SUCCESS:
      const cartItems = action.payload;
      let itemsPriceTemp = 0;
      cartItems.map((item) => (itemsPriceTemp += item.totalPrice));
      return {
        ...state,
        loading: false,
        cartItems: action.payload,

        itemsPrice: itemsPriceTemp,
        itemsCount: cartItems.length,
      };

    case UPDATE_ITEMS_PRICE_WITH_DISCOUNT:
      return {
        loading: false,
        cartItems: action.payload.cartItems,
        // PREV ITEMS PRICE : BEFORE DISCOUNT
        oldItemsPrice: state.itemsPrice,
        discount: action.payload.discount,
        //
        itemsPrice: action.payload.itemsPrice,
        itemsCount: action.payload.cartItems.length,
      };

    case CART_GET_ALL_ITEM_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    // case SAVE_SHIPPING_ADDRESS:
    //   return {
    //     ...state,
    //     shippingInformation: action.payload,
    //   };

    // case SAVE_PAYMENT_METHOD:
    //   return {
    //     ...state,
    //     paymentMethod: action.payload,
    //   };

    default:
      return state;
  }
};
