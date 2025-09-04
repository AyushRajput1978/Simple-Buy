import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, CartState } from 'type';

const initialState: CartState = {
  cart: [],
};
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    cartItemsSet: (state, action: PayloadAction<CartItem[]>) => {
      state.cart = action.payload;
    },
  },
});
export const { cartItemsSet } = cartSlice.actions;
export default cartSlice.reducer;
