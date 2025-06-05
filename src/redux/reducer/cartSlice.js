import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  cart: [],
};
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    cartItemsSet: (state, action) => {
      state.cart = action.payload;
    },
  },
});
export const { cartItemsSet } = cartSlice.actions;
export default cartSlice.reducer;
