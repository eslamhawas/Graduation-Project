import axios from "axios";

import {
  CART_ADD_ITEM,
  CART_GET_ALL_ITEM,
  CART_GET_ALL_ITEM_FAIL,
  CART_GET_ALL_ITEM_LOADING,
  CART_GET_ALL_ITEM_SUCCESS,
  CART_ITEMS_UPDATE_ALL_ITEMS,
  CART_ITEMS_UPDATE_ALL_ITEMS_FAIL,
  CART_ITEMS_UPDATE_ALL_ITEMS_LOADING,
  CART_ITEMS_UPDATE_ALL_ITEMS_SUCCESS,
  CART_REMOVE_ITEM,
  CART_REMOVE_ITEM_FAIL,
  UPDATE_ITEMS_PRICE_WITH_DISCOUNT,
} from "../constants/Cart.constants";
import { API_BASE_URL } from "../baseApiUrlConfig";

export const addToCart = (id, quantity) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/products/${id}`);
    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        id: data._id,
        name: data.name,
        brand: data.brand,
        image: data.image,
        price: data.price,
        quantity: quantity,
      },
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().shoppingCarts.cartItems)
    );
    localStorage.setItem(
      "numberOfCartItems",
      JSON.stringify(getState().shoppingCarts.cartItems.length)
    );
  } catch (err) {
    dispatch({
      // type: PRODUCT_LIST_FAIL,
      payload:
        err.response && err.response.data ? err.response.data : err.message,
    });
  }
};

export const removeFromCart = (cartItemId) => async (dispatch, getState) => {
  try {
    const {
      token,
      userValid: { _id },
    } = JSON.parse(localStorage.getItem("userInformation"));
    const userId = _id;

    dispatch({
      type: CART_REMOVE_ITEM,
      payload: cartItemId,
    });

    

    await axios.delete(`${API_BASE_URL}/cart/${userId}/${cartItemId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().shoppingCarts.cartItems)
    );
    localStorage.setItem(
      "numberOfCartItems",
      JSON.stringify(getState().shoppingCarts.cartItems.length)
    );
  } catch (err) {
    dispatch({
      type: CART_REMOVE_ITEM_FAIL,
      payload:
        err.response && err.response.data ? err.response.data : err.message,
    });
  }
};

export const getAllCartItems = () => async (dispatch, getState) => {
  try {
    const { userInformation } = getState().userLogin;
    if (!userInformation) {
      dispatch({
        type: CART_GET_ALL_ITEM_SUCCESS,
        payload: [],
      });
      return;
    }
    const {
      token,
      userValid: { _id },
    } = JSON.parse(localStorage.getItem("userInformation"));
    const userId = _id;

    dispatch({
      type: CART_GET_ALL_ITEM_LOADING,
    });

    // Fetch all cart items
    const cartItems = await axios.get(`${API_BASE_URL}/cart/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let cartItemsWithDetails = [];
    // Use Promise.all to wait for all product details to be fetched
    if (cartItems.data.length > 0) {
      cartItemsWithDetails = await Promise.all(
        cartItems.data.map(async (item, i) => {
          const productDeatils = await axios.get(
            `${API_BASE_URL}/products/${item.productId}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          item.productDeatils = productDeatils.data;
          return item; // Return the item with the details
        })
      );
    }

    // Dispatch the action after all details are fetched
    dispatch({
      type: CART_GET_ALL_ITEM_SUCCESS,
      payload: cartItemsWithDetails,
    });

    // console.log(cartItemsWithDetails);

    if (cartItems.data.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItemsWithDetails));
      localStorage.setItem(
        "totalPrice",
        JSON.stringify(
          cartItemsWithDetails[cartItemsWithDetails.length - 1].totalPrice
        )
      );
      localStorage.setItem(
        "numberOfCartItems",
        JSON.stringify(cartItemsWithDetails.length)
      );
    }
  } catch (err) {
    dispatch({
      type: CART_GET_ALL_ITEM_FAIL,
      payload:
        err.response && err.response.data ? err.response.data : err.message,
    });
  }
};

export const updateItemsPriceWithDiscount =
  (discount) => async (dispatch, getState) => {
    try {

      // SET oldItemsPrice before modify price with discount
      localStorage.setItem("oldItemsPrice", JSON.stringify(getState().shoppingCarts.itemsPrice));

      dispatch({
        type: UPDATE_ITEMS_PRICE_WITH_DISCOUNT,
        payload: {
          itemsPrice:
            getState().shoppingCarts.itemsPrice -
            (getState().shoppingCarts.itemsPrice * discount) / 100,
          cartItems: getState().shoppingCarts.cartItems,
          discount,
        },
      });

      localStorage.setItem("discount", JSON.stringify(discount));
    } catch (err) {
      dispatch({
        type: CART_GET_ALL_ITEM_FAIL,
        payload:
          err.response && err.response.data ? err.response.data : err.message,
      });
    }
  };

// export const updateAllCartItemsWithCoupon = (discount) => async (dispatch) => {
//   try {
//     dispatch({
//       type: CART_ITEMS_UPDATE_ALL_ITEMS_LOADING,
//     });

//     const {
//       token,
//       userValid: { _id },
//     } = JSON.parse(localStorage.getItem("userInformation"));
//     const userId = _id;

//     dispatch({
//       type: CART_GET_ALL_ITEM_LOADING,
//     });

//     // Fetch all cart items
//     const cartItems = await axios.get(`${API_BASE_URL}/cart/${userId}`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     let cartItemsUpdated = [];
//     cartItemsUpdated = await Promise.all(
//       cartItems.data.map(async (item) => {
//         item.totalPrice -= (item.totalPrice * discount) / 100;
//         const updatedItem = await ShoppingCartItemModel.findById(item._id);
//         updatedItem.save();
//         return updatedItem;
//       })
//     );

//     dispatch({
//       type: CART_ITEMS_UPDATE_ALL_ITEMS_SUCCESS,
//       payload: cartItemsUpdated,
//     });
//   } catch (err) {
//     dispatch({
//       type: CART_ITEMS_UPDATE_ALL_ITEMS_FAIL,
//       payload:
//         err.response && err.response.data ? err.response.data : err.message,
//     });
//   }
// };
