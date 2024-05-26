import { createSlice } from "@reduxjs/toolkit";

// Initial state from local storage, if available
const storedCart = JSON.parse(localStorage.getItem("cart"));
const initialState = { cart: storedCart || [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      state.cart.push(action.payload);
      // Save to local storage after adding an item
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    deleteItem(state, action) {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
      // Save to local storage after deleting an item
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    increaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.id === action.payload);
      item.item_quantity++;
      item.totalPrice = item.item_quantity * item.item_price;
      // Save to local storage after updating quantity
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    decreaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.id === action.payload);
      item.item_quantity--;
      item.totalPrice = item.item_quantity * item.item_price;
      if (item.item_quantity === 0) {
        // If quantity reaches 0, delete the item
        state.cart = state.cart.filter((item) => item.id !== action.payload);
      }
      // Save to local storage after updating quantity or deleting
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    clearCart(state) {
      state.cart = [];
      // Save to local storage after clearing the cart
      localStorage.removeItem("cart");
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const getCart = (state) => state.cart.cart;

export const getTotalCartQuantity = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.item_quantity, 0);

export const getTotalCartPrise = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.item_price * item.item_quantity, 0);

export const getTotalCartWeight = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.item_weight * item.item_quantity, 0);

export const getCurrentQuantityById = (id) => (state) =>
  state.cart.cart.find((item) => item.id === id)?.item_quantity ?? 0;
