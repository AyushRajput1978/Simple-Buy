// redux/slices/toastSlice.js
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface toastState {
  show: boolean;
  message: string;
  success: boolean;
}

const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    show: false,
    message: '',
    success: true,
  },
  reducers: {
    showToast: (state, action: PayloadAction<toastState>) => {
      state.show = true;
      state.message = action.payload.message;
      state.success = action.payload.success;
    },
    hideToast: (state) => {
      state.show = false;
      state.message = '';
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
